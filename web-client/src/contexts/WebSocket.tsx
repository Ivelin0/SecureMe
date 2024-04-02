import { Dispatch, SetStateAction, useEffect } from "react";
import { createContext } from "react";

import { useState } from "react";

interface SocketContextProps {
  webSocket: WebSocket | null;
  //setWebSocket: Dispatch<SetStateAction<WebSocket>>;
  addCallback: (func: WScallback) => void;
}

type WScallback = (event: MessageEvent<any>) => void;

export const SocketContext = createContext({} as SocketContextProps);

export const Context = ({ children }: any) => {
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [arrCallbacks, setArrCallbacks] = useState<Array<WScallback>>([]);

  const addCallback = (func: WScallback) => {
    setArrCallbacks([...arrCallbacks, func]);
  };
  useEffect(() => {
    if (!webSocket) return;
    addCallback((event: MessageEvent) => {
      webSocket.send(JSON.stringify({ message: "pong" }));
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
      const ws = new WebSocket(
        `${process.env.REACT_APP_WS_PROXY_SERVER}/web_client?auth_token=` +
          (await getAuthToken())
      );

      await setWebSocket(ws);
    };
    if (!webSocket) {
      initWS();
      return;
    }

    webSocket.onmessage = (event: MessageEvent<any>) => {
      arrCallbacks.map((func: WScallback) => func(event));
    };
  }, [webSocket, arrCallbacks]);

  return (
    <SocketContext.Provider value={{ webSocket, addCallback }}>
      {children}
    </SocketContext.Provider>
  );
};

export default Context;
