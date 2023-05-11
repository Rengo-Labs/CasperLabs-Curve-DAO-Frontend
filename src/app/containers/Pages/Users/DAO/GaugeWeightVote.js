import { gql, useQuery } from "@apollo/client";
import {
  Alert, Button,
  Container,
  TableFooter
} from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import axios from "axios";
import {
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs
} from "casper-js-sdk";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as Yup from "yup";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import * as helpers from "../../../../assets/js/helpers";
import {
  GAUGE_CONTROLLER_CONTRACT_HASH,
  VOTING_ESCROW_CONTRACT_HASH
} from "../../../../components/blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import WeightVotingHistory from "../../../../components/Charts/WeightVotingHistory";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import * as gaugeControllerFunctions from "../../../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import SigningModal from "../../../../components/Modals/SigningModal";
import VotingHistoryTable from "../../../../components/Tables/VotingHistoryTable";
import HomeBanner from "../Home/HomeBanner";

const GAUGE_WEIGHT = gql`
  query gaugeVotesByUser($user: String) {
    gaugeVotesByUser(user: $user) {
      id
      time
      user
      gauge
      weight
      gaugeWeights {
        weight
        gauge
      }
      total_weight
      veCRV
      totalveCRV
    }
  }
`;

const GAUGE_VOTES_BY_USER = gql`
  query gaugeVotesByUser($user: String) {
    gaugeVotesByUser(user: $user) {
      id
      time
      user
      gauge
      weight
      gaugeWeights {
        weight
        gauge
      }
      total_weight
      veCRV
      totalveCRV
    }
  }
`;

const GAUGE_VOTES_BY_TIME = gql`
  query gaugeVotesByTime($time: String) {
    gaugeVotesByTime(time: $time) {
      id
      time
      user
      gauge
      weight
      gaugeWeights {
        weight
        gauge
      }
      total_weight
      veCRV
      totalveCRV
    }
  }
`;

const GAUGES_BY_ADDRESS = gql`
  query getGaugesByAddress($gaugeAddress: String) {
    getGaugesByAddress(gaugeAddress: $gaugeAddress) {
      id
      address
      contractHash
      packageHash
      name
    }
  }
`;


const weightCells = ["Gauge", "Weight", "Reset"];

const WEEK = 604800000
const WEIGHT_VOTE_DELAY = 10 * 86400000
const GaugeWeightVote = () => {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [stakes, setStakes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalveCRV, setTotalveCRV] = useState(0);
  const [hideAllocation, setHideAllocation] = useState(false);
  const [gaugeWeightData, setGaugeWeightData] = useState([]);
  const [gaugeVoteTime, setGaugeVoteTime] = useState([]);
  const [futureWeight, setFutureWeight] = useState([]);
  const [historicGaugeWeight, setHistoricGaugeWeight] = useState([]);
  const [selectedWeightGauge, setSelectedWeightGauge] = useState([]); //this has to be return from backend
  const [filteredVotes, setFilteredVotes] = useState([]);
  const [showVotes, setShowVotes] = useState(false);
  const [users, setUsers] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedGauge, setSelectedGauge] = useState(null);
  const [nextTime, setNextTime] = useState();
  const [lockEnd, setLockEnd] = useState();
  const [lastUserVote, setLastUserVote] = useState();
  const [balance, setBalance] = useState(0);
  const [weight, setWeight] = useState(0);
  const [powerUsed, setPowerUsed] = useState(0);
  const [oldSlope, setOldSlope] = useState(null);
  const [myVoteWeightUsed, setMyVoteWeightUsed] = useState(null);
  const [gaugeAddress, setGaugeAddress] = useState('');
  const [totalveCRVvote, setTotalveCRVvote] = useState(0);
  const [votes, setVotes] = useState();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();
  let pointsSum = [[]];
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };
  const handleSelectedGauge = async (event) => {
    setGaugeAddress(event.target.value.packageHash)
  };
  useEffect(() => {
    if (
      activePublicKey !== null &&
      activePublicKey !== undefined &&
      activePublicKey !== "null"
    ) {
      setUsers(activePublicKey);
    }
  }, [activePublicKey]);


  const gauges = useQuery(GAUGES_BY_ADDRESS, {
    variables: {
      gaugeAddress: "",
    },
  });

  console.log("Error from gauges by address: ", gauges.error);
  console.log("Data from gauges by address: ", gauges.data?.getGaugesByAddress);
  console.log("activePublicKeyactivePublicKey", activePublicKey);
  // gauge votes by user
  const gaugeVotesByUser = useQuery(GAUGE_VOTES_BY_USER, {
    variables: {
      user: activePublicKey && activePublicKey != null && activePublicKey != 'null' && activePublicKey != undefined ? Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") : "",
    },
  });
  console.log("this is data of gauge weight: ", gaugeVotesByUser.data);
  console.log("this is error of gauge weight: ", gaugeVotesByUser.error);
  // gauge votes by gauge
  const gaugeVotesByGauge = useQuery(GAUGE_VOTES_BY_USER, {
    variables: {
      user: gaugeAddress ? gaugeAddress : "",
    },
  });

  console.log("this is data of gaugeVotesByGauge: ", gaugeAddress, gaugeVotesByGauge.data);
  console.log("this is error of gaugeVotesByGauge: ", gaugeVotesByGauge.error);
  // gauge votes by timestamp
  const gaugeVotesByTime = useQuery(GAUGE_VOTES_BY_TIME, {
    variables: {
      time: "1598486400000",
    },
  });
  console.log("this is data of gauge votes by time: ", gaugeVotesByTime.data);
  console.log("this is error of gauge weight: ", gaugeVotesByTime.error);

  let voteUserPower = async () => {
    // power used by user in gauge controller
    let _powerUsed = await gaugeControllerFunctions.vote_user_power(
      GAUGE_CONTROLLER_CONTRACT_HASH,
      Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex")
    );
    console.log("_powerUsed:", _powerUsed);
    setPowerUsed(_powerUsed)
  };

  useEffect(() => {
    if (
      activePublicKey &&
      activePublicKey !== null &&
      activePublicKey !== "null" &&
      activePublicKey !== undefined
    ) {
      let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }
      // balance of user in voting escrow
      axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
        .then(response => {
          console.log("votingEscrow response of balance of:...", response.data);
          setBalance(response.data.balances[0])
        })
        .catch(error => {
          console.log("error of balance of:...", error);
        });
      // locked end in voting escrow from backend
      axios.post(`/votingEscrow/lockedEnd/${VOTING_ESCROW_CONTRACT_HASH}`, data)
        .then(response => {
          console.log("votingEscrow response of lockedEnd:...", response.data);
          setLockEnd(response.data.lockedEnd.end)
        })
        .catch(error => {
          console.log("error of lockedEnd:...", error);
        });

      voteUserPower()
      console.log("(Number((Date.now()) + WEEK) / WEEK)", (Math.floor(((Date.now()) + WEEK) / WEEK)));
      setNextTime(Math.floor(((Date.now()) + WEEK) / WEEK) * WEEK)
      // get total supply of voting escrow
      axios.post(`/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`).then(response => {
        console.log("votingEscrow response of totalSupply:...", response.data);
        setTotalveCRV(response.data.totalSupplies[0])
      })
        .catch(error => {
          console.log("error of totalSupply:...", error);
        });
      getVotes()
    }
  }, [gaugeVotesByUser, gaugeVotesByTime]);



  async function getVotes() {

    let query = "type1"
    // if user logged in
    if (activePublicKey) {
      query = "type2"
    }
    // if user slected any gauge
    if (gaugeAddress) {
      query = "type3"
    }
    let _votes;
    if (query === 'type1') {
      // returns gauge votes by time
      _votes = { gaugeVotes: gaugeVotesByTime.data?.gaugeVotesByTime }
    } else if (query === 'type2') {
      // returns gauge votes by user and time
      let data = gaugeVotesByUser.data?.gaugeVotesByUser;
      let data1 = gaugeVotesByTime.data?.gaugeVotesByTime;
      _votes = { myVotes: data, gaugeVotes: data1 };
    } else {
      // returns gauge votes by user
      _votes = { gaugeVotes: gaugeVotesByGauge.data?.gaugeVotesByUser }
    }
    setVotes(_votes)

    // total ve CRV votes
    let _totalveCRVvote = _votes.gaugeVotes.filter((v, i, a) => a.findIndex(t => (t.user === v.user)) === i).reduce((a, b) => +a + +b.veCRV, 0)
    setTotalveCRVvote(_totalveCRVvote)
    let _myVoteWeightUsed;
    if (_votes.myVotes)
      _myVoteWeightUsed = _votes.myVotes.reduce((a, b) => +a + +b.weight / 100, 0)
    else
      _myVoteWeightUsed = _votes.gaugeVotes.reduce((a, b) => +a + +b.weight / 100, 0)

    setMyVoteWeightUsed(_myVoteWeightUsed)
  }
  useEffect(() => {
    if (gaugeVotesByUser) {
      setGaugeWeightData(
        gaugeVotesByUser.data?.gaugeVotesByUser !== undefined
          ? gaugeVotesByUser.data?.gaugeVotesByUser
          : []
      );
    }
    if (gaugeVotesByTime) {
      setGaugeVoteTime(
        gaugeVotesByTime.data?.gaugeVotesByTime !== undefined
          ? gaugeVotesByTime.data?.gaugeVotesByTime
          : []
      );
    }
  }, [gaugeVotesByUser, gaugeVotesByTime]);

  const handleTableGraph = (vote) => {
    let total_weight = vote?.total_weight;
    // set data for graph
    let future_weights = vote.gaugeWeights?.map((v, i) => ({
      id: gauges.data?.getGaugesByAddress[gauges.data?.getGaugesByAddress?.findIndex(t => (t.id === v.gauge))].name, name: gauges.data?.getGaugesByAddress[gauges.data?.getGaugesByAddress?.findIndex(t => (t.id === v.gauge))].name, y: (+v.weight * 1e9 * 100) / total_weight
    }))
    setHistoricGaugeWeight(future_weights);
    if (future_weights !== undefined) {
      handleOpen();
    }
  };

  const initialValues = {
    SelectGaugeToken: "",
    GaugeVotePower: "",
  };
  const validationSchema = Yup.object().shape({
    SelectGaugeToken: Yup.string().required("Required"),
  });

  const handleWeightGaugeChange = async (event) => {
    console.log("event.target.value", event.target.value);
    setSelectedGauge(event.target.value.address);
    // will get last user vote on selceted gauge and the user who logged in
    let lastUserVote = await gaugeControllerFunctions.last_user_vote(GAUGE_CONTROLLER_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex"), event.target.value.address);
    console.log("lastUserVote", lastUserVote);
    setLastUserVote(lastUserVote);
    console.log("{ owner: Buffer.from(CLPubdress }", { owner: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex"), spender: event.target.value.address });
    // will get vote User Slopes on selceted gauge and the user who logged in
    let response = await axios
      .post(
        `/gaugeController/voteUserSlopes/${GAUGE_CONTROLLER_CONTRACT_HASH}`,
        { owner: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex"), spender: event.target.value.address }
      )

    let _oldSlope = response.data.voteUserSlope;
    setOldSlope(_oldSlope);
    console.log("_oldSlope", _oldSlope);
  };

  const handleResetButton = (event) => {
    console.log("Reset button pressed");
  };

  const handleChangeAllocation = () => {
    hideAllocation ? setHideAllocation(false) : setHideAllocation(true);
  };


  async function voteForGaugeWeightsMakeDeploy(gauge, weight) {
    if (weight == 0) {
      let variant = "Error";
      enqueueSnackbar("Voting Power Percentage cannot be Zero", { variant });
      return;
    }
    if (gauge == undefined) {
      let variant = "Error";
      enqueueSnackbar("Please select Gauge", { variant });
      return;
    }
    handleShowSigning();
    const publicKeyHex = activePublicKey;
    if (
      publicKeyHex &&
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      // convert public key into hex
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      // payment amount for transaction
      const paymentAmount = 150000000000;
      // convert into byte array
      const gaugeByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(gauge, "hex"))
      );
      try {
        // runtime arguments for calling the blockchain method
        const runtimeArgs = RuntimeArgs.fromMap({
          gauge_addr: createRecipientAddress(gaugeByteArray),
          user_weight: CLValueBuilder.u256(weight * 100),
        });
        // convert gauge controller contract hash in to byte array
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(GAUGE_CONTROLLER_CONTRACT_HASH, "hex")
        );
        // entry point 
        let entryPoint = "vote_for_gauge_weights";
        // make deploy form calling blockchain method
        let deploy = await makeDeploy(
          publicKey,
          contractHashAsByteArray,
          entryPoint,
          runtimeArgs,
          paymentAmount
        );
        console.log("make deploy: ", deploy);
        try {
          let signedDeploy = await signdeploywithcaspersigner(
            deploy,
            publicKeyHex
          );
          let result = await putdeploy(signedDeploy, enqueueSnackbar);
          console.log("result", result);

          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Voted For Gauge Weights Successfully", { variant });
        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Vote For Gauge Weights", { variant });
        }
      } catch {
        handleCloseSigning();
        let variant = "Error";
        enqueueSnackbar("Something Went Wrong", { variant });
      }
    } else {
      handleCloseSigning();
      let variant = "error";
      enqueueSnackbar("Connect to Wallet Please", { variant });
    }
  }

  const getWeight = async () => {
    // get time wight of selected gauge from gauge controller
    let t = gaugeControllerFunctions.time_weight(selectedGauge);
    let pt;
    // get points wight of selected gauge and time we got from time_weight from gauge controller

    await axios
      .post(`/gaugeController/pointsWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`, {
        owner: selectedGauge,
        spender: t,
      })
      .then((response) => {
        console.log("Response from getting points weight: ", response);
        pt = response.data;
      })
      .catch((error) => {
        console.log("Error from getting points weight: ", error);
      });

    for (let i = 0; i < 500; i++) {
      if (t > Date.now() / 1000) {
        break;
      }
      t += WEEK;
      let d_bias = pt.slope * WEEK;
      if (pt.bias > d_bias) {
        pt.bias -= d_bias;
        let d_slope = await gaugeControllerFunctions.changes_sum(0, t);
        pt.slope -= d_slope;
      } else {
        pt.bias = 0;
        pt.slope = 0;
      }
      pointsSum[0][t] = pt;
    }
    return pt.bias;
  };

  // this will return true if the lock expires soon 
  function lockExpiresSoon() {
    console.log("nextTime", nextTime);
    console.log("lockEnd", lockEnd);
    return lockEnd <= nextTime
  }
  // to check if user voted ofenly without the Delay
  function voteIsOften() {
    return lastUserVote > 0 && lastUserVote + WEIGHT_VOTE_DELAY < Date.now() / 1000
  }
  // format of balace of user
  function balanceFormat() {
    return (balance / 1e9).toFixed(2)
  }
  // to check if weight added by user is invalid or not
  function isInvalidWeight() {
    return weight <= 0 || weight > 100 || isNaN(weight)
  }
  // will return allocated weight
  function weightAllocated() {
    return (weight / 100 * balance / 1e9).toFixed(8)
  }
  // will return if user used too much voting power
  function tooMuchPower() {
    if (oldSlope === null) return false
    let _powerUsed = powerUsed / 1
    _powerUsed = _powerUsed + (weight * 100) - oldSlope.power
    return !(_powerUsed >= 0 && _powerUsed <= 10000)
  }
  // format for total ve CRV vote
  function totalveCRVvoteFormat() {
    return helpers.formatNumber(totalveCRVvote / 1e9)
  }
  // format for total ve CRV
  function totalveCRVFormat() {
    return helpers.formatNumber(totalveCRV / 1e9)
  }
  // this will show users vote who logged in
  function showMyVotes() {
    setShowVotes(true);
    getVotes();
  }
  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          selectedNav={"GWVote"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <legend>Gauge Weight Voting</legend>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <Container>
                            <div className="py-5 px-4">
                              <div className="row no-gutters">
                                <div className="col-12">
                                  <div className=" my-2">
                                    <Alert severity="info">
                                      You can vote for gauge weight with your
                                      veCRV tokens (locked CRV tokens in&nbsp;
                                      <span
                                        className="font-weight-bold"
                                        style={{
                                          borderBottom: "1px dashed white",
                                          color: "#1976d2",
                                        }}
                                      >
                                        <Link
                                          to="/"
                                          style={{
                                            textDecoration: "none",
                                            color: "#1976d2",
                                          }}
                                        >
                                          Locker
                                        </Link>
                                      </span>
                                      ). Gauge weights are used to determine how
                                      much CRV does each pool get
                                    </Alert>
                                  </div>
                                  {balance == 0 ? (
                                    <div className=" my-2">
                                      <Alert severity="info">
                                        You need to have CRV locked in&nbsp;
                                        <span
                                          className="font-weight-bold"
                                          style={{
                                            borderBottom: "1px dashed white",
                                            color: "#1976d2",
                                          }}
                                        >
                                          <Link
                                            to="/locker"
                                            style={{
                                              textDecoration: "none",
                                              color: "#1976d2",
                                            }}
                                          >
                                            Locker
                                          </Link>
                                        </span>
                                        in order to vote for gauge weights
                                      </Alert>
                                    </div>
                                  ) : (null)}
                                  {lockExpiresSoon() ? (
                                    <div className=" my-2">
                                      <Alert severity="info">
                                        Your lock expires soon. You need to lock at
                                        least for a week in&nbsp;
                                        <span
                                          className="font-weight-bold"
                                          style={{
                                            borderBottom: "1px dashed white",
                                            color: "#1976d2",
                                          }}
                                        >
                                          <Link
                                            to="/"
                                            style={{
                                              textDecoration: "none",
                                              color: "#1976d2",
                                            }}
                                          >
                                            Locker
                                          </Link>
                                        </span>
                                      </Alert>
                                    </div>) : (null)}

                                  {voteIsOften() ? (
                                    <div className=" my-2">
                                      <Alert severity="info">
                                        You can vote only once in 10 days
                                      </Alert>
                                    </div>) : (null)}

                                  {tooMuchPower() ? (
                                    <div className=" my-2">
                                      <Alert severity="info">
                                        You alrady used too much power for this gauge
                                      </Alert>
                                    </div>) : (null)}


                                </div>
                              </div>
                            </div>
                          </Container>
                        </Paper>
                      </Box>
                    </div>
                    <div className="row no-gutters justify-content-center mt-4">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            <Container>
                              {balance > 0 ? (
                                <div className=" my-2">
                                  <Alert severity="info">
                                    You're voting with {balanceFormat()} veCRV
                                  </Alert>
                                </div>
                              ) : (null)}
                              <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                              >
                                <Form>
                                  <div className="row no-gutters">

                                    <div className="col-12 col-md-4">
                                      <FormControl
                                        variant="filled"
                                        sx={{
                                          m: 1,
                                          minWidth: 120,
                                        }}
                                      >
                                        <InputLabel id="select-gauge-label">
                                          Select a Gauge
                                        </InputLabel>

                                        <Select
                                          labelId="select-gauge-label"
                                          id="gauge-select"
                                          onChange={handleWeightGaugeChange}
                                        >
                                          <MenuItem value="Select a Gauge">
                                            <em>Select a Gauge</em>
                                          </MenuItem>
                                          {gauges.data?.getGaugesByAddress?.map(
                                            (item, key) => (
                                              <MenuItem key={key} value={item}>
                                                {item.name}
                                                {" ("}
                                                {item.id.slice(0, 6)} ...{" "}
                                                {item.id.slice(-6)}
                                                {")"}
                                              </MenuItem>
                                            )
                                          )}
                                        </Select>
                                      </FormControl>
                                    </div>

                                  </div>
                                  <br />
                                  <div className="row no-gutters">
                                    {myVoteWeightUsed ? (
                                      <List>
                                        <ListItem
                                          disablePadding
                                          sx={{ textAlign: "center" }}
                                        >
                                          <ListItemText>
                                            <span className="font-weight-bold">
                                              Vote Weight % used:&nbsp;
                                            </span>
                                            {myVoteWeightUsed && myVoteWeightUsed.toFixed(2)}%
                                          </ListItemText>
                                        </ListItem>
                                      </List>
                                    ) : (null)}
                                  </div>
                                  <div className="row no-gutters">
                                    <div className="col-12 col-md-8">
                                      <div className="row no-gutters align-items-center">
                                        <Typography
                                          variant="body1"
                                          component={"div"}
                                        >
                                          Vote Weight:&nbsp;

                                        </Typography>
                                        <TextInput
                                          id="gaugeVotingPower"
                                          variant="filled"
                                          name="GaugeVotePower"
                                          inputProps={{ sx: { height: 3, width: 60 } }}
                                          type="number"
                                          value={weight}
                                          onChange={(e) => {
                                            if (
                                              e.target.value <= 100 &&
                                              e.target.value >= 0
                                            )
                                              setWeight(
                                                e.target.value
                                              );
                                          }}
                                        />
                                        <Typography
                                          variant="body1"
                                          component={"div"}
                                        >
                                          <span>% (of your voting power)</span>
                                        </Typography>
                                      </div>
                                    </div>
                                  </div>
                                  {!hideAllocation ? null : (
                                    <div>
                                      <TableContainer
                                        sx={{
                                          overflow: "hidden",
                                          marginTop: 3,
                                          marginBottom: 3,
                                        }}
                                      >
                                        <Table aria-label="Gauge Weight Vote History">
                                          <TableHead
                                            sx={{
                                              backgroundColor: "#e7ebf0",
                                              paddingLeft: "0.25rem",
                                            }}
                                          >
                                            <TableRow id="GWVoteHistoryTableSort">
                                              {weightCells.map((cell) => (
                                                <TableCell
                                                  sx={{
                                                    border: 0,
                                                    fontWeight: "bold",
                                                    fontSize: "1.25rem",
                                                    textAlign: "center",
                                                  }}
                                                >
                                                  {cell}
                                                </TableCell>
                                              ))}
                                            </TableRow>
                                          </TableHead>
                                          <TableBody
                                            id={"GWVoteHistoryTableBody"}
                                          >
                                            {selectedWeightGauge.map(
                                              (gauge) => {
                                                return (
                                                  <TableRow>
                                                    <TableCell
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      gauge.name
                                                    </TableCell>
                                                    <TableCell
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      gauge.weight
                                                    </TableCell>
                                                    <TableCell
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <div className="btnWrapper">
                                                        <Button
                                                          variant="contained"
                                                          size="large"
                                                          style={{
                                                            backgroundColor:
                                                              "#1976d2",
                                                            color: "white",
                                                          }}
                                                          onClick={
                                                            handleResetButton
                                                          }
                                                        >
                                                          Reset
                                                        </Button>
                                                      </div>
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              }
                                            )}
                                          </TableBody>
                                          <TableFooter></TableFooter>
                                        </Table>
                                      </TableContainer>
                                    </div>
                                  )}
                                  <div className="row no-gutters mt-3">
                                    <div className="col-12">
                                      <div className="row no-gutters align-items-center">

                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <Typography
                                        variant="body1"
                                        component={"div"}
                                      >
                                        <span>
                                          {weightAllocated()} (
                                          {weight}%) of your
                                          voting power will be allocated to this
                                          gauge.
                                        </span>
                                      </Typography>
                                    </div>
                                  </div>
                                  <div className="row no-gutters mt-3 justify-content-center">
                                    <div className="col-12">
                                      <div className=" text-center">
                                        <Button
                                          className="hoverButtonGlobal"
                                          // variant="contained"
                                          size="large"
                                          style={{
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                            width: "33%"
                                          }}
                                          onClick={() => {
                                            voteForGaugeWeightsMakeDeploy(selectedGauge, weight)
                                          }}
                                        >
                                          Submit
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </Form>
                              </Formik>
                            </Container>
                          </div>
                        </Paper>
                      </Box>
                    </div>
                    <div className="row no-gutters justify-content-center mt-4">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            <div className="row no-gutters mt-3">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  style={{
                                    marginLeft: "20%",
                                    marginRight: "20%",
                                  }}
                                >
                                  <span className="font-weight-bold">
                                    Weight Voting History
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            <Container>
                              <div className="row no-gutters">
                                <div className="col-12 text-center text-md-left">
                                  <List>
                                    <ListItem disablePadding>
                                      <ListItemText>
                                        <span className="font-weight-bold">
                                          Voted this week:&nbsp;
                                        </span>
                                        {totalveCRVvoteFormat()}&nbsp;veCRV
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText>
                                        <span className="font-weight-bold">
                                          Total veCRV:&nbsp;
                                        </span>
                                        {totalveCRVFormat()}
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText>

                                        <span className="font-weight-bold">
                                          &nbsp;% of veCRV
                                          supply voted:&nbsp;
                                        </span>
                                        {((totalveCRVvote / totalveCRV) * 100).toFixed(2)}
                                      </ListItemText>
                                    </ListItem>
                                  </List>
                                </div>
                              </div>
                              <div className="row no-gutters justify-content-center mt-2">
                                <div className="col-12 col-md-8">
                                  <div className="row no-gutters w-100">
                                    <div className="col-12 col-md-12 col-lg-12 text-center w-100 px-2">
                                      <div className="">
                                        {!showVotes ? (
                                          <Button
                                            className="hoverButtonGlobal"
                                            onClick={() => {
                                              showMyVotes()
                                            }}
                                            // variant="contained"
                                            size="large"
                                            style={{
                                              // backgroundColor: "#1976d2",
                                              // color: "white",
                                              width: "50%",
                                            }}
                                          >
                                            Show My Votes
                                          </Button>
                                        ) : (
                                          <Button
                                            className="hoverButtonGlobal"
                                            onClick={() => {
                                              setShowVotes(false);
                                              getVotes()
                                            }}
                                            // variant="contained"
                                            size="large"
                                            style={{
                                              // backgroundColor: "#1976d2",
                                              // color: "white",
                                              width: "50%",
                                            }}
                                          >
                                            Show All Votes
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="row no-gutters mt-3 justify-content-center">
                                <div className="col-12">
                                  <Typography variant="h6" component={"h6"}>
                                    <span
                                      style={{
                                        color: "#000",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      Filter By:
                                    </span>
                                  </Typography>
                                </div>
                                <div className="col-12 col-md-6">
                                  <FormControl
                                    variant="filled"
                                    sx={{ m: 1, minWidth: 120 }}
                                  >
                                    <InputLabel id="select-gauge-label">
                                      Select a Gauge
                                    </InputLabel>
                                    <Select
                                      labelId="select-gauge-label"
                                      id="gauge-select"
                                      onChange={(event) => {
                                        console.log("Event: ", event);
                                        handleSelectedGauge(event);
                                      }}
                                    >
                                      <MenuItem value="Select a Gauge">
                                        <em>Select a Gauge</em>
                                      </MenuItem>
                                      {gauges.data?.getGaugesByAddress?.map(
                                        (item, key) => (
                                          <MenuItem key={key} value={item}>
                                            {item.name}
                                            {"-"}
                                            {item.id.slice(0, 6)} ...{" "}
                                            {item.id.slice(-6)}
                                          </MenuItem>
                                        )
                                      )}
                                    </Select>
                                  </FormControl>
                                </div>

                                <div className="w-100 my-3 mt-5">
                                  <Divider />
                                </div>
                              </div>
                            </Container>
                            {votes && votes != undefined ? (
                              <div className="row no-gutters mt-3">
                                <div className="col-12">
                                  <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                                    <VotingHistoryTable
                                      showVotes={showVotes}
                                      vote={votes}
                                      selectedGauge={selectedGauge}
                                      handleTableGraph={handleTableGraph}
                                      gaugeWeightData={gaugeWeightData}
                                    />
                                  </div>
                                </div>
                              </div>
                            ) : (null)}
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
        <WeightVotingHistory
          data={historicGaugeWeight}
          show={open}
          close={handleClose}
          setOpen={setOpen}
        />
        <SigningModal show={openSigning} />
      </div >
    </>
  );
};

export default GaugeWeightVote;
