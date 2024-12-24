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
import Content from "./HomePage/Content";
import Footer from "./HomePage/Footer";
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
            WavePulse
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Home Page */}
      {!showChart ? (
        <>
          <br/>
          <div className="title-container">
            <h1 className="title">WavePulse</h1>
            <h2 className="subtitle">Real-time Content Analytics of Radio Livestreams</h2>
          </div>
          <Box textAlign="center" mt={5}>
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
            <Content />
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
