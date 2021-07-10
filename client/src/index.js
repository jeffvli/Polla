import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { ChakraProvider } from "@chakra-ui/react";
import { HelmetProvider } from "react-helmet-async";
import theme from "./theme";
import "@fontsource/barlow";
import "./index.css";
const helmetContext = {};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
