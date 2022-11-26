// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import SelectInput from "../../../../components/FormsUI/SelectInput";
import TextInput from "../../../../components/FormsUI/TextInput";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@material-ui/core";
// ICONS
import cspr from "../../../../assets/img/cspr.png";
import wbtc from "../../../../assets/img/wbtc.png";
import usdt from "../../../../assets/img/usdt.png";
// FORMIK AND YUP
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/AccountHashes/Addresses";
import { balanceOf } from "../../../../components/JsClients/VOTINGESCROW/votingEscrowFunctionsForBackend/functions";
import { CLPublicKey } from "casper-js-sdk";

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
} catch (exception) {
  console.log("an exception has occured!", exception);
}

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
  // always provide gaugeDeposits as a number or convert it into a number
  const [poolLiquidity, setPoolLiquidity] = useState(0);
  const [date, setDate] = useState();
  const [dateDisplay, setDateDisplay] = useState();
  const [gaugeCRV, setGaugeCRV] = useState("0.00");
  const [gaugeVeCRV, setGaugeVeCRV] = useState(false);
  const [gaugeLock, setGaugeLock] = useState(1 + " Year");
  const [lockedVeCRV, setLockedVeCRV] = useState("0.00");
  const [totalVeCRV, setTotalVeCRV] = useState("452142663.71");
  const [crvBoost, setCrvBoost] = useState("1.00");
  const [maxPossibleBoost, setMaxPossibleBoost] = useState();
  const [minVeCRVForBoost, setMinVeCRVForBoost] = useState(2);
  const [depositForBoost, setDepositForBoost] = useState(10);
  const [maxDepositPerVeCRV, setMaxDepositPerVeCRV] = useState();

  //temporary
  const [gauge, setGauge] = useState("");
  const [gaugeBalance, setGaugeBalance] = useState("");

  // Content
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  const initialValues = {
    SelectGaugeCalc: "",
    CalcDeposits: "",
    PoolLiquidityCalc: "",
    MyCRVCalc: "",
    GaugeLockPeriodCalc: "",
    TotalveCRVCalc: "",
  };
  const validationSchema = Yup.object().shape({
    SelectGaugeCalc: Yup.string().required("Required"),
    CalcDeposits: Yup.number().required("Required"),
    PoolLiquidityCalc: Yup.number().required("Required"),
    MyCRVCalc: Yup.number().required("Required"),
    // GaugeLockPeriodCalc: Yup.string().required("Required"),
    TotalveCRVCalc: Yup.number().required("Required"),
  });

  // Handlers
  const handleGaugeChange = (event) => {
    setBoostGauge(event.target.value);
  };

  const handleVeCRVSelect = () => {
    setGaugeVeCRV(true);
  };

  const handleCRVSelect = () => {
    setGaugeVeCRV(false);
  };

  const handleGaugeLockChange = (event) => {
    setGaugeLock(event.target.value);
  };

  useEffect(async () => {
    setGaugeCRV(await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
    setGaugeVeCRV(await balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
  }, [localStorage.getItem("Address")]);

  const updateLiquidityLimit = async (new_l = null, new_voting_balance = null, minveCRV = null) => {
    let l = gaugeBalance * 1e18

    // let calls = [
    //   [this.votingEscrow._address, this.votingEscrow.methods.balanceOf(contract.default_account).encodeABI()],
    //   [this.votingEscrow._address, this.votingEscrow.methods.totalSupply().encodeABI()],
    //   [this.gauge._address, this.gauge.methods.period_timestamp(0).encodeABI()],
    //   [this.gauge._address, this.gauge.methods.working_balances(contract.default_account).encodeABI()],
    //   [this.gauge._address, this.gauge.methods.working_supply().encodeABI()],
    //   [this.gauge._address, this.gauge.methods.totalSupply().encodeABI()],
    // ]
    // let aggcalls = await contract.multicall.methods.aggregate(calls).call()
    let aggcalls = "";
    // let decoded = aggcalls[1].map(hex => web3.eth.abi.decodeParameter('uint256', hex))
    let decoded = "";
    let voting_balance = +decoded[0]
    let voting_total = +decoded[1] - +voting_balance
    let period_timestamp = +decoded[2]
    let working_balances = +decoded[3]
    let working_supply = +decoded[4]
    // let L = +this.poolLiquidity*1e18 + l
    let L = +poolLiquidity*1e18 + l


    if(new_voting_balance) {
      voting_balance = new_voting_balance * 1e18
    }

    voting_total += voting_balance


    let TOKENLESS_PRODUCTION = 40

    let lim = l * TOKENLESS_PRODUCTION / 100
    // let veCRV = this.myveCRV
    let veCRV = gaugeVeCRV;
    if(minveCRV)
      veCRV = minveCRV
    else if(this.entertype == 0)
      // veCRV = this.veCRV
      veCRV = gaugeVeCRV
    lim += L * veCRV / this.totalveCRV * (100 - TOKENLESS_PRODUCTION) / 100

    lim = Math.min(l, lim)
    
    let old_bal = working_balances
    let noboost_lim = TOKENLESS_PRODUCTION * l / 100
    let noboost_supply = working_supply + noboost_lim - old_bal
    let _working_supply = working_supply + lim - old_bal

    // let limCalc = (l * TOKENLESS_PRODUCTION / 100 + (this.poolLiquidity + l) * veCRV / this.totalveCRV * (100 - TOKENLESS_PRODUCTION) / 100)
    // boost = limCalc
    // 		/ (working_supply + limCalc - old_bal)

    return [_working_supply, (lim / _working_supply) / (noboost_lim / noboost_supply)]
  }

  const onSubmitCalc = async (values, props) => {
    console.log("Form data from Select Token", values);

    // IMPLEMENTING SAME AS IN CURVE REPO
    let boost = await updateLiquidityLimit();

  };

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
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
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
                                    <SelectInput
                                      name="SelectGaugeCalc"
                                      label="Select a Gauge"
                                      icon={selectGaugeOptions.map((item) => {
                                        return item.icon;
                                      })}
                                      options={selectGaugeOptions.map(
                                        (item) => {
                                          // return [item.name, item.icon];
                                          return item.name;
                                        }
                                      )}
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
                                        onChange={(e) => {
                                          setGaugeBalance(e.target.value);
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
                                        }}
                                      />
                                    </Box>
                                  </div>
                                  {/* CRV */}
                                  <div className="col-12 col-md-6 mt-3 mt-md-0">
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
                                        value={gaugeCRV}
                                        onChange={(e) => {
                                          setGaugeCRV(e.target.value);
                                        }}
                                      />
                                    </Box>
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
                                  {gaugeVeCRV ? (
                                    <div className="row no-gutters mt-2 w-100">
                                      <div className="col-12">
                                        <div className="row no-gutters justify-content-md-end">
                                          <div className="col-12 col-md-6">
                                            <SelectInput
                                              setDate={setDate}
                                              setDateDisplay={setDateDisplay}
                                              name="GaugeLockPeriodCalc"
                                              label="Select Lock Period"
                                              options={lockTimeOptions.map(
                                                (item) => item.name
                                              )}
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
                                                {lockedVeCRV}&nbsp;
                                              </span>
                                              veCRV
                                            </Typography>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ) : null}
                                </div>
                                {/* Total veCRV */}
                                <div className="row no-gutters mt-3 align-items-center">
                                  <div className="col-12 col-md-6">
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
                                      />
                                    </Box>
                                    <div className="row no-gutters">
                                      <div className="col-12 text-right p-2 py-3">
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
                                {/* Button */}
                                <div className="row no-gutters justify-content-center">
                                  <div className="col-12 col-md-6 text-center my-3">
                                    <div className="btnWrapper">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#5300e8",
                                          color: "white",
                                        }}
                                        type="submit"
                                        onClick={() =>
                                          console.log("Calc Submitted")
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
                            <div className="row no-gutters mt-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Max boost possible:&nbsp;
                                      </span>
                                      {maxPossibleBoost}x
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Min veCRV for max boost:&nbsp;
                                      </span>
                                      {gaugeDeposits > 0 &&
                                      gaugeDeposits !== "" &&
                                      gaugeDeposits !== null
                                        ? minVeCRVForBoost
                                        : "Please enter a deposit amount"}
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <div className="w-100 my-4 pt-4">
                              <Divider />
                            </div>
                            {/* Gauge Selection Info Heading*/}
                            <div className="row no-gutters mt-4">
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
                            <div className="row no-gutters mt-3">
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

export default Calc;
