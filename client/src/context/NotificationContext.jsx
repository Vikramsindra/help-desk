import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { notificationService } from "../services/notificationService";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { NotificationContext } from "./NotificationContextValue";

export function NotificationProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const { socket } = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotifications([]);
      return;
    }
    setLoading(true);
    try {
      const response = await notificationService.list();
      setNotifications(response.data?.items || []);
    } catch (error) {
      toast.error(error.message || "Could not load notifications");
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!userId) return undefined;
    let active = true;
    notificationService
      .list()
      .then((response) => {
        if (active) setNotifications(response.data?.items || []);
      })
      .catch((error) => {
        if (active)
          toast.error(error.message || "Could not load notifications");
      });
    return () => {
      active = false;
    };
  }, [userId]);

  useEffect(() => {
    if (!socket) return undefined;
    const onNotification = (notification) => {
      setNotifications((current) => {
        if (current.some((item) => item._id === notification._id))
          return current;
        return [notification, ...current];
      });
      toast(notification.message, { icon: "!" });
    };
    socket.on("notification:new", onNotification);
    return () => socket.off("notification:new", onNotification);
  }, [socket]);

  const markRead = async (id) => {
    try {
      const response = await notificationService.markRead(id);
      setNotifications((current) =>
        current.map((item) => (item._id === id ? response.data : item)),
      );
    } catch (error) {
      toast.error(error.message || "Could not update notification");
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllRead();
      setNotifications((current) =>
        current.map((item) => ({ ...item, isRead: true })),
      );
    } catch (error) {
      toast.error(error.message || "Could not update notifications");
    }
  };

  const unreadCount = notifications.filter((item) => !item.isRead).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        refresh,
        markRead,
        markAllRead,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
