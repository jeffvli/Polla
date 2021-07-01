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
  components: {},
  styles: {
    global: {
      body: {
        bg: "#272C35",
      },
      ':focus:not(:focus-visible):not([role="dialog"]):not([role="menu"])': {
        boxShadow: "none !important",
      },
    },
  },
  breakpoints,
});
//Helvetica Neue,Roboto
export default theme;
