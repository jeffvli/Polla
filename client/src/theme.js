import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

export const defaultResponsiveWidth = {
  base: "90%",
  md: "55em",
};

const breakpoints = createBreakpoints({
  md: "60em",
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
    },
  },
  breakpoints,
});
//Helvetica Neue,Roboto
export default theme;
