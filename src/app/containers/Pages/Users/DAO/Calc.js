// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
//GraphQl
import { gql, useQuery } from "@apollo/client";
// COMPONENTS
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import CircularProgress from "@mui/material/CircularProgress";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { Autocomplete, t } from "@mui/material";
import { CLPublicKey } from "casper-js-sdk";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import * as LiquidityGaugeV3 from "../../../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { balanceOf, totalSupply } from "../../../../components/JsClients/VOTINGESCROW/QueryHelper/functions";
import { Button } from "@mui/material";
import axios from "axios";

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// CONTENT
const selectGaugeOptionsJSON =
  '[{"name": "CSPR","icon": "https://cryptologos.cc/logos/casper-cspr-logo.svg?v=023"},{"name": "wBTC","icon": "https://cryptologos.cc/logos/wrapped-bitcoin-wbtc-logo.svg?v=023"},{"name": "USDT","icon": "https://cryptologos.cc/logos/tether-usdt-logo.svg?v=023"}]';

let selectGaugeOptions = [];
try {
  selectGaugeOptions = JSON.parse(selectGaugeOptionsJSON);
} catch (expecption) {
  console.log("an exception has occured!", expecption);
}

console.log(
  "mapping icons in main",
  selectGaugeOptions.map((item) => item.icon)
);

const lockTimeOptionsJSON =
  '[{"name": "1 Week"},{"name": "1 Month"},{"name": "3 Months"},{"name": "6 Months"},{"name": "1 Year"},{"name": "4 Years"}]';
let lockTimeOptions = [];
try {
  lockTimeOptions = JSON.parse(lockTimeOptionsJSON);
  console.log("Lock time options after converting it into json parse.", lockTimeOptions);
} catch (exception) {
  console.log("an exception has occured!", exception);
}

const year = 365 * 24 * 60 * 60;

const GAUGES_BY_ADDRESS = gql`
query{
  getGaugesByAddress{
    id, address, contractHash, packageHash, name
  }
}
`;

// COMPONENT FUNCTION
const Calc = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [boostGauge, setBoostGauge] = useState();
  const [gaugeDeposits, setGaugeDeposits] = useState(0);
  const [gaugeBalance, setGaugeBalance] = useState(0);
  // always provide gaugeDeposits as a number or convert it into a number
  const [poolLiquidity, setPoolLiquidity] = useState(0);
  const [date, setDate] = useState();
  const [dateDisplay, setDateDisplay] = useState();
  const [myCRV, setMyCRV] = useState("0.00");
  const [gaugeVeCRV, setGaugeVeCRV] = useState(false);
  const [myveCRV, setMyveCRV] = useState(0);
  // const [gaugeLock, setGaugeLock] = useState(1 + " Year");
  const [gaugeLock, setGaugeLock] = useState("");
  const [gaugeLockValue, setGaugeLockValue] = useState(0);
  const [lockPeriod, setLockPeriod] = useState(year);
  const [lockPeriodName, setLockPeriodName] = useState("");
  const [lockPeriods, setLockPeriods] = useState(
    [
      {
        name: '4 years',
        time: 4 * year,
      },
      {
        name: '3 years',
        time: 3 * year,
      },
      {
        name: '2 years',
        time: 2 * year,
      },
      {
        name: '1 year',
        time: 1 * year,
      },
      {
        name: '6 months',
        time: year / 2,
      },
      {
        name: '1 month',
        time: year / 12,
      },
      {
        name: '1 week',
        time: year / 52,
      },

    ]
  );
  const [minveCRVperiod, setMinveCRVperiod] = useState(year);
  const [lockedVeCRV, setLockedVeCRV] = useState("0.00");
  const [boost, setBoost] = useState("1.00");
  const [maxBoostPossible, setMaxBoostPossible] = useState(null);
  const [period, setPeriod] = useState("1 Year");
  const [gauges, setGauges] = useState([]);
  const [gauge, setGauge] = useState();
  const [selectedGauge, setSelectedGauge] = useState();
  const [minveCRV, setMinveCRV] = useState(0);
  const [totalveCRV, setTotalveCRV] = useState(0);

  const [calcTrigger, setCalcTrigger] = useState(Date.now())
  // Content
  const label = { inputProps: { "aria-label": "Checkbox demo" } };


  //Queries
  const gaugesByAddress = useQuery(GAUGES_BY_ADDRESS);
  console.log("this is gaugesByAddress: ", gaugesByAddress.data?.getGaugesByAddress);
  console.log("this is error of gaugesByAddress: ", gaugesByAddress.error);

  useEffect(() => {
    // resolveData();
    if (gaugesByAddress) {
      console.log("gaugesByAddress.data?.getGaugesByAddress", gaugesByAddress.data?.getGaugesByAddress);
      setGauges(gaugesByAddress.data?.getGaugesByAddress)

    }

  }, [gaugesByAddress]);

  const initialValues = {
    SelectGaugeCalc: "",
    CalcDeposits: "",
    PoolLiquidityCalc: "",
    // MyCRVCalc: "",
    GaugeLockPeriodCalc: "",
    TotalveCRVCalc: "",
  };
  const validationSchema = Yup.object().shape({
  });

  // Handlers
  const handleGaugeChange = (event) => {
    setBoostGauge(event.target.value);
    if (selectedGauge !== "0000000000000000000000000000000000000000" && selectedGauge !== "" && selectedGauge !== null && selectedGauge !== undefined) {
      updateGaugeBalanceAndPoolLiquidity();
    }
  };

  const handleVeCRVSelect = () => {
    setGaugeVeCRV(true);
    //calling this function because of watchers
    // calcTrigger();
  };

  const handleCRVSelect = () => {
    setGaugeVeCRV(false);
    //calling this function because of watchers
    // calcTrigger();
  };

  const handleGaugeLockChange = (event, newValue) => {
    console.log("Event: ", event.target.value);
    console.log("newValue", newValue.name);
    setLockPeriod(newValue.time)
    setLockPeriodName(newValue.name)
  };
  const handleGaugeLockChangeMinted = (event, newValue) => {
    console.log("Event: ", event.target.value);
    console.log("newValue", newValue.name);
    setPeriod(newValue.name);
    setMinveCRVperiod(newValue.time)
  };


  useEffect(() => {
    async function updateBalance() {
      if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined) {
        let _myCRV = await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        console.log("_myCRV", parseFloat(_myCRV));
        setMyCRV(parseFloat(_myCRV) / 1e9);

        let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of balanceOf:...", response.data.balances);
            setMyveCRV(response.data.balances[0] / 1e9)
          })
          .catch(error => {
            // handle the error
            console.log("error of balances:...", error);
          });

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of totalSupply:...", response.data.totalSupplies);
            setTotalveCRV(response.data.totalSupplies[0] / 1e9)
          })
          .catch(error => {
            // handle the error
            console.log("error of totalSupply:...", error);
          });
      }
    }
    updateBalance();
  }, [localStorage.getItem("Address")]);




  const maxBoost = async () => {
    let l = gaugeBalance * 1e9
    let L = poolLiquidity * 1e9 + l
    let _minveCRV = totalveCRV * l / L
    console.log("_minveCRV", _minveCRV);
    setMinveCRV(_minveCRV)
    let [_, _maxBoostPossible] = await updateLiquidityLimit(null, null, minveCRV);
    setMaxBoostPossible(_maxBoostPossible);
  }

  const updateLiquidityLimit = async (new_l = null, newVotingBalance = null, _minveCRV = null) => {
    let l = gaugeBalance * 1e9


    let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }

    let votingBalance = await axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data);
    let totalSupply = await axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`);
    console.log("totalSupply", totalSupply);
    console.log("votingBalance", votingBalance);
    let votingTotal = totalSupply.data.totalSupplies[0] - votingBalance.data.balances[0]
    let periodTimestamp = parseFloat(await LiquidityGaugeV3.periodTimestamp(selectedGauge, 0));
    let workingBalances = parseFloat(await LiquidityGaugeV3.workingBalances(selectedGauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
    let workingSupply = parseFloat(await LiquidityGaugeV3.workingSupply(selectedGauge));
    let totalSupplyGauge = parseFloat(await LiquidityGaugeV3.totalSupplyGauge(selectedGauge));

    console.log("workingBalance", workingBalances);
    console.log("workingSupply", workingSupply);
    console.log("totalSupplyGauge", totalSupplyGauge);
    let L = poolLiquidity * 1e9 + l
    console.log("L", L);
    console.log("newVotingBalance", newVotingBalance);
    if (newVotingBalance) {
      votingBalance = newVotingBalance * 1e9
    }

    votingTotal += votingBalance.data.balances[0]
    console.log("votingTotal", votingTotal);

    let TOKENLESS_PRODUCTION = 40

    let lim = l * TOKENLESS_PRODUCTION / 100
    console.log("lim", lim);
    let veCRV = myveCRV;
    console.log("veCRV", veCRV);
    if (minveCRV)
      veCRV = minveCRV
    // else if(this.entertype == 0)
    else if (gaugeVeCRV)
      veCRV = myveCRV
    lim += L * veCRV / totalveCRV * (100 - TOKENLESS_PRODUCTION) / 100
    console.log("totalveCRV", totalveCRV);
    console.log("limlim", lim);
    lim = Math.min(l, lim)

    let oldBal = workingBalances
    let noboostLim = TOKENLESS_PRODUCTION * l / 100
    let noboostSupply = workingSupply + noboostLim - oldBal
    let _workingSupply = workingSupply + lim - oldBal

    // let limCalc = (l * TOKENLESS_PRODUCTION / 100 + (this.poolLiquidity + l) * veCRV / this.totalveCRV * (100 - TOKENLESS_PRODUCTION) / 100)
    // boost = limCalc
    // 		/ (working_supply + limCalc - old_bal)
    console.log("allVariables", (lim / _workingSupply) / (noboostLim / noboostSupply));

    return [_workingSupply, (lim / _workingSupply) / (noboostLim / noboostSupply)]
  }

  const updateGaugeBalanceAndPoolLiquidity = async () => {
    // setGaugeDeposits(await balanceOf(boostGauge.address, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
    //  setPoolLiquidity(await totalSupplyGauge(selectedGauge));
    let liqidityGaugeBalance = await LiquidityGaugeV3.balanceOf(selectedGauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    console.log("liqidityGaugeBalance", parseFloat(liqidityGaugeBalance));
    let gaugeTotalSupply = await LiquidityGaugeV3.totalSupplyGauge(selectedGauge)
    console.log("gaugeTotalSupply", parseFloat(gaugeTotalSupply));
    setGauge(selectedGauge)
    setGaugeDeposits(parseFloat(liqidityGaugeBalance) / 1e9);
    setGaugeBalance(parseFloat(liqidityGaugeBalance) / 1e9);
    setPoolLiquidity(parseFloat(gaugeTotalSupply) / 1e9);
    calc();
    maxBoost();
  }

  const onSubmitCalc = async (values, props) => {
    console.log("Form data from Select Token", values);
    calc();
  };

  const calc = async () => {
    // IMPLEMENTING SAME AS IN CURVE REPO
    let [_, boost] = await updateLiquidityLimit();
    console.log("boost here", boost);
    setBoost(boost);
  }

  function veCRV(lock) {
    return ((myCRV * lockPeriod) / (86400 * 365) / 4).toFixed(2)
  }
  function CRVtoLock() {
    console.log("minveCRV", minveCRV);
    console.log("minveCRVperiod", minveCRVperiod);
    console.log("year", year);
    console.log("(minveCRVperiod / year)", (minveCRVperiod / year));
    console.log("minveCRV / ((minveCRVperiod / year) / 4)", minveCRV / ((minveCRVperiod / year) / 4));
    return (minveCRV / ((minveCRVperiod / year) / 4)).toFixed(2)
  }
  useEffect(() => {
    calc();
    maxBoost();
  }, [gaugeBalance, poolLiquidity, myveCRV, totalveCRV, veCRV(), Date.now()])

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Calc"}
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
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      {/* Voting Power */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                        className="mt-4"
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* Heading */}
                            <div className="row no-gutters">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Gauge Boost Calculator
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Formik */}
                            <Formik
                              initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmitCalc}
                            >
                              <Form>
                                {/* Gauge Selector & Deposit */}
                                <div className="row no-gutters">
                                  {/* Gauge Selector */}
                                  <div className="col-12 col-md-6">

                                    <Autocomplete
                                      options={gauges}
                                      getOptionLabel={(option) => { setSelectedGauge(option.contractHash); return option.name }}
                                      clearOnEscape
                                      renderInput={(params) => (
                                        <TextField {...params} label="Select a gauge" variant="standard" />
                                      )}
                                      onChange={(event) => {
                                        handleGaugeChange(event);
                                      }}
                                      value={boostGauge}
                                    // style={{backgroundColor: "grey"}}
                                    />
                                  </div>
                                  {/* Deposit */}
                                  <div className="col-12 col-md-6 mt-3 mt-md-0">
                                    <Box
                                      component="form"
                                      noValidate
                                      autoComplete="off"
                                    >
                                      <TextInput
                                        id="calc-deposits"
                                        label="Deposit:"
                                        variant="filled"
                                        name="CalcDeposits"
                                        value={gaugeBalance}
                                        type="number"
                                        onChange={(e) => {
                                          setGaugeBalance(e.target.value);
                                          //calling this function because of watchers
                                          // calcTrigger();
                                        }}
                                      />
                                    </Box>
                                    <div className="row no-gutters">
                                      <div className="col-12">
                                        <FormGroup>
                                          <FormControlLabel
                                            control={<Checkbox />}
                                            label="Use Existing Deposit"
                                          />
                                        </FormGroup>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Pool Liquidity & CRV */}
                                <div className="row no-gutters mt-3">
                                  {/* Pool Liquidity */}
                                  <div className="col-12 col-md-6">
                                    <Box
                                      component="form"
                                      noValidate
                                      autoComplete="off"
                                    >
                                      <TextInput
                                        id="pool-liquidity"
                                        label="Pool Liquidity:"
                                        variant="filled"
                                        name="PoolLiquidityCalc"
                                        value={poolLiquidity}
                                        onChange={(e) => {
                                          setPoolLiquidity(e.target.value);
                                          //calling this function because of watchers
                                          // calcTrigger();
                                        }}
                                      />
                                    </Box>
                                  </div>
                                  {/* CRV */}
                                  <div className="col-12 col-md-6 mt-3 mt-md-0">
                                    {!gaugeVeCRV ? (
                                      <Box
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                      >
                                        <TextInput
                                          id="my-crv"
                                          label="My CRV:"
                                          variant="filled"
                                          name="MyCRVCalc"
                                          value={myCRV}
                                          onChange={(e) => {
                                            setMyCRV(e.target.value);
                                          }}
                                        />
                                      </Box>
                                    ) : (
                                      <Box
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                      >
                                        <TextInput
                                          id="my-vecrv"
                                          label="My VeCRV:"
                                          variant="filled"
                                          name="myveCRVCalc"
                                          value={myveCRV}
                                          onChange={(e) => {
                                            if (e.target.value >= 0) {
                                              setMyveCRV(e.target.value);
                                            } else {
                                              setMyveCRV(0)
                                            }
                                            //calling this function because of watchers
                                            // calcTrigger();
                                          }}
                                        />
                                      </Box>
                                    )}
                                    <div className="col-12">
                                      <FormControl>
                                        {/* <FormLabel id="gauge-crv-radio">Gender</FormLabel> */}
                                        <RadioGroup
                                          row
                                          aria-labelledby="gauge-crv-radio"
                                          name="crv-vecrv"
                                          defaultValue="crv"
                                        >
                                          <FormControlLabel
                                            value="crv"
                                            control={<Radio />}
                                            label="CRV"
                                            onChange={handleCRVSelect}
                                          />
                                          <FormControlLabel
                                            value="cecrv"
                                            control={<Radio />}
                                            label="veCRV"
                                            onChange={handleVeCRVSelect}
                                          />
                                        </RadioGroup>
                                      </FormControl>
                                    </div>
                                  </div>

                                </div>
                                <div className="row no-gutters mt-2 ">
                                  {/* Total veCRV */}
                                  <div className="col-6 mt-3 align-items-center">
                                    <div className="">
                                      <Box
                                        component="form"
                                        noValidate
                                        autoComplete="off"
                                      >
                                        <TextInput
                                          id="total-vecrv"
                                          label="Total veCRV:"
                                          variant="filled"
                                          name="TotalveCRVCalc"
                                          value={totalveCRV}
                                          onChange={(e) => {
                                            setTotalveCRV(e.target.value);
                                            //calling this function because of watchers
                                            // calcTrigger();
                                          }}
                                        />
                                      </Box>

                                    </div>
                                  </div>
                                  {!gaugeVeCRV ? (
                                    <div className="col-6">
                                      <div className="mt-4">
                                        <div className="">

                                          <Autocomplete
                                            options={lockPeriods}
                                            getOptionLabel={(option) => {
                                              // console.log("Option: ", option);
                                              return option.name
                                            }}
                                            clearOnEscape
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Select Lock Period"
                                                variant="standard"
                                              />
                                            )}
                                            onChange={async (event, newValue) => {
                                              console.log("New Value: ", newValue);
                                              handleGaugeLockChange(event, newValue);
                                            }}
                                          // value={lockPeriodName}
                                          />
                                        </div>
                                      </div>
                                      <div className="row no-gutters justify-content-end">
                                        <div className="col-12 col-md-6 text-right align-self-center p-2 py-3">
                                          <Typography
                                            variant="body1"
                                            component={"div"}
                                          >
                                            <span className="font-weight-bold">
                                              {/* {lockedVeCRV}&nbsp; */}
                                              {veCRV()}&nbsp;
                                            </span>
                                            veCRV
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>

                                  ) : null}
                                </div>

                                {/* Button */}

                                <div className="row no-gutters justify-content-center">

                                  <div className="col-12 col-md-6 text-center my-3">
                                    <div className="">
                                      <Button
                                        className="hoverButtonGlobal"
                                        // variant="contained"
                                        size="large"
                                        // style={{
                                        //   backgroundColor: "#1976d2",
                                        //   color: "white",
                                        // }}
                                        type="submit"
                                        onClick={() => {
                                          calc()
                                          maxBoost()
                                        }
                                        }
                                      >
                                        Calculate
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </Formik>
                            {/* Boost Requirements */}
                            <div className="row no-gutters justify-content-center">
                              <div className="col-12 text-left p-2 py-3">
                                <Typography
                                  variant="body1"
                                  component={"div"}
                                >
                                  {!isNaN(boost) ?
                                    <>
                                      <span className="font-weight-bold">
                                        Boost:&nbsp;
                                      </span>
                                      {boost}x
                                    </>
                                    :
                                    <>Please enter a deposit and veCRV amount</>
                                  }
                                </Typography>
                              </div>
                            </div>
                            <div className="row no-gutters mt-3">
                              <div className="col-12 col-md-6">
                                <List>

                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max boost possible:&nbsp;
                                      </span>
                                      {maxBoostPossible ? maxBoostPossible : 0}x
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Min veCRV for max boost:&nbsp;
                                      </span>
                                      {gaugeBalance > 0 &&
                                        gaugeBalance !== "" &&
                                        gaugeBalance !== null
                                        ? minveCRV ? <>{minveCRV.toFixed(2)}veCRV</> : null
                                        : "Please enter a deposit amount"}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                              {gaugeBalance > 0 ? (
                                <div className="col-12 col-md-6">
                                  This is {CRVtoLock()} CRV for a
                                  <div className="">

                                    <Autocomplete
                                      options={lockPeriods}
                                      getOptionLabel={(option) => {
                                        // console.log("Option: ", option);
                                        return option.name
                                      }}
                                      clearOnEscape
                                      renderInput={(params) => (
                                        <TextField
                                          {...params}
                                          label="Select Lock Period"
                                          variant="standard"
                                        />
                                      )}
                                      onChange={async (event, newValue) => {
                                        console.log("New Value: ", newValue);
                                        handleGaugeLockChangeMinted(event, newValue);
                                      }}
                                    // value={lockPeriodName}
                                    />

                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
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
      </div >
    </>
  );
};

export default Calc;