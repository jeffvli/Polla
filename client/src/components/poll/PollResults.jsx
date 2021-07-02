import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Text,
  Stack,
  CircularProgress,
  Center,
  SimpleGrid,
  Tooltip,
  Button,
  Switch,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";

import { usePoll, usePollResults } from "../../api/api";
import MissingPage from "../missingpage/MissingPage";
import PollBox from "./PollBox";
import PollShare from "./PollShare";
import PollSettings from "./PollSettings";
import PollTags from "./PollTags";
import ProgressBar from "../progressbar/ProgressBar";

function PollResults({ user }) {
  const [autoRefresh, setAutoRefresh] = useState(
    localStorage.getItem("autoRefresh") === "false" ? false : true
  );
  const { pollSlug } = useParams();
  const { poll, isError } = usePoll(pollSlug);
  const { pollResults } = usePollResults(pollSlug, autoRefresh);

  const handleAutoRefreshToggle = () => {
    if (autoRefresh === false) {
      setAutoRefresh(true);
      localStorage.setItem("autoRefresh", "true");
    } else {
      setAutoRefresh(false);
      localStorage.setItem("autoRefresh", "false");
    }
  };

  return (
    <>
      {isError && <MissingPage />}
      {!poll && !pollResults && !isError && (
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
              <Button as={RouterLink} to={`/polls/${pollSlug}/`} variant="link">
                <ArrowBackIcon />
              </Button>
            }
            headerRight={<PollTags slug={pollSlug} />}
          >
            <Flex>
              <Spacer />
              <Text textAlign="end" fontSize={{ base: "sm", md: "sm" }}>
                Auto-refresh{" "}
                <Switch
                  id="auto-refresh"
                  size="sm"
                  isChecked={autoRefresh}
                  onChange={handleAutoRefreshToggle}
                />
              </Text>
            </Flex>
            <Stack spacing={8} mt={5}>
              {poll.pollQuestions.map((question) => (
                <Box key={`question-result-${question.id}`}>
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
                        {(pollResults.results[question.id]
                          ? (pollResults.results[question.id] /
                              pollResults.results["totalResponses"]) *
                            100
                          : 0
                        ).toFixed(1) +
                          `% (${
                            pollResults.results[question.id]
                              ? pollResults.results[question.id]
                              : 0
                          } votes)`}
                      </Text>
                    </Box>
                  </SimpleGrid>
                  <ProgressBar
                    colorScheme={
                      pollResults.responses.find((response) => {
                        if (question.id === response.pollQuestionId) {
                          if (user) {
                            const userMatch =
                              response.username === user.username;
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
                    value={
                      pollResults.results[question.id]
                        ? (pollResults.results[question.id] * 100) /
                          pollResults.results.totalResponses
                        : 0
                    }
                  />
                </Box>
              ))}
            </Stack>
            <Stack direction="row" justifyContent="flex-end" mt={5}>
              {user && user.username === poll.username && (
                <PollSettings user={user} slug={pollSlug} />
              )}
            </Stack>
          </PollBox>
          <PollShare mt="2rem" mb="5rem" />
        </>
      )}
    </>
  );
}

export default PollResults;
