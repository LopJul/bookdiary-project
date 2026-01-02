import { useState } from "react";
import {
  Box,
  Paper,
  Stack,
  TextField,
  Button,
  Typography,
  InputLabel,
  Container,
  Alert,
  Snackbar,
} from "@mui/material";
import Rating from "@mui/material/Rating";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { styled } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/Home";
import AttachmentIcon from "@mui/icons-material/Attachment";
import ClearIcon from "@mui/icons-material/Clear";
import { z } from "zod";
import { useNavigate } from "react-router";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { addKirja } from "./kirjat";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

const kirjaSchema = z.object({
  nimi: z.string().min(2, "Nimen tulee olla vähintään 2 merkkiä"),
  kirjailija: z.string().min(2, "Kirjailijan nimi vaaditaan"),
  kuvaus: z
    .string()
    .min(10, "Kuvauksen tulee olla vähintään 10 merkkiä")
    .max(150, "Kuvaus saa olla enintään 150 merkkiä"),
  lukuajankohta: z.string("Päivämäärä on pakollinen"),
  arvosana: z.number().min(1, "Arvosana vaaditaan"),
});

function KirjaLomake() {
  const [kirja, setKirja] = useState({
    nimi: "",
    kirjailija: "",
    kuvaus: "",
    lukuajankohta: "",
    laji: "",
    arvosana: 0,
    kuva: undefined,
  });

  const navigate = useNavigate();
  const [virheet, setVirheet] = useState({});

  const muutaArvo = (e) => {
    setKirja({ ...kirja, [e.target.name]: e.target.value });
    setVirheet({ ...virheet, [e.target.name]: "" });
  };

  const muutaLukuajankohta = (e) => {
    setKirja({ ...kirja, lukuajankohta: e.target.value });
    setVirheet({ ...virheet, lukuajankohta: "" });
  };

  const muutaKuva = (e) => {
    setKirja({ ...kirja, kuva: e.target.files[0] });
  };

  const labels = {
    1: "Huono",
    2: "Kohtalainen",
    3: "Ihan hyvä",
    4: "Tosi hyvä",
    5: "Erinomainen",
  };

  const [hover, setHover] = useState(-1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");

  const handleSuljeSnackbar = (e, syy) => {
    if (syy === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const lisaaKirja = async (e) => {
    e.preventDefault();

    const validointiData = {
      ...kirja,
      lukuajankohta: kirja.lukuajankohta,
    };
    const tulos = kirjaSchema.safeParse(validointiData);

    if (!tulos.success) {
      const zodVirheet = {};
      tulos.error?.issues?.forEach((err) => {
        const key = err.path[0];
        zodVirheet[key] = err.message;
      });
      setVirheet(zodVirheet);
      return;
    }

    const formData = new FormData();
    formData.append("nimi", kirja.nimi);
    formData.append("kirjailija", kirja.kirjailija);
    formData.append("kuvaus", kirja.kuvaus);
    formData.append("lukuajankohta", kirja.lukuajankohta);
    formData.append("laji", kirja.laji);
    formData.append("arvosana", kirja.arvosana);
    formData.append("kuva", kirja.kuva);

    try {
      const response = await addKirja(formData);
      if (response.status === 200) {
        navigate("/listaa", {
          state: {
            message: "Kirja lisätty onnistuneesti!",
            severity: "success",
          },
        });
      } else {
        setSnackbarMessage("Lisäys ei onnistunut");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      setSnackbarMessage("Lisäys ei onnistunut");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    setKirja({
      nimi: "",
      kirjailija: "",
      kuvaus: "",
      lukuajankohta: "",
      arvosana: 0,
      kuva: undefined,
    });
    setVirheet({});
  };

  const tyhjenna = () => {
    setKirja({
      nimi: "",
      kirjailija: "",
      kuvaus: "",
      lukuajankohta: "",
      arvosana: 0,
      kuva: undefined,
    });
    setVirheet({});
  };

  let kuvaNimi = "";
  if (kirja.kuva !== undefined) {
    kuvaNimi = kirja.kuva.name;
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Typography variant="h4" sx={{ mb: 3 }}>
        Lisää uusi kirja
      </Typography>

      <Paper sx={{ p: 4 }}>
        <Box component="form" onSubmit={lisaaKirja}>
          <Stack spacing={{ xs: 3 }} direction="column" useFlexGap>
            <TextField
              label="Kirjan nimi"
              name="nimi"
              value={kirja.nimi}
              onChange={muutaArvo}
              error={!!virheet.nimi}
              helperText={virheet.nimi}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Kirjailija"
              name="kirjailija"
              value={kirja.kirjailija}
              onChange={muutaArvo}
              error={!!virheet.kirjailija}
              helperText={virheet.kirjailija}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Mielipiteesi kirjasta"
              name="kuvaus"
              value={kirja.kuvaus}
              onChange={muutaArvo}
              multiline
              rows={4}
              error={!!virheet.kuvaus}
              helperText={virheet.kuvaus}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              label="Luettu päivämäärä"
              type="date"
              name="lukuajankohta"
              value={kirja.lukuajankohta}
              onChange={muutaLukuajankohta}
              error={!!virheet.lukuajankohta}
              helperText={virheet.lukuajankohta}
              fullWidth
              required
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <FormControl>
              <FormLabel id="kirjalajit" sx={{ mb: 1 }}>
                Kirjan laji
              </FormLabel>
              <RadioGroup
                defaultValue="romaani"
                name="laji"
                onChange={muutaArvo}>
                <FormControlLabel
                  value="romaani"
                  control={<Radio />}
                  label="Romaani"
                />
                <FormControlLabel
                  value="fantasia"
                  control={<Radio />}
                  label="Fantasia"
                />
                <FormControlLabel
                  value="scifi"
                  control={<Radio />}
                  label="Scifi"
                />
                <FormControlLabel
                  value="trilleri"
                  control={<Radio />}
                  label="Trilleri"
                />
                <FormControlLabel
                  value="elämäkerta"
                  control={<Radio />}
                  label="Elämäkerta"
                />
                <FormControlLabel
                  value="historia"
                  control={<Radio />}
                  label="Historia"
                />
              </RadioGroup>
            </FormControl>

            <Box>
              <Typography sx={{ mb: 1 }}>Arvostelu</Typography>
              <StyledRating
                name="customized-color"
                getLabelText={(value) => `Arvosana ${value} / 5`}
                precision={1}
                max={5}
                icon={<FavoriteIcon fontSize="inherit" />}
                emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
                value={kirja.arvosana}
                onChange={(_, newValue) =>
                  setKirja({ ...kirja, arvosana: newValue })
                }
                onChangeActive={(_, newHover) => setHover(newHover)}
                size="large"
              />
              <Typography variant="body2">
                {labels[hover !== -1 ? hover : kirja.arvosana || 0] ?? ""}
              </Typography>
              {virheet.arvosana && (
                <Typography variant="body2" color="error">
                  {virheet.arvosana}
                </Typography>
              )}
            </Box>

            <input
              accept="image/*"
              id="kuva"
              type="file"
              onChange={(e) => muutaKuva(e)}
              hidden
            />

            <InputLabel htmlFor="kuva">
              <Typography sx={{ display: "inline" }}>Kuva</Typography>
              <Button component="span" color="secondary">
                <AttachmentIcon />
              </Button>
              <Typography sx={{ display: "inline" }}>{kuvaNimi}</Typography>
            </InputLabel>
            {virheet.kuva && (
              <Typography variant="body2" color="error">
                {virheet.kuva}
              </Typography>
            )}
            <Box>
              <Stack
                spacing={{ xs: 3 }}
                direction={{ xs: "column", md: "row" }}
                useFlexGap>
                <Button type="submit" variant="contained">
                  Lisää kirja
                </Button>

                <Button
                  onClick={() => tyhjenna()}
                  variant="contained"
                  color="secondary"
                  startIcon={<ClearIcon />}>
                  Tyhjennä
                </Button>

                <Button
                  onClick={() => navigate("/")}
                  variant="contained"
                  color="secondary"
                  startIcon={<HomeIcon />}>
                  Etusivulle
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Box>
      </Paper>

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

export default KirjaLomake;
