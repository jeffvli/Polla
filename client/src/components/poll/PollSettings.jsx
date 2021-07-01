import React, { useState, useRef } from "react";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  Button,
  Stack,
  useBreakpointValue,
  useToast,
} from "@chakra-ui/react";
import {
  SettingsIcon,
  LockIcon,
  UnlockIcon,
  ViewOffIcon,
  ViewIcon,
  DeleteIcon,
} from "@chakra-ui/icons";

import "./Poll.css";
import { api, usePollAuth } from "../../api/api";
import { useHistory } from "react-router-dom";

const PollSettings = ({ user, slug }) => {
  const { poll, mutate } = usePollAuth(
    slug,
    sessionStorage.getItem("sessionId"),
    localStorage.getItem("token")
  );
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const cancelRef = useRef();
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const history = useHistory();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await api.delete(`/polls/${poll.slug}`);
      setIsOpen(false);
      toast({
        title: "Poll deleted.",
        description: `Your poll "${poll.title}" has been deleted.`,
        status: "success",
        duration: 3000,
      });
      history.push("/");
    } catch (err) {
      console.error(err.message);
      toast({
        title: "Error deleting poll.",
        description: err.message,
        status: "success",
        duration: 4000,
      });
      setIsOpen(false);
    }
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Poll
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>
            <Stack direction="row" m={2} alignSelf="flex-end">
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button colorScheme="blue" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </Stack>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {user && poll && user.username === poll.username && (
        <Menu isLazy>
          <MenuButton
            as={IconButton}
            icon={<SettingsIcon />}
            size={buttonSize}
            variant="outline"
            colorScheme="gray"
          ></MenuButton>

          <MenuList>
            <MenuItem
              icon={poll.isOpen ? <LockIcon /> : <UnlockIcon />}
              onClick={() =>
                api
                  .patch(`/polls/${poll.slug}/isOpen`)
                  .then(() => {
                    mutate();
                  })
                  .catch((err) => {
                    console.error(err.message);
                  })
              }
            >
              {poll.isOpen ? "Close poll" : "Open poll"}
            </MenuItem>
            <MenuItem
              icon={poll.isPrivate ? <ViewIcon /> : <ViewOffIcon />}
              onClick={() =>
                api
                  .patch(`/polls/${poll.slug}/isPrivate`)
                  .then(() => {
                    mutate();
                  })
                  .catch((err) => {
                    console.error(err.message);
                  })
              }
            >
              {poll.isPrivate ? "Set public" : "Set private"}
            </MenuItem>
            <MenuDivider />
            <MenuItem
              color="red.300"
              icon={<DeleteIcon />}
              onClick={() => setIsOpen(true)}
            >
              Delete poll
            </MenuItem>
          </MenuList>
        </Menu>
      )}
    </>
  );
};

export default PollSettings;
