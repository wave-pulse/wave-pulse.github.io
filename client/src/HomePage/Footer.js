import React from 'react';

const Footer = () => {
    return (
        <div className="footer">
            <p>WavePulse</p>
            <p>
                <span className="author">Govind Mittal<sup>*</sup> </span>
                <span className="author">Sarthak Gupta<sup>*</sup> </span>
                <span className="author">Shruti Wagle<sup>*</sup> </span>
                <span className="author">Chirag Chopra<sup>*</sup> </span>
                <span className="author">Anthony J DeMattee<sup>**</sup> </span>
                <span className="author">Nasir Memon<sup>*</sup> </span>
                <span className="author">Mustaque Ahamad<sup>***</sup> </span>
                <span className="author">Chinmay Hegde<sup>*</sup> </span>
            </p>
            <p className="affiliation">*New York University, Tandon School of Engineering, Brooklyn, NY, USA</p>
            <p className="affiliation">**The Carter Center, Atlanta, GA, USA</p>
            <p className="affiliation">***Georgia Institute of Technology, Atlanta, GA, USA</p>
      </div>
    )
}

export default Footer;