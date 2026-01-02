import { Box, Container, Grid, Typography } from "@mui/material";
import Kirjakortti from "./Kirjakortti";
import { useEffect, useState } from "react";
import { getKirjat } from "./kirjat";
import { useNavigate } from "react-router";
import headerKuva from "../assets/kirjasto.jpg";

function Etusivu() {
  const navigate = useNavigate();

  const [kirjat, setKirjat] = useState([]);

  const haeKaikkiKirjat = async () => {
    try {
      const response = await getKirjat();
      if (response.status === 200) {
        setKirjat(response.data);
      } else {
        navigate("/virhe", { state: { viesti: "Listaus ei onnistunut" } });
      }
    } catch {
      navigate("/virhe", { state: { viesti: "Listaus ei onnistunut" } });
    }
  };

  useEffect(() => {
    haeKaikkiKirjat();
  }, []);

  const parhaatKirjat = [...kirjat]
    .sort((a, b) => b.arvosana - a.arvosana)
    .slice(0, 3);

  return (
    <Box>
      <Box
        sx={{
          position: "relative",
          height: {
            xs: "250px",
            sm: "350px",
            md: "400px",
            overflow: "hidden",
            mb: 4,
          },
        }}>
        <img
          src={headerKuva}
          alt="Kirjoja"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <Container>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: "white",
                textAlign: "center",
                fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
              }}>
              Lukupäiväkirja
            </Typography>

            <Typography
              variant="h5"
              sx={{
                color: "white",
                textAlign: "center",
                mt: 2,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}>
              Pidä kirjaa luetuista kirjoistasi sekä seuraa lukutavoitteen
              edistymistä
            </Typography>
          </Container>
        </Box>
      </Box>

      <Container sx={{ py: 4 }}>
        <Typography variant="h4" component="h2" sx={{ mb: 3 }}>
          Parhaiten arvioidut kirjat
        </Typography>

        {parhaatKirjat.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>
            Ei vielä lisättyjä kirjoja. Aloita lisäämällä ensimmäinen kirjasi!
          </Typography>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={3}>
              {parhaatKirjat.map((kirja) => (
                <Grid key={kirja.id} size={{ xs: 12, sm: 6, md: 4 }}>
                  <Kirjakortti kirja={kirja} />
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default Etusivu;
