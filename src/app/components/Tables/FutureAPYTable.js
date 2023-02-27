// REACT
import React, { useEffect } from "react";
// CUSTOM STYLING
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
// MATERIAL UI
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";

// CONTENT
// const cells = ["Pool", "Base vAPY", "Rewards tAPR", "Volume", "TVL"];
// const sampleData =
//   '[{"pool":{"logo": "../../assets/img/usdc.png", "title": "tricrypto2", "reference": "CRYPTO"},"base":"0.73%","rewards":"+3.09%","volume":"$62.7m","tvl":"$868.7m", "id": "123"},{"pool":{"logo": "/busd.png", "title": "sUSD", "reference": "USD"},"base":"2.09%","rewards":"+0.32%","volume":"$24.5m","tvl":"$96.2m"},{"pool":{"logo": "./busd.png", "title": "steth", "reference": "ETH"},"base":"2.09%","rewards":"+0.32%","volume":"$76.2m","tvl":"$121.1m"},{"pool":{"logo": "./busd.png", "title": "reth", "reference": "ETH"},"base":"1.89%","rewards":"+1.63%","volume":"$96.5m","tvl":"$415.23m"},{"pool":{"logo": "./busd.png", "title": "mim", "reference": "USD"},"base":"2.94%","rewards":"+4.28%","volume":"$17.73m","tvl":"$53.112m"},{"pool":{"logo": "./busd.png", "title": "link", "reference": "LINK"},"base":"0.00%","rewards":"+0.22%","volume":"$796m","tvl":"$10.9m"},{"pool":{"logo": "./busd.png", "title": "eurt", "reference": "EUR"},"base":"0.0%","rewards":"+0%","volume":"$0","tvl":"$386.6m"},{"pool":{"logo": "/busd.png", "title": "sUSD", "reference": "CSPR"},"base":"2.09%","rewards":"+0.32%","volume":"$24.5m","tvl":"$96.2m"},{"pool":{"logo": "./busd.png", "title": "eurs", "reference": "EUR"},"base":"0.09%","rewards":"+1.71%","volume":"$1589m","tvl":"$35.5m"},{"pool":{"logo": "./busd.png", "title": "3pool", "reference": "USD"},"base":"0.43%","rewards":"+1.07%","volume":"$74.79m","tvl":"$105.3m"},{"pool":{"logo": "./busd.png", "title": "ankreth", "reference": "ETH"},"base":"1.17%","rewards":"+1.25%","volume":"98.92m","tvl":"$215.4m"},{"pool":{"logo": "./busd.png", "title": "cvxweth", "reference": "ETH"},"base":"2.01%","rewards":"+0.21%","volume":"$63.5m","tvl":"$179.1m"}]';
// var poolsContent = []; // = JSON.parse(s);
// try {
//   poolsContent = JSON.parse(sampleData);
// } catch (expecption) { }

// COMPONENT FUNCTION
const FutureAPYTable = (props) => {
  // States
  // Handlers

  useEffect(() => {
    console.log("Props for future apy table: ", props);
  });

  return (
    <>
      <table class="table table-striped ">
        <thead class="thead-light">
          <tr>
            {props.cells.map((cell) => (
                <th style={{ border: 0,
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textAlign: "center",}}>
                  {cell}
                </th>
              ))}
          </tr>
        </thead>
        <tbody id={"GWVoteTableBody"} style={{color:"#1E1E1F"}}>
            {props.gaugeWeightVoteData.map((item) => {
              return (
                <tr>
                  <td
                    key={item.index}
                    style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                  >
                    {/* <Link
                      to="/pool/buy-and-sell"
                      className="tableCellLink"
                    > */}
                    {item.indexNo}
                    {/* </Link> */}
                  </td>
                  <td
                    key={item.index}
                    style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                  >
                    {/* <Link
                      to="/pool/buy-and-sell"
                      className="tableCellLink"
                    > */}
                    {item.pool}
                    {/* </Link> */}
                  </td>
                  <td
                    key={item.index}
                    style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                  >
                    {/* <Link
                      to="/pool/buy-and-sell"
                      className="tableCellLink"
                    > */}
                    {item.currentCrv}
                    {/* </Link> */}
                  </td>
                  <td
                    key={item.index}
                    style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                  >
                    {/* <Link
                      to="/pool/buy-and-sell"
                      className="tableCellLink"
                    > */}
                    {item.futureCrv}
                    {/* </Link> */}
                  </td>
                </tr>
              );
            })}
          </tbody>
      </table>

     

    </>
  );
};

export default FutureAPYTable;
