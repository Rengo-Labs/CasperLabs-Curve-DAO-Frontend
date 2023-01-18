// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import GaugeAllocationChart from "../../../../components/Charts/GaugeRelativeWeight";
import DaoInfoMessage from "../../../../components/DAO/DaoInfoMessage";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
import * as gaugeStore from "../../../../components/stores/GaugeStore";
// MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
// CASPER SDK
import Axios from "axios";
import PoolInfo from "../../../../components/Stats/PoolInfo";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { ERC20_CRV_CONTRACT_HASH, } from '../../../../components/blockchain/Hashes/ContractHashes';
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
import { gauges, pools } from "../../../../components/Charts/ChartHelper/ChartHelpers";
// CONTENT

// COMPONENT FUNCTION
const Minter = () => {
  // States
  const { enqueueSnackbar } = useSnackbar();
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
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



  useEffect(() => {
    let gauge_relative_weight = 100;
    let gaugeSum = Object.values(pools).reduce((a, b) => +a + +gauge_relative_weight, 0)
    console.log("gaugeSum...", gaugeSum);
    let piegauges = Object.values(pools).map(v => ({ name: v.name, y: gauge_relative_weight / gaugeSum }))
    console.log("piegauges...", piegauges);
    let highest = piegauges.map(data => data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
    piegauges[highest].sliced = true;
    piegauges[highest].selected = true;
    console.log("piegauges final...", piegauges);
    setGaugeRelativeWeightChart(piegauges);
  }, [])

  useEffect(() => {

    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, [activePublicKey])


  //Gauge Allocation chart
  // let mypools = Object.keys(decodedBalances).map(v => {
  // 	let poolInfo = Object.values(pools).find(pools => pools.swap_token.toLowerCase() == v.swap_token.toLowerCase())
  // 	return {
  // 		...poolInfo, 
  // 		balance: v.balance,
  // 		origBalance: v.balance,
  // 		//gaugeBalance: gaugeBalances.find(pool => pool.gauge.toLowerCase() == poolInfo.gauge.toLowerCase()).balance
  // 	}
  // })
  // console.log("my pools ", mypools);




  const getAllowance = () => {
    let allowanceParam = {
      contractHash: ERC20_CRV_CONTRACT_HASH,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: VOTING_ESCROW_PACKAGE_HASH
    }
    console.log('allowanceParam0', allowanceParam);
    Axios
      .get(`/allowanceagainstownerandspender/${ERC20_CRV_CONTRACT_HASH}/${CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13)}/${VOTING_ESCROW_PACKAGE_HASH}`)
      .then((res) => {
        console.log('allowanceagainstownerandspender', res)
        console.log(res.data)
        setAllowance(res.data.allowance)

      })
      .catch((error) => {
        setAllowance(0)
        console.log(error)
        console.log(error.response)
      })
  }

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
                                  Gauge Allocation
                                </Typography>
                              </div>
                              <GaugeAllocationChart chart={gaugeRelativeWeightChart} />
                            </div>
                          </div>
                        </Paper>
                      </Box>
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
                              {/* <VotingPowerActionables createLockMakeDeploy={createLockMakeDeploy} withdrawMakeDeploy={withdrawMakeDeploy} increaseUnlockTimeMakeDeploy={increaseUnlockTimeMakeDeploy} increaseAmountMakeDeploy={increaseAmountMakeDeploy} allowance={allowance} userLockedCRVBalance={userLockedCRVBalance} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} /> */}
                              <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
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
                      {/* GAUGE */}
                      {gauges.map((gauge) => (
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
                                  {gauge.name}
                                  {/* CRV APY: "Some value" */}
                                </Typography>
                              </div>
                              {/* Pool Info */}
                              <div className="col-12">
                                {/* <PoolInfo /> */}
                                <div className="w-100 my-3">
                                  <Divider />
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </Box>
                      ))}
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        {/* <SigningModal show={openSigning} /> */}
      </div>
    </>
  );
};

export default Minter;
