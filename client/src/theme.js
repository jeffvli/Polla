import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

export const defaultResponsiveWidth = {
  base: "95%",
  md: "55em",
};

const breakpoints = createBreakpoints({
  md: "55em",
});

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
  },
  components: {
    AlertDialog: {
      colorScheme: {
        gray: {
          bg: "red.400",
        },
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#272C35",
      },
    },
  },
  breakpoints,
});
//Helvetica Neue,Roboto
export default theme;
