import React from "react";
import { CookiesProvider } from "react-cookie";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App";
import { OverlayContextProvider } from "./components/AppContent/AppOverlayContext";
import { ScrollContextProvider } from "./components/AppContent/AppScrollContext";
import { ConfigProvider } from "./Config";
import store from "./redux/store";
import reportWebVitals from "./reportWebVitals";
import { AppName } from "./utils/ProjectName/Index";

// import i18n (needs to be bundled 😉)
import "./Localization/i18n";
import { Suspense } from "react";

if (process.env.NODE_ENV === "development") {
  const { worker } = require("./mocks/browser");
  worker.start({
    serviceWorker: {
      url: `${process.env.PUBLIC_URL}/mockServiceWorker.js`,
    },
  });
}

var contentSecurityPolicyMetaTag = document.createElement("meta");
contentSecurityPolicyMetaTag.httpEquiv = "Content-Security-Policy";
contentSecurityPolicyMetaTag.content =
  "default-src 'self'; script-src 'self'  'unsafe-inline'; style-src 'self' 'unsafe-inline'; font-src 'self'; base-uri 'self'; img-src 'self' data:;";

if (process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test") {
  document
    .getElementsByTagName("head")[0]
    .appendChild(contentSecurityPolicyMetaTag);
}

ReactDOM.render(
  <Suspense fallback={"Loading..."}>
    <Router basename={`/${AppName.toLowerCase()}`}>
      <CookiesProvider>
        <ConfigProvider>
          <ScrollContextProvider>
            <OverlayContextProvider>
              <Provider store={store}>
                <App />
              </Provider>
            </OverlayContextProvider>
          </ScrollContextProvider>
        </ConfigProvider>
      </CookiesProvider>
    </Router>
  </Suspense>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results ( for example: reportWebVitals ( console. log ) )
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
