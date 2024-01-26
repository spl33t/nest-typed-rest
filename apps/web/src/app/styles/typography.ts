import { css } from "styled-components";

import MontserratBlack from "@/shared/assets/fonts/montserrat/Montserrat-Black.woff2";
import MontserratBold from "@/shared/assets/fonts/montserrat/Montserrat-Bold.woff2";
import MontserratRegular from "@/shared/assets/fonts/montserrat/Montserrat-Regular.woff2";

// Text
const textFont = "Montserrat";
const textLineHeight = 1.8;

// Headings
const headlinesFont = "Montserrat";
const headlinesWeight = 800;
const headlinesLineHeight = 1.4;


export const typography = css`
  @font-face {
    font-family: "Montserrat";
    src: url(${MontserratRegular}) format("woff2");
    font-weight: 300;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Montserrat";
    src: url(${MontserratBold}) format("woff2");
    font-weight: 600;
    font-style: normal;
    font-display: swap;
  }

  @font-face {
    font-family: "Montserrat";
    src: url(${MontserratBlack}) format("woff2");
    font-weight: 800;
    font-style: normal;
    font-display: swap;
  }

  * {
    font-family: ${textFont};
    line-height: ${textLineHeight};
    font-synthesis: none;
    text-decoration: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }

  a {
    color: black;
  }


  b, strong {
    font-weight: 600;
  }

  /**
  / Headings 
  */

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    font-family: ${headlinesFont};
    font-weight: ${headlinesWeight};
    line-height: ${headlinesLineHeight};
  }

  h1 {
    font-size: 56px;
  }

  h2 {
    font-size: 44px;
  }

  h3 {
    font-size: 32px;
  }

  h4 {
    font-size: 28px;
  }

  h5 {
    font-size: 24px;
  }

  h6 {
    font-size: 20px;
  }
`;