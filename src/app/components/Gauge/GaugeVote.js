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
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// COMPONENT FUNCTION
const GaugeVote = () => {
  // States
  const [commitOpen, setCommitOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [gaugeOpen, setGaugeOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [changeOpen, setChangeOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState(false);

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
          <legend>Vote on Gauge</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            commit_transfer_ownership
                        </Typography>
                        <TextField
                            required
                            label="addr"
                            variant="standard"
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
                        <CreateVoteModal open={commitOpen} close={handleCommitClose} click={handleCommitClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            add_type
                        </Typography>
                        <TextField
                            required
                            label="_name"
                            variant="standard"
                        />
                         <TextField
                            required
                            label="weight"
                            variant="standard"
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
                        <CreateVoteModal open={addOpen} close={handleAddClose} click={handleAddClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            add_gauge
                        </Typography>
                        <TextField
                            required
                            label="addr"
                            variant="standard"
                        />
                        <FormControl variant="standard">
                            <InputLabel>gauge_type</InputLabel>
                                <Select
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
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleGaugeOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal open={gaugeOpen} close={handleGaugeClose} click={handleGaugeClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20} }}  elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            change_type_weight
                        </Typography>
                        <FormControl variant="standard">
                            <InputLabel>type_id</InputLabel>
                                <Select
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
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleTypeOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal open={typeOpen} close={handleTypeClose} click={handleTypeClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            change_gauge_weight
                        </Typography>
                        <FormControl variant="standard">
                            <InputLabel>addr</InputLabel>
                                <Select
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
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={handleChangeOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal open={changeOpen} close={handleChangeClose} click={handleChangeClose} title='Add Description'/>
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
                        <CreateVoteModal open={applyOpen} close={handleApplyClose} click={handleApplyClose} title='Add Description'/>
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