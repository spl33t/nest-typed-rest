import { createGlobalStyle } from "styled-components";

import { typography } from "./typography";

export const GlobalStyles = createGlobalStyle`
  ${typography}
  * {
    box-sizing: border-box;
  }

  body {
    max-width: 1200px;
    margin: 10px auto;
  }

  #root {
    width: 100%;
  }

  html {
    margin-right: calc(-1 * (100vw - 100%));
    overflow-x: hidden;
  }
  
  ::-webkit-scrollbar {
    -webkit-appearance: none;
    height: 10px;
    width: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #2589ea;
  }
`;