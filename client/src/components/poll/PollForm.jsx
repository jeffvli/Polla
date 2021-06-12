import React, { useState } from "react";
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  HStack,
  Textarea,
  Checkbox,
} from "@chakra-ui/react";
import { CopyIcon } from "@chakra-ui/icons";
import produce from "immer";
import { useBoolean } from "@chakra-ui/hooks";

import { api } from "../../api/api";

const PollForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pollQuestions, setPollQuestions] = useState(["", "", ""]);
  const [multipleAnswers, setMultipleAnswers] = useBoolean();
  const [insertType, setInsertType] = useState("single");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let questions = [];
    pollQuestions.forEach((q) => {
      if (q !== "") {
        // Get the first 200 characters of the question in case longer
        // lines are pasted in the textarea
        questions.push({ content: q.slice(0, 199) });
      }
    });

    await api
      .post("/polls", {
        title: title,
        description: description,
        multipleAnswers: multipleAnswers,
        questions: questions,
      })
      .catch((e) => console.log(e.message));

    setIsSubmitting(false);
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
    <form onSubmit={handleSubmit}>
      <FormControl id="poll-title" isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          size="lg"
          onChange={(e) => setTitle(e.currentTarget.value)}
          maxLength={255}
        />
      </FormControl>

      <FormLabel mt={5}>Description</FormLabel>
      <Textarea
        resize="none"
        maxLength={400}
        onChange={(e) => setDescription(e.target.value)}
      />

      <HStack mt={5}>
        <FormLabel width="full">Questions</FormLabel>
        <Button
          leftIcon={<CopyIcon />}
          variant="ghost"
          size="xs"
          onClick={handleInsertType}
        >
          Paste Options
        </Button>
      </HStack>
      {insertType === "single" ? (
        <Stack spacing={3}>
          {pollQuestions.map((question, index) => {
            return (
              <FormControl
                key={`poll-question-${index}`}
                id={`poll-question-${index}`}
              >
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
          placeholder="Enter one option per line"
          size="sm"
          resize="vertical"
          variant="filled"
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
          width="auto"
          isLoading={isSubmitting}
          loadingText="Creating"
        >
          Create Poll
        </Button>
        {insertType === "single" ? (
          <Button colorScheme="gray" variant="solid" width="auto">
            + Option
          </Button>
        ) : (
          ""
        )}
      </HStack>
    </form>
  );
};

export default PollForm;
