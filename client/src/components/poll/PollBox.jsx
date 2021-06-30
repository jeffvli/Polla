import React from "react";
import {
  Box,
  Heading,
  Text,
  Divider,
  Link,
  SimpleGrid,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { Link as RouterLink } from "react-router-dom";

import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const PollBox = ({ poll, children, headerLeft, headerCenter, headerRight }) => {
  return (
    <>
      {poll && (
        <>
          <ResponsiveBox variant="bordered">
            <SimpleGrid columns={3}>
              <Box>{headerLeft}</Box>
              <Box>{headerCenter}</Box>
              <Box>{headerRight}</Box>
            </SimpleGrid>
            <Box pb={10}>
              <Box textAlign="center">
                <Heading fontSize={{ base: "xl", md: "3xl" }}>
                  {poll.title}
                </Heading>
              </Box>
              {poll.description && (
                <Box textAlign="center">
                  <Text as="i" fontSize="sm" mt="1rem">
                    "{poll.description}"
                  </Text>
                </Box>
              )}
            </Box>
            {children}
            <Divider mt={5} mb={5} />
            <Box mt={5} color="#5C626E">
              <Text fontSize={{ base: "sm", md: "md" }}>
                {`${
                  poll.dupCheckMode === "session"
                    ? "Session-based checking"
                    : "IP-based checking"
                } → `}
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
