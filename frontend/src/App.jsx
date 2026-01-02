import KirjaLista from "./components/KirjaLista.jsx";
import KirjaLomake from "./components/KirjaLomake.jsx";
import Etusivu from "./components/Etusivu.jsx";
import TabsMUI from "./mui/TabsMUI.jsx";
import KirjalomakeEdit from "./components/KirjalomakeEdit.jsx";
import Virhe from "./components/Virhe.jsx";
import Tilasto from "./components/Tilasto.jsx";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router";

import "@fontsource/nunito";

const theme = createTheme({
  typography: {
    fontFamily: "'Nunito', sans-serif",
  },
  palette: {
    primary: {
      main: "#8B4513",
      light: "#A0522D",
      dark: "#654321",
    },
    secondary: {
      main: "#D2591E",
      light: "#CD853F",
      dark: "#A0522D",
    },
    background: {
      default: "#FAF0E6",
      paper: "#FFF8DC",
    },
    text: {
      primary: "#3E2723",
      secondary: "#5D4037",
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#8B4513",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFF8DC",
          borderRadius: 12,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            "&:hover fieldset": { borderColor: "primary.main" },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<TabsMUI />}>
            <Route index element={<Etusivu />} />
            <Route path="/lisaa" element={<KirjaLomake />} />
            <Route path="/listaa" element={<KirjaLista />} />
            <Route path="/tilasto" element={<Tilasto />} />
            <Route path="/muokkaa/:id" element={<KirjalomakeEdit />} />
            <Route path="/virhe" element={<Virhe />} />
            <Route
              path="*"
              element={<Virhe virheviesti="Kyseistä sivua ei ole" />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
