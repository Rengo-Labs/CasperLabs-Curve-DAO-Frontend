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

// COMPONENT FUNCTION
const VotingEscrow = () => {
  // States
  const [commitOpen, setCommitOpen] = useState(false);
  const [smartOpen, setSmartOpen] = useState(false);
  const [walletOpen, setWalletOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);
  const [commitTransfer, setCommitTransfer] = useState([]);
  const [commitSmart, setCommitSmart] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  // const [applyTransfer, setApplyTransfer] = useState();
  // const [applySmart, setApplySmart] = useState();

  //   Event Handlers
  const handleCommitOpen = () => {
    setCommitOpen(true);
    // setEntryPoint("commit_transfer_ownership");
    // setRunTimeArgs([commitTransfer]);
  };
  const handleCommitClose = () => setCommitOpen(false);
  const handleSmartOpen = () => {
    setSmartOpen(true);
    // setEntryPoint("commit_smart_Wallet_checker & apply");
    // setRunTimeArgs([setCommitSmart]);
  };
  const handleSmartClose = () => setSmartOpen(false);
  const handleWalletOpen = () => {
    setWalletOpen(true);
    // setEntryPoint("apply_transfer_ownership");
    // setRunTimeArgs([]);
  };
  const handleWalletClose = () => setWalletOpen(false);
  const handleApplyOpen = () => {
    setApplyOpen(true);
    // setEntryPoint("apply_smart_wallet_checker");
    // setRunTimeArgs([]);
  };
  const handleApplyClose = () => setApplyOpen(false);

  //STYLES

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
export default VotingEscrow;
