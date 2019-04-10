import React, { Component } from "react"
import { supportedTokens } from "./lib/config"
import {
  Button,
  Intent,
  Spinner,
  Position,
  Toaster,
  Divider
} from "@blueprintjs/core"
import "@blueprintjs/core/lib/css/blueprint.css"
import "./App.css"

import { JsonRpc } from "eosjs"
import { NavBar } from "./components/NavBar"
import { UserBalance } from "./components/UserBalance"

// import Button from './components/Button'

function Balance(props: any) {
  const balance = props
  return (
    <span>
      Balance: {balance.EOS} EOS _ {balance.EOSUSD} EOSUSD
    </span>
  )
}

interface TransactionProps {
  ual: any
}

interface TransactionState {
  appName: string
  activeUser: any
  contractState?: any
  rpc: JsonRpc //JsonRpc // any
}

const defaultState = {
  appName: "App",
  activeUser: null
  // accountName: "",
  // accountBalance: null
}

// NOTE: make me a function
class App extends React.Component<TransactionProps, TransactionState> {
  activeUser: any
  constructor(props) {
    super(props)
    console.log("props: ", props)
    const { protocol, host, port } = props.ual.chains[0].rpcEndpoints[0]
    this.state = {
      ...defaultState,
      rpc: new JsonRpc(`${protocol}://${host}:${port}`)
    }
    this.updateAccountBalances = this.updateAccountBalances.bind(this)
  }

  // TODO: hooks useRef()
  public componentDidUpdate() {
    const {
      ual: { activeUser }
    } = this.props
    if (activeUser && !this.state.activeUser) {
      this.setState(
        {
          activeUser: {
            ...this.activeUser,
            accountName: activeUser.accountName
          }
        },
        this.updateAccountBalances
      )
    } else if (!activeUser && this.state.activeUser) {
      this.setState(defaultState)
    }
  }

  public async updateAccountBalances(): Promise<void> {
    try {
      const {
        activeUser: { accountName }
      } = this.state

      supportedTokens.map(async t => {
        try {
          const [tokenContract, tokenSymbol] = t.split("-")
          // TODO: loop me
          const balanceToken = await this.state.rpc.get_currency_balance(
            tokenContract,
            accountName,
            tokenSymbol
          )

          console.log(JSON.stringify(balanceToken))
          const [balance, symbol] = balanceToken[0].split(" ")
          this.setState({
            activeUser: {
              ...this.state.activeUser,
              balance: { ...this.state.activeUser.balance, [symbol]: balance }
            }
          })
        } catch (error) {
          // NOTE: it raise an error if the user has not balance for a supported token
          // console.warn(t, error)
        }
      })

      // TODO: other function
      // lower_bound: -1, upper_bound: upperBound, limit: limit
      // const res = await this.state.rpc.get_table_by_scope({code:'eosusdcom111', table: "stat"});
      // const res = await this.state.rpc.get_table_rows({
      //   code: "eosusdcom111",
      //   scope: "UZD",
      //   table: "stat"
      // })
      // this.setState({
      //   ...this.state,
      //   contractState: JSON.stringify(res, null, 2)
      // })
    } catch (e) {
      console.warn(e)
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

  render() {
    const {
      ual: { logout }
    } = this.props

    const { activeUser, appName } = this.state

    return (
      <div className="App">
        <NavBar
          appName={appName}
          activeUser={activeUser}
          onLogin={this.props.ual.showModal}
          onLogout={logout}
        />

        <div style={{ width: 200 }}>
          <UserBalance activeUser={activeUser} />
        </div>

        {this.state.contractState ? (
          <div>
            <h2>smart contract state</h2>
            <pre>{this.state.contractState}</pre>
          </div>
        ) : null}
        {/* Version: {this.props.appVersion} Network: {this.props.chainName} */}
        {/* {modalButton} */}
        <p>{/* <Balance {...this.state.balance} /> */}</p>
        {/* <p>
          Attaching to Scatter.. <Button>Click me</Button>
        </p> */}
      </div>
    )
  }
}

export default App
