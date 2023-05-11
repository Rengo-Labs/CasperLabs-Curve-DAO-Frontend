import { gql, useQuery } from "@apollo/client";
import { Autocomplete, Button } from "@mui/material";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
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
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import TextInput from "../../../../components/FormsUI/TextInput";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import * as LiquidityGaugeV3 from "../../../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { balanceOf } from "../../../../components/JsClients/VOTINGESCROW/QueryHelper/functions";
import HomeBanner from "../Home/HomeBanner";

import FormControl from '@mui/material/FormControl';


const year = 365 * 24 * 60 * 60;

const GAUGES_BY_ADDRESS = gql`
query{
  getGaugesByAddress{
    id, address, contractHash, packageHash, name
  }
}
`;

const Calc = () => {
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [boostGauge, setBoostGauge] = useState();
  const [gaugeDeposits, setGaugeDeposits] = useState(0);
  const [gaugeBalance, setGaugeBalance] = useState(0);
  const [poolLiquidity, setPoolLiquidity] = useState(0);
  const [date, setDate] = useState();
  const [dateDisplay, setDateDisplay] = useState();
  const [myCRV, setMyCRV] = useState("0.00");
  const [gaugeVeCRV, setGaugeVeCRV] = useState(false);
  const [myveCRV, setMyveCRV] = useState(0);
  const [gaugeLock, setGaugeLock] = useState("");
  const [gaugeLockValue, setGaugeLockValue] = useState(0);
  const [lockPeriod, setLockPeriod] = useState(year);
  const [lockPeriodName, setLockPeriodName] = useState("");
  // lock periods 
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
  const label = { inputProps: { "aria-label": "Checkbox demo" } };

  // get all gauges
  const gaugesByAddress = useQuery(GAUGES_BY_ADDRESS);
  console.log("this is gaugesByAddress: ", gaugesByAddress.data?.getGaugesByAddress);
  console.log("this is error of gaugesByAddress: ", gaugesByAddress.error);

  useEffect(() => {
    if (gaugesByAddress) {
      console.log("gaugesByAddress.data?.getGaugesByAddress", gaugesByAddress.data?.getGaugesByAddress);
      setGauges(gaugesByAddress.data?.getGaugesByAddress ? gaugesByAddress.data?.getGaugesByAddress : [])

    }
  }, [gaugesByAddress]);

  const initialValues = {
    SelectGaugeCalc: "",
    CalcDeposits: "",
    PoolLiquidityCalc: "",
    GaugeLockPeriodCalc: "",
    TotalveCRVCalc: "",
  };
  const validationSchema = Yup.object().shape({
  });
  const handleGaugeChange = (event) => {
    setBoostGauge(event.target.value);
    if (selectedGauge !== "0000000000000000000000000000000000000000" && selectedGauge !== "" && selectedGauge !== null && selectedGauge !== undefined) {
      updateGaugeBalanceAndPoolLiquidity();
    }
  };

  const handleVeCRVSelect = () => {
    setGaugeVeCRV(true);
  };

  const handleCRVSelect = () => {
    setGaugeVeCRV(false);
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
        // get balance of user in ERC20 CRV as users CRV
        let _myCRV = await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
        console.log("_myCRV", parseFloat(_myCRV));
        setMyCRV(parseFloat(_myCRV) / 1e9);
        let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }
        // get balance of user in voting escrow as users veCRV
        axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of balanceOf:...", response.data.balances);
            setMyveCRV(response.data.balances[0] / 1e9)
          })
          .catch(error => {
            console.log("error of balances:...", error);
          });
        // get total supply in voting escrow 
        axios.post(`/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            console.log("response of totalSupply:...", response.data.totalSupplies);
            setTotalveCRV(response.data.totalSupplies[0] / 1e9)
          })
          .catch(error => {
            console.log("error of totalSupply:...", error);
          });
      }
    }
    updateBalance();
  }, [localStorage.getItem("Address")]);// get the address of user logged in




  const maxBoost = async () => {
    let l = gaugeBalance * 1e9
    let L = poolLiquidity * 1e9 + l
    // get minimum ve CRV
    let _minveCRV = totalveCRV * l / L
    console.log("_minveCRV", _minveCRV);
    setMinveCRV(_minveCRV)
    // get max boots possible 
    let [_, _maxBoostPossible] = await updateLiquidityLimit(null, null, minveCRV);
    setMaxBoostPossible(_maxBoostPossible);
  }

  const updateLiquidityLimit = async (new_l = null, newVotingBalance = null, _minveCRV = null) => {
    // get gauge Balance
    let l = gaugeBalance * 1e9
    let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }

    // get balanceOf voting escrow from backend
    let votingBalance = await axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data);
    // get total supply voting escrow from backend
    let totalSupply = await axios.post(`/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`);
    // subtractcted balance from total supply to get remaining voting total
    let votingTotal = totalSupply.data.totalSupplies[0] - votingBalance.data.balances[0]
    // get period Timestamp of selected gauge from contract 
    let periodTimestamp = parseFloat(await LiquidityGaugeV3.periodTimestamp(selectedGauge, 0));
    // get working balances of selected gauge from contract 
    let workingBalances = parseFloat(await LiquidityGaugeV3.workingBalances(selectedGauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")));
    // get working supply of selected gauge from contract 
    let workingSupply = parseFloat(await LiquidityGaugeV3.workingSupply(selectedGauge));
    // get total supply of selected gauge from contract 
    let totalSupplyGauge = parseFloat(await LiquidityGaugeV3.totalSupplyGauge(selectedGauge));
    let L = poolLiquidity * 1e9 + l
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
    console.log("allVariables", (lim / _workingSupply) / (noboostLim / noboostSupply));

    return [_workingSupply, (lim / _workingSupply) / (noboostLim / noboostSupply)]
  }

  const updateGaugeBalanceAndPoolLiquidity = async () => {
    // get balance of user in selected gauge
    let liqidityGaugeBalance = await LiquidityGaugeV3.balanceOf(selectedGauge, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    console.log("liqidityGaugeBalance", parseFloat(liqidityGaugeBalance));
    // get totel supply in selected gauge
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
    let [_, boost] = await updateLiquidityLimit();
    console.log("boost here", boost);
    setBoost(boost);
  }
  // will return ve CRV
  function veCRV(lock) {
    return ((myCRV * lockPeriod) / (86400 * 365) / 4).toFixed(2)
  }
  // will return CRV to Lock
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
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      <Box sx={{ width: "100%", }} className="mt-4">
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
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
                            <Formik
                              initialValues={initialValues}
                              validationSchema={validationSchema}
                              onSubmit={onSubmitCalc}
                            >
                              <Form>
                                <div className="row no-gutters">
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
                                    />
                                  </div>
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
                                <div className="row no-gutters mt-3">
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
                                          }}
                                        />
                                      </Box>
                                    )}
                                    <div className="col-12">
                                      <FormControl>
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
                                              {veCRV()}&nbsp;
                                            </span>
                                            veCRV
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>

                                  ) : null}
                                </div>
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