import { useState, useEffect } from "react";
import {
  Alert,
  Box,
  Container,
  Grid,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Kirjakortti from "./Kirjakortti";
import { useLocation, useNavigate } from "react-router";
import { getKirjat } from "./kirjat";

function KirjaLista() {
  const navigate = useNavigate();

  const [kirjat, setKirjat] = useState([]);
  const [hakusana, setHakusana] = useState("");

  const haeKaikkiKirjat = async () => {
    try {
      const response = await getKirjat();
      if (response.status === 200) {
        setKirjat(response.data);
      } else {
        navigate("/virhe", { state: { viesti: "Listaus ei onnistunut" } });
      }
    } catch (error) {
      navigate("/virhe", { state: { viesti: "Listaus ei onnistunut" } });
    }
  };

  useEffect(() => {
    haeKaikkiKirjat();
  }, []);

  const location = useLocation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  useEffect(() => {
    if (location.state?.message) {
      setSnackbarMessage(location.state.message);
      setSnackbarSeverity(location.state.severity || "success");
      setSnackbarOpen(true);
    }
  }, []);

  const handleSuljeSnackbar = (e, syy) => {
    if (syy === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  if (kirjat.length == 0) {
    return <Typography>Ladataan kirjoja</Typography>;
  }

  const haku = hakusana.toLowerCase();
  const suodatetutKirjat = kirjat.filter((kirja) => {
    return (
      kirja.nimi.toLowerCase().includes(haku) ||
      kirja.kirjailija.toLowerCase().includes(haku) ||
      kirja.kuvaus.toLowerCase().includes(haku)
    );
  });

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Etsi kirjoja
      </Typography>

      <TextField
        fullWidth
        placeholder="Hae kirjoja..."
        value={hakusana}
        onChange={(e) => setHakusana(e.target.value)}
        sx={{ mb: 4 }}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          },
        }}
      />

      {suodatetutKirjat.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>
          {hakusana ? "Ei hakutuloksia" : "Ei vielä lisättyjä kirjoja"}
        </Typography>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={3}>
            {suodatetutKirjat.map((kirja) => (
              <Grid key={kirja.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Kirjakortti kirja={kirja} onClick={haeKaikkiKirjat} />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSuljeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert
          onClose={handleSuljeSnackbar}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default KirjaLista;
