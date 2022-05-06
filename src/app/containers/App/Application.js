import { SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pools from "../Pages/Users/Pools";
import FactoryCreatePool from "../Pages/Users/FactoryCreatePool";
import FactoryCreateGauge from "../Pages/Users/FactoryCreateGauge";
import FactoryCreateGaugeVote from "../Pages/Users/FactoryCreateGaugeVote";
import BuyAndSell from "../Pages/Users/Pools/BuyAndSell";
import Deposit from "../Pages/Users/Deposit";
import Withdraw from "../Pages/Users/Withdraw";
import UseCrv from "../Pages/Users/UseCrv";
import Risks from "../Pages/Users/Risks";

function App() {
  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/home") {
      return <Route component={HomeScreen} />;
    } else if (path === "/pools") {
      return <Route component={Pools} />;
    } else if (path === "/factory/create-pool") {
      return <Route component={FactoryCreatePool} />;
    } else if (path === "/factory/create-gauge") {
      return <Route component={FactoryCreateGauge} />;
    } else if (path === "/factory/create-gauge-vote") {
      return <Route component={FactoryCreateGaugeVote} />;
    } else if (path === "/pool/buy-and-sell/:itemId") {
      return <Route component={BuyAndSell} />;
    } else if (path === "/deposit") {
      return <Route component={Deposit} />;
    } else if (path === "/withdraw") {
      return <Route component={Withdraw} />;
    } else if (path === "/use-crv") {
      return <Route component={UseCrv} />;
    } else if (path === "/risks") {
      return <Route component={Risks} />;
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
          <LoginRegisterRedirectCheck exact path="/factory/create-pool" />
          <LoginRegisterRedirectCheck exact path="/factory/create-gauge" />
          <LoginRegisterRedirectCheck exact path="/factory/create-gauge-vote" />
          <LoginRegisterRedirectCheck exact path="/pool/buy-and-sell/:itemId" />
          <LoginRegisterRedirectCheck exact path="/deposit" />
          <LoginRegisterRedirectCheck exact path="/withdraw" />
          <LoginRegisterRedirectCheck exact path="/use-crv" />
          <LoginRegisterRedirectCheck exact path="/risks" />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
