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
} from "@chakra-ui/react";
import { Link as RouterLink, useHistory } from "react-router-dom";

import { api } from "../../api/api";

const Login = ({ user }) => {
  let history = useHistory();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    setIsLoading(true);
    await api
      .post("/auth/login", {
        username: username,
        password: password,
      })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        setIsLoading(false);
        history.goBack();
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };

  return (
    <>
      {!user.isAuthenticated && (
        <Box width={"30em"} m="auto" top="50px" position="relative" pb="100px">
          <Box textAlign="center">
            <Heading fontSize={"4xl"}>Sign in to your Polla</Heading>
          </Box>

          <Box
            rounded={"lg"}
            bg="#212836"
            boxShadow={"lg"}
            p={8}
            mt="5"
            backgroundColor={"#212836"}
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
      )}
    </>
  );
};

export default Login;
