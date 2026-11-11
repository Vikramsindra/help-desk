import { useContext } from "react";
import { useEffect, useRef } from "react";
import { SocketContext } from "../context/SocketContextValue";

export const useSocket = () => useContext(SocketContext);

export function useTicketRoom(ticketId, { onTicket, onComment } = {}) {
  const { socket } = useSocket();
  const handlers = useRef({ onTicket, onComment });

  useEffect(() => {
    handlers.current = { onTicket, onComment };
  }, [onComment, onTicket]);

  useEffect(() => {
    if (!socket || !ticketId) return undefined;

    const handleTicket = (ticket) => handlers.current.onTicket?.(ticket);
    const handleComment = (comment) => handlers.current.onComment?.(comment);
    socket.emit("ticket:join", ticketId);
    socket.on("ticket:updated", handleTicket);
    socket.on("ticket:assigned", handleTicket);
    socket.on("comment:created", handleComment);

    return () => {
      socket.emit("ticket:leave", ticketId);
      socket.off("ticket:updated", handleTicket);
      socket.off("ticket:assigned", handleTicket);
      socket.off("comment:created", handleComment);
    };
  }, [socket, ticketId]);
}
