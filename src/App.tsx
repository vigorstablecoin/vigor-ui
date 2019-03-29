import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import ScatterJS from 'scatterjs-core';
import ScatterEOS from 'scatterjs-plugin-eosjs';
import Eos from 'eosjs';

import Button from './components/Button'

class App extends Component {
  componentDidMount() {

    ScatterJS.plugins(new ScatterEOS());
    /// EOS mainnet
    // const network = ScatterJS.Network.fromJson({
    //   blockchain: 'eos',
    //   chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906',
    //   host: 'nodes.get-scatter.com',
    //   port: 443,
    //   protocol: 'https'
    // });

    // EOS Localnet testnet
    const network = ScatterJS.Network.fromJson({
      blockchain: 'eos',
      chainId: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f',
      host: '127.0.0.1',
      port: 8888,
      protocol: 'http'
    });

    ScatterJS.connect('YourAppName', { network }).then((connected: any) => {
      if (!connected) { return console.error('no scatter'); }

      const eos = ScatterJS.eos(network, Eos);

      ScatterJS.login().then(async (id: any) => {
        if (!id) { return console.error('no identity'); }
        const account = ScatterJS.account('eos');
        const options = { authorization: [`${account.name}@${account.authority}`] };

        // Custom token transaction, you need testuser already set up and filled with EOSUSD
        const res = await eos.transaction({
          actions: [
            {
              account: "eosusdeosusd",
              name: "transfer",
              authorization: [{
                actor: account.name,
                permission: account.authority
              }
              ],
              data: {
                from: account.name,
                to: "eosio.token",
                quantity: "0.0002 EOSUSD",
                memo: "I'm a memo!"
              }
            }]
        });

        console.log('r :', res);
      });
    });
  }

  render() {

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <p>
            Attaching to Scatter.. <Button>Click me</Button>
          </p>
        </header>
      </div>
    );
  }
}

export default App;
