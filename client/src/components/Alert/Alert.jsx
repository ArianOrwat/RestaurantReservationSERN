import React, { useState, useEffect }  from "react";
import uuid from "uuid";

import "./Alert.scss";

import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Alert = ({ messages }) => {

  return (
    <div className="alerts">
      {messages.map((message, idx) => { 

        //setTimeout(() => messages.splice(idx, 1), 5000);

          return(
        <div key={`alert-${idx}`} className={`alert ${message.type}`}>
          <FontAwesomeIcon icon={faTimes} className="close" onClick={() => console.log('lol')} />
          <p>{message.text}</p>
        </div>
      )})}
    </div>
  );
};

export default Alert;
