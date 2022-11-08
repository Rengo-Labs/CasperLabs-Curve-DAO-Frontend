// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import Torus from "@toruslabs/casper-embed";
import { getDeploy } from '../../../../components/blockchain/GetDeploy/GetDeploy';
import { makeDeploy } from '../../../../components/blockchain/MakeDeploy/MakeDeploy';
import { NODE_ADDRESS } from '../../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../../components/blockchain/SignDeploy/SignDeploy';
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import { convertToStr } from '../../../../components/ConvertToString/ConvertToString';
import DaoInfoMessage from "../../../../components/DAO/DaoInfoMessage";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH, VOTING_ESCROW_PACKAGE_HASH } from '../../../../components/blockchain/AccountHashes/Addresses';
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import SigningModal from "../../../../components/Modals/SigningModal";
import Axios from "axios";

// CONTENT

// COMPONENT FUNCTION
const DaoHome = () => {
  const { enqueueSnackbar } = useSnackbar();
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [allowance, setAllowance] = useState(0);

  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  // Handlers

  async function createLockMakeDeploy(lockedAmount, unlockTime) {
    if (lockedAmount == 0) {
      let variant = "Error";
      enqueueSnackbar("Locked amount cannot be Zero", { variant })
      return
    }
    if (unlockTime == undefined) {
      let variant = "Error";
      enqueueSnackbar("Please select Unlock Time", { variant })
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
          enqueueSnackbar("Funds Locked Successfully", { variant })


        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Lock Funds", { variant })
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
      const paymentAmount = 5000000000;
      const runtimeArgs = RuntimeArgs.fromMap({
        spender: createRecipientAddress(spenderByteArray),
        amount: CLValueBuilder.u256(convertToStr(amount)),
      });

      let contractHashAsByteArray = Uint8Array.from(Buffer.from(ERC20_CRV_CONTRACT_HASH, "hex"));
      let entryPoint = "increase_allowance";

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
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);
        } else {
          // let Torus = new Torus();
          torus = new Torus();
          console.log("torus", torus);
          // Slider;
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
        handleCloseAllowance();
        handleCloseSigning();
        // let allowanceParam = {
        //   contractHash: pair,
        //   owner: CLPublicKey.fromHex(activePublicKey)
        //     .toAccountHashStr()
        //     .slice(13),
        //   spender: ROUTER_PACKAGE_HASH,
        // };
        // console.log("allowanceParam0", allowanceParam);
        // axios
        //   .post("/allowanceagainstownerandspenderpaircontract", allowanceParam)
        //   .then((res) => {
        //     console.log("allowanceagainstownerandspenderpaircontract", res);
        //     console.log(res.data);
        //     setpairAllowance(res.data.allowance);
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //     console.log(error.response);
        //   });

        let variant = "success";
        // increase ?
        enqueueSnackbar("Allowance Increased Successfully", { variant })
        // :
        // enqueueSnackbar("Allowance Decreased Successfully", { variant })


      } catch {
        handleCloseSigning();
        let variant = "Error";
        // increase ?
        enqueueSnackbar("Unable to Increase Allowance", { variant })
        // :
        // enqueueSnackbar("Unable to Decrease Allowance", { variant })
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }

  }

  const getAllowance = () => {
    let allowanceParam = {
      contractHash: ERC20_CRV_CONTRACT_HASH,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: VOTING_ESCROW_PACKAGE_HASH
    }
    console.log('allowanceParam0', allowanceParam);
    Axios
      .post('/allowanceagainstownerandspender', allowanceParam)
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
          selectedNav={"Home"}
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
                            <VotingPowerActionables createLockMakeDeploy={createLockMakeDeploy} allowance={allowance} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} />
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

export default DaoHome;
