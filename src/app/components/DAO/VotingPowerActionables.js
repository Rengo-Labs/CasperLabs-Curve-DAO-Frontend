import { gql, useQuery } from "@apollo/client";
import { Alert, Button } from "@mui/material";
import InputAdornment from '@mui/material/InputAdornment';
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { default as Axios, default as axios } from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { Form, Formik } from "formik";
import { useSnackbar } from "notistack";
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
import "../../assets/css/votingActionablesTextField.css";
import * as helpers from "../../assets/js/helpers";
import { AppContext } from "../../containers/App/Application";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { VOTING_ESCROW_PACKAGE_HASH } from "../blockchain/Hashes/PackageHashes";
import DateTimePicker from "../FormsUI/DateTimePicker";
import LockTimeButtons from "../FormsUI/LockTimeButtons";
import TextInput from "../FormsUI/TextInput";
import * as erc20CrvFunctions from "../JsClients/ERC20CRV/erc20crvFunctions/functions";
import * as votingEscrowFunctions from "../JsClients/VOTINGESCROW/QueryHelper/functions";
import AllowanceModal from "../Modals/AllowanceModal";
import SigningModal from "../Modals/SigningModal";

const GAUGES = gql`
query gauges($user: String) {
    gauges(user: $user) {
        id
        user
        gauge
        originalBalance       
  }
}
`;
const VotingPowerActionables = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { createLockMakeDeploy, withdrawMakeDeploy, increaseAndDecreaseAllowanceMakeDeploy, increaseAmountMakeDeploy, increaseUnlockTimeMakeDeploy } = useContext(AppContext);

  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  const [allowance, setAllowance] = useState(0);
  const [userCRVBalance, setUserCRVBalance] = useState(0);
  const [CRVLockedBalance, setCRVLockedBalance] = useState(0);
  const [dateDisplay, setDateDisplay] = useState();
  const [date, setDate] = useState();
  const [lockAmount, setLockAmount] = useState(0);
  const [openA, setOpenA] = useState(false);
  const [startingVPower, setStartingVPower] = useState();
  const [CRVLockedBalanceValue, setCRVLockedBalanceValue] = useState(0);
  const [vecrvBalance, setVecrvBalance] = useState(0);
  const [lockTime, setLockTime] = useState(Date.now())
  const [lockEnd, setLockEnd] = useState(Date.now() + 15000)
  const [increaseLock, setIncreaseLock] = useState(Date.now())
  const [deposit, setDeposit] = useState(0)
  const [CRVBalance, setCRVBalance] = useState(0);
  const [DAOPower, setDaoPower] = useState(0);
  const [CRVLocked, setCRVLocked] = useState(0);
  const [gaugesNeedCheckpoint, setGaugesNeedCheckpoint] = useState(0);
  const [gaugesQueryData, setGaugesQueryData] = useState([]);


  const [openAllowance, setOpenAllowance] = useState(false);
  const handleCloseAllowance = () => {
    setOpenAllowance(false);
  };
  const handleShowAllowance = () => {
    setOpenAllowance(true);
  };
  console.log("props for actionables: ", props, lockAmount, startingVPower);
  const [openSigning, setOpenSigning] = useState(false);
  // Content
  const initialValues = {
    LockAmount: "",
    LockTimeSelect: "",
    LockTimePicker: "",
  };

  useEffect(() => {
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, []);

  const getAllowance = () => {

    let allowanceParam = {
      contractHash: ERC20_CRV_CONTRACT_HASH,
      owner: CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13),
      spender: VOTING_ESCROW_PACKAGE_HASH
    }
    console.log('allowanceParam0', allowanceParam);
    Axios
      .get(`/allowanceagainstownerandspender/${ERC20_CRV_CONTRACT_HASH}/${CLPublicKey.fromHex(activePublicKey).toAccountHashStr().slice(13)}/${VOTING_ESCROW_PACKAGE_HASH}`)
      .then((res) => {
        console.log('allowanceagainstownerandspender', res)
        console.log(res.data)
        setAllowance(res.data.allowance)

      })
      .catch((error) => {
        setAllowance(0)
        console.log(error)
        console.log(error.response)
      })
  }

  const onSubmitVotingPowerActionables = (values, props) => {
    console.log("Voting Power Actionables", values);
  };

  useEffect(() => {
    let controller = new AbortController();
    if (
      activePublicKey !== null &&
      activePublicKey !== "null" &&
      activePublicKey !== undefined
    ) {

      fetchBalanceData();
    }
    return () => {
      controller.abort();
    }
  }, [localStorage.getItem("Address")]);

  async function fetchBalanceData() {
    let CRVLockBalance = await votingEscrowFunctions.balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    let CRVBalance = await erc20CrvFunctions.balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
    console.log("CRV Locked Balance: ", CRVLockBalance);
    console.log("CRV Balance: ", CRVBalance);
    setCRVLockedBalanceValue(CRVLockBalance);
    setUserCRVBalance(CRVBalance / 10 ** 9);
  }

  useEffect(() => {
    let controller = new AbortController();

    if (
      activePublicKey !== null &&
      activePublicKey !== "null" &&
      activePublicKey !== undefined
    ) {

      fetchUserData()
    }

    return () => {
      controller.abort();
    };
  }, [localStorage.getItem("Address")])

  async function fetchUserData() {
    let data = { account: Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("Hex") }
    console.log("data", data);
    axios.post(`/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        console.log("votingEscrow response of balance of:...", response.data);
        setVecrvBalance(response.data.balances[0])
      })
      .catch(error => {
        console.log("error of balance of:...", error);
      });
    axios.post(`/votingEscrow/lockedEnd/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        console.log("votingEscrow response of lockedEnd:...", response.data);
        setLockTime(response.data.lockedEnd.end)
        setLockEnd(response.data.lockedEnd.end)
      })
      .catch(error => {
        console.log("error of balance of:...", error);
      });
    let CRVBalance = await erc20CrvFunctions.balanceOf(
      ERC20_CRV_CONTRACT_HASH,
      Buffer.from(
        CLPublicKey.fromHex(activePublicKey).toAccountHash()
      ).toString("hex")
    );
    setCRVBalance(CRVBalance)
    setDeposit((CRVBalance / 10 ** 9).toFixed(0, 1))

  }
  useEffect(() => {
    async function fetchData() {
      let veCRVTotalSupply = await votingEscrowFunctions.totalSupply(ERC20_CRV_CONTRACT_HASH);
      setDaoPower(parseFloat(veCRVTotalSupply))
      console.log("veCRVTotalSupply", parseFloat(veCRVTotalSupply));
    }
    fetchData();
  }, [])
  useEffect(() => {
    setIncreaseLock(new Date((lockTime + 604800 * 1000)))
    if (lockTime == 0) {
      setLockTime(Date.now() / 1000)
      setIncreaseLock(new Date(Date.now() + 604800 * 1000))

    }
    if (Date.parse(increaseLock) > Date.now() + 126144000 * 1000) {
      setIncreaseLock(new Date())
    }
  }, [])
  const DAOPowerFormat = () => {
    return helpers.formatNumber(DAOPower / 1e9);
  };

  const averageLock = () => {
    return DAOPower ? (4 * DAOPower / CRVLocked).toFixed(2) : 0;
  };
  function newVotingPower() {
    let lockTime = Date.parse(increaseLock)
    let _deposit = deposit
    return (_deposit / 1e9) * ((lockTime - Date.now()) / 1000) / (86400 * 365) / (4) + (vecrvBalance / 1e9)
  }
  function setMaxBalance() {
    setDeposit(CRVBalance.div(1e9).toString())
  }
  function hasEndedLock() {
    return lockEnd > 0 && Date.now() > lockEnd
  }
  const gauges = useQuery(GAUGES, {
    fetchPolicy: "no-cache",
    variables: {
      user: activePublicKey && activePublicKey != "null"
        ? Buffer.from(
          CLPublicKey.fromHex(activePublicKey).toAccountHash()
        ).toString("hex")
        : null,
    },
  });

  useEffect(() => {
    console.log("gauges", gauges);
    if (gauges.data) {
      setGaugesQueryData(gauges.data)
    }
  }, [gauges])
  return (
    <>
      <Formik
        initialValues={initialValues}
        onSubmit={onSubmitVotingPowerActionables}
      >
        <Form>
          {hasEndedLock() && CRVLockedBalanceValue !== 0 ? (
            <>
              <div className="row no-gutters justify-content-center">
                <div className="col-12 col-md-4">
                  <div className=" my-4 text-center">
                    <Button
                      className="hoverButtonGlobal"
                      size="large"
                      onClick={() => {
                        withdrawMakeDeploy(setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData,);
                      }}
                    >
                      Withdraw
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div>
              {userCRVBalance === 0 ? (
                <>
                  <div className="w-100">
                    <Typography
                      style={{
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '12px',
                        lineHeight: '14px',
                        letterSpacing: '0.01em',
                        color: '#000000'
                      }}
                    >
                      Lock Amount
                    </Typography>
                    <div className="d-flex ">
                      <div style={{ width: "35%" }}>
                        <TextInput
                          id="daoAmount"
                          label=""
                          onChange={(e) => {
                            if (userCRVBalance >= e.target.value)
                              setLockAmount(e.target.value);
                            else {
                              setLockAmount(e.target.value);
                            }
                          }}
                          value={Number(lockAmount).toString()}
                          variant="filled"
                          type="number"
                          name="LockAmount"
                          sx={{ borderRadius: "4px 0px 0px 0px" }}
                          disableUnderline
                          InputProps={{
                            style: { height: "54px" },
                            endAdornment: (
                              <InputAdornment  >
                                <button
                                  style={{
                                    fontFamily: "Poppins",
                                    background: "none",
                                    border: "none",
                                    color: "#1976D2",
                                  }}
                                  size="medium"
                                  onClick={() => {
                                    setLockAmount(userCRVBalance);
                                  }}
                                >
                                  Max
                                </button>
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                      <div className="d-flex  " >
                        <div className="align-self-end">
                          <p
                            style={{
                              marginBottom: "0",
                              marginLeft: "12px",
                              fontStyle: "italic",
                              fontWeight: "500",
                              fontSize: '14px',
                              lineHeight: '16px',
                              letterSpacing: '0.01em',
                              color: 'rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            {`(${userCRVBalance})`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="d-flex mt-4">
                    <div className="" style={{ width: "35%" }}>
                      <div className=" px-0" >
                        <Typography
                          style={{
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '12px',
                            lineHeight: '14px',
                            letterSpacing: '0.01em',
                            color: '#000000'
                          }}
                        >
                          Choose Lock Times
                        </Typography>
                        <DateTimePicker
                          variant="filled"
                          onChange={(e) => {
                            console.log("e.value", e.target.value);
                            console.log("new Date(e.target.value)", new Date(e.target.value));
                            setDate(new Date(e.target.value));
                            setDateDisplay(e.target.value);
                          }}
                          value={dateDisplay}
                          name="LockTimePicker"
                          InputProps={{ style: { height: "54px", } }}
                        />
                      </div>
                    </div>
                    <div
                      className="lockerButton">
                      <LockTimeButtons
                        date={date}
                        setDate={setDate}
                        setDateDisplay={setDateDisplay}
                        setStartingVPower={setStartingVPower}
                        lockAmount={lockAmount}
                      />
                    </div>
                  </div>
                  <div className=" my-4 ">
                    {lockAmount * 10 ** 9 > allowance ? (
                      <button
                        className="w-25 hoverButtonGlobal votingActionablesButton increaseTime"
                        size="large"
                        onClick={() => {
                          handleShowAllowance();
                        }}
                      >
                        <p className="increaseAllowanceButton">
                          Increase Allowance
                        </p>
                      </button>
                    ) : (
                      <button
                        className="w-25 hoverButtonGlobal votingActionablesButton increaseTime"
                        size="large"
                        onClick={() => {
                          console.log("Action Taken");
                          createLockMakeDeploy(lockAmount, date, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData,gaugesQueryData);
                        }}
                      >
                        <p className="increaseAllowanceButton">
                          Create Lock
                        </p>
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="w-100">
                    <Typography className=""
                      style={{
                        fontStyle: 'normal',
                        fontWeight: '400',
                        fontSize: '12px',
                        lineHeight: '14px',
                        letterSpacing: '0.01em',
                        color: '#000000'
                      }}
                    >
                      Lock Amount
                    </Typography>
                    <div className="d-flex ">
                      <div style={{ width: "35%" }}>
                        <TextInput
                          id="daoAmount"
                          label=""
                          onChange={(e) => {
                            console.log("dam", e.target.value);
                            if (userCRVBalance >= e.target.value)
                              setLockAmount(e.target.value);
                            else {
                              setLockAmount(userCRVBalance);
                            }
                          }}
                          value={lockAmount}
                          variant="filled"
                          type="text"
                          name="LockAmount"
                          sx={{ borderRadius: "4px 0px 0px 0px" }}
                          disableUnderline
                          InputProps={{
                            style: { height: "54px" },
                            endAdornment: (
                              <InputAdornment  >
                                <button
                                  style={{
                                    fontFamily: "Poppins",
                                    background: "none",
                                    border: "none",
                                    color: "#1976D2",
                                  }}
                                  size="medium"
                                  onClick={() => {
                                    setLockAmount(userCRVBalance);
                                  }}
                                >
                                  Max
                                </button>
                              </InputAdornment>
                            )
                          }}
                        />
                      </div>
                      <div className="d-flex  ml-0" >
                        <div className="align-self-end">
                          <p
                            style={{
                              marginBottom: "0",
                              marginLeft: "12px",
                              fontStyle: "italic",
                              fontWeight: "500",
                              fontSize: '14px',
                              lineHeight: '16px',
                              letterSpacing: '0.01em',
                              color: 'rgba(0, 0, 0, 0.5)'
                            }}
                          >
                            {`(${userCRVBalance})`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className=" my-4 ">
                      {lockAmount * 10 ** 9 > allowance ? (
                        <button
                          className="w-25 hoverButtonGlobal votingActionablesButton"
                          onClick={() => {
                            handleShowAllowance();
                          }}
                        >
                          <p className="increaseAllowanceButton">
                            Increase Allowance
                          </p>
                        </button>
                      ) : (
                        <button
                          className="w-25 hoverButtonGlobal votingActionablesButton"
                          onClick={() => {
                            console.log("Action Taken");
                            increaseAmountMakeDeploy(lockAmount, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData,gaugesQueryData);
                          }}
                        >
                          <p className="increaseAllowanceButton">
                            Add Amount
                          </p>
                        </button>
                      )}

                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="" style={{ width: "35%" }}>
                      <div className=" px-0" >
                        <Typography
                          style={{
                            fontStyle: 'normal',
                            fontWeight: '400',
                            fontSize: '12px',
                            lineHeight: '14px',
                            letterSpacing: '0.01em',
                            color: '#000000'
                          }}
                        >
                          Choose Lock Time
                        </Typography>
                        <DateTimePicker

                          variant="filled"
                          onChange={(e) => {
                            console.log("e.value", e.target.value);
                            console.log("new Date(e.target.value)", new Date(e.target.value));
                            setDate(new Date(e.target.value));
                            setDateDisplay(e.target.value);
                          }}
                          value={dateDisplay}
                          name="LockTimePicker"
                          sx={{ borderRadius: "4px 0px 0px 0px" }}
                          disableUnderline
                          InputProps={{ style: { height: "54px" } }}
                        />
                      </div>


                    </div>
                    <div
                      className="lockerButton">
                      <LockTimeButtons
                        date={date}
                        setDate={setDate}
                        setDateDisplay={setDateDisplay}
                        setStartingVPower={setStartingVPower}
                        lockAmount={lockAmount}

                      />
                    </div>

                  </div>
                  <div className=" my-4  ">
                    <button
                      className="w-25 hoverButtonGlobal votingActionablesButton increaseTime"
                      onClick={() => {
                        console.log("Action Taken");
                        increaseUnlockTimeMakeDeploy(date, setOpenSigning, enqueueSnackbar, fetchBalanceData, fetchUserData,gaugesQueryData);
                      }}
                    >
                      <p className="increaseAllowanceButton">
                        Increase Time
                      </p>
                    </button>
                  </div>
                </>

              )}
            </div>
          )}

        </Form>
      </Formik >
      < div className="row no-gutters mt-4 justify-content-center align-items-center" >
        <div className="col-12">
          <Paper elevation={3} style={{ padding: "20px" }}>
            Your starting voting power will be: &nbsp;
            <strong>{startingVPower} veCRV</strong>
          </Paper>
        </div>
      </div >
      {
        newVotingPower() < 2500 ? < div className="no-gutters mt-4 justify-content-center align-items-center" >
          <Alert severity="info">
            You need at least 2500 veCRV to be able to create a &nbsp;
            <span
              className="font-weight-bold"
              style={{ borderBottom: "1px dashed white", color: "#1976d2" }}
            >
              <Link to="/" style={{ textDecoration: "none", color: "#1976d2" }}>
                Curve DAO proposal
              </Link>
            </span>
          </Alert>
        </div > : null
      }
      {
        hasEndedLock() && CRVLockedBalanceValue !== 0 ? < div className="no-gutters mt-4 justify-content-center align-items-center" >
          <Alert severity="info">
            Your lock ended, you can withdraw your CRV
          </Alert>
        </div > : null
      }
      <SigningModal show={openSigning} />
      <AllowanceModal show={openAllowance} signingModal={setOpenSigning} getAllowance={getAllowance} handleClose={handleCloseAllowance} approvalAmount={(lockAmount * 10 ** 9) - allowance} tokenAmount={lockAmount} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} />
    </>
  );
};

export default VotingPowerActionables;