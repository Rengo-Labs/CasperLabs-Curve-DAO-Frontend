// REACT
import React from "react";
// CUSTOM STYLES
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI ICONS
import HelpIcon from "@mui/icons-material/Help";
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

// CONTENT

// COMPONENT FUNCTION
const CurrencyReserves = () => {
  // States

  // Handlers

  return (
    <>
      <div className="row no-gutters align-content-center">
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Paper elevation={4}>
            <div className="py-5 px-4">
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                <div className="col-12">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#5300e8" }}
                  >
                    Currency Reserves
                  </Typography>
                </div>
                <div className="col-12 col-md-6 text-center text-md-left">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">USDT:&nbsp;</span>
                        288,283,619.93 (33.47%)
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">wBTC:&nbsp;</span>
                        7,072.36 (33.29%)
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">WCSPR:&nbsp;</span>
                        95,479.4 (33.24%)
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">
                          USD total:&nbsp;
                        </span>
                        $861m
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
                <div className="col-12 col-md-6 text-center text-md-left">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">Fee:&nbsp;</span>
                        0.136%
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">
                          Admin Fee:&nbsp;
                        </span>
                        50.000% of 0.136%
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
                <div className="col-12 col-md-6 text-center text-md-left">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">
                          Virtual price:&nbsp;
                        </span>
                        <span>
                          <Tooltip title="1.0102897016513703">
                            <span>1.0103</span>
                          </Tooltip>
                        </span>
                        <Tooltip title="Average Dollar value of Pool Taken">
                          <IconButton>
                            <HelpIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
                <div className="col-12 col-md-6 text-center text-md-left">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold text-center text-md-left">
                          Liquidity utilization:&nbsp;
                        </span>
                        9.64%{" "}
                        <Tooltip title="24h Volume/Liquidity ratio">
                          <IconButton>
                            <HelpIcon />
                          </IconButton>
                        </Tooltip>
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">
                          Daily USD volume:&nbsp;
                        </span>
                        $83,025,350.85
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
              </div>
              <Divider />
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 mt-3">
                <div className="col-12 col-md-6">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#5300e8" }}
                  >
                    CRV Details:
                  </Typography>
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">Min APY:&nbsp;</span>
                        3.593%
                      </ListItemText>
                    </ListItem>
                    <ListItem disablePadding>
                      <ListItemText>
                        <span className="font-weight-bold">Max APY:&nbsp;</span>
                        8.982%
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
              </div>
              <Divider />
              <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 mt-3">
                <div className="col-12">
                  <Typography
                    variant="h6"
                    gutterBottom
                    component="div"
                    sx={{ color: "#5300e8" }}
                  >
                    Price Data
                  </Typography>
                </div>
                <div className="col-12 col-md-6">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Box className="font-weight-bold">
                          Price Oracle:&nbsp;
                        </Box>
                        <Box>
                          <span>wBTC:&nbsp;</span>
                          40462.63190414878
                        </Box>
                        <Box>
                          <span>WETH:&nbsp;</span>
                          3003.1796121051784
                        </Box>
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
                <div className="col-12 col-md-6">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Box className="font-weight-bold">
                          Price Scale:&nbsp;
                        </Box>
                        <Box>
                          <span>wBTC:&nbsp;</span>
                          39652.50997037234
                        </Box>
                        <Box>
                          <span>WETH:&nbsp;</span>
                          2934.6133730298957
                        </Box>
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
                <div className="col-12 col-md-6">
                  <List>
                    <ListItem disablePadding>
                      <ListItemText>
                        <Box className="font-weight-bold">
                          Pool Parameters:&nbsp;
                        </Box>
                        <Box>
                          <span>Gamma:&nbsp;</span>
                          0.0000210000
                        </Box>
                        <Box>
                          <span>A:&nbsp;</span>
                          1707629
                        </Box>
                      </ListItemText>
                    </ListItem>
                  </List>
                </div>
              </div>
            </div>
          </Paper>
        </Box>
      </div>
    </>
  );
};

export default CurrencyReserves;
