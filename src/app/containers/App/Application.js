import { SnackbarProvider } from "notistack";
import React, { createContext, useEffect, useRef, useState } from "react";
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
import Locks from "../Pages/Users/DAO/Locks";
import Calc from "../Pages/Users/DAO/Calc";
import GaugeWeightVote from "../Pages/Users/DAO/GaugeWeightVote";
import CreateVote from "../Pages/Users/DAO/CreateVote";
import VoteInfo from "../Pages/Users/DAO/VoteInfo";
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { convertToStr } from "../../components/ConvertToString/ConvertToString";
import { VOTING_ESCROW_CONTRACT_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { makeDeploy } from "../../components/blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../../components/blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../../components/blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { SUPPORTED_NETWORKS, CHAINS } from "../../components/Headers/Header";
import { getDeploy } from "../../components/blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../../components/blockchain/NodeAddress/NodeAddress";
import { VOTING_ESCROW_PACKAGE_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { ERC20_CRV_PACKAGE_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import { createRecipientAddress } from "../../components/blockchain/RecipientAddress/RecipientAddress";
import { makeERC20CRVDeployWasm } from "../../components/blockchain/MakeDeploy/MakeDeployWasm";
import { ERC20_CRV_CONTRACT_HASH } from "../../components/blockchain/AccountHashes/Addresses";
import Axios from 'axios';
import SigningModal from "../../components/Modals/SigningModal";

const AppContext = createContext();

function App() {
  console.log("In app file");
  // const { enqueueSnackbar } = useSnackbar();
  const providerRef = useRef();
  let [torus, setTorus] = useState();
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

  async function createLockMakeDeploy(lockedAmount, unlockTime) {
    if (lockedAmount == 0) {
      let variant = "Error";
      providerRef.current.enqueueSnackbar("Locked amount cannot be Zero", { variant })
      return
    }
    if (unlockTime == undefined) {
      let variant = "Error";
      providerRef.current.enqueueSnackbar("Please select Unlock Time", { variant })
      return
    }
    console.log("unlockTime", unlockTime.getTime());
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          value: CLValueBuilder.u256(convertToStr(lockedAmount)),
          unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "create_lock";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              providerRef.current.enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          providerRef.current.enqueueSnackbar("Funds Locked Successfully", { variant })


        } catch {
          handleCloseSigning();
          let variant = "Error";
          providerRef.current.enqueueSnackbar("Unable to Lock Funds", { variant })
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  async function withdrawMakeDeploy() {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "withdraw";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              providerRef.current.enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          providerRef.current.enqueueSnackbar("Funds Withdrawed Successfully", { variant })
        } catch {
          handleCloseSigning();
          let variant = "Error";
          providerRef.current.enqueueSnackbar("Unable to Withdraw Funds", { variant })
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  async function increaseUnlockTimeMakeDeploy(unlockTime) {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (unlockTime == undefined) {
      let variant = "Error";
      providerRef.current.enqueueSnackbar("Please select Unlock Time", { variant })
      return
    }
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "increase_unlock_time";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              providerRef.current.enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          providerRef.current.enqueueSnackbar("Amount Increased Successfully", { variant })
        } catch {
          handleCloseSigning();
          let variant = "Error";
          providerRef.current.enqueueSnackbar("Unable to Increase Amount", { variant })
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  async function increaseAmountMakeDeploy(lockedAmount) {
    if (lockedAmount == 0) {
      let variant = "Error";
      providerRef.current.enqueueSnackbar("Locked amount cannot be Zero", { variant })
      return
    }
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      // try {
        const runtimeArgs = RuntimeArgs.fromMap({
          value: CLValueBuilder.u256(convertToStr(lockedAmount)),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
        );
        let entryPoint = "increase_amount";
        // Set contract installation deploy (unsigned).
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        // try {
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              providerRef.current.enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          providerRef.current.enqueueSnackbar("Amount Increased Successfully", { variant })
        // } catch {
        //   handleCloseSigning();
        //   let variant = "Error";
        //   providerRef.current.enqueueSnackbar("Unable to Increase Amount", { variant })
        // }
      // } catch {
      //   handleCloseSigning();
      //   let variant = "Error";
      //   providerRef.current.enqueueSnackbar("Something Went Wrong", { variant });
      // }
    } else {
      handleCloseSigning();
      let variant = "error";
      providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  async function increaseAndDecreaseAllowanceMakeDeploy(amount, handleCloseAllowance) {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const spender = VOTING_ESCROW_PACKAGE_HASH;
      const spenderByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(spender, "hex"))
      );
      const erc20CrvPackageHash = new CLByteArray(
        Uint8Array.from(Buffer.from(ERC20_CRV_PACKAGE_HASH, "hex"))
      );
      const paymentAmount = 5000000000;
      const runtimeArgs = RuntimeArgs.fromMap({
        package_hash: CLValueBuilder.key(erc20CrvPackageHash),
        spender: createRecipientAddress(spenderByteArray),
        amount: CLValueBuilder.u256(convertToStr(amount)),
        entrypoint: CLValueBuilder.string("increase_allowance"),
      });

      let deploy = await makeERC20CRVDeployWasm(
        publicKey,
        runtimeArgs,
        paymentAmount
      );
      console.log("make deploy: ", deploy);
      try {
        if (selectedWallet === "Casper") {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, providerRef.current.enqueueSnackbar);
          console.log("result", result);
        } else {
          torus = new Torus();
          console.log("torus", torus);
          await torus.init({
            buildEnv: "testing",
            showTorusButton: true,
            network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
          });
          console.log("Torus123", torus);
          console.log("torus", torus.provider);
          const casperService = new CasperServiceByJsonRPC(torus?.provider);
          const deployRes = await casperService.deploy(deploy);
          console.log("deployRes", deployRes.deploy_hash);
          console.log(
            `... Contract installation deployHash: ${deployRes.deploy_hash}`
          );
          let result = await getDeploy(
            NODE_ADDRESS,
            deployRes.deploy_hash,
            providerRef.current.enqueueSnackbar
          );
          console.log(
            `... Contract installed successfully.`,
            JSON.parse(JSON.stringify(result))
          );
          console.log("result", result);
        }
        handleCloseAllowance();
        handleCloseSigning();
        getAllowance();

        let variant = "success";
        providerRef.current.enqueueSnackbar("Allowance Increased Successfully", { variant })

      } catch {
        handleCloseSigning();
        let variant = "Error";
        providerRef.current.enqueueSnackbar("Unable to Increase Allowance", { variant })
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      providerRef.current.enqueueSnackbar("Connect to Wallet Please", { variant });
    }

  }

  useEffect(() => {
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, [activePublicKey]);

  const getAllowance = () => {
    let allowanceParam = {
      contractHash: ERC20_CRV_CONTRACT_HASH,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: VOTING_ESCROW_PACKAGE_HASH
    }
    console.log('allowanceParam0', allowanceParam);
    Axios
      .get(`/allowanceagainstownerandspender/${ERC20_CRV_CONTRACT_HASH}/${CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13)}/${VOTING_ESCROW_PACKAGE_HASH}`)
      .then((res) => {
        console.log('allowanceagainstownerandspender', res)
        console.log(res.data)
        setAllowance(res.data.allowance)

      })
      .catch((error) => {
        setAllowance(0)
        console.log(error)
        console.log(error.response)
      })
  }

  const LoginRegisterRedirectCheck = ({ path, ...rest }) => {
    if (path === "/") {
      return <Route component={DaoHome} />;
    }
    else if (path === "/home") {
      return <Route component={DaoHome} />;
    }
    // else if (path === "/pools") {
    //   return <Route component={Pools} />;
    // } else if (path === "/factory/create-pool") {
    //   return <Route component={FactoryCreatePool} />;
    // } else if (path === "/factory/create-gauge") {
    //   return <Route component={FactoryCreateGauge} />;
    // } else if (path === "/factory/create-gauge-vote") {
    //   return <Route component={FactoryCreateGaugeVote} />;
    // } else if (path === "/pool/buy-and-sell/:itemId") {
    //   return <Route component={BuyAndSell} />;
    // } else if (path === "/use-crv") {
    //   return <Route component={UseCrv} />;
    // } else if (path === "/risks") {
    //   return <Route component={Risks} />;
    // } else if (path === "/trade") {
    //   return <Route component={Trade} />;
    // } 
    else if (path === "/dao-home") {
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
    } else if (path === "/createVote") {
      return <Route component={CreateVote} />;
    } else if (path === "/locks") {
      return <Route component={Locks} />;
    } else if (path === "/voteInfo/:id") {
      return <Route component={VoteInfo} path="/voteInfo/:id" />;
    } else {
      return <Route component={HomeScreen} />;
    }
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
            <Switch>
              <LoginRegisterRedirectCheck exact path="/" />
              {/* <LoginRegisterRedirectCheck exact path="/pools" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/factory/create-pool" />
              <LoginRegisterRedirectCheck exact path="/factory/create-gauge" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/factory/create-gauge-vote" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/pool/buy-and-sell/:itemId" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/use-crv" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/risks" /> */}
              {/* <LoginRegisterRedirectCheck exact path="/trade" /> */}
              <LoginRegisterRedirectCheck exact path="/dao-home" />
              <LoginRegisterRedirectCheck exact path="/dao" />
              <LoginRegisterRedirectCheck exact path="/minter" />
              <LoginRegisterRedirectCheck exact path="/vesting" />
              <LoginRegisterRedirectCheck exact path="/locker" />
              <LoginRegisterRedirectCheck exact path="/locks" />
              <LoginRegisterRedirectCheck exact path="/calc" />
              <LoginRegisterRedirectCheck exact path="/gw-vote" />
              <LoginRegisterRedirectCheck exact path="/createVote" />
              <LoginRegisterRedirectCheck exact path="/voteInfo/:id" />
              {/* <Route exact path="/voteInfo/:id" component={VoteInfo} /> */}
            </Switch>
          </BrowserRouter>
        </AppContext.Provider>
      </SnackbarProvider>

      //CALLING SIGNING MODAL
      <SigningModal show={openSigning} />
    </div>

  );
}

export default App;
export { AppContext };
