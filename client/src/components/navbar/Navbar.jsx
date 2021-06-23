import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  Spacer,
  Box,
  Text,
  Stack,
  Button,
  Link,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Avatar,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

import "./Navbar.css";
import { api } from "../../api/api";

const Navbar = ({ user }) => {
  const history = useHistory();

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
        <Box mt="auto" mb="auto" pr={2}>
          <Stack direction="row">
            {user.isAuthenticated && user !== undefined ? (
              <>
                <Menu backgroundColor="aliceblue">
                  <MenuButton>{user.data.username}</MenuButton>
                  <MenuList>
                    <MenuItem
                      onClick={() => {
                        history.push(`/profile/${user.data.username}`);
                      }}
                    >
                      View Profile
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        api.delete("/auth/logout").then(() => {
                          localStorage.removeItem("token");
                          localStorage.removeItem("refreshToken");
                          window.location.reload();
                        });
                      }}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </Menu>
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
