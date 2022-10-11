// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/SwapUsingCurvePools.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
//BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS

// MATERIAL UI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

// COMPONENT FUNCTION
const GaugeVote = () => {
  // States
  const [commitOpen, setCommitOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

  //   Event Handlers
  const handleCommitOpen = () => setCommitOpen(true);
  const handleCommitClose = () => setCommitOpen(false);
  const handleAddOpen = () => setAddOpen(true);
  const handleAddClose = () => setAddOpen(false);
  const handleApplyOpen = () => setApplyOpen(true);
  const handleApplyClose = () => setApplyOpen(false);

  //STYLES
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
  };

  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Vote on Gauge</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Commit Transfer Ownership
                  </Typography>
                  <TextField required label="addr" variant="standard" />
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
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={handleCommitOpen}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <Modal
                    open={commitOpen}
                    onClose={handleCommitClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Commit Transfer Ownership
                      </Typography>
                      <TextField
                        required
                        label="Description"
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
                              variant="contained"
                              size="large"
                              style={{
                                backgroundColor: "#5300e8",
                                color: "white",
                              }}
                              onClick={handleCommitClose}
                            >
                              Submit
                            </Button>
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  </Modal>
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Add Type
                  </Typography>
                  <TextField required label="name" variant="standard" />
                  <TextField required label="weight" variant="standard" />
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
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={handleAddOpen}
                        >
                          Submit
                        </Button>
                      </span>
                    </Typography>
                  </div>
                  <Modal
                    open={addOpen}
                    onClose={handleAddClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Add Type
                      </Typography>
                      <TextField
                        required
                        label="Description"
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
                              variant="contained"
                              size="large"
                              style={{
                                backgroundColor: "#5300e8",
                                color: "white",
                              }}
                              onClick={handleAddClose}
                            >
                              Submit
                            </Button>
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  </Modal>
                </CardContent>
              </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
              <Card sx={{ minWidth: 275, textAlign: "center" }}>
                <CardContent>
                  <Typography
                    sx={{ fontSize: 22, fontWeight: "bold" }}
                    gutterBottom
                  >
                    Apply Transfer Ownership
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
                  <Modal
                    open={applyOpen}
                    onClose={handleApplyClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                  >
                    <Box sx={style}>
                      <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                      >
                        Apply Transfer Ownership
                      </Typography>
                      <TextField
                        required
                        label="Description"
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
                              variant="contained"
                              size="large"
                              style={{
                                backgroundColor: "#5300e8",
                                color: "white",
                              }}
                              onClick={handleApplyClose}
                            >
                              Submit
                            </Button>
                          </span>
                        </Typography>
                      </div>
                    </Box>
                  </Modal>
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
