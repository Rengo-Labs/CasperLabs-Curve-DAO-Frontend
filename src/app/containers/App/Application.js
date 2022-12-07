import { SnackbarProvider } from "notistack";
import React, { createContext, useRef, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createLockMakeDeploy } from "../../components/MakeDeployFunctions/CreateLockMakeDeploy";
import { increaseAmountMakeDeploy } from "../../components/MakeDeployFunctions/IncreaseAmountMakeDeploy";
import { increaseAndDecreaseAllowanceMakeDeploy } from "../../components/MakeDeployFunctions/IncreaseAndDecreaseAllowanceMakeDeploy";
import { increaseUnlockTimeMakeDeploy } from "../../components/MakeDeployFunctions/IncreaseUnlockTimeMakeDeploy";
import { withdrawMakeDeploy } from "../../components/MakeDeployFunctions/WithdrawMakeDeploy";
import SigningModal from "../../components/Modals/SigningModal";
import Calc from "../Pages/Users/DAO/Calc";
import CreateVote from "../Pages/Users/DAO/CreateVote";
import Dao from "../Pages/Users/DAO/Dao";
import DaoHome from "../Pages/Users/DAO/DaoHome";
import GaugeWeightVote from "../Pages/Users/DAO/GaugeWeightVote";
import Locker from "../Pages/Users/DAO/Locker";
import Locks from "../Pages/Users/DAO/Locks";
import Minter from "../Pages/Users/DAO/Minter";
import Vesting from "../Pages/Users/DAO/Vesting";
import VoteInfo from "../Pages/Users/DAO/VoteInfo";
import HomeScreen from "../Pages/Users/HomeScreen";

const AppContext = createContext();

function App() {
  // const { enqueueSnackbar } = useSnackbar();
  const providerRef = useRef();
  const [allowance, setAllowance] = useState(0);

  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );

  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };


  return (
    <div>
      <SnackbarProvider ref={providerRef} maxSnack={3}>
        <AppContext.Provider
          value={{
            allowance,
            createLockMakeDeploy,
            withdrawMakeDeploy,
            increaseUnlockTimeMakeDeploy,
            increaseAndDecreaseAllowanceMakeDeploy,
            increaseAmountMakeDeploy
          }}
        >
          <BrowserRouter>
            <Routes>
              <Route exact path="/" element={<DaoHome />} />
              {/* <Route exact path="/pools" /> */}
              {/* <Route exact path="/factory/create-pool" />
              <Route exact path="/factory/create-gauge" /> */}
              {/* <Route exact path="/factory/create-gauge-vote" /> */}
              {/* <Route exact path="/pool/buy-and-sell/:itemId" /> */}
              {/* <Route exact path="/use-crv" /> */}
              {/* <Route exact path="/risks" /> */}
              {/* <Route exact path="/trade" /> */}
              <Route exact path="/dao-home" element={<DaoHome />} />
              <Route exact path="/dao" element={<Dao />} />
              <Route exact path="/minter" element={<Minter />} />
              <Route exact path="/vesting" element={<Vesting />} />
              <Route exact path="/locker" element={<Locker />} />
              <Route exact path="/locks" element={<Locks />} />
              <Route exact path="/calc" element={<Calc />} />
              <Route exact path="/gw-vote" element={<GaugeWeightVote />} />
              <Route exact path="/createVote" element={<CreateVote />} />
              <Route exact path="/voteInfo/:id" element={<VoteInfo />} />
            </Routes>
          </BrowserRouter>
        </AppContext.Provider>
      </SnackbarProvider>

      <SigningModal show={openSigning} />
    </div>

  );
}

export default App;
export { AppContext };
