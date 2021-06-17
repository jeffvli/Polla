import React, { useState } from "react";
import {
  Box,
  Heading,
  Stack,
  Button,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Text,
  Divider,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useParams, Redirect } from "react-router-dom";

import { api, usePoll } from "../../api/api";
import produce from "immer";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const Poll = () => {
  const { pollSlug } = useParams();
  const { poll, isLoading, isError } = usePoll(pollSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setIsSubmitted] = useState(false);
  const [singlePollResponse, setSinglePollResponse] = useState(null);
  const [multiplePollResponse, setMultiplePollResponse] = useState([]);

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
        return { questionId: pollRes.id };
      });
      api
        .post(`/polls/${pollSlug}/responses`, pollResponses)
        .then(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
        })
        .catch((err) => console.error(err.response.data.error));
    } else {
      console.log(singlePollResponse.id);
      api
        .post(`/polls/${pollSlug}/responses`, {
          questionId: singlePollResponse.id,
        })
        .then(() => {
          setIsSubmitting(false);
          setIsSubmitted(true);
        })
        .catch((err) => console.error(err.response.data.error));
    }
  };

  return (
    <>
      {submitted && <Redirect to={`/polls/${pollSlug}/results`} />}
      {poll && (
        <>
          <ResponsiveBox variant="bordered">
            <Box textAlign="center" pb={10}>
              <Heading>{poll.title}</Heading>
            </Box>
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
                  >
                    Submit Response
                  </Button>
                  <Button size="md" colorScheme="gray" variant="outline">
                    View Results
                  </Button>
                </Stack>
              </form>
            </Box>
            <Divider mt={5} mb={5}></Divider>
            <Box mt={5} color={"gray.600"}>
              <Text>
                Created by - {poll.username ? poll.username : "anonymous"} -{" "}
                {formatDistance(new Date(poll.createdAt), new Date(), {
                  addSuffix: true,
                })}
              </Text>
            </Box>
          </ResponsiveBox>
        </>
      )}
    </>
  );
};

export default Poll;
