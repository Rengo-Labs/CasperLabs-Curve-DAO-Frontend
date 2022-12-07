// REACT
import React, { useEffect, useState } from "react";
// CUSTOM STYLING
import { gql, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
import * as voteStore from "../../../../assets/js/voteStore";
import DaoVotes from "../../../../components/Cards/DaoVotes";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
import { Alert, Button } from "@mui/material";

// CONTENT

let defaultAccount = "Default Account";

const getUserVotes = gql`
  fragment vote_cast on Votes {
    casts(where: { voter: "${defaultAccount}" }) {
      id
      voteId
      voteNum
      voter
      supports
      voterStake
    }
  }
`;

const GET_VOTES_DATA = gql`
  query {
    votes {
      id
      appAddress
      orgAddress
      creator
      metadata
      executed
      startDate
      snapshotBlock
      supportRequiredPct
      minAcceptQuorum
      yea
      nay
      votingPower
      script
      creatorVotingPower
      transactionHash
      castCount
      voteCountSeq
      # {getUserVotes !== null ? getUserVotes : ''}
    }
  }
`;

// COMPONENT FUNCTION
const Dao = () => {
  // States
  const [votes, setVotes] = useState();
  const navigate = useNavigate();
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterOutcome, setFilterOutcome] = useState("All");
  const [filterApp, setFilterApp] = useState("All");
  const [daoLegend, setDaoLegend] = useState("Vote");
  const [daoLegendStatus, setDaoLegendStatus] = useState("60% / 15%");
  const [daoTitle, setDaoTitle] = useState("#217");
  const [daoDescription, setDaoDescription] = useState(
    "Whitelist Abracadabra, allowing it to lock CRV for veCRV (https://gov.curve.fi/t/something)"
  );
  const [voteOpen, setVoteOpen] = useState(false);
  const [voteYes, setVoteYes] = useState(25);
  const [voteNo, setVoteNo] = useState(10);
  const [voteCreateDate, setVoteCreatedDate] = useState(
    "2022-05-01T13:42:00+05:00"
  );
  const [enactedVote, setEnactedVote] = useState(true);
  const [voteSupport, setVoteSupport] = useState(true);
  const [voteSupportVolume, setVoteSupportVolume] = useState("98.61");
  const [voteQuorum, setVoteQuorum] = useState(false);
  const [voteQuorumVolume, setVoteQuorumVolume] = useState("51.00");

  // Queries
  const { error, loading, data } = useQuery(GET_VOTES_DATA);
  console.log("this is data of gql: ", data);

  let loadData = () => {
    return new Promise((res, rej) => {
      data ? res(setVotes(data.votes)) : rej(error);
    });
  };

  const resolveData = async () => {
    try {
      await loadData();
    } catch (error) {
      console.log("this is promise error: ", error);
    }
  };

  // Handlers
  const handleFilterStatusChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterOutcomeChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleFilterAppChange = (event) => {
    setFilterStatus(event.target.value);
  };

  var support = voteStore.getSupportRequiredPct(votes);
  var quo = voteStore.getMinAcceptQuorum(votes);

  // Side Effects
  useEffect(() => {
    resolveData();
  }, [data]);

  let decorations = {};
  if (votes !== undefined) {
    decorations = voteStore.decorateVotes(votes);
    console.log("total support: ", decorations.totalSupport[0]);
    console.log("nop: ", decorations.nop[0]);
    console.log("yeap: ", decorations.yeap[0]);
    console.log("vote created on: ", decorations.createdOn[0]);
    console.log("vote metadata on: ", decorations.metadata[0]);
    console.log("the vote Number: ", votes[0].id);
  }

  // Content

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"DAO"}
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
                <legend>Trade</legend>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper col-12 col-lg-6 ">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-5 px-4">
                            {/* INFO */}
                            <legend>Voting power in DAO</legend>
                            <div style={{ padding: "20px" }}>
                              <div className=" no-gutters justify-content-center">
                                <Alert severity="info">
                                  You have to have at least 2500veCRV(the
                                  equivalent of 10000CRV locked for a year) to
                                  be able to create a new vote
                                </Alert>
                                <div className="w-100 my-4">
                                  <Divider />
                                </div>
                              </div>
                              {/* VOTING POWER */}
                              <div className=" no-gutters">
                                <VotingPowerDAO />
                              </div>
                              <br></br>
                              <div className=" row justify-content-center no-gutters">
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component={"div"}
                                >
                                  <span
                                    className="font-weight-bold"
                                    style={{
                                      borderBottom: "1px dashed white",
                                      color: "#5300e8",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      size="large"
                                      style={{
                                        backgroundColor: "#5300e8",
                                        color: "white",
                                      }}
                                      onClick={() => {
                                        navigate("/locker");
                                      }}
                                    >
                                      Manage locking in Locker
                                    </Button>
                                  </span>
                                </Typography>
                              </div>
                              <div className=" row justify-content-center no-gutters">
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component={"div"}
                                >
                                  <span
                                    className="font-weight-bold"
                                    style={{
                                      borderBottom: "1px dashed white",
                                      color: "#5300e8",
                                    }}
                                  >
                                    <Button
                                      variant="contained"
                                      size="large"
                                      style={{
                                        backgroundColor: "#5300e8",
                                        color: "white",
                                      }}
                                      onClick={() => {
                                        navigate("/createVote");
                                      }}
                                    >
                                      Create Vote
                                    </Button>
                                  </span>
                                </Typography>
                              </div>
                            </div>

                            {/* FILTER */}
                            <div className="row no-gutters">
                              <legend>Filter</legend>
                              <div className="container">
                                <div className="row no-gutters w-100 justify-content-center">
                                  {/* Status */}
                                  <div className="col-12 col-md-4 pr-md-2">
                                    <FormControl fullWidth variant="filled">
                                      <InputLabel id="filter-status-label">
                                        Status
                                      </InputLabel>
                                      <Select
                                        labelId="filter-status-label"
                                        id="filter-status"
                                        value={filterStatus}
                                        label="Status"
                                        onChange={handleFilterStatusChange}
                                      >
                                        <MenuItem value={"All"}>All</MenuItem>
                                        <MenuItem value={"Open"}>Open</MenuItem>
                                        <MenuItem value={"Closed"}>
                                          Closed
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  {/* Outcome */}
                                  <div className="col-12 col-md-4 pr-md-2">
                                    <FormControl fullWidth variant="filled">
                                      <InputLabel id="filter-outcome-label">
                                        Outcome
                                      </InputLabel>
                                      <Select
                                        labelId="filter-outcome-label"
                                        id="filter-outcome"
                                        value={filterOutcome}
                                        label="Outcome"
                                        onChange={handleFilterOutcomeChange}
                                      >
                                        <MenuItem value={"All"}>All</MenuItem>
                                        <MenuItem value={"Passed"}>
                                          Passed
                                        </MenuItem>
                                        <MenuItem value={"Rejected"}>
                                          Rejected
                                        </MenuItem>
                                        <MenuItem value={"Enacted"}>
                                          Enacted
                                        </MenuItem>
                                        <MenuItem value={"Pending"}>
                                          Pending
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                  {/* App */}
                                  <div className="col-12 col-md-4">
                                    <FormControl fullWidth variant="filled">
                                      <InputLabel id="filter-app-label">
                                        App
                                      </InputLabel>
                                      <Select
                                        labelId="filter-app-label"
                                        id="filter-app"
                                        value={filterApp}
                                        label="App"
                                        onChange={handleFilterAppChange}
                                      >
                                        <MenuItem value={"All"}>All</MenuItem>
                                        <MenuItem value={"Voting"}>
                                          Voting
                                        </MenuItem>
                                        <MenuItem value={"Parameter"}>
                                          Parameter
                                        </MenuItem>
                                      </Select>
                                    </FormControl>
                                  </div>
                                </div>
                                <div className="w-100 my-4">
                                  <Divider />
                                </div>
                              </div>
                              {/* VOTES */}
                              <div className="row no-gutters justify-content-center align-items-center w-100">
                                {votes ? (
                                  votes.map((vote, index) => {
                                    return (
                                      <div
                                        className="col-12 col-md-6 col-lg-12 col-xl-6"
                                        key={index}
                                      >
                                        <div className="col-12 py-3 px-sm-3 px-lg-0 px-xl-3">
                                          <DaoVotes
                                            legend={daoLegend}
                                            legendStatus={`${support[index]}% / ${quo[index]}%`}
                                            title={vote.voteCountSeq}
                                            description={
                                              decorations.metadata[index]
                                            }
                                            voteId={vote.id}
                                            executed={vote.executed}
                                            open={voteOpen}
                                            yes={decorations.yeap[index]}
                                            no={decorations.nop[index]}
                                            voteCreated={
                                              decorations.createdOn[index]
                                            }
                                            enaction={vote.executed}
                                            support={voteSupport}
                                            quorum={voteQuorum}
                                            supportVolume={voteSupportVolume}
                                            quorumVolume={voteQuorumVolume}
                                            key={index}
                                          />
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <div className="row no-gutters justify-content-center align-items-center w-100">
                                    <div className="col-12 text-center">
                                      <Spinner
                                        animation="border"
                                        role="status"
                                        style={{ color: "rgb(83, 0, 232)" }}
                                      ></Spinner>
                                    </div>
                                  </div>
                                )}
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
      </div>
    </>
  );
};

export default Dao;
