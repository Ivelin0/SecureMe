import useIncorrectPassowrd from "../components/functionalities/IncorrectPassword/useIncorrectPassword";
import { DeviceCurrentLocation } from "../models/location.model";

import {
  MapContainer,
  TileLayer,
  Marker,
  CircleMarker,
  useMap,
  Polyline,
} from "react-leaflet";
import { icon } from "leaflet";
import * as L from "leaflet";
import { Point } from "../models/location.model";

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
  locations: DeviceCurrentLocation | undefined;
  locationPoints: Point[] | null;
  setFcm: any;
  setImagePaths: any;
}) => {
  const { retrieveImages } = useIncorrectPassowrd({ setImagePaths });

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
      {locations &&
        Object.values(locations).map((location: any, idx: number) => {
          return (
            <>
              <Marker
                icon={ICON}
                position={[location.latittude, location.longitude]}
                eventHandlers={{
                  click: () => {
                    setFcm(() => {
                      console.log(locations[Object.keys(locations)[idx]]);
                      retrieveImages(Object.keys(locations)[idx]);
                      return Object.keys(locations)[idx];
                    });
                  },
                }}
              />
            </>
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
