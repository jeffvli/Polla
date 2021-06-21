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
} from "@chakra-ui/react";
import { useParams, useHistory } from "react-router-dom";

import PollShare from "./PollShare";
import PollBox from "./PollBox";
import { api, usePoll } from "../../api/api";
import produce from "immer";

const PollResponder = () => {
  const { pollSlug } = useParams();
  const { poll, isLoading, isError } = usePoll(pollSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [singlePollResponse, setSinglePollResponse] = useState("");
  const [multiplePollResponse, setMultiplePollResponse] = useState([]);
  const history = useHistory();
  const toast = useToast();

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
        .catch((err) => console.error(err.response.data.error));
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
        .catch((err) => {
          toast({
            title: "Invalid response.",
            description: `Error submitting poll, try again. ${err.message}`,
            status: "error",
            duration: 3000,
          });
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      {poll && (
        <>
          <PollBox poll={poll}>
            <Box>
              <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                  <FormLabel>Select response</FormLabel>
                  {poll.multipleAnswers ? (
                    <Stack spacing={3}>
                      <CheckboxGroup>
                        {poll.pollQuestions.map((question) => (
                          <Checkbox
                            onChange={() => {
                              handleMultipleResponse(question);
                            }}
                            key={question.id}
                            size="lg"
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
                      <Stack spacing={5}>
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

                <Stack mt={10} direction={{ base: "column", sm: "row" }}>
                  <Button
                    size="md"
                    colorScheme="gray"
                    variant="solid"
                    type="submit"
                    width="full"
                    isLoading={false}
                    loadingText="Creating"
                    disabled={isSubmitting}
                  >
                    Submit Response
                  </Button>
                  <Button size="md" colorScheme="gray" variant="outline">
                    View Results
                  </Button>
                </Stack>
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
