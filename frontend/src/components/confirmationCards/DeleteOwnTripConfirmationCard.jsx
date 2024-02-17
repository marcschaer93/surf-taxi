import { Confirmation } from "../../pages/Trips/Confirmation";
import { Box, CardActions, Button } from "@mui/material";

export const DeleteOwnTripConfirmationCard = ({
  tripDetails,
  open,
  onClose,
  handleAction,
}) => {
  const message = `Are you sure you want to delete your trip from ${tripDetails.startLocation} to ${tripDetails.destination}?`;

  const title = "Confirm Delete Trip";

  const handleConfirm = async () => {
    await handleAction("delete", { tripDetails });
    onClose();
  };

  return (
    <Box>
      <Confirmation
        open={open}
        onClose={onClose}
        tripDetails={tripDetails}
        onConfirm={handleConfirm}
        message={message}
        title={title}
      />
    </Box>
  );
};
