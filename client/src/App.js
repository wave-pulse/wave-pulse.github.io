import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  IconButton,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import Content from "./HomePage/Content";
import MapChart from "./MapChart/MapChart";
import Plots from "./Plots/Plots";
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchPage from "./SearchPage";

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
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="app-container">
              {/* Navigation Bar */}
              <AppBar position="static">
                <Toolbar>
                  {showChart && (
                    <IconButton
                      edge="start"
                      color="inherit"
                      onClick={handleGoBackHome}
                    >
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
                  <br />
                  <div className="title-container">
                    <h1 className="title">WavePulse</h1>
                    <h2 className="subtitle">
                      Real-time Content Analytics of Radio Livestreams
                    </h2>
                    <h3 className="subtitle text-sm italic">
                      To Appear at The Web Conference (WWW) 2025
                    </h3>
                  </div>
                  <Box mt={5}>
                    <Content />
                  </Box>
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

                      {/* Transcript Search */}
                      <a
                        href="/search"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="contained"
                          color="primary"
                          style={{ marginLeft: "10px" }}
                        >
                          SEARCH
                        </Button>
                      </a>
                    </Box>
                  </Box>
                </>
              ) : showChart === "map" ? (
                <MapChart />
              ) : (
                <Plots />
              )}
            </div>
          }
        />
        <Route path="/search" element={<SearchPage enableDynamicFilters={true} enableMultipleStations={true} enableMultipleStates={true} enableMultipleSpeakers={true} />}
          />
      </Routes>
    </Router>
  );
}

export default App;


