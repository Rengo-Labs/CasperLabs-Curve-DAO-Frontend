// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
// COMPONENTS
import PoolsTableAll from "../Tables/PoolsTableAll";
// MATERIAL UI
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination } from "@mui/material";
import { StyledEngineProvider } from "@mui/styled-engine";

// Content
const cells = ["Pool", "Base vAPY", "Rewards tAPR", "Volume", "TVL"];

// COMPONENT FUNCTION
const CurvePools = () => {
  //States
  const [stakes, setStakes] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  //   Event Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="curve-container">
        <fieldset>
          <legend>Curve Pools</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <Paper elevation={4}>
                {/* TABLE */}
                <PoolsTableAll tab="all" />
              </Paper>
            </div>
          </div>
        </fieldset>
      </div>
    </>
  );
};

export default CurvePools;
