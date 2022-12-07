// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
// COMPONENTS
// MATERIAL UI ICONS
// MATERIAL UI
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// LOGOS
import curveLogo from "../../assets/img/Logo.png";
import { Accordion, AccordionSummary, Avatar, CardHeader } from "@mui/material";

// CONTENT

// COMPONENT FUNCTION
const VoteLocksStats = (props) => {
  // States

  // Handlers

  // Content
  props
    ? console.log("props for voteLocksStats: ", props)
    : console.log("There are no props for voteLocksStats");

  return (
    <>
      <div className="row no-gutters">
        <div className="col-12 text-center text-md-left">
          <div>
            <Accordion
              style={{
                borderRadius: "4px 4px 0px 0px ",
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
                    {props.lockedCRV ? (
                      props.lockedCRV
                    ) : (
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#04d7d5" }}
                          ></Spinner>
                        </div>
                      </div>
                    )}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={
                    <Avatar src={curveLogo} aria-label="curve-logo-avatar" />
                  }
                  title={"Total CRV vote-locked (veCRV/CRV):"}
                  // subheader={tokenB.symbol}
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
                    {props.lockedCRVWithouVE ? (
                      props.lockedCRVWithouVE
                    ) : (
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#04d7d5" }}
                          ></Spinner>
                        </div>
                      </div>
                    )}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={<></>}
                  title={
                    "Percentage of total CRV Locked excluding voting escrow:"
                  }
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px ",
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
                    {props.lockedPercentage ? (
                      `${props.lockedPercentage}%`
                    ) : (
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#04d7d5" }}
                          ></Spinner>
                        </div>
                      </div>
                    )}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader
                  avatar={<></>}
                  title={"Percentage of total CRV Locked:"}
                />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px ",
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
                    {props.totalVeCrv ? (
                      props.totalVeCrv
                    ) : (
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#04d7d5" }}
                          ></Spinner>
                        </div>
                      </div>
                    )}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader avatar={<></>} title={"Total veCRV:"} />
              </AccordionSummary>
            </Accordion>
            <Accordion
              style={{
                borderRadius: "0px 0px 4 4 ",
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
                    {props.averageLockTime ? (
                      `${props.averageLockTime} years`
                    ) : (
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{ color: "#04d7d5" }}
                          ></Spinner>
                        </div>
                      </div>
                    )}
                  </Typography>
                }
                aria-controls="panel1bh-content"
                id="panel1bh-header"
              >
                <CardHeader avatar={<></>} title={"Average lock time:"} />
              </AccordionSummary>
            </Accordion>
          </div>
        </div>
      </div>
    </>
  );
};

export default VoteLocksStats;
