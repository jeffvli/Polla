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
  Link,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { useHistory, Link as RouterLink } from "react-router-dom";

import "./Navbar.css";
import { api } from "../../api/api";

const Navbar = ({ user }) => {
  const history = useHistory();

  return (
    <Flex
      as="nav"
      backgroundColor="#141820"
      borderColor="#31334A"
      borderBottomWidth="1px"
    >
      <Link as={RouterLink} className="title" id="title" to="/" outline={0}>
        Polla
      </Link>
      <Spacer />
      <Button
        as={RouterLink}
        to="/discover"
        size="sm"
        m="auto"
        mr="1rem"
        bg={"blue.500"}
        _hover={{
          bg: "blue.600",
        }}
      >
        Discover
      </Button>
      {user ? (
        <Menu isLazy>
          <MenuButton
            as={Button}
            m="auto"
            rightIcon={<ChevronDownIcon />}
            variant="ghost"
          >
            {user.username}
          </MenuButton>
          <MenuList>
            <MenuItem
              onClick={() => {
                history.push(`/profile/${user.username}`);
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
                to="/register"
                size="sm"
                m="auto"
                bg={"blue.500"}
                _hover={{
                  bg: "blue.600",
                }}
              >
                Register
              </Button>
              <Button
                as={RouterLink}
                to="/login"
                size="sm"
                m="auto"
                variant="outline"
              >
                Log In
              </Button>
            </>
          </Stack>
        </Box>
      )}
    </Flex>
  );
};

export default Navbar;
