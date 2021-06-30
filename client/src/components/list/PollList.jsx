import React, { useState } from "react";
import {
  Flex,
  Button,
  ButtonGroup,
  Table,
  Th,
  Tr,
  Td,
  Thead,
  Tbody,
  Text,
  Badge,
  Tag,
  Box,
  Heading,
  Spacer,
  InputGroup,
  InputLeftElement,
  Input,
  Link,
} from "@chakra-ui/react";
import { SearchIcon, ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink } from "react-router-dom";
import { nanoid } from "nanoid";

import { useProfilePolls } from "../../api/api";

const PollList = ({ username }) => {
  const [pollSearch, setPollSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(15);
  const { polls } = useProfilePolls(
    username,
    pollSearch,
    skip,
    take,
    localStorage.getItem("token")
  );

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPollSearch(e.target.value);
    }
  };

  const handleNext = () => {
    setSkip(skip + 15);
  };

  const handlePrevious = () => {
    if (skip - 15 > 0) {
      setSkip(skip - 15);
    } else {
      setSkip(0);
    }
  };

  return (
    <>
      <Box minHeight="45rem">
        <Flex>
          <Box>
            <Heading fontSize="xl">All polls</Heading>
          </Box>
          <Spacer />
          <Box>
            <InputGroup>
              <InputLeftElement children={<SearchIcon />} />
              <Input
                maxWidth="20rem"
                variant="outline"
                placeholder="Press enter to search"
                onKeyDown={handleSearch}
              />
            </InputGroup>
          </Box>
        </Flex>
        {polls && (
          <>
            <Table size="sm" variant="simple" mt={5}>
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Created</Th>
                  <Th textAlign="center">Status</Th>
                  <Th
                    display={{ base: "none", md: "block" }}
                    textAlign="center"
                  >
                    Votes
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {polls.data.map((poll) => (
                  <Tr key={nanoid()}>
                    <Td>
                      <Link
                        as={RouterLink}
                        to={`/polls/${poll.slug}`}
                        variant="link"
                        _hover="none"
                      >
                        <Text
                          isTruncated
                          maxWidth={{ base: "10rem", md: "15rem" }}
                        >
                          {poll.title}
                          {poll.isPrivate ? (
                            <ViewOffIcon ml={2} color="red.300" />
                          ) : (
                            void 0
                          )}
                        </Text>
                      </Link>
                    </Td>
                    <Td>{poll.createdAt}</Td>
                    <Td textAlign="center">
                      <Badge colorScheme={poll.isOpen ? "green" : "red"}>
                        {poll.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </Td>
                    <Td
                      display={{ base: "none", md: "block" }}
                      textAlign="center"
                    >
                      <Tag colorScheme="blue">
                        {poll._count.pollResponses} votes
                      </Tag>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </>
        )}
      </Box>
      {polls && (
        <Flex
          alignSelf="flex-end"
          alignItems="flex-end"
          justifyContent="flex-end"
        >
          <ButtonGroup mt={3}>
            <Button
              variant="outline"
              width="7rem"
              size="sm"
              onClick={handlePrevious}
              disabled={skip === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              width="7rem"
              size="sm"
              onClick={handleNext}
              disabled={skip + 15 >= polls.count}
            >
              Next
            </Button>
          </ButtonGroup>
        </Flex>
      )}
    </>
  );
};

export default PollList;
