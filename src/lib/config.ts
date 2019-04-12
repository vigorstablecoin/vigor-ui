const supportedTokens = (() => {
  const index: string = process.env.REACT_APP_CHAIN_NAME || "Testnet"
  const obj: any = {
    Mainnet: ["eosio.token-EOS", "everipediaiq-IQ"],
    Testnet: [
      "eosio.token-EOS",
      "eosusdcom111-UZD",
      "dummytokens1-IQ",
      "dummytokens1-UTG",
      "dummytokens1-PTI",
      "dummytokens1-OWN",
      "vig111111111-VIG"
    ]
  }
  return obj[index]
})()

const networkConfig = (() => {
  const index: string = process.env.REACT_APP_CHAIN_NAME || "Testnet"
  const obj: any = {
    Mainnet: {
      CHAIN_NAME: "Mainnet",
      CHAIN_ID:
        process.env.REACT_APP_CHAIN_ID ||
        "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
      RPC_PROTOCOL: process.env.REACT_APP_RPC_PROTOCOL || "https",
      RPC_HOST: process.env.REACT_APP_RPC_HOST || "nodes.get-scatter.com",
      RPC_PORT: process.env.REACT_APP_RPC_PORT || "443"
    },
    Testnet: {
      CHAIN_NAME: "Testnet",
      CHAIN_ID:
        process.env.REACT_APP_CHAIN_ID ||
        "cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f",
      RPC_PROTOCOL: process.env.REACT_APP_RPC_PROTOCOL || "http",
      RPC_HOST: process.env.REACT_APP_RPC_HOST || "127.0.0.1",
      RPC_PORT: process.env.REACT_APP_RPC_PORT || "8888"
    }
  }
  return obj[index]
})()

export { supportedTokens, networkConfig }
