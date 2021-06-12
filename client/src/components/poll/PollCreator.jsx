import React from "react";
import { Box, Heading } from "@chakra-ui/react";

import PollForm from "./PollForm";

const PollCreator = () => {
  return (
    <Box
      backgroundColor="#2C3039"
      maxWidth={800}
      shadow="1px 1px 3px 3px rgba(0,0,0,0.3)"
      borderRadius="lg"
      p={5}
      m="auto"
    >
      <Box textAlign="center" pb={10}>
        <Heading>Create a Polla</Heading>
      </Box>
      <Box>
        <PollForm />
      </Box>
    </Box>
  );
};

export default PollCreator;
