import React from "react";
import { Link } from "react-router-dom";
import { EditProfile } from "./EditProfile";
import { IconButton, Badge, Box, Typography, Button } from "@mui/material";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import { useNotifications } from "../../hooks/useNotifications";
import { useAuthContext } from "../../context/authProvider";
import { Title, TitleDivider } from "../../styles/fontStyles";
import { theme } from "../../utils/theme";

export const Profile = ({ notifications }) => {
  // const { user } = useAuthContext();
  // const { notifications } = useNotifications(user);
  // console.log("NOTIFICATION", notifications);
  const { handleLogout } = useAuthContext();
  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Title variant="h3">Profile</Title>
        <Box
          component={Link}
          to="/notifications"
          sx={{ marginLeft: "auto", mt: "20px" }}
        >
          <IconButton color="primary">
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsOutlinedIcon />
            </Badge>
          </IconButton>
        </Box>
      </Box>
      <TitleDivider />
      <Box sx={{ position: "relative" }}>
        <Link to="/profile-edit">
          <Button size="small" variant="outlined">
            Edit Profile
          </Button>
          <Button onClick={handleLogout} size="small" variant="outlined">
            Logout
          </Button>
        </Link>
        <Link to="/notifications">
          {/* Replace the following onClick handler with your actual logic */}
        </Link>
      </Box>
    </>
  );
};
