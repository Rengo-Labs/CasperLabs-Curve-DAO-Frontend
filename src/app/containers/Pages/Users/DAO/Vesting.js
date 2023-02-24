// REACT
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
// CHARTS
// CUSTOM STYLING
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CasperServiceByJsonRPC, CLPublicKey, RuntimeArgs, CLOption } from "casper-js-sdk";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import * as Yup from "yup";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import { VESTING_ESCROW_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import { getDeploy } from "../../../../components/blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import VestingTokens from "../../../../components/Charts/VestingTokens";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import SigningModal from "../../../../components/Modals/SigningModal";
import ClaimConfirmModal from "../../../../components/Modals/ClaimConfirmModal";
import HomeBanner from "../Home/HomeBanner";
import { Button } from "@mui/material";
import * as helpers from "../../../../components/Utils/Helpers";
import { endTime, initialLocked, startTime, totalClaimed } from '../../../../components/JsClients/VESTINGESCROW/vestingEscrowFunctionsForBackend/functions'
window.Buffer = window.Buffer || require("buffer").Buffer;

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
  const [vestingAddress, setVestingAddress] = useState(
    // "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
    localStorage.getItem("Address")
  );
  const [initialLock, setInitialLock] = useState("0.00");
  const [startLockTime, setStartLockTime] = useState("13/08/2021 22:17:28");
  const [endLockTime, setEndLockTime] = useState("13/08/2022 22:17:28");
  const [claimedTokens, setClaimedTokens] = useState("0.00");
  const [claimAvailTokens, setClaimAvailTokens] = useState("0.00");
  const [availableTokens, setAvailableTokens] = useState("0.00");
  const [lockedTokens, setLockedTokens] = useState("0.00");
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




  // USE EFFECT
  useEffect(() => {
    setVestingAddress(localStorage.getItem("Address"));
  }, [localStorage.getItem("Address")]);

  useEffect(() => {
    // this.chart = this.$refs.highcharts.chart
    // while(this.chart.series.length) {
    //   this.chart.series[0].remove()
    // }
    // this.chart.showLoading()

    // this.vesting = new web3.eth.Contract(daoabis.vesting_abi, this.address)

    // let calls = [
    //   [this.vesting._address, this.vesting.methods.vestedOf(contract.default_account).encodeABI()],
    //   [this.vesting._address, this.vesting.methods.balanceOf(contract.default_account).encodeABI()],
    //   [this.vesting._address, this.vesting.methods.lockedOf(contract.default_account).encodeABI()],
    //   [this.vesting._address, this.vesting.methods.initial_locked(contract.default_account).encodeABI()],
    //   [this.vesting._address, this.vesting.methods.start_time().encodeABI()],
    //   [this.vesting._address, this.vesting.methods.end_time().encodeABI()],
    //   [this.vesting._address, this.vesting.methods.total_claimed(contract.default_account).encodeABI()],
    // ]

    // let aggcalls = await contract.multicall.methods.aggregate(calls).call()

    // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))

    // console.log(decoded, "DECODED")

    // this.vestedOf = decoded[0]
    // this.balanceOf = decoded[1]
    // this.lockedOf = decoded[2]
    // this.initial_locked = decoded[3]
    // this.start_time = decoded[4]
    // this.end_time = decoded[5]
    // this.total_claimed = decoded[6]

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

      const getValues = async () => { //needs to import all of these functions
        // setVestedOf(await vestedOf(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")));
        // setBalanceOf(await balanceOf(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")));
        // setLockedOf(await lockedOf(VESTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")));
        let account = Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex");
        console.log("accountHash.......", account);
        let data = { account: Buffer.from(CLPublicKey.fromHex(publicKey).toAccountHash()).toString("Hex") }

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("votingEscrow response of balance of:...", response.data);
            setBalanceOf(response.data.balance)
          })
          .catch(error => {
            // handle the error
            console.log("error of balance of:...", error);
          });

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/vestingEscrow/vestedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of vested of:...", response.data);
            setVestedOf(response.data.vestedOf)
          })
          .catch(error => {
            // handle the error
            console.log("error of balance of:...", error);
          });

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/vestingEscrow/lockedOf/${VESTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of locked of:...", response.data);
            setLockedOf(response.data.lockedOf)
          })
          .catch(error => {
            // handle the error
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


  //COMPUTED
  // vestedFormat() {
  //   return (this.vestedOf / 1e18).toFixed(2)
  // },
  const vestedFormat = useMemo(() => {
    return (vestedOf / 1e9).toFixed(2);
  }, [vestedOf]);
  // balanceFormat() {
  //   return (this.balanceOf / 1e18).toFixed(2)
  // },
  const balanceFormat = useMemo(() => {
    return (balanceOf / 1e9).toFixed(2);
  }, [balanceOf]);
  // lockedFormat() {
  //   return (this.lockedOf / 1e18).toFixed(2)
  // },
  const lockedFormat = useMemo(() => {
    return (lockedOf / 1e9).toFixed(2);
  }, [lockedOf]);
  // initialLockedFormat() {
  //   return (this.initial_locked / 1e18).toFixed(2)
  // },
  const initialLockedFormat = useMemo(() => {
    return (initialLockedval / 1e9).toFixed(2);
  }, [initialLockedval]);
  // totalClaimedFormat() {
  //   return (this.total_claimed / 1e18).toFixed(2)
  // },
  const totalClaimedFormat = useMemo(() => {
    return (totalClaimedVal / 1e9).toFixed(2);
  }, [totalClaimedVal]);
  // startTimeFormat() {
  //   return helpers.formatDateToHuman(this.start_time)
  // },
  const startTimeFormat = useMemo(() => {
    console.log("StartTime value....", startTimeVal);
    return helpers.formatDateToHuman(startTimeVal);
  }, [startTimeVal]);
  // endTimeFormat() {
  //   return helpers.formatDateToHuman(this.end_time)
  // },
  const endTimeFormat = useMemo(() => {
    return helpers.formatDateToHuman(endTimeVal);
  }, [endTimeVal]);
  // gasPrice() {
  //     return gasPriceStore.state.gasPrice
  // },
  // gasPriceWei() {
  //     return gasPriceStore.state.gasPriceWei
  // },
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
                                          {startTimeFormat}
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
                                          {endTimeFormat}
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
                            {/* Gas Fee */}
                            {/* <div className="row no-gutters w-100">
                              <div className="col-12">
                                <GasPriorityFee />
                              </div>
                            </div> */}

                            <div className="row no-gutters justify-content-center">
                              {/* <div className="col-12"> */}
                              <Button
                                variant="contained"
                                size="large"
                                style={{ backgroundColor: "#1976d2", color: "white" }}
                                // onClick={() => { claimMakeDeploy() }}
                                onClick={() => setOpen(true)}
                              // onClick={() => { claimMakeDeploy(vestingAddress) }}
                              >
                                Claim
                              </Button>
                              {/* </div> */}
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
