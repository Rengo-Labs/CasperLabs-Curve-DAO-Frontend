// REACT
import React, { useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLES
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import GasPriorityFee from "../Gas/GasPriorityFee";
// MATERIAL UI ICONS
// MATERIAL UI
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Avatar } from "@material-ui/core";
import Stack from "@mui/material/Stack";
import {
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

// CONTENT

// COMPONENT FUNCTION
const VotingPowerActionables = () => {
  // States
  const [maxAmount, setMaxAmount] = useState(0.0);
  const [date, setDate] = useState(new Date());
  const [lockTime, setLockTime] = useState("");
  const [openA, setOpenA] = useState(false);
  const [startingVPower, setStartingVPower] = useState(0.0);

  // Handlers
  const handleCloseA = () => {
    setOpenA(false);
  };

  const handleOpenA = () => {
    setOpenA(true);
  };

  const handleChangetokenA = (event) => {
    setLockTime(event.target.value);
  };

  return (
    <>
      <div className="row no-gutters align-items-center">
        {/* Set Amount */}
        <div className="col-12 col-lg-6">
          <TextField
            id="daoAmount"
            label="Amount"
            variant="filled"
            sx={{ width: "100%" }}
          />
        </div>
        {/* Max Button */}
        <div className="col-12 col-lg-6 mt-3 mt-lg-0">
          <div className="row no-gutters align-items-center">
            <div className="col-12 col-lg-10 text-center text-lg-right">
              <div className="btnWrapper">
                <button className="px-5">Max</button>
              </div>
            </div>
            <div className="col-12 col-lg-2 text-center">
              <Typography
                variant="body1"
                gutterBottom
                component="span"
                fontWeight={900}
                sx={{ padding: "10px", fontSize: "1.5rem" }}
              >
                {maxAmount}
              </Typography>
            </div>
          </div>
        </div>
      </div>
      {/* Lock Time */}
      <div className="row no-gutters mt-4 align-items-center">
        <div className="col-12">
          <form action="#">
            <div className="row no-gutters">
              <div className="col-12 px-0">
                <label for="lockTime">Choose Lock Time:&nbsp;</label>
              </div>
            </div>
            <div className="row no-gutters justify-content-center justify-content-lg-between">
              <div className="col-12 col-lg-5 px-0">
                <input
                  type="date"
                  id="lockTime"
                  name="lockTime"
                  style={{
                    height: "58px",
                    padding: "12px",
                    backgroundColor: "#f1f1f1",
                    border: "none",
                    borderBottom: "1px solid #777",
                    fontSize: "1rem",
                  }}
                  className="w-100"
                />
              </div>
              {/* Lock Time Dropdown */}
              <div className="col-12 col-lg-5 text-lg-right dao-form-width mt-3 mt-lg-0">
                <FormControl variant="filled">
                  <Select
                    labelId="lock-time-selector"
                    id="lock-time-dao"
                    open={openA}
                    onClose={handleCloseA}
                    onOpen={handleOpenA}
                    value={lockTime}
                    onChange={handleChangetokenA}
                    label="Lock Time"
                    sx={{ textAlign: "left" }}
                  >
                    <MenuItem value={"1 Week"}>1 Week</MenuItem>
                    <MenuItem value={"1 Month"}>1 Month</MenuItem>
                    <MenuItem value={"3 Months"}>3 Months</MenuItem>
                    <MenuItem value={"6 Months"}>6 Months</MenuItem>
                    <MenuItem value={"1 Year"}>1 Year</MenuItem>
                    <MenuItem value={"4 Years"}>4 Years</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Starting Voting Power */}
      <div className="row no-gutters mt-4 justify-content-center">
        <div className="col-12">
          <Typography variant="body1" gutterBottom component="div">
            &nbsp;Your starting voting power will be:&nbsp;
            <span className="p-3 bg-warning">
              <span className="font-weight-bold">{startingVPower}</span>
              &nbsp;veCRV
            </span>
          </Typography>
        </div>
      </div>
      {/* DAO Proposal Requirements */}
      <div className="row no-gutters mt-4 justify-content-center align-items-center">
        <div className="col-12 bg-primary text-white p-3">
          <Typography variant="body1" gutterBottom component="div">
            &nbsp;You need at least 2500 veCRV to be able to create a&nbsp;
            <span
              className="font-weight-bold"
              style={{ borderBottom: "1px dashed white" }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                Curve DAO proposal
              </Link>
            </span>
          </Typography>
        </div>
      </div>
      {/* Gas Priority Fee */}
      <div className="row no-gutters mt-4">
        <div className="col-12">
          <GasPriorityFee />
        </div>
      </div>
    </>
  );
};

export default VotingPowerActionables;
