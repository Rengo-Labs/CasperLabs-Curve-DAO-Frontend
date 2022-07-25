// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI ICONS
// MATERIAL UI
import { Accordion, AccordionSummary, Avatar, CardHeader, useTheme } from "@material-ui/core";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// LOGOS
import curveLogo from "../../assets/img/Logo.png";

// CONTENT

// COMPONENT FUNCTION
const VotingPowerDAO = () => {
  // States
  const theme = useTheme();
  // Handlers

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
                    446,108,495.01
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
                    3.64 years
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
                    0.00
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
                // subheader={tokenB.symbol}
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
                    0
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
