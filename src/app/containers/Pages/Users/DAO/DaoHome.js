// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import { ERC20_CRV_CONTRACT_HASH, } from '../../../../components/blockchain/Hashes/ContractHashes';
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
import DaoInfoMessage from "../../../../components/DAO/DaoInfoMessage";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
import { pools } from "../../../../components/Charts/ChartHelper/ChartHelpers";
import { getState } from "../../../../components/stores/GaugeStore";
import Gauge from "../../../../components/Gauge/Gauge";
import { CircularProgress } from "@mui/material";

// CONTENT

// COMPONENT FUNCTION
const DaoHome = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [nGauges, setNGauges] = useState(0);
  const [pools, setPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalGaugeBalance, setTotalGaugeBalance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);

  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

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
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, [activePublicKey])

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
        {/* Main Content */}
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
                      {/* Donut */}
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
        {/* <SigningModal show={openSigning} /> */}
      </div>
    </>
  );
};

export default DaoHome;
