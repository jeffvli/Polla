import React, { useState } from "react";
import produce from "immer";
import {
  Box,
  Heading,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogBody,
  Text,
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

import { api } from "../../api/api";

const PollForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pollQuestions, setPollQuestions] = useState(["", "", ""]);
  const [multipleAnswers, setMultipleAnswers] = useBoolean();
  const [insertType, setInsertType] = useState("single");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [successResponse, setSuccessResponse] = useState({
    id: null,
    status: false,
  });
  const onClose = () => setIsOpen(false);
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let questions = [];
    pollQuestions.forEach((q) => {
      if (q !== "") {
        // Get the first 200 characters of the question in case longer
        // lines are pasted in the textarea
        questions.push({ content: q.slice(0, 199) });
      }
    });

    if (questions.length < 2) {
      setIsOpen(true);
    } else {
      setIsSubmitting(true);
      await api
        .post("/polls", {
          title: title,
          description: description,
          multipleAnswers: multipleAnswers,
          questions: questions,
        })
        .then((res) => {
          toast({
            title: "Polla created.",
            description: `Your poll has been created.`,
            status: "success",
            duration: 2000,
          });
          setSuccessResponse({ id: res.data.id, status: true });
        })
        .catch((e) => {
          toast({
            title: "Error creating poll.",
            description: `${e.message}`,
            status: "error",
            duration: 4000,
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
    <Box
      backgroundColor="#2C3039"
      maxWidth={800}
      shadow="1px 1px 3px 3px rgba(0,0,0,0.3)"
      borderRadius="lg"
      p={5}
      m="auto"
    >
      <Box textAlign="center" pb={10}>
        <Heading>Create a Polla</Heading>
      </Box>
      <Box>
        <form onSubmit={handleSubmit}>
          {successResponse.status && (
            <Redirect to={`/polls/${successResponse.id}`} />
          )}
          <FormControl id="poll-title" isRequired>
            <FormLabel>Title</FormLabel>
            <Input
              size="lg"
              maxLength={255}
              placeholder="Enter a title..."
              onChange={(e) => setTitle(e.currentTarget.value)}
            />
          </FormControl>

          <FormLabel mt={5}>Description (optional)</FormLabel>
          <Textarea
            resize="none"
            maxLength={400}
            placeholder="Enter a description..."
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
              Paste Questions
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
          <Checkbox mt={5} onChange={setMultipleAnswers.toggle}>
            Allow multiple answers
          </Checkbox>

          <HStack mt={5}>
            <Button
              colorScheme="blue"
              variant="solid"
              type="submit"
              width="full"
              isLoading={isSubmitting}
              loadingText="Creating"
            >
              Create Poll
            </Button>
          </HStack>
          <AlertDialog isOpen={isOpen} onClose={onClose}>
            <AlertDialogOverlay>
              <AlertDialogContent>
                <AlertDialogBody textAlign="center" fontSize="xl">
                  <Text>Enter at least two poll questions</Text>
                </AlertDialogBody>
              </AlertDialogContent>
            </AlertDialogOverlay>
          </AlertDialog>
        </form>
      </Box>
    </Box>
  );
};

export default PollForm;
