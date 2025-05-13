import "./styles/global.css";
import {
  ACCORDION_TYPES,
  AccordionTypes,
} from "./components/functionalities/models/accordion.model";
import { Accordion, AccordionItem } from "@nextui-org/react";

import "leaflet/dist/leaflet.css";

import { useContext, useEffect, useState } from "react";
import { SocketContext } from "./contexts/WebSocket";
import {} from "react-daisyui";
import LocationHistory from "./components/functionalities/LocationHistory/LocationHistory";

import { DeviceCurrentLocation } from "./models/location.model";

import IncorrectPassword from "./components/functionalities/IncorrectPassword/IncorrectPassword";
import BootHistory from "./components/functionalities/BootHistory/BootHistory";
import { Point } from "./models/location.model";
import Map from "./components/Map";

import Empty from "./components/allDevices";
import SecureMeLogo from "./assets/SecureMe.png";
const App = (): JSX.Element => {
  const { webSocket, addWSCallback } = useContext(SocketContext);
  const [locations, setLocation] = useState<DeviceCurrentLocation | []>([]);
  const [currFcm, setFcm] = useState<string>("");
  const [accordionType, setAccordionClicked] = useState<AccordionTypes>();
  const [locationPoints, setLocationPoints] = useState<Point[] | null>(null);
  const [imagePaths, setImagePaths] = useState<string[]>([]);

  useEffect(() => {
    addWSCallback((event: any) => {
      const data = JSON.parse(event.data);

      if (data.event != "locations") return;

      const { longitude, latitude, fcm_token, full_brand } = data.message;

      setLocation((prev) => {
        return {
          ...prev,
          [fcm_token]: { longitude, latitude, full_brand, isOnline: true },
        };
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
    <>
      <div style={{ display: "flex", paddingLeft: "30px" }}>
        <img src={SecureMeLogo} style={{ height: "60px" }} />
        <p
          style={{
            fontSize: "30px",
            paddingTop: "10px",
            color: "grey",
            fontWeight: 500,
          }}
        >
          SecureMe
        </p>
      </div>

      <div className="admin_panel">
        <div className="sidePanel">
          <div
            style={{
              position: "relative",
              border: "2px solid #f0f3f9",
              height: "90vh",
              borderRadius: "20px",
              background: "#f0f3f9",
            }}
          >
            {currFcm ? (
              <>
                <h2 className="p-5" style={{ fontWeight: 400 }}>
                  {locations[currFcm]?.full_brand}
                </h2>
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
                      setLocationPoints(null);
                    }}
                  >
                    <IncorrectPassword
                      imagePaths={imagePaths}
                      currFcm={currFcm}
                    />
                  </AccordionItem>

                  <AccordionItem
                    key="2"
                    aria-label="Accordion 3"
                    title="История на местоположение"
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
                    title="История на включване"
                    style={{
                      borderBottom: "2px solid black",
                    }}
                    onPress={() => {
                      setAccordionClicked(ACCORDION_TYPES.Boot);
                      setLocationPoints(null);
                    }}
                  >
                    <BootHistory
                      accordionType={accordionType}
                      currFcm={currFcm}
                    />
                  </AccordionItem>
                </Accordion>
              </>
            ) : (
              <>
                <Empty></Empty>
              </>
            )}
          </div>
        </div>
        <Map
          locations={locations}
          locationPoints={locationPoints}
          setFcm={setFcm}
          setImagePaths={setImagePaths}
        />
      </div>
    </>
  );
};

export default App;
