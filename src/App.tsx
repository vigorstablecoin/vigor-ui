import React, { Component, useState, useEffect } from "react"
import { supportedTokens } from "./lib/config"
import { Button, InputGroup, Label } from "@blueprintjs/core"
import "@blueprintjs/core/lib/css/blueprint.css"
import "./App.css"

import { JsonRpc } from "eosjs"
import { NavBar } from "./components/NavBar"
import { UserBalance } from "./components/UserBalance"

// import Button from './components/Button'

/// HACK
import { Api } from "eosjs"
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig" // development only
import { networkConfig } from "./lib/config"
/// / HACK

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
  loading: boolean
  activeUser: any
  contractState?: any
  rpc: JsonRpc //JsonRpc // any
}

const defaultState = {
  appName: "App",
  activeUser: null,
  loading: false
  // accountName: "",
  // accountBalance: null
}

function SendTest(props) {
  const [to, setTo] = useState("eosusdcom111")
  const [quantity, setQuantity] = useState("0.0001 EOS")
  const [memo, setMemo] = useState("insurance")

  return (
    <>
      <Label className="bp3-inline">
        To
        <InputGroup
          leftIcon="filter"
          onChange={input => setTo(input.currentTarget.value)}
          defaultValue={to}
        />
      </Label>
      <Label className="bp3-inline">
        Quantity
        <InputGroup
          leftIcon="filter"
          onChange={input => setQuantity(input.currentTarget.value)}
          defaultValue={quantity}
        />
      </Label>
      <Label className="bp3-inline">
        Memo
        <InputGroup
          leftIcon="filter"
          onChange={input => setMemo(input.currentTarget.value)}
          defaultValue={memo}
        />
      </Label>
      <Button
        loading={props.loading}
        onClick={() => {
          props.transfer({
            contract: "eosio.token",
            to: to,
            quantity: quantity,
            memo: memo
          })
        }}
      >
        Send
      </Button>
    </>
  )
}

function AdminBox(props) {
  return (
    <div>
      <h5>AdminBox</h5>
      <Button onClick={() => props.updateOracle()}>Update Oracle Price</Button>
      <Button onClick={() => props.doUpdate()}>doUpdate</Button>
    </div>
  )
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
    this.transfer = this.transfer.bind(this)
    // this.transfer = this.transfer.bind(this)

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

  // BUG: message: "transaction declares authority '{"actor":"XXXX","permission":"active"}', but does not have signatures for it."
  public async transferb() {
    const { activeUser } = this.props.ual
    const {
      activeUser: { accountName }
    } = this.state
    console.log("a ", accountName, activeUser)
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
            to: "eosio.token",
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
      console.log("r", res)
      // this.updateAccountBalance()
    } catch (error) {
      console.warn(error)
    }
  }

  // BUG: it shouldn't use eosjs without Scatter
  public async transfer({ contract, to, quantity, memo }) {
    const {
      activeUser: { accountName }
    } = this.state
    const from = accountName

    const net = `${networkConfig.RPC_PROTOCOL}://${networkConfig.RPC_HOST}:${
      networkConfig.RPC_PORT
    }`
    const rpc = new JsonRpc(net, { fetch })
    const defaultPrivateKey = process.env.REACT_APP_PRIVATEKEY // testborrow11
    const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })

    this.setState({ ...this.state, loading: true })
    console.warn(`TX: ${net} ${contract} ${from} ${to} ${quantity} ${memo}`)
    const result = await api.transact(
      {
        actions: [
          {
            account: contract,
            name: "transfer",
            authorization: [
              {
                actor: from,
                permission: "active"
              }
            ],
            data: {
              from: from,
              to: to,
              quantity: quantity,
              memo: memo
            }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    )
    console.dir(result)
    // HACK: the tx isn't immediately effective
    setTimeout(() => {
      this.updateAccountBalances()
      this.setState({ ...this.state, loading: false })
    }, 1000)
  }

  //  cleos push action oracle111111 write '{"owner":"feeder111111", "value":63800}' -p feeder111111@active

  public async updateOracle() {
    const from = "feeder111111"
    const contract = "oracle111111"

    const net = `${networkConfig.RPC_PROTOCOL}://${networkConfig.RPC_HOST}:${
      networkConfig.RPC_PORT
    }`
    const rpc = new JsonRpc(net, { fetch })
    const defaultPrivateKey = process.env.REACT_APP_PRIVATEKEY // feeder
    const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })


    // this.setState({ ...this.state, loading: true })
    console.warn(`TX: ${net} ${contract} ${from} `)
    const result = await api.transact(
      {
        actions: [
          {
            account: contract,
            name: "write",
            authorization: [
              {
                actor: from,
                permission: "active"
              }
            ],
            data: { owner: from, value: 63800 }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    )
    console.dir(result)
    // HACK: the tx isn't immediately effective
    setTimeout(() => {
      // this.updateAccountBalances()
      // this.setState({ ...this.state, loading: false })
    }, 1000)
  }

  // cleos push action eosusdcom111 doupdate '{}' -p eosusdcom111@active

  public async doUpdate() {
    const from = "eosusdcom111"
    const contract = "eosusdcom111"

    const net = `${networkConfig.RPC_PROTOCOL}://${networkConfig.RPC_HOST}:${
      networkConfig.RPC_PORT
    }`
    const rpc = new JsonRpc(net, { fetch })
    const defaultPrivateKey = '5K9sQVS3KAXe9ecBjs7PEmLXtE5mqvAVKRaytG3DN8aagWmMj4W' // eosusdcom111
    const signatureProvider = new JsSignatureProvider([defaultPrivateKey])
    const api = new Api({
      rpc,
      signatureProvider,
      textDecoder: new TextDecoder(),
      textEncoder: new TextEncoder()
    })


    // this.setState({ ...this.state, loading: true })
    console.warn(`TX: ${net} ${contract} ${from} `)
    const result = await api.transact(
      {
        actions: [
          {
            account: contract,
            name: "doupdate",
            authorization: [
              {
                actor: from,
                permission: "active"
              }
            ],
            data: {  }
          }
        ]
      },
      {
        blocksBehind: 3,
        expireSeconds: 30
      }
    )
    console.dir(result)
    // HACK: the tx isn't immediately effective
    setTimeout(() => {
      // this.updateAccountBalances()
      // this.setState({ ...this.state, loading: false })
    }, 1000)
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
        ) : <div>Login to see smart contract status</div>}

        <SendTest loading={this.state.loading} transfer={this.transfer} />

        <AdminBox updateOracle={this.updateOracle} doUpdate={this.doUpdate}/>

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
