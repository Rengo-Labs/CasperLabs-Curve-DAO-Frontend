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
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import DaoVotingPower from "../../../../components/Charts/DaoVotingPower";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";

// CONTENT

// COMPONENT FUNCTION
const Locker = () => {
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
          selectedNav={"Locker"}
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
                                    Voting Power in DAO
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Voting Power Stats */}
                            <div className="row no-gutters">
                              <div className="col-12">
                                <VotingPowerDAO />
                                <div className="w-100 my-3">
                                  <Divider />
                                </div>
                              </div>
                            </div>
                            {/* veCRV Voting Power Chart */}
                            <div className="row no-gutters">
                              <div className="col-12 text-center pt-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Voting Power in DAO
                                  </span>
                                </Typography>
                              </div>
                              {/* Chart */}
                              <div className="row no-gutters justify-content-center w-100">
                                <div className="col-12">
                                  <DaoVotingPower />
                                </div>
                              </div>
                              <div className="col-12">
                                <div className="w-100 my-3">
                                  <Divider />
                                </div>
                              </div>
                            </div>
                            {/* Voting Power Actionables */}
                            <div className="row no-gutters">
                              <div className="col-12 mt-4">
                                <VotingPowerActionables />
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

export default Locker;
