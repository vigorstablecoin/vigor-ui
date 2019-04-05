// import { Ledger } from 'ual-ledger'
// import { Lynx } from 'ual-lynx'
import { Scatter } from 'ual-scatter'
import { UALProvider, withUAL } from 'ual-reactjs-renderer'

import { JsonRpc } from 'eosjs'
import * as React from 'react'
import ReactDOM from 'react-dom'

// ts:ignore
const EXAMPLE_ENV = {
  CHAIN_ID: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
  RPC_PROTOCOL: 'https',
  RPC_HOST: 'nodes.get-scatter.com',
  RPC_PORT: '443',
}

// const EXAMPLE_ENV = {
//   CHAIN_ID: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
//   RPC_PROTOCOL: 'http',
//   RPC_HOST: '127.0.0.1',
//   RPC_PORT: '8888',
// }


const demoTransaction = {
  actions: [{
    account: 'eosio.token',
    name: 'transfer',
    authorization: [{
      actor: '', // use account that was logged in
      permission: 'active',
    }],
    data: {
      from: '', // use account that was logged in
      to: 'example',
      quantity: '1.0000 EOS',
      memo: 'UAL rocks!',
    },
  }],
}

interface ExampleEnv {
  CHAIN_ID: string,
  RPC_PROTOCOL: string,
  RPC_HOST: string,
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

// declare var EXAMPLE_ENV: ExampleEnv

const exampleNet = {
  chainId: EXAMPLE_ENV.CHAIN_ID,
  rpcEndpoints: [{
    protocol: EXAMPLE_ENV.RPC_PROTOCOL,
    host: EXAMPLE_ENV.RPC_HOST,
    port: Number(EXAMPLE_ENV.RPC_PORT),
  }]
}

const defaultState = {
  activeUser: null,
  accountName: '',
  accountBalance: null,
}

class TransactionApp extends React.Component<TransactionProps, TransactionState> {
  static displayName = 'TransactionApp'

  constructor(props: TransactionProps) {
    super(props)
    this.state = {
      ...defaultState,
      rpc: new JsonRpc(`${EXAMPLE_ENV.RPC_PROTOCOL}://${EXAMPLE_ENV.RPC_HOST}:${EXAMPLE_ENV.RPC_PORT}`)
    }
    this.updateAccountBalance = this.updateAccountBalance.bind(this)
    this.updateAccountName = this.updateAccountName.bind(this)
    this.renderTransferButton = this.renderTransferButton.bind(this)
    this.transfer = this.transfer.bind(this)
    this.renderModalButton = this.renderModalButton.bind(this)
  }

  public componentDidUpdate() {
    const { ual: { activeUser } } = this.props
    if (activeUser && !this.state.activeUser) {
      this.setState({ activeUser }, this.updateAccountName)
    } else if (!activeUser && this.state.activeUser) {
      this.setState(defaultState)
    }
  }

  public async updateAccountName(): Promise<void> {
    try {
      const accountName = await this.state.activeUser.getAccountName()
      this.setState({ accountName }, this.updateAccountBalance)
    } catch (e) {
      console.warn(e)
    }
  }

  public async updateAccountBalance(): Promise<void> {
    try {
      const account = await this.state.rpc.get_account(this.state.accountName)
      const accountBalance = account.core_liquid_balance

      // const accountEosusd = await this.state.rpc.get_currency_balance('eosio.token', 'testuser', 'EOS')
      const accountEosusd = await this.state.rpc.get_currency_balance('eosusdeosusd', 'testuser', 'EOSUSD')

      console.log('ee ', accountEosusd)
      this.setState({ accountBalance })
    } catch (e) {
      console.warn(e)
    }
  }

  public async transfer() {
    const { accountName, activeUser } = this.state
    demoTransaction.actions[0].authorization[0].actor = accountName
    demoTransaction.actions[0].data.from = accountName
    try {
      await activeUser.signTransaction(demoTransaction, { broadcast: true })
      this.updateAccountBalance()
    } catch (error) {
      console.warn(error)
    }
  }

  public renderModalButton() {
    return (
      <p className='ual-btn-wrapper'>
        <span
          role='button'
          onClick={this.props.ual.showModal}
          className='ual-generic-button'>Show UAL Modal</span>
      </p>
    )
  }

  public renderTransferButton() {
    return (
      <p className='ual-btn-wrapper'>
        <span className='ual-generic-button blue' onClick={this.transfer}>
          {'Transfer 1 eos to example'}
        </span>
      </p>
    )
  }

  public renderLogoutBtn = () => {
    const { ual: { activeUser, activeAuthenticator, logout } } = this.props
    if (!!activeUser && !!activeAuthenticator) {
      return (
        <p className='ual-btn-wrapper'>
          <span className='ual-generic-button red' onClick={logout}>
            {'Logout'}
          </span>
        </p>
      )
    }
  }

  public render() {
    const { ual: { activeUser } } = this.props
    const { accountBalance, accountName } = this.state
    const modalButton = !activeUser && this.renderModalButton()
    const loggedIn = accountName ? `Logged in as ${accountName}` : ''
    const myBalance = accountBalance ? `Balance: ${accountBalance}` : ''
    const transferBtn = accountBalance && this.renderTransferButton()
    return (
      <div style={{ textAlign: 'center' }}>
        {modalButton}
        <h3 className='ual-subtitle'>{loggedIn}</h3>
        <h4 className='ual-subtitle'>{myBalance}</h4>
        {transferBtn}
        {this.renderLogoutBtn()}
      </div>
    )
  }
}

const TestAppConsumer = withUAL(TransactionApp)

TestAppConsumer.displayName = 'TestAppConsumer'

const appName = 'My App'
// const lynx = new Lynx([exampleNet])
// const ledger = new Ledger([exampleNet])
const scatter = new Scatter([exampleNet], { appName })

ReactDOM.render(
  <UALProvider chains={[exampleNet]} authenticators={[scatter]} appName={'My App'}>
    <TestAppConsumer />
  </UALProvider>,
  document.getElementById('root') as HTMLElement,
)