// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import DaoInfoMessage from "../../../../components/DAO/DaoInfoMessage";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
// CASPER SDK
import Torus from "@toruslabs/casper-embed";
import { getDeploy } from '../../../../components/blockchain/GetDeploy/GetDeploy';
import { makeDeploy } from '../../../../components/blockchain/MakeDeploy/MakeDeploy';
import { NODE_ADDRESS } from '../../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../../components/blockchain/SignDeploy/SignDeploy';
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { ERC20_CRV_CONTRACT_HASH, ERC20_CRV_PACKAGE_HASH, VOTING_ESCROW_CONTRACT_HASH, VOTING_ESCROW_PACKAGE_HASH } from '../../../../components/blockchain/AccountHashes/Addresses';
import { convertToStr } from '../../../../components/ConvertToString/ConvertToString';
import SigningModal from "../../../../components/Modals/SigningModal";
import Axios from "axios";
import { makeERC20CRVDeployWasm } from "../../../../components/blockchain/MakeDeploy/MakeDeployWasm";
import PoolInfo from "../../../../components/Stats/PoolInfo";
// CONTENT

// COMPONENT FUNCTION
const Minter = () => {
  // States
  const { enqueueSnackbar } = useSnackbar();
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  let gauges = [
    {
      name: "compound",
      hash: "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9"
    },
    {
      name: "usdt",
      hash: "d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef"
    },
    {
      name: "y",
      hash: "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
    },
    {
      name: "busd",
      hash: "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0"
    },
    {
      name: "pax",
      hash: "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0"
    },
    {
      name: "ren",
      hash: "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
    },
    {
      name: "susdv2",
      hash: "adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c"
    },
    {
      name: "sbtc",
      hash: "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
    },
  ]

  // let gaugesNames = {
  //   "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9": 'compound',
  //   "d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef": 'usdt',
  //   "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a": 'y',
  //   "3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735": 'busd',
  //   "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0": 'pax',
  //   "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38": 'ren',
  //   "adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c": 'susdv2',
  //   "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38": 'sbtc',
  // }

  // Handlers
  // async function createLockMakeDeploy(lockedAmount, unlockTime) {
  //   if (lockedAmount == 0) {
  //     let variant = "Error";
  //     enqueueSnackbar("Locked amount cannot be Zero", { variant })
  //     return
  //   }
  //   if (unlockTime == undefined) {
  //     let variant = "Error";
  //     enqueueSnackbar("Please select Unlock Time", { variant })
  //     return
  //   }
  //   console.log("unlockTime", unlockTime.getTime());
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //         value: CLValueBuilder.u256(convertToStr(lockedAmount)),
  //         unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "create_lock";
  //       // Set contract installation deploy (unsigned).
  //       let deploy = await makeDeploy(
  //         publicKey,
  //         contractHashAsByteArray,
  //         entryPoint,
  //         runtimeArgs,
  //         paymentAmount
  //       );
  //       console.log("make deploy: ", deploy);
  //       try {
  //         if (selectedWallet === "Casper") {
  //           let signedDeploy = await signdeploywithcaspersigner(
  //             deploy,
  //             publicKeyHex
  //           );
  //           let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //           console.log("result", result);
  //         } else {
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Funds Locked Successfully", { variant })


  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Lock Funds", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function withdrawMakeDeploy() {
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "withdraw";
  //       // Set contract installation deploy (unsigned).
  //       let deploy = await makeDeploy(
  //         publicKey,
  //         contractHashAsByteArray,
  //         entryPoint,
  //         runtimeArgs,
  //         paymentAmount
  //       );
  //       console.log("make deploy: ", deploy);
  //       try {
  //         if (selectedWallet === "Casper") {
  //           let signedDeploy = await signdeploywithcaspersigner(
  //             deploy,
  //             publicKeyHex
  //           );
  //           let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //           console.log("result", result);
  //         } else {
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Funds Withdrawed Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Withdraw Funds", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }

  // async function increaseUnlockTimeMakeDeploy(unlockTime) {
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (unlockTime == undefined) {
  //     let variant = "Error";
  //     enqueueSnackbar("Please select Unlock Time", { variant })
  //     return
  //   }
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //         unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "increase_unlock_time";
  //       // Set contract installation deploy (unsigned).
  //       let deploy = await makeDeploy(
  //         publicKey,
  //         contractHashAsByteArray,
  //         entryPoint,
  //         runtimeArgs,
  //         paymentAmount
  //       );
  //       console.log("make deploy: ", deploy);
  //       try {
  //         if (selectedWallet === "Casper") {
  //           let signedDeploy = await signdeploywithcaspersigner(
  //             deploy,
  //             publicKeyHex
  //           );
  //           let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //           console.log("result", result);
  //         } else {
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Amount Increased Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Increase Amount", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function increaseAmountMakeDeploy(lockedAmount) {
  //   if (lockedAmount == 0) {
  //     let variant = "Error";
  //     enqueueSnackbar("Locked amount cannot be Zero", { variant })
  //     return
  //   }
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //         value: CLValueBuilder.u256(convertToStr(lockedAmount)),
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "increase_amount";
  //       // Set contract installation deploy (unsigned).
  //       let deploy = await makeDeploy(
  //         publicKey,
  //         contractHashAsByteArray,
  //         entryPoint,
  //         runtimeArgs,
  //         paymentAmount
  //       );
  //       console.log("make deploy: ", deploy);
  //       try {
  //         if (selectedWallet === "Casper") {
  //           let signedDeploy = await signdeploywithcaspersigner(
  //             deploy,
  //             publicKeyHex
  //           );
  //           let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //           console.log("result", result);
  //         } else {
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Amount Increased Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Increase Amount", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function increaseAndDecreaseAllowanceMakeDeploy(amount, handleCloseAllowance) {
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const spender = VOTING_ESCROW_PACKAGE_HASH;
  //     const spenderByteArray = new CLByteArray(
  //       Uint8Array.from(Buffer.from(spender, "hex"))
  //     );
  //     const erc20CrvPackageHash = new CLByteArray(
  //       Uint8Array.from(Buffer.from(ERC20_CRV_PACKAGE_HASH, "hex"))
  //     );
  //     const paymentAmount = 5000000000;
  //     const runtimeArgs = RuntimeArgs.fromMap({
  //       package_hash: CLValueBuilder.key(erc20CrvPackageHash),
  //       spender: createRecipientAddress(spenderByteArray),
  //       amount: CLValueBuilder.u256(convertToStr(amount)),
  //       entrypoint: CLValueBuilder.string("increase_allowance"),
  //     });

  //     let deploy = await makeERC20CRVDeployWasm(
  //       publicKey,
  //       runtimeArgs,
  //       paymentAmount
  //     );
  //     console.log("make deploy: ", deploy);
  //     try {
  //       if (selectedWallet === "Casper") {
  //         let signedDeploy = await signdeploywithcaspersigner(
  //           deploy,
  //           publicKeyHex
  //         );
  //         let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //         console.log("result", result);
  //       } else {
  //         torus = new Torus();
  //         console.log("torus", torus);
  //         await torus.init({
  //           buildEnv: "testing",
  //           showTorusButton: true,
  //           network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //         });
  //         console.log("Torus123", torus);
  //         console.log("torus", torus.provider);
  //         const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //         const deployRes = await casperService.deploy(deploy);
  //         console.log("deployRes", deployRes.deploy_hash);
  //         console.log(
  //           `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //         );
  //         let result = await getDeploy(
  //           NODE_ADDRESS,
  //           deployRes.deploy_hash,
  //           enqueueSnackbar
  //         );
  //         console.log(
  //           `... Contract installed successfully.`,
  //           JSON.parse(JSON.stringify(result))
  //         );
  //         console.log("result", result);
  //       }
  //       handleCloseAllowance();
  //       handleCloseSigning();
  //       getAllowance();

  //       let variant = "success";
  //       enqueueSnackbar("Allowance Increased Successfully", { variant })

  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Unable to Increase Allowance", { variant })
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }

  // }
  useEffect(() => {
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, [activePublicKey])


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

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Minter"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        {/* Main Content */}
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      {/* Donut */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            <div className="row no-gutters justify-content-center">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                >
                                  Gauge Relative Weight
                                </Typography>
                              </div>
                              <GaugeRelativeWeight />
                            </div>
                          </div>
                        </Paper>
                      </Box>
                      {/* Voting Power */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                        className="mt-4"
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Heading */}
                            <div className="col-12">
                              <Typography
                                variant="h5"
                                gutterBottom
                                component="div"
                                fontWeight={900}
                              >
                                Voting Power in DAO
                              </Typography>
                            </div>
                            {/* Voting Power Stats */}
                            <div className="col-12">
                              <VotingPowerDAO />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            {/* Voting Power Actionables */}
                            <div className="col-12 mt-4">
                              {/* <VotingPowerActionables createLockMakeDeploy={createLockMakeDeploy} withdrawMakeDeploy={withdrawMakeDeploy} increaseUnlockTimeMakeDeploy={increaseUnlockTimeMakeDeploy} increaseAmountMakeDeploy={increaseAmountMakeDeploy} allowance={allowance} userLockedCRVBalance={userLockedCRVBalance} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} /> */}
                              <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            {/* Info Message */}
                            <div className="col-12 mt-4">
                              <DaoInfoMessage />
                            </div>
                          </div>
                        </Paper>
                      </Box>
                      {/* GAUGE */}
                      {gauges.map((gauge) => (
                        <Box
                          sx={{
                            width: "100%",
                          }}
                          className="mt-4"
                        >
                          <Paper elevation={4}>
                            <div className="py-5 px-4">
                              {/* Heading */}
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  {gauge.name}
                                  {/* CRV APY: "Some value" */}
                                </Typography>
                              </div>
                              {/* Pool Info */}
                              <div className="col-12">
                                <PoolInfo />
                                <div className="w-100 my-3">
                                  <Divider />
                                </div>
                              </div>                            
                            </div>
                          </Paper>
                        </Box>
                      ))}                      
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        {/* <SigningModal show={openSigning} /> */}
      </div>
    </>
  );
};

export default Minter;
