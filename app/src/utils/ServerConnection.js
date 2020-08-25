//import React from 'react'

//0xdFb8eD7254AE9eE0c767a97a488A31CF5d350fD5

export function Vote(address, party, handleVoteAttempted){
    const data = {address: address, acronym: party};
    //console.log(data);
    fetch('/blockchain/vote', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    })
      .then(res => res.text())
      .then((blockData) => {
        if( blockData.toLocaleLowerCase().indexOf('success') !== -1){
          //console.log("success");
          handleVoteAttempted(true);
        }else{
          //console.log(blockData);
          handleVoteAttempted(false);
        }
      })
      .catch(function failureCallback(error){
        // console.log(error);
        handleVoteAttempted(false);
      });
}