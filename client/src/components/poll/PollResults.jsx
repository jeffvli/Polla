import { io } from "socket.io-client";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Stack,
  Progress,
  CircularProgress,
  Center,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import _ from "lodash";
import Cookies from "universal-cookie";

import PollBox from "./PollBox";
import PollShare from "./PollShare";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";
import { nanoid } from "nanoid";
const ENDPOINT = "http://localhost:5000";

function PollResults({ user }) {
  const { pollSlug } = useParams();
  const [poll, setPoll] = useState();
  const [totalResponders, setTotalResponders] = useState();
  const [totalResponses, setTotalResponses] = useState();
  const cookies = new Cookies();

  useEffect(() => {
    //const socket = socketIOClient(ENDPOINT);
    const socket = io.connect(ENDPOINT, { query: `pollSlug=${pollSlug}` });

    socket.on("Responses", (data) => {
      let allResponses = [];
      let responseCount = 0;

      const sessionId = cookies.get("sessionId");
      data.pollQuestions.map((q) => {
        allResponses.push(q.pollResponses);
      });

      const nonNullResponses = allResponses.filter((r) => {
        return r.length > 0;
      });

      nonNullResponses.map((r) => {
        responseCount += r.length;
      });

      const usersCount = _.uniqBy(allResponses, "ipAddress").length;

      setPoll(data);
      setTotalResponders(usersCount);
      setTotalResponses(responseCount);
    });
  }, []);

  return (
    <>
      {!poll && (
        <Center>
          <Stack>
            <CircularProgress isIndeterminate color="blue.300" m="auto" />
            <Text>Loading...</Text>
          </Stack>
        </Center>
      )}
      {poll && (
        <>
          <PollBox poll={poll}>
            <Stack spacing={8}>
              {poll.pollQuestions.map((question) => (
                <Box key={nanoid()}>
                  <Flex>
                    <Text fontSize="lg">{question.question}</Text>
                    <Spacer />
                    <Text fontSize="sm" alignSelf="flex-start">
                      {(
                        (question.pollResponses.length / totalResponses) *
                        100
                      ).toFixed(1) +
                        `% (${question.pollResponses.length} votes)`}
                    </Text>
                  </Flex>
                  <Progress
                    colorScheme={
                      question.pollResponses.find((response) => {
                        if (user.isAuthenticated) {
                          const userMatch =
                            response.username === user.data.username;
                          return (
                            response.sessionId ===
                              sessionStorage.getItem("sessionId") || userMatch
                          );
                        }

                        return (
                          response.sessionId ===
                          sessionStorage.getItem("sessionId")
                        );
                      })
                        ? "green"
                        : "blue"
                    }
                    size="md"
                    value={
                      totalResponses === 0
                        ? 0
                        : (question.pollResponses.length / totalResponses) * 100
                    }
                  />
                </Box>
              ))}
            </Stack>
          </PollBox>
          <PollShare mt="2rem" mb="5rem" />
        </>
      )}
    </>
  );
}

export default PollResults;
