import "./styles/global.css";
import { Accordion, AccordionItem, image } from "@nextui-org/react";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { icon } from "leaflet";
import { useContext, useEffect, useState } from "react";
import { Location } from "./models/location.model";
import { SocketContext } from "./contexts/WebSocket";
import {} from "react-daisyui";
import IncorrectPassword from "./components/functionalities/IncorrectPassword/IncorrectPassword";
import useIncorrectPassowrd from "./components/functionalities/IncorrectPassword/useIncorrectPassword";
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
  const [currFcm, setFcm] = useState<string>("");

  const { imagePaths, retrieveImages } = useIncorrectPassowrd();

  return (
    <div style={{ display: "flex", justifyContent: "flex-end" }}>
      {currFcm && (
        <div style={{ width: "30vw", background: "#ededed" }}>
          <h2 className="p-5">{locations![currFcm].full_brand}</h2>
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title="Сгрешени пароли"
              style={{
                borderTop: "2px solid black",
              }}
            >
              <IncorrectPassword imagePaths={imagePaths} currFcm={currFcm} />
            </AccordionItem>
            <AccordionItem
              key="2"
              aria-label="Accordion 2"
              title="Исотиря на включване"
              style={{
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
              }}
            ></AccordionItem>

            <AccordionItem
              key="3"
              aria-label="Accordion 3"
              title="Исотиря на местоположение"
              style={{
                borderBottom: "2px solid black",
              }}
            ></AccordionItem>
          </Accordion>
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
