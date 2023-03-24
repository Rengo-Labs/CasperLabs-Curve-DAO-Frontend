import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useMemo, useState } from "react";
import * as Yup from "yup";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import { VESTING_ESCROW_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import VestingTokens from "../../../../components/Charts/VestingTokens";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import { endTime, initialLocked, startTime, totalClaimed } from '../../../../components/JsClients/VESTINGESCROW/vestingEscrowFunctionsForBackend/functions';
import ClaimConfirmModal from "../../../../components/Modals/ClaimConfirmModal";
import * as helpers from "../../../../components/Utils/Helpers";
import HomeBanner from "../Home/HomeBanner";
window.Buffer = window.Buffer || require("buffer").Buffer;
const Vesting = () => {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [vestingAddress, setVestingAddress] = useState(
    localStorage.getItem("Address")
  );
  const [vestedOf, setVestedOf] = useState(0);
  const [balanceOf, setBalanceOf] = useState(0);
  const [lockedOf, setLockedOf] = useState(0);
  const [initialLockedval, setInitialLockedval] = useState(0);
  const [totalClaimedVal, setTotalClaimedVal] = useState(0);
  const [startTimeVal, setStartTimeVal] = useState();
  const [endTimeVal, setEndTimeVal] = useState();
  const [vestedData, setVestedData] = useState();
  const [unVestedData, setUnVestedData] = useState();
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  const initialValues = {
    CheckVestingAddress: "",
  };
  const validationSchema = Yup.object().shape({
    CheckVestingAddress: Yup.number().required("Required"),
  });

  const onSubmitVestingAddress = (values, props) => {
    console.log("Vesting Address Checking", values);
  };
  useEffect(() => {
    setVestingAddress(localStorage.getItem("Address"));
  }, [localStorage.getItem("Address")]);

  useEffect(() => {


    let publicKey = localStorage.getItem("Address");
    const getTimes = async () => {
      setStartTimeVal(await startTime(VESTING_ESCROW_CONTRACT_HASH));
      console.log("await endTime(VESTING_ESCROW_CONTRACT_HASH)", await endTime(VESTING_ESCROW_CONTRACT_HASH));
      setEndTimeVal(await endTime(VESTING_ESCROW_CONTRACT_HASH));
    }

    if (publicKey !== null &&
      publicKey !== undefined &&
      publicKey !== "null"
    ) {

      const getValues = async () => {
        let account = Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex");
        console.log("accountHash.......", account);
        let data = { account: Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex") }

        axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("votingEscrow response of balance of:...", response.data);
            setBalanceOf(response.data.balance)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });

        axios.post(`/vestingEscrow/vestedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of vested of:...", response.data);
            setVestedOf(response.data.vestedOf)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });

        axios.post(`/vestingEscrow/lockedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of locked of:...", response.data);
            setLockedOf(response.data.lockedOf)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });

        let initialLockValues = await initialLocked(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex"));
        let totalClaimedValue = await totalClaimed(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex"));


        if (initialLockValues == 0) {
          setInitialLockedval(10000000000000)
        }
        else {
          setInitialLockedval(initialLockValues);
        }
        if (totalClaimedValue == 0) {
          setTotalClaimedVal(20000000000000)
        }
        else {
          setTotalClaimedVal(totalClaimedValue);
        }
        console.log("initial locked:...", initialLockedval);
        console.log("starttime value:...", startTimeVal);
        console.log("end time value:...", endTimeVal);
        console.log("total claimed val:...", totalClaimedVal);
      }

      getValues();
      //console.log("initial locked:...",initialLock);


      if (+initialLocked == 0) {
        //this.notVested = true
        //return;
      }


    }
    getTimes()
  }, [localStorage.getItem("Address")]);

  useEffect(() => {
    console.log("start and end time before vested", parseInt(startTimeVal), parseInt(endTimeVal));
    let vestedTime = +parseInt(endTimeVal) - +parseInt(startTimeVal)

    console.log("vested time...", vestedTime);
    let vested = []
    let releasedAmount = initialLockedval / 1e9 / (vestedTime / 86400)
    for (let i = 0; i < (vestedTime) / 86400; i += 1000) {
      let time = (+startTimeVal + i * 86400) * 1;
      vested.push([time, i * releasedAmount])
    }
    let unvested = vested.map(([k, v]) => [k, initialLockedval / 1e9 - v]);
    console.log("vestedData....", vested.length);
    console.log("unvestedData....", unvested);
    setUnVestedData(unvested);
    setVestedData(vested);
  }, [startTimeVal, endTimeVal]);

  const vestedFormat = useMemo(() => {
    return (vestedOf / 1e9).toFixed(2);
  }, [vestedOf]);
  const balanceFormat = useMemo(() => {
    return (balanceOf / 1e9).toFixed(2);
  }, [balanceOf]);
  const lockedFormat = useMemo(() => {
    return (lockedOf / 1e9).toFixed(2);
  }, [lockedOf]);
  const initialLockedFormat = useMemo(() => {
    return (initialLockedval / 1e9).toFixed(2);
  }, [initialLockedval]);

  const totalClaimedFormat = useMemo(() => {
    return (totalClaimedVal / 1e9).toFixed(2);
  }, [totalClaimedVal]);
  const startTimeFormat = useMemo(() => {
    console.log("StartTime value....", startTimeVal);
    return helpers.formatDateToHuman(startTimeVal);
  }, [startTimeVal]);
  console.log("StartTime value format....", startTimeFormat);
  const endTimeFormat = useMemo(() => {
    return helpers.formatDateToHuman(endTimeVal);
  }, [endTimeVal]);
  console.log("initial locked values:...", initialLockedval);
  console.log("total cl values:...", totalClaimedVal);

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
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
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-10">
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
                                      onChange={(e) => {
                                        setVestingAddress(e.target.value);
                                      }}
                                      value={vestingAddress}
                                    />
                                  </div>
                                  <div className="col-12 col-lg-2 text-center mt-3 mt-lg-0">
                                    <div className="btnWrapper">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{ backgroundColor: "#1976d2", color: "white" }}
                                        onClick={() => { }}
                                      >
                                        Check
                                      </Button>
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
                                      {initialLockedFormat}
                                    </ListItemText>
                                  </ListItem>
                                  {
                                    startTimeFormat ?
                                      <ListItem disablePadding>
                                        <ListItemText>
                                          <span className="font-weight-bold">
                                            Start Lock Time:&nbsp;
                                          </span>
                                          {/* {startLockTime} */}
                                          {startTimeFormat === "NaN/NaN/NaN NaN:NaN:NaN" ? 0 : startTimeFormat}
                                        </ListItemText>
                                      </ListItem>
                                      : null
                                  }
                                  {
                                    endTimeFormat ?
                                      <ListItem disablePadding>
                                        <ListItemText>
                                          <span className="font-weight-bold">
                                            End Lock Time:&nbsp;
                                          </span>
                                          {endTimeFormat === "NaN/NaN/NaN NaN:NaN:NaN" ? 0 : endTimeFormat}
                                        </ListItemText>
                                      </ListItem>
                                      : null
                                  }


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
                                      {totalClaimedFormat}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Claimed + Available Tokens:&nbsp;
                                      </span>
                                      {vestedFormat}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Available Tokens:&nbsp;
                                      </span>
                                      {0.00}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Locked Tokens:&nbsp;
                                      </span>
                                      {lockedFormat}
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
                              <VestingTokens vested={vestedData} unvested={unVestedData} />
                            </div>

                            <div className="row no-gutters justify-content-center">
                              <Button
                                variant="contained"
                                size="large"
                                style={{ backgroundColor: "#1976d2", color: "white" }}
                                onClick={() => setOpen(true)}
                              >
                                Claim
                              </Button>
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

        <ClaimConfirmModal
          show={open}
          hide={handleClose}
          setOpen={setOpen}
          balance={balanceFormat}
        />
      </div>
    </>
  );
};

export default Vesting;
