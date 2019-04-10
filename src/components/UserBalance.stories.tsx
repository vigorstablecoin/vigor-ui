import * as React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { UserBalance } from "./UserBalance"

const defaultState = {
  activeUser: null,
}

const withAccount = {
  ...defaultState,
  activeUser: {accountName: "testuser"}
}

const withTokens = {
  ...withAccount,
  activeUser: {
    balance: {
      EOS: 123456789.00000,
      IQ: 0.00001,
      XXX: 0.00000
    }
  }
}
storiesOf("UserBalance", module)
  .add(
    "without account",
    () => <UserBalance {...defaultState} />,
    {
      info: { inline: true }
    }
  )
  .add(
    "with account",
    () => (
      <UserBalance {
        ...withAccount
      }
      />
    ),
    {
      info: { inline: true }
    }
  )
  .add(
    "with account and tokens",
    () => (
      <UserBalance {
        ...withTokens
      }
      />
    ),
    {
      info: { inline: true }
    }
  )