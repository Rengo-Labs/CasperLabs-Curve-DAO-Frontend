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
import { Alert, Button, Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import { default as Axios, default as axios } from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { ERC20_CRV_CONTRACT_HASH, GAUGE_CONTROLLER_CONTRACT_HASH } from '../../../../components/blockchain/Hashes/ContractHashes';
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
import { gauges } from "../../../../components/Charts/ChartHelper/ChartHelpers";
import Gauge from "../../../../components/Gauge/Gauge";
import * as gaugeControllerFunctions from "../../../../components/JsClients/GAUGECONTROLLER/gaugeControllerFunctionsForBackend/functions";
import * as LiquidityGaugeV3 from "../../../../components/JsClients/LIQUIDITYGAUGEV3/liquidityGaugeV3FunctionsForBackend/functions";
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
  const [allowance, setAllowance] = useState(0);
  const [totalClaimableCRV, setTotalClaimableCRV] = useState(10);
  const [totalMintedCRV, setTotalMintedCRV] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [gaugeRelativeWeightChart, setGaugeRelativeWeightChart] = useState([]);
  const [myGauges, setMyGauges] = useState([]);
  const [claimFromGauges, setClaimFromGauges] = useState([]);
  const [gaugesNeedApply, setGaugesNeedApply] = useState([]);
  const [nGauges, setNGauges] = useState(0);
  const [pools, setPools] = useState([]);
  const [myPools, setMyPools] = useState([]);
  const [boosts, setBoosts] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalGaugeBalance, setTotalGaugeBalance] = useState(0);


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
    let gauge_relative_weight = 100;
    console.log("poolspoolspoolspools", pools);
    let gaugeSum = Object.values(pools).reduce((a, b) => +a + +gauge_relative_weight, 0)
    console.log("gaugeSum...", gaugeSum);
    let piegauges = Object.values(pools).map(v => ({ name: v.name, y: gauge_relative_weight / gaugeSum }))
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

  useEffect(() => {
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined) {
      let decodedGauges = []
      const fetchData = async () => {
        let n_gauges = await gaugeControllerFunctions.n_gauges(
          GAUGE_CONTROLLER_CONTRACT_HASH
        );
        console.log("n_gauges", parseFloat(n_gauges[1].data));
        setNGauges(parseFloat(n_gauges[1].data));
        for (let i = 0; i < n_gauges[1].data; i++) {
          console.log("i", i);
          let gauge = await gaugeControllerFunctions.gauges(
            GAUGE_CONTROLLER_CONTRACT_HASH,
            i.toString()
          );
          console.log("gauge", gauge);
          decodedGauges.push(gauge)
        }

        console.log("decodedGauges", decodedGauges);
        let params = {
          packageHashes: decodedGauges
        }
        let res = await axios.post("/getContractHashesAgainstPackageHashes", params)
        console.log("res", res);
        let gaugesContractHashes = res.data.contractHashes
        console.log("gaugesContractHashes", gaugesContractHashes);
        let pools = []
        let poolsPackageHash = []
        let gaugeBalances = []
        //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
        // let claimableTokens = []
        await Promise.all(gaugesContractHashes.map(async (gauge) => {
          let pool = await LiquidityGaugeV3.lpToken(
            gauge
          );
          console.log("pool", pool);
          pools.push({ swap_token: pool, gauge })
          poolsPackageHash.push(pool)
          let gaugeBalance = await LiquidityGaugeV3.balanceOf(
            gauge,
            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
          );
          console.log("gaugeBalance", parseFloat(gaugeBalance));
          gaugeBalances.push({ gauge, balance: parseFloat(gaugeBalance) })
          // //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
          // // let claimableToken = await LiquidityGaugeV3.claimableTokens(
          // //   gauge,
          // //   Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
          // // );
          // // console.log("claimableToken", claimableToken);
          // // claimableTokens.push(claimableToken)

        }));
        console.log("pools", pools);
        console.log("gaugeBalances", gaugeBalances);

        // //WE CAN"T DO CALIMABLE TOKENS PART BECUASE ITS A SETTER THAT RETURNS A VALUE
        // // console.log("claimableTokens", claimableTokens);

        let params1 = {
          packageHashes: poolsPackageHash
        }
        let res1 = await axios.post("/getContractHashesAgainstPackageHashes", params1)
        console.log("res1", res1);
        let poolsContractHashes = res1.data.contractHashes
        // console.log("poolsContractHashes", poolsContractHashes);
        let decodedBalances = []
        await Promise.all(poolsContractHashes.map(async (pool) => {
          // console.log("poolpoolpool", pool);
          let poolBalance = await LiquidityGaugeV3.balanceOf(
            pool,
            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
          );
          // console.log("poolBalance", parseFloat(poolBalance));
          decodedBalances.push({ swap_token: pool, balance: parseFloat(poolBalance) })

        }));
        // console.log("decodedBalances", decodedBalances);

        let gaugeTypes = []
        await Promise.all(decodedGauges.map(async (gauge) => {
          let gaugeType = await gaugeControllerFunctions.gaugeTypes(
            GAUGE_CONTROLLER_CONTRACT_HASH,
            gauge
          );
          // console.log("gaugeType", gaugeType - 1);
          gaugeTypes.push(gaugeType - 1)



        }));
        // console.log("gaugeTypes", gaugeTypes);
        let typeNames = []
        await Promise.all(gaugeTypes.map(async (type) => {
          let typeName = await gaugeControllerFunctions.gauge_type_names(
            GAUGE_CONTROLLER_CONTRACT_HASH,
            type.toString()
          );
          // console.log("typeName", typeName);
          typeNames.push(typeName)
        }));
        // console.log("typeNames", typeNames);
        let decodedGaugeLP = []
        pools.map((pool, i) => {
          decodedGaugeLP.push({
            gauge: decodedGauges[i],
            swap_token: pool.swap_token,
            type: gaugeTypes[i],
            typeName: typeNames[i],
            claimable_tokens: 0,
            minted: 0,
          })
        })
        console.log("decodedGaugeLP", decodedGaugeLP);
        let mypools = decodedBalances.map((v, i) => {
          let poolInfo = pools[i]
          return {
            ...poolInfo,
            balance: v.balance,
            origBalance: v.balance,
            gaugeBalance: gaugeBalances.find(pool => pool.gauge == poolInfo.gauge).balance
          }
        })
        console.log("mypools", mypools);
        console.log("poolspoolspoolspoolspools", pools);
        let prices = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,curve-dao-token&vs_currencies=usd')
        prices = await prices.json()
        let btcPrice = prices.bitcoin.usd
        let CRVprice = prices['curve-dao-token'].usd
        console.log("CRVprice", CRVprice);
        let gaugeParams = {
          address: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"),
          timestamps: []
        }
        let decodedWeights = [];
        await Promise.all(decodedGauges.map(async (gauge) => {
          let res2 = await axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/gaugeController/gaugeRelativeWeight/${gauge}`, gaugeParams)
          console.log("res2", res2);
          decodedWeights.push(res2.data.gaugeRelativeWeights[0] / 1e9)
        }));
        console.log("decodedWeights,", decodedWeights);
        let gaugeRates = []
        let workingSupplies = []
        let totalSupplies = []
        let workingBalances = []
        await Promise.all(gaugesContractHashes.map(async (gauge) => {
          let inflationRate = await LiquidityGaugeV3.inflationRate(
            gauge
          );
          console.log("inflationRate", parseFloat(inflationRate) / 1e9);
          gaugeRates.push(inflationRate)

          let workingSupply = await LiquidityGaugeV3.workingSupply(
            gauge
          );
          console.log("workingSupply", workingSupply);
          workingSupplies.push(parseFloat(workingSupply) / 1e9)
          let totalSupplyGauge = await LiquidityGaugeV3.totalSupplyGauge(
            gauge
          );
          console.log("totalSupplyGauge", parseFloat(totalSupplyGauge));
          totalSupplies.push(parseFloat(totalSupplyGauge) / 1e9)


          let workingBalance = await LiquidityGaugeV3.workingBalances(
            gauge,
            Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex")
          );
          console.log("workingBalances", parseFloat(workingBalance));
          workingBalances.push(parseFloat(workingBalance))

          decodedWeights.map((w, i) => {
            mypools[i].workingSupply = workingSupplies[i];
            mypools[i].originalSupply = totalSupplies[i];
            mypools[i].currentWorkingBalance = workingBalances[i];

            // WE DON"T HAVE VIRTUAL PRICE THATS WHY WE CANT DO THIS PART
            // let rate = (gaugeRates[i] * w[1] * 31536000 / workingSupplies[i] * 0.4) / virtual_price
            // let apy = rate * CRVprice * 100
            // WE DON"T HAVE VIRTUAL PRICE THATS WHY WE CANT DO THIS PART
            mypools[i].gauge_relative_weight = w[1];
          })

        }));
        let _totalBalance = mypools.reduce((a, b) => +a + +b.balance, 0)
        setTotalBalance(_totalBalance)
        let _totalGaugeBalance = mypools.reduce((a, b) => +a + +b.gaugeBalance, 0)
        setTotalGaugeBalance(_totalGaugeBalance)
        let _boosts = []
        for (let pool of mypools) {
          if (+pool.gaugeBalanace == 0) continue
          pool.previousWorkingBalance = pool.currentWorkingBalance
          _boosts[pool.name] = pool.currentWorkingBalance / (0.4 * pool.gaugeBalance)
        }
        setMyPools(mypools);
        setPools(pools);
        setBoosts(boosts);

      }
      fetchData();
    }
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

  function totalClaimableCRVFormat() {
    return (totalClaimableCRV / 1e9).toFixed(2)
  }
  function totalMintedCRVFormat() {
    return (totalMintedCRV / 1e9).toFixed(2)
  }
  function showApplyBoostAll() {
    return gaugesNeedApply.length > 0
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
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-10">
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
                                        {myGauges.map((gauge, index) =>

                                          <FormControlLabel
                                            key={index}
                                            value={gauge}
                                            id={'gauge' + gauge.name}
                                            control={<Checkbox />}
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
                                          <Button variant="contained" onClick={""} fullWidth>
                                            Claim {claimFromGauges.length == myGauges.length ? 'all' : ''}
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
                      {gauges.map((gauge) => (
                        <Gauge gauge={gauge} />
                        // <Box
                        //   sx={{
                        //     width: "100%",
                        //   }}
                        //   className="mt-4"
                        // >
                        //   <Paper elevation={4}>
                        //     <div className="py-5 px-4">
                        //       {/* Heading */}
                        //       <div className="col-12">
                        //         <Typography
                        //           variant="h5"
                        //           gutterBottom
                        //           component="div"
                        //           fontWeight={900}
                        //         >
                        //           {gauge.name}
                        //           {/* CRV APY: "Some value" */}
                        //         </Typography>
                        //       </div>
                        //       {/* Pool Info */}
                        //       <div className="col-12">
                        //         {/* <PoolInfo /> */}
                        //         Gauge Relative weight: 
                        //         <div className="w-100 my-3">
                        //           <Divider />
                        //         </div>
                        //       </div>
                        //     </div>
                        //   </Paper>
                        // </Box>
                      ))}
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
