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
import { ERC20_CRV_CONTRACT_HASH,  } from '../../../../components/blockchain/Hashes/ContractHashes';
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
// CONTENT

// COMPONENT FUNCTION
const Minter = () => {
  // States
  const { enqueueSnackbar } = useSnackbar();
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [gaugeRelativeWeightChart,setGaugeRelativeWeightChart] = useState();
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

  let gauges = [
    {
      name: "compound",
      hash: "32046b7f8ca95d736e6f3fc0daa4ef636d21fc5f79cd08b5e6e4fb57df9238b9"
    },
    {
      name: "usdt",
      hash: "d2cc3ac0c9c364ec0b8e969bd09eb151f9e1b57eecddb900e85abadf2332ebef"
    },
    {
      name: "y",
      hash: "493fc8e66c2f1049b28fa661c65a2668c4e9e9e023447349fc9145c82304a65a"
    },
    {
      name: "busd",
      hash: "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0"
    },
    {
      name: "pax",
      hash: "b761da7d5ef67f8825c30c40df8b72feca4724eb666dba556b0e3f67778143e0"
    },
    {
      name: "ren",
      hash: "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
    },
    {
      name: "susdv2",
      hash: "adddc432b76fabbb9ff5a694b5839065e89764c1e51df8cffdbdc34f8925876c"
    },
    {
      name: "sbtc",
      hash: "bd175245e5a7fddcf1248eee5b0ee6b88aeda94bc8bbb4766a42baf5b360cc38"
    },
  ]

  let pools = {
		compound: {
			swap: '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A77',
			swap_token: '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a4',
			name: 'compound',
		},
		usdt: {
			swap: '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85R',
			swap_token: '0x9fC689CCaDa600B6DF723D9E47D84d76664a1F29',
			name: 'usdt',
		},
		y: {
			swap: '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f42',
			swap_token: '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806H4',
			name: 'y',
		},
		busd: {
			swap: '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F90',
			swap_token: '0x3B3Ac5386837Dc563660FB6a0937DFAa5924337t',
			name: 'busd',
		},
		susdv2: {
			swap: '0xA5407eAE9Ba41422680e2e00537571bcC53efBh6',
			swap_token: '0xC25a3A3b969415c80451098fa907EC722572911B',
			name: 'susdv2',
		},
		pax: {
			swap: '0x06364f10B501e868329afBc005b3492902d6C722',
			swap_token: '0xD905e2eaeBe188fc92179b6350807D8bd91Db0Y4',
			name: 'pax',
		},
		ren: {
			swap: '0x93054188d876f558f4a66B2EF1d97d16eDf0897G',
			swap_token: '0x49849C98ae39Fff122806C06791Fa73784FB3681',
			name: 'ren',
		},
		sbtc: {
			swap: '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9736',
			swap_token: '0x075b1bb99792c9E1041bA13afEf80C91a1e70fJ0',
			name: 'sbtc',
		},
	}

  console.log("gauge pools",pools);

  //Gauge Relative Weight Chart
  //dummy data of gauge_relative_weight
  let gauge_relative_weight =100;
  let gaugeSum = Object.values(pools).reduce((a,b) => +a + +gauge_relative_weight, 0)
  console.log("gaugeSum...",gaugeSum);
	let piegauges = Object.values(pools).map(v => ({ name: v.name, y: gauge_relative_weight / gaugeSum}))
  console.log("piegauges...",piegauges);
	let highest = piegauges.map(data=>data.y).indexOf(Math.max(...piegauges.map(data => data.y)))
	piegauges[highest].sliced = true;
	piegauges[highest].selected = true;
  console.log("piegauges final...",piegauges);


  useEffect(() => {
    setGaugeRelativeWeightChart(piegauges);   
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
                              <GaugeAllocationChart chart={piegauges} />
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
                              <GaugeRelativeWeight chart={piegauges} />
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
