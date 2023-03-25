import React, { useState } from "react";
import "../../assets/css/SwapUsingCurvePools.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
import "../../assets/css/bootstrap.min.css";
import CreateVoteModal from "../Modals/CreateVoteModal";
import TextField from "@mui/material/TextField";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

const EmergencyMember = () => {
  const [mintOpen, setMintOpen] = useState(false);
  const [burnOpen, setBurnOpen] = useState(false);
  const handleMintOpen = () => setMintOpen(true);
  const handleMintClose = () => setMintOpen(false);
  const handleBurnOpen = () => setBurnOpen(true);
  const handleBurnClose = () => setBurnOpen(false);
  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Vote on Emergency Members</legend>
          <div className="row no-gutters">
            <div className="curve-content-wrapper mui-form-width col-lg-4">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,}}} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            Mint
                        </Typography>
                        <TextField
                            required
                            label="address"
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
                                    style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
                                    >
                                    <Button
                                      fullWidth
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#1976d2", color: "white" }}
                                      onClick={handleMintOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal open={mintOpen} close={handleMintClose} click={handleMintClose} title='Add Description'/>
                    </CardContent>
                </Card>
            </div>
            <div className="curve-content-wrapper mui-form-width col-lg-4 hover">
                <Card sx={{ minWidth: 275, textAlign:"center",':hover': {boxShadow: 20,} }} elevation={4}>
                    <CardContent>
                        <Typography sx={{ fontSize: 22, fontWeight:"bold" }} gutterBottom>
                            Burn
                        </Typography>
                        <FormControl variant="standard">
                            <InputLabel>address</InputLabel>
                                <Select
                                    label="Address"
                                    >
                                    <MenuItem value={10}>hash-c445082f41179fcb01230828d4184b6379287d8da4295a9addb20c8dbb329e98</MenuItem>
                                    <MenuItem value={20}>hash-t925082f48179fcb01230828d4184b6379287d8da4295a9addb50c8dbb329e47</MenuItem>
                                    <MenuItem value={30}>hash-r345082f78179fcb04560828d4184b6379287d8da4295a9addb20c8dpp329e47</MenuItem>
                                </Select>
                        </FormControl>
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
                                      onClick={handleBurnOpen}
                                    >
                                      Submit
                                    </Button>
                                </span>
                            </Typography>
                        </div>
                        <CreateVoteModal open={burnOpen} close={handleBurnClose} click={handleBurnClose} title='Add Ddescription'/>
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

export default EmergencyMember;