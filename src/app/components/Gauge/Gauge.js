import {
  Box,
  Button,
  Checkbox,
  Divider,
  Paper,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";

const Gauge = (props) => {
  const [depositAmount, setDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [infiniteApproval, setInfiniteApproval] = useState(false);

  useEffect(() => {
    setDepositAmount(props.gauge.balance ? props.gauge.balance : 0);
  }, []);

  const handleDepositClick = async () => {
    console.log("Deposit button clicked");
  };

  return (
    <Box
      sx={{
        width: "100%",
      }}
      className="mt-4"
    >
      <Paper elevation={4}>
        <div className="py-5 px-4" style={{ margin: "20px" }}>
          {/* Heading */}
          <div className="col-12" style={{ textAlign: "center" }}>
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              fontWeight={900}
            >
              {props.gauge.name}
              {/* CRV APY: "Some value" */}
            </Typography>
          </div>
          {/* Pool Info */}
          <div
            className="col-12"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Gauge Relative weight:{" "}
            {props.gauge.gauge_relative_weight
              ? props.gauge.gauge_relative_weight
              : 0}
          </div>
          <div
            className="col-12"
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Minted CRV from this gauge:{" "}
            {props.gauge.minted ? props.gauge.minted : 0}
          </div>
          <div className="col-12">
            Balance : {props.gauge.balance ? props.gauge.balance : 0}
          </div>
          <div className="col-3">
            Amount:
            <TextField
              value={depositAmount}
              onChange={(e) => {
                setDepositAmount(e.target.value);
              }}
            />
          </div>
          <div className="col-3">
            <Slider size="small" defaultValue={depositAmount} />
          </div>
          <div className="col-12">
            <Checkbox
              checked={infiniteApproval}
              onChange={(e) => {
                console.log("Infinite approval value: ", e.target.checked);
                setInfiniteApproval(e.target.checked);
              }}
              color="success"
            />{" "}
            Infinite Approval?
          </div>
          <div className="col-3">
            <Button variant="contained" onClick={handleDepositClick} fullWidth>
              Deposit
            </Button>
          </div>

          {/* //WITHDRAW AMOUNT */}
          {props.gauge.balance > 0 ? (
            <div>
              <div>
                Balance:{" "}
                {props.gauge.gaugeBalance ? props.gauge.gaugeBalance : 0} in
                gauge
              </div>
              <div className="col-3">
                Amount:
                <TextField
                  value={withdrawAmount}
                  onChange={(e) => {
                    setWithdrawAmount(e.target.value);
                  }}
                />
              </div>
              <div className="col-3">
                <Slider size="small" defaultValue={withdrawAmount} />
              </div>
              <div className="col-3">
                <Button variant="contained" fullWidth>
                  Withdraw
                </Button>
              </div>
            </div>
          ) : null}

          {/* //CLAIM BUTTON */}
          {props.gauge.claimableToken ? (
            <div>
              <Button>
                Claim {props.gauge.claimableToken ? props.claimableToken : null}{" "}
                CRV
              </Button>
            </div>
          ) : null}
          <div className="w-100 my-3">
            <Divider />
          </div>
        </div>
      </Paper>
    </Box>
  );
};

export default Gauge;
