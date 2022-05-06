// REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { TablePagination, Typography } from "@mui/material";
import { StyledEngineProvider } from "@mui/styled-engine";
import { Link } from "react-router-dom";
import logoAddress from "../../assets/img/usdc.png";

// CONTENT
const cells = ["Pool", "Base vAPY", "Rewards tAPR", "Volume", "TVL"];
const sampleData =
  '[{"pool":{"logo": "../../assets/img/usdc.png", "title": "tricrypto2", "reference": "CRYPTO"},"base":"0.73%","rewards":"+3.09%","volume":"$62.7m","tvl":"$868.7m", "id": "123"},{"pool":{"logo": "/busd.png", "title": "sUSD", "reference": "USD"},"base":"2.09%","rewards":"+0.32%","volume":"$24.5m","tvl":"$96.2m"},{"pool":{"logo": "./busd.png", "title": "steth", "reference": "ETH"},"base":"2.09%","rewards":"+0.32%","volume":"$76.2m","tvl":"$121.1m"},{"pool":{"logo": "./busd.png", "title": "reth", "reference": "ETH"},"base":"1.89%","rewards":"+1.63%","volume":"$96.5m","tvl":"$415.23m"},{"pool":{"logo": "./busd.png", "title": "mim", "reference": "USD"},"base":"2.94%","rewards":"+4.28%","volume":"$17.73m","tvl":"$53.112m"},{"pool":{"logo": "./busd.png", "title": "link", "reference": "LINK"},"base":"0.00%","rewards":"+0.22%","volume":"$796m","tvl":"$10.9m"},{"pool":{"logo": "./busd.png", "title": "eurt", "reference": "EUR"},"base":"0.0%","rewards":"+0%","volume":"$0","tvl":"$386.6m"},{"pool":{"logo": "./busd.png", "title": "eurs", "reference": "EUR"},"base":"0.09%","rewards":"+1.71%","volume":"$1589m","tvl":"$35.5m"},{"pool":{"logo": "./busd.png", "title": "3pool", "reference": "USD"},"base":"0.43%","rewards":"+1.07%","volume":"$74.79m","tvl":"$105.3m"},{"pool":{"logo": "./busd.png", "title": "ankreth", "reference": "ETH"},"base":"1.17%","rewards":"+1.25%","volume":"98.92m","tvl":"$215.4m"},{"pool":{"logo": "./busd.png", "title": "cvxweth", "reference": "ETH"},"base":"2.01%","rewards":"+0.21%","volume":"$63.5m","tvl":"$179.1m"}]';
var poolsContent = []; // = JSON.parse(s);
try {
  poolsContent = JSON.parse(sampleData);
} catch (expecption) {}

// COMPONENT FUNCTION
const PoolsTableAll = (props) => {
  // States
  // Handlers
  const sortTable = () => {
    console.log(props.tab);
    let sortingTerm = props.tab;
    if (sortingTerm === "all") {
      console.log("this is all");
      return;
    } else {
      console.log("this is NOT all");
      let filter = sortingTerm.toUpperCase(); /// "USD", "BTC" --> term.target.text.trim()
      let TableBody = document.getElementById("curveTableBody");
      let tableRow = TableBody.getElementsByTagName("tr");
      console.log("this is the row: ", tableRow);
      Array.prototype.forEach.call(tableRow, function (element) {
        element.style.display = "none";
        element.setAttribute("hidden", "hidden");
      });
      for (var i = 0; i < tableRow.length; i++) {
        let td0 = tableRow[i].getElementsByTagName("td")[0],
          td1 = tableRow[i].getElementsByTagName("td")[1],
          td2 = tableRow[i].getElementsByTagName("td")[2],
          td3 = tableRow[i].getElementsByTagName("td")[3],
          td4 = tableRow[i].getElementsByTagName("td")[4];

        // console.log("this is", td0.textContent);

        if (td0 || td1 || td2 || td3 || td4) {
          let textValue0 = td0.textContent || td0.innerHTML,
            textValue1 = td1.textContent || td1.innerHTML,
            textValue2 = td2.textContent || td2.innerHTML,
            textValue3 = td3.textContent || td3.innerHTML,
            textValue4 = td4.textContent || td4.innerHTML;
          console.log(textValue0.toUpperCase().indexOf(filter));
          console.log("----");
          if (
            textValue0.toUpperCase().indexOf(filter) > -1 //||
            /*textValue1.toUpperCase().indexOf(filter) > -1 ||
            textValue2.toUpperCase().indexOf(filter) > -1 ||
            textValue3.toUpperCase().indexOf(filter) > -1 ||
            textValue4.toUpperCase().indexOf(filter) > -1*/
          ) {
            tableRow[i].style.display = "";
            console.log(tableRow[i]);

            tableRow[i].classList.remove("hidden");
            tableRow[i].setAttribute("hidden", "");
          } else {
            tableRow[i].style.display = "none";
            tableRow[i].classList.add("hidden");
          }
        }
      }
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderTop: 0,
        }}
        id="tableBox"
        // onLoad={sortTable}
      >
        <StyledEngineProvider injectFirst>
          <TableContainer sx={{ p: 3 }}>
            <Table aria-label="Wise Staking">
              <TableHead
                sx={{
                  backgroundColor: "#e7ebf0",
                  paddingLeft: "0.25rem",
                }}
              >
                <TableRow id="curvePoolsTableSort">
                  {cells.map((cell) => (
                    <TableCell>
                      <Typography
                        variant="body1"
                        gutterBottom
                        component="div"
                        fontWeight={900}
                      >
                        {cell}
                      </Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <StyledEngineProvider injectFirst>
                <TableBody id={"curveTableBody"}>
                  {poolsContent.map((item) => {
                    props.tab == "all" || item.reference == props.tab ? (
                      <TableRow>
                        <TableCell key={item.index}>
                          <Link
                            to={`/buy-and-sell/${item.id}`}
                            className="tableCellLink"
                          >
                            {/* <span className="tablePoolImgProps">
                              <img src={logoAddress} alt="logo" />
                            </span> */}
                            <span className="tablePoolTitle">
                              {item.pool.title}
                            </span>
                            <span className="tablePoolRef">
                              {item.pool.reference}
                            </span>
                          </Link>
                        </TableCell>
                        <TableCell key={item.index}>
                          <Link to="/buy-and-sell" className="tableCellLink">
                            {item.base}
                          </Link>
                        </TableCell>
                        <TableCell key={item.index}>
                          <Link to="/buy-and-sell" className="tableCellLink">
                            {item.rewards}
                          </Link>
                        </TableCell>
                        <TableCell key={item.index}>
                          <Link to="/buy-and-sell" className="tableCellLink">
                            {item.volume}
                          </Link>
                        </TableCell>
                        <TableCell key={item.index}>
                          <Link to="/buy-and-sell" className="tableCellLink">
                            {item.tvl}
                          </Link>
                        </TableCell>
                      </TableRow>
                    ) : null;
                  })}
                </TableBody>
              </StyledEngineProvider>
            </Table>
          </TableContainer>
          {/* <StyledEngineProvider injectFirst>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={cells.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              className="MuiTablePagination"
            />
          </StyledEngineProvider> */}
        </StyledEngineProvider>
      </Box>
    </>
  );
};

export default PoolsTableAll;
