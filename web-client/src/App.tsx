import "./styles/global.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { icon } from "leaflet";
import { useEffect, useState } from "react";
import { Location } from "./models/location.model";

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

const webSocket = new WebSocket("ws://secureme.live/web_client");

const App = (): JSX.Element => {
  const [location, setLocation] = useState<Location>();
  useEffect(() => {
    const startTrackingLocation = async () => {
      const response = await fetch("https://secureme.live/locations", {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "69420",
        },
      }).then((res) => res.json());
    };

    webSocket.onmessage = (event) => {
      const data: Location = JSON.parse(event.data).message;
      console.log(data);
      setLocation({ latittude: data.latittude, longitude: data.longitude });
    };

    webSocket.onerror = (error) => {
      console.error("WebSocket Error: ", error);
    };

    startTrackingLocation();

    return () => {
      webSocket.close();
    };
  }, []);

  return (
    <MapContainer
      style={{
        height: "100vh",
        width: "100wh",
      }}
      center={[42.7249925, 25.4833039]}
      attributionControl={true}
      zoom={8}
      minZoom={3}
      scrollWheelZoom={true}
    >
      <ComponentResize />
      <TileLayer url="https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png?apikey=6e5478c8a4f54c779f85573c0e399391" />
      {location && (
        <Marker
          icon={ICON}
          position={[location.latittude, location.longitude]}
        />
      )}
    </MapContainer>
  );
};

export default App;
