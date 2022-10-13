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
import { CHAINS, SUPPORTED_NETWORKS } from "../Headers/HeaderDAO";
// MATERIAL UI
import TextField from "@mui/material/TextField";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

//BLOCKCHAIN
import Torus from "@toruslabs/casper-embed";
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { getDeploy } from "../blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import { GAUGE_CONTROLLER_PACKAGE_HASH } from "../blockchain/AccountHashes/Addresses";
import { CREATE_VOTE_CONTRACT_HASH } from "../blockchain/AccountHashes/Addresses";
import { useSnackbar } from 'notistack';

// COMPONENT FUNCTION
const PoolVote = () => {

    const { enqueueSnackbar } = useSnackbar();
  // States
  const [commitFeeOpen, setCommitFeeOpen] = useState(false);
  const [commitNewFee, setCommitNewFee] = useState("");
  const [commitAdminFee, setCommitAdminFee] = useState("");
  const [rampAOpen, setRampAOpen] = useState(false);
  const [rampFutureA, setRampFutureA] = useState("");
  const [rampFutureTime, setRampFutureTime] = useState("");
  const [commitOpen, setCommitOpen] = useState(false);
  const [commitNewOwner, setCommitNewOwner] = useState("");
  const [withdrawFeesOpen, setWithdrawFeesOpen] = useState(false);
  const [unkillMeOpen, setUnkillMeOpen] = useState(false);
  const [applyOwnershipOpen, setApplyOwnershipOpen] = useState(false);
  const [revertOwnershipOpen, setRevertOwnershipOpen] = useState(false);
  const [applyFeeOpen, setApplyFeeOpen] = useState(false);
  const [stopRampOpen, setStopRampOpen] = useState(false);
  const [revertParametersOpen, setRevertParametersOpen] = useState(false);
  const [openSigning, setOpenSigning] = useState(false);
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();

  const [entryPoint, setEntryPoint] = useState("");
  const [runTimeArgs, setRunTimeArgs] = useState([]);

  //   Event Handlers
  const handleCommitFeeOpen = () => {setCommitFeeOpen(true);setEntryPoint("commit_new_fee");setRunTimeArgs([commitNewFee,commitAdminFee]) }
  const handleCommitFeeClose = () => setCommitFeeOpen(false);
  const handleRampAOpen = () => {setRampAOpen(true);setEntryPoint("ramp_A");setRunTimeArgs([rampFutureA,rampFutureTime]) }
  const handleRampAClose = () => setRampAOpen(false);
  const handleCommitOpen = () => {setCommitOpen(true); setEntryPoint("commit_transfer_ownership");setRunTimeArgs([commitNewOwner]) }
  const handleCommitClose = () => setCommitOpen(false);
  const handleWithdrawFeesOpen = () => {setWithdrawFeesOpen(true); setEntryPoint("withdraw_admin_fees"); setRunTimeArgs([])}
  const handleWithdrawFeesClose = () => setWithdrawFeesOpen(false);
  const handleUnkillMeOpen = () => {setUnkillMeOpen(true); setEntryPoint("unkill_me"); setRunTimeArgs([])}
  const handleUnkillMeClose = () => setUnkillMeOpen(false);
  const handleApplyOwnershipOpen = () => {setApplyOwnershipOpen(true); setEntryPoint("apply_transfer_ownership"); setRunTimeArgs([])}
  const handleApplyOwnershipClose = () => setApplyOwnershipOpen(false);
  const handleRevertOwnershipOpen = () => {setRevertOwnershipOpen(true); setEntryPoint("revert_transfer_ownership"); setRunTimeArgs([])}
  const handleRevertOwnershipClose = () => setRevertOwnershipOpen(false);
  const handleApplyFeeOpen = () => {setApplyFeeOpen(true); setEntryPoint("apply_new_fee"); setRunTimeArgs([])}
  const handleApplyFeeClose = () => setApplyFeeOpen(false);
  const handleStopRampOpen = () => {setStopRampOpen(true); setEntryPoint("stop_ramp_A"); setRunTimeArgs([])}
  const handleStopRampClose = () => setStopRampOpen(false);
  const handleRevertParametersOpen = () => {setRevertParametersOpen(true); setEntryPoint("revert_new_parameters"); setRunTimeArgs([])}
  const handleRevertParametersClose = () => setRevertParametersOpen(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  //MAKE DEPLOY
  async function createVoteMakeDeploy(entrypoint,runtimeargs) {
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
        let gaugeControllerpackageHash = Uint8Array.from(
            Buffer.from(GAUGE_CONTROLLER_PACKAGE_HASH, "hex")
          );
        const runtimeArgs = RuntimeArgs.fromMap({
          contractPackageHash: createRecipientAddress(gaugeControllerpackageHash),
          entrypoint: entrypoint,
          runtimeargs: runtimeargs
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
          enqueueSnackbar("Created Vote Successfully", { variant })


        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Create Vote", { variant })
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
          <legend>Vote on Pool</legend>
          <div className="py-3 pl-4" style={{width:180}}>
          <FormControl variant="standard" fullWidth>
                                <Select
                                    label="gauge_type"
                                    >
                                    <MenuItem value={10}>Liquidity</MenuItem>
                                    <MenuItem value={20}>Liquidity-2</MenuItem>
                                    <MenuItem value={30}>Liquidity-3</MenuItem>
                                </Select>
                        </FormControl>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            commit_new_fee
                        </Typography>
                        <TextField
                            required
                            label="new_fee %"
                            variant="standard"
                            onChange={(e)=>setCommitNewFee(e.target.value)}
                        />
                        <TextField
                            required
                            label="new_admin_fee %"
                            variant="standard"
                            onChange={(e)=>setCommitAdminFee(e.target.value)}
                        />
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={()=>{commitNewFee.length <=0||commitAdminFee.length <=0? enqueueSnackbar("Fields are empty"): handleCommitFeeOpen()}}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={commitFeeOpen} close={handleCommitFeeClose} click={handleCommitFeeClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            ramp_A
                        </Typography>
                        <TextField
                            required
                            label="future_A"
                            variant="standard"
                            onChange={(e)=>setRampFutureA(e.target.value)}
                        />
                         <TextField
                            required
                            label="future_time"
                            variant="standard"
                            onChange={(e)=>setRampFutureTime(e.target.value)}
                        />
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={()=>{rampFutureA.length <=0||rampFutureTime.length <=0? enqueueSnackbar("Fields are empty"):handleRampAOpen()}}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={rampAOpen} close={handleRampAClose} click={handleRampAClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            commit_transfer_ownership
                        </Typography>
                        <TextField
                            required
                            label="new_owner"
                            variant="standard"
                            onChange={(e)=>setCommitNewOwner(e.target.value)}
                        />
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={()=>{commitNewOwner.length <=0? enqueueSnackbar("Fields are empty"): handleCommitOpen()}}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={commitOpen} close={handleCommitClose} click={handleCommitClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            withdraw_admin_fees
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleWithdrawFeesOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs}  open={withdrawFeesOpen} close={handleWithdrawFeesClose} click={handleWithdrawFeesClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            unkill_me
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleUnkillMeOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={unkillMeOpen} close={handleUnkillMeClose} click={handleUnkillMeClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            apply_transfer_ownership
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleApplyOwnershipOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={applyOwnershipOpen} close={handleApplyOwnershipClose} click={handleApplyOwnershipClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            revert_transfer_ownership
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleRevertOwnershipOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal  makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={revertOwnershipOpen} close={handleRevertOwnershipClose} click={handleRevertOwnershipClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            apply_new_fee
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleApplyFeeOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal  makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs}  open={applyFeeOpen} close={handleApplyFeeClose} click={handleApplyFeeClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            stop_ramp_A
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleStopRampOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={stopRampOpen} close={handleStopRampClose} click={handleStopRampClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
          </div>
          <div className="row no-gutters">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            revert_new_parameters
                        </Typography>
                        <div className="mt-4">
                            <Typography
                                variant="h6"
                                gutterBottom
                                component={"div"}
                                >
                                <span
                                    className="font-weight-bold"
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleRevertParametersOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={revertParametersOpen} close={handleRevertParametersClose} click={handleRevertParametersClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
          </div>
        </fieldset>
      </div>
      <footer style={{ height: "5rem" }}></footer>
    </>
  );
};

export default PoolVote;