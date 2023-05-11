import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import { CLPublicKey, RuntimeArgs } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/SwapUsingCurvePools.css";
import { CREATE_VOTE_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { GAUGE_CONTROLLER_PACKAGE_HASH } from "../blockchain/Hashes/PackageHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import CreateVoteModal from "../Modals/CreateVoteModal";
const GaugeVote = () => {

  const { enqueueSnackbar } = useSnackbar();
  const [commitOpen, setCommitOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [gaugeOpen, setGaugeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [commitAddr, setCommitAddr] = useState("");
  const [addName, setAddName] = useState("");
  const [addWeight, setAddWeight] = useState("");
  const [addGaugeType, setAddGaugeType] = useState("");
  const [addGaugeWeight, setAddGaugeWeight] = useState("");
  const [addGaugeAddr, setAddGaugeAddr] = useState("");
  const [changeTypeId, setChangeTypeId] = useState("");
  const [changeTypeWeight, setChangeTypeWeight] = useState("");
  const [changeGaugeAddr, setChangeGaugeAddr] = useState("");
  const [changeGaugeWeight, setChangeGaugeWeight] = useState("");
  const [openSigning, setOpenSigning] = useState(false);
  // get the address of user logged in
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );

  const [entryPoint, setEntryPoint] = useState("");
  const [runTimeArgs, setRunTimeArgs] = useState([]);
  const handleCommitOpen = () => { setCommitOpen(true); setEntryPoint("commit_transfer_ownership"); setRunTimeArgs([commitAddr]) }
  const handleCommitClose = () => setCommitOpen(false);
  const handleAddOpen = () => { setAddOpen(true); setEntryPoint("add_type"); setRunTimeArgs([addName, addWeight]) }
  const handleAddClose = () => setAddOpen(false);
  const handleGaugeOpen = () => { setGaugeOpen(true); setEntryPoint("add_gauge"); setRunTimeArgs([addGaugeAddr, addGaugeType, addGaugeWeight]) }
  const handleGaugeClose = () => setGaugeOpen(false);
  const handleTypeOpen = () => { setTypeOpen(true); setEntryPoint("change_type_weight"); setRunTimeArgs([changeTypeId, changeTypeWeight]) }
  const handleTypeClose = () => setTypeOpen(false);
  const handleChangeOpen = () => { setChangeOpen(true); setEntryPoint("change_gauge_weight"); setRunTimeArgs([changeGaugeAddr, changeGaugeWeight]) }
  const handleChangeClose = () => setChangeOpen(false);
  const handleApplyOpen = () => { setApplyOpen(true); setEntryPoint("apply_transfer_ownership"); setRunTimeArgs([]) }
  const handleApplyClose = () => setApplyOpen(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  console.log(entryPoint);
  console.log(runTimeArgs);
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
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);
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
          <legend>Vote on Gauge</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20 } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
                    commit_transfer_ownership
                  </Typography>
                  <TextField
                    required
                    label="addr"
                    variant="standard"
                    onChange={(e) => setCommitAddr(e.target.value)}
                  />
                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component={"div"}
                    >
                      <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => { commitAddr.length <= 0 ? enqueueSnackbar("Field is empty") : handleCommitOpen() }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={commitOpen} close={handleCommitClose} click={handleCommitClose} title='Add Description' />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20, } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
                    add_type
                  </Typography>
                  <TextField
                    required
                    label="_name"
                    variant="standard"
                    onChange={(e) => setAddName(e.target.value)}
                  />
                  <TextField
                    required
                    label="weight"
                    variant="standard"
                    onChange={(e) => setAddWeight(e.target.value)}
                  />
                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component={"div"}
                    >
                      <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => { addName.length <= 0 || addWeight.length <= 0 ? enqueueSnackbar("Fields are empty") : handleAddOpen() }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={addOpen} close={handleAddClose} click={handleAddClose} title='Add Description' />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20, } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
                    add_gauge
                  </Typography>
                  <TextField
                    required
                    label="addr"
                    variant="standard"
                    onChange={(e) => setAddGaugeAddr(e.target.value)}
                  />
                  <FormControl variant="standard">
                    <InputLabel>gauge_type</InputLabel>
                    <Select
                      onChange={(e) => setAddGaugeType(e.target.value)}
                      label="gauge_type"
                    >
                      <MenuItem value={10}>Liquidity</MenuItem>
                      <MenuItem value={20}>Liquidity-2</MenuItem>
                      <MenuItem value={30}>Liquidity-3</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    label="gauge_weight"
                    variant="standard"
                    onChange={(e) => setAddGaugeWeight(e.target.value)}
                  />
                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component={"div"}
                    >
                      <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => { addGaugeAddr.length <= 0 || addGaugeWeight.length <= 0 || addGaugeType.length <= 0 ? enqueueSnackbar("Fields are empty") : handleGaugeOpen() }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={gaugeOpen} close={handleGaugeClose} click={handleGaugeClose} title='Add Description' />
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20 } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
                    change_type_weight
                  </Typography>
                  <FormControl variant="standard">
                    <InputLabel>type_id</InputLabel>
                    <Select
                      onChange={(e) => setChangeTypeId(e.target.value)}
                      label="type_id"
                    >
                      <MenuItem value={10}>Liquidity</MenuItem>
                      <MenuItem value={20}>Liquidity-2</MenuItem>
                      <MenuItem value={30}>Liquidity-3</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    label="gauge_weight"
                    variant="standard"
                    onChange={(e) => setChangeTypeWeight(e.target.value)}
                  />
                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component={"div"}
                    >
                      <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => { changeTypeId.length <= 0 || changeTypeWeight.length <= 0 ? enqueueSnackbar("Fields are empty") : handleTypeOpen() }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={typeOpen} close={handleTypeClose} click={handleTypeClose} title='Add Description' />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20, } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
                    change_gauge_weight
                  </Typography>
                  <FormControl variant="standard">
                    <InputLabel>addr</InputLabel>
                    <Select
                      onChange={(e) => setChangeGaugeAddr(e.target.value)}
                      label="addr"
                    >
                      <MenuItem value={10}>DAI</MenuItem>
                      <MenuItem value={20}>USDC</MenuItem>
                      <MenuItem value={30}>ETH</MenuItem>
                    </Select>
                  </FormControl>
                  <TextField
                    required
                    label="gauge_weight"
                    variant="standard"
                    onChange={(e) => setChangeGaugeWeight(e.target.value)}
                  />
                  <div className="mt-4">
                    <Typography
                      variant="h6"
                      gutterBottom
                      component={"div"}
                    >
                      <span
                        className="font-weight-bold"
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => { changeGaugeAddr.length <= 0 || changeGaugeWeight.length <= 0 ? enqueueSnackbar("Fields are empty") : handleChangeOpen() }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={changeOpen} close={handleChangeClose} click={handleChangeClose} title='Add Description' />
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center", ':hover': { boxShadow: 20, } }} elevation={4}>
                <CardContent>
                  <Typography sx={{ fontSize: 22, fontWeight: "bold" }} gutterBottom>
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
                        style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={handleApplyOpen}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal makeDeploy={createVoteMakeDeploy} entrtpoint={entryPoint} runtimeArgs={runTimeArgs} open={applyOpen} close={handleApplyClose} click={handleApplyClose} title='Add Description' />
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

export default GaugeVote;