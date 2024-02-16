import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";

import AllTrips from "./pages/Trips/AllTrips";
import { Home } from "./pages/Home";
import { RequireAuth } from "./components/RequireAuth";
import { Navbar } from "./components/Navbar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { EditProfile } from "./pages/Profile/EditProfile";
import { Profile } from "./pages/Profile";
import MyTrips from "./pages/Trips/MyTrips";
import { styled, useTheme } from "@mui/material/styles";
import { Stack, Box, Toolbar } from "@mui/material";
import { Sidebar } from "./components/Sidebar";
import { Rightbar } from "./components/Rightbar";
import { AppRoutes } from "./components/AppRoutes";
import { BottomActionBar } from "./components/BottomActionBar";
import CircularProgress from "@mui/material/CircularProgress";

import { BottomNavBar } from "./components/BottomNavBar";
import { useAllTrips } from "./hooks/useAllTrips";
import { useMyTrips } from "./hooks/useMyTrips";
import { useNotifications } from "./hooks/useNotifications";
import { useAuthContext } from "./context/authProvider";

import { MyTripsProvider } from "./context/MyTripsProvider";

const MainContent = styled(Box)(({ theme }) => ({
  flex: 4,
  padding: theme.spacing(3),
  width: "100%",
  marginBottom: "100px",
}));

export default function App() {
  const { user } = useAuthContext();
  const location = useLocation();
  const { allTrips, loadingAllTrips } = useAllTrips();
  const { notifications, markNotificationAsRead } = useNotifications(user);
  // const { myTrips } = useMyTrips();
  // const [visibleTrips, setVisibleTrips] = useState(allTrips);

  // // Filter out trips already in user's list (MyTrips)
  // useEffect(() => {
  //   const filteredTrips = allTrips.filter(
  //     (trip) => !myTrips?.some((myTrip) => myTrip.id === trip.id)
  //   );

  //   setVisibleTrips(filteredTrips);
  // }, [myTrips, allTrips]);

  // Paths where the bottom navbar should be displayed
  const pathsWithBottomNavbar = [
    "/my-trips",
    "/",
    "/trips",
    "/favorites",
    "/profile",
    "/login",
    "/register",
    "/notifications",
  ];
  const shouldDisplayBottomNavbar = pathsWithBottomNavbar.includes(
    location.pathname
  );

  function LoadingIndicator() {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Global loading state
  // const isLoading = loadingAllTrips || loadingMyTrips;
  const isLoading = loadingAllTrips;

  return (
    <>
      {/* Show loading indicator if any loading state is true */}
      {isLoading ? (
        <LoadingIndicator />
      ) : (
        <>
          <MyTripsProvider>
            {/* Navbar */}
            <Navbar />

            {/* Main Content */}
            <Stack direction="row" spacing={2} justifyContent="space-between">
              <Sidebar />
              <MainContent>
                <AppRoutes
                  allTrips={allTrips}
                  // myTrips={myTrips}
                  notifications={notifications}
                  markNotificationAsRead={markNotificationAsRead}
                  // Other props
                />
              </MainContent>
              <Rightbar />
            </Stack>

            {/* BottomNavBar */}
            {shouldDisplayBottomNavbar && (
              <BottomNavBar
                sx={{
                  display: { sm: "none" },
                }}
                notifications={notifications}
              />
            )}
          </MyTripsProvider>
        </>
      )}
    </>
  );
}
