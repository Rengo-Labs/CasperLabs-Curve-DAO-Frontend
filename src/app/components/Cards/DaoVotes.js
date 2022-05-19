// REACT
import React, { useState } from "react";
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

// CONTENT
const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

// COMPONENT FUNCTION
const DaoVotes = (props) => {
  // States

  // Handlers

  return (
    <>
      <Card sx={{ width: 250 }}>
        <CardContent>
          {/* Legend */}
          <div className="row no-gutters justify-content-center w-100 mb-0">
            <Typography variant="h5" component={"div"}>
              <span style={{ fontWeight: "" }}>{props.legend}</span>
            </Typography>
          </div>
          <div className="row no-gutters justify-content-center w-100 mb-3">
            <Typography
              variant="bod2"
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
          <div className="row no-gutters mb-3">
            <section style={{ width: "220px", fontSize: "0.75rem" }}>
              <a
                style={{
                  textDecoration: "none",
                  color: "#9C9C9C",
                }}
                href="#"
                rel="noopener noreferrer nofollow"
                target="_blank"
              >
                {props.description}
              </a>
            </section>
          </div>
          {/* Time Elapsed - if vote is open */}
          {props.open ? (
            <div className="row no-gutters w-100 mb-3">
              <Typography variant="body1" component={"div"}>
                <span>
                  <HourglassTopIcon />
                </span>
                <span className="p-2">vote is open</span>
              </Typography>
            </div>
          ) : (
            <div className="row no-gutters w-100 mb-3">
              <Typography variant="body1" component={"div"}>
                <span className="p-2">&nbsp;</span>
              </Typography>
            </div>
          )}
          {/* Progress Bars */}
          {/* Yes */}
          <div className="row no-gutters w-100">
            <div className="col-12">
              <div className="row no-gutters justify-content-between">
                <div className="col-6">Yes</div>
                <div className="col-6 text-right">{`${props.yes}%`}</div>
              </div>
            </div>
            <div
              className="progress"
              style={{ height: "30px", width: "100%", borderRadius: 0 }}
            >
              <div
                className="progress-bar bg-success"
                role="progressbar"
                style={{ width: `${props.yes}%` }}
                aria-valuenow={props.yes}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>
          {/* No */}
          <div className="row no-gutters w-100 mb-3">
            <div className="col-12">
              <div className="row no-gutters justify-content-between">
                <div className="col-6">No</div>
                <div className="col-6 text-right">{`${props.no}%`}</div>
              </div>
            </div>
            <div
              className="progress"
              style={{ height: "30px", width: "100%", borderRadius: 0 }}
            >
              <div
                className="progress-bar bg-danger"
                role="progressbar"
                style={{ width: `${props.no}%` }}
                aria-valuenow={props.no}
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
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
              <div className="col-12 text-success">
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
              <div className="col-12 text-danger">
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
                  <div className="col-8 text-success">
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
                  <div className="col-8 text-danger">
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
                  <div className="col-8 text-danger">
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
      </Card>
    </>
  );
};

export default DaoVotes;
