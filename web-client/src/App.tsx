import "./styles/global.css";
import { Image, useDisclosure } from "@nextui-org/react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { icon } from "leaflet";
import { useContext, useEffect, useState } from "react";
import { Location } from "./models/location.model";
import { SocketContext } from "./contexts/WebSocket";
import {} from "react-daisyui";
const ICON = icon({
  iconUrl: "./mobiles.png",
  iconSize: [62, 62],
});
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
const ComponentResize = () => {
  const map = useMap();

  setTimeout(() => {
    map.invalidateSize();
  }, 0);

  return null;
};
const App = (): JSX.Element => {
  const { webSocket, addCallback } = useContext(SocketContext);
  const [locations, setLocation] = useState<{ [key: string]: Location }>();
  useEffect(() => {
    addCallback((event: any) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.event != "locations") return;
      const { longitude, latittude, fcm_token, full_brand } = data.message;

      setLocation((prev) => {
        return { ...prev, [fcm_token]: { longitude, latittude, full_brand } };
      });
    });
  }, []);
  useEffect(() => {
    if (!webSocket) return;

    const startTrackingLocation = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/locations`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => res.json());
    };

    webSocket.onerror = (error: any) => {
      console.error("WebSocket Error: ", error);
    };

    startTrackingLocation();
  }, [webSocket]);

  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [currFcm, setFcm] = useState<string>("");
  const retrieveImages = async (fcm_token: string) => {
    const response = await fetch(`http://localhost:8000/images/${fcm_token}`, {
      method: "GET",
      credentials: "include",
    }).then((res) => res.json());
    setImagePaths(response.images);
  };

  const displayDate = (value: string) => {
    const timestamp = value.slice(0, -4).split("-")[1];
    console.log("timestamp", timestamp);
    const date = new Date(parseInt(timestamp));
    const formattedDate = date.toLocaleDateString("bg-BG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    return formattedDate;
  };

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {currFcm && (
        <div style={{ width: "30vw", background: "#ededed" }}>
          <h2 className="p-5">{locations![currFcm].full_brand}</h2>
          <hr />
          {imagePaths?.length ? (
            <>
              <h3 className="text-center">Снимка при сгрешена парола</h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-around",
                }}
              >
                {index > 0 ? (
                  <button
                    style={{
                      border: "2px solid black",
                      borderRadius: "20px",
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={() => setIndex((prev) => prev - 1)}
                  >
                    {"<"}
                  </button>
                ) : (
                  <></>
                )}

                <Image
                  width={300}
                  alt="NextUI hero Image"
                  src={`http://localhost:8000/images/${currFcm}/${imagePaths[index]}`}
                  onClick={() => {
                    window.open(
                      `http://localhost:8000/images/${currFcm}/${imagePaths[index]}`,
                      "_blank"
                    );
                  }}
                />

                {index < imagePaths.length - 1 ? (
                  <button
                    style={{
                      border: "2px solid black",
                      borderRadius: "20px",
                      width: "40px",
                      height: "40px",
                    }}
                    onClick={() => setIndex((prev) => prev + 1)}
                  >
                    {">"}
                  </button>
                ) : (
                  <h1></h1>
                )}
              </div>{" "}
              <p className="text-center">
                Дата на снимане: {displayDate(imagePaths[index])}
              </p>
            </>
          ) : (
            <p>Няма данни за сгрешени пароли вмомента</p>
          )}
        </div>
      )}
      <MapContainer
        style={{
          height: "100vh",
          width: "75vw",
        }}
        center={[42.7249925, 25.4833039]}
        attributionControl={true}
        zoom={8}
        minZoom={3}
        scrollWheelZoom={true}
      >
        <ComponentResize />
        <TileLayer url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391" />
        {locations &&
          Object.values(locations).map((location: any, idx: number) => {
            console.log(location);
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
      </MapContainer>
    </div>
  );
};

export default App;
