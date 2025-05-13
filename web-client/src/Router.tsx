import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from "./App";
import { useState, useEffect } from "react";
import WebSocket from "./contexts/WebSocket";
import axios from "axios";
import Home from "./pages/Home";
import { NextUIProvider } from "@nextui-org/react";

export default () => {
  const [isAuthorized, setAuhtorization] = useState<boolean>(true);

  return (
    <NextUIProvider>
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            {isAuthorized && (
              <Route
                path="/admin_panel"
                element={
                  <WebSocket>
                    <App />
                  </WebSocket>
                }
              />
            )}
        </Routes>
      </BrowserRouter>
    </NextUIProvider>
  );
};
