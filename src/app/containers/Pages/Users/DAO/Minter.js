// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import { default as GaugeAllocationChart, default as GaugeRelativeWeight } from "../../../../components/Charts/GaugeRelativeWeight";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// CASPER SDK
import { gql } from "@apollo/client";
import { Alert, Button, Checkbox, CircularProgress, FormControlLabel, FormGroup, Grid } from "@mui/material";
import { default as Axios, default as axios } from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { ERC20_CRV_CONTRACT_HASH, GAUGE_CONTROLLER_CONTRACT_HASH } from '../../../../components/blockchain/Hashes/ContractHashes';
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
import { gauges } from "../../../../components/Charts/ChartHelper/ChartHelpers";
import Gauge from "../../../../components/Gauge/Gauge";
import * as gaugeControllerFunctions from "../../../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as LiquidityGaugeV3 from "../../../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
import { getState } from "../../../../components/stores/GaugeStore";
// import {math} from 'mathjs'
// CONTENT

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


// COMPONENT FUNCTION
const Minter = () => {
  // States
  const { enqueueSnackbar } = useSnackbar();
  const [totalClaimableCRV, setTotalClaimableCRV] = useState(0);
  const [totalMintedCRV, setTotalMintedCRV] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
  const [gaugeAllocationChart, setGaugeAllocationChart] = useState([]);
  // const [myGauges, setMyGauges] = useState([]);
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
    localStorage.getItem("Address")
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

  //Gauge Relative Weight Chart
  //dummy data of gauge_relative_weight

  // const _gauges = useQuery(GAUGES_BY_ADDRESS, {
  //   variables: {
  //     gaugeAddress: "",
  //   },
  // });

  // console.log("Error from gauges by address: ", _gauges.error);
  // console.log("Data from gauges by address: ", _gauges.data?.getGaugesByAddress);

  useEffect(() => {
    let gauge_relative_weight = 1000000000;
    console.log("poolspoolspoolspoolspoolspoolspoolspoolspoolspoolspoolspools", pools);
    let gaugeSum = Object.values(pools).reduce((a, b) => +a + +gauge_relative_weight, 0)
    console.log("gaugeSum...", gaugeSum);
    let piegauges = Object.values(pools).map(v => ({ name: v.name, y: gauge_relative_weight / gaugeSum, value: gauge_relative_weight / 1e9 }))
    console.log("piegauges...", piegauges);
    if (piegauges.length > 0) {
      let highest = piegauges.map(data => data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
      console.log("highest", highest);
      piegauges[highest].sliced = true;
      piegauges[highest].selected = true;
      console.log("piegauges final...", piegauges);
      setGaugeRelativeWeightChart(piegauges);
    }
    // if (!_gauges.error) {
    //   setMyGauges(_gauges.data?.getGaugesByAddress)
    // }

  }, [pools])

  useEffect(() => {

    console.log("mypoolsmypoolsmypoolsmypoolsmypoolsmypoolsmypools", myPools);
    let total = Object.values(myPools).reduce((a, b) => +a + +b.gaugeBalance, 0)
    console.log("total", total);
    let piedata = Object.values(myPools).map(v => ({ name: v.name, y: v.gaugeBalance / total, value: v.gaugeBalance / 1e9 }))
    // let piedata = myPools.map(pool => {
    //   let balance = pool.gaugeBalance
    //   return {
    //     name: pool.name,
    //     y: total == 0 ? 0 : balance / total
    //   }
    // })
    console.log("piedatapiedata", piedata);
    piedata = piedata.filter(pool => pool.y > 0)
    console.log("piedata", piedata);

    setGaugeAllocationChart(piedata);
    // if (!_gauges.error) {
    //   setMyGauges(_gauges.data?.getGaugesByAddress)
    // }

  }, [myPools])

  useEffect(() => {

    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined) {
      fetchData();
    }
  }, [activePublicKey])

  const fetchData = async () => {
    setIsLoading(true)
    await getState(activePublicKey, setNGauges, setTotalBalance, setTotalGaugeBalance, setMyPools, setPools, setBoosts)
    setIsLoading(false)
  }
 



  function totalClaimableCRVFormat() {
    return (totalClaimableCRV / 1e9).toFixed(2)
  }
  function totalMintedCRVFormat() {
    return (totalMintedCRV / 1e9).toFixed(2)
  }
  function showApplyBoostAll() {
    return gaugesNeedApply.length > 0
  }
  function myGauges() {
    return myPools.filter(pool => +pool.claimableTokens > 0)
  }
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
        {/* Main Content */}
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
                              <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
                              <div className="w-100 my-3">
                                {/* <Divider /> */}
                              </div>
                            </div>
                            {/* Info Message */}
                            {/* <div className="col-12 mt-4">
                              <DaoInfoMessage />
                            </div> */}
                          </div>
                        </Paper>
                      </Box>
                      {/* GAUGE */}
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
        {/* <SigningModal show={openSigning} /> */}
      </div >
    </>
  );
};

export default Minter;
