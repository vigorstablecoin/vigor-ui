import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import * as serviceWorker from "./serviceWorker"

import { Scatter } from "ual-scatter"
import { UALProvider, withUAL } from "ual-reactjs-renderer"

const TestAppConsumer = withUAL(App)

// NOTE: Use .env to override
const EXAMPLE_ENV = {
  CHAIN_NAME: process.env.REACT_APP_CHAIN_NAME || "Localnet",
  CHAIN_ID:
    process.env.REACT_APP_CHAIN_ID ||
    "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
  RPC_PROTOCOL: process.env.REACT_APP_RPC_PROTOCOL || "http",
  RPC_HOST: process.env.REACT_APP_RPC_HOST || "127.0.0.1",
  RPC_PORT: process.env.REACT_APP_RPC_PORT || "8888"
}
console.log("EXAMPLE_ENV ", EXAMPLE_ENV)

const exampleNet = {
  chainId: EXAMPLE_ENV.CHAIN_ID,
  rpcEndpoints: [
    {
      protocol: EXAMPLE_ENV.RPC_PROTOCOL,
      host: EXAMPLE_ENV.RPC_HOST,
      port: Number(EXAMPLE_ENV.RPC_PORT)
    }
  ]
}

const appName = "Vigor App"
const scatter = new Scatter([exampleNet], { appName })

ReactDOM.render(
  <UALProvider
    chains={[exampleNet]}
    authenticators={[scatter]}
    appName={appName}
    // TODO: pass to App
    // appVersion={process.env.REACT_APP_VERSION}
    // chainName={EXAMPLE_ENV.CHAIN_NAME}
  >
    <TestAppConsumer />
  </UALProvider>,
  document.getElementById("root")
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
