import React, { useState } from "react";
import { 
  Button, 
  Typography, 
  Box, 
  AppBar, 
  Toolbar, 
  IconButton 
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import About from "./HomePage/About";
import Images from "./HomePage/Images";
import Directions from "./HomePage/Directions";
import MapChart from "./MapChart/MapChart";
import Plots from "./Plots/Plots";

function App() {
  const [showChart, setShowChart] = useState(null);

  const handleShowMap = () => {
    setShowChart("map");
  };

  const handleShowPlot = () => {
    setShowChart("bar");
  };

  const handleGoBackHome = () => {
    setShowChart(null);
  };

  return (
    <div className="app-container">
      {/* Navigation Bar */}
      <AppBar position="static">
        <Toolbar>
          {showChart && (
            <IconButton edge="start" color="inherit" onClick={handleGoBackHome}>
              <HomeIcon />
            </IconButton>
          )}
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Wave Pulse
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Home Page */}
      {!showChart ? (
        <>
          <Box textAlign="center" mt={5}>
            <Typography variant="h4" gutterBottom>
              Welcome to Wave Pulse
            </Typography>
            <About />
            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleShowMap}
                style={{ marginRight: "10px" }}
              >
                Show Map
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleShowPlot}
              >
                Show Daily Average
              </Button>
            </Box>
          </Box>
          <Box mt={5}>
            <Images />
          </Box>
          <Box mt={5}>
            <Directions />
          </Box>
        </>
      ) : showChart === "map" ? (
        <MapChart />
      ) : (
        <Plots />
      )}
      
    </div>
  );
}

export default App;
