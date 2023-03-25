import React, { useState } from "react";
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
import "../../assets/css/curveAllPools.css";
import "../../assets/css/bootstrap.min.css";
import PoolsTabs from "../Tabs/PoolsTabs";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { StyledEngineProvider } from "@mui/styled-engine";
const AllPools = () => {
  const searchTable = (term) => {
    let filter = term.target.value.toUpperCase();
    let TableBody = document.getElementById("curveTableBody");
    let tableRow = TableBody.getElementsByTagName("tr");
    for (var i = 0; i < tableRow.length; i++) {
      let td0 = tableRow[i].getElementsByTagName("td")[0],
        td1 = tableRow[i].getElementsByTagName("td")[1],
        td2 = tableRow[i].getElementsByTagName("td")[2],
        td3 = tableRow[i].getElementsByTagName("td")[3],
        td4 = tableRow[i].getElementsByTagName("td")[4];

      if (td0 || td1 || td2 || td3 || td4) {
        let textValue0 = td0.textContent || td0.innerHTML,
          textValue1 = td1.textContent || td1.innerHTML,
          textValue2 = td2.textContent || td2.innerHTML,
          textValue3 = td3.textContent || td3.innerHTML,
          textValue4 = td4.textContent || td4.innerHTML;
        if (
          textValue0.toUpperCase().indexOf(filter) > -1 ||
          textValue1.toUpperCase().indexOf(filter) > -1 ||
          textValue2.toUpperCase().indexOf(filter) > -1 ||
          textValue3.toUpperCase().indexOf(filter) > -1 ||
          textValue4.toUpperCase().indexOf(filter) > -1
        ) {
          tableRow[i].style.display = "";
        } else tableRow[i].style.display = "none";
      }
    }
  };

  return (
    <>
      <div className="curve-container">
        <div className="curve-content-banks">
          <fieldset>
            <legend>Curve Pools</legend>
            <div className="row no-gutters justify-content-center">
              <div className="curve-content-wrapper col-12 col-xl-6">
                <div className="row no-gutters align-items-center">
                  <Box
                    sx={{
                      width: "100%",
                    }}
                  >
                    <Paper elevation={4}>
                      {/* SEARCH */}
                      <div className="col-12 col-md-6 col-lg-4 pr-0 pr-lg-2">
                        <StyledEngineProvider injectFirst>
                          <TextField
                            id="tableSearch"
                            label="Search"
                            variant="filled"
                            className="w-100"
                            sx={{ margin: "1.25rem 0" }}
                            onKeyUp={searchTable}
                          />
                        </StyledEngineProvider>
                      </div>
                      {/* TABS AND TABLE */}
                      <div className="col-12 px-0">
                        <div
                          className="row no-gutters justify-content-center align-items-center"
                          id="sortBtnWrapper"
                        >
                          <div className="container-fluid px-0">
                            <PoolsTabs />
                          </div>
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
    </>
  );
};

export default AllPools;
