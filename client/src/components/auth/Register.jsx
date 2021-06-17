import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  CircularProgress,
  InputGroup,
  Text,
  Stack,
  List,
  ListItem,
  ListIcon,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, Redirect } from "react-router-dom";
import { MdCheckCircle } from "react-icons/md";
import { nanoid } from "nanoid";
import produce from "immer";

import { api } from "../../api/api";
import ResponsiveBox from "../generic/responsivebox/ResponsiveBox";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [usernameRequirements, setUsernameRequirements] = useState([
    {
      id: "charLimit",
      text: "Between 3 and 20 characters",
      pass: false,
    },
    {
      id: "noWhiteSpace",
      text: "No whitespaces",
      pass: false,
    },
    {
      id: "noSpecialChar",
      text: "No special characters",
      pass: false,
    },
    {
      id: "isAvailable",
      text: "Is available",
      pass: false,
    },
  ]);

  const [passwordRequirements, setPasswordRequirements] = useState([
    {
      id: "charLimit",
      text: "Between 7 and 64 characters",
      pass: false,
    },
    {
      id: "matching",
      text: "Passwords match",
      pass: false,
    },
  ]);

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const failedUsernameReqs = usernameRequirements.filter((req) => {
      return req.pass === false;
    });

    const failedPasswordReqs = passwordRequirements.filter((req) => {
      return req.pass === false;
    });

    if (failedUsernameReqs.length > 0 || failedPasswordReqs.length > 0) {
      toast({
        title: "Error creating account.",
        description:
          "Ensure that all username and password validations are met.",
        status: "error",
        duration: 4000,
      });
      setIsLoading(false);
    } else {
      await api
        .post("/auth/register", {
          username: username,
          password: password,
        })
        .then(() => {
          toast({
            title: "Account created.",
            description: "You can now login with your provided credentials.",
            status: "success",
            duration: 3000,
          });
          setIsLoading(false);
          setRegisterSuccess(true);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const handleUsername = (e) => {
    let usernameTxt = e.target.value;
    setUsername(usernameTxt);

    setUsernameRequirements(
      produce(usernameRequirements, (draft) => {
        const charLimitIndex = draft.findIndex((req) => req.id === "charLimit");
        const whiteSpaceIndex = draft.findIndex(
          (req) => req.id === "noWhiteSpace"
        );
        const specialCharIndex = draft.findIndex(
          (req) => req.id === "noSpecialChar"
        );

        usernameTxt.length > 2 && usernameTxt.length < 21
          ? (draft[charLimitIndex].pass = true)
          : (draft[charLimitIndex].pass = false);

        String(usernameTxt).match(/^\S+$/)
          ? (draft[whiteSpaceIndex].pass = true)
          : (draft[whiteSpaceIndex].pass = false);

        String(usernameTxt).match(/^[a-z0-9]+$/i)
          ? (draft[specialCharIndex].pass = true)
          : (draft[specialCharIndex].pass = false);
      })
    );
  };

  const handlePassword = (e, repeat) => {
    let passwordTxt = e.target.value;
    setPassword(passwordTxt);

    setPasswordRequirements(
      produce(passwordRequirements, (draft) => {
        const charLimitIndex = draft.findIndex((req) => req.id === "charLimit");
        const matchingIndex = draft.findIndex((req) => req.id === "matching");

        passwordTxt.length > 6 && passwordTxt.length < 64
          ? (draft[charLimitIndex].pass = true)
          : (draft[charLimitIndex].pass = false);

        String(passwordTxt) === String(repeatPassword)
          ? (draft[matchingIndex].pass = true)
          : (draft[matchingIndex].pass = false);
      })
    );
  };

  const handleRepeatPassword = (e) => {
    let passwordTxt = e.target.value;
    setRepeatPassword(passwordTxt);

    setPasswordRequirements(
      produce(passwordRequirements, (draft) => {
        const matchingIndex = draft.findIndex((req) => req.id === "matching");

        String(passwordTxt) === String(password)
          ? (draft[matchingIndex].pass = true)
          : (draft[matchingIndex].pass = false);
      })
    );
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (username !== "" && username.length > 2) {
        api.get(`/users?username=${username}`).then((res) => {
          console.log(res);
          setUsernameRequirements(
            produce(usernameRequirements, (draft) => {
              const isAvailableIndex = draft.findIndex(
                (req) => req.id === "isAvailable"
              );
              if (res.data.length > 0) {
                draft[isAvailableIndex].pass = false;
              } else {
                draft[isAvailableIndex].pass = true;
              }
            })
          );
        });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  return (
    <>
      {registerSuccess && <Redirect to="/login" />}
      <ResponsiveBox>
        <Box textAlign="center">
          <Heading>Account Registration</Heading>
          <Text color={"gray.500"}>
            Create an account to access additional features such as poll groups
            and more!
          </Text>
        </Box>
      </ResponsiveBox>
      <ResponsiveBox variant="bordered">
        <form onSubmit={handleSubmit}>
          <Box
            borderRadius="8px"
            border="1px solid"
            borderColor={"gray.600"}
            padding="1rem"
          >
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input size="lg" maxLength="20" onChange={handleUsername} />
            </FormControl>
            <List mt={5} spacing={2}>
              {usernameRequirements.map((requirement) => (
                <ListItem key={nanoid()} fontSize=".9em">
                  <ListIcon
                    as={MdCheckCircle}
                    color={requirement.pass ? "green.500" : "red.500"}
                  ></ListIcon>
                  {requirement.text}
                </ListItem>
              ))}
            </List>
          </Box>
          <Box
            mt={10}
            borderRadius="8px"
            border="1px solid"
            borderColor={"gray.600"}
            padding="1rem"
          >
            <Stack spacing={5}>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    size="lg"
                    maxLength="64"
                    type="password"
                    onChange={handlePassword}
                  />
                </InputGroup>
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Repeat Password</FormLabel>
                <InputGroup>
                  <Input
                    size="lg"
                    maxLength="64"
                    type="password"
                    onChange={handleRepeatPassword}
                  />
                </InputGroup>
              </FormControl>
            </Stack>
            <List mt={5} spacing={2}>
              {passwordRequirements.map((requirement) => (
                <ListItem key={nanoid()} fontSize=".9em">
                  <ListIcon
                    as={MdCheckCircle}
                    color={requirement.pass ? "green.500" : "red.500"}
                  ></ListIcon>
                  {requirement.text}
                </ListItem>
              ))}
            </List>
          </Box>
          <Box mt={10}>
            <Button
              type="submit"
              width="full"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
            >
              {isLoading ? (
                <CircularProgress isIndeterminate size="24px" color="teal" />
              ) : (
                "Register"
              )}
            </Button>
          </Box>
        </form>
      </ResponsiveBox>
      <ResponsiveBox>
        <Box>
          <Text color={"gray.500"}>
            Already have an account?{" "}
            <Link as={RouterLink} to="/login">
              <Text as="u">Click here</Text>
            </Link>
          </Text>
        </Box>
      </ResponsiveBox>
    </>
  );
};

export default Register;
