import axios from "axios";
import React from "react";
import { StaticRouter } from "react-router-dom";
import express from "express";
import { renderToString } from "react-dom/server";
import { Provider } from "react-redux";
import { createStore } from "redux";
import rootReducer from "./store";
import App from "./App";

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST);

const API_KEY =
  process.env.REACT_APP_API_KEY || "12300b7348a6461ab665fb6220127ce1";
const SERVER_URL = process.env.REACT_APP_SERVER_URL || "http://localhost:3000";

const server = express();

server.get("/api/news", (req, res) => {
  const { page, sources } = req.query;
  axios(
    `https://newsapi.org/v2/everything?apiKey=${API_KEY}&page=${
      page || "1"
    }&pageSize=10${
      sources ? `&sources=${sources}` : "&sources=the-times-of-india"
    }`
  )
    .then((response) => {
      res.json({
        ...response.data,
        page: page || 1,
        sources: sources || "the-times-of-india",
      });
    })
    .catch((e) => console.log(e));
});

server.get("/api/headlines", (req, res) => {
  const { page } = req.query;
  axios(
    `https://newsapi.org/v2/top-headlines?country=in&apiKey=${API_KEY}&page=${
      page || "1"
    }&pageSize=10`
  )
    .then((response) => {
      res.json({
        ...response.data,
        page: page || 1,
      });
    })
    .catch((e) => console.log(e));
});

server
  .disable("x-powered-by")
  .use(express.static(process.env.RAZZLE_PUBLIC_DIR))
  .get("/*", async (req, res) => {
    const context = {};

    const news = await axios(`${SERVER_URL}/api/news`)
      .then((response) => response.data)
      .catch((e) => console.log(e));
    news.page = 1;
    news.sources = "";

    const headlines = await axios(`${SERVER_URL}/api/headlines`)
      .then((response) => response.data)
      .catch((e) => console.log(e));
    headlines.page = 1;

    const sources = await axios(
      `https://newsapi.org/v2/sources?language=en&apiKey=${API_KEY}`
    )
      .then((response) => response.data)
      .catch((e) => console.log(e));

    const preloadedState = { news, headlines, sources };

    const store = createStore(rootReducer, preloadedState);

    const markup = renderToString(
      <StaticRouter context={context} location={req.url}>
        <Provider store={store}>
          <App />
        </Provider>
      </StaticRouter>
    );

    const finalState = store.getState();

    if (context.url) {
      res.redirect(context.url);
    } else {
      res.status(200).send(renderFullPage(markup, finalState));
    }
  });

function renderFullPage(markup, preloadedState) {
  return `<!doctype html>
    <html lang="">
      <head>
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta charset="utf-8" />
          <title>Welcome to Razzle</title>
          <meta name="viewport" content="width=device-width, initial-scale=1">
          ${
            assets.client.css
              ? `<link rel="stylesheet" href="${assets.client.css}">`
              : ""
          }
          ${
            process.env.NODE_ENV === "production"
              ? `<script src="${assets.client.js}" defer></script>`
              : `<script src="${assets.client.js}" defer crossorigin></script>`
          }
      </head>
      <body>
          <div id="root">${markup}</div>
          <script>
            // WARNING: See the following for security issues around embedding JSON in HTML:
            // https://redux.js.org/recipes/server-rendering/#security-considerations
            window.__PRELOADED_STATE__ = ${JSON.stringify(
              preloadedState
            ).replace(/</g, "\\u003c")}
          </script>
      </body>
    </html>`;
}

export default server;
