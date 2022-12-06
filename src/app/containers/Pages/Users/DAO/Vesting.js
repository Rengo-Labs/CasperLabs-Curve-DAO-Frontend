// REACT
import React, { useEffect, useState } from "react";
// CHARTS
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import VestingTokens from "../../../../components/Charts/VestingTokens";
import TextInput from "../../../../components/FormsUI/TextInput";
import GasPriorityFee from "../../../../components/Gas/GasPriorityFee";
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import { Button } from "@material-ui/core";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// FORMIK AND YUP
import Torus from "@toruslabs/casper-embed";
import { CasperServiceByJsonRPC, CLByteArray, CLKey, CLOption, CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import { None, Some } from "ts-results";
import * as Yup from "yup";
import { VESTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/AccountHashes/Addresses";
import { getDeploy } from "../../../../components/blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import SigningModal from "../../../../components/Modals/SigningModal";

// CONTENT

// COMPONENT FUNCTION
const Vesting = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [vestingAddress, setVestingAddress] = useState(
    // "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
    localStorage.getItem("Address")
  );
  const [initialLock, setInitialLock] = useState("0.00");
  const [startLockTime, setStartLockTime] = useState("13/08/2021 22:17:28");
  const [endLockTime, setEndLockTime] = useState("13/08/2022 22:17:28");
  const [claimedTokens, setClaimedTokens] = useState("0.00");
  const [claimAvailTokens, setClaimAvailTokens] = useState("0.00");
  const [availableTokens, setAvailableTokens] = useState("0.00");
  const [lockedTokens, setLockedTokens] = useState("0.00");
  const { enqueueSnackbar } = useSnackbar();
  // States
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  // Content
  const initialValues = {
    CheckVestingAddress: "",
  };
  const validationSchema = Yup.object().shape({
    CheckVestingAddress: Yup.number().required("Required"),
  });

  // Handlers
  const onSubmitVestingAddress = (values, props) => {
    console.log("Vesting Address Checking", values);
  };

  // async function claimMakeDeploy(gauge) {

  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     const addrByteArray = gauge ? new CLByteArray(
  //       Uint8Array.from(Buffer.from(gauge, "hex"))
  //     ) : "";
  //     try {
  //     const runtimeArgs = addrByteArray != "" ? RuntimeArgs.fromMap({
  //       addr: new CLOption(Some(new CLKey(addrByteArray))),
  //     }) : new CLOption(None);
  //     let contractHashAsByteArray = Uint8Array.from(
  //       Buffer.from(VESTING_ESCROW_CONTRACT_HASH, "hex")
  //     );
  //     let entryPoint = "claim";
  //     // Set contract installation deploy (unsigned).
  //     let deploy = await makeDeploy(
  //       publicKey,
  //       contractHashAsByteArray,
  //       entryPoint,
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
  //         // let Torus = new Torus();
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
  //       handleCloseSigning();
  //       let variant = "success";
  //       enqueueSnackbar("Claimed Successfully", { variant })


  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Unable to Claim", { variant })
  //     }
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

  async function claimMakeDeploy () {
    handleShowSigning();
    const publicKeyHex = localStorage.getItem("Address");
    // const publicKeyHex = activePublicKey;
    console.log("Public key: ", publicKeyHex);
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      try {
        console.log("In try block");
        // const runtimeArgs = RuntimeArgs.fromMap({
        //   value: CLValueBuilder.u256(convertToStr(lockedAmount)),
        //   unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
        // });
        const runtimeArgs = RuntimeArgs.fromMap({
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(VESTING_ESCROW_CONTRACT_HASH, "hex")
        );
        console.log("contract hash byte array: ", contractHashAsByteArray);
        let entryPoint = "claim";
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
          console.log("In other try block");
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
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
              enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Funds Claimed Successfully", { variant })


        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Claim Funds", { variant })
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  useEffect(() => {
    setVestingAddress(localStorage.getItem("Address"));
  }, [localStorage.getItem("Address")]);

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Vesting"}
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
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Main Heading */}
                            <div className="row no-gutters justify-content-center">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Vesting
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Address */}
                            <Formik
                              initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmitVestingAddress}
                            >
                              <Form>
                                <div className="row no-gutters justify-content-center align-items-center">
                                  <div className="col-12 col-lg-10 w-100">
                                    <TextInput
                                      id="vesting-address"
                                      label="Address"
                                      variant="filled"
                                      name="CheckVestingAddress"
                                      sx={{ width: "100%" }}
                                      onChange={(e) => {
                                        setVestingAddress(e.target.value);
                                      }}
                                      value={vestingAddress}
                                    />
                                  </div>
                                  <div className="col-12 col-lg-2 text-center mt-3 mt-lg-0">
                                    <div className="btnWrapper">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{ backgroundColor: "#5300e8", color: "white" }}
                                        onClick={() => { }}
                                      >
                                        Check
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </Formik>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
                            </div>
                            {/* Lock Stats */}
                            <div className="row no-gutters pb-3 pb-xl-2">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Initial Locked:&nbsp;
                                      </span>
                                      {initialLock}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Start Lock Time:&nbsp;
                                      </span>
                                      {startLockTime}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        End Lock Time:&nbsp;
                                      </span>
                                      {endLockTime}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            {/* Token Stats */}
                            <div className="row no-gutters pb-3 pb-xl-2">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Claimed Tokens:&nbsp;
                                      </span>
                                      {claimedTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Claimed + Available Tokens:&nbsp;
                                      </span>
                                      {claimAvailTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Available Tokens:&nbsp;
                                      </span>
                                      {availableTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Locked Tokens:&nbsp;
                                      </span>
                                      {lockedTokens}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Chart */}
                            <div className="row no-gutters w-100">
                              <div className="col-12 text-center pt-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Vested and Unvested Tokens
                                  </span>
                                </Typography>
                              </div>
                              <VestingTokens />
                            </div>
                            {/* Gas Fee */}
                            {/* <div className="row no-gutters w-100">
                              <div className="col-12">
                                <GasPriorityFee />
                              </div>
                            </div> */}

                            <div className="row no-gutters justify-content-center">
                              {/* <div className="col-12"> */}
                              <Button
                                variant="contained"
                                size="large"
                                style={{ backgroundColor: "#5300e8", color: "white" }}
                                onClick={() => { claimMakeDeploy() }}
                                // onClick={() => { claimMakeDeploy(vestingAddress) }}
                              >
                                Claim
                              </Button>
                              {/* </div> */}
                            </div>

                          </div>
                        </Paper>
                      </Box>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <SigningModal show={openSigning} />
      </div>
    </>
  );
};

export default Vesting;
