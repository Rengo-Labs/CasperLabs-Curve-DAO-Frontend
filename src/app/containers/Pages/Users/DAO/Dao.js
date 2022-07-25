// REACT
import React, { useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLING
import "../../../../assets/css/common.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/style.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import DaoVotes from "../../../../components/Cards/DaoVotes";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VotingPowerDAO from "../../../../components/Stats/VotingPowerDAO";
import HomeBanner from "../Home/HomeBanner";
// MATERIAL UI
import { Button } from "@material-ui/core";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import Typography from "@mui/material/Typography";
import { useHistory } from "react-router-dom";

// CONTENT

// COMPONENT FUNCTION
const Dao = () => {
  // States
  const history = useHistory();
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
  const [daoLegend, setDaoLegend] = useState("Parameter");
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

  // Content
  const voteCreatedObj = new Date(voteCreateDate);
  const date = voteCreatedObj.getDate();
  const month = voteCreatedObj.getMonth() + 1;
  const year = voteCreatedObj.getFullYear();
  const hh = voteCreatedObj.getHours();
  const mm = voteCreatedObj.getMinutes();
  const ss = voteCreatedObj.getSeconds();

  const voteCreatedOn = `${date}/${month}/${year} ${hh}:${mm}:${ss}`;
  console.log(voteCreatedOn);

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
                            {/* <fieldset> */}
                            <legend>Voting power in DAO</legend>
                            <div style={{ padding: "20px" }}>
                              <div className=" no-gutters justify-content-center">
                                <section className="bg-primary p-3 text-white">
                                  <Typography
                                    variant="body1"
                                    gutterBottom
                                    component="div"
                                  >
                                    You have to have at least 2500veCRV(the
                                    equivalent of 10000CRV locked for a year) to
                                    be able to create a new vote
                                  </Typography>
                                </section>
                                <div className="w-100 my-4">
                                  <Divider />
                                </div>
                              </div>
                              {/* VOTING POWER */}
                              <div className=" no-gutters">
                                <VotingPowerDAO />
                                {/* <div className="w-100 my-4">
                                    <Divider />

                                  </div> */}
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
                                    style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
                                  >
                                    <Button
                                      variant="contained"
                                      size="large"
                                      style={{ backgroundColor: "#5300e8", color: "white" }}
                                      onClick={() => { history.push("/locker") }}
                                    >
                                      Manage locking in Locker
                                    </Button>
                                    <Link to="/locker" style={{ textDecoration: "none", color: "#5300e8" }}>
                                      {/* <Link to={"/locker"} style={{ color: "#333" }}> */}

                                    </Link>
                                  </span>
                                </Typography>
                                {/* <div className="w-100 my-4">
                                  <Divider />
                                </div> */}
                              </div>
                            </div>

                            {/* </fieldset> */}

                            {/* <div className=" no-gutters">
                              <div className="col-12">
                                <GasPriorityFee />
                              </div>
                              <div className="w-100 my-4">
                                <Divider />
                              </div>
                            </div> */}

                            {/* FILTER */}
                            <div className="row no-gutters">
                              {/* <div className="row no-gutters w-100 justify-content-center">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component={"div"}
                                >
                                  <span
                                    style={{
                                      fontWeight: "bold",
                                      color: "#333",
                                    }}
                                  >
                                    Filter
                                  </span>
                                </Typography>
                              </div> */}
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
                              <div className="row no-gutters">
                                <div className="col-4">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-11">
                                      <DaoVotes
                                        legend={daoLegend}
                                        legendStatus={daoLegendStatus}
                                        title={daoTitle}
                                        description={daoDescription}
                                        open={voteOpen}
                                        yes={voteYes}
                                        no={voteNo}
                                        voteCreated={voteCreatedOn}
                                        enaction={enactedVote}
                                        support={voteSupport}
                                        quorum={voteQuorum}
                                        supportVolume={voteSupportVolume}
                                        quorumVolume={voteQuorumVolume}
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-11">
                                      <DaoVotes
                                        legend={daoLegend}
                                        legendStatus="75% / 18%"
                                        title="#216"
                                        description="There is a white car inside that garadge. It was parked there in 1963 and hasn't been started ever since."
                                        open={true}
                                        yes={38}
                                        no={19}
                                        voteCreated={voteCreatedOn}
                                        enaction={false}
                                        support={voteSupport}
                                        quorum={false}
                                        supportVolume="81.83"
                                        quorumVolume="36.66"
                                      />
                                    </div>
                                  </div>
                                </div>
                                <div className="col-4">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-11">
                                      <DaoVotes
                                        legend={daoLegend}
                                        legendStatus="88% / 12%"
                                        title="#215"
                                        description={daoDescription}
                                        open={voteOpen}
                                        yes={64}
                                        no={22}
                                        voteCreated={voteCreatedOn}
                                        enaction={enactedVote}
                                        support={voteSupport}
                                        quorum={voteQuorum}
                                        supportVolume="73.25"
                                        quorumVolume="41.02"
                                      />
                                    </div>
                                  </div>
                                </div>
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
      </div >
    </>
  );
};

export default Dao;
