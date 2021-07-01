import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  CheckboxGroup,
  Checkbox,
  useToast,
  Alert,
  Text,
  Flex,
  Spacer,
  useBreakpointValue,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { AlertIcon } from "@chakra-ui/alert";
import { useParams, useHistory, Link as RouterLink } from "react-router-dom";

import MissingPage from "../missingpage/MissingPage";
import PollShare from "./PollShare";
import PollBox from "./PollBox";
import { api, usePollAuth } from "../../api/api";
import produce from "immer";
import PollSettings from "./PollSettings";
import PollTags from "./PollTags";

const PollResponder = ({ user }) => {
  const { pollSlug } = useParams();
  const { poll, isError } = usePollAuth(
    pollSlug,
    sessionStorage.getItem("sessionId"),
    localStorage.getItem("token")
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [singlePollResponse, setSinglePollResponse] = useState("");
  const [multiplePollResponse, setMultiplePollResponse] = useState([]);
  const history = useHistory();
  const toast = useToast();
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const optionSize = useBreakpointValue({ base: "md", md: "lg" });

  const handleMultipleResponse = (e) => {
    const checkDup = multiplePollResponse.filter((pollRes) => {
      return pollRes.id === e.id;
    });

    if (checkDup.length > 0) {
      setMultiplePollResponse(
        produce(multiplePollResponse, (draft) => {
          const index = draft.findIndex((pollRes) => pollRes.id === e.id);
          if (index !== -1) draft.splice(index, 1);
        })
      );
    } else {
      setMultiplePollResponse(
        produce(multiplePollResponse, (draft) => {
          draft.push(e);
        })
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    if (poll.multipleAnswers) {
      const pollResponses = multiplePollResponse.map((pollRes) => {
        return {
          questionId: pollRes.id,
          sessionId: sessionStorage.getItem("sessionId"),
        };
      });
      api
        .post(`/polls/${pollSlug}/responses`, pollResponses)
        .then(() => {
          setIsSubmitting(false);
          history.push(`/polls/${pollSlug}/results`);
        })
        .catch(() => {
          toast({
            title: "Invalid response.",
            description: `Error submitting response, refresh and try again.`,
            status: "error",
            duration: 3000,
          });
          setIsSubmitting(false);
        });
    } else {
      api
        .post(`/polls/${pollSlug}/responses`, {
          questionId: singlePollResponse.id,
          sessionId: sessionStorage.getItem("sessionId"),
        })
        .then(() => {
          setIsSubmitting(false);
          history.push(`/polls/${pollSlug}/results`);
        })
        .catch(() => {
          toast({
            title: "Invalid response.",
            description: `Error submitting response, refresh and try again.`,
            status: "error",
            duration: 3000,
          });
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      {isError && <MissingPage />}
      {poll && (
        <>
          <PollBox
            poll={poll}
            headerLeft={
              <Button as={RouterLink} to="/" variant="link">
                <ArrowBackIcon />
                <Text display={{ base: "none", md: "block" }} fontSize="sm">
                  Back to poll creation
                </Text>
              </Button>
            }
            headerRight={<PollTags slug={pollSlug} />}
          >
            <Box>
              {user &&
                poll.pollResponses.filter((pr) => {
                  return (
                    pr.username === user.username ||
                    pr.sessionId === sessionStorage.getItem("sessionId")
                  );
                }).length > 0 && (
                  <Alert status="warning" mb={3}>
                    <AlertIcon />
                    <Text fontSize={{ base: "sm", md: "md" }}>
                      You have already voted in the poll, submitting will
                      replace your current vote.
                    </Text>
                  </Alert>
                )}

              {!user &&
                poll.pollResponses.filter((pr) => {
                  return pr.sessionId === sessionStorage.getItem("sessionId");
                }).length > 0 && (
                  <Alert status="warning" mb={3}>
                    <AlertIcon />
                    You have already voted in the poll, submitting will replace
                    your current vote.
                  </Alert>
                )}
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", md: "md" }}>
                    Select response
                  </FormLabel>
                  {poll.multipleAnswers ? (
                    <Stack spacing={3}>
                      <CheckboxGroup>
                        {poll.pollQuestions.map((question) => (
                          <Checkbox
                            onChange={() => {
                              handleMultipleResponse(question);
                            }}
                            key={question.id}
                            size={optionSize}
                            spacing={3}
                            value={question.question}
                          >
                            {question.question}
                          </Checkbox>
                        ))}
                      </CheckboxGroup>
                    </Stack>
                  ) : (
                    <RadioGroup name="form-poll">
                      <Stack spacing={3}>
                        {poll.pollQuestions.map((question) => (
                          <Radio
                            value={question.question}
                            key={question.id}
                            size="lg"
                            spacing={3}
                            onChange={() => setSinglePollResponse(question)}
                          >
                            {question.question}
                          </Radio>
                        ))}
                      </Stack>
                    </RadioGroup>
                  )}
                </FormControl>
                <Flex mt={5}>
                  <Button
                    size={buttonSize}
                    colorScheme="gray"
                    variant="solid"
                    type="submit"
                    width="auto"
                    isLoading={false}
                    loadingText="Creating"
                    disabled={isSubmitting}
                  >
                    Submit Response
                  </Button>

                  <Button
                    as={RouterLink}
                    to={`/polls/${pollSlug}/results`}
                    size={buttonSize}
                    colorScheme="gray"
                    variant="outline"
                    ml={2}
                  >
                    View Results
                  </Button>
                  <Spacer />
                  <PollSettings user={user} slug={pollSlug} />
                </Flex>
              </form>
            </Box>
          </PollBox>
          <PollShare mt="2rem" mb="5rem" />
        </>
      )}
    </>
  );
};

export default PollResponder;
