import React from "react";
import { Box } from "@chakra-ui/react";

import { defaultResponsiveWidth } from "../../styling";

const ResponsiveBox = ({ children, variant }) => {
  return (
    <Box
      width={defaultResponsiveWidth}
      backgroundColor={variant === "bordered" ? "#212836" : void 0}
      shadow={
        variant === "bordered" ? "1px 1px 3px 3px rgba(0,0,0,0.3)" : void 0
      }
      borderRadius={variant === "bordered" ? "lg" : void 0}
      p={5}
      ml="auto"
      mr="auto"
      mb={20}
    >
      {children}
    </Box>
  );
};

export default ResponsiveBox;
