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
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [vestingAddress, setVestingAddress] = useState(
    localStorage.getItem("Address")// get the address of user logged in
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
    setVestingAddress(localStorage.getItem("Address"));// get the address of user logged in
  }, [localStorage.getItem("Address")]);// get the address of user logged in

  useEffect(() => {

        // get the address of user logged in
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

        // to get balance of a user in Voting Escrow
        axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("votingEscrow response of balance of:...", response.data);
            setBalanceOf(response.data.balance)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });
        // to get Vested of a user in Voting Escrow
        axios.post(`/vestingEscrow/vestedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of vested of:...", response.data);
            setVestedOf(response.data.vestedOf)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });

        // to get Locked of a user in Voting Escrow
        axios.post(`/vestingEscrow/lockedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of locked of:...", response.data);
            setLockedOf(response.data.lockedOf)
          })
          .catch(error => {
            console.log("error of balance of:...", error);
          });
        // to get Initial Locked a user in Voting Escrow
        let initialLockValues = await initialLocked(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex"));
        // to get Total Claimed Value a user in Voting Escrow
        let totalClaimedValue = await totalClaimed(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex"));

        setInitialLockedval(initialLockValues);
        setTotalClaimedVal(totalClaimedValue);
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
  }, [localStorage.getItem("Address")]);// get the address of user logged in

  // renders every time when start time and end time updated
  useEffect(() => {
    console.log("start and end time before vested", parseInt(startTimeVal), parseInt(endTimeVal));
    // get vested time by subtracting end time with start time
    let vestedTime = +parseInt(endTimeVal) - +parseInt(startTimeVal)

    console.log("vested time...", vestedTime);
    let vested = []

    // to separate data for vested and unvested graph
    let releasedAmount = initialLockedval / 1e9 / (vestedTime / 86400)
    for (let i = 0; i < (vestedTime) / 86400; i += 1000) {
      
      let time = (+startTimeVal + i * 86400) * 1;
      vested.push([time, i * releasedAmount])
    }
    // get unvested data by subtracting the vested value from initial locked value
    let unvested = vested.map(([k, v]) => [k, initialLockedval / 1e9 - v]);
    console.log("vestedData....", vested.length);
    console.log("unvestedData....", unvested);
    setUnVestedData(unvested);
    setVestedData(vested);
  }, [startTimeVal, endTimeVal]);

  // format of vested of 
  const vestedFormat = useMemo(() => {
    return (vestedOf / 1e9).toFixed(2);
  }, [vestedOf]);
  // format of balance of 
  const balanceFormat = useMemo(() => {
    return (balanceOf / 1e9).toFixed(2);
  }, [balanceOf]);
  // format of locked of 
  const lockedFormat = useMemo(() => {
    return (lockedOf / 1e9).toFixed(2);
  }, [lockedOf]);
  // format of initial locked
  const initialLockedFormat = useMemo(() => {
    return (initialLockedval / 1e9).toFixed(2);
  }, [initialLockedval]);
// format of total claimed
  const totalClaimedFormat = useMemo(() => {
    return (totalClaimedVal / 1e9).toFixed(2);
  }, [totalClaimedVal]);
  // format of start Time to human readable date
  const startTimeFormat = useMemo(() => {
    console.log("StartTime value....", startTimeVal);
    return helpers.formatDateToHuman(startTimeVal);
  }, [startTimeVal]);
  console.log("StartTime value format....", startTimeFormat);
  // format of end Time to human readable date
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
                                    <div className="">
                                      <Button
                                        className="hoverButtonGlobal"
                                        size="large"
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
                                      {balanceFormat}
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
                                className="hoverButtonGlobal"
                                size="large"
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
