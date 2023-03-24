import React, { useEffect } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";

const FutureAPYTable = (props) => {
  useEffect(() => {
    console.log("Props for future apy table: ", props);
  });

  return (
    <>
      <table class="table table-striped ">
        <thead class="thead-light">
          <tr>
            {props.cells.map((cell) => (
              <th style={{
                border: 0,
                fontWeight: "bold",
                fontSize: "1rem",
                textAlign: "center",
              }}>
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody id={"GWVoteTableBody"} style={{ color: "#1E1E1F" }}>
          {props.gaugeWeightVoteData.map((item) => {
            return (
              <tr>
                <td
                  key={item.index}
                  style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                >
                  {item.indexNo}
                </td>
                <td
                  key={item.index}
                  style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                >
                  {item.pool}
                </td>
                <td
                  key={item.index}
                  style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                >
                  {item.currentCrv}
                </td>
                <td
                  key={item.index}
                  style={{ textAlign: "center", border: "0.6px solid #e0e0e0" }}
                >
                  {item.futureCrv}
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
