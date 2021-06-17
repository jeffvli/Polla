import { Link as RouterLink } from "react-router-dom";
import { Flex, Spacer, Box, Text, Stack, Button, Link } from "@chakra-ui/react";

import "./Navbar.css";

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
                  as={RouterLink}
                  to="/"
                  size="sm"
                  m="auto"
                  colorScheme="gray"
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
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
                  colorScheme="gray"
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
