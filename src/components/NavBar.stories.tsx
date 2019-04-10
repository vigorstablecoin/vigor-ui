import * as React from "react"
import { storiesOf } from "@storybook/react"
import { action } from "@storybook/addon-actions"
import { NavBar } from "./NavBar"

const defaultState = {
  appName: 'App Name',
  activeUser: null,
  onLogin: () => console.log("Login"),
  onLogout: () => console.log("Logout")
}

const withAccount = {
  ...defaultState,
  activeUser: {accountName: "testuser"}
}

storiesOf("NavBar", module)
  .add(
    "without Account",
    () => <NavBar {...defaultState} />,
    {
      info: { inline: true }
    }
  )
  .add(
    "with Account",
    () => (
      <NavBar {
        ...withAccount
      }
      />
    ),
    {
      info: { inline: true }
    }
  )
