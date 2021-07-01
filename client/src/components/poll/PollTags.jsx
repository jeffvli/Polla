import React from "react";
import { Tag, TagLabel, TagLeftIcon } from "@chakra-ui/tag";
import { ViewOffIcon, ViewIcon, LockIcon, UnlockIcon } from "@chakra-ui/icons";

import { usePollAuth } from "../../api/api";

const PollTags = ({ slug }) => {
  const { poll } = usePollAuth(
    slug,
    sessionStorage.getItem("sessionId"),
    localStorage.getItem("token")
  );

  return (
    <>
      {poll && (
        <>
          <Tag
            ml={1}
            size="sm"
            float="right"
            colorScheme={poll.isPrivate === true ? "red" : "green"}
          >
            <TagLeftIcon
              display={{ base: "none", md: "block" }}
              as={poll.isPrivate === true ? ViewOffIcon : ViewIcon}
            />
            <TagLabel display={{ base: "none", md: "block" }}>
              {poll.isPrivate === true ? "Private" : "Public"}
            </TagLabel>

            {poll.isPrivate === true ? (
              <ViewOffIcon display={{ base: "block", md: "none" }} />
            ) : (
              <ViewIcon display={{ base: "block", md: "none" }} />
            )}
          </Tag>
          <Tag
            size="sm"
            float="right"
            colorScheme={poll.isOpen === true ? "green" : "red"}
          >
            <TagLeftIcon
              display={{ base: "none", md: "block" }}
              as={poll.isOpen === true ? UnlockIcon : LockIcon}
            />
            <TagLabel display={{ base: "none", md: "block" }}>
              {poll.isOpen === true ? "Open" : "Closed"}
            </TagLabel>

            {poll.isOpen === true ? (
              <UnlockIcon display={{ base: "block", md: "none" }} />
            ) : (
              <LockIcon display={{ base: "block", md: "none" }} />
            )}
          </Tag>
        </>
      )}
    </>
  );
};

export default PollTags;
