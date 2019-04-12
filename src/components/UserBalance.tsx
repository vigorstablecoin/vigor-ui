import * as React from "react"

import "@blueprintjs/core/lib/css/blueprint.css"

import { Button, Card, Elevation } from "@blueprintjs/core"
import { supportedTokens } from "../lib/config"

function UserBalance({ activeUser }) {
  return (
    <Card interactive={true} elevation={Elevation.TWO}>
      <h5>User tokens</h5>
      <table className="bp3-html-table bp3-html-table-condensed">
        <tbody>
          {activeUser === null ? (
            <>
              {supportedTokens.map(token => (
                <tr key={token}>
                  <td>--</td>
                  <td>{token.split("-")[1]}</td>
                </tr>
              ))}
            </>
          ) : null}

          {activeUser && !activeUser.balance ? (
            <>
              {supportedTokens.map(token => (
                <tr key={token}>
                  <td>...</td>
                  <td>{token.split("-")[1]}</td>
                </tr>
              ))}
            </>
          ) : null}

          {activeUser && activeUser.balance ? (
            <>
              {Object.keys(activeUser.balance)
                .sort()
                .map(token => (
                  <tr key={token}>
                    <td style={{ float: "right" }}>
                      {activeUser.balance[token]}
                    </td>
                    <td>{token}</td>
                  </tr>
                ))}
            </>
          ) : null}
        </tbody>
      </table>
    </Card>
  )
}

export { UserBalance }
