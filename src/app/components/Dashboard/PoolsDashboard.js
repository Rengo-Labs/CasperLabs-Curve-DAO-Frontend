//REACT
import React, { useState } from "react";
//CUSTOM STYLING
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
//BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS
//MATERIAL UI
import { Typography } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import { StyledEngineProvider } from "@mui/styled-engine";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

//CONTENT
const cells = [
  "Pool",
  "Base vAPY",
  "Rewards tAPR",
  "Volume",
  "TVL",
  "Balance",
  "USD Profits",
  "CRV Profits",
  "Claimable Tokens",
];
const totalsCells = [
  "Total Balance",
  "Total Daily Profits",
  "Total Weekly Profits",
  "Total Monthly Profits",
  "Total Claimable Tokens",
];

//COMPONENT FUNCTION
const PoolsDashboard = () => {
  //States
  //Handlers

  return (
    <>
      <div className="pb-5 px-4">
        {/* VIEW ADDRESS */}
        <div className="col-12 p-0">
          <StyledEngineProvider injectFirst>
            <TextField
              id="viewAddress"
              label="View Address"
              variant="filled"
              className="w-100"
              sx={{ margin: "1.25rem 0" }}
              // onKeyUp={searchTable}
            />
          </StyledEngineProvider>
        </div>
        <TableContainer>
          <Table aria-label="simple table">
            <TableHead
              sx={{
                backgroundColor: "#e7ebf0",
                paddingLeft: "0.25rem",
                fontWeight: "bold",
              }}
            >
              <TableRow>
                {cells.map((cell) => (
                  <TableCell
                    sx={{
                      fontSize: "1rem",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody></TableBody>
          </Table>
          <div className="row no-gutters justify-content-center my-5">
            <Box sx={{ display: "flex" }}>
              <CircularProgress />
            </Box>
          </div>
          {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))} */}
        </TableContainer>
        <div className="my-5">
          <Divider />
        </div>
        <section className="createPoolContent createPoolform">
          <h3>My Totals</h3>
          <div className="row no-gutters">
            <div className="col-12">
              <TableContainer>
                <Table aria-label="simple table">
                  <TableHead
                    sx={{
                      backgroundColor: "#e7ebf0",
                      paddingLeft: "0.25rem",
                      fontWeight: "bold",
                    }}
                  >
                    <TableRow>
                      {totalsCells.map((cell) => (
                        <TableCell
                          sx={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            textAlign: "center",
                          }}
                        >
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))} */}
                  </TableBody>
                </Table>

                <div className="row no-gutters w-100 mt-3">
                  <Typography
                    variant="body1"
                    gutterBottom
                    component="div"
                    sx={{
                      fontStyle: "italic",
                      width: "100%",
                      textAlign: "center",
                    }}
                  >
                    No data to display, please enter an address
                  </Typography>
                </div>
              </TableContainer>
            </div>
          </div>
        </section>
        <div className="my-5">
          <Divider />
        </div>
        <section className="poolRequirements mt-3">
          <h3 style={{ color: "#000" }}>
            Total Pool Deposits and Daily Volume
          </h3>
          <ul>
            <li>
              Deposits:{" "}
              <span style={{ fontWeight: "bold", color: "#5300E8" }}>
                $16,339,248,540.19
              </span>
            </li>
            <li>
              Daily Volume:{" "}
              <span style={{ fontWeight: "bold", color: "#5300E8" }}>
                $1,272,296,415
              </span>
            </li>
            <li>
              Crypto Volume Share:{" "}
              <span style={{ fontWeight: "bold", color: "#5300E8" }}>
                24.06%
              </span>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
};

export default PoolsDashboard;
