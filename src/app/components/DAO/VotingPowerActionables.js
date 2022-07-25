// REACT
import React, { useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import DateTimePicker from "../FormsUI/DateTimePicker";
import SelectInput from "../FormsUI/SelectInput";
import TextInput from "../FormsUI/TextInput";
// MATERIAL UI ICONS
// MATERIAL UI
import { Button } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// FORMIK AND YUP
import { Alert } from "@material-ui/lab";
import { Form, Formik } from "formik";

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
const VotingPowerActionables = (props) => {
  // States
  const [userCRVBalance, setUserCRVBalance] = useState(0.00);
  const [dateDisplay, setDateDisplay] = useState();
  const [date, setDate] = useState();
  const [lockTime, setLockTime] = useState("");
  const [lockAmount, setLockAmount] = useState(0);
  const [openA, setOpenA] = useState(false);
  const [startingVPower, setStartingVPower] = useState(0.0);

  // Content
  const initialValues = {
    LockAmount: "",
    LockTimeSelect: "",
    LockTimePicker: "",
  };
  // const validationSchema = Yup.object().shape({
  //   LockAmount: Yup.number().required("Required"),
  //   LockTimeSelect: Yup.string().required("Required"),
  //   LockTimePicker: Yup.date().required("Required"),
  //   // tokenBQuantity: Yup.number().required("Required"),
  // });

  // Handlers
  // const handleCloseA = () => {
  //   setOpenA(false);
  // };

  // const handleOpenA = () => {
  //   setOpenA(true);
  // };

  // const handleChangetokenA = (event) => {
  //   setLockTime(event.target.value);
  // };

  const onSubmitVotingPowerActionables = (values, props) => {
    console.log("Voting Power Actionables", values);
  };

  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmitVotingPowerActionables}
      >
        <Form>
          {/* Set Amount */}
          <div className="row no-gutters align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5">
              <TextInput
                id="daoAmount"
                label="Lock Amount"
                onChange={(e) => {
                  console.log("e", e.target.value);
                  if (userCRVBalance >= e.target.value)
                    setLockAmount(e.target.value);
                  else {
                    setLockAmount(userCRVBalance);
                  }

                }}
                value={lockAmount}
                variant="filled"
                name="LockAmount"
                sx={{ width: "100%" }}
              />
            </div>
            {/* Max Button */}
            <div className="col-12 col-lg-5 mt-3 mt-lg-0">
              <div className="row no-gutters align-items-center">
                <div className="col-12 col-lg-8">
                  <Button
                    variant="contained"
                    size="large"
                    style={{ backgroundColor: "#5300e8", color: "white" }}
                    onClick={() => { setLockAmount(userCRVBalance) }}
                  >
                    Max
                  </Button>
                </div>
                <div className="col-12 col-lg-4">
                  <Typography
                    variant="body1"
                    gutterBottom
                    component="span"
                    fontWeight={900}
                    sx={{ padding: "10px", fontSize: "1.5rem" }}
                  >
                    {userCRVBalance}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          {/* Lock Time */}
          <div className="row no-gutters mt-4 align-items-center justify-content-center justify-content-lg-between">
            <div className="col-12 col-lg-5 px-0">
              <DateTimePicker
                onChange={(e) => {
                  console.log("e.value", e.target.value);
                  setDate(e.target.value);
                  setDateDisplay(e.target.value);
                }}
                value={dateDisplay}
                name="LockTimePicker"
                label="Choose Lock Time"
                sx={{ width: "100%" }}
              />
            </div>
            {/* Lock Time Dropdown */}
            <div className="col-12 col-lg-5 text-lg-right dao-form-width mt-3 mt-lg-0">
              <SelectInput
                setDate={setDate}
                setDateDisplay={setDateDisplay}
                name="LockTimeSelect"
                label="Select Lock Time"
                options={lockTimeOptions}
              />
            </div>
          </div>
          <div className="row no-gutters justify-content-center">
            <div className="col-12 col-md-4">

              <div className="btnWrapper my-4 text-center">
                <Button
                  variant="contained"
                  size="large"
                  style={{ backgroundColor: "#5300e8", color: "white" }}
                  onClick={() => {
                    props.createLockMakeDeploy(lockAmount, date);
                  }}
                >
                  LOCK TIME
                </Button>


              </div>
            </div>
          </div>
        </Form>
      </Formik>
      {/* Starting Voting Power */}
      <div className="row no-gutters mt-4 justify-content-center align-items-center">
        <div className="col-12">
          <Paper elevation={10} style={{ padding: "20px" }}>
            Your starting voting power will be: &nbsp;
            <strong>{startingVPower} veCRV</strong>
          </Paper>
        </div>
      </div>
      {/* DAO Proposal Requirements */}
      <div className="no-gutters mt-4 justify-content-center align-items-center">
        <Alert severity="info">
          You need at least 2500 veCRV to be able to create a &nbsp;
          <span
            className="font-weight-bold"
            style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "#5300e8" }}>
              Curve DAO proposal
            </Link>
          </span>
        </Alert>
      </div>
      {/* Gas Priority Fee */}
      {/* <div className="row no-gutters mt-4">
        <div className="col-12">
          <GasPriorityFee />
        </div>
      </div> */}
    </>
  );
};

export default VotingPowerActionables;
