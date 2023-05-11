import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import "../../../../assets/css/bootstrap.min.css";
import DaoVotingPower from "../../../../components/Charts/DaoVotingPower";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { gql, useQuery } from "@apollo/client";
import * as helpers from "../../../../assets/js/helpers";
import { Container } from "@mui/material";
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { VOTING_ESCROW_CONTRACT_HASH } from "../../../../components/blockchain/Hashes/ContractHashes";
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
const Locker = () => {
  const { enqueueSnackbar } = useSnackbar();
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
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
  const [lockerChartData, setLockerChartData] = useState([]);
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
  //fetch dao power from backend
  const { error, loading, data } = useQuery(DAO_POWER, { fetchPolicy: "no-cache", });
  console.log("this is data of voting escrow gql: ", data);
  console.log("this is error of voting escrow gql: ", error);
  if (data !== undefined) {
    console.log("daopowerrrr:", data.daoPowersByBlock);
  }
  //fetch Voting power from backend
  const voting = useQuery(VOTING_POWER, {
    fetchPolicy: "no-cache",
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
  //fetch Voting Escrow from backend
  const votingEscrow = useQuery(VOTING_ESCROW, { fetchPolicy: "no-cache", });
  console.log("this is chartData: ", votingEscrow);
  console.log("this is error of voting escrow gql: ", votingEscrow.error);

  if (votingEscrow.data !== undefined) {
    console.log("votingEscrows", votingEscrow.data.votingEscrows);
  }
  //fetch User Balances by unlock time from backend
  const userBalances = useQuery(USER_BALANCES_BY_UNLOCK_TIME);
  console.log("this is unlockTime: ", userBalances.data);
  console.log("this is error of unlock time gql: ", userBalances.error);

  useEffect(() => {
    let param = { unlockTimes: callsData };
    //fetch list of total Supply from backend
    axios.post(`/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, param)
      .then(response => {
        console.log("response of totalSupply:...", response.data.totalSupplies);
        setTotalSupply(response.data.totalSupplies)
      })
      .catch(error => {
        console.log("error of totalSupply:...", error);
      });
  }, [])
  useEffect(() => {
    charts();
  }, [votingEscrowData, unlockTime]);
  useEffect(() => {
    if (data) {
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
      setUnlockTime(userBalances.data?.userBalancesByUnlockTime != undefined ? userBalances.data?.userBalancesByUnlockTime : []);
    }
  }, [data, voting, votingEscrow, userBalances]);

  function interpolateVotingPower(chartData) {
    let origEvents = votingEscrowData.slice();
    let newChartData = [];
    for (let j = 1; j < chartData.length; j++) {
      // get jth index of chart data
      let v = chartData[j];
      // get jth - 1 index of chart data for comparison
      let prev = chartData[j - 1];
      newChartData.push(prev);
      let startTimestamp = prev[0] / 1;
      let startAmount = prev[1] / 1;
      let endTimestamp = v[0] / 1;
      let endAmount = v[1] / 1;
      let diff = endTimestamp / 1000 - startTimestamp / 1000;
      let diffAmount = endAmount - startAmount;
      // get amount locked value
      let amountLocked = origEvents[j - 1].totalPower;
      let numPoints = 10;
      if (chartData.length > 1) {
        for (let i = 0; i < numPoints; i++) {
          let currentTimestamp = parseInt((startTimestamp / 1000 + i * (diff / numPoints)) * 1000);
          let amount = helpers.calcVotingPower(
            amountLocked,
            currentTimestamp,
            votingEscrowData[j - 1].locktime
          );
          if (
            votingEscrowData.find(
              (e) => e.timestamp == currentTimestamp
            ) === undefined
          ) {
            votingEscrowData.splice(j, 0, {
              type: "decrease",
              timestamp: parseInt(currentTimestamp),
              locktime: parseInt(votingEscrowData[j].locktime),
            });
          }
          if (newChartData[newChartData.length - 1][0] != parseInt(currentTimestamp))
            newChartData.push([parseInt(currentTimestamp), amount]);
        }
      }
      newChartData.push(v);
    }
    newChartData.push(chartData[chartData.length - 1]);
    return newChartData;
  }

  const charts = async () => {
    let events = votingEscrowData;
    if (events.length > 0) {
      // this will add the Voting Power Property in Voting Escrows Data
      events = addVotingPowerProperty(events);
      // converted to chart data
      var chartData = events.map((event, i) => [
        event.timestamp / 1,
        event.votingPower / 1,
      ]);

      let lastEvent = events[events.length - 1];
      setLastEvent(lastEvent);
      let lastData = [
        lastEvent.locktime / 1,
        0,
      ];
      // added last event in chart data
      chartData.push(lastData);
      events.push({ ...events[events.length - 1], value: 0, votingPower: 0 })
      votingEscrowData = Object.assign([], votingEscrowData);
      votingEscrowData.push({
        ...votingEscrowData[votingEscrowData.length - 1],
        value: 0,
        votingPower: 0,
      });
      // interpolate voting power on chartData
      chartData = interpolateVotingPower(chartData)
      // get unique chart data after interpolating

      let uniquechartData = [
        ...new Map(chartData.map((item) => [item[0], item])).values(),
      ];

      // slice extra indexes as in their curve dao repo
      uniquechartData = uniquechartData.slice(0, uniquechartData.length - 11)

      uniquechartData.push([1802304000000, 0])
      setLockerChartData(uniquechartData);
      let finalData = uniquechartData;
      // get dao power data with time stamp and total power
      let daopowerdata = daoPower ? daoPower.map(e => [e.timestamp / 1, e.totalPower / 1e9]) : []
      // get last unlock time
      let lastUnlockTime = parseInt(unlockTime[0]?.unlock_time)
      if (isNaN(lastUnlockTime)) {
        return
      }
      let now = Date.now()
      let lastUnlockTimeDiff = lastUnlockTime - now
      let i = 0
      let unlockTimes = []
      // create time stamps till last unlock timestamp
      while (now < lastUnlockTime) {
        unlockTimes.push(now);
        now += i ** 4 * 86400000
        i++
      }
      unlockTimes.push(lastUnlockTime)
      let data = { unlockTimes };
      //get total supply against unlock timestamps
      let res = await axios.post(`/votingEscrow/totalSupply/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      setCallsData(res.data.totalSupplies);
      let calls = res.data.totalSupplies;
      // create data for Dao Power chart with timestamps and totalSupplies on that timestamp
      for (let m = 0; m < calls.length; m++) {
        daopowerdata.push([unlockTimes[m], calls[m] / 1e9]);
      }
      setDaoPowerChart(daopowerdata);
    }

  };
  const addVotingPowerProperty = (data) => {
    return data.map((item) => ({
      ...item,
      votingPower:
        helpers.calcVotingPower(
          item.totalPower / 1,
          item.timestamp / 1,
          item.locktime / 1
        ),
    }));
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
        <div className="container-fluid">
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-10">
                    <div className="row no-gutters justify-content-center">
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
                              <div className="row no-gutters">
                                <div className="col-12">
                                  <VotingPowerDAO />
                                  <div className="w-100 my-3">
                                    <Divider />
                                  </div>
                                </div>
                              </div>
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
                              <div className="row no-gutters">
                                <div className="col-12 mt-4">
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
