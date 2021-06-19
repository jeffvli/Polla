import { Link as RouterLink } from "react-router-dom";
import { Flex, Spacer, Box, Text, Stack, Button, Link } from "@chakra-ui/react";

import "./Navbar.css";
import { api } from "../../api/api";

const Navbar = ({ user }) => {
  return (
    <nav>
      <Flex backgroundColor="#12161E">
        <Link
          as={RouterLink}
          to="/"
          className="navbar-brand"
          fontSize="24"
          pl="2"
          color="white"
        >
          <Text fontSize="2xl">Polla</Text>
        </Link>
        <Spacer />
        <Box mt={0.5}>
          <Stack direction="row">
            {user.isAuthenticated && user !== undefined ? (
              <>
                <Button
                  size="sm"
                  m="auto"
                  variant="ghost"
                  onClick={() => {
                    api.delete("/auth/logout").then(() => {
                      localStorage.removeItem("token");
                      localStorage.removeItem("refreshToken");
                      window.location.reload();
                    });
                  }}
                >
                  Log out
                </Button>
              </>
            ) : (
              <>
                <Button
                  as={RouterLink}
                  to="/login"
                  size="sm"
                  m="auto"
                  variant="ghost"
                >
                  Log In
                </Button>
                <Button
                  as={RouterLink}
                  to="/register"
                  size="sm"
                  m="auto"
                  bg={"blue.400"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Stack>
        </Box>
      </Flex>
    </nav>
  );
};

export default Navbar;
