import React from "react";
import { Helmet } from "react-helmet-async";

import PollList from "../list/PollList";

const Discover = () => {
  return (
    <>
      <Helmet>
        <title>Discover Polls | Polla</title>
      </Helmet>
      <PollList username="" />
    </>
  );
};

export default Discover;
