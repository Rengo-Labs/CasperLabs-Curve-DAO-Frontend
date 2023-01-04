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
                                <PoolInfo />
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
