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
import {
  Accordion,
  AccordionSummary,
  Avatar,
  CardHeader,
  useTheme,
} from "@material-ui/core";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
// LOGOS
import curveLogo from "../../assets/img/Logo.png";

// CONTENT

// COMPONENT FUNCTION
const VoteLocksStats = () => {
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
                    288,283,619.93 (33.47%)
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
                    151.64%
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
                    60.26%
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
                    446,108,495.01
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
                    3.64 years
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
