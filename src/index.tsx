// import { Ledger } from 'ual-ledger'
// import { Lynx } from 'ual-lynx'
import { Scatter } from "ual-scatter"
import { UALProvider, withUAL } from "ual-reactjs-renderer"

import { JsonRpc } from "eosjs"
import * as React from "react"
import ReactDOM from "react-dom"

import "@blueprintjs/core/lib/css/blueprint.css"
import { Button, Intent, Spinner } from "@blueprintjs/core"
import { Position, Toaster } from "@blueprintjs/core"

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
console.log("ff ", EXAMPLE_ENV)

// const demoTransaction = {
//   actions: [
//     {
//       account: "eosio.token",
//       name: "transfer",
//       authorization: [
//         {
//           actor: "", // use account that was logged in
//           permission: "active"
//         }
//       ],
//       data: {
//         from: "", // use account that was logged in
//         to: "example",
//         quantity: "1.0000 EOS",
//         memo: "UAL rocks!"
//       }
//     }
//   ]
// }

interface ExampleEnv {
  CHAIN_ID: string
  RPC_PROTOCOL: string
  RPC_HOST: string
  RPC_PORT: string
}

interface TransactionProps {
  ual: any
}

interface TransactionState {
  activeUser: any
  accountName: string
  accountBalance: any
  rpc: JsonRpc //JsonRpc // any
}

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

const defaultState = {
  activeUser: null,
  accountName: "",
  accountBalance: null
}

// expormt me
const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.BOTTOM
})

class TransactionApp extends React.Component<
  TransactionProps,
  TransactionState
> {
  static displayName = "TransactionApp"

  constructor(props: TransactionProps) {
    super(props)
    this.state = {
      ...defaultState,
      rpc: new JsonRpc(
        `${EXAMPLE_ENV.RPC_PROTOCOL}://${EXAMPLE_ENV.RPC_HOST}:${
          EXAMPLE_ENV.RPC_PORT
        }`
      )
    }
    this.updateAccountBalance = this.updateAccountBalance.bind(this)
    this.updateAccountName = this.updateAccountName.bind(this)
    this.renderTransferButton = this.renderTransferButton.bind(this)
    this.transfer = this.transfer.bind(this)
    this.renderModalButton = this.renderModalButton.bind(this)
  }

  public componentDidUpdate() {
    const {
      ual: { activeUser }
    } = this.props
    if (activeUser && !this.state.activeUser) {
      this.setState({ activeUser }, this.updateAccountName)
    } else if (!activeUser && this.state.activeUser) {
      this.setState(defaultState)
    }
  }

  public async updateAccountName(): Promise<void> {
    try {
      const accountName = await this.state.activeUser.getAccountName()
      this.showToast(`Welcome, ${accountName}`)
      this.setState({ accountName }, this.updateAccountBalance)
    } catch (e) {
      console.warn(e)
    }
  }

  public async updateAccountBalance(): Promise<void> {
    try {
      const {accountName} = this.state
      // const account = await this.state.rpc.get_account(this.state.accountName)
      // const accountBalance = account.core_liquid_balance

      const accountEosusd = await this.state.rpc.get_currency_balance(
        "eosusdeosusd",
        accountName,
        "EOSUSD"
      )
      this.setState({ accountBalance: accountEosusd })

      const accountEos = await this.state.rpc.get_currency_balance(
        "eosio.token",
        accountName,
        "EOS"
      )
      this.setState({ accountBalance: this.state.accountBalance+ " | "+ accountEos  })

    } catch (e) {
      console.warn(e)
    }
  }

  public async transfer() {
    const { accountName, activeUser } = this.state
    console.log('a ',accountName ,activeUser)
    const tx = {
      actions: [
        {
          // account: "eosusdeosusd",
          account: "eosio.token",
          name: "transfer",
          authorization: [
            {
              actor: accountName,
              permission: "active"
            }
          ],
          data: {
            from: accountName,
            to: 'eosio.token', 
            quantity: "0.0001 EOS",
            memo: "insurance"
          }
        }
      ]
    }
    // demoTransaction.actions[0].authorization[0].actor = accountName
    // demoTransaction.actions[0].data.from = accountName
    try {
      const res = await activeUser.signTransaction(tx, { broadcast: true })
      console.log('r', res)
      this.updateAccountBalance()
    } catch (error) {
      console.warn(error)
    }
  }

  public renderModalButton() {
    return (
      <p className="ual-btn-wrapper">
        <Button
          role="button"
          onClick={this.props.ual.showModal}
          className="ual-generic-button"
        >
          Login
        </Button>
      </p>
    )
  }

  public renderTransferButton() {
    return (
      <p className="ual-btn-wrapper">
        {/* <span className="ual-generic-button blue" onClick={this.transfer}>
          {"Transfer 1 eos to example"}
        </span> */}
      </p>
    )
  }

  public renderLogoutBtn = () => {
    const {
      ual: { activeUser, activeAuthenticator, logout }
    } = this.props
    if (!!activeUser && !!activeAuthenticator) {
      return (
        <Button className="ual-generic-button red" onClick={logout}>
          {"Logout"}
        </Button>
      )
    }
  }
  showToast = (msg: string) => {
    // create toasts in response to interactions.
    // in most cases, it's enough to simply create and forget (thanks to timeout).
    AppToaster.show({ message: msg })
  }

  public render() {
    const {
      ual: { activeUser }
    } = this.props
    const { accountBalance, accountName } = this.state
    const modalButton = !activeUser && this.renderModalButton()
    const loggedIn = accountName ? `${accountName}` : ""
    const myBalance = accountBalance ? `Balance: ${accountBalance}` : ""
    const transferBtn = accountBalance && this.renderTransferButton()

    const {REACT_APP_VERSION} = process.env
    return (
      <div style={{ textAlign: "center" }}>
        {modalButton}
        {loggedIn}
        {/* <h4 className='ual-subtitle'>{myBalance}</h4> */}
        {/* {transferBtn} */}
        {this.renderLogoutBtn()}
        <p>Balance: {accountBalance || "--"}</p>


        {accountName ? (
          <Button onClick={() => this.transfer()} text="Send EOSUSD test" />
        ) : null}
        <p>
          Version: {REACT_APP_VERSION} Network: {EXAMPLE_ENV.CHAIN_NAME}
        </p>
      </div>
    )
  }
}

const TestAppConsumer = withUAL(TransactionApp)

TestAppConsumer.displayName = "TestAppConsumer"

const appName = "Vigor App"
// const lynx = new Lynx([exampleNet])
// const ledger = new Ledger([exampleNet])
const scatter = new Scatter([exampleNet], { appName })

ReactDOM.render(
  <UALProvider
    chains={[exampleNet]}
    authenticators={[scatter]}
    appName={appName}
  >
    <TestAppConsumer />
  </UALProvider>,
  document.getElementById("root") as HTMLElement
)
