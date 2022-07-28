// REACT
import React, { useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import SelectInput from "../../../../components/FormsUI/SelectInput";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import { Avatar, Button } from "@material-ui/core";
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
import { useSnackbar } from 'notistack';
// MATERIA UI ICONS
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
// ICONS
import clock from "../../../../assets/img/clock.png";
import cspr from "../../../../assets/img/cspr.png";
import usdt from "../../../../assets/img/usdt.png";
import wbtc from "../../../../assets/img/wbtc.png";
// FORMIK AND YUP
import { Alert } from "@material-ui/lab";
import Torus from "@toruslabs/casper-embed";
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { GAUGE_CONTROLLER_CONTRACT_HASH } from "../../../../components/blockchain/AccountHashes/Addresses";
import { getDeploy } from "../../../../components/blockchain/GetDeploy/GetDeploy";
import { makeDeploy } from "../../../../components/blockchain/MakeDeploy/MakeDeploy";
import { NODE_ADDRESS } from "../../../../components/blockchain/NodeAddress/NodeAddress";
import { putdeploy } from "../../../../components/blockchain/PutDeploy/PutDeploy";
import { createRecipientAddress } from "../../../../components/blockchain/RecipientAddress/RecipientAddress";
import { signdeploywithcaspersigner } from "../../../../components/blockchain/SignDeploy/SignDeploy";
import SigningModal from "../../../../components/Modals/SigningModal";
import VoteForGaugeWeightModal from "../../../../components/Modals/VoteForGaugeWeightModal";
import FutureAPYTable from "../../../../components/Tables/FutureAPYTable";

// CONTENT

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

// COMPONENT FUNCTION
const GaugeWeightVote = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [effectiveDate, setEffectiveDate] = useState("26/05/2022");
  const [votedThisWeek, setVotedThisWeek] = useState("2,770,259.15");
  const [totalVeCRV, setTotalVeCRV] = useState("451,949,979.95");
  const [veCRVSupplyVoted, setVeCRVSupplyVoted] = useState("0.61 %");
  const [boostGauge, setBoostGauge] = useState();
  const [voteWeightUsed, setVoteWeightUsed] = useState("0%");
  const [hideAllocation, setHideAllocation] = useState(false);
  const [votingPowerPercentage, setVotingPowerPercentage] = useState(1);
  const [votingPowerNumber, setVotingPowerNumber] = useState("0.00");
  const [gauge, setGauge] = useState("493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a");
  const { enqueueSnackbar } = useSnackbar();
  // States
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  const [openVoteForGaugeWeightModal, setVoteForGaugeWeightModal] = useState(false);
  const handleCloseVoteForGaugeWeightModal = () => {
    setVoteForGaugeWeightModal(false);
  };
  const handleShowVoteForGaugeWeightModal = () => {
    setVoteForGaugeWeightModal(true);
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

  // Handlers
  const handleGaugeChange = (event) => {
    setBoostGauge(event.target.value);
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
      enqueueSnackbar("Voting Power Percentage cannot be Zero", { variant })
      return
    }
    if (gauge == undefined) {
      let variant = "Error";
      enqueueSnackbar("Please select Gauge", { variant })
      return
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
          if (selectedWallet === "Casper") {
            let signedDeploy = await signdeploywithcaspersigner(
              deploy,
              publicKeyHex
            );
            let result = await putdeploy(signedDeploy, enqueueSnackbar);
            console.log("result", result);
          } else {
            // let Torus = new Torus();
            torus = new Torus();
            console.log("torus", torus);
            await torus.init({
              buildEnv: "testing",
              showTorusButton: true,
              network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
            });
            console.log("Torus123", torus);
            console.log("torus", torus.provider);
            const casperService = new CasperServiceByJsonRPC(torus?.provider);
            const deployRes = await casperService.deploy(deploy);
            console.log("deployRes", deployRes.deploy_hash);
            console.log(
              `... Contract installation deployHash: ${deployRes.deploy_hash}`
            );
            let result = await getDeploy(
              NODE_ADDRESS,
              deployRes.deploy_hash,
              enqueueSnackbar
            );
            console.log(
              `... Contract installed successfully.`,
              JSON.parse(JSON.stringify(result))
            );
            console.log("result", result);
          }
          handleCloseSigning();
          let variant = "success";
          enqueueSnackbar("Voted For Gauge Weights Successfully", { variant })


        } catch {
          handleCloseSigning();
          let variant = "Error";
          enqueueSnackbar("Unable to Vote For Gauge Weights", { variant })
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


  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
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
                                      style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                      <Link to="/" style={{ textDecoration: "none", color: "#5300e8" }}>
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
                                      style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                      <Link to="/" style={{ textDecoration: "none", color: "#5300e8" }}>
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
                                      style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                    >
                                      <Link to="/" style={{ textDecoration: "none", color: "#5300e8" }}>
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
                              <GaugeRelativeWeight />
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
                              <FutureAPYTable cells={cells} gaugeWeightVoteData={gaugeWeightVoteData} ></FutureAPYTable>
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
                                    {gaugeWeightVoteData.map((item) => {
                                      return (
                                        <TableRow>
                                          <TableCell
                                            key={item.index}
                                            sx={{ textAlign: "center" }}
                                          >
                                            <Link
                                              to="/pool/buy-and-sell"
                                              className="tableCellLink"
                                            >
                                              {item.indexNo}
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
                                  </TableBody>
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
                              onSubmit={onSubmitGaugeWeightVote}
                            >
                              <Form>
                                <div className="row no-gutters justify-content-center">
                                  <div className="col-12 col-md-6">
                                    <SelectInput
                                      name="SelectGaugeToken"
                                      label="Select a Gauge"
                                      options={selectGaugeOptions}
                                      onChange={() => {
                                        setGauge("493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a");
                                      }}
                                    />
                                    {/* <SelectInput
                                      name="SelectGaugeToken"
                                      label="Select a Gauge"
                                      options={selectGaugeOptions}
                                    /> */}
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
                                      <button onClick={handleChangeAllocation}>
                                        Hide My Allocation&nbsp;
                                        <span className="ml-4">
                                          <Tooltip title="Your vote allocation from previous votes is remembered. If you want to change it and you have votes allocated to a gauge, you can set its new allocation to 0">
                                            <HelpOutlineIcon />
                                          </Tooltip>
                                        </span>
                                      </button>
                                    </div>
                                  </div>
                                </div>
                                {/* Gauge Weight Reset */}
                                {hideAllocation ? null : (
                                  <div className="row no-gutters mt-3">
                                    <div className="col-12">
                                      <List>
                                        <ListItem disablePadding>
                                          <ListItemText>
                                            <span className="font-weight-bold">
                                              Gauge
                                            </span>
                                          </ListItemText>
                                        </ListItem>
                                        <ListItem disablePadding>
                                          <ListItemText>
                                            <span className="font-weight-bold">
                                              Weight
                                            </span>
                                          </ListItemText>
                                        </ListItem>
                                        <ListItem disablePadding>
                                          <ListItemText>
                                            <span className="font-weight-bold">
                                              Reset
                                            </span>
                                          </ListItemText>
                                        </ListItem>
                                      </List>
                                    </div>
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
                                            if (e.target.value <= 100 && e.target.value >= 0)
                                              setVotingPowerPercentage(e.target.value)
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
                                        style={{ backgroundColor: "#5300e8", color: "white" }}
                                        onClick={() => { handleShowVoteForGaugeWeightModal() }}
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
                                  <div className="col-12 col-md-6 col-lg-7 text-center w-100 px-2">
                                    <div className="btnWrapper">
                                      <button className="w-100">
                                        Show Last Week Votes
                                      </button>
                                    </div>
                                  </div>
                                  <div className="col-12 col-md-6 col-lg-5 mt-2 mt-md-0 text-center w-100 px-2">
                                    <div className="btnWrapper">
                                      <button className="w-100">
                                        Show My Votes
                                      </button>
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
                                    onChange={handleGaugeChange}
                                  >
                                    <MenuItem value="Select a Gauge">
                                      <em>Select a Gauge</em>
                                    </MenuItem>
                                    <MenuItem value={"USDT"}>USDT</MenuItem>
                                    <MenuItem value={"BTC"}>BTC</MenuItem>
                                    <MenuItem value={"CSPR"}>CSPR</MenuItem>
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
                                          {votingHistoryCells.map((cell) => (
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
                                      <TableBody id={"GWVoteHistoryTableBody"}>
                                        {votingHistoryData.map((item) => {
                                          console.log("this runs!");
                                          return (
                                            <TableRow>
                                              <TableCell
                                                key={item.index}
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
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                <Link
                                                  to="/"
                                                  className="tableCellLink font-weight-bold"
                                                >
                                                  {item.voter}
                                                </Link>
                                              </TableCell>
                                              <TableCell
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                {item.veCrv}
                                              </TableCell>
                                              <TableCell
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                {item.totalVeCRV}
                                              </TableCell>
                                              <TableCell
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                <Link
                                                  to="/"
                                                  className="tableCellLink font-weight-bold"
                                                >
                                                  {item.gauge}
                                                </Link>
                                              </TableCell>
                                              <TableCell
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                <Link
                                                  to="/"
                                                  className="tableCellLink"
                                                >
                                                  {item.weight}
                                                </Link>
                                              </TableCell>
                                              <TableCell
                                                key={item.index}
                                                sx={{ textAlign: "center" }}
                                              >
                                                {item.totalWeight}
                                              </TableCell>
                                            </TableRow>
                                          );
                                        })}
                                      </TableBody>
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
        <SigningModal show={openSigning} />
        <VoteForGaugeWeightModal show={openVoteForGaugeWeightModal} handleClose={handleCloseVoteForGaugeWeightModal} cells={cells} gaugeWeightVoteData={gaugeWeightVoteData} voteForGaugeWeightsMakeDeploy={voteForGaugeWeightsMakeDeploy} gauge={gauge} votingPowerPercentage={votingPowerPercentage} />

      </div>
    </>
  );
};

export default GaugeWeightVote;
