import {
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import PieChartIcon from "@mui/icons-material/PieChart";
import clock from "../../assets/img/clock.png";
import { Link } from "react-router-dom";
import * as helpers from "../../assets/js/helpers";
import TablePaginationActions from "../pagination/TablePaginationActions";

const VotingHistoryTable = (props) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    //setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    //setPage(0);
  };

  return (
    <TableContainer>
      <Table
        aria-label="Gauge Weight Vote History"
        style={{ border: "0.6px solid #e0e0e0" }}
      >
        <TableHead
          sx={{
            backgroundColor: "#e7ebf0",
            paddingLeft: "0.25rem",
          }}
        >
          <TableRow id="GWVoteHistoryTableSort">
            {/* {votingHistoryCells.map((cell) => ( */}
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Time</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Voter</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>veCRV</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Total veCRV</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Gauge</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Weight</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <Typography>Total Weight</Typography>
            </TableCell>
            <TableCell
              sx={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <PieChartIcon />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody id={"GWVoteHistoryTableBody"}>
          {props.showVotes
            ? props.gaugeVoteTime
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((value) => {
                  if (
                    props.selectedGauge !== "Select a Gauge" &&
                    props.selectedGauge !== " "
                  ) {
                    if (props.selectedGauge === value.gauge) {
                      return value;
                    }
                  } else {
                    return value;
                  }
                })
                .map((item, key) => {
                  console.log("In votes by time");
                  return (
                    <TableRow key={key}>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title={item.time}>
                          <Avatar
                            sx={{
                              height: "20px",
                              width: "20px",
                            }}
                            src={clock}
                            aria-label="clock"
                          />
                        </Tooltip>
                      </TableCell>
                      <TableCell
                        //key={item.user}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#1976d2",
                          }}
                          to="/"
                          className="tableCellLink font-weight-bold"
                        >
                          {helpers.shortenAddress(item.user)}
                        </Link>
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {(item.veCRV / 1e9).toFixed(2)}
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {helpers.formatNumber(item.totalveCRV / 1e9)}
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#1976d2",
                          }}
                          to="/"
                          className="tableCellLink font-weight-bold"
                        >
                          {/* {getGaugeAddress(item.gauge)} */}
                          {helpers.shortenAddress(item.gauge)}
                        </Link>
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#1976d2",
                          }}
                          to="/"
                          className="tableCellLink"
                        >
                          {item.weight / 100}%
                        </Link>
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {(item.total_weight / 1e9).toFixed(2)}
                      </TableCell>
                      <TableCell
                        //key={item.index}
                        sx={{
                          textAlign: "center",
                        }}
                      >
                        <PieChartIcon
                          onClick={() => {
                            props.handleTableGraph(item);
                          }}
                          style={{
                            color: "#D29300",
                          }}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })
            : props.gaugeWeightData.map((item, key) => {
                //filteredVotes?.map((item) => {
                console.log("this runs!");
                return (
                  <TableRow key={key}>
                    <TableCell
                      //key={item.index}
                      sx={{ textAlign: "center" }}
                    >
                      <Tooltip title={item.time}>
                        <Avatar
                          sx={{
                            height: "20px",
                            width: "20px",
                          }}
                          src={clock}
                          aria-label="clock"
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      //key={item.user}
                      sx={{ textAlign: "center" }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                          border: "0.6px solid #e0e0e0",
                        }}
                        to="/"
                        className="tableCellLink font-weight-bold"
                      >
                        {helpers.shortenAddress(item.user)}
                      </Link>
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.veCRV / 1e9).toFixed(2)}
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {helpers.formatNumber(item.totalveCRV / 1e9)}
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                        }}
                        to="/"
                        className="tableCellLink font-weight-bold"
                      >
                        {/* {getGaugeAddress(item.gauge)} */}
                        {helpers.shortenAddress(item.gauge)}
                      </Link>
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                        }}
                        to="/"
                        className="tableCellLink"
                      >
                        {item.weight / 100}%
                      </Link>
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.total_weight / 1e9).toFixed(2)}
                    </TableCell>
                    <TableCell
                      //key={item.index}
                      sx={{ textAlign: "center" }}
                    >
                      <PieChartIcon
                        onClick={() => {
                          props.handleTableGraph(item);
                        }}
                        style={{
                          color: "#D29300",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
              colSpan={12}
              count={props.gaugeWeightVoteData.length}
              rowsPerPage={rowsPerPage}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "rows per page",
                },
                native: true,
              }}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
              sx={{
                backgroundColor: "#e7ebf0",
              }}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default VotingHistoryTable;
