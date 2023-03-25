import React, { useEffect, useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/css/common.css";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import VoteDistributionModal from "../Modals/VoteDistributionModal";
import { useQuery, gql } from "@apollo/client";
import { Spinner } from "react-bootstrap";
import { shortenAddress } from "../../assets/js/helpers";

const getCasts = gql`
  query castById($id: String) {
    castsByVoteId(voteId: $id) {
      id
      supports
      vote {
        id
        voteNum
      }
      voter {
        id
        address
      }
      voterStake
    }
  }
`;

function ShowVoters(props) {
  const [openFor, setOpenFor] = useState(false);
  const [openAgainst, setOpenAgainst] = useState(false);
  const [casts, setCasts] = useState();

  console.log("id from props: ", props.voteId);
  let id = props.voteId;
  const { error, loading, data } = useQuery(getCasts, {
    variables: {
      id,
    },
  });
  console.log("this is data of gql: ", data);

  let loadData = () => {
    return new Promise((res, rej) => {
      data ? res(setCasts(data.castsByVoteId)) : rej(error);
    });
  };

  const resolveData = async () => {
    try {
      await loadData();
    } catch (error) {
      console.log("this is promise error: ", error);
    }
  };
  const handleOpenFor = () => setOpenFor(true);
  const handleCloseFor = () => setOpenFor(false);
  const handleOpenAgainst = () => setOpenAgainst(true);
  const handleCloseAgainst = () => setOpenAgainst(false);
let rows = [];
  let rowsAgainst = [];
  let optionsForLabels = [];
  let optionsAgainstLabels = [];
  let optionsAgainstSeries = [];
  let optionsForSeries = [];

  if (casts !== undefined) {
    for (let i = 0; i < casts.length; i++) {
      if (!casts[i].supports) {
        rowsAgainst = [
          ...rowsAgainst,
          {
            address: casts[i].voter.address,
            stakes: casts[i].voterStake,
            id: casts[i].id,
            index: i,
          },
        ];
      } else {
        rows = [
          ...rows,
          {
            address: casts[i].voter.address,
            stakes: casts[i].voterStake,
            id: casts[i].id,
            index: i,
          },
        ];
      }
    }
    optionsAgainstLabels = rowsAgainst.map((row) => row.address);
    optionsAgainstSeries = rowsAgainst.map((row) => row.stakes);
    optionsForLabels = rows.map((row) => row.address);
    optionsForSeries = rows.map((row) => row.stakes);
  }
  useEffect(() => {
    resolveData();
  }, [data]);

  if (casts !== undefined) {
    console.log("Cast in favor: ", optionsForLabels);
    console.log("Cast in opposition: ", optionsAgainstSeries);
  }

  return (
    <>
      <div className="row no-gutters mx-3 my-4">
        <div className="col-lg-5 d-xs-block">
          <div
            className="d-flex justify-content-between"
            style={{ color: "#019267" }}
          >
            <div className="d-flex">
              <Typography className="pr-2">For</Typography>
              <CheckCircleIcon />
            </div>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#019267",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={handleOpenFor}
            >
              Show Chart
            </Button>
          </div>
          <VoteDistributionModal
            for={true}
            open={openFor}
            close={handleCloseFor}
            click={handleCloseFor}
            title="For Vote Distribution"
            labels={optionsForLabels}
            series={[30, 70]}
            options={rows}
          />
          <TableContainer component={Paper} elevation={5} className="mt-3">
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Voters
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    veCRV
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {casts !== undefined ? (
                  rows.length ? (
                    rows.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          <a
                            href="#"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(0, 0, 0, 0.87)" }}
                          >
                            {shortenAddress(row.address)}
                          </a>
                        </TableCell>
                        <TableCell align="center">
                          {(row.stakes / 1e9).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          width: "100%",
                        }}
                        colSpan={2}
                      >
                        <div className="row no-gutters justify-content-center align-items-center w-100">
                          <div className="col-12 text-center">
                            <Typography
                              variant="p"
                              gutterBottom
                              component="div"
                            >
                              <span>No one has voted yet</span>
                            </Typography>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        width: "100%",
                      }}
                      colSpan={2}
                    >
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{
                              color: "#1976d2",
                            }}
                          ></Spinner>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="col-5 ml-sm-0 ml-md-5  mt-sm-3 mt-lg-0">
          <div
            className="d-flex justify-content-between"
            style={{ color: "#de1738" }}
          >
            <div className="d-flex">
              <Typography className="pr-2">Against</Typography>
              <CancelIcon />
            </div>
            <Button
              variant="contained"
              size="small"
              style={{
                backgroundColor: "#de1738",
                color: "white",
                borderRadius: "4px",
              }}
              onClick={handleOpenAgainst}
            >
              Show Chart
            </Button>
          </div>
          <VoteDistributionModal
            for={false}
            open={openAgainst}
            close={handleCloseAgainst}
            click={handleCloseAgainst}
            title="Against Vote Distribution"
            labels={optionsAgainstLabels}
            series={[60, 40]}
            options={rowsAgainst}
          />
          <TableContainer component={Paper} elevation={5} className="mt-3">
            <Table sx={{ minWidth: 100 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    Voters
                  </TableCell>
                  <TableCell sx={{ fontWeight: "bold", textAlign: "center" }}>
                    veCRV
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {casts !== undefined ? (
                  rowsAgainst.length ? (
                    rowsAgainst.map((row) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell align="center">
                          <a
                            href="#"
                            rel="noopener noreferrer"
                            style={{ color: "rgba(0, 0, 0, 0.87)" }}
                          >
                            {shortenAddress(row.address)}
                          </a>
                        </TableCell>
                        <TableCell align="center">
                          {(row.stakes / 1e9).toFixed(2)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow
                      sx={{
                        "&:last-child td, &:last-child th": { border: 0 },
                      }}
                    >
                      <TableCell
                        sx={{
                          textAlign: "center",
                          width: "100%",
                        }}
                        colSpan={2}
                      >
                        <div className="row no-gutters justify-content-center align-items-center w-100">
                          <div className="col-12 text-center">
                            <Typography
                              variant="p"
                              gutterBottom
                              component="div"
                            >
                              <span>No one has voted Against</span>
                            </Typography>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                ) : (
                  <TableRow>
                    <TableCell
                      sx={{
                        textAlign: "center",
                        width: "100%",
                      }}
                      colSpan={2}
                    >
                      <div className="row no-gutters justify-content-center align-items-center w-100">
                        <div className="col-12 text-center">
                          <Spinner
                            animation="border"
                            role="status"
                            style={{
                              color: "#1976d2",
                            }}
                          ></Spinner>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </>
  );
}

export default ShowVoters;
