import {
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Paper,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import VotingPowerDaoCards from "../Cards/VotingPowerDaoCards";
import { depositMakeDeploy } from "../MakeDeployFunctions/DepositMakeDeploy";
import { increaseAndDecreaseAllowanceGaugeMakeDeploy } from "../MakeDeployFunctions/IncreaseAndDecreaseAllowanceGauge";
import { withdrawGaugeMakeDeploy } from "../MakeDeployFunctions/WithdrawGaugeMakeDeploy";
import SigningModal from "../Modals/SigningModal";

const Gauge = (props) => {
  console.log("props", props);
  const { enqueueSnackbar } = useSnackbar();
  const [depositAmount, setDepositAmount] = useState(0);
  const [selectedDepositAmount, setSelectedDepositAmount] = useState(0);
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [selectedWithdrawAmount, setSelectedWithdrawAmount] = useState(0);

  const [infiniteApproval, setInfiniteApproval] = useState(false);
  const [minted, setMinted] = useState(0);
  const [claimableTokens, setClaimableTokens] = useState(0);
  const [openSigning, setOpenSigning] = useState(false);
  const [swapToken, setSwapToken] = useState(props.gauge.swapTokenContractHash);
  const [allowance, setAllowance] = useState(0);
  const [value, setValue] = useState(25);
  const [withdrawValue, setWithdrawValue] = useState(25);
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );

  function gaugeRelativeWeight() {
    return props.gauge.gaugeRelativeWeight * 100
  }
  function mintedFormat() {
    return (minted / 1e9).toFixed(2)
  }
  function poolBalanceFormat() {
    return props.gauge.balance / 1e9
  }
  function gaugeBalanceFormat() {
    return (props.gauge.gaugeBalance / 1e9).toFixed(2)
  }
  function claimableTokensFormat() {
    return (claimableTokens / 1e9).toFixed(2)
  }

  // function claimableRewardFormat() {
  //   return this.toFixed(claimableReward / 1e9)
  // }
  // function claimedRewardsFormat() {
  //   return this.toFixed(this.claimedRewards / 1e9)
  // }

  useEffect(() => {
    setMinted(props.gauge.minted)
    setClaimableTokens(props.gauge.claimableToken)
    setDepositAmount(poolBalanceFormat());
    // console.log("poolBalanceFormat()",props.gauge.name, poolBalanceFormat());
    setSelectedDepositAmount(props.gauge.balance / 1e9);
    setSelectedWithdrawAmount(props.gauge.gaugeBalance / 1e9)
    setWithdrawAmount(gaugeBalanceFormat())
  }, [])
  function setMaxPool() {
    setDepositAmount(props.gauge.balance / 1e9)
    setSelectedDepositAmount(props.gauge.balance / 1e9)
  }
  const marks = [
    {
      value: 0,
      label: '0%',
    },
    {
      value: 25,
      label: '25%',
    },
    {
      value: 50,
      label: '50%',
    },
    {
      value: 75,
      label: '75%',
    },
    {
      value: 100,
      label: '100%',
    },
  ];
  function valuetext(e) {
    console.log('value', e.target.value);
    setSelectedDepositAmount(depositAmount * e.target.value / 100)
    setValue(`${e.target.value}`)
    // return `${value}%`;
  }
  function withdrawValueText(e) {
    console.log('value', e.target.value);
    setSelectedWithdrawAmount(withdrawAmount * e.target.value / 100)
    setWithdrawValue(`${e.target.value}`)
    // return `${value}%`;
  }
  useEffect(() => {
    if (
      activePublicKey &&
      activePublicKey != "null" &&
      activePublicKey != undefined
    )
      getAllowance();
  }, [activePublicKey]);

  const getAllowance = () => {
    let allowanceParam = {
      contractHash: swapToken,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: props.gauge.gauge,
    };
    console.log("allowanceParam0", allowanceParam);
    axios
      .get(
        `/allowanceagainstownerandspender/${swapToken}/${CLPublicKey.fromHex(
          activePublicKey
        )
          .toAccountHashStr()
          .slice(13)}/${props.gauge.gauge}`
      )
      .then((res) => {
        console.log("allowanceagainstownerandspender", res);
        console.log(res.data);
        setAllowance(res.data.allowance);
      })
      .catch((error) => {
        setAllowance(0);
        console.log(error);
        console.log(error.response);
      });
  };
  return (
    <Box
      sx={{
        width: "100%",
      }}
      className="mt-4"
    >
      <Paper elevation={4}>

        <Grid
          className="mt-2 mb-5"
          container
          spacing={2}
          justify="center"
          columnSpacing={3}
          rowSpacing={3}
        >
          <div className="col-12" style={{
            padding: '20px',
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }} >
            <Typography
              variant="h6"
              gutterBottom
              component="div"
              fontWeight={900}
            >
              {props.gauge.name}  {props.gauge.typeName} gauge
              {/* CRV APY: "Some value" */}
            </Typography>
          </div>
          <Grid item xs={12} sm={6} md={4}>
            <VotingPowerDaoCards title={"Gauge Relative weight"} value={gaugeRelativeWeight()} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <VotingPowerDaoCards title={"Minted CRV from this gauge"} value={`${mintedFormat()}`} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <VotingPowerDaoCards title={`${props.gauge.name} LP token balance`} value={<a onClick={() => setMaxPool()}>{poolBalanceFormat()}</a>} />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ padding: "30px" }}>
              <TextField id="outlined-basic" fullWidth value={selectedDepositAmount} label="Amount" onChange={(e) => {
                setSelectedDepositAmount(e.target.value);
              }} />
              <Slider
                aria-label="Custom marks"
                // defaultValue={25}
                onChange={valuetext}
                value={value}
                // getAriaValueText={valuetext}
                step={1}
                valueLabelDisplay="auto"
                marks={marks}
              />
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <div style={{ padding: "50px" }}>
              {/* <Checkbox
                checked={infiniteApproval}
                onChange={(e) => {
                  console.log("Infinite approval value: ", e.target.checked);
                  setInfiniteApproval(e.target.checked);
                }}
                color="success"
              />{" "}
              Infinite Approval? */}

              <Button variant="contained" onClick={async () => {
                let ret = true;
                if (allowance / 10 ** 9 < selectedDepositAmount)
                  ret = await increaseAndDecreaseAllowanceGaugeMakeDeploy(selectedDepositAmount - allowance / 10 ** 9, setOpenSigning, enqueueSnackbar, getAllowance, props.gauge.gauge, props.gauge.swapTokenContractHash,)
                if (ret)
                  await depositMakeDeploy(selectedDepositAmount, props.gauge.gaugeContractHash, setOpenSigning, enqueueSnackbar, props.fetchData)
              }} fullWidth>
                Deposit
              </Button>
            </div>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>

          </Grid>
        </Grid>
        {gaugeBalanceFormat() > 0 ? (
          <Grid
            className="mt-2 mb-5"
            container
            spacing={2}
            justify="center"
            columnSpacing={3}
            rowSpacing={3}
          >

            <Grid item xs={12} sm={6} md={4}>
              <div style={{ padding: "30px" }}>
                <TextField id="outlined-basic" fullWidth value={selectedWithdrawAmount} label="Amount" onChange={(e) => {
                  setSelectedWithdrawAmount(e.target.value);
                }} />
                <Slider
                  aria-label="Custom marks"
                  // defaultValue={25}
                  onChange={withdrawValueText}
                  value={withdrawValue}
                  // getAriaValueText={valuetext}
                  step={1}
                  valueLabelDisplay="auto"
                  marks={marks}
                />
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4}>
              <VotingPowerDaoCards title={props.gauge.name + " Gauge Balance"} value={gaugeBalanceFormat()} />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <div style={{ padding: "50px" }}>
                <Button variant="contained" onClick={() => {
                  withdrawGaugeMakeDeploy(selectedWithdrawAmount, setOpenSigning, enqueueSnackbar, props.gauge.gaugeContractHash, gaugeBalanceFormat(), props.fetchData)
                }} fullWidth>
                  Withdraw
                </Button>
              </div>
            </Grid>
          </Grid>
        ) : (null)}
        <div className="py-5 px-4" style={{ margin: "20px" }}>
          {/* Heading */}



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
      <SigningModal show={openSigning} />
    </Box >
  );
};

export default Gauge;
