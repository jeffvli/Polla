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
  RadioGroup,
  Radio,
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
  const [duplicateCheck, setDuplicateCheck] = useState((e) => {
    return localStorage.getItem("duplicateCheck") === "session"
      ? "session"
      : "ipAddress";
  });
  const [pasteInsert, setPasteInsert] = useBoolean(() => {
    return localStorage.getItem("pasteInsert") === "true" ? true : false;
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState({
    id: null,
    status: false,
  });
  const toast = useToast();

  const handleDuplicateCheck = (e) => {
    localStorage.setItem("duplicateCheck", e);
    setDuplicateCheck(e);
  };

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
          dupCheckMode: duplicateCheck,
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
          setIsSubmitting(false);
        })
        .catch((err) => {
          if (err.response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            toast({
              title: "Error creating poll.",
              description: "Refresh and try again.",
              status: "error",
              duration: 3000,
            });
          } else {
            toast({
              title: "Error creating poll.",
              description: `${err.response.data.error.message}`,
              status: "error",
              duration: 3000,
            });
          }
          setIsSubmitting(false);
        });
    }
  };

  const handleUpdate = (index, content) => {
    setPollQuestions(
      produce(pollQuestions, (draft) => {
        draft[index] = content;
      })
    );
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
              autoFocus
              size="lg"
              maxLength={128}
              placeholder="Enter a title..."
              autoComplete="off"
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </FormControl>

          <FormLabel mt={5}>Description (optional)</FormLabel>
          <Textarea
            resize="none"
            maxLength={256}
            placeholder="Enter a description..."
            autoComplete="off"
            onChange={(e) => setDescription(e.target.value)}
          />

          <HStack mt={5}>
            <FormLabel width="full">
              {pasteInsert === false
                ? "Questions"
                : "Questions (enter one option per line)"}
            </FormLabel>
            <Button
              leftIcon={<CopyIcon />}
              variant="ghost"
              size="xs"
              onClick={() => {
                setPasteInsert.toggle();
                localStorage.setItem(
                  "pasteInsert",
                  pasteInsert === false ? "true" : "false"
                );
              }}
            >
              {pasteInsert === true ? "Paste" : "Enter"}
            </Button>
          </HStack>
          {pasteInsert === false ? (
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
                pollQuestions.join("\n").trim() === ""
                  ? ""
                  : pollQuestions.join("\n")
              }
              onChange={(e) => setPollQuestions(e.target.value.split("\n"))}
            />
          )}
          <Stack direction="column" mt={5}>
            <FormLabel>Settings</FormLabel>
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
            <FormLabel>Duplicate vote detection</FormLabel>
            <RadioGroup onChange={handleDuplicateCheck} value={duplicateCheck}>
              <Stack direction="row">
                <Radio value="ipAddress">Ip address</Radio>
                <Radio value="session">Browser session</Radio>
              </Stack>
            </RadioGroup>
          </Stack>

          <Button
            colorScheme="gray"
            variant="solid"
            type="submit"
            width="full"
            isLoading={isSubmitting}
            disabled={isSubmitting}
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
