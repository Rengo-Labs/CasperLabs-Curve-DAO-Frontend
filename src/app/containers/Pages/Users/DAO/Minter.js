import { gql } from "@apollo/client";
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from "react";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import { default as GaugeAllocationChart, default as GaugeRelativeWeight } from "../../../../components/Charts/GaugeRelativeWeight";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import Gauge from "../../../../components/Gauge/Gauge";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import { getState } from "../../../../components/stores/GaugeStore";
import HomeBanner from "../Home/HomeBanner";

const GAUGES_BY_ADDRESS = gql`
  query getGaugesByAddress($gaugeAddress: String) {
    getGaugesByAddress(gaugeAddress: $gaugeAddress) {
      id
      address
      contractHash
      packageHash
      name
    }
  }
`;

const Minter = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [totalClaimableCRV, setTotalClaimableCRV] = useState(0);
  const [totalMintedCRV, setTotalMintedCRV] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
  const [gaugeAllocationChart, setGaugeAllocationChart] = useState([]);
  const [claimFromGauges, setClaimFromGauges] = useState([]);
  const [gaugesNeedApply, setGaugesNeedApply] = useState([]);
  const [nGauges, setNGauges] = useState(0);
  const [pools, setPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalGaugeBalance, setTotalGaugeBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);



  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };


  console.log("gauge pools", pools);

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
    // get the total gauge balance
    let total = Object.values(myPools).reduce((a, b) => +a + +b.gaugeBalance, 0)
    //distribute the percentages for pie chart for gauge balance against the pool

    let piedata = Object.values(myPools).map(v => ({ name: v.name, y: v.gaugeBalance / total, value: v.gaugeBalance / 1e9 }))
    piedata = piedata.filter(pool => pool.y > 0)

    setGaugeAllocationChart(piedata);

  }, [myPools])

  useEffect(() => {
    //fetch data when user is changed
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined) {
      fetchData();
    }
  }, [activePublicKey])

  const fetchData = async () => {
    setIsLoading(true)
    // this will call the get state method and set all the values got form blockchain and backend after formatting
    await getState(activePublicKey, setNGauges, setTotalBalance, setTotalGaugeBalance, setMyPools, setPools, setBoosts)
    setIsLoading(false)
  }

  // return fomatted value for total Claimable CRV
  function totalClaimableCRVFormat() {
    return (totalClaimableCRV / 1e9).toFixed(2)
  }
  // return fomatted value for total Minted CRV
  function totalMintedCRVFormat() {
    return (totalMintedCRV / 1e9).toFixed(2)
  }
  function showApplyBoostAll() {
    return gaugesNeedApply.length > 0
  }
  // return my gauges in which claimable tokens are greater than 0
  function myGauges() {
    return myPools.filter(pool => +pool.claimableTokens > 0)
  }
  // handle check boxes for claiming claimable tokens
  const handleChangeCheckbox = (event, _gauge) => {
    console.log(
      `Checked value: ${_gauge.gauge} and check is: ${event.target.checked}`
    );
    if (event.target.checked === false) {
      let temp = claimFromGauges.filter((gauge) => gauge !== _gauge.gauge);
      setClaimFromGauges(temp);
    } else {
      setClaimFromGauges([...claimFromGauges, _gauge.gauge]);
    }
    console.log(`Checked dexes array: ${claimFromGauges}`);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          selectedNav={"Minter"}
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
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      {/* Donut */}
                      {myPools.length == 0 ? (null) : (
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
                                    Gauge Allocation
                                  </Typography>
                                </div>
                                <GaugeAllocationChart chart={gaugeAllocationChart} />
                              </div>
                            </div>
                          </Paper>
                        </Box>
                      )}
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
                            <div className="col-12">
                              <VotingPowerDAO />
                              <div className="w-100 my-3">
                                <Divider />
                              </div>
                            </div>
                            <div className="col-12 mt-4">
                              <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
                              <div className="w-100 my-3">
                                {/* <Divider /> */}
                              </div>
                            </div>
                          </div>
                        </Paper>
                      </Box>
                      {totalClaimableCRV > 0 || totalMintedCRV > 0 ? (
                        <Box
                          sx={{
                            width: "100%",
                          }}
                          className="mt-4"
                        >
                          <Paper elevation={4}>
                            <div className="py-5 px-4">
                              <div className="col-12 mt-4">
                                {totalMintedCRV ? (
                                  <div>
                                    Total minted CRV from gauges: {totalMintedCRVFormat}
                                  </div>
                                ) : (null)}
                                {totalClaimableCRV ? (
                                  <div>
                                    All claimable CRV from gauges: {totalClaimableCRVFormat}
                                    <p>
                                      Choose gauges to claim from:
                                      <FormGroup aria-label="position" row>
                                        {myGauges().map((gauge, index) =>

                                          <FormControlLabel
                                            key={index}
                                            value={gauge}
                                            id={'gauge' + gauge.name}
                                            control={<Checkbox onChange={(e) => {
                                              console.log('e.target.value', e.target.value);
                                              console.log('e.target.checked', e.target.checked);
                                              handleChangeCheckbox(e, gauge)
                                            }} />}
                                            label={gauge.name}
                                            labelPlacement="end"

                                          />

                                        )}
                                      </FormGroup>
                                    </p>
                                    <Alert severity="info">Claiming from a gauge will update your boost</Alert>
                                    <div className="col-12 text-center py-3" >
                                      <Grid container spacing={2}>
                                        <Grid item xs={4}>
                                        </Grid>
                                        <Grid item xs={4}>
                                          <Button variant="contained" onClick={""}
                                            disabled={myGauges().length == 0}
                                            fullWidth>
                                            {console.log("claimFromGauges", claimFromGauges)}
                                            {console.log("myGauges", myGauges())}
                                            Claim {claimFromGauges.length == myGauges().length ? 'all' : ''}
                                          </Button>
                                        </Grid>
                                        <Grid item xs={4}>
                                        </Grid>
                                      </Grid>

                                    </div>
                                  </div>
                                ) : (null)}
                              </div>
                            </div>
                          </Paper>
                        </Box>
                      ) : (null)}
                      {!isLoading ? (myPools.map((gauge) => (
                        <Gauge gauge={gauge} fetchData={fetchData} />

                      ))) : (
                        <CircularProgress style={{ margin: '20px', padding: '20px' }} size={100} />
                      )}
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

export default Minter;
