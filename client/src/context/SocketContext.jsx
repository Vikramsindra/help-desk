import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "../lib/api";
import { useAuth } from "../hooks/useAuth";
import { SocketContext } from "./SocketContextValue";

export function SocketProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const socketUrl = import.meta.env.VITE_SOCKET_URL || window.location.origin;

  useEffect(() => {
    if (!userId || !socketUrl) return undefined;

    const connection = io(socketUrl, {
      withCredentials: true,
      auth: { token: getAccessToken() },
    });
    const onConnect = () => {
      setSocket(connection);
      setConnected(true);
    };
    const onDisconnect = () => {
      setSocket(null);
      setConnected(false);
    };
    connection.on("connect", onConnect);
    connection.on("disconnect", onDisconnect);

    return () => {
      connection.off("connect", onConnect);
      connection.off("disconnect", onDisconnect);
      connection.disconnect();
    };
  }, [userId, socketUrl]);

  const activeSocket = user && socketUrl ? socket : null;

  return (
    <SocketContext.Provider
      value={{
        socket: activeSocket,
        connected: Boolean(activeSocket && connected),
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}
