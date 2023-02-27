import {
  Avatar,
  Table,
  tbody,
  td,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  tr,
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
    // <TableContainer>
      <table className="table table-bordered table-striped" aria-label="Gauge Weight Vote History">
        <thead 
          className="thead-dark"
          style={{
            backgroundColor: "#e7ebf0",
            paddingLeft: "0.25rem",
          }}
        >
          <tr id="GWVoteHistoryTableSort">
            {/* {votingHistoryCells.map((cell) => ( */}
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Time
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Voter
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              veCRV
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Total veCRV
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Gauge
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Weight
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              Total Weight
            </th>
            <th
              style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}
            >
              <PieChartIcon />
            </th>
          </tr>
        </thead>
        <tbody id={"GWVoteHistorytbody"} style={{color:"#1E1E1F"}}>
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
                    <tr key={key}>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Tooltip title={item.time}>
                          <Avatar
                            style={{
                              height: "20px",
                              width: "20px",
                            }}
                            src={clock}
                            aria-label="clock"
                          />
                        </Tooltip>
                      </td>
                      <td
                        //key={item.user}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#5300E8",
                          }}
                          to="/"
                          className="tdLink font-weight-bold"
                        >
                          {helpers.shortenAddress(item.user)}
                        </Link>
                      </td>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {(item.veCRV / 1e9).toFixed(2)}
                      </td>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {helpers.formatNumber(item.totalveCRV / 1e9)}
                      </td>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#5300E8",
                          }}
                          to="/"
                          className="tdLink font-weight-bold"
                        >
                          {/* {getGaugeAddress(item.gauge)} */}
                          {helpers.shortenAddress(item.gauge)}
                        </Link>
                      </td>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        <Link
                          style={{
                            color: "#5300E8",
                          }}
                          to="/"
                          className="tdLink"
                        >
                          {item.weight / 100}%
                        </Link>
                      </td>
                      <td
                        //key={item.index}
                        style={{
                          textAlign: "center",
                          border: "0.6px solid #e0e0e0",
                        }}
                      >
                        {(item.total_weight / 1e9).toFixed(2)}
                      </td>
                      <td
                        //key={item.index}
                        style={{
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
                      </td>
                    </tr>
                  );
                })
            : props.gaugeWeightData.map((item, key) => {
                //filteredVotes?.map((item) => {
                console.log("this runs!");
                return (
                  <tr key={key}>
                    <td
                      //key={item.index}
                      style={{ textAlign: "center" }}
                    >
                      <Tooltip title={item.time}>
                        <Avatar
                          style={{
                            height: "20px",
                            width: "20px",
                          }}
                          src={clock}
                          aria-label="clock"
                        />
                      </Tooltip>
                    </td>
                    <td
                      //key={item.user}
                      style={{ textAlign: "center" }}
                    >
                      <Link
                        style={{
                          color: "#5300E8",
                          border: "0.6px solid #e0e0e0",
                        }}
                        to="/"
                        className="tdLink font-weight-bold"
                      >
                        {helpers.shortenAddress(item.user)}
                      </Link>
                    </td>
                    <td
                      //key={item.index}
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.veCRV / 1e9).toFixed(2)}
                    </td>
                    <td
                      //key={item.index}
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {helpers.formatNumber(item.totalveCRV / 1e9)}
                    </td>
                    <td
                      //key={item.index}
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#5300E8",
                        }}
                        to="/"
                        className="tdLink font-weight-bold"
                      >
                        {/* {getGaugeAddress(item.gauge)} */}
                        {helpers.shortenAddress(item.gauge)}
                      </Link>
                    </td>
                    <td
                      //key={item.index}
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#5300E8",
                        }}
                        to="/"
                        className="tdLink"
                      >
                        {item.weight / 100}%
                      </Link>
                    </td>
                    <td
                      //key={item.index}
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.total_weight / 1e9).toFixed(2)}
                    </td>
                    <td
                      //key={item.index}
                      style={{ textAlign: "center" }}
                    >
                      <PieChartIcon
                        onClick={() => {
                          props.handleTableGraph(item);
                        }}
                        style={{
                          color: "#D29300",
                        }}
                      />
                    </td>
                  </tr>
                );
              })}
        </tbody>
        <tfoot>
          <tr>
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
          </tr>
        </tfoot>
      </table>
  );
};

export default VotingHistoryTable;
