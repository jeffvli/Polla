import React from "react";
import { Box } from "@chakra-ui/react";

import { defaultResponsiveWidth } from "../../../theme";

const ResponsiveBox = ({ children, variant, mt, mb, isLoading }) => {
  return (
    <Box
      width={defaultResponsiveWidth}
      backgroundColor={variant === "bordered" ? "#282C34" : void 0}
      shadow={
        variant === "bordered" ? "1px 1px 3px 3px rgba(0,0,0,0.3)" : void 0
      }
      borderRadius={variant === "bordered" ? "lg" : void 0}
      p={5}
      ml="auto"
      mr="auto"
      mb={mb}
      mt={mt}
      pointerEvents={isLoading ? "none" : void 0}
    >
      {children}
    </Box>
  );
};

export default ResponsiveBox;
