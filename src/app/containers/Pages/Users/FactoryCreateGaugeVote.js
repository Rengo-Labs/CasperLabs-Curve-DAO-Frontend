//REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
import "../../../assets/css/factoryCreateGaugeVote.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
//MATERIAL UI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { StyledEngineProvider } from "@mui/styled-engine";

//COMPONENT FUNCTION
const FactoryCreateGaugeVote = () => {
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
                  <legend>Create Gauge Vote</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper col-12 col-lg-6 ">
                      <section className="createPoolContent createPoolform gaugeVoteSectionWrapper">
                        <h3>Create a Gauge Vote</h3>
                        <div className="gaugeVoteRequirements">
                          <h5>Requirements:</h5>
                          <ol>
                            <li>
                              New gauge votes must have a vote on the governance
                              forum at{" "}
                              <span>
                                <a
                                  href="https://gov.curve.fi/"
                                  target="_blank"
                                  rel="noopener"
                                >
                                  this address
                                </a>
                              </span>
                            </li>
                            <li>
                              You must have a{" "}
                              <span style={{ fontWeight: "bold" }}>
                                minimum of 2,500 veCRV
                              </span>{" "}
                              to create this vote
                            </li>
                          </ol>
                        </div>
                      </section>
                      <section className="createPoolContent createPoolform gaugeVoteSectionWrapper">
                        <div className="row no-gutters justify-content-center align-items-center px-0 px-md-3">
                          <div className="col-12">
                            <form className="my-4 px-0 px-md-3">
                              <label for="gaugeAddress">
                                <h5 style={{ color: "#000" }}>Gauge Address</h5>
                              </label>
                              <input
                                type="text"
                                id="gaugeAddress"
                                name="gauge_address"
                                placeholder="Gauge Address"
                              />
                            </form>
                          </div>
                        </div>
                      </section>
                      <section className="createPoolContent createPoolform gaugeVoteSectionWrapper">
                        <div className="row no-gutters justify-content-center align-items-center px-0 px-md-3">
                          <div className="col-12">
                            <form className="my-4 px-0 px-md-3">
                              <label for="gaugeVoteDescription">
                                <h5 style={{ color: "#000" }}>
                                  Gauge Vote Description
                                </h5>
                              </label>
                              <input
                                type="text"
                                id="gaugeVoteDescription"
                                name="gauge_vote_description"
                                placeholder="What this Gauge is for?"
                              />
                            </form>
                          </div>
                        </div>
                      </section>
                      <div className="btnWrapper row no-gutters justify-content-center">
                        <button>Create Vote</button>
                      </div>
                      <section className="createPoolContent createPoolform">
                        <div className="row no-gutters justify-content-between px-0 px-md-3">
                          <FormControl>
                            {/* <FormLabel id="assets-type-radio-buttons-group-label">
                              Gender
                            </FormLabel> */}
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
                                    <input
                                      type="text"
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

export default FactoryCreateGaugeVote;
