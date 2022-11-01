import React, { useEffect, useState } from "react";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../assets/css/style.css";
import "../../assets/css/common.css";
// ICONS
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
// MATERIAL UI
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
// COMPONENTS
// GRAPHQL
import { useQuery, gql } from "@apollo/client";
import { Spinner } from "react-bootstrap";

// QUERIES
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

  // Queries
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

  //   Event Handlers
  const handleOpenFor = () => setOpenFor(true);
  const handleCloseFor = () => setOpenFor(false);
  const handleOpenAgainst = () => setOpenAgainst(true);
  const handleCloseAgainst = () => setOpenAgainst(false);

  // Computations
  let rows = [];
  let rowsAgainst = [];

  if (casts !== undefined) {
    rows = casts.map((cast) => {
      console.log("conditon: ", cast.supports);
      if (cast.supports)
        return {
          ...rows,
          address: cast.voter.address,
          stakes: cast.voterStake,
          id: cast.id,
        };
    });
    rowsAgainst = casts.map((cast) => {
      if (!cast.supports)
        return {
          ...rowsAgainst,
          address: cast.voter.address,
          stakes: cast.voterStake,
          id: cast.id,
        };
    });
  }

  const shortenAddress = (address) => {
    if (!address) return "";
    return address.slice(0, 6) + "..." + address.slice(-6);
  };

  // Side Effects
  useEffect(() => {
    resolveData();
  }, [data]);

  if (casts !== undefined) {
    console.log("Cast in favor: ", rows);
    console.log("Cast in opposition: ", rowsAgainst);
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
                {rows.includes(undefined) ? (
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
                          <Typography variant="p" gutterBottom component="div">
                            <span>No one has voted yet</span>
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rows.length ? (
                  rows.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                              color: "rgb(83, 0, 232)",
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
                {rowsAgainst.includes(undefined) ? (
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
                          <Typography variant="p" gutterBottom component="div">
                            <span>No one has voted against</span>
                          </Typography>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : rowsAgainst.length ? (
                  rowsAgainst.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                              color: "rgb(83, 0, 232)",
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
