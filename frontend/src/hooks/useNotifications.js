import React, { useEffect, useState } from "react";
import * as UserApi from "../api/services/UserApi";
import { useAuthContext } from "../context/authProvider";
import { Box, Typography } from "@mui/material";

export const useNotifications = (user) => {
  const [notifications, setNotifications] = useState([]);

  const checkNotifications = async () => {
    try {
      if (user) {
        const unreadNotifications = await UserApi.checkNotifications(
          user.username
        );
        setNotifications(unreadNotifications);
      }
    } catch (error) {
      console.error("Error checking notifications:", error);
    }
  };

  useEffect(() => {
    // Initial check when component mounts
    checkNotifications();

    // Set up periodic checks (adjust interval based on your needs)
    const intervalId = setInterval(checkNotifications, 1 * 60 * 60 * 1000); // 4 times a day

    // Cleanup on component unmount
    return () => clearInterval(intervalId);
  }, [user]);

  return { notifications, checkNotifications };
};

//   if (!notifications)
//     return (
//       <Box>
//         <Typography>No notifications...</Typography>
//       </Box>
//     );

//   return (
//     <>
//       {notifications.length > 0 && (
//         <Box>
//           {notifications.map((notification) => (
//             <Box key={notification.id}>
//               {/* Render notification content here */}
//               <Typography>{notification.message}</Typography>
//             </Box>
//           ))}
//           <p>Unread Notifications: {notifications.length}</p>
//         </Box>
//       )}
//     </>
//   );
