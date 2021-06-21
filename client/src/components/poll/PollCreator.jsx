import React, { useState } from "react";
import produce from "immer";
import {
  Box,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Textarea,
  Checkbox,
  useToast,
  useBoolean,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import { Redirect } from "react-router-dom";

import "./Poll.css";
import { api } from "../../api/api";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const PollCreator = ({ mb }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pollQuestions, setPollQuestions] = useState(["", "", ""]);
  const [multipleAnswers, setMultipleAnswers] = useBoolean(
    localStorage.getItem("multipleAnswers") === "true" ? true : false
  );
  const [privatePoll, setPrivatePoll] = useBoolean(
    localStorage.getItem("privatePoll") === "true" ? true : false
  );
  const [insertType, setInsertType] = useState("single");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState({
    id: null,
    status: false,
  });
  const toast = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();

    let questions = [];
    pollQuestions.forEach((q) => {
      if (q !== "") {
        // Get the first 200 characters of the question in case longer
        // lines are pasted in the textarea
        questions.push({ question: q.slice(0, 199) });
      }
    });

    if (questions.length < 2) {
      toast({
        title: "Invalid poll.",
        description: "Enter at least two questions.",
        status: "error",
        duration: 3000,
      });
    } else {
      setIsSubmitting(true);
      api
        .post("/polls", {
          title: title,
          description: description,
          multipleAnswers: multipleAnswers,
          isPrivate: privatePoll,
          questions: questions,
          sessionId: sessionStorage.getItem("sessionId"),
        })
        .then((res) => {
          toast({
            title: "Poll created.",
            description: "Your poll has been created.",
            status: "success",
            duration: 2000,
          });
          setSuccessResponse({
            id: res.data.id,
            slug: res.data.slug,
            status: true,
          });
        })
        .catch((err) => {
          toast({
            title: "Error creating poll.",
            description: `${err.response.data.error.message}`,
            status: "error",
            duration: 3000,
          });
        });

      setIsSubmitting(false);
    }
  };

  const handleUpdate = (index, content) => {
    setPollQuestions(
      produce(pollQuestions, (draft) => {
        draft[index] = content;
      })
    );
  };

  const handleInsertType = () => {
    insertType === "single" ? setInsertType("area") : setInsertType("single");
  };
  return (
    <ResponsiveBox variant="bordered" mb={mb}>
      <Box textAlign="center" pb={10}>
        <Heading>Create a new Poll</Heading>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          {successResponse.status && (
            <Redirect to={`/polls/${successResponse.slug}`} />
          )}
          <FormControl id="poll-title" isRequired>
            <FormLabel>Poll Title</FormLabel>
            <Input
              size="lg"
              maxLength={255}
              placeholder="Enter a title..."
              autoComplete="off"
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </FormControl>

          <FormLabel mt={5}>Description (optional)</FormLabel>
          <Textarea
            resize="none"
            maxLength={400}
            placeholder="Enter a description..."
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
          />

          <HStack mt={5}>
            <FormLabel width="full">
              {insertType === "single"
                ? "Questions"
                : "Questions (enter one option per line)"}
            </FormLabel>
            <Button
              leftIcon={<CopyIcon />}
              variant="ghost"
              size="xs"
              onClick={handleInsertType}
            >
              {insertType === "single" ? "Paste" : "Enter"}
            </Button>
          </HStack>
          {insertType === "single" ? (
            <Stack spacing={3}>
              {pollQuestions.map((question, index) => {
                return (
                  <FormControl key={`poll-question-${index}`}>
                    <Input
                      variant="filled"
                      size="md"
                      autoComplete="off"
                      value={question}
                      onChange={(e) => handleUpdate(index, e.target.value)}
                      onFocus={() => {
                        index === pollQuestions.length - 1
                          ? setPollQuestions(
                              produce(pollQuestions, (draft) => {
                                draft.push("");
                              })
                            )
                          : void 0;
                      }}
                    />
                  </FormControl>
                );
              })}
            </Stack>
          ) : (
            <Textarea
              size="sm"
              resize="vertical"
              variant="filled"
              value={
                pollQuestions.join("\n").trim() == ""
                  ? ""
                  : pollQuestions.join("\n")
              }
              onChange={(e) => setPollQuestions(e.target.value.split("\n"))}
            />
          )}
          <Stack direction="column" mt={5}>
            <Checkbox
              isChecked={multipleAnswers}
              onChange={() => {
                setMultipleAnswers.toggle();
                localStorage.setItem(
                  "multipleAnswers",
                  multipleAnswers === false ? "true" : "false"
                );
              }}
            >
              Allow multiple answers
            </Checkbox>

            <Checkbox
              isChecked={privatePoll}
              onChange={() => {
                setPrivatePoll.toggle();
                localStorage.setItem(
                  "privatePoll",
                  privatePoll === false ? "true" : "false"
                );
              }}
            >
              Set private (only accessible by direct link)
            </Checkbox>
          </Stack>

          <Button
            colorScheme="gray"
            variant="solid"
            type="submit"
            width="full"
            isLoading={isSubmitting}
            loadingText="Creating"
            mt={5}
          >
            Create Poll
          </Button>
        </form>
      </Box>
    </ResponsiveBox>
  );
};

export default PollCreator;
