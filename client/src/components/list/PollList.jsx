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
  Stack,
} from "@chakra-ui/react";
import { SearchIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaSort } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { nanoid } from "nanoid";

import { useProfilePolls } from "../../api/api";

const PollList = ({ username }) => {
  const [pollSearch, setPollSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [take, setTake] = useState(15);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const { polls } = useProfilePolls(
    username,
    pollSearch,
    skip,
    take,
    sortBy,
    order,
    localStorage.getItem("token")
  );

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      setPollSearch(e.target.value);
    }

    if (e.key === "Backspace" && e.target.value.length <= 1) {
      setPollSearch("");
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

  const handleSort = (sort) => {
    if (sort !== sortBy) {
      setSortBy(sort);
      setOrder("desc");
    } else {
      setSortBy(sort);
      order === "desc" ? setOrder("asc") : setOrder("desc");
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
                  <Th>
                    <Link
                      color={sortBy === "title" ? "#AADBFF" : void 0}
                      onClick={() => {
                        handleSort("title");
                      }}
                    >
                      <Text display="flex" alignItems="center">
                        Title <FaSort />
                      </Text>
                    </Link>
                  </Th>
                  <Th>
                    <Link
                      color={sortBy === "createdAt" ? "#AADBFF" : void 0}
                      onClick={() => {
                        handleSort("createdAt");
                      }}
                    >
                      <Text display="flex" alignItems="center">
                        Created <FaSort />
                      </Text>
                    </Link>
                  </Th>
                  <Th textAlign="center">
                    <Link
                      color={sortBy === "isOpen" ? "#AADBFF" : void 0}
                      onClick={() => {
                        handleSort("isOpen");
                      }}
                    >
                      <Text display="flex" alignItems="center">
                        Status <FaSort />
                      </Text>
                    </Link>
                  </Th>
                  <Th display={{ base: "none", md: "block" }}>
                    <Link
                      color={sortBy === "votes" ? "#AADBFF" : void 0}
                      onClick={() => {
                        handleSort("votes");
                      }}
                    >
                      <Text display="flex" alignItems="center">
                        Votes <FaSort />
                      </Text>
                    </Link>
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
                    <Td>
                      <Badge colorScheme={poll.isOpen ? "green" : "red"}>
                        {poll.isOpen ? "Open" : "Closed"}
                      </Badge>
                    </Td>
                    <Td display={{ base: "none", md: "block" }}>
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
        <>
          <Stack>
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
            <Flex
              alignSelf="flex-end"
              alignItems="flex-end"
              justifyContent="flex-end"
            >
              <Box>
                <Text>
                  {`${skip + 1} - ${
                    skip + 14 > polls.count ? polls.count : skip + 15
                  }`}{" "}
                  of {polls.count}
                </Text>
              </Box>
            </Flex>
          </Stack>
        </>
      )}
    </>
  );
};

export default PollList;
