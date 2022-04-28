//REACT
import React, { useState } from "react";
//CUSTOM STYLING
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
import "../../../assets/css/common.css";
//BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import crvLogo from "../../../assets/img/cspr.png";
//MATERIAL UI
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";

//CONTENT
const cells = ["Week Start", "Fees"];
const sampleTableData =
  '[{"weekDate":"Thu Apr 21 2022 (in progress)", "Fee": "$0"},{"weekDate":"Thu Apr 14 2022", "Fee": "$544,220,2"},{"weekDate":"Thu Apr 07 2022", "Fee": "$130,942,32"},{"weekDate":"Thu Apr 1 2022 (in progress)", "Fee": "$1,284,815.09"},{"weekDate":"Thu Apr 21 2022 (in progress)", "Fee": "$1,193,045.39"},{"weekDate":"Thu Apr 21 2022 (in progress)", "Fee": "$1,987,890.65"},{"weekDate":"Thu Mar 31 2022", "Fee": "$990,342"},{"weekDate":"Thu Mar 24 2022", "Fee": "$92340923"},{"weekDate":"Thu Mar 17 2022", "Fee": "$340998980"},{"weekDate":"Thu Mar 10 2022", "Fee": "$23498"},{"weekDate":"Thu Mar 3 2022", "Fee": "$99883322"},{"weekDate":"Thu Feb 24 2022", "Fee": "$9234023"},{"weekDate":"Thu Feb 17 2022", "Fee": "$9985654"},{"weekDate":"Thu Apr 21 2022", "Fee": "$77283485"},{"weekDate":"Thu Mar 2022", "Fee": "$607,745.10"},{"weekDate":"Thu Apr 21 2022", "Fee": "$130,942,32"},{"weekDate":"Thu Apr 21 2022", "Fee": "$340998980"},{"weekDate":"Thu Apr 21 2022", "Fee": "$0"},{"weekDate":"Thu Apr 21 2022", "Fee": "$210,659,9"},{"weekDate":"Thu Apr 21 2022", "Fee": "$558,661,1"},{"weekDate":"Thu Apr 21 2022", "Fee": "$990,342"},{"weekDate":"Thu Apr 21 2022", "Fee": "$879,216,001"},{"weekDate":"Thu Apr 21 2022", "Fee": "$0"},{"weekDate":"Thu Apr 21 2022 (in progress)", "Fee": "$607,745.10"},{"weekDate":"Thu Apr 14 2022", "Fee": "$123,543"}]';

var useCrvData = [];
try {
  useCrvData = JSON.parse(sampleTableData);
} catch (expecption) {}

//COMPONENT FUNCTION
const UseCrv = () => {
  //States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();

  //Handlers

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"UseCrv"}
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
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                    <div className="row no-gutters justify-content-center">
                      <Box
                        sx={{
                          width: "100%",
                        }}
                      >
                        <Paper elevation={4}>
                          <div className="py-3 py-md-4">
                            {/* Top Lists */}
                            <div className="px-4 px-xl-3 pb-3 pb-xl-2">
                              <div className="row no-gutters justify-content-center bg-primary">
                                <div className="col-12 col-lg-6 text-white text-center">
                                  <List>
                                    <ListItem disablePadding>
                                      <ListItemText
                                        sx={{ textAlign: "center" }}
                                      >
                                        1&nbsp;
                                        <img
                                          src={crvLogo}
                                          alt="logo"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                          }}
                                        />{" "}
                                        CRV locked for 4 years = 1veCRV
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText
                                        sx={{ textAlign: "center" }}
                                      >
                                        1&nbsp;
                                        <img
                                          src={crvLogo}
                                          alt="logo"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                          }}
                                        />{" "}
                                        CRV locked for 3 years = 0.75veCRV
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText
                                        sx={{ textAlign: "center" }}
                                      >
                                        1&nbsp;
                                        <img
                                          src={crvLogo}
                                          alt="logo"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                          }}
                                        />{" "}
                                        CRV locked for 2 years = 0.50veCRV
                                      </ListItemText>
                                    </ListItem>
                                    <ListItem disablePadding>
                                      <ListItemText
                                        sx={{ textAlign: "center" }}
                                      >
                                        1&nbsp;
                                        <img
                                          src={crvLogo}
                                          alt="logo"
                                          style={{
                                            width: "25px",
                                            height: "25px",
                                          }}
                                        />{" "}
                                        CRV locked for 1 year = 0.25veCRV
                                      </ListItemText>
                                    </ListItem>
                                  </List>
                                  <Typography
                                    variant="h6"
                                    gutterBottom
                                    component="div"
                                    fontWeight={900}
                                  >
                                    <a
                                      href="https://resources.curve.fi/governance/vote-locking-boost#what-are-vecrv"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-decoration-none text-white pl-1"
                                    >
                                      veCRV guide
                                    </a>
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            {/* /Top Lists */}
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12">
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  color={"#000"}
                                  sx={{ textAlign: "center" }}
                                >
                                  veCRV holder/LP ratio:
                                  <span
                                    style={{
                                      color: "#00cc52",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    &nbsp;15.51
                                  </span>
                                </Typography>
                              </div>
                            </div>
                            {/* Info Alert */}
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12">
                                <Stack sx={{ width: "100%" }} spacing={2}>
                                  <Alert
                                    severity="info"
                                    sx={{
                                      justifyContent: "center",
                                    }}
                                  >
                                    Having locked $1 in CRV for 4 years is equal
                                    to having provided $15.51 as an LP
                                  </Alert>
                                </Stack>
                              </div>
                            </div>
                            {/* Info Lists */}
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        veCRV holder APY:&nbsp;
                                      </span>
                                      0.28$
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Yearly fee earnings per 1 veCRV:&nbsp;
                                      </span>
                                      11.33%
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        veCRV balance:&nbsp;
                                      </span>
                                      0&nbsp;
                                      <span>
                                        <Link
                                          to="/"
                                          style={{
                                            color: "inherit",
                                            fontWeight: "bold",
                                            color: "#9C9C9C",
                                          }}
                                        >
                                          Stake CRV
                                        </Link>
                                      </span>
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Average Daily Earnings:&nbsp;
                                      </span>
                                      $329,104.43
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Last Weekly Earnings:&nbsp;
                                      </span>
                                      $2,303,731.00
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Total CRV Locked:&nbsp;
                                      </span>
                                      473,743,113.09
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Total veCRV:&nbsp;
                                      </span>
                                      424,591,808.18
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span className="font-weight-bold">
                                        Next Distribution:&nbsp;
                                      </span>
                                      Wed, 27 Apr 2022 12:09:54 GMT
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                            <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 py-3">
                              <div className="col-12 col-md-6">
                                <List>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span>
                                        <Link
                                          to="/"
                                          style={{
                                            color: "inherit",
                                            fontWeight: "bold",
                                            color: "#9C9C9C",
                                          }}
                                        >
                                          Stake Your CRV
                                        </Link>
                                      </span>
                                    </ListItemText>
                                  </ListItem>
                                  <ListItem disablePadding>
                                    <ListItemText>
                                      <span>
                                        <a
                                          href="https://resources.curve.fi/crv-token/staking-your-crv"
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          style={{
                                            textDecoration: "none",
                                            color: "#9c9c9c",
                                            fontWeight: "bold",
                                          }}
                                        >
                                          Guide to staking CRV
                                        </a>
                                      </span>
                                    </ListItemText>
                                  </ListItem>
                                </List>
                              </div>
                            </div>
                            <Divider />
                          </div>
                        </Paper>
                      </Box>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
          <div className="curve-container">
            <div className="curve-content-banks">
              <fieldset>
                <div className="row no-gutters justify-content-center">
                  <div className="curve-content-wrapper col-12 col-lg-12 col-xl-6">
                    <Box
                      sx={{
                        width: "100%",
                      }}
                    >
                      <Paper elevation={4}>
                        <div className="py-3 py-md-4">
                          <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                            <TableContainer sx={{ p: 3 }}>
                              <Table aria-label="Wise Staking">
                                <TableHead
                                  sx={{
                                    backgroundColor: "#e7ebf0",
                                    paddingLeft: "0.25rem",
                                  }}
                                >
                                  <TableRow
                                    id="curvePoolsTableSort"
                                    //   onClick={handleTableSorting}
                                  >
                                    {cells.map((cell) => (
                                      <TableCell
                                        sx={{
                                          border: 0,
                                          fontWeight: "bold",
                                          fontSize: "1.25rem",
                                        }}
                                      >
                                        {cell}
                                      </TableCell>
                                    ))}
                                  </TableRow>
                                </TableHead>
                                {/* <StyledEngineProvider injectFirst> */}
                                <TableBody id={"curveTableBody"}>
                                  {useCrvData.map((item) => {
                                    return (
                                      <TableRow>
                                        <TableCell key={item.index}>
                                          {item.weekDate}
                                        </TableCell>
                                        <TableCell key={item.index}>
                                          {item.Fee}
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                                {/* </StyledEngineProvider> */}
                              </Table>
                            </TableContainer>
                          </div>
                        </div>
                      </Paper>
                    </Box>
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

export default UseCrv;
