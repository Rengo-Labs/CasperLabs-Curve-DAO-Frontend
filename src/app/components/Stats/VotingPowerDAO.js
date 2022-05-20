// REACT
import React, { useState } from "react";
// CUSTOM STYLES
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI ICONS
// MATERIAL UI
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Divider from "@mui/material/Divider";
import { Avatar } from "@material-ui/core";
// LOGOS
import curveLogo from "../../assets/img/Logo.png";

// CONTENT

// COMPONENT FUNCTION
const VotingPowerDAO = () => {
  // States

  // Handlers

  return (
    <>
      <div className="row no-gutters">
        <div className="col-12 text-center text-md-left">
          <div>
            <List>
              <ListItem disablePadding>
                <ListItemText>
                  <div className="row no-gutters">
                    <Typography
                      variant="body1"
                      gutterBottom
                      component="div"
                      fontWeight={900}
                    >
                      <div className="row no-gutters font-weight-bold">
                        <span>Total&nbsp;</span>
                        <Avatar
                          src={curveLogo}
                          aria-label="curve-logo-avatar"
                        />
                        &nbsp;CRV vote-locked:&nbsp;
                      </div>
                    </Typography>
                    <Typography variant="body2" gutterBottom component="div">
                      288,283,619.93 (33.47%)
                    </Typography>
                  </div>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <span className="font-weight-bold">
                    Percentage of total CRV Locked excluding voting
                    escrow:&nbsp;
                  </span>
                  125.21%
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <span className="font-weight-bold">
                    Percentage of total CRV Locked:&nbsp;
                  </span>
                  Percentage of total CRV Locked:
                </ListItemText>
              </ListItem>
            </List>
          </div>
          <div className="w-100 my-4">
            <Divider />
          </div>
          <div className="mt-2">
            <List>
              <ListItem disablePadding>
                <ListItemText>
                  <span className="font-weight-bold">Total veCRV:&nbsp;</span>
                  &nbsp;446,108,495.01
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <span className="font-weight-bold">
                    Average lock time:&nbsp;
                  </span>
                  &nbsp;3.64 years
                </ListItemText>
              </ListItem>
            </List>
          </div>
          <div className="w-100 my-4">
            <Divider />
          </div>
          <div className="mt-2">
            <List>
              <ListItem disablePadding>
                <ListItemText>
                  <div className="row no-gutters">
                    <Typography
                      variant="body1"
                      gutterBottom
                      component="div"
                      fontWeight={900}
                    >
                      <div className="row no-gutters font-weight-bold">
                        <Avatar
                          src={curveLogo}
                          aria-label="curve-logo-avatar"
                        />
                        &nbsp;CRV Balance:&nbsp;
                      </div>
                    </Typography>
                    <Typography variant="body2" gutterBottom component="div">
                      0.00
                    </Typography>
                  </div>
                </ListItemText>
              </ListItem>
              <ListItem disablePadding>
                <ListItemText>
                  <div className="row no-gutters">
                    <Typography
                      variant="body1"
                      gutterBottom
                      component="div"
                      fontWeight={900}
                    >
                      <div className="row no-gutters font-weight-bold">
                        <Avatar
                          src={curveLogo}
                          aria-label="curve-logo-avatar"
                        />
                        &nbsp;My CRV Locked:&nbsp;
                      </div>
                    </Typography>
                    <Typography variant="body2" gutterBottom component="div">
                      0
                    </Typography>
                  </div>
                </ListItemText>
              </ListItem>
            </List>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingPowerDAO;
