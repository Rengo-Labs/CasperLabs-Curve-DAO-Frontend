import { SnackbarProvider } from "notistack";
import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HomeScreen from "../Pages/Users/HomeScreen";
import Pools from "../Pages/Users/Pools";
import FactoryCreatePool from "../Pages/Users/FactoryCreatePool";
import FactoryCreateGauge from "../Pages/Users/FactoryCreateGauge";
import FactoryCreateGaugeVote from "../Pages/Users/FactoryCreateGaugeVote";
import BuyAndSell from "../Pages/Users/Pools/BuyAndSell";
import UseCrv from "../Pages/Users/UseCrv";
import Risks from "../Pages/Users/Risks";
import Trade from "../Pages/Users/Trade";
import DaoHome from "../Pages/Users/DAO/DaoHome";
import Dao from "../Pages/Users/DAO/Dao";
import Minter from "../Pages/Users/DAO/Minter";
import Vesting from "../Pages/Users/DAO/Vesting";
import Locker from "../Pages/Users/DAO/Locker";
import Calc from "../Pages/Users/DAO/Calc";
import GaugeWeightVote from "../Pages/Users/DAO/GaugeWeightVote";

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
    } else if (path === "/use-crv") {
      return <Route component={UseCrv} />;
    } else if (path === "/risks") {
      return <Route component={Risks} />;
    } else if (path === "/trade") {
      return <Route component={Trade} />;
    } else if (path === "/dao-home") {
      return <Route component={DaoHome} />;
    } else if (path === "/dao") {
      return <Route component={Dao} />;
    } else if (path === "/minter") {
      return <Route component={Minter} />;
    } else if (path === "/vesting") {
      return <Route component={Vesting} />;
    } else if (path === "/locker") {
      return <Route component={Locker} />;
    } else if (path === "/calc") {
      return <Route component={Calc} />;
    } else if (path === "/gw-vote") {
      return <Route component={GaugeWeightVote} />;
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
          <LoginRegisterRedirectCheck exact path="/use-crv" />
          <LoginRegisterRedirectCheck exact path="/risks" />
          <LoginRegisterRedirectCheck exact path="/trade" />
          <LoginRegisterRedirectCheck exact path="/dao-home" />
          <LoginRegisterRedirectCheck exact path="/dao" />
          <LoginRegisterRedirectCheck exact path="/minter" />
          <LoginRegisterRedirectCheck exact path="/vesting" />
          <LoginRegisterRedirectCheck exact path="/locker" />
          <LoginRegisterRedirectCheck exact path="/calc" />
          <LoginRegisterRedirectCheck exact path="/gw-vote" />
        </Switch>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
