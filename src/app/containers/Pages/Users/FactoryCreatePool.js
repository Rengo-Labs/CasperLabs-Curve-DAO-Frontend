//REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
import "../../../assets/css/factoryCreatePool.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
//MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";

//CONTENT

//COMPONENT FUNCTION
const FactoryCreatePool = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [poolTokens2, setPoolTokens2] = useState("3pool LP token");

  //   Event Handlers

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Factory"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <StyledEngineProvider injectFirst>
          <div className="container-fluid">
            <div className="curve-container">
              <div className="curve-content-banks">
                <fieldset>
                  <legend>Create Factory Pool</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper col-12 col-lg-6 ">
                      <Paper elevation={4}>
                        <div className="py-5 px-4">
                          <section className="createPoolContent createPoolform">
                            <h3>1. Pool Info</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <div className="col-12 col-md-5">
                                <TextField
                                  id="poolName"
                                  label="Pool Name"
                                  variant="filled"
                                  sx={{ width: "100%" }}
                                />
                                <label for="poolName">
                                  <span>Pool Name</span> (e.g. CRV/CSPR)
                                </label>
                              </div>
                              <div className="col-12 col-md-5">
                                <TextField
                                  id="poolSymbol"
                                  label="Pool Symbol"
                                  variant="filled"
                                  sx={{ width: "100%" }}
                                />
                                <label for="poolSymbol">
                                  <span>Pool Symbol</span> (e.g. CRVCSPR)
                                </label>
                              </div>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>2. Assets Type</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                {/* <FormLabel id="assets-type-radio-buttons-group-label">
                            Gender
                          </FormLabel> */}
                                <RadioGroup
                                  aria-labelledby="assets-type-radio-buttons-group-label"
                                  defaultValue="assets-type"
                                  name="assets-type-radio-group"
                                >
                                  <FormControlLabel
                                    value="pegged assets"
                                    control={<Radio />}
                                    label="Pegged Assets"
                                  />
                                  <p className="assetsTypeDescription">
                                    A pool made of assets which are expected to
                                    always have a rate close to 1:1 (e.g. a pool
                                    made of usd stablecoins)
                                  </p>
                                  <FormControlLabel
                                    value="non-pegged assets"
                                    control={<Radio />}
                                    label="Non-Pegged Assets"
                                  />
                                  <p className="assetsTypeDescription">
                                    A pool made of any token, with no price
                                    stability expectation
                                  </p>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>3. Pool Type</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                {/* <FormLabel id="pool-type-radio-buttons-group-label">
                            Gender
                          </FormLabel> */}
                                <RadioGroup
                                  aria-labelledby="pool-type-radio-buttons-group-label"
                                  defaultValue="pool-type"
                                  name="pool-type-radio-group"
                                >
                                  <FormControlLabel
                                    value="meta-usd"
                                    control={<Radio />}
                                    label="Meta USD"
                                  />
                                  <p className="assetsTypeDescription">
                                    Create a pool that contains DAI, USDC, USDT,
                                    and another usd-pegged token of your choice
                                  </p>
                                  <FormControlLabel
                                    value="meta-btc"
                                    control={<Radio />}
                                    label="Meta BTC"
                                  />
                                  <p className="assetsTypeDescription">
                                    Create a pool that contains renBTC, wBTC,
                                    sBTC, and another btc-pegged token of your
                                    choice
                                  </p>
                                  <FormControlLabel
                                    value="meta-btc-ren"
                                    control={<Radio />}
                                    label="Meta BTC (ren)"
                                  />
                                  <p className="assetsTypeDescription">
                                    Create a pool that contains renBTC, wBTC,
                                    and another btc-pegged token of your choice
                                  </p>
                                  <FormControlLabel
                                    value="plain"
                                    control={<Radio />}
                                    label="Plain"
                                  />
                                  <p className="assetsTypeDescription">
                                    Create a pool that contains between 2 and 4
                                    pegged tokens of your choice; if you want
                                    the pool to contain DAI/USDC/USDT or
                                    renBTC/wBTC/sBTC, it must be a “Meta USD” or
                                    “Meta BTC” pool
                                  </p>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>4. Pool Tokens</h3>
                            <div className="row no-gutters justify-content-between align-items-center px-0 px-md-3">
                              <div className="col-12">
                                <fieldset>
                                  <legend className="mx-auto">Token 1</legend>
                                  <div className="my-4 px-0 px-md-3">
                                    <TextField
                                      id="pooltokensAddress"
                                      label="Token Address"
                                      variant="filled"
                                      sx={{ width: "100%" }}
                                    />
                                    <label>
                                      <span>Token Address</span>
                                    </label>
                                  </div>
                                </fieldset>
                                <fieldset>
                                  <legend className="mx-auto">Token 2</legend>

                                  <div className="my-4 px-0 px-md-3 text-center">
                                    <a
                                      href="#"
                                      style={{
                                        padding: "5px",
                                        fontSize: "1.75rem",
                                        color: "#5300E8",
                                        textDecoration: "none",
                                      }}
                                    >
                                      {poolTokens2}
                                    </a>
                                  </div>
                                </fieldset>
                              </div>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>5. Pool Implementation</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                {/* <FormLabel id="Implementation-radio-buttons-group-label">
                            Gender
                          </FormLabel> */}
                                <RadioGroup
                                  aria-labelledby="Implementation-radio-buttons-group-label"
                                  defaultValue="pool-implementation"
                                  name="implementation-radio-group"
                                >
                                  <FormControlLabel
                                    value="basic"
                                    control={<Radio />}
                                    label="Basic"
                                  />
                                  <p className="assetsTypeDescription">
                                    For pools that supports any major ERC20
                                    return implementation (“return True /
                                    revert”, “return None / revert”, “return
                                    True / return False”), and any number of
                                    decimal places up to 18
                                  </p>
                                  <FormControlLabel
                                    value="balances"
                                    control={<Radio />}
                                    label="Balances"
                                  />
                                  <p className="assetsTypeDescription">
                                    For pools with positive rebase tokens like
                                    aTokens, or where there is a
                                    fee-on-transfer; tokens with negative
                                    rebases must not be used
                                  </p>
                                  <FormControlLabel
                                    value="eth"
                                    control={<Radio />}
                                    label="ETH (only available for pools of type 'plain'"
                                    disabled
                                  />
                                  <p className="assetsTypeDescription">
                                    For pools containing native ETH (represented
                                    as 0xEE…EE)
                                  </p>
                                  <FormControlLabel
                                    value="optimized"
                                    control={<Radio />}
                                    label="Optimized (only available for pools of type 'plain'"
                                    disabled
                                  />
                                  <p className="assetsTypeDescription">
                                    A more gas-efficient implementation that can
                                    be used when every token in the pool has 18
                                    decimals and returns True on success /
                                    reverts on error
                                  </p>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>6. Parameters</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <div className="col-12">
                                <TextField
                                  id="feePercentage"
                                  label="Fee Percentage"
                                  variant="filled"
                                  sx={{ width: "100%" }}
                                />
                              </div>
                              <label>
                                <span>Fee %</span> (min 0.04%, max 1%; half
                                those fees accrue to LPs, and half to Curve
                                veCRV holders)
                              </label>

                              <FormControl>
                                <p
                                  style={{
                                    marginBottom: "0",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    color: "#9c9c9c",
                                    paddingLeft: "2.75rem",
                                    marginTop: "1.5rem",
                                  }}
                                >
                                  A (Amplification Parameter)
                                </p>
                                <RadioGroup
                                  aria-labelledby="amplification-parameter-radio-buttons-group-label"
                                  defaultValue="amplification-parameter"
                                  name="amplification-parameter-radio-group"
                                >
                                  <FormControlLabel
                                    value="10 (uncollateralized algorithmic stablecoins)"
                                    control={<Radio />}
                                    label="10 (uncollateralized algorithmic stablecoins)"
                                  />
                                  <FormControlLabel
                                    value="100 (non-redeemable, collateralized assets)"
                                    control={<Radio />}
                                    label="100 (non-redeemable, collateralized assets)"
                                  />
                                  <FormControlLabel
                                    value="200 (redeemable assets)"
                                    control={<Radio />}
                                    label="200 (redeemable assets)"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <div className="btnWrapper row no-gutters justify-content-center mt-3">
                            <button>Create Pool</button>
                          </div>
                          <hr />
                          <section className="createPoolContent createPoolform">
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                <p
                                  style={{
                                    marginBottom: "0",
                                    fontSize: "0.75rem",
                                    fontWeight: "bold",
                                    color: "#9c9c9c",
                                    paddingLeft: "2.75rem",
                                    marginTop: "1.5rem",
                                  }}
                                >
                                  Gas Priority Fee:
                                </p>
                                <RadioGroup
                                  row
                                  aria-labelledby="gas-fee-radio-buttons-group-label"
                                  defaultValue="gas-fee"
                                  name="gas-fee-radio-group"
                                >
                                  <FormControlLabel
                                    value="standard fee"
                                    control={<Radio />}
                                    label="Standard"
                                  />
                                  <FormControlLabel
                                    value="fast"
                                    control={<Radio />}
                                    label="Fast"
                                  />
                                  <FormControlLabel
                                    value="instant"
                                    control={<Radio />}
                                    label="Instant"
                                  />
                                  <label for="customGas">
                                    <div className="row no-gutters justify-content-center align-items-center">
                                      <div className="col-2 text-center">
                                        <FormControlLabel
                                          value="custom"
                                          control={<Radio />}
                                          label=""
                                        />
                                      </div>
                                      <div className="col-6">
                                        <TextField
                                          id="filled-basic"
                                          label=""
                                          variant="filled"
                                          name="gas-fee-radio-group"
                                        />
                                      </div>
                                      <div className="col-4 pl-2">
                                        <span
                                          style={{
                                            fontSize: "1rem",
                                            color: "#5300E8",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Slow
                                        </span>
                                      </div>
                                    </div>
                                  </label>
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <section className="poolRequirements mt-3">
                            <h5>For this pool to be valid, it must:</h5>
                            <ul>
                              <li>Have a name (max 32 characters</li>
                              <li>Have a symbol (max 10 characters)</li>
                              <li>Have enough tokens</li>
                            </ul>
                          </section>
                        </div>
                      </Paper>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
            <footer style={{ height: "10rem" }}></footer>
          </div>
        </StyledEngineProvider>
      </div>
    </>
  );
};

export default FactoryCreatePool;
