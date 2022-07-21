// REACT
import React, { useState } from "react";
// CHARTS
import apexChart from "react-apexcharts";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import GasPriorityFee from "../../../../components/Gas/GasPriorityFee";
import VestingTokens from "../../../../components/Charts/VestingTokens";
import TextInput from "../../../../components/FormsUI/TextInput";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
// FORMIK AND YUP
import { Formik, Form } from "formik";
import * as Yup from "yup";

// CONTENT

// COMPONENT FUNCTION
const Vesting = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [vestingAddress, setVestingAddress] = useState(
    "0x793b5c08B4861Af052dF77FEf4aB1EEc4B494e33"
  );
  const [initialLock, setInitialLock] = useState("0.00");
  const [startLockTime, setStartLockTime] = useState("13/08/2021 22:17:28");
  const [endLockTime, setEndLockTime] = useState("13/08/2022 22:17:28");
  const [claimedTokens, setClaimedTokens] = useState("0.00");
  const [claimAvailTokens, setClaimAvailTokens] = useState("0.00");
  const [availableTokens, setAvailableTokens] = useState("0.00");
  const [lockedTokens, setLockedTokens] = useState("0.00");

  // Content
  const initialValues = {
    CheckVestingAddress: "",
  };
  const validationSchema = Yup.object().shape({
    CheckVestingAddress: Yup.number().required("Required"),
  });

  // Handlers
  const onSubmitVestingAddress = (values, props) => {
    console.log("Vesting Address Checking", values);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Vesting"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        {/* Main Content */}
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Main Heading */}
                            <div className="row no-gutters justify-content-center">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Vesting
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Address */}
                            <Formik
                              initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmitVestingAddress}
                            >
                              <Form>
                                <div className="row no-gutters justify-content-center align-items-center">
                                  <div className="col-12 col-lg-10 w-100">
                                    <TextInput
                                      id="vesting-address"
                                      label="Address"
                                      variant="filled"
                                      name="CheckVestingAddress"
                                      sx={{ width: "100%" }}
                                    />
                                  </div>
                                  <div className="col-12 col-lg-2 text-center mt-3 mt-lg-0">
                                    <div className="btnWrapper">
                                      <button>Check</button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </Formik>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
                            </div>
                            {/* Lock Stats */}
                            <div className="row no-gutters pb-3 pb-xl-2">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Initial Locked:&nbsp;
                                      </span>
                                      {initialLock}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Start Lock Time:&nbsp;
                                      </span>
                                      {startLockTime}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        End Lock Time:&nbsp;
                                      </span>
                                      {endLockTime}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            {/* Token Stats */}
                            <div className="row no-gutters pb-3 pb-xl-2">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Claimed Tokens:&nbsp;
                                      </span>
                                      {claimedTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Claimed + Available Tokens:&nbsp;
                                      </span>
                                      {claimAvailTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Available Tokens:&nbsp;
                                      </span>
                                      {availableTokens}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Locked Tokens:&nbsp;
                                      </span>
                                      {lockedTokens}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Chart */}
                            <div className="row no-gutters w-100">
                              <div className="col-12 text-center pt-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Vested and Unvested Tokens
                                  </span>
                                </Typography>
                              </div>
                              <VestingTokens />
                            </div>
                            {/* Gas Fee */}
                            <div className="row no-gutters w-100">
                              <div className="col-12">
                                <GasPriorityFee />
                              </div>
                            </div>
                          </div>
                        </Paper>
                      </Box>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Vesting;
