// REACT
import React, { useState } from "react";
//CUSTOM STYLING
import "../../assets/css/curveButton.css";
import "../../assets/css/common.css";
// MATERIAL UI
import Paper from "@mui/material/Paper";

// COMPONENT FUNCTION
const CRVStats = () => {
  // States
  const [holderLpRatio, setHolderLpRatio] = useState(0);
  const [holderAPY, setHolderAPY] = useState("6.13%");
  const [fourWeekAvg, setFourWeekAvg] = useState("5.23%");
  const [yearlyFeeEarning, setYearlyFeeEarning] = useState("$0.14");
  const [veCRVBalance, setVeCRVBalance] = useState(0);
  const [dailyEarnings, setDailyEarnings] = useState("$151,273.54");
  const [weeklyEarnings, setWeeklyEarnings] = useState(" $1,058,914.81");
  const [weeklyVolume, setWeeklyVolume] = useState(" $5,294,574,035.84");
  const [nextDistrDate, setNextDistrDate] = useState(
    "Tue, 12 Apr 2022 12:02:41 GMT"
  );
  const [dailyDeposits, setDailyDeposits] = useState("$20,016,096,363.09");
  const [dailyVolume, setDailyVolume] = useState("$733,275,909");
  const [LPClaim, setLPClaim] = useState(0);

  return (
    <>
      {/* veCRV STATS */}
      <div className="curve-container">
        <fieldset>
          <legend>veCRV stats</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <Paper elevation={4}>
                <div className="py-5 px-4">
                  <p>veCRV holder/LP ratio (based on fees): {holderLpRatio}</p>
                  <section>
                    <p>
                      Having locked $1 in CRV for 4 years is equal to having
                      provided $0 as an LP
                    </p>
                  </section>
                  <section>
                    <p>
                      veCRV holder APY: {holderAPY} (4 weeks average:{" "}
                      {fourWeekAvg})
                    </p>
                    <p>Yearly fee earnings per 1 veCRV: {yearlyFeeEarning}</p>
                    <p>
                      My veCRV balance: {veCRVBalance} <b>Stake CRV</b>
                    </p>
                  </section>
                  <section>
                    <p>Averaged daily earnings: {dailyEarnings}</p>
                    <p>Weekly earnings: {weeklyEarnings}</p>
                    <p>
                      Weekly volume (including deposits/withdrawals):{" "}
                      {weeklyVolume}
                    </p>
                  </section>
                  <section>
                    <p>Next Distribution: {nextDistrDate}</p>
                  </section>
                </div>
              </Paper>
            </div>
          </div>
        </fieldset>
      </div>
      {/* Total pool deposits and daily volume */}
      <div className="curve-container">
        <fieldset>
          <legend>Total pool deposits and daily volume</legend>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <Paper elevation={4}>
                <div className="py-5 px-4">
                  <section>
                    <p>Deposits: {dailyDeposits}</p>
                    <p>Daily Volume: {dailyVolume}</p>
                  </section>
                </div>
              </Paper>
            </div>
          </div>
        </fieldset>
      </div>
      <div className="curve-container">
        {/* CLAIN BUTTON */}
        <fieldset>
          <div className="row no-gutters justify-content-center">
            <div className="curve-content-wrapper col-12 col-lg-6">
              <Paper elevation={4}>
                <div className="py-5 px-4">
                  <section>
                    <p>
                      veCRV 3pool LP claim:{" "}
                      <span className="btnWrapper mr-3">
                        <button>Claim {LPClaim}</button>
                      </span>
                    </p>
                  </section>
                </div>
              </Paper>
            </div>
          </div>
        </fieldset>
      </div>
      <footer style={{ height: "10rem" }}></footer>
    </>
  );
};

export default CRVStats;
