// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/SwapUsingCurvePools.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
//BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS
import CreateVoteModal from "../Modals/CreateVoteModal";
// MATERIAL UI
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useSnackbar } from "notistack";
import {
  CasperServiceByJsonRPC,
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import {
  CREATE_VOTE_CONTRACT_HASH,
  GAUGE_CONTROLLER_PACKAGE_HASH,
} from "../blockchain/AccountHashes/Addresses";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import Torus from "@toruslabs/casper-embed";
import { CHAINS, SUPPORTED_NETWORKS } from "../Headers/HeaderDAO";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
import SigningModal from "../Modals/SigningModal";

// COMPONENT FUNCTION
const VotingEscrow = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [commitOpen, setCommitOpen] = useState(false);
  const [smartOpen, setSmartOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [commitTransfer, setCommitTransfer] = useState("");
  const [commitSmart, setCommitSmart] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  // const [applyTransfer, setApplyTransfer] = useState();
  // const [applySmart, setApplySmart] = useState();
  const [openSigning, setOpenSigning] = useState(false);
  const [entryPoint, setEntryPoint] = useState();
  const [runTimeArgs, setRunTimeArgs] = useState();

  //   Event Handlers
  const handleCommitOpen = () => {
    setCommitOpen(true);
    setEntryPoint("commit_transfer_ownership");
    setRunTimeArgs([commitTransfer]);
  };
  const handleCommitClose = () => setCommitOpen(false);
  const handleSmartOpen = () => {
    setSmartOpen(true);
    setEntryPoint("commit_smart_Wallet_checker & apply");
    setRunTimeArgs([setCommitSmart]);
  };
  const handleSmartClose = () => setSmartOpen(false);
  const handleWalletOpen = () => {
    setWalletOpen(true);
    setEntryPoint("apply_transfer_ownership");
    setRunTimeArgs([]);
  };
  const handleWalletClose = () => setWalletOpen(false);
  const handleApplyOpen = () => {
    setApplyOpen(true);
    setEntryPoint("apply_smart_wallet_checker");
    setRunTimeArgs([]);
  };
  const handleApplyClose = () => setApplyOpen(false);

  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  async function createVoteMakeDeploy(entrypoint, runtimeargs) {
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      // const addrByteArray = new CLByteArray(
      //   Uint8Array.from(Buffer.from(addr, "hex"))
      // );
      try {
        let gaugeControllerpackageHash = Uint8Array.from(
          Buffer.from(GAUGE_CONTROLLER_PACKAGE_HASH, "hex")
        );
        const runtimeArgs = RuntimeArgs.fromMap({
          contractPackageHash: createRecipientAddress(
            gaugeControllerpackageHash
          ),
          entrypoint: entrypoint,
          runtimeargs: runtimeargs,
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(CREATE_VOTE_CONTRACT_HASH, "hex")
        );
        let entryPoint = "create_vote";
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
          enqueueSnackbar("Created Vote Successfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Create Vote", { variant });
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

  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Vote on Voting Escrow</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card
                sx={{
                  minWidth: 275,
                  textAlign: "center",
                  ":hover": { boxShadow: 20 },
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    commit_transfer_ownership
                  </Typography>
                  <TextField
                    onChange={(e) => setCommitTransfer(e.target.value)}
                    value={commitTransfer}
                    required
                    label="addr"
                    variant="standard"
                  />
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={() => {
                            commitTransfer.length <= 0
                              ? enqueueSnackbar("Field is empty")
                              : handleCommitOpen();
                          }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={commitOpen}
                    close={handleCommitClose}
                    click={handleCommitClose}
                    title="Add Description"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card
                sx={{
                  minWidth: 275,
                  textAlign: "center",
                  ":hover": { boxShadow: 20 },
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    commit_smart_Wallet_checker & apply
                  </Typography>
                  <TextField
                    required
                    label="addr"
                    onChange={(e) => setCommitSmart(e.target.value)}
                    variant="standard"
                  />
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={() => {
                            commitSmart.length <= 0
                              ? enqueueSnackbar("Field is empty")
                              : handleSmartOpen();
                          }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={smartOpen}
                    close={handleSmartClose}
                    click={handleSmartClose}
                    title="Add Description"
                  />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card
                sx={{
                  minWidth: 275,
                  textAlign: "center",
                  ":hover": { boxShadow: 20 },
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    apply_transfer_ownership
                  </Typography>
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={handleApplyOpen}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={applyOpen}
                    close={handleApplyClose}
                    click={handleApplyClose}
                    title="Add Description"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card
                sx={{
                  minWidth: 275,
                  textAlign: "center",
                  ":hover": { boxShadow: 20 },
                }}
                elevation={4}
              >
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    apply_smart_wallet_checker
                  </Typography>
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={handleWalletOpen}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={walletOpen}
                    close={handleWalletClose}
                    click={handleWalletClose}
                    title="Add Description"
                  />
                  <CreateVoteModal
                    makeDeploy={createVoteMakeDeploy}
                    entrtpoint={entryPoint}
                    runtimeargs={runTimeArgs}
                    open={commitOpen}
                    close={handleCommitClose}
                    click={handleCommitClose}
                    title="Add Description"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </fieldset>
      </div>
      <footer style={{ height: "5rem" }}></footer>
      <SigningModal show={openSigning} />
    </>
  );
};
export default VotingEscrow;
