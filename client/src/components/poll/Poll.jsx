import React from "react";
import PollForm from "./PollForm";
import { Box, Flex, Heading } from "@chakra-ui/react";

const Poll = () => {
  return (
    <div className="poll">
      <Box
        backgroundColor="#353A45"
        maxWidth={800}
        shadow="1px 1px 3px rgba(0,0,0,0.3)"
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
    </div>
  );
};

export default Poll;
