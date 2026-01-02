import { Box, Typography } from "@mui/material";
import { useLocation } from "react-router";

function Virhe({ virheviesti }) {
  const location = useLocation();
  const { viesti = virheviesti } = location.state || {};

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        mt: 1,
      }}>
      <Typography>{viesti}</Typography>
    </Box>
  );
}

export default Virhe;
