// REACT
import React, { useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import HomeBanner from "../Home/HomeBanner";
import VoteLocksStats from "../../../../components/Stats/VoteLocksStats";
import TablePaginationActions from "../../../../components/pagination/TablePaginationActions";
import GaugeRelativeWeight from "../../../../components/Charts/GaugeRelativeWeight";
// MATERIAL UI
import Box from "@mui/material/Box";
import { Button } from "@material-ui/core";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import DateTimePicker from "react-datetime-picker";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {
  Accordion,
  AccordionSummary,
  Avatar,
  CardHeader,
  useTheme,
} from "@material-ui/core";
// ICONS
import clock from "../../../../assets/img/clock.png";
import { TableFooter, TablePagination } from "@mui/material";

// CONTENT
const votingHistoryCells = [
  "Time",
  "Voter",
  "veCRV",
  "Total veCRV",
  "Gauge",
  "Weight",
  "Total Weight",
];

const sampleVotingHistoryData =
  '[{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"},{"time": "23/05/2022 05:22:27", "voter":"0x7ca5…7575", "veCrv": "1982.61", "totalVeCRV": "451,939,849.96", "gauge": "f-cvxfxs (0xab19...26dd)", "weight": "25%", "totalWeight": "414712921.18"}]';

var votingHistoryData = [];
try {
  votingHistoryData = JSON.parse(sampleVotingHistoryData);
} catch (expecption) {
  console.log("an exception has occured!", expecption);
}

// COMPONENT FUNCTION
const Locks = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [date, setDate] = useState();
  const [value, onChange] = useState(new Date());
  const [dateDisplay, setDateDisplay] = useState();
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [page, setPage] = useState(0);

  //   Event Handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Return Function
  return (
    <>
      <div className="home-section home-full-height">
        <HeaderDAO
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Locks"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
      </div>
      <div className="container-fluid">
        <div className="curve-container">
          <div className="curve-content-banks">
            <fieldset>
              <div className="row no-gutters justify-content-center">
                <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                  <div className="row no-gutters justify-content-center">
                    {/* Vote Locks */}
                    <Box
                      sx={{
                        width: "100%",
                      }}
                      className="mt-4"
                    >
                      <Paper elevation={4}>
                        <div className="py-5 px-4">
                          {/* Heading */}
                          <div className="row no-gutters">
                            <div className="col-12 text-center py-3">
                              <Typography
                                variant="h4"
                                gutterBottom
                                component="div"
                              >
                                <span className="font-weight-bold">
                                  CRV User Vote Locks
                                </span>
                              </Typography>
                            </div>
                          </div>
                          {/* Voting Power Stats */}
                          <div className="row no-gutters">
                            <div className="col-12">
                              <VoteLocksStats />
                              <div className="w-100 mt-5 mb-3">
                                <Divider />
                              </div>
                              {/* Lock Time */}
                              <form>
                                <div className="row no-gutters justify-content-center justify-content-lg-between w-100 align-items-center">
                                  <div className="col-12 col-lg-5 px-0 dt-picker">
                                    <DateTimePicker
                                      onChange={onChange}
                                      value={value}
                                    />
                                    {/* <DateTimePicker
                                      onChange={(e) => {
                                        console.log("e.value", e.target.value);
                                        setDate(e.target.value);
                                        setDateDisplay(e.target.value);
                                      }}
                                      value={dateDisplay}
                                      name="LockTimePicker"
                                      label="Choose Lock Time"
                                      style={{ width: "100%" }}
                                      sx={{ width: "100%" }}
                                    /> */}
                                  </div>
                                  <div className="col-12 col-lg-5 px-0">
                                    <div className="btnWrapper my-4 text-center">
                                      <Button
                                        variant="contained"
                                        size="large"
                                        style={{
                                          backgroundColor: "#5300e8",
                                          color: "white",
                                        }}
                                        onClick={() => {
                                          console.log("Action Taken");
                                          // props.createLockMakeDeploy(lockAmount, date);
                                        }}
                                      >
                                        LOCK TIME
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              </form>
                              <div className="row no-gutters">
                                <div className="col-12 text-center text-md-left">
                                  <div>
                                    <Accordion
                                      style={{
                                        borderRadius: "4px 4px 0px 0px ",
                                      }}
                                      expanded={false}
                                    >
                                      <AccordionSummary
                                        expandIcon={
                                          <Typography
                                            variant="body2"
                                            style={{
                                              color: "#000027",
                                            }}
                                            gutterBottom
                                          >
                                            9993
                                          </Typography>
                                        }
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                      >
                                        <CardHeader
                                          avatar={<></>}
                                          title={"# of users vote-locked:"}
                                          // subheader={tokenB.symbol}
                                        />
                                      </AccordionSummary>
                                    </Accordion>
                                    <Accordion
                                      style={{
                                        borderRadius: "0px 0px 4px 4px ",
                                      }}
                                      expanded={false}
                                    >
                                      <AccordionSummary
                                        expandIcon={
                                          <Typography
                                            variant="body2"
                                            style={{
                                              color: "#000027",
                                            }}
                                            gutterBottom
                                          >
                                            1717
                                          </Typography>
                                        }
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                      >
                                        <CardHeader
                                          avatar={<></>}
                                          title={
                                            "# of users who can create new votes:"
                                          }
                                        />
                                      </AccordionSummary>
                                    </Accordion>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* SnapShot */}
                          <div className="row no-gutters justify-content-center mt-4">
                            {/* PRopsed Gauge Weight Changes */}
                            <Box
                              sx={{
                                width: "100%",
                              }}
                            >
                              <Paper>
                                <div className="py-5 px-4 mt-3 mt-lg-5">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-12 text-center py-3">
                                      <Typography
                                        variant="h4"
                                        gutterBottom
                                        component="div"
                                      >
                                        <span className="font-weight-bold">
                                          veCRV Distribution
                                        </span>
                                      </Typography>
                                    </div>
                                    <GaugeRelativeWeight />
                                  </div>
                                </div>
                              </Paper>
                              {/* Table */}
                              <Paper>
                                <div className="py-5 px-4 mt-3 mt-lg-5">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="row no-gutters mt-3">
                                      <div className="col-12">
                                        <div className="row no-gutters px-4 px-xl-3 pb-3 pb-xl-2 justify-content-center">
                                          <TableContainer
                                            sx={{ p: 3, overflow: "hidden" }}
                                          >
                                            <Table aria-label="Gauge Weight Vote History">
                                              <TableHead
                                                sx={{
                                                  backgroundColor: "#e7ebf0",
                                                  paddingLeft: "0.25rem",
                                                }}
                                              >
                                                <TableRow id="GWVoteHistoryTableSort">
                                                  {votingHistoryCells.map(
                                                    (cell) => (
                                                      <TableCell
                                                        sx={{
                                                          border: 0,
                                                          fontWeight: "bold",
                                                          fontSize: "1.25rem",
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        {cell}
                                                      </TableCell>
                                                    )
                                                  )}
                                                </TableRow>
                                              </TableHead>
                                              <TableBody
                                                id={"GWVoteHistoryTableBody"}
                                              >
                                                {(rowsPerPage > 0
                                                  ? votingHistoryData.slice(
                                                      page * rowsPerPage,
                                                      page * rowsPerPage +
                                                        rowsPerPage
                                                    )
                                                  : votingHistoryData
                                                ).map((item) => {
                                                  console.log("this runs!");
                                                  return (
                                                    <TableRow>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        07/10/2022 12:49:30
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        <Link
                                                          to="/"
                                                          className="tableCellLink font-weight-bold"
                                                        >
                                                          {item.voter}
                                                        </Link>
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        {item.veCrv}
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        {item.totalVeCRV}
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        <Link
                                                          to="/"
                                                          className="tableCellLink font-weight-bold"
                                                        >
                                                          {item.gauge}
                                                        </Link>
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        <Link
                                                          to="/"
                                                          className="tableCellLink"
                                                        >
                                                          {item.weight}
                                                        </Link>
                                                      </TableCell>
                                                      <TableCell
                                                        key={item.index}
                                                        sx={{
                                                          textAlign: "center",
                                                        }}
                                                      >
                                                        {item.totalWeight}
                                                      </TableCell>
                                                    </TableRow>
                                                  );
                                                })}
                                              </TableBody>
                                              <TableFooter>
                                                <TableRow>
                                                  <TablePagination
                                                    rowsPerPageOptions={[
                                                      5,
                                                      10,
                                                      25,
                                                      {
                                                        label: "All",
                                                        value: -1,
                                                      },
                                                    ]}
                                                    colSpan={12}
                                                    count={5}
                                                    rowsPerPage={rowsPerPage}
                                                    page={page}
                                                    SelectProps={{
                                                      inputProps: {
                                                        "aria-label":
                                                          "rows per page",
                                                      },
                                                      native: true,
                                                    }}
                                                    onPageChange={
                                                      handleChangePage
                                                    }
                                                    onRowsPerPageChange={
                                                      handleChangeRowsPerPage
                                                    }
                                                    ActionsComponent={
                                                      TablePaginationActions
                                                    }
                                                    sx={{
                                                      backgroundColor:
                                                        "#e7ebf0",
                                                    }}
                                                  />
                                                </TableRow>
                                              </TableFooter>
                                            </Table>
                                          </TableContainer>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Paper>
                            </Box>
                          </div>
                        </div>
                      </Paper>
                    </Box>
                  </div>
                </div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </>
  );
};

export default Locks;
