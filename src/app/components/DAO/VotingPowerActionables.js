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
import SelectInput from "../FormsUI/SelectInput";
import TextInput from "../FormsUI/TextInput";
import DateTimePicker from "../FormsUI/DateTimePicker";
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
// FORMIK AND YUP
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";

// CONTENT

const lockTimeOptions = [
  {
    name: "1 Week",
  },
  {
    name: "1 Month",
  },
  {
    name: "3 Months",
  },
  {
    name: "6 Months",
  },
  {
    name: "1 Year",
  },
  {
    name: "4 Years",
  },
];

// COMPONENT FUNCTION
const VotingPowerActionables = () => {
  // States
  const [maxAmount, setMaxAmount] = useState(0.0);
  const [date, setDate] = useState(new Date());
  const [lockTime, setLockTime] = useState("");
  const [openA, setOpenA] = useState(false);
  const [startingVPower, setStartingVPower] = useState(0.0);

  // Content
  const initialValues = {
    LockAmount: "",
    LockTimeSelect: "",
    LockTimePicker: "",
  };
  const validationSchema = Yup.object().shape({
    LockAmount: Yup.number().required("Required"),
    LockTimeSelect: Yup.string().required("Required"),
    LockTimePicker: Yup.date().required("Required"),
    // tokenBQuantity: Yup.number().required("Required"),
  });

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

  const onSubmitVotingPowerActionables = (values, props) => {
    console.log("Voting Power Actionables", values);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmitVotingPowerActionables}
      >
        <Form>
          {/* Set Amount */}
          <div className="row no-gutters align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5">
              <TextInput
                id="daoAmount"
                label="Lock Amount"
                variant="filled"
                name="LockAmount"
                sx={{ width: "100%" }}
              />
            </div>
            {/* Max Button */}
            <div className="col-12 col-lg-5 mt-3 mt-lg-0">
              <div className="row no-gutters align-items-center">
                <div className="col-12 col-lg-8">
                  <div className="btnWrapper">
                    <button className="px-5">Max</button>
                  </div>
                </div>
                <div className="col-12 col-lg-4">
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
          <div className="row no-gutters mt-4 align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5 px-0">
              <DateTimePicker
                name="LockTimePicker"
                label="Choose Lock Time"
                sx={{ width: "100%" }}
              />
            </div>
            {/* Lock Time Dropdown */}
            <div className="col-12 col-lg-5 text-lg-right dao-form-width mt-3 mt-lg-0">
              <SelectInput
                name="LockTimeSelect"
                label="Select Lock Time"
                options={lockTimeOptions}
              />
            </div>
          </div>
          {/* </form>
            </div> */}
          {/* </div> */}
          <div className="row no-gutters justify-content-center">
            <div className="col-12 col-md-4">
              <div className="btnWrapper my-4 text-center">
                <button className="px-5" type="submit">
                  Lock Time
                </button>
              </div>
            </div>
          </div>
        </Form>
      </Formik>
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
