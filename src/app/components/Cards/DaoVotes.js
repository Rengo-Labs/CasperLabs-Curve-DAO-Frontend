// REACT
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
// MATERIAL UI
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
// MATERIAL UI ICONS
import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import VoteInfoProgressBar from "../Progress bar/VoteInfoProgressBar";
import { Paper } from "@mui/material";
// GRAPHQL
import { useQuery, gql } from "@apollo/client";
// UTILS
import { decorateVotes } from "../../assets/js/voteStore";
import { truncate } from "../../assets/js/helpers";

// CONTENT
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const CountDownTimer = () => {
  let year = new Date().getFullYear();
  const difference = +new Date(`11/30/${year}`) - +new Date();

  let timeLeft = {};
  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  }

  return timeLeft;
};

let defaultAccount = "Default Account";

// const getUserVotes = gql`
//   fragment vote_cast on Votes {
//     casts(where: { voter: "${defaultAccount}" }) {
//       id
//       voteId
//       voteNum
//       voter
//       supports
//       voterStake
//     }
//   }
// `;

// const GET_VOTES_DATA = gql`
//   query {
//     votes {
//       id
//       appAddress
//       orgAddress
//       creator
//       metadata
//       executed
//       startDate
//       snapshotBlock
//       supportRequiredPct
//       minAcceptQuorum
//       yea
//       nay
//       votingPower
//       script
//       creatorVotingPower
//       transactionHash
//       castCount
//       voteCountSeq
//       # {getUserVotes !== null ? getUserVotes : ''}
//     }
//   }
// `;

// COMPONENT FUNCTION
const DaoVotes = (props) => {
  // States
  // const [votes, setVotes] = useState();
  const [timeLeft, setTimeLeft] = useState(CountDownTimer());
  const history = useHistory();

  // // Queries
  // const { error, loading, data } = useQuery(GET_VOTES_DATA);
  // console.log("this is data of gql: ", data);

  // let loadData = () => {
  //   return new Promise((res, rej) => {
  //     data ? res(setVotes(data.votes)) : rej(error);
  //   });
  // };

  // const resolveData = async () => {
  //   try {
  //     await loadData();
  //   } catch (error) {
  //     console.log("this is promise error: ", error);
  //   }
  // };

  // // Side Effects
  // useEffect(() => {
  //   resolveData();
  // }, [data]);

  // console.log("the votes are: ", votes);
  // let votesArray = decorateVotes(votes);
  // console.log("votes after processing: ", votesArray);
  // console.log("metadata: ", metadata);

  // Handlers

  // Life Cycle
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(CountDownTimer());
    }, 1000);

    return () => clearTimeout(timer);
  });

  const timerComponents = [];
  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval]) {
      return;
    }

    timerComponents.push(
      <span>
        {timeLeft[interval]} {interval}{" "}
      </span>
    );
  });

  return (
    <>
      <Paper
        elevation={4}
        sx={{ minHeight: "585px", backgroundColor: "rgb(231, 235, 240)" }}
      >
        <CardContent>
          {/* Legend */}
          <div className="row no-gutters justify-content-center w-100 mb-0">
            <Typography variant="h5" component={"div"}>
              <span style={{ fontWeight: "" }}>{props.legend}</span>
            </Typography>
          </div>
          <div className="row no-gutters justify-content-center w-100 mb-3">
            <Typography
              variant="body2"
              gutterBottom
              component={"div"}
              fontSize={"1rem"}
              color={"#714CFE"}
            >
              ({props.legendStatus})
            </Typography>
          </div>
          {/* Title */}
          <div className="row no-gutters w-100">
            <Typography variant="h6" component={"div"}>
              <a
                style={{
                  fontWeight: "bold",
                  textDecoration: "none",
                  color: "#000",
                }}
                href="#"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {props.title}
              </a>
            </Typography>
          </div>
          {/* Description */}
          <div className="row no-gutters mb-3" role="button">
            <section style={{ width: "220px", fontSize: "0.75rem" }}>
              <a
                style={{
                  textDecoration: "none",
                  color: "#212529",
                  cursor: "pointer",
                }}
                onClick={() => {
                  history.push("/voteInfo");
                }}
                // rel="noopener noreferrer nofollow"
                // target="_blank"
              >
                {props.description}
              </a>
            </section>
          </div>
          {/* Time Elapsed - if vote is open */}
          {timerComponents.length ? (
            <>
              <div className="row no-gutters w-100 mb-3">
                <Typography variant="body1" component={"div"}>
                  <span>
                    <HourglassTopIcon />
                  </span>
                  <span className="p-2">vote is open</span>
                </Typography>
              </div>
              <div className="row no-gutters w-100 mb-3">
                <Typography variant="body1" component={"div"}>
                  <span>{timerComponents}</span>
                </Typography>
              </div>
            </>
          ) : (
            <div className="row no-gutters w-100 mb-3">
              <Typography variant="body1" component={"div"}>
                <span>
                  <HourglassTopIcon />
                </span>
                <span className="p-2">vote is Closed</span>
              </Typography>
            </div>
          )}
          {/* Progress Bars */}
          {/* Yes */}
          <VoteInfoProgressBar
            width="w-100"
            polarQestion="Yes"
            percent={props.yes}
            color="#5300E8"
          />
          {/* No */}
          <div className="mb-3">
            <VoteInfoProgressBar
              width="w-100"
              polarQestion="No"
              percent={props.no}
              color="#9fade6"
            />
          </div>
          {/* Time and Date vote Created */}
          <div className="row no-gutters w-100 mb-3">
            <div className="col-12">
              <Typography variant="body2" component={"div"}>
                Vote Created On:
              </Typography>
            </div>
            <div className="col-12">
              <Typography variant="body1" component={"div"}>
                <span>
                  <AccessTimeIcon />
                </span>
                <span className="p-2">{props.voteCreated}</span>
              </Typography>
            </div>
          </div>
          {/* Enaction */}
          {props.enaction ? (
            <div className="row no-gutters w-100 mb-3">
              <div className="col-12" style={{ color: "#019267" }}>
                <Typography variant="body1" component={"div"}>
                  <span>
                    <CheckIcon />
                  </span>
                  <span className="p-2">Passed (enacted)</span>
                </Typography>
              </div>
            </div>
          ) : (
            <div className="row no-gutters w-100 mb-3">
              <div className="col-12" style={{ color: "#de1738" }}>
                <Typography variant="body1" component={"div"}>
                  <span>
                    <CloseIcon />
                  </span>
                  <span className="p-2">Rejected (No quorum)</span>
                </Typography>
              </div>
            </div>
          )}
          {/* Support and Quorum*/}
          <div className="row no-gutters w-100 mb-3">
            {/* Support */}
            <div className="col-12">
              {props.support ? (
                <div className="row no-gutters">
                  <div className="col-4">
                    <Typography variant="body1" component={"div"}>
                      Support:
                    </Typography>
                  </div>
                  <div className="col-8" style={{ color: "#019267" }}>
                    <Typography variant="body1" component={"div"}>
                      <span className="p-2">{`${props.supportVolume}%`}</span>
                      <span>
                        <CheckIcon />
                      </span>
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="row no-gutters w-100">
                  <div className="col-4">
                    <Typography variant="body1" component={"div"}>
                      Support:
                    </Typography>
                  </div>
                  <div className="col-8" style={{ color: "#de1738" }}>
                    <Typography variant="body1" component={"div"}>
                      <span className="p-2">{`${props.supportVolume}%`}</span>
                      <span>
                        <CloseIcon />
                      </span>
                    </Typography>
                  </div>
                </div>
              )}
            </div>
            {/* Quorum */}
            <div className="col-12">
              {props.quorum ? (
                <div className="row no-gutters">
                  <div className="col-4">
                    <Typography variant="body1" component={"div"}>
                      Quorum:
                    </Typography>
                  </div>
                  <div className="col-8 text-success">
                    <Typography variant="body1" component={"div"}>
                      <span className="p-2">{`${props.quorumVolume}%`}</span>
                      <span>
                        <CheckIcon />
                      </span>
                    </Typography>
                  </div>
                </div>
              ) : (
                <div className="row no-gutters w-100">
                  <div className="col-4">
                    <Typography variant="body1" component={"div"}>
                      Quorum:
                    </Typography>
                  </div>
                  <div className="col-8" style={{ color: "#de1738" }}>
                    <Typography variant="body1" component={"div"}>
                      <span className="p-2">{`${props.quorumVolume}%`}</span>
                      <span>
                        <CloseIcon />
                      </span>
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
        {/* <CardActions>
        </CardActions> */}
      </Paper>
    </>
  );
};

export default DaoVotes;
