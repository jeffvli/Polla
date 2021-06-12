import React from "react";
import { Box } from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";
import { Icon } from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";

import "./Footer.css";

const Footer = () => {
  return (
    <footer>
      <Box height={10} textAlign="right">
        <Link href={process.env.REACT_APP_GITHUB_URL} isExternal>
          <Icon as={FaGithub} w={8} h={8} m={1} />
        </Link>
      </Box>
    </footer>
  );
};

export default Footer;
