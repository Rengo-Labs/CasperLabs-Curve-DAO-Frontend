// REACT
import React, { useState } from "react";
import { useParams } from "react-router-dom";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO, { CHAINS, SUPPORTED_NETWORKS } from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import VotingPowerActionables from "../../../../components/DAO/VotingPowerActionables";
import DaoVotingPower from "../../../../components/Charts/DaoVotingPower";
// MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
//GraphQl
import { useQuery, gql } from "@apollo/client";
//UTILS
import * as helpers from "../../../../assets/js/helpers";

import Torus from "@toruslabs/casper-embed";
import { getDeploy } from '../../../../components/blockchain/GetDeploy/GetDeploy';
import { makeDeploy } from '../../../../components/blockchain/MakeDeploy/MakeDeploy';
import { NODE_ADDRESS } from '../../../../components/blockchain/NodeAddress/NodeAddress';
import { putdeploy } from '../../../../components/blockchain/PutDeploy/PutDeploy';
import { createRecipientAddress } from '../../../../components/blockchain/RecipientAddress/RecipientAddress';
import { signdeploywithcaspersigner } from '../../../../components/blockchain/SignDeploy/SignDeploy';
import { CasperServiceByJsonRPC, CLByteArray, CLPublicKey, CLValueBuilder, RuntimeArgs } from "casper-js-sdk";
import { useSnackbar } from 'notistack';
import { ERC20_CRV_CONTRACT_HASH, ERC20_CRV_PACKAGE_HASH, VOTING_ESCROW_CONTRACT_HASH, VOTING_ESCROW_PACKAGE_HASH } from '../../../../components/blockchain/AccountHashes/Addresses';
import { convertToStr } from '../../../../components/ConvertToString/ConvertToString';
import SigningModal from "../../../../components/Modals/SigningModal";
import AllowanceModal from "../../../../components/Modals/AllowanceModal";
import axios from "axios";
import { useEffect } from "react";
import { makeERC20CRVDeployWasm } from "../../../../components/blockchain/MakeDeploy/MakeDeployWasm";
// CONTENT


const DAO_POWER = gql`
query {
  daoPowersByTimestamp{    	
    totalPower
  }
}
`;

const VOTING_POWER = gql`
query  votingPower($id: String){
    votingPower(id : $id){
      power
     }
}
`;

const VOTING_ESCROW = gql`
  query{
    votingEscrows{
      id,
      provider,
      value,
      locktime,
      type,
      totalPower,
      timestamp,
    }
  }
`

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
  let [torus, setTorus] = useState();
  const [allowance, setAllowance] = useState(0);
  const [userLockedCRVBalance, setUserLockedCRVBalance] = useState(0);
  const [daoPower, setDaoPower] = useState();
  const [votingPower, setVotingPower] = useState();
  let [votingEscrowData, setVotingEscrowData] = useState([]);
  const [vPower, setVPower] = useState();
  const [lastEvent, setLastEvent] = useState();
  const [lockerChartData, setLockerChartData] = useState();

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
    console.log("daopowerrrr", data.daoPowersByTimestamp);
  }

  const voting = useQuery(VOTING_POWER, {
    variables: {
      id: "e1431ecb9f20f2a6e6571886b1e2f9dec49ebc6b2d3d640a53530abafba9bfa1",
    },
  })
  console.log("this is data of voting escrow gql: ", voting.data);
  if (voting.data !== undefined) {
    console.log("votingPOWER", voting.data.votingPower[0].power);
  }

  const votingEscrow = useQuery(VOTING_ESCROW);
  console.log("this is chartData: ", votingEscrow.data?.votingEscrows);
  console.log("this is error of voting escrow gql: ", votingEscrow.error);

  if (votingEscrow.data !== undefined) {
    console.log("votingEscrows", votingEscrow.data.votingEscrows);
  }

  console.log("yes we didd", votingEscrowData);


  useEffect(() => {
    charts();
  }, [votingEscrowData, setVotingEscrowData])
  useEffect(() => {
    // resolveData();
    console.log("datadata", data);
    console.log("votingvoting", voting);
    console.log("votingEscrowvotingEscrow", votingEscrow);
    if (data) {
      // mutate data if you need to
      console.log("data?.daoPowersByTimestamp", data?.daoPowersByTimestamp);
      setDaoPower(data?.daoPowersByTimestamp)

    }
    if (voting) {
      console.log("voting.data?.votingPower", voting.data?.votingPower);
      setVotingPower(voting.data?.votingPower)
    }
    if (votingEscrow) {
      console.log("votingEscrow.data?.votingEscrows", votingEscrow.data?.votingEscrows);
      setVotingEscrowData(votingEscrow.data?.votingEscrows != undefined ? (votingEscrow.data?.votingEscrows) : [])
    }

  }, [data, voting, votingEscrow]);

  function interpolateVotingPower(chartData) {
     let origEvents = votingEscrowData.slice()
    //console.log(origEvents, "ORIG EVENTS")
    let newChartData = []
    console.log(chartData.slice(), "CHARTDATA LENGTH")
     for (let j = 1; j < chartData.length; j++) {
       let v = chartData[j]
       let prev = chartData[j - 1]
       newChartData.push(prev)
       //console.log("newChartData:",newChartData);
       let startTimestamp = prev[0]
       let startAmount = prev[1]
       let endTimestamp = v[0]
       let endAmount = v[1]
       let diff = endTimestamp - startTimestamp
       let diffAmount = endAmount - startAmount
       let amountLocked = origEvents[j - 1].totalPower
       let numPoints = 10
       if (chartData.length > 1) {
         for (let i = 0; i < numPoints; i++) {
           //console.log(origEvents[j-1].totalPower, i, "TOTAL POWER")
           let currentTimestamp = startTimestamp + i * (diff / numPoints)
           //console.log(amountLocked, currentTimestamp, this.events[j-1].locktime * 1000, "AMOUNTS")
           let amount = helpers.calcVotingPower(amountLocked, currentTimestamp, votingEscrowData[j - 1].locktime * 1000)
           //console.log(amount, "THE AMOUNT")
           if (votingEscrowData.find(e => e.timestamp === currentTimestamp / 1000) === undefined) {
            votingEscrowData.splice(j, 0, {
              type: 'decrease',
              timestamp: currentTimestamp / 1000,
              locktime: votingEscrowData[j].locktime,
            })
           }
           //console.log(amount, "THE AMOUNT")
           newChartData.push([currentTimestamp, amount])
         }
       }
       newChartData.push(v)
     }
     newChartData.push(chartData[chartData.length - 1])
     return newChartData
  }


  const charts = () => {
    console.log("votingEscrowDatavotingEscrowDatavotingEscrowDatavotingEscrowData", votingEscrowData);
    let events = votingEscrowData;
    if (events.length > 0) {

      events = addVotingPowerProperty(events);
      console.log("eventseventsevents", events);


      var chartData = events.map((event, i) => [event.timestamp * 1000, event.votingPower]);
      console.log("chartDatachartDatachartData", chartData);
      let lastEvent = events[events.length - 1]
      setLastEvent(lastEvent);
      let lastData = [
         lastEvent.locktime 
        //365
        * 1000, 0]
      chartData.push(lastData);
       //console.log("before pushing",votingEscrowData);
       votingEscrowData = Object.assign([], votingEscrowData);
       votingEscrowData.push({ ...votingEscrowData[votingEscrowData.length - 1], value: 0, votingPower: 0 })
       //console.log("after pushing",votingEscrowData);
       //chartData = interpolateVotingPower(chartData)
       setLockerChartData(interpolateVotingPower(chartData));
       let finalData  = interpolateVotingPower(chartData)
       console.log("final chart data:",finalData);
      //  console.log("final data after splice:",finalData.splice(0,finalData.length-11) );

    }
  }
  const addVotingPowerProperty = (data) => {
    return data.map((item) => ({
      ...item,
      votingPower: helpers.calcVotingPower(item.totalPower, item.timestamp,
        //365
         item.locktime
      ) * 1000
    }));
  }

  console.log("final chart data outside:",lockerChartData);



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
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Funds Locked Successfully", { variant })


  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Lock Funds", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function withdrawMakeDeploy() {
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
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "withdraw";
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
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Funds Withdrawed Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Withdraw Funds", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function increaseUnlockTimeMakeDeploy(unlockTime) {
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (unlockTime == undefined) {
  //     let variant = "Error";
  //     enqueueSnackbar("Please select Unlock Time", { variant })
  //     return
  //   }
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const paymentAmount = 5000000000;
  //     try {
  //       const runtimeArgs = RuntimeArgs.fromMap({
  //         unlock_time: CLValueBuilder.u256(unlockTime.getTime()),
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "increase_unlock_time";
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
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Amount Increased Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Increase Amount", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function increaseAmountMakeDeploy(lockedAmount) {
  //   if (lockedAmount == 0) {
  //     let variant = "Error";
  //     enqueueSnackbar("Locked amount cannot be Zero", { variant })
  //     return
  //   }
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
  //       });
  //       let contractHashAsByteArray = Uint8Array.from(
  //         Buffer.from(VOTING_ESCROW_CONTRACT_HASH, "hex")
  //       );
  //       let entryPoint = "increase_amount";
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
  //           // let Torus = new Torus();
  //           torus = new Torus();
  //           console.log("torus", torus);
  //           await torus.init({
  //             buildEnv: "testing",
  //             showTorusButton: true,
  //             network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //           });
  //           console.log("Torus123", torus);
  //           console.log("torus", torus.provider);
  //           const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //           const deployRes = await casperService.deploy(deploy);
  //           console.log("deployRes", deployRes.deploy_hash);
  //           console.log(
  //             `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //           );
  //           let result = await getDeploy(
  //             NODE_ADDRESS,
  //             deployRes.deploy_hash,
  //             enqueueSnackbar
  //           );
  //           console.log(
  //             `... Contract installed successfully.`,
  //             JSON.parse(JSON.stringify(result))
  //           );
  //           console.log("result", result);
  //         }
  //         handleCloseSigning();
  //         let variant = "success";
  //         enqueueSnackbar("Amount Increased Successfully", { variant })
  //       } catch {
  //         handleCloseSigning();
  //         let variant = "Error";
  //         enqueueSnackbar("Unable to Increase Amount", { variant })
  //       }
  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Something Went Wrong", { variant });
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }
  // }
  // async function increaseAndDecreaseAllowanceMakeDeploy(amount, handleCloseAllowance) {
  //   handleShowSigning();
  //   const publicKeyHex = activePublicKey;
  //   if (
  //     publicKeyHex !== null &&
  //     publicKeyHex !== "null" &&
  //     publicKeyHex !== undefined
  //   ) {
  //     const publicKey = CLPublicKey.fromHex(publicKeyHex);
  //     const spender = VOTING_ESCROW_PACKAGE_HASH;
  //     const spenderByteArray = new CLByteArray(
  //       Uint8Array.from(Buffer.from(spender, "hex"))
  //     );
  //     const erc20CrvPackageHash = new CLByteArray(
  //       Uint8Array.from(Buffer.from(ERC20_CRV_PACKAGE_HASH, "hex"))
  //     );
  //     const paymentAmount = 5000000000;
  //     const runtimeArgs = RuntimeArgs.fromMap({
  //       package_hash: CLValueBuilder.key(erc20CrvPackageHash),
  //       spender: createRecipientAddress(spenderByteArray),
  //       amount: CLValueBuilder.u256(convertToStr(amount)),
  //       entrypoint: CLValueBuilder.string("increase_allowance"),
  //     });

  //     let deploy = await makeERC20CRVDeployWasm(
  //       publicKey,
  //       runtimeArgs,
  //       paymentAmount
  //     );
  //     console.log("make deploy: ", deploy);
  //     try {
  //       if (selectedWallet === "Casper") {
  //         let signedDeploy = await signdeploywithcaspersigner(
  //           deploy,
  //           publicKeyHex
  //         );
  //         let result = await putdeploy(signedDeploy, enqueueSnackbar);
  //         console.log("result", result);
  //       } else {
  //         torus = new Torus();
  //         console.log("torus", torus);
  //         await torus.init({
  //           buildEnv: "testing",
  //           showTorusButton: true,
  //           network: SUPPORTED_NETWORKS[CHAINS.CASPER_TESTNET],
  //         });
  //         console.log("Torus123", torus);
  //         console.log("torus", torus.provider);
  //         const casperService = new CasperServiceByJsonRPC(torus?.provider);
  //         const deployRes = await casperService.deploy(deploy);
  //         console.log("deployRes", deployRes.deploy_hash);
  //         console.log(
  //           `... Contract installation deployHash: ${deployRes.deploy_hash}`
  //         );
  //         let result = await getDeploy(
  //           NODE_ADDRESS,
  //           deployRes.deploy_hash,
  //           enqueueSnackbar
  //         );
  //         console.log(
  //           `... Contract installed successfully.`,
  //           JSON.parse(JSON.stringify(result))
  //         );
  //         console.log("result", result);
  //       }
  //       handleCloseAllowance();
  //       handleCloseSigning();
  //       getAllowance();

  //       let variant = "success";
  //       enqueueSnackbar("Allowance Increased Successfully", { variant })

  //     } catch {
  //       handleCloseSigning();
  //       let variant = "Error";
  //       enqueueSnackbar("Unable to Increase Allowance", { variant })
  //     }
  //   } else {
  //     handleCloseSigning();
  //     let variant = "error";
  //     enqueueSnackbar("Connect to Wallet Please", { variant });
  //   }

  // }
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
    axios
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

  const DAOPowerFormat = () => {
    return daoPower ? helpers.formatNumber(daoPower[0].totalPower / 1e9) : 0;
  };

  const averageLock = () => {
    let crvLocked = 200000;
    return daoPower
      ? ((4 * daoPower[0].totalPower) / crvLocked).toFixed(2)
      : 0;
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
          setTorus={setTorus}
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
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
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
                            <div className="row no-gutters">
                              <div className="col-12 text-center py-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
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
                                <VotingPowerDAO/>
                                <div className="w-100 my-3">
                                  <Divider />
                                </div>
                              </div>
                            </div>
                            {/* veCRV Voting Power Chart */}
                            <div className="row no-gutters">
                              <div className="col-12 text-center pt-3">
                                <Typography
                                  variant="h4"
                                  gutterBottom
                                  component="div"
                                >
                                  <span className="font-weight-bold">
                                    Voting Power in DAO
                                  </span>
                                </Typography>
                              </div>
                              {/* Chart */}
                              <div className="row no-gutters justify-content-center w-100">
                                <div className="col-12">
                                  <DaoVotingPower chart={lockerChartData} />
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
                                <VotingPowerActionables userLockedCRVBalance={userLockedCRVBalance} />
                              </div>
                            </div>
                          </div>
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
