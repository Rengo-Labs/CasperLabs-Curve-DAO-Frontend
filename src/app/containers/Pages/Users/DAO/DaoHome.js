// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import DaoInfoMessage from "../../../../components/DAO/DaoInfoMessage";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// CONTENT

// COMPONENT FUNCTION
const DaoHome = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();

  // Handlers

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Home"}
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
                      {/* Donut */}
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
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                >
                                  Gauge Relative Weight
                                </Typography>
                              </div>
                              <GaugeRelativeWeight />
                            </div>
                          </div>
                        </Paper>
                      </Box>
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
                            <div className="col-12">
                              <Typography
                                variant="h5"
                                gutterBottom
                                component="div"
                                fontWeight={900}
                              >
                                Voting Power in DAO
                              </Typography>
                            </div>
                            {/* Voting Power Stats */}
                            <div className="col-12">
                              <VotingPowerDAO />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            {/* Voting Power Actionables */}
                            <div className="col-12 mt-4">
                              <VotingPowerActionables />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            {/* Info Message */}
                            <div className="col-12 mt-4">
                              <DaoInfoMessage />
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

export default DaoHome;
