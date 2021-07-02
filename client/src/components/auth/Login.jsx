import React, { useState } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import { api } from "../../api/api";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsSubmitting(true);
    await api
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then(async (res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setIsSubmitting(false);
        window.location.replace("/");
      })
      .catch((err) => {
        let errMessage;
        if (err.response && err.response.status === 401) {
          errMessage = "The provided credentials are invalid.";
        } else {
          errMessage = err.message;
        }
        toast({
          title: "Error signing in.",
          description: errMessage,
          status: "error",
          duration: 4000,
        });
        setIsSubmitting(false);
      });
  };

  return (
    <>
      <Box
        width={"30em"}
        m="auto"
        top={{ base: "3rem", md: "7rem" }}
        position="relative"
        pb="100px"
      >
        <Box textAlign="center">
          <Heading fontSize={"4xl"}>Sign in to your Polla</Heading>
        </Box>

        <Box
          rounded={"lg"}
          boxShadow={"lg"}
          p={8}
          mt="5"
          backgroundColor={"#11112A"}
          shadow={"1px 1px 3px 3px rgba(0,0,0,0.3)"}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Username</FormLabel>
                <Input
                  autoFocus
                  autoComplete="username"
                  id="loginUsername"
                  name="username"
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Password</FormLabel>
                <Input
                  required
                  autoComplete="current-password"
                  id="loginPassword"
                  name="password"
                  type="password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <Stack spacing={10}>
                <Stack
                  direction={{ base: "column", sm: "row" }}
                  align={"start"}
                  justify={"space-between"}
                ></Stack>
                <Button
                  type="submit"
                  bg={"blue.500"}
                  color={"white"}
                  _hover={{
                    bg: "blue.600",
                  }}
                  isLoading={isSubmitting}
                >
                  Sign in
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
        <Box p={5}>
          <Text color={"gray.500"}>
            Don't have an account yet?{" "}
            <Link as={RouterLink} to="/register">
              <Text as="u">Click here</Text>
            </Link>
          </Text>
        </Box>
      </Box>
    </>
  );
};

export default Login;
