import React from 'react';
import './../styles.css';
import PipelineImage from './Images/Pipeline.jpg';
import RadioCoverageImage from './Images/RadioCoverage.jpg';
import SentimentStatesImage from './Images/SentimentStates.jpg';
import SocialNetworkImage from './Images/SocialNetwork.jpg';

const Content = () => {
  return (
    <div>

        <div className="about-section">
            <h2 style={{ color: "#333333", textAlign: "center" }}>
                Abstract
            </h2>

            <div>
                <p>
                Radio remains a pervasive medium for mass information dissemination,
                with AM/FM stations reaching more Americans than either smartphone-based social networking or live television.
                Increasingly, radio broadcasts are also streamed online and accessed over the Internet.
                </p>
                <p>
                We present <strong>WavePulse</strong>, a framework that records, documents, and analyzes radio content in real-time.
                While our framework is generally applicable, we showcase the efficacy of WavePulse in a collaborative project
                with a team of political scientists focusing on the 2024 Presidential Elections. We use WavePulse to monitor
                livestreams of 396 news radio stations over a period of three months, processing close to 500,000 hours of audio streams.
                </p>
                <p>
                These streams were converted into time-stamped, diarized transcripts and analyzed to track answer key political science
                questions at both the national and state levels. Our analysis revealed how local issues interacted with national trends,
                providing insights into information flow. Our results demonstrate WavePulse's efficacy in capturing and analyzing content
                from radio livestreams sourced from the Web.
                </p>
            </div>
        </div>

        <div className="about-section">
            <h2 style={{ color: "#333333", textAlign: "center" }}>
                Directions for Navigating Wave Pulse
            </h2>

            <p >
                Welcome to <strong>Wave Pulse</strong>! This platform provides an
                intuitive way to explore data through geographical visualizations and
                analytical charts. Upon loading the website, you will arrive at the{" "}
                <strong>Home Page</strong>. Here, you’ll be greeted with a welcome
                message and an introduction in the <strong>About</strong> section,
                which gives you insights into the purpose and functionality of Wave
                Pulse.
            </p>
            <p>To explore the platform, click on:</p>

            <p>
                <strong>"Show Map"</strong> to view an <strong>interactive map</strong> of
                state and county-level data.
            </p>

            <p>
                Use the <strong>"Select Map"</strong> dropdown to choose:
                - <strong>State Party - Relative</strong>: Relative sentiment by party. <br />
                - <strong>State Party - Absolute</strong>: Absolute counts by party. <br />
                - <strong>State Candidate - Relative</strong>: Relative sentiment by candidate. <br />
                - <strong>State Candidate - Absolute</strong>: Absolute counts by candidate.
            </p>

            <p>
                Use the <strong>"Select Overlay"</strong> dropdown to toggle:
                - <strong>Show Coverage</strong>: Displays radio coverage. <br />
                - <strong>Show Population</strong>: Highlights population data. <br />
                - <strong>Show County Map</strong>: Adds county boundaries.
            </p>

            <p>
                Use the <strong>"Select Narrative"</strong> dropdown to display specific
                narratives like <strong>'Georgia Election Stolen'</strong>. Only one
                narrative can be active at a time.
                <br />
                <strong>"Show Daily Average"</strong> displays analytical charts and plots
                summarizing daily trends in the data.
                <br />
                When you are viewing either the <strong>Map</strong> or the{" "}
                <strong>Daily Average</strong> chart, you can always return to the{" "}
                <strong>Home Page</strong> by clicking the <strong>Home</strong> icon
                in the top-left corner.
                <br />
                Enjoy exploring the rich features of Wave Pulse, and use the map and
                overlays to gain detailed insights into state and candidate-level
                data. Toast notifications will confirm changes as you explore.
            </p>
        </div>

        <table style={{ width: '50%', margin: '0 auto', borderCollapse: 'collapse' }}>
            <tbody>
            <tr>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                <figure>
                    <img 
                    src={PipelineImage} 
                    alt="Pipeline" 
                    style={{ width: '600px', height: 'auto' }} 
                    />
                    <figcaption className="figcaption">
                    A flowchart illustrating the WavePulse system's workflow. 
                    It includes components for radio streaming, audio processing (speech recognition and speaker diarization), content classification (categorizing into political, apolitical, ads, or news/discussion), and analytics (such as tracking political trends, matching fact-checks, and constructing a social network of radio stations). 
                    The pipeline emphasizes the integration of AI-driven tools for comprehensive radio content analysis.
                    </figcaption>
                </figure>
                </td>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                <figure>
                    <img 
                    src={RadioCoverageImage} 
                    alt="Radio Coverage" 
                    style={{ width: '600px', height: 'auto' }} 
                    />
                    <figcaption className="figcaption">
                    A U.S. map displaying the geographic distribution of AM, FM, and News/Talk radio stations. 
                    Red dots indicate News/Talk stations, while other colored markers represent AM, FM, and other station types. 
                    The map showcases the concentration of stations across different states, with notable density in urban and highly populated regions.
                    </figcaption>
                </figure>
                </td>
            </tr>
            </tbody>
        </table>

        <div className="about-section">
            <h2 style={{ color: "#333333", textAlign: "center" }}>
                Introduction
            </h2>

            <p>
                This paper introduces WavePulse, an end-to-end system for real-time acquisition, transcription, speaker diarization, curation, and content analysis of up to several hundreds of radio livestreams sourced from URL's accessible via the Web. 
                The key feature of WavePulse is that most of the system components are built using powerful AI tools such as modern, multimodal large language models (LLMs) which have witnessed significant advances in 2024. 
                This feature enables rapid design and deployment, and showcases AI's potential as a valuable tool for worldwide broadcast media analysis. 
                </p>

                <p>
                We report our findings from a pilot deployment of WavePulse that encompassed 396 AM/FM radio streams spanning all 50 US states, where we placed a strong emphasis on political news broadcasts recorded continuously over a 100-day period from late June to late September 2024. 
                This time period captures a significant period of American political history, which included pivotal events such as controversial debates, two assassination attempts on a presidential candidate, an unexpected campaign withdrawal by the sitting US President, and several other key political milestones.  

                <ul>
                <li>
                <strong>Monitoring narratives and rumors: </strong> 
                In our first case study, we collaborated with a team of political scientists studying election integrity and trying to identify the provenance of a very specific rumor concerning the legitimacy of the 2020 Presidential Election (which continues to echo through the political discourse 4 years later). 
                Our system enabled us to identify positive matches for this rumor and track it across the US over a period of several months.
                </li>
                <li>
                <strong>Understanding content syndication patterns: </strong> 
                In our second case study, we study content syndication across geographically dispersed radio stations. 
                Using techniques from transcript de-duplication and hashing-based matching, we construct a virtual “radio syndication graph” and find communities/clusters in this graph that frequently mirror each others' (sometimes even niche) content. 
                Such tools can potentially be used to study nationwide media diversity and analyze longitudinal information spread.
                </li>
                <li>
                <strong>Measuring political trends: </strong> 
                In our third case study, we perform NLP-based sentiment analysis of chunks of transcripts related to specific candidates in the US Presidential Election, curate them into scalar time series, and visualize national and state-wise trends over given time periods. 
                Remarkably, we find that our sentiment scores (gathered in a purely passive manner) mirror national polling trends, showing that WavePulse can be used as a supplementary tool for tracking public opinion over the web.
                </li>
            </ul>
            </p>
        </div>

        <br /> 

        <div className="about-section">
            <h2 style={{ color: "#333333", textAlign: "center" }}>
                Our Contributions
            </h2>

            <p>
            <ul>
                <li>
                An end-to-end framework for recording, transcribing, and performing analytics on the radio.
                </li>
                <li>
                A data pipeline to convert raw transcripts into their rich counterparts by time-stamping, diarizing, summarizing, and classifying into ads, news, discussion, and ancillary content.
                </li>
                <li>
                Rich analysis, including topic modeling to distill top emerging narratives, and sentiment analysis to gauge political temperament across the United States, stratified by state and time interval.
                </li>
                <li>
                Three case studies, stemming from a collaboration with a non-profit center for monitoring election integrity.
                </li>
                <li>
                A self-updating interactive website for our analytics.
                </li>
            </ul>
            </p>
        </div>

        <table style={{ width: '50%', margin: '0 auto', borderCollapse: 'collapse' }}>
            <tbody>
            <tr>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                <figure>
                    <img 
                    src={SentimentStatesImage} 
                    alt="Sentiment Trends by State" 
                    style={{ width: '600px', height: 'auto' }} 
                    />
                    <figcaption className="figcaption">
                    A U.S. map displaying sentiment trends across states during a specific political period. 
                    Each state has a small plot visualizing sentiment data, with trends for Democratic ("D") and Republican ("R") support. 
                    The color-coded regions represent different U.S. geographical divisions, such as Pacific, Midwest, and Southern, providing insights into political sentiment variations across states.
                    </figcaption>
                </figure>
                </td>
                <td style={{ textAlign: 'center', padding: '10px' }}>
                <figure>
                    <img 
                    src={SocialNetworkImage} 
                    alt="Radio Station Network" 
                    style={{ width: '600px', height: 'auto' }} 
                    />
                    <figcaption className="figcaption">
                    A map visualizing the connections between radio stations across the U.S., based on content syndication patterns during a specific timeframe. 
                    Dots represent radio stations, with colors indicating their level of connectivity (e.g., red for less than 8 connections, yellow for 8-15 connections, blue for more than 15 connections). 
                    Lines between stations highlight syndication links, forming a network graph of radio content distribution.
                    </figcaption>
                </figure>
                </td>
            </tr>
            </tbody>
        </table>

        <div className="about-section">
            <h2 style={{ color: "#333333", textAlign: "center" }}>
                Conclusion
            </h2>

            <p>
                Our analysis does not incorporate population data along with the reach of each station's waves to calculate exposure to each station. 
                Nielsen Audio sells exposure ratings, and the FCC hosts ground conductivity data. 
                We also included only stations that are livestreamed over the Internet. 
                Terrestrial-only radio broadcasts would require dedicated hardware, such as an antenna, transceiver, and recording equipment.
            </p>
            <p>
                Finally, while WavePulse is widely applicable, our analysis derives results and conclusions from only U.S. radios. 
                An important direction of future work is to broaden the scope to worldwide radio livestreams. 
                Due to the multilingual nature of LLMs, we anticipate our system can scale up with no significant design changes.
            </p>
            <p>
                While we are confident about WavePulse's scalability and error rates, our analyses should be considered within the context of case studies. 
                A comprehensive evaluation would require interdisciplinary collaboration and usage-based assessment. 
                Our case studies demonstrate a non-exhaustive variant of general-purpose tasks, including search, finding syndicate networks, and sentiment analysis, that WavePulse can perform.
            </p>
            <p>
                We introduce WavePulse, an end-to-end pipeline for gathering and analyzing live-stream radio broadcasts, which can increasingly be accessed via the Web. 
                Using this system, we collected nearly half a million hours of news/talk radio content over a 100-day period of significant political activity in the United States. 
                We conducted three case studies: tracking political narratives with political scientists, building a social network of radio stations, and predicting political trends in real-time. 
                Our findings highlight the depth of insights derivable from WavePulse's comprehensive dataset.
            </p>
        </div>
    </div>
  );
};

export default Content;