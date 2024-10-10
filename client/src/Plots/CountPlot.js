import React, { useEffect, useState } from "react";
import { Line } from 'react-chartjs-2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import "chart.js/auto";
import "../styles.css";

const plotCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/sentiment-plots/';
const entropyCSV = 'https://wave-pulse-o5tct.ondigitalocean.app/api/entropy/';

const CountPlot = () => {
    const [chartData, setChartData] = useState({});
    const [entropyData, setEntropyData] = useState({});
    const [showEntropy, setShowEntropy] = useState(true);
    const [showInfo, setShowInfo] = useState(false);

    const [lineVisibility, setLineVisibility] = useState({
        bidenPositive: true,
        bidenNeutral: true,
        bidenNegative: true,
        harrisPositive: true,
        harrisNeutral: true,
        harrisNegative: true,
        trumpPositive: true,
        trumpNeutral: true,
        trumpNegative: true,
        democratsPositive: false,
        democratsNeutral: false,
        democratsNegative: false,
        republicansPositive: false,
        republicansNeutral: false,
        republicansNegative: false,
    });

    const handleModeClick = (mode) => {
        const modeMap = {
            positiveAll: ['bidenPositive', 'harrisPositive', 'trumpPositive', 'democratsPositive', 'republicansPositive'],
            neutralAll: ['bidenNeutral', 'harrisNeutral', 'trumpNeutral', 'democratsNeutral', 'republicansNeutral'],
            negativeAll: ['bidenNegative', 'harrisNegative', 'trumpNegative', 'democratsNegative', 'republicansNegative'],
            candidateAll: ['bidenPositive', 'harrisPositive', 'trumpPositive', 'bidenNeutral', 'harrisNeutral', 
                'trumpNeutral', 'bidenNegative', 'harrisNegative', 'trumpNegative'],
            partyAll: ['democratsPositive', 'republicansPositive', 'democratsNeutral', 'republicansNeutral', 
                'democratsNegative', 'republicansNegative']
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
            const bidenPositive = plotData.data.map(d => +d.Biden_Positive_Count);
            const bidenNeutral = plotData.data.map(d => +d.Biden_Neutral_Count);
            const bidenNegative = plotData.data.map(d => +d.Biden_Negative_Count);
            const trumpPositive = plotData.data.map(d => +d.Trump_Positive_Count);
            const trumpNeutral = plotData.data.map(d => +d.Trump_Neutral_Count);
            const trumpNegative = plotData.data.map(d => +d.Trump_Negative_Count);
            const harrisPositive = plotData.data.map(d => +d.Harris_Positive_Count);
            const harrisNeutral = plotData.data.map(d => +d.Harris_Neutral_Count);
            const harrisNegative = plotData.data.map(d => +d.Harris_Negative_Count);
            const democratsPositive = plotData.data.map(d => +d.Democrats_Positive_Count);
            const democratsNeutral = plotData.data.map(d => +d.Democrats_Neutral_Count);
            const democratsNegative = plotData.data.map(d => +d.Democrats_Negative_Count);
            const republicansPositive = plotData.data.map(d => +d.Republicans_Positive_Count);
            const republicansNeutral = plotData.data.map(d => +d.Republicans_Neutral_Count);
            const republicansNegative = plotData.data.map(d => +d.Republicans_Negative_Count);

            console.log('entropyData', entropyData)

            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Biden Positive',
                        data: bidenPositive,
                        borderColor: '#006400',
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.bidenPositive,
                    },
                    {
                        label: null,
                        data: bidenPositive.map(value => value + entropyData['Biden_Positive_Count'] / 2),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.bidenPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: bidenPositive.map(value => Math.max(0, value - entropyData['Biden_Positive_Count'] / 2)),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.bidenPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Biden Neutral',
                        data: bidenNeutral,
                        borderColor: '#006400',
                        borderDash: [1, 2],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.bidenNeutral,
                    },
                    {
                        label: null,
                        data: bidenNeutral.map(value => value + entropyData['Biden_Neutral_Count'] / 2),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.bidenNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: bidenNeutral.map(value => Math.max(0, value - entropyData['Biden_Neutral_Count'] / 2)),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.bidenNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Biden Negative',
                        data: bidenNegative,
                        borderColor: '#006400',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.bidenNegative,
                    },
                    {
                        label: null,
                        data: bidenNegative.map(value => value + entropyData['Biden_Negative_Count'] / 2),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.bidenNegative || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: bidenNegative.map(value => Math.max(0, value - entropyData['Biden_Negative_Count'] / 2)),
                        backgroundColor: 'rgba(0, 100, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.bidenNegative || !showEntropy,
                        pointRadius: 0,
                    },

                    {
                        label: 'Harris Positive',
                        data: harrisPositive,
                        borderColor: '#800080',
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.harrisPositive,
                    },
                    {
                        label: null,
                        data: harrisPositive.map(value => value + entropyData['Harris_Positive_Count'] / 2),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.harrisPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: harrisPositive.map(value => Math.max(0, value - entropyData['Harris_Positive_Count'] / 2)),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.harrisPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Harris Neutral',
                        data: harrisNeutral,
                        borderColor: '#800080',
                        borderDash: [1, 2],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.harrisNeutral,
                    },
                    {
                        label: null,
                        data: harrisNeutral.map(value => value + entropyData['Harris_Neutral_Count'] / 2),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.harrisNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: harrisNeutral.map(value => Math.max(0, value - entropyData['Harris_Neutral_Count'] / 2)),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.harrisNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Harris Negative',
                        data: harrisNegative,
                        borderColor: '#800080',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.harrisNegative,
                    },
                    {
                        label: null,
                        data: harrisNegative.map(value => value + entropyData['Harris_Negative_Count'] / 2),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.harrisNegative || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: harrisNegative.map(value => Math.max(0, value - entropyData['Harris_Negative_Count'] / 2)),
                        backgroundColor: 'rgba(128, 0, 128, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.harrisNegative || !showEntropy,
                        pointRadius: 0,
                    },

                    {
                        label: 'Trump Positive',
                        data: trumpPositive,
                        borderColor: '#ff7f0e',
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.trumpPositive,
                    },
                    {
                        label: null,
                        data: trumpPositive.map(value => value + entropyData['Trump_Positive_Count'] / 2),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.trumpPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: trumpPositive.map(value => Math.max(0, value - entropyData['Trump_Positive_Count'] / 2)),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.trumpPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Trump Neutral',
                        data: trumpNeutral,
                        borderColor: '#ff7f0e',
                        borderDash: [1, 2],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.trumpNeutral,
                    },
                    {
                        label: null,
                        data: trumpNeutral.map(value => value + entropyData['Trump_Neutral_Count'] / 2),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.trumpNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: trumpNeutral.map(value => Math.max(0, value - entropyData['Trump_Neutral_Count'] / 2)),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.trumpNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Trump Negative',
                        data: trumpNegative,
                        borderColor: '#ff7f0e',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.trumpNegative,
                    },
                    {
                        label: null,
                        data: trumpNegative.map(value => value + entropyData['Trump_Negative_Count'] / 2),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.trumpNegative || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: trumpNegative.map(value => Math.max(0, value - entropyData['Trump_Negative_Count'] / 2)),
                        backgroundColor: 'rgba(255, 127, 14, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.trumpNegative || !showEntropy,
                        pointRadius: 0,
                    },

                    {
                        label: 'Democrats Positive',
                        data: democratsPositive,
                        borderColor: '#0000FF',
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.democratsPositive,
                    },
                    {
                        label: null,
                        data: democratsPositive.map(value => value + entropyData['Democrats_Positive_Count'] / 2),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.democratsPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: democratsPositive.map(value => Math.max(0, value - entropyData['Democrats_Positive_Count'] / 2)),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.democratsPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Democrats Neutral',
                        data: democratsNeutral,
                        borderColor: '#0000FF',
                        borderDash: [1, 2],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.democratsNeutral,
                    },
                    {
                        label: null,
                        data: democratsNeutral.map(value => value + entropyData['Democrats_Neutral_Count'] / 2),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.democratsNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: democratsNeutral.map(value => Math.max(0, value - entropyData['Democrats_Neutral_Count'] / 2)),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.democratsNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Democrats Negative',
                        data: democratsNegative,
                        borderColor: '#0000FF',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.democratsNegative,
                    },
                    {
                        label: null,
                        data: democratsNegative.map(value => value + entropyData['Democrats_Negative_Count'] / 2),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.democratsNegative || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: democratsNegative.map(value => Math.max(0, value - entropyData['Democrats_Negative_Count'] / 2)),
                        backgroundColor: 'rgba(0, 0, 255, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.democratsNegative || !showEntropy,
                        pointRadius: 0,
                    },

                    {
                        label: 'Republicans Positive',
                        data: republicansPositive,
                        borderColor: '#FF0000',
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.republicansPositive,
                    },
                    {
                        label: null,
                        data: republicansPositive.map(value => value + entropyData['Republicans_Positive_Count'] / 2),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.republicansPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: republicansPositive.map(value => Math.max(0, value - entropyData['Republicans_Positive_Count'] / 2)),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.republicansPositive || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Republicans Neutral',
                        data: republicansNeutral,
                        borderColor: '#FF0000',
                        borderDash: [1, 2],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.republicansNeutral,
                    },
                    {
                        label: null,
                        data: republicansNeutral.map(value => value + entropyData['Republicans_Neutral_Count'] / 2),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.republicansNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: republicansNeutral.map(value => Math.max(0, value - entropyData['Republicans_Neutral_Count'] / 2)),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.republicansNeutral || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: 'Republicans Negative',
                        data: republicansNegative,
                        borderColor: '#FF0000',
                        borderDash: [5, 5],
                        fill: false,
                        pointRadius: 3,
                        pointHoverRadius: 6,
                        hidden: !lineVisibility.republicansNegative,
                    },
                    {
                        label: null,
                        data: republicansNegative.map(value => value + entropyData['Republicans_Negative_Count'] / 2),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '+1',
                        hidden: !lineVisibility.republicansNegative || !showEntropy,
                        pointRadius: 0,
                    },
                    {
                        label: null,
                        data: republicansNegative.map(value => Math.max(0, value - entropyData['Republicans_Negative_Count'] / 2)),
                        backgroundColor: 'rgba(255, 0, 0, 0.2)',
                        fill: '-1',
                        hidden: !lineVisibility.republicansNegative || !showEntropy,
                        pointRadius: 0,
                    }
                ],
            });
        })
        .catch(error => {
            console.error('Error fetching plot data:', error);
        });
    }, [lineVisibility, showEntropy, entropyData]);

    const legendClickHandler = (e, legendItem) => {
        const label = legendItem.text;

        const modeMap = {
            'Biden Positive': 'bidenPositive',
            'Biden Neutral': 'bidenNeutral',
            'Biden Negative': 'bidenNegative',
            'Trump Positive': 'trumpPositive',
            'Trump Neutral': 'trumpNeutral',
            'Trump Negative': 'trumpNegative',
            'Harris Positive': 'harrisPositive',
            'Harris Neutral': 'harrisNeutral',
            'Harris Negative': 'harrisNegative',
            'Democrats Positive': 'democratsPositive',
            'Democrats Neutral': 'democratsNeutral',
            'Democrats Negative': 'democratsNegative',
            'Republicans Positive': 'republicansPositive',
            'Republicans Neutral': 'republicansNeutral',
            'Republicans Negative': 'republicansNegative',
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
            <div className="button-container" style={{ maxWidth: "950px"}}>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("positiveAll")}
                >
                    {(lineVisibility.bidenPositive && lineVisibility.harrisPositive && lineVisibility.trumpPositive && 
                    lineVisibility.democratsPositive && lineVisibility.republicansPositive) ?
                        'Remove Positive Sentiment' : 'Show Positive Sentiment'
                    }
                </button>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("neutralAll")}
                >
                    {(lineVisibility.bidenNeutral && lineVisibility.harrisNeutral && lineVisibility.trumpNeutral && 
                    lineVisibility.democratsNeutral && lineVisibility.republicansNeutral) ?
                        'Remove Neutral Sentiment' : 'Show Neutral Sentiment'
                    }
                </button>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("negativeAll")}
                >
                    {(lineVisibility.bidenNegative && lineVisibility.harrisNegative && lineVisibility.trumpNegative && 
                    lineVisibility.democratsNegative && lineVisibility.republicansNegative) ?
                        'Remove Negative Sentiment' : 'Show Negative Sentiment'
                    }
                </button>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("candidateAll")}
                >
                    {(lineVisibility.bidenPositive && lineVisibility.harrisPositive && lineVisibility.trumpPositive && 
                    lineVisibility.bidenNeutral && lineVisibility.harrisNeutral && lineVisibility.trumpNeutral && 
                    lineVisibility.bidenNegative && lineVisibility.harrisNegative && lineVisibility.trumpNegative) ?
                        'Remove Candidate Sentiment' : 'Show Candidate Sentiment'
                    }
                </button>
                <button 
                    className="button-plot" 
                    onClick={() => handleModeClick("partyAll")}
                >
                    {(lineVisibility.democratsPositive && lineVisibility.republicansPositive && 
                    lineVisibility.democratsNeutral && lineVisibility.republicansNeutral && 
                    lineVisibility.democratsNegative && lineVisibility.republicansNegative) ?
                        'Remove Party Sentiment' : 'Show Party Sentiment'
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
                <div>
                    <Line 
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
                                        text: 'Sentiment Count',
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
                                    text: 'Sentiment Count of Candidate/ Party',
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
                                            const labelGroups = ['Biden', 'Trump', 'Harris', 'Democrats', 'Republicans'];
                                            const sentimentTypes = ['Positive', 'Neutral', 'Negative'];

                                            labelGroups.forEach(group => {
                                                sentimentTypes.forEach(type => {
                                                    if (context.dataset.label === `${group} ${type}`) {
                                                        label += ` (Entropy: ${entropyData[`${group}_${type}_Count`]})`;
                                                    }
                                                });
                                            });
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
                    />
                </div> : <p>Loading combined data...</p>
            }
        </div>
    );
}

export default CountPlot;
