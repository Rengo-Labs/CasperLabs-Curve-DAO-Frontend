import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import {
  CLPublicKey, RuntimeArgs
} from "casper-js-sdk";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/SwapUsingCurvePools.css";
import {
  CREATE_VOTE_CONTRACT_HASH
} from "../blockchain/Hashes/ContractHashes";
import { GAUGE_CONTROLLER_PACKAGE_HASH } from "../blockchain/Hashes/PackageHashes";
import { makeDeploy } from "../blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../blockchain/SignDeploy/SignDeploy";
import CreateVoteModal from "../Modals/CreateVoteModal";
import SigningModal from "../Modals/SigningModal";
const Vesting = () => {
  const [commitOpen, setCommitOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [gaugeOpen, setGaugeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [selected, setSelected] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [time, setTime] = useState("");
  const [toggleRecipient, settoggleRecipient] = useState("");
  const [disableRecipient, setDisableRecipient] = useState("");
  const [entryPoint, setEntryPoint] = useState();
  const [runTimeArgs, setRunTimeArgs] = useState();
  const [openSigning, setOpenSigning] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const handleCommitOpen = () => {
    setCommitOpen(true);
    setEntryPoint("fund_individual");
    setRunTimeArgs([recipient, amount, startTime, time]);
  };
  const handleCommitClose = () => setCommitOpen(false);
  const handleAddOpen = () => {
    setAddOpen(true);
    setEntryPoint("toggle_disable");
    setRunTimeArgs([toggleRecipient]);
  };
  const handleAddClose = () => setAddOpen(false);
  const handleGaugeOpen = () => {
    setGaugeOpen(true);
    setEntryPoint("disable_can_disable");
    setRunTimeArgs([disableRecipient]);
  };
  const handleGaugeClose = () => setGaugeOpen(false);
  const handleTypeOpen = () => {
    setTypeOpen(true);
  };
  const handleTypeClose = () => {
    setTypeOpen(false);
  };
  const handleChangeOpen = () => {
    setChangeOpen(true);
  };
  const handleChangeClose = () => {
    setChangeOpen(false);
  };
  const handleApplyOpen = () => {
    setApplyOpen(true);
  };
  const handleApplyClose = () => {
    setApplyOpen(false);
  };
  const handleCloseSigning = () => setOpenSigning(false);
  const handleShowSigning = () => setOpenSigning(true);

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
          <legend>Vote on Pool Proxy</legend>
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
                    fund_individual
                  </Typography>
                  <TextField
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    required
                    label="_recipient"
                    variant="standard"
                  />
                  <TextField
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    label="_amount"
                    variant="standard"
                  />
                  <TextField
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    required
                    label="start_time"
                    variant="standard"
                  />
                  <TextField
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                    label="_time"
                    variant="standard"
                  />
                  <FormGroup className="mt-2">
                    <FormControlLabel
                      control={<Switch />}
                      label="_can_disable"
                    />
                  </FormGroup>
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#1976d2",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => {
                            recipient.length <= 0 ||
                              amount.length <= 0 ||
                              startTime.length <= 0 ||
                              time.length <= 0
                              ? enqueueSnackbar("Fields are empty")
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
                    toggle_disable
                  </Typography>
                  <TextField
                    value={toggleRecipient}
                    onChange={(e) => settoggleRecipient(e.target.value)}
                    required
                    label="_recipient"
                    variant="standard"
                  />
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#1976d2",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => {
                            toggleRecipient.length <= 0
                              ? enqueueSnackbar("Field is empty")
                              : handleAddOpen();
                          }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={addOpen}
                    close={handleAddClose}
                    click={handleAddClose}
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
                    disable_can_disable
                  </Typography>
                  <TextField
                    value={disableRecipient}
                    onChange={(e) => setDisableRecipient(e.target.value)}
                    required
                    label="_recipient"
                    variant="standard"
                  />
                  <div className="mt-4">
                    <Typography variant="h6" gutterBottom component={"div"}>
                      <span
                        className="font-weight-bold"
                        style={{
                          borderBottom: "1px dashed white",
                          color: "#1976d2",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => {
                            disableRecipient.length <= 0
                              ? enqueueSnackbar("Field is empty")
                              : handleGaugeOpen();
                          }}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <CreateVoteModal
                    open={gaugeOpen}
                    close={handleGaugeClose}
                    click={handleGaugeClose}
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

export default Vesting;
