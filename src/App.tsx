import React, { Component } from "react"
import {
  Button,
  Intent,
  Spinner,
  Position,
  Toaster,
  Divider
} from "@blueprintjs/core"
// tslint:disable-next-line: no-submodule-imports
import "@blueprintjs/core/lib/css/blueprint.css"
import "./App.css"

import { JsonRpc } from "eosjs"

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
  activeUser: any
  contractState?: any
  rpc: JsonRpc //JsonRpc // any
}

const defaultState = {
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

      const accountEos = await this.state.rpc.get_currency_balance(
        "eosio.token",
        accountName,
        "EOS"
      )
      console.log(accountEos)
      this.setState({
        activeUser: {
          ...this.state.activeUser,
          balanceEos: accountEos
        }
      })
      // lower_bound: -1, upper_bound: upperBound, limit: limit
      // const res = await this.state.rpc.get_table_by_scope({code:'eosusdcom111', table: "stat"});
      const res = await this.state.rpc.get_table_rows({
        code: "eosusdcom111",
        scope: "UZD",
        table: "stat"
      })
      this.setState({
        ...this.state,
        contractState: JSON.stringify(res, null, 2)
      })
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

    const { activeUser } = this.state

    return (
      <div className="App">
        {activeUser ? (
          <div>
            {activeUser.accountName}
            {activeUser.balanceEos || " -- EOS"}
          </div>
        ) : null}
        <p className="ual-btn-wrapper">
          <Button
            onClick={() => {
              console.log("o ", this.props.ual)
              this.props.ual.showModal()
            }}
          >
            Login
          </Button>
        </p>
        <p>
          <Button onClick={logout}>{"Logout"}</Button>
        </p>
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
