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
import { useSnackbar } from "notistack";
// MATERIAL UI
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

// COMPONENT FUNCTION
const Vesting = () => {
  // States
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
  const { enqueueSnackbar } = useSnackbar();

  //   Event Handlers
  const handleCommitOpen = () => setCommitOpen(true);
  const handleCommitClose = () => setCommitOpen(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleGaugeOpen = () => setGaugeOpen(true);
  const handleGaugeClose = () => setGaugeOpen(false);
  const handleTypeOpen = () => setTypeOpen(true);
  const handleTypeClose = () => setTypeOpen(false);
  const handleChangeOpen = () => setChangeOpen(true);
  const handleChangeClose = () => setChangeOpen(false);
  const handleApplyOpen = () => setApplyOpen(true);
  const handleApplyClose = () => setApplyOpen(false);

  //STYLES

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
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
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
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
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
                          color: "#5300e8",
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
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

export default Vesting;
