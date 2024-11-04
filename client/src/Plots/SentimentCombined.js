import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "chart.js/auto";
import "../styles.css";

const plotCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/sentiment-plots/';
const entropyCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/entropy/';

const movingAverage = (data, dates, windowSize) => {
    const completeDates = [];
    const dateToValueMap = {};

    dates.forEach((date, index) => {
        dateToValueMap[date] = data[index];
    });

    const startDate = new Date(dates[0]);
    const endDate = new Date(dates[dates.length - 1]);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dateString = d.toISOString().split('T')[0];
        completeDates.push(dateString);
    }

    const completeData = completeDates.map(date => dateToValueMap[date] || null);

    let averages = [];
    for (let i = 0; i < completeData.length; i++) {
        let window = completeData.slice(Math.max(0, i - windowSize + 1), i + 1);
        
        let validValues = window.filter(value => 
            value !== null && 
            value !== undefined && 
            !isNaN(value)
        );

        if (validValues.length > 0) {
            let average = validValues.reduce((a, b) => a + b, 0) / validValues.length;
            averages.push(parseFloat(average.toFixed(2)));
        } else {
            averages.push(null);
        }
    }
    return averages;
};

const SentimentCombined = () => {
    const [chartData, setChartData] = useState({});
    const [entropyData, setEntropyData] = useState({});
    const [showEntropy, setShowEntropy] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    const [lineVisibility, setLineVisibility] = useState({
        bidenMean: false,
        bidenMA: true,
        harrisMean: false,
        harrisMA: true,
        trumpMean: false,
        trumpMA: true,
        democratsMean: false,
        democratsMA: true,
        republicansMean: false,
        republicansMA: true,
    });

    const handleModeClick = (mode) => {
        const modeMap = {
            absoluteMean: ['bidenMean', 'trumpMean', 'harrisMean', 'democratsMean', 'republicansMean'],
            normalMA: ['bidenMA', 'trumpMA', 'harrisMA', 'democratsMA', 'republicansMA'],
        };

        const linesToUpdate = modeMap[mode];
        const shouldShowAll = linesToUpdate.some(line => !lineVisibility[line]);

        setLineVisibility(prevVisibility => {
            const newVisibility = { ...prevVisibility };
            linesToUpdate.forEach(line => {
                newVisibility[line] = shouldShowAll;
            });
            return newVisibility;
        });
    };

    const handleClearAllClick = () => {
        setLineVisibility(prevVisibility => {
            const newVisibility = { ...prevVisibility };
            Object.keys(newVisibility).forEach(key => {
                newVisibility[key] = false;
            });
            return newVisibility;
        });
    };

    const handleInfoClick = () => {
        setShowInfo(!showInfo);
    };

    useEffect(() => {
        axios.get(entropyCSV)
        .then(response => {
            setEntropyData(response.data);
        })
        .catch(error => {
            console.error('Error fetching the entropy data:', error);
        });
    }, [])

    useEffect(() => {
        axios.get(plotCSV)
        .then(plotData => {
            const labels = plotData.data.map(d => d.Date);
            
            // Convert sentiment values to numbers, preserving exact data
            const bidenData = plotData.data.map(d => +d.Biden_Combined_Sentiment);
            const trumpData = plotData.data.map(d => +d.Trump_Combined_Sentiment);
            const harrisData = plotData.data.map(d => +d.Harris_Combined_Sentiment);
            const democratsData = plotData.data.map(d => +d.Democrats_Combined_Sentiment);
            const republicansData = plotData.data.map(d => +d.Republicans_Combined_Sentiment);

            // Calculate moving averages with improved handling
            const windowSize = 3;
            const bidenMA = movingAverage(bidenData, labels, windowSize);
            const trumpMA = movingAverage(trumpData, labels, windowSize);
            const harrisMA = movingAverage(harrisData, labels, windowSize);
            const democratsMA = movingAverage(democratsData, labels, windowSize);
            const republicansMA = movingAverage(republicansData, labels, windowSize);


            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Biden Mean',
                        data: bidenData,
                        borderColor: '#006400', // Green
                        fill: false,
                        hidden: !lineVisibility.bidenMean,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: bidenData.map(value => value + entropyData['Biden_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)', 
                        fill: '+1', 
                        hidden: !lineVisibility.bidenMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: bidenData.map(value => Math.max(0, value - entropyData['Biden_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)', 
                        fill: '-1', 
                        hidden: !lineVisibility.bidenMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Biden 3-Day MA',
                        data: bidenMA,
                        borderColor: '#006400', // Green
                        borderDash: [5, 5],
                        fill: false,
                        hidden: !lineVisibility.bidenMA,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: bidenMA.map(value => value + entropyData['Biden_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)', 
                        fill: '+1', 
                        hidden: !lineVisibility.bidenMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: bidenMA.map(value => Math.max(0, value - entropyData['Biden_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)', 
                        fill: '-1', 
                        hidden: !lineVisibility.bidenMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Harris Mean',
                        data: harrisData,
                        borderColor: '#800080', // Purple
                        fill: false,
                        hidden: !lineVisibility.harrisMean,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: harrisData.map(value => value + entropyData['Harris_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.harrisMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: harrisData.map(value => Math.max(0, value - entropyData['Harris_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.harrisMean || !showEntropy,
                        pointRadius: 0,
                    },   
                    {
                        label: 'Harris 3-Day MA',
                        data: harrisMA,
                        borderColor: '#800080', // Purple
                        borderDash: [5, 5],
                        fill: false,
                        hidden: !lineVisibility.harrisMA,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: harrisMA.map(value => value + entropyData['Harris_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.harrisMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: harrisMA.map(value => Math.max(0, value - entropyData['Harris_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.harrisMA || !showEntropy,
                        pointRadius: 0,
                    },    
                    
                    {
                        label: 'Trump Mean',
                        data: trumpData,
                        borderColor: '#ff7f0e', // Orange
                        fill: false,
                        hidden: !lineVisibility.trumpMean,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: trumpData.map(value => value + entropyData['Trump_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.trumpMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: trumpData.map(value => Math.max(0, value - entropyData['Trump_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.trumpMean || !showEntropy,
                        pointRadius: 0,
                    },           
                    {
                        label: 'Trump 3-Day MA',
                        data: trumpMA,
                        borderColor: '#ff7f0e', // Orange
                        borderDash: [5, 5],
                        fill: false,
                        hidden: !lineVisibility.trumpMA,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: trumpMA.map(value => value + entropyData['Trump_Combined_Sentiment'] / 2),
                        bbackgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.trumpMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: trumpMA.map(value => Math.max(0, value - entropyData['Trump_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.trumpMA || !showEntropy,
                        pointRadius: 0,
                    },        

                    {
                        label: 'Democrats Mean',
                        data: democratsData,
                        borderColor: '#0000FF', // Blue
                        fill: false,
                        hidden: !lineVisibility.democratsMean,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: democratsData.map(value => value + entropyData['Democrats_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.democratsMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: democratsData.map(value => Math.max(0, value - entropyData['Democrats_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.democratsMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Democrats 3-Day MA',
                        data: democratsMA,
                        borderColor: '#0000FF', // Blue
                        borderDash: [5, 5],
                        fill: false,
                        hidden: !lineVisibility.democratsMA,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: democratsMA.map(value => value + entropyData['Democrats_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.democratsMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: democratsMA.map(value => Math.max(0, value - entropyData['Democrats_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.democratsMA || !showEntropy,
                        pointRadius: 0,
                    },

                    {
                        label: 'Republicans Mean',
                        data: republicansData,
                        borderColor: '#FF0000', // Red
                        fill: false,
                        hidden: !lineVisibility.republicansMean,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: republicansData.map(value => value + entropyData['Republicans_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.republicansMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: republicansData.map(value => Math.max(0, value - entropyData['Republicans_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.republicansMean || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Republicans 3-Day MA',
                        data: republicansMA,
                        borderColor: '#FF0000', // Red
                        borderDash: [5, 5],
                        fill: false,
                        hidden: !lineVisibility.republicansMA,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                    },
                    {
                        label: null,
                        data: republicansMA.map(value => value + entropyData['Republicans_Combined_Sentiment'] / 2),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '+1', 
                        hidden: !lineVisibility.republicansMA || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: republicansMA.map(value => Math.max(0, value - entropyData['Republicans_Combined_Sentiment'] / 2)),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '-1', 
                        hidden: !lineVisibility.republicansMA || !showEntropy,
                        pointRadius: 0,
                    },
                ],
            });
        })
        .catch(error => {
            console.error('Error fetching the sentiment data:', error);
        });
    }, [lineVisibility, showEntropy, entropyData]);

    const legendClickHandler = (e, legendItem) => {
        const label = legendItem.text;

        const modeMap = {
            'Biden Mean': 'bidenMean',
            'Biden 3-Day MA': 'bidenMA',
            'Trump Mean': 'trumpMean',
            'Trump 3-Day MA': 'trumpMA',
            'Harris Mean': 'harrisMean',
            'Harris 3-Day MA': 'harrisMA',
            'Democrats Mean': 'democratsMean',
            'Democrats 3-Day MA': 'democratsMA',
            'Republicans Mean': 'republicansMean',
            'Republicans 3-Day MA': 'republicansMA',
        };

        const mode = modeMap[label];
        if (mode) {
            setLineVisibility(prevVisibility => ({
                ...prevVisibility,
                [mode]: !prevVisibility[mode]
            }));
        }
    };

    const handleToggleEntropyClick = () => {
        setShowEntropy(prevShowEntropy => !prevShowEntropy);
    };

    return (
        <div>
            <div className="button-container" style={{ maxWidth: "300px" }}>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("absoluteMean")}
                >
                    {(lineVisibility.bidenMean && lineVisibility.harrisMean && lineVisibility.trumpMean && 
                        lineVisibility.democratsMean && lineVisibility.republicansMean) ?
                        'Remove Absolute Mean' : 'Show Absolute Mean'
                    }
                </button>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("normalMA")}
                >                 
                    {(lineVisibility.bidenMA && lineVisibility.harrisMA && lineVisibility.trumpMA && 
                        lineVisibility.democratsMA && lineVisibility.republicansMA) ?
                        'Remove 3-Day MA' : 'Show 3-Day MA'
                    }
                </button>
            </div>
            <div className="button-container" style={{ maxWidth: showInfo ? '700px' : '200px' }}>
                <button 
                    className="button-plot" 
                    onClick={handleClearAllClick}
                    style={{ backgroundColor: '#800000' }}
                >
                    Clear All
                </button>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                        className="button-plot" 
                        onClick={handleToggleEntropyClick}
                        style={{ backgroundColor: '#006400' }}
                    >
                        {showEntropy ? 'Remove Spread' : 'Show Spread'}
                    </button>
                    <FontAwesomeIcon 
                        icon={faInfoCircle} 
                        style={{ 
                            marginLeft: '-50px', 
                            cursor: 'pointer', 
                            color: showInfo ? '#333333' : '#006400'
                        }} 
                        onClick={handleInfoClick}
                    />
                    {showInfo && (
                        <div className="explanation" style={{ maxWidth: "500px" }}>
                            <span>
                                The spread/ entropy value for each entity, respresents the degree of disorder or randomness 
                                associated with the data for that entity. 
                                A lower entropy value indicates more order or predictability within that category, 
                                whereas a higher entropy value indicates more disorder or randomness within that category.
                            </span>
                        </div>
                    )}
                </div>
            </div>
            {chartData.labels ? 
                <Line 
                    type='line'
                    data={chartData} 
                    options={{
                        scales: {
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date',
                                },
                                ticks: {
                                    maxRotation: 90,
                                    minRotation: 45,
                                },
                            },
                            y: {
                                title: {
                                    display: true,
                                    text: 'Combined Sentiment',
                                },
                            },
                        },
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
                                align: 'start',
                                onClick: legendClickHandler,
                                labels: {
                                    filter: function(legendItem) {
                                        return legendItem.text !== null;
                                    }
                                }
                            },
                            title: {
                                display: true,
                                text: 'Combined Sentiment of Candidate/ Party',
                            },
                            tooltip: {
                                callbacks: {
                                    label: (context) => {
                                        let label = context.dataset.label || '';
                                        if (label) {
                                            label += ': ';
                                        }
                                        if (context.parsed.y !== null) {
                                            label += context.parsed.y;
                                        }
                                        const entropyKey = label.split(' ')[0] + '_Combined_Sentiment';
                                        const entropy = entropyData[entropyKey];
                                        if (entropy) {
                                            const adjustedEntropy = (entropy / 2).toFixed(2);
                                            label += ` (Entropy: ±${adjustedEntropy})`;
                                        }
                                        return label;
                                    },
                                    labelColor: (context) => {
                                        return {
                                            borderColor: context.dataset.borderColor,
                                            backgroundColor: context.dataset.borderColor,
                                            borderWidth: 2,
                                            padding: 6,
                                        };
                                    }
                                }
                            },
                        },
                    }} 
                /> : <p>Loading data...</p>}
        </div>
    );
}

export default SentimentCombined;
