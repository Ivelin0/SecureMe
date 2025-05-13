import mobileOnlineImage from "../assets/mobiles.png";
import mobileOfflineImage from "../assets/mobileOffline.png";
import useIncorrectPassowrd from "../components/functionalities/IncorrectPassword/useIncorrectPassword";
import { DeviceCurrentLocation, Location } from "../models/location.model";

import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
  Polyline,
  Popup,
} from "react-leaflet";
import { icon } from "leaflet";
import * as L from "leaflet";
import { Point } from "../models/location.model";
import * as geolib from "geolib";
import { useState, useEffect } from "react";
import { group } from "console";

const ComponentResize = () => {
  const map = useMap();

  setTimeout(() => {
    map.invalidateSize();
  }, 0);

  return null;
};

const circleOptions = {
  radius: 8,
  fillColor: "blue",
  color: "darkblue",
  weight: 1,
  opacity: 1,
  fillOpacity: 0.8,
};

const ICON = icon({
  iconUrl: "./mobiles.png",
  iconSize: [62, 62],
});

const offlineIcon = icon({
  iconUrl: "./mobileOffline.png",
  iconSize: [62, 62],
});

const MultipleDevicesIcon = icon({
  iconUrl: "./multiple_devices.png",
  iconSize: [90, 90],
});

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const Map = ({
  locations,
  locationPoints,
  setFcm,
  setImagePaths,
}: {
  locations: DeviceCurrentLocation | [];
  locationPoints: Point[] | null;
  setFcm: any;
  setImagePaths: any;
}) => {
  const { retrieveImages } = useIncorrectPassowrd({ setImagePaths });
  const [displayDevices, setDisplayDevices] = useState<any>();
  const DIFF = 50;

  const distanceBetweenDevices = (group, point) => {
    const center = geolib.getCenterOfBounds(group);
    const distance = geolib.getDistance(
      { latitude: point.latitude, longitude: point.longitude },
      center
    );
    return distance;
  };

  const getGroupedDevices = (
    takenPoints,
    locations,
    isTaken: Array<boolean>,
    { currGroup = [] }: { currGroup?: any; distance?: number } = {},
    groups: Point[][] = []
  ) => {
    if (takenPoints.length === locations.length) {
      return [...groups, currGroup];
    }

    for (let i = 0; i < locations.length; i++) {
      if (!isTaken[i]) {
        const nextPoint = locations[i];

        let distance =
          currGroup?.length === 0
            ? 0
            : distanceBetweenDevices(currGroup, nextPoint);
        if (distance < DIFF) {
          isTaken[i] = true;
          const newGroup = getGroupedDevices(
            [...takenPoints, nextPoint],
            locations,
            isTaken,
            { currGroup: [...currGroup, nextPoint], distance },
            groups
          );
          if (newGroup) return newGroup;
          isTaken[i] = false;
        }
      }
    }

    if (currGroup?.length) {
      return getGroupedDevices(takenPoints, locations, isTaken, currGroup, [
        ...groups,
        currGroup,
      ]);
    }

    return groups;
  };

  useEffect(() => {
    const getLastLocations = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/last_locations`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => res.json());

      const locations = response.message;

      if (locations.filter((location) => location.latitude).length == 0) return;
      const groupedDevices = getGroupedDevices(
        [],
        Object.keys({
          ...locations.filter((location) => location.latitude !== undefined),
        }).map((el) => ({
          fcm_token: el,
          ...locations![el],
          isOnline: false,
        })),
        new Array<boolean>(Object.keys(locations!).length).fill(false)
      );

      setDisplayDevices(() => [...groupedDevices]);
    };

    getLastLocations();
  }, []);

  useEffect(() => {
    if (!locations) return;

    setDisplayDevices(() => {
      const groupedDevices = getGroupedDevices(
        [],
        Object.keys({ ...locations }).map((el) => ({
          fcm_token: el,
          ...locations[el],
        })),
        new Array<boolean>(Object.keys(locations).length).fill(false)
      );

      return groupedDevices;
    });
  }, [locations]);

  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <MapContainer
      className="mapContainer"
      center={[42.7249925, 25.4833039]}
      attributionControl={true}
      zoom={8}
      minZoom={3}
      scrollWheelZoom={true}
    >
      <ComponentResize />
      <TileLayer
        zIndex={0}
        url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391"
      />

      {displayDevices &&
        displayDevices.map((group, idx) => {
          if (group.length === 0) return;
          const center = geolib.getCenterOfBounds(
            group.map(({ latitude, longitude }) => ({ latitude, longitude }))
          );

          return group.length === 1 ? (
            <Marker
              icon={group[0].isOnline ? ICON : offlineIcon}
              position={[group[0].latitude, group[0].longitude]}
              eventHandlers={{
                click: () => {
                  if (!group[0].isOnline) return;
                  setFcm(() => {
                    retrieveImages(group[0].fcm_token);

                    return group[0].fcm_token;
                  });
                },
              }}
            />
          ) : (
            <Marker
              icon={MultipleDevicesIcon}
              position={[center.latitude, center.longitude]}
              eventHandlers={{
                click: (props) => {
                  if (!group[0].isOnline) return;
                  setIsPopupOpen(!isPopupOpen);
                },
              }}
            >
              {true && (
                <Popup className="p-8">
                  <div className="flex justify-center">
                    {group.map((device, j) => {
                      return (
                        <img
                          onClick={() => {
                            setFcm(() => {
                              retrieveImages(
                                group[j][Object.keys(group[j])[idx]]
                              );
                              return group[j][Object.keys(group[j])[idx]];
                            });
                          }}
                          src={
                            device.isOnline
                              ? mobileOnlineImage
                              : mobileOfflineImage
                          }
                        />
                      );
                    })}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      {locationPoints &&
        Object.values(locationPoints).map((point: Point) => {
          const { latitude, longitude } = point;

          return (
            <CircleMarker center={[latitude, longitude]} {...circleOptions} />
          );
        })}

      {locationPoints && (
        <Polyline
          positions={locationPoints?.map((point) => {
            return [point.latitude, point.longitude];
          })}
        ></Polyline>
      )}
    </MapContainer>
  );
};

export default Map;
