//REACT
import React, { useState } from "react";
//CUSTOME STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
//BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
//MATERIAL UI
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import { Avatar } from "@material-ui/core";
import { Link } from "react-router-dom";

//CONTENT
var tokenAvatar =
  "data:image/png;base64,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";

//COMPONENT FUNCTION
const Risks = () => {
  //States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [openAdvOptions, setOpenAdvOptions] = useState(false);
  //Handlers

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Risks"}
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
                <legend>Currencies</legend>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="p-4 p-xl-3">
                            <div className="row no-gutters">
                              {/* Main Heading */}
                              <div className="col-12">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  <span className="d-flex">
                                    <span style={{ marginRight: "10px" }}>
                                      Risks of using
                                    </span>
                                    <Avatar
                                      src={tokenAvatar}
                                      aria-label="curve-token-avatar"
                                    />
                                    <span style={{ marginLeft: "10px" }}>
                                      Curve Finance
                                    </span>
                                  </span>
                                </Typography>
                              </div>
                              <div className="col-12 mb-3 mb-md-4">
                                <Stack sx={{ width: "100%" }} spacing={2}>
                                  <Alert
                                    severity="info"
                                    sx={{ fontSize: "1rem" }}
                                    icon={false}
                                  >
                                    Providing liquidity on Curve doesn't come
                                    without risks. Before making a deposit, it
                                    is best to research and understand the risks
                                    involved.
                                  </Alert>
                                </Stack>
                              </div>
                              {/* Links to PDFs */}
                              <div className="col-12 col-md-auto">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <a
                                        href="https://curve.fi/files/stableswap-paper.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          textDecoration: "none",
                                          color: "#5300E8",
                                        }}
                                      >
                                        Whitepaper
                                      </a>
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <a
                                        href="https://curve.fi/files/crypto-pools-paper.pdf"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          textDecoration: "none",
                                          color: "#5300E8",
                                        }}
                                      >
                                        Crypto Pools Whitepaper
                                      </a>
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Audits */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  Audits
                                </Typography>
                                <div className="row no-gutters mb-md-2 mt-4">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Curve smart contracts were{" "}
                                    <Link to={"/"}>
                                      <span className="text-body font-weight-bold">
                                        Audited
                                      </span>
                                    </Link>{" "}
                                    by Trail of Bits.
                                  </Typography>
                                </div>
                                <div className="row no-gutters mb-md-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    However, security audits don't eliminate
                                    risks completely. Please don’t supply your
                                    life savings, or assets you can’t afford to
                                    lose, to Curve, especially as a liquidity
                                    provider.
                                  </Typography>
                                </div>
                                <div className="row no-gutters mb-md-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Using Curve as an exchange user should be
                                    significantly less risky, but this is not
                                    advice.
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Admin Keys */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  Admin Keys
                                </Typography>
                                <div className="row no-gutters mb-md-2 mt-4">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Curve is fully decentralized with the launch
                                    of Curve DAO. There's an{" "}
                                    <Link to={"/"}>
                                      <span className="text-body font-weight-bold">
                                        Emergency DAO
                                      </span>
                                    </Link>{" "}
                                    which is able to pause the pools during
                                    first 2 months in existence and Curve DAO
                                    can unpause them at any time.
                                  </Typography>
                                </div>
                                <div className="row no-gutters mb-md-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Curve Emergency DAO has 9 members and
                                    59.999% support and 51% quorum Curve
                                    Emergency DAO can act when there's a danger
                                    of loss of funds and call the kill_me
                                    function of Curve Pool contracts which
                                    disables all functionality except for
                                    withdrawals. Curve pools can be reenabled
                                    back by either Emergency DAO or Curve DAO
                                    The Emergency DAO is controlled by Curve DAO
                                    which can add or remove Emergency members
                                  </Typography>
                                </div>
                                <div className="row no-gutters mb-md-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Smart contracts{" "}
                                    <span className="font-weight-bold">
                                      CANNOT
                                    </span>{" "}
                                    be upgraded. This limits actions in a case
                                    of emergency, but leaves users fully in
                                    control of their funds.
                                  </Typography>
                                </div>
                                <div className="row no-gutters mb-md-2">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    Using Curve as an exchange user should be
                                    significantly less risky, but this is not
                                    advice.
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Permanent Loss */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  Permanent loss of a peg
                                </Typography>
                              </div>
                              <div className="row no-gutters mb-md-2 mt-4">
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  color={"#000"}
                                >
                                  If one of the stablecoins in the pool goes
                                  significantly down below the peg of 1.0 and
                                  never returns to the peg, it'll effectively
                                  mean that pool liquidity providers hold almost
                                  all their liquidity in that currency.
                                </Typography>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Staking Risks */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  Staking Risks
                                </Typography>
                                <div className="row no-gutters mb-md-2 mt-4">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    color={"#000"}
                                  >
                                    When staking you use multiple smart contract
                                    products each of which has its own risks
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <div className="w-100 my-4">
                              <Divider />
                            </div>
                            {/* Learn More */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  <a
                                    href="https://resources.curve.fi/lp/understanding-curve-pools"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      textDecoration: "none",
                                      color: "#5300E8",
                                    }}
                                  >
                                    Learn more about each pool's risks
                                  </a>
                                </Typography>
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

export default Risks;
