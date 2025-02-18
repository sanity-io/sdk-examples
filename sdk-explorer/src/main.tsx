import { createSanityInstance } from "@sanity/sdk";
import { SanityProvider } from "@sanity/sdk-react/context";
import { ThemeProvider } from "@sanity/ui";
import { buildTheme } from "@sanity/ui/theme";
import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { createGlobalStyle } from "styled-components";
import App from "./App.tsx";
import "./inter.css";
import { schema } from "./schema.ts";
import { Loading } from "./Loading.tsx";

const theme = buildTheme();

const sanityInstance = createSanityInstance({
  // projectId: "flahoy03",
  projectId: "sxsy4puj",
  dataset: "production",
  schema,
});

const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
  }
`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GlobalStyle />
    <ThemeProvider theme={theme}>
      <Suspense fallback={<Loading />}>
        <SanityProvider sanityInstance={sanityInstance}>
          <App />
        </SanityProvider>
      </Suspense>
    </ThemeProvider>
  </StrictMode>
);
