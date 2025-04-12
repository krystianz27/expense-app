import { useEffect } from "react";
import { requestNotificationPermission } from "@fbconfig/notification";

const NotificationPermissionProvider = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return null;
};

export default NotificationPermissionProvider;
