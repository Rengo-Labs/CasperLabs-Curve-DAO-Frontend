import { CircularProgress } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import React, { useEffect, useState } from "react";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import Gauge from "../../../../components/Gauge/Gauge";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import { getState } from "../../../../components/stores/GaugeStore";
import HomeBanner from "../Home/HomeBanner";
const DaoHome = () => {
  const [, setNGauges] = useState(0);
  const [pools, setPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [, setBoosts] = useState([]);
  const [, setTotalBalance] = useState(0);
  const [, setTotalGaugeBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);

  useEffect(() => {
    //calculate the total gauge relative weight
    let gaugeSum = Object.values(pools).reduce((a, b) => +a + +b.gaugeRelativeWeight, 0)
    //distribute the percentages for pie chart for gauge relative weight against the pool
    let piegauges = Object.values(pools).map(v => ({ name: v.name, y: v.gaugeRelativeWeight / gaugeSum, value: v.gaugeRelativeWeight / 1e9 }))
    if (piegauges.length > 0) {
      let highest = piegauges.map(data => data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
      piegauges[highest].sliced = true;
      piegauges[highest].selected = true;
      setGaugeRelativeWeightChart(piegauges);
    }
  }, [pools])


  useEffect(() => {

    if (activePublicKey && activePublicKey != null && activePublicKey != 'null' && activePublicKey != undefined)
      fetchData();
  }, [activePublicKey])

  const fetchData = async () => {
    setIsLoading(true)
    // this will call the get state method and set all the values got form blockchain and backend after formatting
    await getState(activePublicKey, setNGauges, setTotalBalance, setTotalGaugeBalance, setMyPools, setPools, setBoosts)
    setIsLoading(false)
  }
  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          selectedNav={"Home"}
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
                      {pools.length == 0 ? (null) : (
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
                                <GaugeRelativeWeight chart={gaugeRelativeWeightChart} />
                              </div>
                            </div>
                          </Paper>
                        </Box>
                      )}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                        className="mt-4"
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
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
                            <div className="col-12">
                              <VotingPowerDAO />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            <div className="col-12 mt-4">
                              <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                          </div>
                        </Paper>
                      </Box>
                      {!isLoading ? (myPools.map((gauge) => (
                        <Gauge gauge={gauge} fetchData={fetchData} />
                      ))) : (
                        <div className="row no-gutters justify-content-center">
                          <CircularProgress style={{ margin: '20px', padding: '20px' }} size={100} />
                        </div>
                      )}
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
