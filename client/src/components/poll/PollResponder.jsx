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
  Center,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import { useParams, useHistory } from "react-router-dom";

import PollBox from "./PollBox";
import { api, usePoll } from "../../api/api";
import produce from "immer";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";
import { nanoid } from "nanoid";

const PollResponder = () => {
  const { pollSlug } = useParams();
  const { poll, isLoading, isError } = usePoll(pollSlug);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [singlePollResponse, setSinglePollResponse] = useState("");
  const [multiplePollResponse, setMultiplePollResponse] = useState([]);
  const history = useHistory();

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
          history.push(`/polls/${pollSlug}/results`);
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
          history.push(`/polls/${pollSlug}/results`);
        })
        .catch((err) => console.error(err.response.data.error));
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
          </PollBox>
        </>
      )}
    </>
  );
};

export default PollResponder;
