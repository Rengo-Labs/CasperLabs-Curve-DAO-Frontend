//REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
//REACT ROUTER
import { Link } from "react-router-dom";
//MATERIAL UI
import { StyledEngineProvider } from "@mui/styled-engine";
import Alert from "@mui/material/Alert";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";

//COMPONENT FUNCTION
const FactoryCreateGauge = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();

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
                  <legend>Deploy a new gauge for a factory pool</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper col-12 col-lg-6 ">
                      <Paper elevation={4}>
                        <div className="py-5 px-4">
                          <Alert
                            severity="warning"
                            sx={{ marginBottom: "2rem" }}
                          >
                            Your pool must exist in the factory, it must not
                            currently have a gauge. Your gauge will not receive
                            CRV until you submit it for a{" "}
                            <span style={{ fontWeight: "bold" }}>
                              <Link
                                style={{ color: "#000" }}
                                to="/factory/create-gauge-vote"
                              >
                                new vote
                              </Link>
                            </span>
                            .
                          </Alert>
                          <section className="createPoolContent createPoolform">
                            <h3>1. Platform</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="platform-radio-buttons-group-label"
                                  defaultValue="platform"
                                  name="platform-radio-group"
                                >
                                  <FormControlLabel
                                    value="casper"
                                    control={<Radio />}
                                    label="Casper"
                                  />
                                  <FormControlLabel
                                    value="fantom"
                                    control={<Radio />}
                                    label="Fantom"
                                  />
                                  <FormControlLabel
                                    value="polygon"
                                    control={<Radio />}
                                    label="Polygon"
                                  />
                                  <FormControlLabel
                                    value="xdai"
                                    control={<Radio />}
                                    label="xDai"
                                  />
                                  <FormControlLabel
                                    value="arbitrum"
                                    control={<Radio />}
                                    label="Arbitrum"
                                  />
                                  <FormControlLabel
                                    value="avalanche"
                                    control={<Radio />}
                                    label="Avalanche"
                                  />
                                  <FormControlLabel
                                    value="optimism"
                                    control={<Radio />}
                                    label="Optimism"
                                  />
                                </RadioGroup>
                              </FormControl>
                            </div>
                          </section>
                          <Divider />
                          <section className="createPoolContent createPoolform mt-3">
                            <h3>2. Pool Type</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <FormControl>
                                <RadioGroup
                                  aria-labelledby="pool-type-radio-buttons-group-label"
                                  defaultValue="pool-type"
                                  name="pool-type-radio-group"
                                >
                                  <FormControlLabel
                                    value="stable pool (pegged assets)"
                                    control={<Radio />}
                                    label="Stable Pool (Pegged Assets)"
                                  />
                                  <p className="assetsTypeDescription">
                                    A pool made of assets which are expected to
                                    always have a rate close to 1:1 (e.g. a pool
                                    made of usd stablecoins)
                                  </p>
                                  <FormControlLabel
                                    value="crypto pool (non-pegged assets)"
                                    control={<Radio />}
                                    label="Crypto Pool (Non-Pegged Assets)"
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
                            <h3>3. Pool Address</h3>
                            <div className="row no-gutters justify-content-between px-0 px-md-3">
                              <div className="col-12">
                                <TextField
                                  id="poolAddress"
                                  label="Pool Address"
                                  variant="filled"
                                  sx={{ width: "100%" }}
                                />
                              </div>
                            </div>
                          </section>
                          <Divider />
                          <div className="btnWrapper row no-gutters justify-content-center mt-3">
                            <button>Deploy Gauge</button>
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
                        </div>
                      </Paper>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </StyledEngineProvider>
      </div>
    </>
  );
};

export default FactoryCreateGauge;
