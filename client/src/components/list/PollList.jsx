import React, { useState, useEffect, useRef } from "react";
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
  Box,
  Heading,
  Spacer,
  Input,
  Link,
  Stack,
} from "@chakra-ui/react";
import { ViewOffIcon } from "@chakra-ui/icons";
import { FaSort } from "react-icons/fa";
import { Link as RouterLink } from "react-router-dom";
import { nanoid } from "nanoid";

import "./PollList.css";
import { useProfilePolls } from "../../api/api";

const PollList = ({ username }) => {
  const [pollSearch, setPollSearch] = useState("");
  const [pollSearchConfirm, setPollSearchConfirm] = useState("");
  const [skip, setSkip] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const searchInput = useRef("");
  const { polls } = useProfilePolls(
    username,
    pollSearchConfirm,
    skip,
    15,
    sortBy,
    order,
    localStorage.getItem("token")
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setPollSearchConfirm(searchInput.current.value);
    }, 800);

    return () => clearTimeout(delayDebounceFn);
  }, [pollSearch]);

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
      <Flex>
        <Box>
          <Heading fontSize="xl">All polls</Heading>
        </Box>
        <Spacer />
        <Box>
          <Input
            ref={searchInput}
            size="sm"
            maxWidth={{ base: "10rem", md: "20rem" }}
            variant="outline"
            placeholder="Search"
            onKeyDown={(e) => setPollSearch(e.target.value)}
          />
        </Box>
      </Flex>
      {polls && (
        <>
          <Table className="poll-table" size="sm" variant="simple" mt={5}>
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
                <Th display={{ base: "none", md: "table-cell" }}>
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
                <Th>
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
                    <Link as={RouterLink} to={`/${poll.slug}`} variant="link">
                      <Text
                        isTruncated
                        maxWidth={{ base: "5rem", md: "15rem" }}
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
                  <Td>
                    <Text isTruncated maxWidth={{ base: "7em", md: "15rem" }}>
                      {poll.createdAt}
                    </Text>
                  </Td>
                  <Td display={{ base: "none", md: "table-cell" }}>
                    <Badge colorScheme={poll.isOpen ? "green" : "red"}>
                      {poll.isOpen ? "Open" : "Closed"}
                    </Badge>
                  </Td>
                  <Td>{poll._count.pollResponses} votes</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </>
      )}
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
              <Text>
                {`${skip + 1} - ${
                  skip + 14 >= polls.count ? polls.count : skip + 15
                }`}{" "}
                of {polls.count}
              </Text>
            </Flex>
          </Stack>
        </>
      )}
    </>
  );
};

export default PollList;
