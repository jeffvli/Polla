import React from "react";
import { Box, Heading, Text, Divider, Link } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { Link as RouterLink } from "react-router-dom";

import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const PollBox = ({ poll, children }) => {
  return (
    <>
      {poll && (
        <>
          <ResponsiveBox variant="bordered">
            <Box textAlign="center" pb={10}>
              <Heading>{poll.title}</Heading>
              <Text fontSize="sm" mt="1rem">
                {poll.description}
              </Text>
            </Box>
            {children}
            <Divider mt={5} mb={5} />
            <Box mt={5} color="#5C626E">
              <Text>
                {"Created → "}
                {formatDistance(new Date(poll.createdAt), new Date(), {
                  addSuffix: true,
                })}
                {" • "}
                <Link
                  as={RouterLink}
                  to={poll.username ? `/profile/${poll.username}` : "#"}
                >
                  {" "}
                  {poll.username ? poll.username : "anonymous"}
                </Link>
              </Text>
            </Box>
          </ResponsiveBox>
        </>
      )}
    </>
  );
};

export default PollBox;
