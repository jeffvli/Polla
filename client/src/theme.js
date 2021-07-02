import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

export const defaultResponsiveWidth = {
  base: "100%",
  md: "55em",
};

const breakpoints = createBreakpoints({
  md: "60em",
});

const theme = extendTheme({
  fonts: {
    heading: "Barlow",
    body: "Inter, Montserrat, sans-serif",
  },
  config: {
    initialColorMode: "dark",
  },
  components: {
    Button: {
      baseStyle: {
        borderRadius: "2px",
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: "#070720",
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
