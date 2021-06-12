import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

function PollResults() {
  const [response, setResponse] = useState("");
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.on("Responses", (data) => {
      setResponse(data);
    });
  }, []);
  return (
    <>
      {response &&
        response.map((res, i) => {
          return <div key={i}>PollId is {res.pollId}</div>;
        })}{" "}
    </>
  );
}

export default PollResults;
