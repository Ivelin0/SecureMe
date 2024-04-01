import { useContext, useEffect } from "react";
import { createContext } from "react";

import { useState } from "react";

export const SocketContext = createContext({});

export const Context = ({ children }: any) => {
  const [webSocket, setWebSocket] = useState<any>(null);
  const [arrCallbacks, setArrCallbacks] = useState<any>([]);

  const addCallback = (func: any) => {
    setArrCallbacks([...arrCallbacks, func]);
  };

  useEffect(() => {
    if (!webSocket) return;
    addCallback((event: any) => {
      webSocket.send({ message: "pong" });
    });
  }, [webSocket]);
  useEffect(() => {
    const getAuthToken = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/ws-ticket`,
        {
          method: "GET",
          credentials: "include",
        }
      ).then((res) => res.json());

      return response.message;
    };

    const initWS = async () => {
      const ws: any = new WebSocket(
        `${process.env.REACT_APP_HTTP_PROXY_SERVER}/web_client?auth_token=` +
          (await getAuthToken())
      );

      await setWebSocket(ws);
    };
    if (!webSocket) {
      initWS();
      return;
    }

    webSocket.onmessage = (event: any) => {
      arrCallbacks.map((func: any) => func(event));
    };

    console.log("here");
  }, [webSocket, arrCallbacks]);

  return (
    <SocketContext.Provider value={{ webSocket, addCallback }}>
      {children}
    </SocketContext.Provider>
  );
};

export default Context;
