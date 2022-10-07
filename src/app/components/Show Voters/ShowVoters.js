import React from "react";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../assets/css/style.css";
import "../../assets/css/common.css";
// ICONS
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
// MATERIAL UI
import { Typography } from "@mui/material";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
// COMPONENTS



function ShowVoters(props) {

    function createData(Voter, veCRV) {
        return {Voter, veCRV};
      }
      
    const rows = [
        createData('0x5b3e....54ddb68', 15997),
        createData('0x6b7e....14iib60', 67976),
        createData('0x4b3a....24tdb65', 9654),
        createData('0x3c3s....12kkb68', 389),
        createData('0xt83c....54ddo87', 159),
        
      ];
      const rowsAgainst = [
        createData('0x7b3c....56web69', 15997),
        createData('0x2b7y....19utb60', 67976),
        
      ];

  return (
    <>
       <div className="row no-gutters mx-3 my-4">
            <div className="col-lg-5 d-xs-block">
                <div className="d-flex justify-content-between" style={{ color: "#00E65B"}}>
                    <div className="d-flex">
                        <Typography className="pr-2">For</Typography>
                        <CheckCircleIcon/>
                    </div>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ backgroundColor: "#00E65B", color: "white" }}
                        >
                            Show Chart
                    </Button>
                </div>
                <TableContainer component={Paper} elevation={5} className="mt-3">
                    <Table sx={{ minWidth: 100 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Voters</TableCell>
                                <TableCell>veCRV</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell align="left">{row.Voter}</TableCell>
                                    <TableCell align="left">{row.veCRV}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
            <div className="col-5 ml-sm-0 ml-md-5  mt-sm-3 mt-lg-0">
            <div className="d-flex justify-content-between" style={{ color: "#FF0100"}}>
                    <div className="d-flex">
                        <Typography className="pr-2">Against</Typography>
                        <CancelIcon/>
                    </div>
                    <Button
                        variant="contained"
                        size="small"
                        style={{ backgroundColor: "#FF0100", color: "white" }}
                        >
                            Show Chart
                    </Button>
                </div>
                <TableContainer component={Paper} elevation={5} className="mt-3">
                    <Table sx={{ minWidth: 100 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Voters</TableCell>
                                <TableCell>veCRV</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rowsAgainst.map((row) => (
                                <TableRow
                                    key={row.name}
                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                    <TableCell align="left">{row.Voter}</TableCell>
                                    <TableCell align="left">{row.veCRV}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    </>
  )
}

export default ShowVoters