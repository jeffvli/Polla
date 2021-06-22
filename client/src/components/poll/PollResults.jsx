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
  SimpleGrid,
  Tooltip,
  Button,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import _ from "lodash";
import { Link as RouterLink } from "react-router-dom";

import PollBox from "./PollBox";
import PollShare from "./PollShare";
import { nanoid } from "nanoid";
import { usePoll, usePollResults } from "../../api/api";

function PollResults({ user }) {
  const { pollSlug } = useParams();
  const { poll } = usePoll(pollSlug);
  const { pollResults } = usePollResults(pollSlug);

  return (
    <>
      {!poll && !pollResults && (
        <Center>
          <Stack>
            <CircularProgress isIndeterminate color="blue.300" m="auto" />
            <Text>Loading...</Text>
          </Stack>
        </Center>
      )}
      {poll && pollResults && (
        <>
          <PollBox
            poll={poll}
            headerLeft={
              <Button
                as={RouterLink}
                to={`/polls/${pollSlug}/`}
                variant="unstyled"
              >
                <Text>
                  <ArrowBackIcon /> Back to poll
                </Text>
              </Button>
            }
          >
            <Stack spacing={8}>
              {poll.pollQuestions.map((question) => (
                <Box key={nanoid()}>
                  <SimpleGrid columns={2}>
                    <Box>
                      <Text
                        fontSize="lg"
                        textOverflow="ellipsis"
                        overflow="hidden"
                        whiteSpace="nowrap"
                      >
                        <Tooltip label={question.question}>
                          {question.question}
                        </Tooltip>
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="sm" textAlign="end">
                        {(
                          (pollResults.results[question.id] /
                            pollResults.results["totalResponses"]) *
                          100
                        ).toFixed(1) +
                          `% (${
                            pollResults.results[question.id]
                              ? pollResults.results[question.id]
                              : 0
                          } votes)`}
                      </Text>
                    </Box>
                  </SimpleGrid>
                  <Progress
                    colorScheme={
                      pollResults.responses.find((response) => {
                        if (question.id === response.pollQuestionId) {
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
                        }
                        return false;
                      })
                        ? "green"
                        : "blue"
                    }
                    size="md"
                    value={pollResults.results[question.id] * 100}
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
