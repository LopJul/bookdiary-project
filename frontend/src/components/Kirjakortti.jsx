import {
  Card,
  Box,
  CardContent,
  CardMedia,
  Typography,
  CardActions,
  IconButton,
  Rating,
  Modal,
  Backdrop,
  Fade,
  Button,
  Stack,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router";
import { useState } from "react";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorderOutlined";
import { styled } from "@mui/material/styles";

import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { deleteKirja } from "./kirjat";
import { useNavigate } from "react-router";

const StyledRating = styled(Rating)({
  "& .MuiRating-iconFilled": {
    color: "#ff6d75",
  },
  "& .MuiRating-iconHover": {
    color: "#ff3d47",
  },
});

function Kirjakortti({ kirja, onClick }) {
  const [avoin, setAvoin] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const menuOpen = Boolean(menuAnchor);

  const labels = {
    1: "Huono",
    2: "Kohtalainen",
    3: "Ihan hyvä",
    4: "Tosi hyvä",
    5: "Erinomainen",
  };

  const navigate = useNavigate();

  const poistaKirja = async () => {
    try {
      const response = await deleteKirja(kirja.id);
      if (response.status === 200) {
        setAvoin(false);
        onClick();
      } else {
        navigate("/virhe", { state: { viesti: "Poistaminen ei onnistunut" } });
      }
    } catch {
      navigate("/virhe", { state: { viesti: "Poistaminen ei onnistunut" } });
    }
  };

  const formatLukuajankohta = (paiva) => {
    const [year, month, day] = paiva.split("-");

    return `${day}.${month}.${year}`;
  };

  return (
    <>
      <Card
        key={kirja.id}
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 4px 12px rgba(139, 69, 19, 0.15)",
          transition: "transform 0.2s, box-shadow 0.2s",
          border: "2px solid #D2691E",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 24px rgba(139, 69, 19, 0.25)",
          },
        }}>
        {kirja.kuva ? (
          <CardMedia
            component="img"
            image={"http://localhost:8080/images/" + kirja.kuva}
            alt={kirja.nimi}
            sx={{
              maxHeight: 200,
              width: "100%",
              objectFit: "cover",
              flexShrink: 0,
            }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              bgColor: "rgba(210, 105, 30, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
            <Typography sx={{ color: "text.secondary", fontStyle: "italic" }}>
              Ei kuvaa
            </Typography>
          </Box>
        )}

        <CardContent sx={{ p: 3, flexGrow: 1 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" component="h3" sx={{ lineHeight: "1.2" }}>
              {kirja.nimi}
            </Typography>
          </Box>

          <Typography
            sx={{
              color: "text.secondary",
              mb: 2,
              fontStyle: "italic",
            }}>
            {kirja.kirjailija}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2, lineHeight: "1.6" }}>
            {kirja.kuvaus}
          </Typography>

          <Typography
            variant="body2"
            sx={{ color: "text.secondary", mb: 2, fontStyle: "italic" }}>
            Laji: {kirja.laji}
          </Typography>

          {kirja.lukuajankohta && (
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mb: 2, fontStyle: "italic" }}>
              Luettu: {formatLukuajankohta(kirja.lukuajankohta)}
            </Typography>
          )}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              mb: 2,
            }}>
            <StyledRating
              value={kirja.arvosana}
              readOnly
              size="small"
              icon={<FavoriteIcon fontSize="inherit" />}
              emptyIcon={<FavoriteBorderIcon fontSize="inherit" />}
            />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {labels[kirja.arvosana] ?? ""}
            </Typography>
          </Box>
        </CardContent>

        <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={(e) => setMenuAnchor(e.currentTarget)}>
            <MoreVertIcon />
          </IconButton>

          <Menu
            anchorEl={menuAnchor}
            open={menuOpen}
            onClose={() => setMenuAnchor(null)}>
            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
              }}
              component={Link}
              to={"/muokkaa/" + kirja.id}>
              <EditIcon fontSize="small" style={{ marginRight: 8 }} />
              Muokkaa
            </MenuItem>

            <MenuItem
              onClick={() => {
                setMenuAnchor(null);
                setAvoin(true);
              }}>
              <DeleteIcon fontSize="small" style={{ marginRight: 8 }} />
              Poista
            </MenuItem>
          </Menu>
        </CardActions>
      </Card>

      <Modal
        open={avoin}
        onClose={() => setAvoin(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{ backdrop: { timeout: 500 } }}>
        <Fade in={avoin}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: { xs: "90%", sm: 400 },
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
            }}>
            <Typography variant="h6" component="h2" sx={{ mb: 1 }}>
              Poista kirja
            </Typography>
            <Typography sx={{ mb: 3 }}>
              Olet poistamassa kirjaa <strong>{kirja.nimi}</strong>{" "}
              kirjalistastasi. Haluatko jatkaa?
            </Typography>

            <Stack direction="row" spacing={2}>
              <Button variant="outlined" onClick={() => setAvoin(false)}>
                Peruuta
              </Button>

              <Button variant="contained" color="error" onClick={poistaKirja}>
                Poista
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export default Kirjakortti;
