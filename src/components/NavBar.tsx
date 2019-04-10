import * as React from "react"
import {
  Alignment,
  Button,
  Classes,
  Navbar,
  NavbarDivider,
  NavbarGroup,
  NavbarHeading,
} from "@blueprintjs/core"

import "@blueprintjs/core/lib/css/blueprint.css"

function NavBar({ appName, activeUser, onLogin, onLogout }) {
  return (
    <Navbar>
      <NavbarGroup align={Alignment.LEFT}>
        <NavbarHeading>{appName || "appName"}</NavbarHeading>
        <NavbarDivider />
      </NavbarGroup>
      <NavbarGroup align={Alignment.RIGHT}>
        {activeUser !== null ? (
          <>
            <span>{activeUser && activeUser.accountName}</span>
            <Button
              className={Classes.MINIMAL}
              icon="log-out"
              onClick={onLogout}
            />
          </>
        ) : (
          <Button
            className={Classes.MINIMAL}
            icon="log-in"
            text="Login"
            onClick={onLogin}
          />
        )}
      </NavbarGroup>
    </Navbar>
  )
}

export { NavBar }
