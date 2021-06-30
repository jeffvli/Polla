import { Link as RouterLink } from "react-router-dom";
import {
  Flex,
  Spacer,
  Box,
  Stack,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory } from "react-router-dom";

import "./Navbar.css";
import { api } from "../../api/api";

const Navbar = ({ user }) => {
  const history = useHistory();
  console.log(user);

  return (
    <nav>
      <Flex backgroundColor="#12161E">
        <a href="/" className="title" id="title">
          Polla
        </a>
        <Spacer />
        {user.isAuthenticated && user.data ? (
          <Menu isLazy>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              variant="ghost"
            >
              {user.data.username}
            </MenuButton>
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
        ) : (
          <Box mt="auto" mb="auto" pr={3}>
            <Stack direction="row">
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
            </Stack>
          </Box>
        )}
      </Flex>
    </nav>
  );
};

export default Navbar;
