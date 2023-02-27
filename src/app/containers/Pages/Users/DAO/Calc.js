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
import FormControl from "@mui/material/FormControl";
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
import { Autocomplete } from "@mui/material";
import { CLPublicKey } from "casper-js-sdk";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import * as LiquidityGaugeV3 from "../../../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { balanceOf, totalSupply } from "../../../../components/JsClients/VOTINGESCROW/QueryHelper/functions";
import { Button } from "@mui/material";
import axios from "axios";

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
  const [myVeCRV, setMyVeCRV] = useState(0);
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
  const [totalVeCRV, setTotalVeCRV] = useState(0);
  const [crvBoost, setCrvBoost] = useState("1.00");
  const [boost, setBoost] = useState("1.00");
  const [maxBoostPossible, setMaxBoostPossible] = useState(0);
  const [minVeCRVForBoost, setMinVeCRVForBoost] = useState(2);
  const [depositForBoost, setDepositForBoost] = useState(10);
  const [maxDepositPerVeCRV, setMaxDepositPerVeCRV] = useState();
  const [period, setPeriod] = useState(1 + "Year");
  const [toLockCRV, setToLockCRV] = useState(0);
  const [gauges, setGauges] = useState([]);
  const [gauge, setGauge] = useState();
  const [selectedGauge, setSelectedGauge] = useState();
  const [minveCRV, setMinveCRV] = useState(null);
  const [totalveCRV, setTotalveCRV] = useState(0);

  const [calcTrigger, setCalcTrigger] = useState(Date.now())
  // Content
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  let gaugesNames = [
    { address: "0x7ca5b0a2910B33e9759DC7dDB0413949071D7575", name: "compound" },
    { address: "0xBC89cd85491d81C6AD2954E6d0362Ee29fCa8F53", name: 'usdt' },
    { address: "0xFA712EE4788C042e2B7BB55E6cb8ec569C4530c1", name: 'y' },
    { address: "0x69Fb7c45726cfE2baDeE8317005d3F94bE838840", name: 'busd' },
    { address: "0x64E3C23bfc40722d3B649844055F1D51c1ac041d", name: 'pax' },
    { address: "0xB1F2cdeC61db658F091671F5f199635aEF202CAC", name: 'ren' },
    { address: "0xA90996896660DEcC6E997655E065b23788857849", name: 'susdv2' },
    { address: "0x705350c4BcD35c9441419DdD5d2f097d7a55410F", name: 'sbtc' }
  ]

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
    // SelectGaugeCalc: Yup.string().required("Required"),
    // CalcDeposits: Yup.number().required("Required"),
    // PoolLiquidityCalc: Yup.number().required("Required"),
    // MyCRVCalc: Yup.number().required("Required"),
    // GaugeLockPeriodCalc: Yup.string().required("Required"),
    // TotalveCRVCalc: Yup.number().required("Required"),
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
    // setGaugeLock(newValue);
    // let val = +newValue.name.split(" ")[0];
    // console.log("Value: ", val);
    // if (val > 1) {
    //   setGaugeLockValue(val * year);
    // }
    // else {
    //   setGaugeLockValue(val / year);
    // }
  };

  useEffect(() => {
    async function updateBalance() {
      if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined) {
        let myCRV = await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        console.log("myCRV", parseFloat(myCRV));
        setMyCRV(parseFloat(myCRV) / 1e9);

        let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of balanceOf:...", response.data.balances);
            setMyVeCRV(response.data.balances[0] / 1e9)
          })
          .catch(error => {
            // handle the error
            console.log("error of balances:...", error);
          });

        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("response of totalSupply:...", response.data.totalSupplies);
            setTotalVeCRV(response.data.totalSupplies[0] / 1e9)
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

  // useEffect(() => {
  //   calculate();
  //   maxBoost();
  // }, [gaugeBalance, poolLiquidity, myVeCRV, totalVeCRV, gaugeVeCRV, Date.now() ])

  useEffect(() => {
    setLockedVeCRV(((myCRV * gaugeLockValue) / (86400 * 365) / 4).toFixed(2));
  }, [myCRV, gaugeLockValue]);

  const updateLockedVeCRV = async () => {
    // setLockedVeCRV((this.myCRV * this.lockPeriod) / (86400 * 365) / 4).toFixed(2);
    console.log("In update function: ");
    console.log("Gauge lock value: ", gaugeLockValue);
    console.log("Gauge crv: ", myCRV);
    setLockedVeCRV(((myCRV * gaugeLockValue) / (86400 * 365) / 4));
    //calling this function because of watchers
    // calcTrigger();
  }


  const maxBoost = async () => {
    let l = gaugeBalance * 1e9
    let L = poolLiquidity * 1e9 + l
    let _minveCRV = totalveCRV * l / L
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
    let veCRV = myVeCRV;
    console.log("veCRV", veCRV);
    if (minveCRV)
      veCRV = minveCRV
    // else if(this.entertype == 0)
    else if (gaugeVeCRV)
      veCRV = myVeCRV
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
    //  console.log("gaugeTotalSupply",gaugeTotalSupply);
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

  // const calcTrigger = async () => {
  //   await calc();
  //   await maxBoost();
  // }

  const CRVtoLock = () => {
    let year = 365 * 24 * 60 * 60
    // return (this.minveCRV / ((this.minveCRVperiod / year) / 4)).toFixed(2)
    setToLockCRV((minVeCRVForBoost / ((period / year) / 4)).toFixed(2));
  }
  function veCRV(lock) {
    return ((myCRV * lockPeriod) / (86400 * 365) / 4).toFixed(2)
  }
  // console.log("selectedGauge",selectedGauge);
  useEffect(() => {
    calc();
    maxBoost();
  }, [calcTrigger]);

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
                                        value={gaugeDeposits}
                                        type="number"
                                        onChange={(e) => {
                                          console.log("Gauge deposit: ", typeof (+e.target.value));
                                          console.log("Gauge deposit: ", e.target.value);
                                          setGaugeDeposits(e.target.value);
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
                                            // veCRV();
                                            updateLockedVeCRV();
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
                                          name="MyVeCRVCalc"
                                          value={myVeCRV}
                                          onChange={(e) => {
                                            if (e.target.value >= 0) {
                                              setMyVeCRV(e.target.value);
                                            } else {
                                              setMyVeCRV(0)
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
                                          value={totalVeCRV}
                                          onChange={(e) => {
                                            setTotalVeCRV(e.target.value);
                                            //calling this function because of watchers
                                            // calcTrigger();
                                          }}
                                        />
                                      </Box>
                                      <div className="row no-gutters">
                                        <div className="col-12 col-lg-6 text-left p-2 py-3">
                                          <Typography
                                            variant="body1"
                                            component={"div"}
                                          >
                                            <span className="font-weight-bold">
                                              Boost:&nbsp;
                                            </span>
                                            {crvBoost}x
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  {!gaugeVeCRV ? (
                                    <div className="col-6">
                                      <div className="mt-4">
                                        <div className="">
                                          {/* <SelectInput
                                              setDate={setDate}
                                              setDateDisplay={setDateDisplay}
                                              name="GaugeLockPeriodCalc"
                                              label="Select Lock Period"
                                              options={lockTimeOptions.map(
                                                (item) => item.name
                                              )}
                                              value={gaugeLock}
                                              onChange={(e) => {
                                                handleGaugeLockChange(e);
                                                // veCRV();
                                                updateLockedVeCRV();
                                              }}
                                            /> */}
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
                                    <div className="btnWrapper">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#1976d2",
                                          color: "white",
                                        }}
                                        type="submit"
                                        onClick={
                                          calc
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
                                  This is {toLockCRV} CRV for a
                                  <div className="">

                                    <Autocomplete
                                      options={lockPeriods}
                                      getOptionLabel={(option) => option.name}
                                      clearOnEscape
                                      renderInput={(params) => (
                                        <TextField {...params} label="Select Lock Period" variant="standard" />
                                      )}
                                      onChange={(event, newValue) => {
                                        setPeriod(newValue);
                                        CRVtoLock();
                                      }}
                                      value={period.name}
                                    // style={{backgroundColor: "grey"}}
                                    />
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
                            </div>
                            {/* Gauge Selection Info Heading*/}
                            {/* <div className="row no-gutters mt-4">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Gauge Selection Info
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Gauge Selection Info */}
                            {/* <div className="row no-gutters mt-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max deposite to have boost:&nbsp;
                                      </span>
                                      {depositForBoost ? (
                                        depositForBoost
                                      ) : (
                                        <CircularProgress size={20} />
                                      )}
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max deposit per veCRV to have max
                                        boost:&nbsp;
                                      </span>
                                      {maxDepositPerVeCRV ? (
                                        maxDepositPerVeCRV
                                      ) : (
                                        <CircularProgress size={20} />
                                      )}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div> */}
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

export default Calc;