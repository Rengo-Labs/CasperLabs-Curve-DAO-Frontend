// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import { gql, useQuery } from "@apollo/client";
import { Accordion, AccordionSummary, Avatar, CardHeader } from "@mui/material";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { CLPublicKey } from "casper-js-sdk";
import curveLogo from "../../assets/img/Logo.png";
import * as helpers from "../../assets/js/helpers";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { balanceOf } from "../JsClients/VOTINGESCROW/QueryHelper/functions";

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

// COMPONENT FUNCTION
const VotingPowerDAO = (props) => {
  // States
  const [CRVLockedBalance, setCRVLockedBalance] = useState();
  const [CRVBalance, setCRVBalance] = useState(0);
  const [daoPower, setDaoPower] = useState();
  const [votingPower, setVotingPower] = useState();
  // Handlers

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


  useEffect(() => {
    // resolveData();
    console.log("datadata", data);
    console.log("votingvoting", voting);
    if (data) {
      // mutate data if you need to
      console.log("data?.daoPowersByTimestamp", data?.daoPowersByTimestamp);
      setDaoPower(data?.daoPowersByTimestamp)

    }
    if (voting) {
      console.log("voting.data?.votingPower", voting.data?.votingPower);
      setVotingPower(voting.data?.votingPower)
    }

  }, [data, voting]);
  useEffect(() => {
    let controller = new AbortController();
    let publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      async function fetchData() {
        let CRVLockBalance = await balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        // console.log("Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString(hex)", Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        let CRVBalance = await balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        // console.log("CRV Locked Balance: ", CRVLockBalance);
        console.log("CRV Balance: ", CRVBalance);
        setCRVLockedBalance(CRVLockBalance);
        setCRVBalance(CRVBalance);
      }
      fetchData();
    }
    return () => {
      controller.abort();
    }
  }, [localStorage.getItem("Address")]);

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
      <div className="row no-gutters">
        <div className="col-12 text-center text-md-left">
          <div>
            <Accordion
              style={{
                borderRadius: "15px 15px 0px 0px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    288,283,619.93 (33.47%)
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <></>
                  }
                  title={"Total CRV vote-locked:"}
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px 0px 0px 0px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    125.47%
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <></>
                  }
                  title={"Percentage of total CRV Locked excluding voting escrow:"}
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px 0px 15px 15px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    12.22%
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <></>
                  }
                  title={"Percentage of total CRV Locked:"}
                />
              </AccordionSummary>
            </Accordion>
          </div>
          <div className="w-100 my-4">
            <Divider />
          </div>
          <div className="mt-2">
            <Accordion
              style={{
                borderRadius: "15px 15px 0px 0px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    {DAOPowerFormat() ? DAOPowerFormat() : 0}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <></>
                  }
                  title={"Total veCRV:"}
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px 0px 15px 15px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    {averageLock() ?
                      `${averageLock()} years` : "0 years"}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <></>
                  }
                  title={"Average lock time:"}
                />
              </AccordionSummary>
            </Accordion>
          </div>
          <div className="w-100 my-4">
            <Divider />
          </div>
          <div className="mt-2">

            <Accordion
              style={{
                borderRadius: "15px 15px 0px 0px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    {/* 0.00 */}
                    {CRVBalance ? CRVBalance / 10 ** 9 : 0.00}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={curveLogo}
                      aria-label="curve-logo-avatar"
                    />
                  }
                  title={"CRV Balance:"}
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px 0px 15px 15px ",
              }}
              expanded={false}
            >
              <AccordionSummary
                expandIcon={
                  <Typography
                    variant="body2"
                    style={{
                      color: "#000027",
                    }}
                    gutterBottom
                  >
                    {/* 0 */}
                    {CRVLockedBalance ? CRVLockedBalance : 0}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <Avatar
                      src={curveLogo}
                      aria-label="curve-logo-avatar"
                    />
                  }
                  title={"My CRV Locked:"}
                // subheader={tokenB.symbol}
                />
              </AccordionSummary>
            </Accordion>

          </div>
        </div>
      </div>
    </>
  );
};

export default VotingPowerDAO;
