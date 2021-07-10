import React from "react";
import { Box } from "@chakra-ui/react";

import { defaultResponsiveWidth } from "../../../theme";

const ResponsiveBox = ({ children, variant, isLoading, ...rest }) => {
  return (
    <Box
      width={defaultResponsiveWidth}
      maxWidth={rest.maxWidth}
      backgroundColor={variant === "bordered" ? "#212836" : void 0}
      shadow={
        variant === "bordered" ? "1px 1px 3px 3px rgba(0,0,0,0.3)" : void 0
      }
      borderRadius={variant === "bordered" ? "lg" : void 0}
      p={rest.p ? rest.p : 5}
      ml="auto"
      mr="auto"
      mb={rest.mb}
      mt={rest.mt}
      pointerEvents={isLoading ? "none" : void 0}
      minHeight={rest.minHeight}
    >
      {children}
    </Box>
  );
};

export default ResponsiveBox;
