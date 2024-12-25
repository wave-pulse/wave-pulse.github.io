import React from "react";
import "../styles.css";
import {FileText, Database, Github} from "lucide-react";
import PipelineImage from "./Images/Pipeline.jpg";
import RadioCoverageImage from "./Images/RadioCoverage.jpg";
import SentimentStatesImage from "./Images/SentimentStates.jpg";
import TranscriptsImage from "./Images/Transcripts.jpg";
import SilverWavePulseImage from "./Images/SilverWavePulse.jpg";
import NarrativeTrackerImage from "./Images/NarrativeTracker.jpg";
import SocialNetworkImage from "./Images/SocialNetwork.jpg";

const Content = () => {
    return (
        <div>
            {/* Author Section */}
            <div
                className="flex flex-col items-center text-center max-w-4xl mx-auto my-8 space-y-4">
                <div style={{textAlign: "center", justifyContent: "center"}}>
                    <div className="text-lg space-y-2">
                        {/* Authors */}
                        <div>
                            <a
                                href="https://www.linkedin.com/in/mittalgovind/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Govind Mittal
                            </a>{" "}
                            <sup>1</sup>, <br/>
                            <a
                                href="https://www.linkedin.com/in/sarthak99/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Sarthak Gupta
                            </a>
                            <sup>1</sup>,{" "}
                            <a
                                href="https://www.linkedin.com/in/shruti-wagle/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Shruti Wagle
                            </a>
                            <sup>1</sup>,{" "}
                            <a
                                href="https://www.linkedin.com/in/chiragchopra7/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Chirag Chopra
                            </a>
                            <sup>1</sup>,{" "}
                            <a
                                href="https://demattee.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Anthony J DeMattee
                            </a>
                            <sup>2</sup>,{" "}
                            <a
                                href="https://engineering.nyu.edu/faculty/nasir-memon"
                                className="text-blue-500 hover:underline"
                            >
                                Nasir Memon
                            </a>
                            <sup>1</sup>,{" "}
                            <a
                                href="https://www.cc.gatech.edu/people/mustaque-ahamad"
                                className="text-blue-500 hover:underline"
                            >
                                Mustaque Ahamad
                            </a>
                            <sup>3</sup>, <br/>
                            <a
                                href="https://chinmayhegde.github.io/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline"
                            >
                                Chinmay Hegde
                            </a>
                            <sup>1</sup>
                        </div>
                    </div>
                    {/* Affiliations */}
                    <div
                        className="text-sm italic"
                        style={{textAlign: "center", justifyContent: "center"}}
                    >
                        <div>
                            <sup>1</sup>New York University, Tandon School of
                            Engineering,
                            Brooklyn, NY, USA
                        </div>
                        <div>
                            <sup>2</sup>The Carter Center, Atlanta, GA, USA
                        </div>
                        <div>
                            <sup>3</sup>Georgia Institute of Technology,
                            Atlanta, GA, USA
                        </div>
                    </div>
                </div>
                {/* Buttons */}
                <div style={{textAlign: "center", justifyContent: "center"}}>
                    <div className="flex space-x-14 mt-4">
                        <a
                            href="https://arxiv.org/"
                            className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            <FileText size={20}/>
                            <span>Paper</span>
                        </a>
                        <a
                            href="https://huggingface.co/datasets/nyu-dice-lab/wavepulse-radio-summarized-transcripts"
                            className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            <Database size={20}/>
                            <span>Data</span>
                        </a>
                        <a
                            href="https://github.com/NYU-DICE-Lab/WavePulse"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
                        >
                            <Github size={20}/>
                            <span>Code</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="content-wrapper">
                <td
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "20px",
                        width: "100%",
                    }}
                >
                    <figure style={{
                        textAlign: "center",
                        width: "100%",
                        margin: 0,
                    }}>
                        <img
                            src={PipelineImage}
                            alt="Pipeline"
                            style={{
                                width: "100%",
                                height: "auto",
                                margin: "0 auto",
                            }}
                        />
                    </figure>
                </td>

                <div className="about-section">
                    <div>
                        <p>
                            Radio remains a pervasive medium for mass
                            information
                            dissemination,
                            with AM/FM stations reaching more Americans than
                            either
                            smartphone-based social networking or live
                            television.
                        </p>
                        <p>
                            We present WavePulse, a framework
                            that <strong>records</strong>,{" "}
                            <strong>documents</strong>, and{" "}
                            <strong>analyzes live-streamed radio content in
                                real-time</strong>.
                            We use WavePulse to monitor livestreams of 396 news
                            radio stations
                            over a period of three months, processing close to
                            500,000 hours of
                            audio streams.
                        </p>
                    </div>
                </div>
            </div>
            <td
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <figure style={{textAlign: "center"}}>
                    <img
                        src={RadioCoverageImage}
                        alt="Radio Coverage"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    />
                    <figcaption
                        className="text-center mt-2 text-sm text-gray-600"
                        style={{maxWidth: "600px", margin: "0 auto"}}>
                        Our Coverage of Radio Stations
                    </figcaption>
                </figure>
            </td>

            <div className="about-section">
                <p>
                    We <strong>transcribed</strong>, <strong>diarized</strong>,
                    <strong>summarized</strong> speech into{" "}
                    <strong>a dataset of Nation Wide Radio transcripts</strong>.
                </p>
            </div>
            <td
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <figure style={{textAlign: "center"}}>
                    <img
                        src={TranscriptsImage}
                        alt="Transcripts"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    />
                </figure>
            </td>
            <br/>

            <div className="about-section">
                <h2 style={{color: "#333333", textAlign: "center"}}>
                    Case Study #1: Tracking Spread of a Political Narrative
                </h2>

                <p>
                    We collaborated with the Carter Center which studies
                    election
                    integrity and tried to identify the provenance of a very
                    specific
                    rumor concerning the legitimacy of the 2020 Presidential
                    Election.
                    WavePulse enabled us to{" "}
                    <strong>identify positive matches for this rumor and track
                        it</strong>{" "}
                    across the US over a period of several months.
                </p>
            </div>

            <td
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <figure style={{textAlign: "center"}}>
                    <img
                        src={NarrativeTrackerImage}
                        alt="NarrativeTracker"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "1000px",
                            margin: "0 auto",
                        }}
                    />

                    <figcaption
                        className="text-center mt-2 text-sm text-gray-600">
                        # Narrative-Specific Mentions, either neutral
                        reporting, debunking
                        or promoting, encoded in the color and size of bubbles.
                    </figcaption>
                </figure>
            </td>

            <div className="about-section">
                <h2 style={{color: "#333333", textAlign: "center"}}>
                    Case Study #2: Content Syndication
                </h2>

                <p>
                    We examined <strong>content syndication across radio
                    stations</strong>{" "}
                    using transcript matching and hashing techniques to build
                    a{" "}
                    <strong>"radio syndication graph,"</strong> that revealed
                    coordinated
                    messaging strategies and has implications for media
                    diversity
                    analysis.
                </p>
            </div>



        <td
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >
            <figure>
                <img
                    src={SocialNetworkImage}
                    alt="Radio Station Network"
                    style={{width: "600px", height: "auto"}}
                />
                <figcaption
                    className="text-center mt-2 text-sm text-gray-600"
                    style={{maxWidth: "600px", margin: "0 auto"}}>
                    From 22,149 initial content groups, we identified 1,776
                    connected
                    subgroups with 2,684 unique station-to-station
                    connections. Key
                    findings include 15 major hub stations, a 10-station
                    regional
                    network, and content propagation chains where stories
                    travel between
                    states over time. Edges not shown for clarity.
                </figcaption>
            </figure>
        </td>

    <div className="about-section">
    <h2 style={{color: "#333333", textAlign: "center"}}>
                    Case Study #3: Presidential Candidates' Favorability
                    Trends{" "}
                </h2>

                <p>
                    The researchers conducted{" "}
                    <strong>NLP-based sentiment analysis</strong> on
                    presidential
                    candidate mentions in radio transcripts, converting them
                    into time
                    series data. By analyzing{" "}
                    <strong>both national and state-level trends</strong>, they
                    discovered
                    their passive radio sentiment tracking{" "}
                    <strong>closely matched traditional polling data</strong>.
                    This
                    suggests WavePulse provides a viable complementary method
                    for
                    monitoring public opinion through web-accessible radio
                    content.
                </p>
            </div>

            <td
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <figure style={{textAlign: "center"}}>
                    <img
                        src={SilverWavePulseImage}
                        alt="SilverWavePulse"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    />
                    <figcaption
                        className="text-center mt-2 text-sm text-gray-600"
                        style={{maxWidth: "600px", margin: "0 auto"}}>
                        A dual-panel visualization comparing polling and radio
                        sentiment
                        data from July-September 2024. The top panel shows{" "}
                        <strong>traditional polling averages</strong> for Trump
                        and Harris
                        from the{" "}
                        <a
                            href="https://www.natesilver.net/p/nate-silver-2024-president-election-polls-model"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Silver Bulletin
                        </a>
                        , while the bottom displays{" "}
                        <strong>radio-derived sentiment scores</strong> using a
                        7-day
                        average. A notable spike occurs in Harris's sentiment
                        when Biden
                        withdrew.
                    </figcaption>
                </figure>
            </td>

            <td
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <figure style={{textAlign: "center"}}>
                    <img
                        src={SentimentStatesImage}
                        alt="Sentiment Trends by State"
                        style={{
                            width: "100%",
                            height: "auto",
                            maxWidth: "600px",
                            margin: "0 auto",
                        }}
                    />
                    <figcaption
                        className="text-center mt-2 text-sm text-gray-600"
                        style={{maxWidth: "600px", margin: "0 auto"}}>
                        A U.S. map showing {" "}
                        <strong>state-level political sentiment trends</strong> with
                        regional
                        color-coding to visualize geographic patterns.
                    </figcaption>
                </figure>
            </td>
            <div className="about-section">
                <h2 style={{color: "#333333", textAlign: "center"}}>
                    Wave-Pulse.io Navigation Guide
                </h2>

                <p>
                    Welcome to <strong>Wave Pulse</strong>, our integrated
                    platform for
                    analyzing radio content patterns and sentiment trends
                    across the
                    United States. This guide outlines the key features and
                    navigation
                    tools available to you.
                </p>

                <p>
                    <strong>Interactive Map Visualization</strong>
                    <br/>
                    Access our comprehensive map interface by selecting{" "}
                    <strong>"Show Map"</strong>. Through the <strong>"Select
                    Map"</strong>{" "}
                    dropdown, you can explore multiple visualization modes:
                </p>

                <p>
                    - <strong>State Party - Relative</strong>: View
                    proportional party
                    sentiment analysis
                    <br/>- <strong>State Party - Absolute</strong>: Examine raw
                    party
                    sentiment data
                    <br/>- <strong>State Candidate - Relative</strong>: Study
                    proportional candidate sentiment trends
                    <br/>- <strong>State Candidate - Absolute</strong>: Review
                    raw
                    candidate sentiment metrics
                </p>

                <p>
                    <strong>Data Enhancement Options</strong>
                    <br/>
                    Augment your visualization with additional data layers
                    using the{" "}
                    <strong>"Select Overlay"</strong> menu:
                </p>

                <p>
                    - <strong>Radio Coverage</strong>: Examine broadcast reach
                    and
                    penetration
                    <br/>- <strong>Population Distribution</strong>: View
                    demographic
                    density patterns
                    <br/>- <strong>County Boundaries</strong>: Add detailed
                    geographic
                    delineation
                </p>

                <p>
                    <strong>Narrative Analytics</strong>
                    <br/>
                    Through the <strong>"Select Narrative"</strong> dropdown,
                    access
                    focused analytical views such as the 'Georgia Election
                    Stolen'
                    analysis. For clarity and precision, the system displays
                    one narrative
                    analysis at a time.
                </p>

                <p>
                    <strong>Trend Analysis</strong>
                    <br/>
                    Access detailed temporal analysis through the{" "}
                    <strong>"Show Daily Average"</strong> feature, which
                    provides
                    comprehensive charts and summaries of data patterns over
                    time.
                </p>

                <p>
                    <strong>Navigation</strong>
                    <br/>
                    The <strong>Home</strong> icon in the top-left corner
                    serves as your
                    anchor point, allowing you to return to the Home Page at
                    any time. As
                    you navigate through different views and analyses, the
                    system provides
                    confirmation notifications to acknowledge your selections.
                </p>

                <p>
                    This interface design prioritizes efficient access to our
                    analytical
                    tools while maintaining intuitive navigation through the
                    platform's
                    comprehensive feature set. Each visualization and analysis
                    option has
                    been carefully structured to provide maximum insight with
                    minimal
                    complexity.
                </p>
            </div>
        </div>
    );
};

export default Content;
