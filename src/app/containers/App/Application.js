import { SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pools from "../Pages/Users/Pools";
import Factory from "../Pages/Users/Factory";

function App() {
  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/home") {
      return <Route component={HomeScreen} />;
    } else if (path === "/pools") {
      return <Route component={Pools} />;
    } else if (path === "/factory") {
      return <Route component={Factory} />;
    } else {
      return <Route component={HomeScreen} />;
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
      <BrowserRouter>
        <Switch>
          <LoginRegisterRedirectCheck exact path="/" />
          <LoginRegisterRedirectCheck exact path="/pools" />
          <LoginRegisterRedirectCheck exact path="/factory" />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
