// REACT
import React, { useState } from "react";
import { useParams } from "react-router-dom";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import DaoVotingPower from "../../../../components/Charts/DaoVotingPower";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
//GraphQl
import { gql, useQuery } from "@apollo/client";
//UTILS
import * as helpers from "../../../../assets/js/helpers";

import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { ERC20_CRV_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import { VOTING_ESCROW_PACKAGE_HASH } from "../../../../components/blockchain/Hashes/PackageHashes";
import { VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
import { Container } from "@mui/material";
// CONTENT

const DAO_POWER = gql`
  query {
    daoPowersByBlock{
      id
      block
      timestamp
      totalPower
  }

  }
`;

const VOTING_POWER = gql`
  query votingPower($id: String) {
    votingPower(id: $id) {
      power
    }
  }
`;

const VOTING_ESCROW = gql`
  query {
    votingEscrows {
      id
      provider
      value
      locktime
      type
      totalPower
      timestamp
    }
  }
`;

const USER_BALANCES_BY_UNLOCK_TIME = gql`
  query {
    userBalancesByUnlockTime {
      unlock_time
    }
  }
`;

// COMPONENT FUNCTION
const Locker = () => {
  const { enqueueSnackbar } = useSnackbar();
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [daoPower, setDaoPower] = useState();
  const [votingPower, setVotingPower] = useState();
  const [unlockTime, setUnlockTime] = useState();
  let [votingEscrowData, setVotingEscrowData] = useState([]);
  const [vPower, setVPower] = useState();
  const [lastEvent, setLastEvent] = useState();
  const [lockerChartData, setLockerChartData] = useState();
  const [callsData, setCallsData] = useState();
  const [totalSupply, setTotalSupply] = useState();
  const [daoPowerChart, setDaoPowerChart] = useState([]);
  const [openSigning, setOpenSigning] = useState(false);
  const handleCloseSigning = () => {
    setOpenSigning(false);
  };
  const handleShowSigning = () => {
    setOpenSigning(true);
  };

  let { id } = useParams();

  // Queries
  const { error, loading, data } = useQuery(DAO_POWER);
  console.log("this is data of voting escrow gql: ", data);
  console.log("this is error of voting escrow gql: ", error);

  if (data !== undefined) {
    console.log("daopowerrrr", data.daoPowersByBlock);
  }

  const voting = useQuery(VOTING_POWER, {
    variables: {
      id: activePublicKey && activePublicKey != "null"
        ? Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex")
        : null,
    },
  });
  console.log("this is data of voting escrow gql : ", voting.data);
  if (voting.data !== undefined) {
    console.log("votingPOWER", voting?.data);
  }

  const votingEscrow = useQuery(VOTING_ESCROW, { fetchPolicy: "no-cache", });
  console.log("this is chartData: ", votingEscrow);
  console.log("this is error of voting escrow gql: ", votingEscrow.error);

  if (votingEscrow.data !== undefined) {
    console.log("votingEscrows", votingEscrow.data.votingEscrows);
  }

  console.log("votingEscrowData......", votingEscrowData);

  const userBalances = useQuery(USER_BALANCES_BY_UNLOCK_TIME);
  console.log("this is unlockTime: ", userBalances.data);
  console.log("this is error of unlock time gql: ", userBalances.error);

  // if (votingEscrow.data !== undefined) {
  //   console.log("votingEscrows", votingEscrow.data.votingEscrows);
  // }
  let param = { unlockTimes: callsData };

  useEffect(() => {

    axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, param)
      .then(response => {
        // handle the response
        console.log("response of totalSupply:...", response.data.totalSupplies);
        setTotalSupply(response.data.totalSupplies)
      })
      .catch(error => {
        // handle the error
        console.log("error of totalSupply:...", error);
      });
  }, [])





  useEffect(() => {
    charts();
  }, [votingEscrowData, unlockTime]);
  useEffect(() => {
    // resolveData();
    // console.log("datadata", data);
    // console.log("votingvoting", voting);
    // console.log("votingEscrowvotingEscrow", votingEscrow);
    if (data) {
      // mutate data if you need to
      console.log("data?.daoPowersByBlock", data?.daoPowersByBlock);
      setDaoPower(data?.daoPowersByBlock);
    }
    if (voting) {
      console.log("voting.data?.votingPower", voting.data?.votingPower);
      setVotingPower(voting.data?.votingPower);
    }
    if (votingEscrow) {
      console.log(
        "votingEscrow.data?.votingEscrows",
        votingEscrow.data?.votingEscrows
      );
      setVotingEscrowData(
        votingEscrow.data?.votingEscrows != undefined
          ? votingEscrow.data?.votingEscrows
          : []
      );
    }
    if (userBalances) {
      // console.log("userBalances.data?.unlock_time", userBalances.data?.userBalancesByUnlockTime);
      setUnlockTime(userBalances.data?.userBalancesByUnlockTime != undefined ? userBalances.data?.userBalancesByUnlockTime : []);
    }
  }, [data, voting, votingEscrow, userBalances]);

  function interpolateVotingPower(chartData) {
    let origEvents = votingEscrowData.slice();
    // console.log(origEvents, "ORIG EVENTS")
    let newChartData = [];
    // console.log(chartData.slice(), "CHARTDATA LENGTH");
    for (let j = 1; j < chartData.length; j++) {
      let v = chartData[j];
      let prev = chartData[j - 1];
      newChartData.push(prev);
      // console.log("newChartData:", newChartData);
      let startTimestamp = prev[0];
      let startAmount = prev[1];
      let endTimestamp = v[0];
      let endAmount = v[1];
      let diff = endTimestamp - startTimestamp;
      // console.log("diff", diff);
      let diffAmount = endAmount - startAmount;
      let amountLocked = origEvents[j - 1].totalPower;
      // console.log("amountLocked", amountLocked);
      let numPoints = 10;
      // console.log("chartData.length", chartData.length);
      if (chartData.length > 1) {
        for (let i = 0; i < numPoints; i++) {
          //console.log(origEvents[j-1].totalPower, i, "TOTAL POWER")
          let currentTimestamp = startTimestamp / 1 + i * (diff / numPoints);
          // console.log("startTimestamp", startTimestamp);
          // console.log("i * (diff / numPoints)", i * (diff / numPoints));
          // console.log("currentTimestamp", currentTimestamp);
          //console.log(amountLocked, currentTimestamp, this.events[j-1].locktime * 1000, "AMOUNTS")
          let amount = helpers.calcVotingPower(
            amountLocked,
            currentTimestamp,
            votingEscrowData[j - 1].locktime
          );
          //console.log(amount, "THE AMOUNT")
          if (
            votingEscrowData.find(
              (e) => e.timestamp === currentTimestamp
            ) === undefined
          ) {
            votingEscrowData.splice(j, 0, {
              type: "decrease",
              timestamp: parseInt(currentTimestamp),
              locktime: parseInt(votingEscrowData[j].locktime),
            });
          }
          // console.log("votingEscrowDatavotingEscrowData", votingEscrowData);
          // console.log(amount, "THE AMOUNT")
          newChartData.push([parseInt(currentTimestamp), amount]);
        }
      }
      newChartData.push(v);
    }
    newChartData.push(chartData[chartData.length - 1]);
    console.log("newChartData", newChartData);
    return newChartData;
  }

  const charts = async () => {
    // console.log(
    //   "votingEscrowDatavotingEscrowDatavotingEscrowDatavotingEscrowData",
    //   votingEscrowData
    // );
    let events = votingEscrowData;
    if (events.length > 0) {
      events = addVotingPowerProperty(events);
      // console.log("eventseventsevents", events);

      var chartData = events.map((event, i) => [
        event.timestamp / 1,
        event.votingPower,
      ]);
      // console.log("chartDatachartDatachartData", chartData);
      let lastEvent = events[events.length - 1];
      setLastEvent(lastEvent);
      let lastData = [
        lastEvent.locktime / 1,
        0,
      ];
      chartData.push(lastData);
      console.log("before pushing", votingEscrowData);
      votingEscrowData = Object.assign([], votingEscrowData);
      votingEscrowData.push({
        ...votingEscrowData[votingEscrowData.length - 1],
        value: 0,
        votingPower: 0,
      });
      console.log("after pushing", votingEscrowData);
      chartData = interpolateVotingPower(chartData)

      setLockerChartData(chartData);
      let finalData = chartData;
      console.log("final chart data:", finalData);
      let lastUnlockTime = parseInt(unlockTime[0]?.unlock_time)
      console.log("lastUnlockTime", lastUnlockTime);
      let now = Date.now()
      // console.log("now time value", now);
      // let calls = []
      let i = 0
      // console.log("nownow", now);
      let unlockTimes = []
      // console.log("lastUnlockTimelastUnlockTime", lastUnlockTime);
      while (now < lastUnlockTime) {
        unlockTimes.push(now);
        // let data = { unlockTimes: [now] };
        // let res = await axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)

        // // handle the response
        // console.log("response of unlockTimes totalSupply:...", res.data.totalSupplies);

        // calls.push(res.data.totalSupplies[0])
        // console.log("now", now);
        // console.log("i ** 4 * 86400", i ** 4 * 86400);
        // console.log("i", i);
        now += i ** 4 * 86400
        i++
      }
      unlockTimes.push(lastUnlockTime)
      let data = { unlockTimes };
      console.log("datadata", data);
      let res = await axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)

      // handle the response
      console.log("response of unlockTimes totalSupply:...", res.data.totalSupplies);


      setCallsData(res.data.totalSupplies);
      let calls = res.data.totalSupplies;
      console.log("calls data", calls);
      console.log("unlockTimes", unlockTimes);
      console.log("daoPower", daoPower);
      let daopowerdata = daoPower ? daoPower.map(e => [e.timestamp / 1, e.totalPower / 1e9]) : []
      // console.log("totalSupply", totalSupply);
      for (let m = 0; m < calls.length; m++) {
        daopowerdata.push([unlockTimes[m], calls[m] / 1e9]);
      }
      setDaoPowerChart(daopowerdata);
      console.log("daopowerdata", daopowerdata);
      //  console.log("final data after splice:",finalData.splice(0,finalData.length-11) );
    }

  };

  // useEffect(()=>{
  //   let lastUnlockTime = parseInt(unlockTime[0]?.unlock_time)
  //   console.log("lastUnlockTime",lastUnlockTime); 
  //   let now = (Date.now() / 1000) | 0
  //   console.log("now time value",now);
  //   let calls = []
  //   let i = 0
  // while(now < lastUnlockTime) {
  //   console.log("smaller");
  //   calls.push([now])
  //   now += i ** 4 * 86400
  //   i++
  // }
  // calls.push([lastUnlockTime]);
  // console.log("calls data",calls);
  // setCallsData(calls);

  // },[unlockTime, setUnlockTime,userBalances]);
  const addVotingPowerProperty = (data) => {
    return data.map((item) => ({
      ...item,
      votingPower:
        helpers.calcVotingPower(
          item.totalPower,
          item.timestamp,
          item.locktime
        ),
    }));
  };

  console.log("final chart data outside:", lockerChartData);

  // Handlers
  // async function createLockMakeDeploy(lockedAmount, unlockTime) {
  //   if (lockedAmount == 0) {
  //     let variant = "Error";
  //     enqueueSnackbar("Locked amount cannot be Zero", { variant })
  //     return
  //   }
  //   if (unlockTime == undefined) {
  //     let variant = "Error";
  //     enqueueSnackbar("Please select Unlock Time", { variant })
  //     return
  //   }
  //   console.log("unlockTime", unlockTime.getTime());
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //         value: CLValueBuilder.u256(convertToStr(lockedAmount)),
  //         unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "create_lock";
  //       // Set contract installation deploy (unsigned).
  //       let deploy = await makeDeploy(
  //         publicKey,
  //         contractHashAsByteArray,
  //         entryPoint,
  //         runtimeArgs,
  //         paymentAmount
  //       );
  //       console.log("make deploy: ", deploy);
  //       try {
  //         if (selectedWallet === "Casper") {
  //           let signedDeploy = await signdeploywithcaspersigner(
  //             deploy,
  //             publicKeyHex
  //           );
  //           let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //           console.log("result", result);
  //         } else {
  //           // let
  useEffect(() => {
    if (
      activePublicKey &&
      activePublicKey != "null" &&
      activePublicKey != undefined
    )
      getAllowance();
  }, [activePublicKey]);

  const getAllowance = () => {
    let allowanceParam = {
      contractHash: ERC20_CRV_CONTRACT_HASH,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: VOTING_ESCROW_PACKAGE_HASH,
    };
    console.log("allowanceParam0", allowanceParam);
    axios
      .get(
        `/allowanceagainstownerandspender/${ERC20_CRV_CONTRACT_HASH}/${CLPublicKey.fromHex(
          activePublicKey
        )
          .toAccountHashStr()
          .slice(13)}/${VOTING_ESCROW_PACKAGE_HASH}`
      )
      .then((res) => {
        console.log("allowanceagainstownerandspender", res);
        console.log(res.data);
        setAllowance(res.data.allowance);
      })
      .catch((error) => {
        setAllowance(0);
        console.log(error);
        console.log(error.response);
      });
  };

  const DAOPowerFormat = () => {
    return daoPower ? helpers.formatNumber(daoPower[0].totalPower / 1e9) : 0;
  };

  const averageLock = () => {
    let crvLocked = 200000;
    return daoPower ? ((4 * daoPower[0].totalPower) / crvLocked).toFixed(2) : 0;
  };

  const myLockedCRVFormat = () => {
    return votingPower ? helpers.formatNumber(votingPower[0].power / 1e9) : 0;
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
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
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-8">
                    <div className="row no-gutters justify-content-center">
                      {/* Voting Power */}
                      <Box
                        sx={{
                          width: "100%",
                        }}
                        className="mt-4"
                      >
                        <Paper elevation={4}>
                          <Container>
                            <div className="py-5 px-4">
                              {/* Heading */}
                              <div className="row no-gutters">
                                <div className="col-12 text-center py-3">
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                    sx={{
                                      marginLeft: "20%",
                                      marginRight: "20%",
                                    }}
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
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                    sx={{
                                      marginLeft: "20%",
                                      marginRight: "20%",
                                    }}
                                  >
                                    <span className="font-weight-bold">
                                      Voting Power in DAO
                                    </span>
                                  </Typography>
                                </div>
                                {/* Chart */}
                                <div className="row no-gutters justify-content-center w-100">
                                  <div className="col-12">
                                    <DaoVotingPower chart={lockerChartData} daoPower={daoPowerChart} />
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
                                  {/* <VotingPowerActionables createLockMakeDeploy={createLockMakeDeploy} withdrawMakeDeploy={withdrawMakeDeploy} increaseUnlockTimeMakeDeploy={increaseUnlockTimeMakeDeploy} increaseAmountMakeDeploy={increaseAmountMakeDeploy} allowance={allowance} userLockedCRVBalance={userLockedCRVBalance} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} /> */}
                                  <VotingPowerActionables
                                    userLockedCRVBalance={userLockedCRVBalance}
                                  />
                                </div>
                              </div>
                            </div>
                          </Container>
                        </Paper>
                      </Box>
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

export default Locker;
