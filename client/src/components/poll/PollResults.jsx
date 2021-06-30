import React from "react";
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
  Tag,
  TagLabel,
  TagLeftIcon,
} from "@chakra-ui/react";
import {
  ArrowBackIcon,
  UnlockIcon,
  LockIcon,
  ViewOffIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { nanoid } from "nanoid";

import { usePoll, usePollResults } from "../../api/api";
import MissingPage from "../missingpage/MissingPage";
import PollBox from "./PollBox";
import PollShare from "./PollShare";
import PollSettings from "./PollSettings";

function PollResults({ user }) {
  const { pollSlug } = useParams();
  const { poll, isError } = usePoll(pollSlug);
  const { pollResults } = usePollResults(pollSlug);

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
      {poll && pollResults && user && (
        <>
          <PollBox
            poll={poll}
            headerLeft={
              <Button as={RouterLink} to={`/polls/${pollSlug}/`} variant="link">
                <ArrowBackIcon />
                <Text display={{ base: "none", md: "block" }} fontSize="sm">
                  Back to poll
                </Text>
              </Button>
            }
            headerRight={
              <>
                <Tag
                  ml={1}
                  size="sm"
                  float="right"
                  colorScheme={poll.isPrivate === true ? "red" : "green"}
                >
                  <TagLeftIcon
                    display={{ base: "none", md: "block" }}
                    as={poll.isPrivate === true ? ViewOffIcon : ViewIcon}
                  />
                  <TagLabel display={{ base: "none", md: "block" }}>
                    {poll.isPrivate === true ? "Private" : "Public"}
                  </TagLabel>

                  {poll.isPrivate === true ? (
                    <ViewOffIcon display={{ base: "block", md: "none" }} />
                  ) : (
                    <ViewIcon display={{ base: "block", md: "none" }} />
                  )}
                </Tag>
                <Tag
                  size="sm"
                  float="right"
                  colorScheme={poll.isOpen === true ? "green" : "red"}
                >
                  <TagLeftIcon
                    display={{ base: "none", md: "block" }}
                    as={poll.isOpen === true ? UnlockIcon : LockIcon}
                  />
                  <TagLabel display={{ base: "none", md: "block" }}>
                    {poll.isOpen === true ? "Open" : "Closed"}
                  </TagLabel>

                  {poll.isOpen === true ? (
                    <UnlockIcon display={{ base: "block", md: "none" }} />
                  ) : (
                    <LockIcon display={{ base: "block", md: "none" }} />
                  )}
                </Tag>
              </>
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
              <PollSettings user={user} poll={poll} />
            </Stack>
          </PollBox>
          <PollShare mt="2rem" mb="5rem" />
        </>
      )}
    </>
  );
}

export default PollResults;
