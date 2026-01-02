import {
  Container,
  Paper,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PieChart } from "@mui/x-charts/PieChart";
import LinearProgress from "@mui/material/LinearProgress";
import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getKirjat } from "./kirjat";

function Tilasto() {
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

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

  const [maara, setMaara] = useState(0);
  const [data, setData] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const tavoitemaara = 100;

    if (!kirjat.length) {
      return;
    }

    const nykyinenMaara = kirjat.length;
    setMaara(kirjat.length);
    setProgress((nykyinenMaara / tavoitemaara) * 100);

    const arvosanojenMaara = [1, 2, 3, 4, 5].map((arvosana) => {
      return kirjat.filter((kirja) => kirja.arvosana === arvosana).length;
    });

    setData(
      arvosanojenMaara.map((maara, index) => {
        const arvosana = index + 1;
        const prosentti =
          kirjat.length === 0 ? 0 : Math.round((maara / kirjat.length) * 100);

        return {
          id: arvosana,
          value: prosentti,
          label: `${arvosana}`,
          count: maara,
        };
      })
    );
  }, [kirjat]);

  const muotoileArvo = (datum) => {
    return `${datum.value} %`;
  };

  if (!kirjat || kirjat.length === 0) {
    return <p>Ei vielä kirjoja</p>;
  }

  return (
    <Container sx={{ py: 4 }} maxWidth="md">
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          boxShadow: "0 4px 12px rgba(139, 69, 19, 0.15)",
          border: "2px solid #D2691E",
        }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Tilasto kirjojen arvioista
        </Typography>

        <PieChart
          series={[
            {
              data: data,
              valueFormatter: muotoileArvo,
              highlightScope: { fade: "global", highlight: "item" },
              faded: { innerRadius: 30, additionalRadius: -30, color: "gray" },
            },
          ]}
          width={isMobile ? 300 : 400}
          height={isMobile ? 250 : 300}
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "bottom", horizontal: "middle" },
              padding: 6,
            },
          }}
        />
      </Paper>
      <Paper
        sx={{
          p: { xs: 3, sm: 4 },
          mb: 3,
          boxShadow: "0 4px 12px rgba(139, 69, 19, 0.15)",
          border: "2px solid #D2691E",
        }}>
        <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
          Lukutavoitteen edistyminen
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, color: "primary.main" }}>
          Kirjoja luettu tällä hetkellä {maara} tavoitemäärästä 100
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5 }}
        />
      </Paper>
    </Container>
  );
}

export default Tilasto;
