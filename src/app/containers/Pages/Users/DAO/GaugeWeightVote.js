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
import Tooltip from "@mui/material/Tooltip";
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
import * as helpers from "../../../../assets/js/helpers";

import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import PieChartIcon from "@mui/icons-material/PieChart";
import {
  Alert,
  Avatar,
  Button,
  TableFooter,
  TablePagination,
} from "@mui/material";
import {
  CLByteArray,
  CLPublicKey,
  CLValueBuilder,
  RuntimeArgs,
} from "casper-js-sdk";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import clock from "../../../../assets/img/clock.png";
import cspr from "../../../../assets/img/cspr.png";
import usdt from "../../../../assets/img/usdt.png";
import wbtc from "../../../../assets/img/wbtc.png";
import { GAUGE_CONTROLLER_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import SigningModal from "../../../../components/Modals/SigningModal";
import VoteForGaugeWeightModal from "../../../../components/Modals/VoteForGaugeWeightModal";
import TablePaginationActions from "../../../../components/pagination/TablePaginationActions";
import FutureAPYTable from "../../../../components/Tables/FutureAPYTable";

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

const selectGaugeOptions = [
  {
    name: "CSPR",
    icon: cspr,
  },
  {
    name: "wBTC",
    icon: wbtc,
  },
  {
    name: "USDT",
    icon: usdt,
  },
];

const cells = ["", "Pool", "Current CRV APY", "Future CRV APY"];
const weightCells = ["Gauge", "Weight", "Reset"];
const sampleTableData =
  '[{"indexNo":"0","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"1","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"2","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"3","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"4","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"5","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"6","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"7","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"8","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"9","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"10","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"11","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"12","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"13","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"14","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"15","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"16","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"17","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"18","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"19","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"20","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"21","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"22","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"},{"indexNo":"23","pool":"compound (0x7ca5…7575)", "currentCrv": "0.36% to 0.90%", "futureCrv": "0.36% to 0.90%"}]';

var gaugeWeightVoteData = [];
try {
  gaugeWeightVoteData = JSON.parse(sampleTableData);
} catch (expecption) {}

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
  const [votedThisWeek, setVotedThisWeek] = useState("2,770,259.15");
  const [totalVeCRV, setTotalVeCRV] = useState("451,949,979.95");
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
  const [selectedGauge, setSelectedGauge] = "";
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { enqueueSnackbar } = useSnackbar();
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

    this.outcomeWeights = [];
    this.oldAPY = null;
    this.newAPY = null;

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
  useEffect(() => {
    console.log("gaugeWeightData", gaugeWeightData);
    let totalWeight = gaugeWeightData[0]?.total_weight;
    //let totalWeight = 200000000000;
    //let gaugeWeight = gaugeWeightData[0]?.gaugeWeights;
    //let gaugeWeight = 100000000000;
    //console.log("gaugeWeight",gaugeWeight);
    console.log(
      "gaugesNames",
      gaugesNames[
        "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
      ]
    );
    //let future_weights = gaugeWeight?.map((v, i) => ({ id: gaugesNames["bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"], name: gaugesNames["3de805e07efbc2cd9c5d323ab4fe5f2f0c1c5da33aec527d73de34a1fc9d3735"], y: +v.weight * 1e18 * 100 / totalWeight}))
    let future_weights = {
      id: gaugesNames[
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
      ],
      name: gaugesNames[
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
      ],
      y:
        (+gaugeWeightData[0]?.gaugeWeights[0]?.weight * 1e9 * 100) /
        totalWeight,
    };
    console.log("future_weights:", future_weights);
    setFutureWeight(future_weights);

    console.log("totalWeight", totalWeight);

    let totalveCRVvote = gaugeWeightData
      ?.filter((v, i, a) => a.findIndex((t) => t.user === v.user) === i)
      .reduce((a, b) => +a + +b.veCRV, 0);
    console.log("totalveCRVvote", totalveCRVvote);

    const totalveCRVvoteFormat = () => {
      return helpers.formatNumber(totalveCRVvote / 1e9);
    };
    console.log("totalveCRVvoteFormat:...", totalveCRVvoteFormat());
    setVotedThisWeek(totalveCRVvoteFormat());

    // let changePagination=()=> {
    //   let perPage= 10;
    //   let filteredVotes = gaugeWeightData?.slice(page*perPage, page*perPage + perPage)
    //   console.log("filteredVotes for table:",filteredVotes);
    //   setFilteredVotes(filteredVotes);
    // }
    // changePagination();
  }, [gaugeWeight, gaugeWeightData]);

  const handleTableGraph = (vote) => {
    //this.showModal = true

    let total_weight = vote?.total_weight;

    //let future_weights = vote.gaugeWeights?.map((v, i) => ({ id: gaugesNames[v.gauge], name: gaugesNames[v.gauge], y: +v.weight * 1e9 * 100 / total_weight}))
    let future_weights = vote?.gaugeWeights?.map((v, i) => ({
      id: gaugesNames[
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
      ],
      name: gaugesNames[
        "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
      ],
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
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
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
                                        color: "#5300e8",
                                      }}
                                    >
                                      <Link
                                        to="/"
                                        style={{
                                          textDecoration: "none",
                                          color: "#5300e8",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                    ). Gauge weights are used to determine how
                                    much CRV does each pool get
                                  </Alert>
                                </div>
                                {/* <div className="bg-primary text-white p-3 row no-gutters">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    component="div"
                                  >
                                    You can vote for gauge weight with your
                                    veCRV tokens(locked CRV tokens in&nbsp;
                                    <span className="font-weight-bold">
                                      <Link
                                        to={"/locker"}
                                        style={{
                                          color: "white",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                    ). Gauge weights are used to determine how
                                    much CRV does each pool get
                                  </Typography>
                                </div> */}
                                <div className=" my-2">
                                  <Alert severity="info">
                                    Your lock expires soon. You need to lock at
                                    least for a week in&nbsp;
                                    <span
                                      className="font-weight-bold"
                                      style={{
                                        borderBottom: "1px dashed white",
                                        color: "#5300e8",
                                      }}
                                    >
                                      <Link
                                        to="/"
                                        style={{
                                          textDecoration: "none",
                                          color: "#5300e8",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                  </Alert>
                                </div>
                                {/* <div className="bg-primary text-white p-3 row no-gutters my-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    component="div"
                                  >
                                    Your lock expires soon. You need to lock at
                                    least for a week in&nbsp;
                                    <span className="font-weight-bold">
                                      <Link
                                        to={"/locker"}
                                        style={{
                                          color: "white",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                  </Typography>
                                </div> */}
                                <div className=" my-2">
                                  <Alert severity="info">
                                    You need to have CRV locked in&nbsp;
                                    <span
                                      className="font-weight-bold"
                                      style={{
                                        borderBottom: "1px dashed white",
                                        color: "#5300e8",
                                      }}
                                    >
                                      <Link
                                        to="/"
                                        style={{
                                          textDecoration: "none",
                                          color: "#5300e8",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                    &nbsp;in order to vote for gauge weights
                                  </Alert>
                                </div>
                                {/* <div className="bg-primary text-white p-3 row no-gutters my-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    component="div"
                                  >
                                    You need to have CRV locked in&nbsp;
                                    <span className="font-weight-bold">
                                      <Link
                                        to={"/locker"}
                                        style={{
                                          color: "white",
                                          textDecoration: "underline",
                                        }}
                                      >
                                        Locker
                                      </Link>
                                    </span>
                                    &nbsp;in order to vote for gauge weights
                                  </Typography>
                                </div> */}
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
                                  variant="h4"
                                  gutterBottom
                                  component="div"
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
                            <div className="row no-gutters mt-3">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Proposed future CRV APYs taking effect on{" "}
                                    {effectiveDate} UTC
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                              <FutureAPYTable
                                cells={cells}
                                gaugeWeightVoteData={gaugeWeightVoteData}
                              ></FutureAPYTable>
                              {/* <TableContainer sx={{ p: 3 }}>
                                <Table aria-label="Gauge Weight Vote">
                                  <TableHead
                                    sx={{
                                      backgroundColor: "#e7ebf0",
                                      paddingLeft: "0.25rem",
                                    }}
                                  >
                                    <TableRow id="GWVoteTableSort">
                                      {cells.map((cell) => (
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
                                  <TableBody id={"GWVoteTableBody"}>
                                    {(rowsPerPage > 0
                                      ? gaugeWeightVoteData.slice(
                                          page * rowsPerPage,
                                          page * rowsPerPage + rowsPerPage
                                        )
                                      : gaugeWeightVoteData
                                    ).map((item) => {
                                      return (
                                        <TableRow>
                                          <TableCell
                                            key={item.index}
                                            sx={{ textAlign: "center" }}
                                          >
                                            {item.indexNo}
                                          </TableCell>
                                          <TableCell
                                            key={item.index}
                                            sx={{ textAlign: "center" }}
                                          >
                                            <Link
                                              to="/pool/buy-and-sell"
                                              className="tableCellLink"
                                            >
                                              {item.pool}
                                            </Link>
                                          </TableCell>
                                          <TableCell
                                            key={item.index}
                                            sx={{ textAlign: "center" }}
                                          >
                                            <Link
                                              to="/pool/buy-and-sell"
                                              className="tableCellLink"
                                            >
                                              {item.currentCrv}
                                            </Link>
                                          </TableCell>
                                          <TableCell
                                            key={item.index}
                                            sx={{ textAlign: "center" }}
                                          >
                                            <Link
                                              to="/pool/buy-and-sell"
                                              className="tableCellLink"
                                            >
                                              {item.futureCrv}
                                            </Link>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                    {emptyRows > 0 && (
                                      <TableRow
                                        style={{ height: 53 * emptyRows }}
                                      >
                                        <TableCell colSpan={6} />
                                      </TableRow>
                                    )}
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
                            <div className="row no-gutters">
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            {/* Select gauge and Vote Weight % */}

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
                                      sx={{ m: 1, minWidth: 120 }}
                                    >
                                      <InputLabel id="select-gauge-label">
                                        Select a Gauge
                                      </InputLabel>
                                      <Select
                                        labelId="select-gauge-label"
                                        id="gauge-select"
                                        value={weightGauge}
                                        onChange={handleWeightGaugeChange}
                                      >
                                        <MenuItem value="Select a Gauge">
                                          <em>Select a Gauge</em>
                                        </MenuItem>
                                        {/* <MenuItem value={"USDT"}>USDT</MenuItem>
                                        <MenuItem value={"BTC"}>BTC</MenuItem>
                                        <MenuItem value={"CSPR"}>CSPR</MenuItem> */}
                                        {weightGauges.map((gauge, key) => {
                                          return (
                                            <MenuItem key={key}>
                                              {gauge}
                                            </MenuItem>
                                          );
                                        })}
                                      </Select>
                                    </FormControl>
                                  </div>
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
                                          {voteWeightUsed}
                                        </ListItemText>
                                      </ListItem>
                                    </List>
                                  </div>
                                </div>
                                {/* Hide allocation button */}
                                <div className="row no-gutters mt-3">
                                  <div className="col-12">
                                    <div className="btnWrapper">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#5300e8",
                                          color: "white",
                                        }}
                                        onClick={handleChangeAllocation}
                                      >
                                        {!hideAllocation ? (
                                          <span>Hide my allocation</span>
                                        ) : (
                                          <span>Show my allocation</span>
                                        )}
                                        {/* Hide My Allocation&nbsp; */}
                                        <span className="ml-4">
                                          <Tooltip title="Your vote allocation from previous votes is remembered. If you want to change it and you have votes allocated to a gauge, you can set its new allocation to 0">
                                            <HelpOutlineIcon />
                                          </Tooltip>
                                        </span>
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                                {/* Gauge Weight Reset */}
                                {hideAllocation ? null : (
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
                                      sx={{ p: 3, overflow: "hidden" }}
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
                                          {selectedWeightGauge.map((gauge) => {
                                            return (
                                              <TableRow>
                                                <TableCell
                                                  sx={{ textAlign: "center" }}
                                                >
                                                  gauge.name
                                                </TableCell>
                                                <TableCell
                                                  sx={{ textAlign: "center" }}
                                                >
                                                  gauge.weight
                                                </TableCell>
                                                <TableCell
                                                  sx={{ textAlign: "center" }}
                                                >
                                                  <div className="btnWrapper">
                                                    <Button
                                                      variant="contained"
                                                      size="large"
                                                      style={{
                                                        backgroundColor:
                                                          "#5300e8",
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
                                          })}
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
                                      <Typography variant="h6" component={"h6"}>
                                        <span
                                          style={{
                                            fontWeight: "bold",
                                            color: "#000",
                                          }}
                                        >
                                          Vote Weight:&nbsp;
                                        </span>
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
                                        {votingPowerPercentage}) of your voting
                                        power will be allocated to this gauge.
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
                                    <div className="btnWrapper text-center">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#5300e8",
                                          color: "white",
                                        }}
                                        onClick={() => {
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
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Weight Voting History
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* history stats */}
                            <div className="row no-gutters">
                              <div className="col-12 text-center text-md-left">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Voted this week:&nbsp;
                                      </span>
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
                                      {veCRVSupplyVoted}
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
                                          backgroundColor: "#5300e8",
                                          color: "white",
                                          width: "100%",
                                        }}
                                      >
                                        Show Last Week Votes
                                      </Button>
                                    </div>
                                  </div> */}
                                  <div className="col-12 col-md-12 col-lg-12 text-center w-100 px-2">
                                    <div className="btnWrapper">
                                      {showVotes ? (
                                        <Button
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
                                            console.log("showVotes", showVotes);
                                          }}
                                          variant="contained"
                                          size="large"
                                          style={{
                                            backgroundColor: "#5300e8",
                                            color: "white",
                                            width: "100%",
                                          }}
                                        >
                                          Show My Votes
                                        </Button>
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            setShowVotes(true);
                                            console.log("showVotes", showVotes);
                                          }}
                                          variant="contained"
                                          size="large"
                                          style={{
                                            backgroundColor: "#5300e8",
                                            color: "white",
                                            width: "100%",
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
                                    value={boostGauge}
                                    onChange={(event) => {
                                      handleSelectedGauge(event);
                                    }}
                                  >
                                    <MenuItem value="Select a Gauge">
                                      <em>Select a Gauge</em>
                                    </MenuItem>
                                    {Object.keys(gaugesNames).map(
                                      (item, key) => (
                                        <MenuItem key={key} value={item}>
                                          {gaugesNames[item]} {item.slice(0, 6)}{" "}
                                          ... {item.slice(-6)}
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
                            {/* Table */}
                            <div className="row no-gutters mt-3">
                              <div className="col-12">
                                <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                                  <TableContainer sx={{ p: 3 }}>
                                    <Table aria-label="Gauge Weight Vote History">
                                      <TableHead
                                        sx={{
                                          backgroundColor: "#e7ebf0",
                                          paddingLeft: "0.25rem",
                                        }}
                                      >
                                        <TableRow id="GWVoteHistoryTableSort">
                                          {/* {votingHistoryCells.map((cell) => ( */}
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Time</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Voter</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>veCRV</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Total veCRV</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Gauge</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <Typography>Weight</Typography>
                                          </TableCell>
                                          <TableCell
                                            sx={{
                                              border: 0,
                                              fontWeight: "bold",
                                              fontSize: "1.25rem",
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
                                              fontSize: "1.25rem",
                                              textAlign: "center",
                                            }}
                                          >
                                            <PieChartIcon />
                                          </TableCell>
                                          {/* ))} */}
                                        </TableRow>
                                      </TableHead>
                                      <TableBody id={"GWVoteHistoryTableBody"}>
                                        {showVotes
                                          ? gaugeVoteTime
                                              ?.slice(
                                                page * rowsPerPage,
                                                page * rowsPerPage + rowsPerPage
                                              )
                                              .map((item, key) => {
                                                console.log("In votes by time");
                                                return (
                                                  <TableRow key={key}>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <Tooltip
                                                        title={item.time}
                                                      >
                                                        <Avatar
                                                          src={clock}
                                                          aria-label="clock"
                                                        />
                                                      </Tooltip>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.user}
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#5300E8",
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
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#5300E8",
                                                        }}
                                                        to="/"
                                                        className="tableCellLink font-weight-bold"
                                                      >
                                                        {/* {getGaugeAddress(item.gauge)} */}
                                                        {helpers.shortenAddress(
                                                          item.gauge
                                                        )}
                                                      </Link>
                                                    </TableCell>
                                                    <TableCell
                                                      //key={item.index}
                                                      sx={{
                                                        textAlign: "center",
                                                      }}
                                                    >
                                                      <Link
                                                        style={{
                                                          color: "#5300E8",
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
                                                        color: "#5300E8",
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
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    {(item.veCRV / 1e9).toFixed(
                                                      2
                                                    )}
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    {helpers.formatNumber(
                                                      item.totalveCRV / 1e9
                                                    )}
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    <Link
                                                      style={{
                                                        color: "#5300E8",
                                                      }}
                                                      to="/"
                                                      className="tableCellLink font-weight-bold"
                                                    >
                                                      {/* {getGaugeAddress(item.gauge)} */}
                                                      {helpers.shortenAddress(
                                                        item.gauge
                                                      )}
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
                                                  >
                                                    <Link
                                                      style={{
                                                        color: "#5300E8",
                                                      }}
                                                      to="/"
                                                      className="tableCellLink"
                                                    >
                                                      {item.weight / 100}%
                                                    </Link>
                                                  </TableCell>
                                                  <TableCell
                                                    //key={item.index}
                                                    sx={{ textAlign: "center" }}
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
                                  </TableContainer>
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
          cells={cells}
          gaugeWeightVoteData={gaugeWeightVoteData}
          voteForGaugeWeightsMakeDeploy={voteForGaugeWeightsMakeDeploy}
          gauge={gauge}
          votingPowerPercentage={votingPowerPercentage}
        />
      </div>
    </>
  );
};

export default GaugeWeightVote;
