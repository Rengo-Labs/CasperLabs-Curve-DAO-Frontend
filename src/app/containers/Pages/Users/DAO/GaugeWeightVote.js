import { gql, useQuery } from "@apollo/client";
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
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import FutureGaugeWeight from "../../../../components/Charts/FutureGaugeWeight";
import WeightVotingHistory from "../../../../components/Charts/WeightVotingHistory";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";

import {
  Alert, Button,
  Container,
  TableFooter
} from "@mui/material";
import axios from "axios";
import {
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs
} from "casper-js-sdk";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import cspr from "../../../../assets/img/cspr.png";
import usdt from "../../../../assets/img/usdt.png";
import wbtc from "../../../../assets/img/wbtc.png";
import {
  GAUGE_CONTROLLER_CONTRACT_HASH,
  VOTING_ESCROW_CONTRACT_HASH
} from "../../../../components/blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import * as gaugeControllerFunctions from "../../../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as votingEscrowFunctions from "../../../../components/JsClients/VOTINGESCROW/QueryHelper/functions";
import SigningModal from "../../../../components/Modals/SigningModal";
import VoteForGaugeWeightModal from "../../../../components/Modals/VoteForGaugeWeightModal";
// import * as statsStore from "../../../../components/stores/StatsStore";
import FutureAPYTable from "../../../../components/Tables/FutureAPYTable";
import VotingHistoryTable from "../../../../components/Tables/VotingHistoryTable";

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


const cells = ["", "Pool", "Current CRV APY", "Future CRV APY"];
const weightCells = ["Gauge", "Weight", "Reset"];
const sampleTableData =
  '[{"indexNo":"0","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"1","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"2","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"3","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"4","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"5","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"6","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"7","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"8","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"9","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"10","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"11","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"12","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"13","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"14","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"15","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"16","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"17","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"18","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"19","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"20","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"21","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"22","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"23","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"}]';

var gaugeWeightVoteData = [];
try {
  gaugeWeightVoteData = JSON.parse(sampleTableData);
} catch (expecption) { }

const votingHistoryCells = [
  "Time",
  "Voter",
  "veCRV",
  "Total veCRV",
  "Gauge",
  "Weight",
  "Total Weight",
];

const sampleVotingHistoryData =
  '[{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"}]';

var votingHistoryData = [];
try {
  votingHistoryData = JSON.parse(sampleVotingHistoryData);
} catch (expecption) {
  console.log("an exception has occured!", expecption);
}

const WEEK = 604800000

const WEIGHT_VOTE_DELAY = 10 * 86400000
// COMPONENT FUNCTION
const GaugeWeightVote = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [stakes, setStakes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [effectiveDate, setEffectiveDate] = useState("26/05/2022");
  const [votedThisWeek, setVotedThisWeek] = useState("");
  const [totalVeCRV, setTotalVeCRV] = useState("0");
  const [veCRVSupplyVoted, setVeCRVSupplyVoted] = useState("0.61 %");
  const [boostGauge, setBoostGauge] = useState();
  const [voteWeightUsed, setVoteWeightUsed] = useState("0%");
  const [hideAllocation, setHideAllocation] = useState(false);
  const [votingPowerPercentage, setVotingPowerPercentage] = useState(1);
  const [votingPowerNumber, setVotingPowerNumber] = useState("0.00");
  const [gauge, setGauge] = useState(
    "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
  );
  const [gaugeWeightData, setGaugeWeightData] = useState([]);
  const [gaugeVoteTime, setGaugeVoteTime] = useState([]);
  const [futureWeight, setFutureWeight] = useState([]);
  const [historicGaugeWeight, setHistoricGaugeWeight] = useState([]);
  const [weightGauges, setWeightGauges] = useState(["CSPR", "WBTC", "USDT"]);
  const [weightGauge, setWeightGauge] = useState();
  const [selectedWeightGauge, setSelectedWeightGauge] = useState([]); //this has to be return from backend
  const [filteredVotes, setFilteredVotes] = useState([]);
  const [showVotes, setShowVotes] = useState(true);
  const [users, setUsers] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedGauge, setSelectedGauge] = useState(" ");
  const [outcomeWeights, setOutcomeWeights] = useState([]);
  const [oldAPY, setOldAPY] = useState();
  const [newAPY, setNewAPY] = useState();
  const [currentCRVAPYs, setCurrentCRVAPYs] = useState({});
  const [futureCRVAPYs, setFutureCRVAPYs] = useState({});
  const [currentWeights, setCurrentWeights] = useState({});
  const [futureWeights, setFutureWeights] = useState({});
  const [nextTime, setNextTime] = useState();
  const [lockEnd, setLockEnd] = useState();
  const [lastUserVote, setLastUserVote] = useState();
  const [balance, setBalance] = useState(0);
  const [weight, setWeight] = useState(0);
  const [powerUsed, setPowerUsed] = useState(0);
  const [oldSlope, setOldSlope] = useState(0);
  const [myVoteWeightUsed, setMyVoteWeightUsed] = useState(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();

  let pointsSum = [[]];

  
  // States
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  const [openVoteForGaugeWeightModal, setVoteForGaugeWeightModal] =
    useState(false);
  const handleCloseVoteForGaugeWeightModal = () => {
    setVoteForGaugeWeightModal(false);
  };
  const handleShowVoteForGaugeWeightModal = () => {
    setVoteForGaugeWeightModal(true);
  };

  const handleSelectedGauge = async (event) => {
    if (selectedGauge !== "") {
      // statsStore.state.calculatedWeights[oldval] = statsStore.state.gaugesWeights[oldval]
    }

    setSelectedGauge(event.target.value);

    // this.outcomeWeights = [];
    // this.oldAPY = null;
    // this.newAPY = null;

    // this.last_user_vote = await this.gaugeController.methods
    //   .last_user_vote(contract.default_account, this.selectedGauge)
    //   .call();
    // this.old_slope = await this.gaugeController.methods
    //   .vote_user_slopes(contract.default_account, this.selectedGauge)
    //   .call();
  };

  // Queries
  useEffect(() => {
    if (
      activePublicKey !== null &&
      activePublicKey !== undefined &&
      activePublicKey !== "null"
    ) {
      setUsers(activePublicKey);
    }
  }, [activePublicKey]);

  // useEffect(() => {
  //   if (showVotes) {
  //     setUsers(
  //       "24a56544c522eca7fba93fb7a6cef83e086706fd87b2f344f5c3dad3603d11f1"
  //     );
  //   } else {
  //     setUsers(
  //       "24a56544c522eca7fba93fb7a6cef83e086706fd87b2f344f5c3dad3603d11f1"
  //     );
  //   }
  // }, [showVotes]);

  const gauges = useQuery(GAUGES_BY_ADDRESS, {
    variables: {
      gaugeAddress: "",
    },
  });

  console.log("Error from gauges by address: ", gauges.error);
  console.log("Data from gauges by address: ", gauges.data?.getGaugesByAddress);

  const gaugeWeight = useQuery(GAUGE_WEIGHT, {
    variables: {
      user: users,
    },
  });
  // console.log("Users: ", users);
  console.log("this is data of gauge weight: ", gaugeWeight.data);
  console.log("this is error of gauge weight: ", gaugeWeight.error);

  const gaugeVotesByTime = useQuery(GAUGE_VOTES_BY_TIME, {
    variables: {
      time: "50",
    },
  });
  console.log("this is data of gauge votes by time: ", gaugeVotesByTime.data);
  console.log("this is error of gauge weight: ", gaugeVotesByTime.error);

  // if (gaugeWeight.data !== undefined) {
  //   console.log("gaugeWeight", gaugeWeight.data.gaugeVotesByUser);
  // }

  useEffect(() => {
    let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }

    axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        // handle the response
        console.log("votingEscrow response of balance of:...", response.data);
        setBalance(response.data.balance)
      })
      .catch(error => {
        // handle the error
        console.log("error of balance of:...", error);
      });

    axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/lockedEnd/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        // handle the response
        console.log("votingEscrow response of lockedEnd:...", response.data);
        setLockEnd(response.data.lockedEnd.end)
      })
      .catch(error => {
        // handle the error
        console.log("error of lockedEnd:...", error);
      });


    let _powerUsed = gaugeControllerFunctions.vote_user_power(
      GAUGE_CONTROLLER_CONTRACT_HASH,
      activePublicKey
    );
    console.log("_powerUsed", _powerUsed);
    setPowerUsed(_powerUsed);
    setNextTime(((Date.now()) + WEEK) / WEEK * WEEK)
    let totalSupply = axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`).then(response => {
      // handle the response
      console.log("votingEscrow response of totalSupply:...", response.data);
      setTotalVeCRV(response.data.totalSupply[0])
    })
    .catch(error => {
      // handle the error
      console.log("error of totalSupply:...", error);
    });

    // getVotes()
    // getVotes();  //check for its logic
    //WORKING FOR GETVOTES FUNCTION AFTER REMOVING QUERIES

    let votes;
    if (gaugeWeight) {
      votes = gaugeWeight.data?.gaugeVotesByUser;
    } else {
      votes = gaugeVoteTime.data?.gaugeVotesByTime;
    }
    console.log("Votesvotesvotes: ", votes);
    let totalveCRVvote = votes
      ?.filter((v, i, a) => a.findIndex((t) => t.user === v.user) === i)
      .reduce((a, b) => +a + +b.veCRV, 0);

    setVotedThisWeek(totalveCRVvote);
    // if (results.data.myVotes) {
    //   this.myVoteWeightUsed =
    //     results.data.myVotes.reduce((a, b) => +a + +b.weight, 0) / 100;
    // } else {
    //   this.myVoteWeightUsed =
    //     results.data.gaugeVotes.reduce((a, b) => +a + +b.weight, 0) / 100;
    //   console.log(results, this.votes.length, "THE RESULTS");
    // }
  }, [gaugeWeight, gaugeVotesByTime]);

  useEffect(() => {
    if (gaugeWeight) {
      console.log("GaugeWeightByUserData", gaugeWeight.data?.gaugeVotesByUser);
      setGaugeWeightData(
        gaugeWeight.data?.gaugeVotesByUser !== undefined
          ? gaugeWeight.data?.gaugeVotesByUser
          : []
      );
    }
    if (gaugeVotesByTime) {
      console.log(
        "gaugeVotesByTime...",
        gaugeVotesByTime.data?.gaugeVotesByTime
      );
      setGaugeVoteTime(
        gaugeVotesByTime.data?.gaugeVotesByTime !== undefined
          ? gaugeVotesByTime.data?.gaugeVotesByTime
          : []
      );
      // setGaugeVoteTime(gaugeVotesByTime.data?.gaugeVotesByTime);
    }
  }, [gaugeWeight, gaugeVotesByTime]);

  let gaugesNames = {
    "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9":
      "compound",
    d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef: "usdt",
    "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a": "y",
    "3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735": "busd",
    b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0: "pax",
    bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38: "ren",
    adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c: "susdv2",
    bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38: "sbtc",
  };
  // useEffect(() => {
  //   console.log("gaugeWeightData", gaugeWeightData);
  //   let totalWeight = gaugeWeightData[0]?.total_weight;
  //   //let totalWeight = 200000000000;
  //   //let gaugeWeight = gaugeWeightData[0]?.gaugeWeights;
  //   //let gaugeWeight = 100000000000;
  //   //console.log("gaugeWeight",gaugeWeight);
  //   console.log(
  //     "gaugesNames",
  //     gaugesNames[
  //       "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
  //     ]
  //   );
  //   //let future_weights = gaugeWeight?.map((v, i) => ({ id: gaugesNames["bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"], name: gaugesNames["3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735"], y: +v.weight * 1e18 * 100 / totalWeight}))
  //   // let future_weights = {
  //   //   id: gaugesNames[
  //   //     "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
  //   //   ],
  //   //   name: gaugesNames[
  //   //     "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
  //   //   ],
  //   //   y:
  //   //     (+gaugeWeightData[0]?.gaugeWeights[0]?.weight * 1e9 * 100) /
  //   //     totalWeight,
  //   // };
  //   // console.log("future_weights:", future_weights);
  //   // setFutureWeight(future_weights);

  //   console.log("totalWeight", totalWeight);

  //   let totalveCRVvote = gaugeWeightData
  //     ?.filter((v, i, a) => a.findIndex((t) => t.user === v.user) === i)
  //     .reduce((a, b) => +a + +b.veCRV, 0);
  //   console.log("totalveCRVvote", totalveCRVvote);

  //   const totalveCRVvoteFormat = () => {
  //     return helpers.formatNumber(totalveCRVvote / 1e9);
  //   };
  //   console.log("totalveCRVvoteFormat:...", totalveCRVvoteFormat());
  //   setVotedThisWeek(totalveCRVvoteFormat());

  //   // let changePagination=()=> {
  //   //   let perPage= 10;
  //   //   let filteredVotes = gaugeWeightData?.slice(page*perPage, page*perPage + perPage)
  //   //   console.log("filteredVotes for table:",filteredVotes);
  //   //   setFilteredVotes(filteredVotes);
  //   // }
  //   // changePagination();
  // }, [gaugeWeight, gaugeWeightData]);

  //GETTING DATA FOR GRAPH
  useEffect(() => {
    let totalWeight;
    let gaugeWeights = [];
    const fetchData = async () => {
      //GETTING TOTAL WEIGHT
      await axios
        .post(
          `/gaugeController/getTotalWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`
        )
        .then((response) => {
          console.log("Response from getting total weight: ", response);
          totalWeight = parseFloat(response.data.totalWeight);
        })
        .catch((error) => {
          console.log("Error: ", error);
        });

      //GETTING GAUGE WEIGHT
      Object.keys(gaugesNames).map(async (gauge) => [
        GAUGE_CONTROLLER_CONTRACT_HASH,
        await axios
          .post(
            `/gaugeController/getGaugeWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`,
            { address: `${gauge}` }
          )
          .then((response) => {
            console.log("Response from get Gauge Weight: ", response);
            gaugeWeights.push(response.data.gaugeWeight);
          })
          .catch((error) => {
            console.log("Error from get gauge weight: ", error);
          }),
      ]);

      let futureWeightTemp = Object.keys(gaugesNames).map((gauge, i) => ({
        id: gaugesNames[gauge],
        name: gaugesNames[gauge],
        y: gaugeWeights[i] ? (gaugeWeights[i] * 10e9 * 100) / totalWeight : 0,
      }));
      console.log("GaugeWeights: ", gaugeWeights);

      console.log("Future weights: ", futureWeightTemp);
      setFutureWeight(futureWeightTemp);

      setNextTime(((Date.now() / 1000 + WEEK) / WEEK) * WEEK);

      //SETTING DATA FOR TABLE
      getCRVAPY();
      // for (let pool of Object.keys(currentCRVAPYs)) {
      //   let change = futureWeights[pool] / currentWeights[pool];
      //   if (!isFinite(change)) change = 0;
      //   // Vue.set(futureCRVAPYs, pool, currentCRVAPYs[pool] * change);
      //   let tempFutureCRV = futureCRVAPYs;
      //   tempFutureCRV[pool] = currentCRVAPYs[pool] * change;
      //   setFutureCRVAPYs(tempFutureCRV);
      //   statsStore.state.currentCRVAPYs[
      //     Object.values(poolInfo).find((v) => v.name == pool).gauge
      //   ] = currentCRVAPYs[pool] * change;
      // }
    };

    fetchData();
    console.log("After getting data from backend");
  }, []);

  const getCRVAPY = async () => {
    //TEMPORARY VALUES TO OVERCOME ERRORS
    let decodedGauges = [
      "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575",
      "0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53",
      "0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1",
      "0x69Fb7c45726cfE2baDeE8317005d3F94bE838840",
      "0x64E3C23bfc40722d3B649844055F1D51c1ac041d",
      "0xB1F2cdeC61db658F091671F5f199635aEF202CAC",
      "0xA90996896660DEcC6E997655E065b23788857849",
      "0x705350c4BcD35c9441419DdD5d2f097d7a55410F",
    ];

    let gaugeController_address = GAUGE_CONTROLLER_CONTRACT_HASH;
    // let gauge_relative_weight = "0x6207d866000000000000000000000000";

    let pools = [
      "compound",
      "usdt",
      "iearn",
      "busd",
      "susdv2",
      "pax",
      "ren",
      "sbtc",
    ];

    let prices = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,curve-dao-token&vs_currencies=usd"
    );
    prices = await prices.json();
    let btcPrice = prices.bitcoin.usd;
    let CRVprice = prices["curve-dao-token"].usd;

    // let weightCalls = decodedGauges.map((gauge) => [
    //   gaugeController_address,
    //   gauge_relative_weight + gauge.slice(2),
    // ]);

    // let aggCallsWeights = await contract.multicall.methods
    //   .aggregate(weightCalls)
    //   .call();
    // let decodedWeights = aggCallsWeights[1].map((hex, i) => [
    //   weightCalls[i][0],
    //   web3.eth.abi.decodeParameter("uint256", hex) / 1e18,
    // ]);

    let decodedWeights = [];
    decodedGauges.map(async (gauge) => {
      await axios
        .post(
          `gaugeController/gaugeRelativeWeight/${GAUGE_CONTROLLER_CONTRACT_HASH}`,
          { address: gauge }
        )
        .then((response) => {
          console.log("Response from gauge Relative weight: ", response);
          // return response.data.gaugeRelativeWeights[0];
          decodedWeights.push(response.data.gaugeRelativeWeights[0]);
        })
        .catch((error) => {
          console.log("Error from gauge relative weight: ", error);
        });
    });

    console.log("Decode weights: ", decodedWeights);
    // let ratesCalls = decodedGauges.map((gauge) => [
    //   [gauge, "0x180692d0"], //inflation_rate
    //   [gauge, "0x17e28089"], //working_supply
    // ]);

    // let aggRates = await contract.multicall.methods
    //   .aggregate(ratesCalls.flat())
    //   .call();
    // let decodedRate = aggRates[1].map((hex) =>
    //   web3.eth.abi.decodeParameter("uint256", hex)
    // );

    let decodedRate = [];
    decodedGauges.map(async (gauge) => {
      let inflationRate = await gaugeControllerFunctions.inflation_rate(gauge);
      let workingSupply = await gaugeControllerFunctions.working_supply(gauge);
      console.log("Inflation rate: ", inflationRate);
      console.log("Working supply: ", workingSupply);
      decodedRate.push([inflationRate, workingSupply]);
    });

    console.log("decoded rates: ", decodedRate);
    // let decodedRate = [];


  };

  const handleTableGraph = (vote) => {
    console.log("Vote in handle table graph: ", vote);
    //this.showModal = true

    let total_weight = vote?.total_weight;

    //let future_weights = vote.gaugeWeights?.map((v, i) => ({ id: gaugesNames[v.gauge], name: gaugesNames[v.gauge], y: +v.weight * 1e9 * 100 / total_weight}))
    let future_weights = vote?.gaugeWeights?.map((v, i) => ({
      id: gaugesNames[v.gauge],
      name: gaugesNames[v.gauge],
      y: (+v.weight * 1e9 * 100) / total_weight,
    }));

    console.log("handle graph data:", future_weights);
    setHistoricGaugeWeight(future_weights);
    if (future_weights !== undefined) {
      console.log("future_weights in if :", future_weights);
      handleOpen();
    }
  };

  //let perPage= 10;
  let perPageOptions = [10, 20, 30, 50, 100];
  // let prev=()=> {
  //   if(page == 0) return;
  //   setPage(-1)
  // }

  // let next=()=> {
  //   if(this.page < this.pages)
  //   this.page += 1
  // }
  const getGaugeAddress = (gauge) => {
    return gaugesNames[gauge];
  };

  console.log("filteredVotes for table from state:", filteredVotes);
  // for(let pool of Object.keys(currentCRVAPYs)) {
  //   let change = futureWeight[pool] / this.currentWeights[pool]
  //   if(!isFinite(change)) change = 0
  //   futureCRVAPYs[pool]=currentCRVAPYs[pool] * change
  //   currentCRVAPYs[Object.values(poolInfo).find(v => v.name == pool).gauge] = this.currentCRVAPYs[pool] * change
  // }

  //   Event Handlers
  const handleChangePage = (event, newPage) => {
    //setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    //setPage(0);
  };
  // Content
  const initialValues = {
    SelectGaugeToken: "",
    GaugeVotePower: "",
  };
  const validationSchema = Yup.object().shape({
    SelectGaugeToken: Yup.string().required("Required"),
    GaugeVotePower: Yup.string().required("Required"),
  });
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - gaugeWeightVoteData.length)
      : 0;

  // Handlers
  const handleBoostGaugeChange = (event) => {
    setBoostGauge(event.target.value);
  };

  const handleWeightGaugeChange = (event) => {
    setWeightGauge(event.target.value);
  };

  const handleResetButton = (event) => {
    console.log("Reset button pressed");
  };

  const handleChangeAllocation = () => {
    hideAllocation ? setHideAllocation(false) : setHideAllocation(true);
  };

  const onSubmitGaugeWeightVote = (values, props) => {
    console.log("Gauge Weight Vote: ", values);
  };

  async function voteForGaugeWeightsMakeDeploy(gauge, votingPowerPercentage) {
    if (votingPowerPercentage == 0) {
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
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      const publicKey = CLPublicKey.fromHex(publicKeyHex);
      const paymentAmount = 5000000000;
      const gaugeByteArray = new CLByteArray(
        Uint8Array.from(Buffer.from(gauge, "hex"))
      );
      try {
        const runtimeArgs = RuntimeArgs.fromMap({
          gauge_addr: createRecipientAddress(gaugeByteArray),
          user_weight: CLValueBuilder.u256(votingPowerPercentage),
        });
        let contractHashAsByteArray = Uint8Array.from(
          Buffer.from(GAUGE_CONTROLLER_CONTRACT_HASH, "hex")
        );
        let entryPoint = "vote_for_gauge_weights";
        // Set contract installation deploy (unsigned).
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

  console.log("futureWeight jjjj", futureWeight);

  const getWeight = async () => {
    let t = gaugeControllerFunctions.time_weight(selectedGauge);
    let pt;
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

  const calculateValuesForGraph = async () => {
    let slope;
    await axios
      .post(`/votingEscrow/getlastUserSlope/${VOTING_ESCROW_CONTRACT_HASH}`, {
        address: activePublicKey,
      })
      .then((response) => {
        console.log("Response from getting last user slope: ", response);
        slope = response.data;
      })
      .catch((error) => {
        console.log("Error from getting last user slope", error);
      });

    let oldWeightBias = await getWeight();
    let oldSlopes;
    await axios
      .post(
        `/gaugeController/voteUserSlopes/${GAUGE_CONTROLLER_CONTRACT_HASH}`,
        { owner: activePublicKey, spender: selectedGauge }
      )
      .then((response) => {
        console.log("Response from getting vote user slope: ", response);
        oldSlopes = response.data;
      })
      .catch((error) => {
        console.log("Error from getting vote user slope: ", error);
      });

    let oldDT = 0;
    if (+oldSlopes.end > nextTime) oldDT = +oldSlopes.end - nextTime;
    let old_bias = +oldSlopes.slope * oldDT;
    let new_slope = (slope * voteWeightUsed * 100) / 10000;
    let new_dt = this.lock_end - nextTime; //lock_end will be called from backend as soon as recieved its endpoint
    let new_bias = new_slope * new_dt;

    //NEW WORK ADDED
    let point_bias = Math.max(oldWeightBias + new_bias, old_bias) - old_bias;

    // statsStore.state.calculatedWeights[selectedGauge] = point_bias;

    // this.piechart = this.$refs.piecharts.chart;
    // this.piechart.showLoading();

    // let total_outcome_weight = Object.values(
    //   statsStore.state.calculatedWeights
    // ).reduce((a, b) => +a + +b, 0);

    // let outcome_weights = Object.entries(
    //   statsStore.state.calculatedWeights
    // ).map(([k, v]) => ({
    //   id: k,
    //   name: statsStore.state.gaugesNames[k],
    //   y: (v * 100) / total_outcome_weight,
    // }));

    // this.outcomeWeights = outcome_weights;
    // setOutcomeWeights(outcome_weights);

    // while (this.piechart.series[0])
    //   this.piechart.series[0].remove(false, false);

    // this.piechart.addSeries({
    //   name: "Calculated outcome weights",
    //   data: outcome_weights,
    // });

    // this.piechart.hideLoading();

    // let currentWeight = statsStore.state.gaugesWeights[selectedGauge];
    let calculatedWeight = point_bias;

    // let change =
    //   outcome_weights.find(
    //     (v) => v.id.toLowerCase() == selectedGauge.toLowerCase()
    //   ).y / statsStore.state.pieGaugeWeights[selectedGauge];

    // let old_APY = statsStore.state.currentCRVAPYs[selectedGauge];
    // setOldAPY(old_APY);

    // let new_APY = old_APY * change;
    // setNewAPY(new_APY);

    // this.isCalculating = false;
  };
  function lockExpiresSoon() {
    return lockEnd <= nextTime
  }
  function voteIsOften() {
    return lastUserVote > 0 && lastUserVote + WEIGHT_VOTE_DELAY < Date.now() / 1000
  }
  function balanceFormat() {
    return (balance / 1e9).toFixed(2)
  }
  function isInvalidWeight() {
    return weight <= 0 || weight > 100 || isNaN(weight)
  }
  function weightAllocated() {
    return (weight / 100 * balance / 1e9).toFixed(8)
  }
  function tooMuchPower() {
    if (oldSlope === null) return false
    let _powerUsed = this.powerUsed
    _powerUsed = _powerUsed + weight * 100 - +this.oldSlope.power
    return !(_powerUsed >= 0 || _powerUsed <= 10000)
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
        {/* Main Content */}
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <legend>Gauge Weight Voting</legend>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      {/* Gauge Weight Voting info */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
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
                                {lockExpiresSoon ? (
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

                                {voteIsOften ? (
                                  <div className=" my-2">
                                    <Alert severity="info">
                                      You can vote only once in 10 days
                                    </Alert>
                                  </div>) : (null)}

                                {tooMuchPower ? (
                                  <div className=" my-2">
                                    <Alert severity="info">
                                      You alrady used too much power for this gauge
                                    </Alert>
                                  </div>) : (null)}


                              </div>
                            </div>
                          </div>
                        </Paper>
                      </Box>
                    </div>
                    <div className="row no-gutters justify-content-center mt-4">
                      {/* PRopsed Gauge Weight Changes */}
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
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                  style={{
                                    marginLeft: "20%",
                                    marginRight: "20%",
                                  }}
                                >
                                  <span className="font-weight-bold">
                                    Proposed future gauge weight changes taking
                                    effect on {effectiveDate} UTC
                                  </span>
                                </Typography>
                              </div>
                              <FutureGaugeWeight futureWeight={futureWeight} />
                            </div>
                          </div>
                        </Paper>
                      </Box>
                    </div>
                    <div className="row no-gutters justify-content-center mt-4">
                      {/* Proposed future CRV APYs */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">

                            {/* Select gauge and Vote Weight % */}
                            <Container>
                              <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                              // onSubmit={onSubmitGaugeWeightVote}
                              >
                                <Form>
                                  <div className="row no-gutters justify-content-center">
                                    {/* <div className="col-12 col-md-6">
                                    <SelectInput
                                      name="SelectGaugeToken"
                                      label="Select a Gauge"
                                      options={selectGaugeOptions.map(
                                        (item) => {
                                          // return [item.name, item.icon];
                                          return item.name;
                                        }
                                      )}
                                      onChange={(e) => {
                                        // setGauge("493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a");
                                        console.log("Gauge value");
                                        setGauge(e.target.value);
                                      }}
                                    />
                                    {console.log(
                                      "button at the weight",
                                      gaugeWeightVoteData.map((item) => {
                                        return item.pool;
                                      })
                                    )} */}
                                    {/* <SelectInput
                                      name="SelectGaugeToken"
                                      label="Select a Gauge"
                                      options={selectGaugeOptions}
                                    /> */}
                                    {/* </div> */}
                                    <div className="col-12 col-md-6">
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
                                          // value={weightGauge}
                                          onChange={handleWeightGaugeChange}
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
                                    {myVoteWeightUsed ? (
                                      <div className="col-12 col-md-6 mt-2 mt-md-0">
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
                                      </div>) : (null)}
                                  </div>
                                  {/* Hide allocation button */}
                                  <div className="row no-gutters mt-3">
                                    <div className="col-12">
                                      <div className="btnWrapper">
                                        {/* <Button
                                          variant="contained"
                                          size="large"
                                          style={{
                                            backgroundColor: "#1976d2",
                                            color: "white",
                                          }}
                                          onClick={handleChangeAllocation}
                                        >
                                          {!hideAllocation ? (
                                            <span>Hide my allocation</span>
                                          ) : (
                                            <span>Show my allocation</span>
                                          )}
                                          Hide My Allocation&nbsp;
                                          <span className="ml-4">
                                            <Tooltip title="Your vote allocation from previous votes is remembered. If you want to change it and you have votes allocated to a gauge, you can set its new allocation to 0">
                                              <HelpOutlineIcon />
                                            </Tooltip>
                                          </span>
                                        </Button> */}
                                      </div>
                                    </div>
                                  </div>
                                  {/* Gauge Weight Reset */}
                                  {!hideAllocation ? null : (
                                    // <div className="row no-gutters mt-3">
                                    //   <div className="col-12">
                                    //     <List>
                                    //       <ListItem disablePadding>
                                    //         <ListItemText>
                                    //           <span className="font-weight-bold">
                                    //             Gauge
                                    //           </span>
                                    //         </ListItemText>
                                    //       </ListItem>
                                    //       <ListItem disablePadding>
                                    //         <ListItemText>
                                    //           <span className="font-weight-bold">
                                    //             Weight
                                    //           </span>
                                    //         </ListItemText>
                                    //       </ListItem>
                                    //       <ListItem disablePadding>
                                    //         <ListItemText>
                                    //           <span className="font-weight-bold">
                                    //             Reset
                                    //           </span>
                                    //         </ListItemText>
                                    //       </ListItem>
                                    //     </List>
                                    //   </div>
                                    // </div>
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
                                  {/* Vote Weight */}
                                  <div className="row no-gutters mt-3">
                                    <div className="col-12">
                                      <div className="row no-gutters align-items-center">
                                        <Typography
                                          variant="body1"
                                          component={"div"}
                                        >
                                          Vote Weight:&nbsp;

                                        </Typography>
                                        <Box
                                          component="form"
                                          noValidate
                                          autoComplete="off"
                                        >
                                          <TextInput
                                            id="gaugeVotingPower"
                                            label="Vote Weight Percentage"
                                            variant="filled"
                                            name="GaugeVotePower"
                                            type="number"
                                            value={votingPowerPercentage}
                                            onChange={(e) => {
                                              if (
                                                e.target.value <= 100 &&
                                                e.target.value >= 0
                                              )
                                                setVotingPowerPercentage(
                                                  e.target.value
                                                );
                                            }}
                                          />
                                        </Box>
                                        <Typography
                                          variant="body1"
                                          component={"div"}
                                        >
                                          <span>% (of your voting power)</span>
                                        </Typography>
                                      </div>
                                    </div>
                                    <div className="col-12">
                                      <Typography
                                        variant="body1"
                                        component={"div"}
                                      >
                                        <span>
                                          {votingPowerNumber} (
                                          {votingPowerPercentage}) of your
                                          voting power will be allocated to this
                                          gauge.
                                        </span>
                                      </Typography>
                                    </div>
                                  </div>
                                  {/* Gas Priority Fee */}
                                  {/* <div className="row no-gutters mt-3">
                                  <div className="col-12">
                                    <GasPriorityFee />
                                  </div>
                                </div> */}
                                  {/* Submit Button */}
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
                                            calculateValuesForGraph();
                                            handleShowVoteForGaugeWeightModal();
                                          }}
                                        >
                                          Submit
                                        </Button>
                                        {/* <button type="submit">Submit</button> */}
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
                      {/* Weight Voting history */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Heading */}
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
                            {/* history stats */}
                            <Container>
                              <div className="row no-gutters">
                                <div className="col-12 text-center text-md-left">
                                  <List>
                                    <ListItem disablePadding>
                                      <ListItemText>
                                        <span className="font-weight-bold">
                                          Voted this week:&nbsp;
                                        </span>
                                        {/* <Typography
                                          variant="paragraph"
                                          style={{
                                            display: "inline-block",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Voted this week:&nbsp;
                                        </Typography> */}
                                        {votedThisWeek}&nbsp;veCRV
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText>
                                        <span className="font-weight-bold">
                                          Total veCRV:&nbsp;
                                        </span>
                                        {totalVeCRV}
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText>
                                        <span className="font-weight-bold">
                                          Percentage veCRV supply voted:&nbsp;
                                        </span>
                                        {votedThisWeek && totalVeCRV
                                          ? (
                                            (votedThisWeek * 100) /
                                            totalVeCRV
                                          ).toFixed(2)
                                          : 0}
                                      </ListItemText>
                                    </ListItem>
                                  </List>
                                </div>
                              </div>
                              <div className="row no-gutters justify-content-center mt-2">
                                <div className="col-12 col-md-8">
                                  <div className="row no-gutters w-100">
                                    {/* <div className="col-12 col-md-6 col-lg-7 text-center w-100 px-2">
                                    <div className="btnWrapper">
                                      <Button
                                        onClick={() => {
                                          setShowVotes(true);
                                          console.log("showVotes", showVotes);
                                        }}
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#1976d2",
                                          color: "white",
                                          width: "100%",
                                        }}
                                      >
                                        Show Last Week Votes
                                      </Button>
                                    </div>
                                  </div> */}
                                    <div className="col-12 col-md-12 col-lg-12 text-center w-100 px-2">
                                      <div className="">
                                        {showVotes ? (
                                          <Button
                                            className="hoverButtonGlobal"
                                            onClick={() => {
                                              if (
                                                activePublicKey !== null &&
                                                activePublicKey !== undefined &&
                                                activePublicKey !== "null"
                                              ) {
                                                setShowVotes(false);
                                              } else {
                                                let variant = "error";
                                                enqueueSnackbar(
                                                  "Signer Not Connected",
                                                  { variant }
                                                );
                                              }
                                              console.log(
                                                "showVotes",
                                                showVotes
                                              );
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
                                              setShowVotes(true);
                                              console.log(
                                                "showVotes",
                                                showVotes
                                              );
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
                                      // value={selectedGauge}
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
                            {/* Table */}
                            <div className="row no-gutters mt-3">
                              <div className="col-12">
                                <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                                  <VotingHistoryTable
                                    showVotes={showVotes}
                                    gaugeVoteTime={gaugeVoteTime}
                                    selectedGauge={selectedGauge}
                                    handleTableGraph={handleTableGraph}
                                    gaugeWeightData={gaugeWeightData}
                                    gaugeWeightVoteData={gaugeWeightVoteData}
                                  />

                                  {/* <TableContainer>
                                    <Table
                                      aria-label="Gauge Weight Vote History"
                                      style={{ border: "0.6px solid #e0e0e0" }}
                                    >
                                      <TableHead
                                        sx={{
                                          backgroundColor: "#e7ebf0",
                                          paddingLeft: "0.25rem",
                                        }}
                                      >
                                        <TableRow id="GWVoteHistoryTableSort"> */}
                                  {/* {votingHistoryCells.map((cell) => ( */}
                                  {/* <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Time</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Voter</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>veCRV</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Total veCRV</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Gauge</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Weight</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>
                                              Total Weight
                                            </Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <PieChartIcon />
                                          </TableCell>
                                          {/* ))} */}
                                  {/* </TableRow>
                                      </TableHead>
                                      <TableBody id={"GWVoteHistoryTableBody"}>
                                        {showVotes
                                          ? gaugeVoteTime
                                              ?.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                              )
                                              .filter((value) => {
                                                if (
                                                  selectedGauge !==
                                                    "Select a Gauge" &&
                                                  selectedGauge !== " "
                                                ) {
                                                  if (
                                                    selectedGauge ===
                                                    value.gauge
                                                  ) {
                                                    return value;
                                                  }
                                                } else {
                                                  return value;
                                                }
                                              })
                                              .map((item, key) => {
                                                console.log("In votes by time");
                                                return (
                                                  <TableRow key={key}>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        justifyContent:
                                                          "center",
                                                      }}
                                                    >
                                                      <Tooltip
                                                        title={item.time}
                                                      >
                                                        <Avatar
                                                          sx={{
                                                            height: "20px",
                                                            width: "20px",
                                                          }}
                                                          src={clock}
                                                          aria-label="clock"
                                                        />
                                                      </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.user}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#1976d2",
                                                        }}
                                                        to="/"
                                                        className="tableCellLink font-weight-bold"
                                                      >
                                                        {helpers.shortenAddress(
                                                          item.user
                                                        )}
                                                      </Link>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      {(
                                                        item.veCRV / 1e9
                                                      ).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      {helpers.formatNumber(
                                                        item.totalveCRV / 1e9
                                                      )}
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#1976d2",
                                                        }}
                                                        to="/"
                                                        className="tableCellLink font-weight-bold"
                                                      > */}
                                  {/* {getGaugeAddress(item.gauge)} */}
                                  {/* {helpers.shortenAddress(
                                                          item.gauge
                                                        )}
                                                      </Link>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#1976d2",
                                                        }}
                                                        to="/"
                                                        className="tableCellLink"
                                                      >
                                                        {item.weight / 100}%
                                                      </Link>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                    >
                                                      {(
                                                        item.total_weight / 1e9
                                                      ).toFixed(2)}
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <PieChartIcon
                                                        onClick={() => {
                                                          handleTableGraph(
                                                            item
                                                          );
                                                        }}
                                                        style={{
                                                          color: "#D29300",
                                                        }}
                                                      />
                                                    </TableCell>
                                                  </TableRow>
                                                );
                                              })
                                          : gaugeWeightData.map((item, key) => {
                                              //filteredVotes?.map((item) => {
                                              console.log("this runs!");
                                              return (
                                                <TableRow key={key}>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    <Tooltip title={item.time}>
                                                      <Avatar
                                                        sx={{
                                                          height: "20px",
                                                          width: "20px",
                                                        }}
                                                        src={clock}
                                                        aria-label="clock"
                                                      />
                                                    </Tooltip>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.user}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    <Link
                                                      style={{
                                                        color: "#1976d2",
                                                        border:
                                                          "0.6px solid #e0e0e0",
                                                      }}
                                                      to="/"
                                                      className="tableCellLink font-weight-bold"
                                                    >
                                                      {helpers.shortenAddress(
                                                        item.user
                                                      )}
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{
                                                      textAlign: "center",
                                                      border:
                                                        "0.6px solid #e0e0e0",
                                                    }}
                                                  >
                                                    {(item.veCRV / 1e9).toFixed(
                                                      2
                                                    )}
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{
                                                      textAlign: "center",
                                                      border:
                                                        "0.6px solid #e0e0e0",
                                                    }}
                                                  >
                                                    {helpers.formatNumber(
                                                      item.totalveCRV / 1e9
                                                    )}
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{
                                                      textAlign: "center",
                                                      border:
                                                        "0.6px solid #e0e0e0",
                                                    }}
                                                  >
                                                    <Link
                                                      style={{
                                                        color: "#1976d2",
                                                      }}
                                                      to="/"
                                                      className="tableCellLink font-weight-bold"
                                                    > */}
                                  {/* {getGaugeAddress(item.gauge)} */}
                                  {/* {helpers.shortenAddress(
                                                        item.gauge
                                                      )}
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{
                                                      textAlign: "center",
                                                      border:
                                                        "0.6px solid #e0e0e0",
                                                    }}
                                                  >
                                                    <Link
                                                      style={{
                                                        color: "#1976d2",
                                                      }}
                                                      to="/"
                                                      className="tableCellLink"
                                                    >
                                                      {item.weight / 100}%
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{
                                                      textAlign: "center",
                                                      border:
                                                        "0.6px solid #e0e0e0",
                                                    }}
                                                  >
                                                    {(
                                                      item.total_weight / 1e9
                                                    ).toFixed(2)}
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    <PieChartIcon
                                                      onClick={() => {
                                                        handleTableGraph(item);
                                                      }}
                                                      style={{
                                                        color: "#D29300",
                                                      }}
                                                    />
                                                  </TableCell>
                                                </TableRow>
                                              );
                                            })}
                                      </TableBody>
                                      <TableFooter>
                                        <TableRow>
                                          <TablePagination
                                            rowsPerPageOptions={[
                                              5,
                                              10,
                                              25,
                                              { label: "All", value: -1 },
                                            ]}
                                            colSpan={12}
                                            count={gaugeWeightVoteData.length}
                                            rowsPerPage={rowsPerPage}
                                            page={page}
                                            SelectProps={{
                                              inputProps: {
                                                "aria-label": "rows per page",
                                              },
                                              native: true,
                                            }}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={
                                              handleChangeRowsPerPage
                                            }
                                            ActionsComponent={
                                              TablePaginationActions
                                            }
                                            sx={{
                                              backgroundColor: "#e7ebf0",
                                            }}
                                          />
                                        </TableRow>
                                      </TableFooter>
                                    </Table>
                                  </TableContainer> */}
                                </div>
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
        <WeightVotingHistory
          data={historicGaugeWeight}
          show={open}
          close={handleClose}
          setOpen={setOpen}
        />
        <SigningModal show={openSigning} />
        <VoteForGaugeWeightModal
          show={openVoteForGaugeWeightModal}
          handleClose={handleCloseVoteForGaugeWeightModal}
          // cells={cells} //table headings
          // gaugeWeightVoteData={gaugeWeightVoteData} //table data
          voteForGaugeWeightsMakeDeploy={voteForGaugeWeightsMakeDeploy}
          gauge={gauge}
          votingPowerPercentage={votingPowerPercentage}
          graphData={outcomeWeights}
        />
      </div>
    </>
  );
};

export default GaugeWeightVote;
