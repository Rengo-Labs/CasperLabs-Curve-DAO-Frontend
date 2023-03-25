import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import axios from "axios";

import "./index.css";
import App from "./app/containers/App/Application";

import * as serviceWorker from "./serviceWorker";

const client = new ApolloClient({
uri: process.env.REACT_APP_BACKEND_SERVER_ADDRESS
? process.env.REACT_APP_BACKEND_SERVER_ADDRESS
: "http://localhost:3000/graphql",
cache: new InMemoryCache(),
});

axios.defaults.baseURL = process.env.REACT_APP_BACKEND_SERVER_ADDRESS
? process.env.REACT_APP_BACKEND_SERVER_ADDRESS
: "http://localhost:3000/";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
<ApolloProvider client={client}>
<App />
</ApolloProvider>
);

serviceWorker.unregister();