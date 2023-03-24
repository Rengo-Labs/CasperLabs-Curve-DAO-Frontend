import PieChartIcon from "@mui/icons-material/PieChart";
import {
  Avatar, TablePagination, Tooltip
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import clock from "../../assets/img/clock.png";
import * as helpers from "../../assets/js/helpers";
import TablePaginationActions from "../pagination/TablePaginationActions";

const VotingHistoryTable = (props) => {
  console.log("props.vote", props.vote);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  return (
    <table className="table table-bordered table-striped" aria-label="Gauge Weight Vote History">
      <thead
        className="thead-light"
        style={{
          backgroundColor: "#e7ebf0",
          paddingLeft: "0.25rem",
        }}
      >
        <tr id="GWVoteHistoryTableSort">
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
      <tbody id={"GWVoteHistorytbody"} style={{ color: "#1E1E1F" }}>
        {props.vote?.myVotes && props.vote?.gaugeVotes ? (
          props.showVotes
            ? props.vote?.myVotes
              .map((item, key) => {
                console.log("In votes by time");
                return (
                  <tr key={key}>
                    <td
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
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                        }}
                        to="/"
                        className="tdLink font-weight-bold"
                      >
                        {helpers.shortenAddress(item.user)}
                      </Link>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.veCRV / 1e9).toFixed(2)}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {helpers.formatNumber(item.totalveCRV / 1e9)}
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                        }}
                        to="/"
                        className="tdLink font-weight-bold"
                      >
                        {helpers.shortenAddress(item.gauge)}
                      </Link>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      <Link
                        style={{
                          color: "#1976d2",
                        }}
                        to="/"
                        className="tdLink"
                      >
                        {item.weight / 100}%
                      </Link>
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        border: "0.6px solid #e0e0e0",
                      }}
                    >
                      {(item.total_weight / 1e9).toFixed(2)}
                    </td>
                    <td
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
            : props.vote?.gaugeVotes.map((item, key) => {
              console.log("this runs!");
              return (
                <tr key={key}>
                  <td
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
                    style={{ textAlign: "center" }}
                  >
                    <Link
                      style={{
                        color: "#1976d2",
                        border: "0.6px solid #e0e0e0",
                      }}
                      to="/"
                      className="tdLink font-weight-bold"
                    >
                      {helpers.shortenAddress(item.user)}
                    </Link>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "0.6px solid #e0e0e0",
                    }}
                  >
                    {(item.veCRV / 1e9).toFixed(2)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "0.6px solid #e0e0e0",
                    }}
                  >
                    {helpers.formatNumber(item.totalveCRV / 1e9)}
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "0.6px solid #e0e0e0",
                    }}
                  >
                    <Link
                      style={{
                        color: "#1976d2",
                      }}
                      to="/"
                      className="tdLink font-weight-bold"
                    >
                      {helpers.shortenAddress(item.gauge)}
                    </Link>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "0.6px solid #e0e0e0",
                    }}
                  >
                    <Link
                      style={{
                        color: "#1976d2",
                      }}
                      to="/"
                      className="tdLink"
                    >
                      {item.weight / 100}%
                    </Link>
                  </td>
                  <td
                    style={{
                      textAlign: "center",
                      border: "0.6px solid #e0e0e0",
                    }}
                  >
                    {(item.total_weight / 1e9).toFixed(2)}
                  </td>
                  <td
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
            })
        ) : (
          null
        )}
      </tbody>
      <tfoot>
        <tr>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
            colSpan={12}
            count={props.vote?.myVotes && props.vote?.gaugeVotes ?
              props.showVotes ? props.vote?.myVotes.length : props.vote?.gaugeVotes.length : 0}
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
