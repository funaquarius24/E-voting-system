import React from 'react';
import coat from '../images/coat-of-arms.jpeg';
import './Ballot.css';
import Parties from "./Parties"

function Ballot(props) {
  // well... shouldn't be doing it this way i know. 
  // but i'm trying to avoid redux here.
  const {candidates, address} = props;
  return (
    <div>
      <div className="first-block">
      <img src={coat} className="coat-of-arms" alt='coat of arms'></img>

      <div className="info-text">
          THE FEDERAL REPUBLIC OF NIGERIA <br />
          GENERAL ELECTION 2019 <br />
          PRESIDENTIAL ELECTION <br />
          BALLOT PAPER
      </div>
    </div>
    <div>
      <Parties candidates={candidates} address={address}></Parties>
    </div>

    </div>
    
    
  );
}

export default Ballot;
