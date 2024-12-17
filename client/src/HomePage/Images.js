import React from 'react';
import PipelineImage from './Images/Pipeline.jpg';
import RadioCoverageImage from './Images/RadioCoverage.jpg';
import SentimentStatesImage from './Images/SentimentStates.jpg';
import SocialNetworkImage from './Images/SocialNetwork.jpg';

function App() {
  return (
    <div> 
      <hr />     
      <br /> 
      <table style={{ width: '50%', margin: '0 auto', borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td style={{ textAlign: 'center', padding: '10px' }}>
              <figure>
                <img 
                  src={PipelineImage} 
                  alt="Pipeline 1" 
                  style={{ width: '600px', height: 'auto' }} 
                />
                <figcaption>Pipeline</figcaption>
              </figure>
            </td>
            <td style={{ textAlign: 'center', padding: '10px' }}>
              <figure>
                <img 
                  src={RadioCoverageImage} 
                  alt="Radio Coverage" 
                  style={{ width: '600px', height: 'auto' }} 
                />
                <figcaption>Radio Coverage</figcaption>
              </figure>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'center', padding: '10px' }}>
              <figure>
                <img 
                  src={SentimentStatesImage} 
                  alt="Sentiment States" 
                  style={{ width: '600px', height: 'auto' }} 
                />
                <figcaption>Sentiment States</figcaption>
              </figure>
            </td>
            <td style={{ textAlign: 'center', padding: '10px' }}>
              <figure>
                <img 
                  src={SocialNetworkImage} 
                  alt="Social Network" 
                  style={{ width: '600px', height: 'auto' }} 
                />
                <figcaption>Social Network</figcaption>
              </figure>
            </td>
          </tr>
        </tbody>
      </table>
      <hr />

    </div>
  );
}

export default App;
