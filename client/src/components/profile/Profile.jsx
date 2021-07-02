import React from "react";
import {
  LinkBox,
  LinkOverlay,
  Heading,
  Text,
  Stack,
  Divider,
  Flex,
  Spacer,
  Tag,
  Tooltip,
  Grid,
} from "@chakra-ui/react";
import { ViewOffIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useParams } from "react-router-dom";
import { nanoid } from "nanoid";

import { useProfile } from "../../api/api";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";
import PollList from "../list/PollList";

const Profile = () => {
  const { username } = useParams();
  const { profile } = useProfile(username, localStorage.getItem("token"));

  return (
    <>
      {profile && (
        <>
          <ResponsiveBox>
            <Stack direction="row">
              <Heading>{profile.username}'s profile</Heading>
            </Stack>
            <Text as="i">
              {profile.role === "USER" ? "Standard User" : "Admin"}
            </Text>
            <Divider mt={5} />
          </ResponsiveBox>
          <ResponsiveBox variant="bordered">
            <Heading fontSize="xl">Latest polls</Heading>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
              gap={3}
              mt={5}
            >
              {profile.polls.length === 0 && <Text>No polls yet!</Text>}
              {profile.polls.length > 0 &&
                profile.polls.map((poll) => (
                  <LinkBox
                    flex="1"
                    key={nanoid()}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                  >
                    <Tooltip
                      hasArrow
                      label={
                        <Stack spacing={0}>
                          <Text>Title: {poll.title}</Text>
                          <Text>
                            Description:{" "}
                            {poll.description ? poll.description : "N/a"}
                          </Text>
                          <Text>isOpen: {poll.isOpen ? "true" : "false"}</Text>
                          <Text>
                            isPrivate: {poll.isPrivate ? "true" : "false"}
                          </Text>
                          <Text>
                            multipleAnswers:{" "}
                            {poll.multipleAnswers ? "true" : "false"}
                          </Text>
                          <Text>Created: {poll.createdAt}</Text>
                        </Stack>
                      }
                    >
                      <LinkOverlay as={RouterLink} to={`/polls/${poll.slug}`}>
                        <Flex>
                          {poll.isPrivate && (
                            <ViewOffIcon
                              boxSize="1em"
                              mr="2"
                              mt="auto"
                              mb="auto"
                              color="red.400"
                            />
                          )}

                          <Text
                            isTruncated
                            maxWidth={{ base: "12em", md: "8em" }}
                          >
                            {poll.title}
                          </Text>
                          <Spacer />
                          <Tag colorScheme="blue">
                            {poll._count.pollResponses} votes
                          </Tag>
                        </Flex>
                      </LinkOverlay>
                    </Tooltip>
                  </LinkBox>
                ))}
            </Grid>
          </ResponsiveBox>

          <ResponsiveBox variant="bordered" mt={10}>
            <Heading fontSize="xl">Latest poll responses</Heading>
            <Grid
              templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
              gap={3}
              mt={5}
            >
              {profile.pollResponses.length === 0 && (
                <Text>No poll responses yet!</Text>
              )}
              {profile.pollResponses.length > 0 &&
                profile.pollResponses.map((response) => (
                  <LinkBox
                    flex="1"
                    key={nanoid()}
                    shadow="md"
                    borderWidth="1px"
                    borderRadius="md"
                    p={3}
                  >
                    <Tooltip
                      hasArrow
                      label={
                        <Stack spacing={0}>
                          <Text>Title: {response.poll.title}</Text>
                          <Text>
                            Description:{" "}
                            {response.poll.description
                              ? response.poll.description
                              : "N/a"}
                          </Text>
                          <Text>
                            isOpen: {response.poll.isOpen ? "true" : "false"}
                          </Text>
                          <Text>
                            isPrivate:{" "}
                            {response.poll.isPrivate ? "true" : "false"}
                          </Text>
                          <Text>
                            multipleAnswers:{" "}
                            {response.poll.multipleAnswers ? "true" : "false"}
                          </Text>
                          <Text>Created: {response.poll.createdAt}</Text>
                        </Stack>
                      }
                    >
                      <LinkOverlay
                        as={RouterLink}
                        to={`/polls/${response.poll.slug}`}
                      >
                        <Flex>
                          <Text
                            isTruncated
                            maxWidth={{ base: "12em", md: "8em" }}
                          >
                            {response.poll.title}{" "}
                            {response.poll.isPrivate && (
                              <ViewOffIcon
                                boxSize="1em"
                                mr="2"
                                mt="auto"
                                mb="auto"
                                color="red.400"
                              />
                            )}
                          </Text>

                          <Spacer />
                        </Flex>
                        Response:{" "}
                        <Tag>
                          <Text
                            isTruncated
                            maxWidth={{ base: "12em", md: "8em" }}
                          >
                            {response.pollQuestion.question}
                          </Text>
                        </Tag>
                      </LinkOverlay>
                    </Tooltip>
                  </LinkBox>
                ))}
            </Grid>
          </ResponsiveBox>
          <ResponsiveBox variant="bordered" mt={10} mb="5rem">
            <PollList username={username} />
          </ResponsiveBox>
        </>
      )}
    </>
  );
};

export default Profile;
