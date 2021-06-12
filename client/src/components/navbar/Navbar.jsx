import { Flex, Spacer, Box, Text, Link } from "@chakra-ui/react";
import { ColorModeSwitcher } from "./ColorModeSwitcher";
import "./Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <Flex backgroundColor="#21252B">
        <Box width="100%">
          <Link
            to="/"
            className="navbar-brand"
            fontSize="24"
            pl="2"
            color="white"
          >
            Polla
          </Link>
        </Box>
        <Spacer />
      </Flex>
    </nav>
  );
};

export default Navbar;
