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

const Login = ({ user }) => {
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
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        setIsSubmitting(false);
        window.location.replace(`${process.env.REACT_APP_BASE_URL}`);
      })
      .catch((err) => {
        toast({
          title: "Error signing in.",
          description: "The provided credentials are invalid.",
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
          bg="#212836"
          boxShadow={"lg"}
          p={8}
          mt="5"
          backgroundColor={"#282C34"}
          shadow={"1px 1px 3px 3px rgba(0,0,0,0.3)"}
        >
          <form onSubmit={handleSubmit}>
            <Stack spacing={4}>
              <FormControl id="email">
                <FormLabel>Username</FormLabel>
                <Input
                  type="text"
                  onChange={(e) => setUsername(e.target.value)}
                />
              </FormControl>
              <FormControl id="password">
                <FormLabel>Password</FormLabel>
                <Input
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
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
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
