import React from "react";
import SentimentCombined from "./SentimentCombined";
import CountPlot from "./CountPlot";
import "../styles.css";

const Plots = () => {
    return (
        <div className="plots-container">
            <h4 align="center">Nation-wide Combined Sentiment Analysis</h4>
            <SentimentCombined />
            <hr />
            <h4 align="center">Nation-wide Sentiment Count</h4>
            <CountPlot />
            <hr />
        </div>
    );
}

export default Plots;
