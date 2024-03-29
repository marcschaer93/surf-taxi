import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { MyProfile } from "../pages/Profile/MyProfile";
import { EditProfile } from "../pages/Profile/EditProfile";
import AllTrips from "../pages/Trips/AllTrips";
import MyTrips from "../pages/Trips/MyTrips";
import TripDetailsPage from "../pages/Trips/TripDetailsPage";
import { RequireAuth } from "../components/RequireAuth";
import { NewTrip } from "../pages/Trips/NewTrip";
import { Favorites } from "../pages/Favorites";
import { Notifications } from "../pages/Notifications";

export const AppRoutes = ({
  allTrips,
  notifications,
  markNotificationAsRead,
}) => {
  return (
    <Routes>
      // HOME
      {/* <Route path="/" element={<Home allTrips={allTrips} /> } /> */}
      // Entry Point is /trips not home !!
      <Route path="/" element={<Navigate replace to="/trips" />} />
      // USER ROUTES
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/my-profile"
        element={
          <RequireAuth>
            <MyProfile notifications={notifications} />
          </RequireAuth>
        }
      />
      <Route
        path="/profile-edit"
        element={
          <RequireAuth>
            <EditProfile />
          </RequireAuth>
        }
      />
      <Route
        path="/notifications"
        element={
          <RequireAuth>
            <Notifications
              notifications={notifications}
              markNotificationAsRead={markNotificationAsRead}
            />
          </RequireAuth>
        }
      />
      // TRIP ROUTES
      <Route path="/trips" element={<AllTrips allTrips={allTrips} />} />
      <Route
        path="/my-trips"
        element={
          <RequireAuth>
            <MyTrips allTrips={allTrips} notifications={notifications} />
          </RequireAuth>
        }
      />
      <Route
        path="/new-trip"
        element={
          <RequireAuth>
            <NewTrip />
          </RequireAuth>
        }
      />
      <Route
        path="/trips/:tripId"
        element={
          <RequireAuth>
            <TripDetailsPage allTrips={allTrips} />
          </RequireAuth>
        }
      />
      <Route
        path="/favorites"
        element={
          <RequireAuth>
            <Favorites />
          </RequireAuth>
        }
      />
    </Routes>
  );
};
