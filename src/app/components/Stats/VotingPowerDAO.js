// REACT
import React, { useEffect, useState } from "react";
import axios from "axios";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import { gql, useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { CLPublicKey } from "casper-js-sdk";
import curveLogo from "../../assets/img/Logo.png";
import * as helpers from "../../assets/js/helpers";
import {
  ERC20_CRV_CONTRACT_HASH,
  VOTING_ESCROW_CONTRACT_HASH,
} from "../blockchain/Hashes/ContractHashes";
import * as votingEscrowFunctions from "../JsClients/VOTINGESCROW/QueryHelper/functions";
import * as erc20CrvFunctions from "../JsClients/ERC20CRV/erc20crvFunctions/functions";
import VotingPowerDaoCards from "../Cards/VotingPowerDaoCards";

const DAO_POWER = gql`
  query {
    daoPowersByTimestamp {
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

// COMPONENT FUNCTION
const VotingPowerDAO = (props) => {

  // States
  const [CRVLockedBalance, setCRVLockedBalance] = useState();
  const [CRVBalance, setCRVBalance] = useState(0);
  const [DAOPower, setDaoPower] = useState(0);
  const [votingPower, setVotingPower] = useState();
  const [myLockedCRV, setMyLockedCRV] = useState(0);

  const [crvStats, setCrvStats] = useState({
    CRVLOCKED: 0,
    supply: 0
  });
  const [crvLocked, setCrvLocked] = useState(0);
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  const [totalCRVLocked, setTotalCRVLocked] = useState(0);
  const [CRVLocked, setCRVLocked] = useState(0);
  const [CRVLockedPercentage, setCRVLockedPercentage] = useState(0);
  const [totalCRVLockedPercent, setTotalCRVLockedPercent] = useState(0);
  const [vecrvBalance, setVecrvBalance] = useState(0);
  const [lockTime, setLockTime] = useState(Date.now())
  const [lockEnd, setLockEnd] = useState(Date.now())
  const [increaseLock, setIncreaseLock] = useState(0)
  const [deposit, setDeposit] = useState(0)
  // localStorage.removeItem("Address")

  // Handlers

  // Queries
  const { error, loading, data } = useQuery(DAO_POWER);
  console.log("this is data of voting escrow gql: ", data);
  console.log("this is error of voting escrow gql: ", error);

  if (data !== undefined) {
    console.log("daopowerrrr", data?.daoPowersByTimestamp);
  }
  // console.log("activePublicKeyactivePublicKey", Buffer.from(
  //   CLPublicKey.fromHex(activePublicKey).toAccountHash()
  // ).toString("hex"));
  const voting = useQuery(VOTING_POWER, {
    variables: {
      id:
        activePublicKey && activePublicKey != "null" && activePublicKey != undefined && activePublicKey != null
          ? Buffer.from(
            CLPublicKey.fromHex(activePublicKey).toAccountHash()
          ).toString("hex")
          : null,
    },
  })
  // console.log("Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString()", Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"), voting);
  // if (voting.data !== undefined) {
  //   // console.log("votingPOWER", voting.data?.votingPower[0]?.power);
  // }

  useEffect(() => {
    // resolveData();
    // console.log("datadata", data);
    // console.log("votingvoting", voting);
    if (voting.data) {
      console.log("voting.data?.votingPower", voting.data?.votingPower);
      setMyLockedCRV(voting.data?.votingPower ? voting.data?.votingPower?.power : 0)
      setVotingPower(voting.data?.votingPower ? voting.data?.votingPower?.power : 0);
    }
    
  }, [data, voting]);


  useEffect(() => {
    async function fetchData() {
      let veCRVTotalSupply = await votingEscrowFunctions.totalSupply(ERC20_CRV_CONTRACT_HASH);
      setDaoPower(parseFloat(veCRVTotalSupply))
      console.log("veCRVTotalSupply", parseFloat(veCRVTotalSupply));
    }
    fetchData();
  }, [])
  useEffect(() => {
    let controller = new AbortController();
    let publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      async function fetchData() {
        let data = { account: Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("Hex") }
        console.log("data", data);
        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("votingEscrow response of balance of:...", response.data);
            // setBalanceOf(response.data.balance)
          })
          .catch(error => {
            // handle the error
            console.log("error of balance of:...", error);
          });

        let CRVLockBalance = await votingEscrowFunctions.balanceOf(
          VOTING_ESCROW_CONTRACT_HASH,
          Buffer.from(
            CLPublicKey.fromHex(publicKeyHex).toAccountHash()
          ).toString("hex")
        );
        // console.log("Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString(hex)", Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        let CRVBalance = await erc20CrvFunctions.balanceOf(
          ERC20_CRV_CONTRACT_HASH,
          Buffer.from(
            CLPublicKey.fromHex(publicKeyHex).toAccountHash()
          ).toString("hex")
        );
        // console.log("CRV Locked Balance: ", CRVLockBalance);
        console.log("CRV Balanceee: ", CRVBalance);
        console.log("My crv locked: ", CRVLockBalance);
        setCRVLockedBalance(CRVLockBalance);
        setCRVBalance(CRVBalance);

        //FOR CRV STATS
        loadChart(publicKeyHex);
      }
      fetchData();
    }
    return () => {
      controller.abort();
    };
  }, [localStorage.getItem("Address")]);


  useEffect(() => {

    let publicKeyHex = localStorage.getItem("Address");

    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      let accountHash = Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("Hex");
      axios.post(`votingEscrow/CRVStats/${VOTING_ESCROW_CONTRACT_HASH}/${accountHash}`,)
        .then(response => {
          // handle the response
          console.log("response of crvStats:...", response.data.data);
          setCrvStats(response.data.data)
          setCrvLocked(response.data.data.CRVLOCKED)
          setCRVLocked(response.data.data.CRVLOCKED)
          setCRVLockedPercentage((response.data.data.CRVLOCKED * 100 / response.data.data.supply).toFixed(2))

        })
        .catch(error => {
          // handle the error
          console.log("error of crvStats:...", error);
        });
    }
  }, [localStorage.getItem("Address")])


  useEffect(() => {
    let controller = new AbortController();

    let publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      async function fetchData() {
        let data = { account: Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("Hex") }
        console.log("data", data);
        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("votingEscrow response of balance of:...", response.data);
            setVecrvBalance(response.data.balances[0])
          })
          .catch(error => {
            // handle the error
            console.log("error of balance of:...", error);
          });
        axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/lockedEnd/${VOTING_ESCROW_CONTRACT_HASH}`, data)
          .then(response => {
            // handle the response
            console.log("votingEscrow response of lockedEnd:...", response.data);
            setLockTime(response.data.lockedEnd.end)
            setLockEnd(response.data.lockedEnd.end)
          })
          .catch(error => {
            // handle the error
            console.log("error of balance of:...", error);
          });
        let CRVBalance = await erc20CrvFunctions.balanceOf(
          ERC20_CRV_CONTRACT_HASH,
          Buffer.from(
            CLPublicKey.fromHex(publicKeyHex).toAccountHash()
          ).toString("hex")
        );
        setCRVBalance(CRVBalance)
        setDeposit((CRVBalance / 10 ** 9).toFixed(0, 1))

      }
      fetchData()
    }

    return () => {
      controller.abort();
    };
  }, [])
  useEffect(() => {
    setIncreaseLock(new Date((lockTime + 604800) * 1000))
    if (lockTime == 0) {
      setLockTime(Date.now() / 1000)
      setIncreaseLock(new Date(Date.now() + 604800 * 1000))

    }
    if (Date.parse(increaseLock) > Date.now() + 126144000 * 1000) {
      setIncreaseLock(new Date())
    }
  }, [])
  const DAOPowerFormat = () => {
    return helpers.formatNumber(DAOPower / 1e9);
  };

  const averageLock = () => {
    console.log("CRVLocked", CRVLocked);
    console.log("DAOPower", DAOPower);
    return DAOPower ? (4 * DAOPower / CRVLocked).toFixed(2) : 0;
  };

  // const myLockedCRVFormat = () => {
  //   return votingPower ? helpers.formatNumber(votingPower[0].power / 1e9) : 0;
  // };

  const loadChart = async (activePublicKey) => {
    console.log("Active public ket in load charts: ", activePublicKey);
    axios
      .post(
        `/votingEscrow/CRVStats/${VOTING_ESCROW_CONTRACT_HASH}/${activePublicKey}`
      )
      .then((response) => {
        console.log("Response from getting crv stats: ", response);
        setTotalCRVLocked(response.data.data.CRVLOCKED);
        setTotalCRVLockedPercent(
          response.data.data.supply
            ? (response.data.data.CRVLocked * 100) / response.data.data.supply
            : 0
        );
      })
      .catch((error) => {
        console.log("Error from getting crv stats: ", error);
      });
  };
  const CRVLockedFormat = () => {
    return helpers.formatNumber(CRVLocked / 1e9)
  }
  const myLockedCRVFormat = () => {
    return helpers.formatNumber(myLockedCRV / 1e9)
  }
  console.log("CRVLockedFormat", CRVLockedFormat());
  // let CRVLockedPercentage = isNaN((crvStats?.CRVLOCKED * 100 / crvStats?.supply).toFixed(2)) ? 0 : (crvStats?.CRVLOCKED * 100 / crvStats?.supply).toFixed(2)
  console.log("CRVLockedPercentage", CRVLockedPercentage);
  function newVotingPower() {
    let lockTime = Date.parse(increaseLock)
    let _deposit = deposit

    return _deposit * ((lockTime - Date.now()) / 1000) / (86400 * 365) / (4) + (vecrvBalance / 1e9)
  }
  function setMaxBalance() {
    setDeposit(CRVBalance.div(1e9).toString())
  }

  return (
    <>
      <Grid
        className="mt-2 mb-5"
        container
        spacing={2}
        justify="center"
        columnSpacing={3}
        rowSpacing={5}
      >
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"Total CRV vote-locked:"} value={CRVLockedFormat()} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"Percentage of total CRV Locked:"} value={`${CRVLockedPercentage}%`} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"Total veCRV:"} value={DAOPowerFormat()} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"Average lock time:"} value={averageLock() ? `${averageLock()} years` : "0 years"} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"CRV Balance:"} src={curveLogo} value={CRVBalance ? CRVBalance / 10 ** 9 : 0.0} />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <VotingPowerDaoCards title={"My CRV Locked:"} src={curveLogo} value={myLockedCRVFormat()} />
        </Grid>
      </Grid>


    </>
  );
};

export default VotingPowerDAO;
