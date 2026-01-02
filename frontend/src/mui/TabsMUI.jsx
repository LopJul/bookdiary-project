import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  AppBar,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  IconButton,
  Toolbar,
  Typography,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import BarChartIcon from "@mui/icons-material/BarChart";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router";
import { Outlet } from "react-router";

function TabsMUI() {
  const [value, setValue] = useState(0);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleChange = (_, value) => {
    setValue(value);
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <AppBar position="sticky">
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="Avaa valikko"
              edge="start"
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="h1"
            sx={{ flexGrow: isMobile ? 1 : 0, mr: isMobile ? 0 : 4 }}>
            Lukupäiväkirja
          </Typography>

          {!isMobile && (
            <Tabs value={value} onChange={handleChange} textColor="inherit">
              <Tab
                label="Etusivu"
                index={0}
                component={Link}
                to={"/"}
                icon={<HomeIcon />}
                iconPosition="start"
              />
              <Tab
                label="Etsi ja Listaa"
                index={1}
                component={Link}
                to={"/listaa"}
                icon={<SearchIcon />}
                iconPosition="start"
              />
              <Tab
                label="Lisää kirja"
                index={2}
                component={Link}
                to={"/lisaa"}
                icon={<AddIcon />}
                iconPosition="start"
              />
              <Tab
                label="Tilastot"
                index={3}
                component={Link}
                to={"/tilasto"}
                icon={<BarChartIcon />}
                iconPosition="start"
              />
            </Tabs>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}>
          <Box
            sx={{
              width: 250,
              bgcolor: "background.default",
              height: "100%",
            }}
            role="navigation"
            aria-label="Päävalikko">
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  to="/"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>

                  <ListItemText primary="Etusivu" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  to="/listaa"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}>
                  <ListItemIcon>
                    <SearchIcon />
                  </ListItemIcon>

                  <ListItemText primary="Listaa ja Etsi" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  to="/lisaa"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}>
                  <ListItemIcon>
                    <AddIcon />
                  </ListItemIcon>

                  <ListItemText primary="Lisää kirja" />
                </ListItemButton>
              </ListItem>

              <ListItem disablePadding>
                <ListItemButton
                  to="/tilasto"
                  sx={{
                    "&.Mui-selected": {
                      backgroundColor: "primary.light",
                      color: "white",
                      "&:hover": {
                        backgroundColor: "primary.main",
                      },
                    },
                  }}>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>

                  <ListItemText primary="Tilastot" />
                </ListItemButton>
              </ListItem>
            </List>
          </Box>
        </Drawer>
      )}

      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet />
      </Box>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: "auto",
          backgroundColor: "#DEB887",
        }}>
        <Container maxWidth="sm">
          <Typography
            variant="body2"
            sx={{ textAlign: "center", color: "text.primary" }}>
            Lukupäiväkirja &copy; {new Date().getFullYear()}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}

export default TabsMUI;
