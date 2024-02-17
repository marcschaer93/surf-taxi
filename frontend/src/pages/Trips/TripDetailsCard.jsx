import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  styled,
  Chip,
  Avatar,
  IconButton,
  CircularProgress,
} from "@mui/material";
import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";

import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useState, useEffect } from "react";

import { Confirmation } from "./Confirmation";
import { theme } from "../../utils/theme";
// import { CardStatusChip } from "../../components/ui/CardStatusChip";
import { CancelRequestConfirmationCard } from "../../components/confirmationCards/CancelRequestConfirmationCard";
import { JoinRequestConfirmationCard } from "../../components/confirmationCards/JoinRequestConfirmationCard";
import { StyledDetailsCard } from "../../styles/cardStyles";
import { useFavorite } from "../../hooks/useFavorite";
import { useParams } from "react-router-dom";
import { Title, TitleDivider } from "../../styles/fontStyles";

import { FavoriteButton } from "../../components/ui/FavoriteButton";
import { GoBackButton } from "../../components/ui/GoBackButton";
import { TripCardContent } from "./TripCardContent";
import { PassengerCard } from "./PassengerCard";
import { PassengerAvatars } from "../../components/ui/PassengerAvatars";
import { BottomActionBar } from "../../components/BottomActionBar";
import { ColorAvatar } from "../../components/ui/ColorAvatar";
import { StatusChip } from "../../components/ui/StatusChip";
import InfoSharpIcon from "@mui/icons-material/InfoSharp";
import { useMyTrips } from "../../context/MyTripsProvider";
import { useAuthContext } from "../../context/authProvider";

export const TripDetailsCard = ({ tripDetails, passengers, handleAction }) => {
  const { user } = useAuthContext();
  const { myTrips } = useMyTrips();
  const location = useLocation();
  const { tripId } = useParams();
  const navigate = useNavigate();
  const { isFavorited, toggleFavorite, loading } = useFavorite(tripId);
  const [showJoinConfirmation, setShowJoinConfirmation] = useState(false);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [userReservation, setUserReservation] = useState(null);

  useEffect(() => {
    const currentUserAsPassenger = passengers?.find(
      (p) => p.username === user.username
    );
    if (currentUserAsPassenger) {
      setUserReservation(currentUserAsPassenger);
    }
  }, [passengers, user]);

  const isInMyTrips = myTrips.some((t) => t.id === parseInt(tripId));

  const openJoinConfirmation = () => {
    setShowJoinConfirmation(true);
  };

  const openCancelConfirmation = () => {
    setShowCancelConfirmation(true);
  };

  const closeJoinConfirmation = () => {
    setShowJoinConfirmation(false);
  };

  const closeCancelConfirmation = () => {
    setShowCancelConfirmation(false);
  };

  const handleFavorite = (e, tripId) => {
    e.stopPropagation();
    toggleFavorite(tripId);
  };

  const handleGoBackButton = (e, tripId) => {
    e.stopPropagation();
    navigate(-1);
  };

  const handleAvatarClick = (username) => {
    console.log("username", username);
    // navigate(`users/${owner}`);
  };

  const { startLocation, destination, stops, seats, date, travelInfo, owner } =
    tripDetails;

  if (loading) return <CircularProgress />;

  return (
    <>
      <Box>
        <GoBackButton handleGoBack={handleGoBackButton} />
        {isInMyTrips ? (
          <Title variant="h3">Trip I'm Joining</Title>
        ) : (
          <Title variant="h3">Trip Details</Title>
        )}
        <TitleDivider />
      </Box>

      <StyledDetailsCard variant="outlined">
        {/* {userReservation && <CardStatusChip isTripOwner={false} />} */}

        {/* {!userReservation && ( */}
        <FavoriteButton
          handleFavorite={handleFavorite}
          isFavorited={isFavorited}
        ></FavoriteButton>
        {/* )} */}

        <TripCardContent tripDetails={tripDetails} />

        <CardActions>
          <Box>
            {!isInMyTrips && showJoinConfirmation && (
              <JoinRequestConfirmationCard
                open={showJoinConfirmation}
                onClose={closeJoinConfirmation}
                tripDetails={tripDetails}
                handleAction={handleAction}
              />
            )}

            {isInMyTrips && showCancelConfirmation && (
              <CancelRequestConfirmationCard
                open={showCancelConfirmation}
                onClose={closeCancelConfirmation}
                tripDetails={tripDetails}
                handleAction={handleAction}
              />
            )}
          </Box>
        </CardActions>
      </StyledDetailsCard>

      {/* User Trip Status */}
      {userReservation && (
        <Box>
          <TitleDivider />
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Box>
              <Box sx={{ display: "flex", gap: "10px" }}>
                <Typography variant="h5">My Status</Typography>
                <InfoSharpIcon />
              </Box>
              <Typography variant="body2">
                {`Last modified: ${format(
                  userReservation.reservationTimestamp,
                  "yyyy-MM-dd "
                )}`}
              </Typography>
            </Box>
            <StatusChip
              sx={{}}
              isTripOwner={false}
              status={userReservation.reservationStatus}
            />
          </Box>
        </Box>
      )}

      {/* Trip Organizer */}
      <Box>
        <TitleDivider />
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            flexDirection: "column",
          }}
        >
          <Typography variant="h5">Trip Organizer</Typography>
          <ColorAvatar username={owner} handleAvatarClick={handleAvatarClick} />
        </Box>
      </Box>

      {/* Passengers */}
      <Box sx={{ marginBottom: "80px" }}>
        <TitleDivider />
        <Typography variant="h5">Reserved Seats</Typography>
        <PassengerAvatars passengers={passengers} />
      </Box>

      {/* Bottom action bar */}
      <BottomActionBar
        variant={isInMyTrips ? "contained" : "contained"}
        color={isInMyTrips ? "error" : "primary"}
        onClick={isInMyTrips ? openCancelConfirmation : openJoinConfirmation}
        buttonText={isInMyTrips ? "Cancel Trip" : "Join Trip"}
      />
    </>
  );
};
