import "./styles/global.css";
import {
  ACCORDION_TYPES,
  AccordionTypes,
} from "./components/functionalities/models/accordion.model";
import { Accordion, AccordionItem } from "@nextui-org/react";

import "leaflet/dist/leaflet.css";

import { useContext, useEffect, useState } from "react";
import { Location } from "./models/location.model";
import { SocketContext } from "./contexts/WebSocket";
import {} from "react-daisyui";
import LocationHistory from "./components/functionalities/LocationHistory/LocationHistory";
import "react-dates/initialize";
import "react-dates/lib/css/_datepicker.css";
import useIncorrectPassowrd from "./components/functionalities/IncorrectPassword/useIncorrectPassword";
import { DeviceCurrentLocation } from "./models/location.model";

import IncorrectPassword from "./components/functionalities/IncorrectPassword/IncorrectPassword";
import { Point } from "./models/location.model";
import Map from "./components/Map";
const App = (): JSX.Element => {
  const { webSocket, addCallback } = useContext(SocketContext);
  const [locations, setLocation] = useState<DeviceCurrentLocation>();
  const [currFcm, setFcm] = useState<string>("");
  const [accordionType, setAccordionClicked] = useState<AccordionTypes>();
  const [locationPoints, setLocationPoints] = useState<Point[] | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  useEffect(() => {
    addCallback((event: any) => {
      const data = JSON.parse(event.data);

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
      await fetch(`${process.env.REACT_APP_HTTP_PROXY_SERVER}/locations`, {
        method: "GET",
        credentials: "include",
      }).then((res) => res.json());
    };

    webSocket.onerror = (error: any) => {
      console.error("WebSocket Error: ", error);
    };

    startTrackingLocation();
  }, [webSocket]);

  return (
    <div className="admin_panel">
      {currFcm && (
        <div className="sidePanel">
          <h2 className="p-5">{locations![currFcm].full_brand}</h2>
          <Accordion>
            <AccordionItem
              key="1"
              aria-label="Accordion 1"
              title="Сгрешени пароли"
              style={{
                borderTop: "2px solid black",
              }}
              onPress={() => {
                setAccordionClicked(ACCORDION_TYPES.IncorrectPassword);
              }}
            >
              <IncorrectPassword imagePaths={imagePaths} currFcm={currFcm} />
            </AccordionItem>

            <AccordionItem
              key="2"
              aria-label="Accordion 3"
              title="Исотиря на местоположение"
              style={{
                borderTop: "2px solid black",
                borderBottom: "2px solid black",
              }}
              onPress={() => {
                setAccordionClicked(ACCORDION_TYPES.Location);
              }}
            >
              <LocationHistory
                currFcm={currFcm}
                accordionType={accordionType}
                locationPoints={locationPoints}
                setLocationPoints={setLocationPoints}
              />
            </AccordionItem>
            <AccordionItem
              key="3"
              aria-label="Accordion 2"
              title="Исотиря на включване"
              style={{
                borderBottom: "2px solid black",
              }}
            ></AccordionItem>
          </Accordion>
        </div>
      )}
      <Map
        locations={locations}
        locationPoints={locationPoints}
        setFcm={setFcm}
        setImagePaths={setImagePaths}
      />
    </div>
  );
};

export default App;
