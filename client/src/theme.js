import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "576px",
  lg: "768px",
  xl: "1280px",
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  components: {
    Button: {
      // 1. We can update the base styles
      baseStyle: {
        fontWeight: "semibold", // Normally, it is "semibold"
      },
      // 2. We can add a new button size or extend existing
      sizes: {
        lg: {
          h: "32px",
          fontSize: "lg",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#282C34",
      },
    },
  },
  breakpoints,
});
//Helvetica Neue,Roboto
export default theme;
