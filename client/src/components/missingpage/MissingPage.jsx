import React from "react";
import { Link, Box, Text } from "@chakra-ui/layout";
import { Link as RouterLink } from "react-router-dom";

const MissingPage = () => {
  return (
    <Box ml={5}>
      <Text fontSize="xl">You have reached an invalid page</Text>
      <Link as={RouterLink} to="/">
        Return home
      </Link>
    </Box>
  );
};

export default MissingPage;
