// REACT
import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
// CUSTOM STYLES
import "../../assets/css/common.css";
import "../../assets/css/curveButton.css";
import "../../assets/css/style.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import DateTimePicker from "../FormsUI/DateTimePicker";
import LockTimeButtons from "../FormsUI/LockTimeButtons";
import TextInput from "../FormsUI/TextInput";
// MATERIAL UI ICONS
// MATERIAL UI
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
// FORMIK AND YUP
import { Form, Formik } from "formik";
import AllowanceModal from "../Modals/AllowanceModal";
// CONTEXT
import { Alert, Button } from "@mui/material";
import { default as Axios, default as axios } from "axios";
import { CLPublicKey } from "casper-js-sdk";
import { useSnackbar } from "notistack";
import * as helpers from "../../assets/js/helpers";
import { AppContext } from "../../containers/App/Application";
import { ERC20_CRV_CONTRACT_HASH, VOTING_ESCROW_CONTRACT_HASH } from "../blockchain/Hashes/ContractHashes";
import { VOTING_ESCROW_PACKAGE_HASH } from "../blockchain/Hashes/PackageHashes";
import * as erc20CrvFunctions from "../JsClients/ERC20CRV/erc20crvFunctions/functions";
import * as votingEscrowFunctions from "../JsClients/VOTINGESCROW/QueryHelper/functions";
import SigningModal from "../Modals/SigningModal";
// CONTENT

const lockTimeOptionsJSON =
  '[{"name": "1 Week"},{"name": "1 Month"},{"name": "3 Months"},{"name": "6 Months"},{"name": "1 Year"},{"name": "4 Years"}]';

let lockTimeOptions = [];
try {
  lockTimeOptions = JSON.parse(lockTimeOptionsJSON);
} catch (expecption) {
  console.log("an exception has occured!", expecption);
}

// COMPONENT FUNCTION
const VotingPowerActionables = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const { createLockMakeDeploy, withdrawMakeDeploy, increaseAndDecreaseAllowanceMakeDeploy, increaseAmountMakeDeploy, increaseUnlockTimeMakeDeploy } = useContext(AppContext);

  // States
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
  const [lockEnd, setLockEnd] = useState(Date.now())
  const [increaseLock, setIncreaseLock] = useState(Date.now())
  const [deposit, setDeposit] = useState(0)
  const [CRVBalance, setCRVBalance] = useState(0);
  const [DAOPower, setDaoPower] = useState(0);
  const [CRVLocked, setCRVLocked] = useState(0);


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
  // const validationSchema = Yup.object().shape({
  //   LockAmount: Yup.number().required("Required"),
  //   LockTimeSelect: Yup.string().required("Required"),
  //   LockTimePicker: Yup.date().required("Required"),
  //   // tokenBQuantity: Yup.number().required("Required"),
  // });

  // Handlers
  // const handleCloseA = () => {
  //   setOpenA(false);
  // };

  // const handleOpenA = () => {
  //   setOpenA(true);
  // };

  // const handleChangetokenA = (event) => {
  //   setLockTime(event.target.value);
  // };

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
    // console.log("Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString(hex)", Buffer.from(CLPublicKey.fromHex(activePublicKey).toAccountHash()).toString("hex"));
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
    axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/balanceOf/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        // handle the response
        console.log("votingEscrow response of balance of:...", response.data);
        setVecrvBalance(response.data.balances[0])
      })
      .catch(error => {
        // handle the error
        console.log("error of balance of:...", error);
      });
    axios.post(`http://curvegraphqlbackendfinalized-env.eba-fn2jdxgn.us-east-1.elasticbeanstalk.com/votingEscrow/lockedEnd/${VOTING_ESCROW_CONTRACT_HASH}`, data)
      .then(response => {
        // handle the response
        console.log("votingEscrow response of lockedEnd:...", response.data);
        setLockTime(response.data.lockedEnd.end)
        setLockEnd(response.data.lockedEnd.end)
      })
      .catch(error => {
        // handle the error
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
    console.log("lockTime", lockTime);
    console.log("_deposit", _deposit);
    console.log("vecrvBalance", vecrvBalance);
    console.log("_deposit * ((lockTime - Date.now()) / 1000) / (86400 * 365) / (4) + (vecrvBalance / 1e9)", (_deposit / 1e9) * ((lockTime - Date.now()) / 1000) / (86400 * 365) / (4) + (vecrvBalance / 1e9));
    return (_deposit / 1e9) * ((lockTime - Date.now()) / 1000) / (86400 * 365) / (4) + (vecrvBalance / 1e9)
  }
  function setMaxBalance() {
    setDeposit(CRVBalance.div(1e9).toString())
  }
  function hasEndedLock() {
    return lockEnd > 0 && Date.now() > lockEnd
  }
  return (
    <>
      <Formik
        initialValues={initialValues}
        // validationSchema={validationSchema}
        onSubmit={onSubmitVotingPowerActionables}
      >
        <Form>
          {/* WITHDRAWAL CHECK */}
          {hasEndedLock() && CRVLockedBalanceValue !== 0 ? (
            <>
              {/* WITHDRAWAL BUTTON */}
              <div className="row no-gutters justify-content-center">
                <div className="col-12 col-md-4">
                  <div className=" my-4 text-center">
                    <Button
                      className="hoverButtonGlobal"
                      // variant="contained"
                      size="large"
                      // style={{ backgroundColor: "#1976d2", color: "white" }}
                      onClick={() => {
                        console.log("Action Taken");
                        // props.createLockMakeDeploy(lockAmount, date);
                        withdrawMakeDeploy(setOpenSigning, enqueueSnackbar,fetchBalanceData,fetchUserData);
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
              {/* Set Amount */}
              {userCRVBalance === 0 ? (
                // TRUE CONDITION WORK
                <>
                  <div className="w-100">
                    <Typography>
                      Lock Amount
                    </Typography>
                    <div className="d-flex ">
                    <div style={{width:"35%"}}>
                    <TextInput
                      id="daoAmount"
                      label=""
                      onChange={(e) => {
                        // console.log("dam", e.target.value);
                        console.log("event", e);
                        console.log("e.srcElement", e.srcElement);
                        console.log("e.target.value", e.target.value);

                        if (userCRVBalance >= e.target.value)
                          setLockAmount(e.target.value);
                        else {
                          // setLockAmount(userCRVBalance);
                          setLockAmount(e.target.value);
                        }
                      }}
                      value={Number(lockAmount).toString()}
                      variant="filled"
                      type="number"
                      name="LockAmount"
                      InputProps={{ style: { height: "45px" } }}
                      // sx={{  }}
                    />
                    </div>
                    {/* <Grid item sx={12} sm={6}> */}
                      <div className="d-flex  " >
                        <Button
                          // style={buttonStyle}
                          className="hoverButtonGlobal"
                          // variant="outlined"
                          size="medium"
                          onClick={() => {
                            setLockAmount(userCRVBalance);
                          }}
                        
                        >
                          Max
                        </Button>

                        <div className="align-self-end">
                          <p className=""
                            // variant="p"
                            // gutterBottom
                            // component="span"
                            // fontWeight={900}
                            style={{ fontSize: "0.7rem",color:"gray",marginBottom:"0"}}
                          >
                            {`(${userCRVBalance})`}
                          </p>
                        </div>
                      </div>
                      </div>
                    {/* </Grid> */}
                  </div>
                  {/* <Grid container spacing={0}>

                    <Grid item xs={12} sm={6}>
                      <TextInput
                        id="daoAmount"
                        label="Lock Amount"
                        onChange={(e) => {
                          // console.log("dam", e.target.value);
                          console.log("event", e);
                          console.log("e.srcElement", e.srcElement);
                          console.log("e.target.value", e.target.value);

                          if (userCRVBalance >= e.target.value)
                            setLockAmount(e.target.value);
                          else {
                            // setLockAmount(userCRVBalance);
                            setLockAmount(e.target.value);
                          }
                        }}
                        value={Number(lockAmount).toString()}
                        variant="filled"
                        type="number"
                        name="LockAmount"
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                    {/* Max Button */}
                    {/* <Grid item xs={12} sm={6}>
                      <div className="d-flex  justify-content-sm-center align-items-center ">
                        <div className="">
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#1976d2", color: "white" }}
                            onClick={() => {
                              setLockAmount(userCRVBalance);
                            }}
                          >
                            Max
                          </Button>
                        </div>
                        <div className="">
                          <Typography
                            variant="body1"
                            gutterBottom
                            component="span"
                            fontWeight={900}
                            sx={{ padding: "10px", fontSize: "1.5rem" }}
                          >
                            {userCRVBalance}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid> */}
                  {/* Lock Time */}

                  <div className="d-flex mt-4">
                  <div className="" style={{width:"35%"}}>
                    <div className=" px-0" >
                      <Typography>
                      Choose Lock Time
                      </Typography>
                      <DateTimePicker
                         onChange={(e) => {
                          console.log("e.value", e.target.value);
                          console.log("new Date(e.target.value)", new Date(e.target.value));
                          setDate(new Date(e.target.value));
                          setDateDisplay(e.target.value);
                        }}
                        value={dateDisplay}
                        name="LockTimePicker"
                        InputProps={{ style: { height: "50px" } }}
                        // label="Choose Lock Time"
                        // sx={{ width: "35%" }}
                      />
                    </div>
                  </div>
                  <div 
                  // style={{width:"35%"}} 
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


                  {/* <div className="row no-gutters mt-4 align-items-center justify-content-lg-between">
                    <div className="col-xs-12 col-6 px-0">
                      <DateTimePicker
                        onChange={(e) => {
                          console.log("e.value", e.target.value);
                          console.log("new Date(e.target.value)", new Date(e.target.value));
                          setDate(new Date(e.target.value));
                          setDateDisplay(e.target.value);
                        }}
                        value={dateDisplay}
                        name="LockTimePicker"
                        label="Choose Lock Time"
                        sx={{ width: "100%" }}
                      />
                    </div>

                  </div> */}
                  {/* TIME BUTTONS */}
                  {/* <div className=""> */}

                  {/* </div> */}
                  {/* CREATE LOCK BUTTON */}
                  {/* <Grid container spacing={0}>
                    <Grid item xs={12} sm={6}>
                      <LockTimeButtons

                        date={date}
                        setDate={setDate}
                        setDateDisplay={setDateDisplay}
                        setStartingVPower={setStartingVPower}
                        lockAmount={lockAmount}

                      // name="LockTimeSelect"
                      // label="Select Lock Time"
                      // options={lockTimeOptions.map((item) => item.name)}
                      />
                    </Grid>
                    <Grid item sm={1.4}></Grid>
                    <Grid item xs={12} sm={3}> */}
                      <div className=" my-4 ">
                        {lockAmount * 10 ** 9 > allowance ? (
                          <Button
                            // variant="contained"
                            className="w-25 hoverButtonGlobal"
                            size="large"
                            // style={{ backgroundColor: "#1976d2", color: "white" }}
                            onClick={() => {
                              console.log("Action Taken");
                              // props.createLockMakeDeploy(lockAmount, date);
                              handleShowAllowance();
                            }}
                          >
                            Increase Allowance
                          </Button>
                        ) : (
                          <Button
                            // variant="contained"
                            className="w-25 hoverButtonGlobal"
                            size="large"
                            // style={{ backgroundColor: "#1976d2", color: "white", }}
                            onClick={() => {
                              console.log("Action Taken");
                              // props.createLockMakeDeploy(lockAmount, date);
                              createLockMakeDeploy(lockAmount, date, setOpenSigning, enqueueSnackbar,fetchBalanceData,fetchUserData);
                            }}
                          >
                            Create Lock
                          </Button>
                        )}
                      </div>
                    {/* </Grid>
                  </Grid> */}
                </>
              ) : (
                // FALSE CONDIIION WORK

                <>
                  <div className="w-100">
                    <Typography>
                      Lock Amount
                    </Typography>
                    <div className="d-flex ">
                    <div style={{width:"35%"}}>
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
                      type="number"
                      name="LockAmount"
                      InputProps={{ style: { height: "45px" } }}
                      // sx={{  }}
                    />
                    </div>
                    {/* <Grid item sx={12} sm={6}> */}
                      <div className="d-flex  " >
                        <Button
                          // style={buttonStyle}
                          className="hoverButtonGlobal"
                          // variant="outlined"
                          size="medium"
                          onClick={() => {
                            setLockAmount(userCRVBalance);
                          }}
                        >
                          Max
                        </Button>

                        <div className="align-self-end">
                          <p className=""
                            // variant="p"
                            // gutterBottom
                            // component="span"
                            // fontWeight={900}
                            style={{ fontSize: "0.7rem",color:"gray",marginBottom:"0"}}
                          >
                            {`(${userCRVBalance})`}
                          </p>
                        </div>
                      </div>
                      </div>
                    {/* </Grid> */}
                  </div>


                  {/* Increase Allowance Button */}
                 
                      <div className="">
                        <div className=" my-4 ">
                          {lockAmount * 10 ** 9 > allowance ? (
                            <Button
                              className="w-25 hoverButtonGlobal"
                              variant="outlined"
                              size="large"
                              // style={{ backgroundColor: "#1976d2", color: "white" }}
                              onClick={() => {
                                console.log("Action Taken");
                                // props.createLockMakeDeploy(lockAmount, date);
                                handleShowAllowance();
                              }}
                            >
                              Increase Allowance
                            </Button>
                          ) : (
                            <Button
                              className="w-25 hoverButtonGlobal"
                              variant="outlined"
                              size="large"
                              onClick={() => {
                                console.log("Action Taken");
                                // props.createLockMakeDeploy(lockAmount, date);
                                increaseAmountMakeDeploy(lockAmount, setOpenSigning, enqueueSnackbar,fetchBalanceData,fetchUserData);
                              }}
                            >
                              Add Amount
                            </Button>
                          )}

                        </div>
                      </div>
                  {/* ADD BUTTON */}

                  {/* Lock Time */}
                  <div className="d-flex">
                  <div className="" style={{width:"35%"}}>
                    <div className=" px-0" >
                      <Typography>
                      Choose Lock Time
                      </Typography>
                      <DateTimePicker
                        onChange={(e) => {
                          console.log("e.value", e.target.value);
                          console.log("new Date(e.target.value)", new Date(e.target.value));
                          setDate(new Date(e.target.value));
                          setDateDisplay(e.target.value);
                        }}
                        value={dateDisplay}
                        name="LockTimePicker"
                        InputProps={{ style: { height: "50px" } }}
                        // label="Choose Lock Time"
                        // sx={{ width: "35%" }}
                      />
                    </div>
                    {/* Lock Time Dropdown */}
                    {/* <div className="col-12 col-lg-5 text-lg-right dao-form-width mt-3 mt-lg-0">
                      <SelectInput
                        setDate={setDate}
                        setDateDisplay={setDateDisplay}
                        name="LockTimeSelect"
                        label="Select Lock Time"
                        options={lockTimeOptions.map((item) => item.name)}
                      />
                    </div> */}


                  </div>
                  <div 
                  // style={{width:"35%"}} 
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
                  {/* <Grid container spacing={0}>
                    <Grid item xs={12} sm={6}>
                    
                    </Grid>
                    <Grid item sm={1.2}></Grid>
                    <Grid item xs={12} sm={3}> */}
                      <div className=" my-4  ">
                        <Button
                          className="w-25 hoverButtonGlobal"
                          variant="outlined"
                          size="large"
                          // style={{ backgroundColor: "#1976d2", color: "white", }}
                          onClick={() => {
                            console.log("Action Taken");
                            // props.createLockMakeDeploy(lockAmount, date);
                            increaseUnlockTimeMakeDeploy(date, setOpenSigning, enqueueSnackbar,fetchBalanceData,fetchUserData);
                          }}
                        >
                          Increase Time
                        </Button>
                      </div>
                    {/* </Grid>

                  </Grid> */}
                </>

              )}
              {/* <div className="row no-gutters justify-content-center">
              <div className="col-12 col-md-4">
                <div className="btnWrapper my-4 text-center">
                  {lockAmount * 10 ** 9 > allowance ? (
                    <Button
                      variant="contained"
                      size="large"
                      style={{ backgroundColor: "#1976d2", color: "white" }}
                      onClick={() => {
                        console.log("Action Taken");
                        handleShowAllowance();
                      }}
                    >
                      Increase Allowance
                    </Button>
                  ) : (
                    props.userLockedCRVBalance !== 0 ? (
                      Date.now() > 0 ? (
                        <Button
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => {
                            console.log("Action Taken");
                            // props.withdrawMakeDeploy();
                            withdrawMakeDeploy();
                          }}
                        >
                          withdraw
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#1976d2", color: "white" }}
                          onClick={() => {Your starting 
                            console.log("Action Taken");
                            // props.withdrawMakeDeploy();
                            withdrawMakeDeploy();
                          }}
                        >
                          withdraw
                        </Button>
                      )

                    ) : (
                      <Button
                        variant="contained"
                        size="large"
                        style={{ backgroundColor: "#1976d2", color: "white" }}
                        onClick={() => {
                          console.log("Action Taken");
                          // props.createLockMakeDeploy(lockAmount, date);
                          createLockMakeDeploy(lockAmount, date);
                        }}
                      >
                        Create Lock
                      </Button>
                    )


                  )}

                </div>
              </div>
            </div> */}

            </div>
          )}

        </Form>
      </Formik >
      {/* Starting Voting Power */}
      < div className="row no-gutters mt-4 justify-content-center align-items-center" >
        <div className="col-12">
          <Paper elevation={10} style={{ padding: "20px" }}>
            Your starting voting power will be: &nbsp;
            <strong>{startingVPower} veCRV</strong>
          </Paper>
        </div>
      </div >
      {/* DAO Proposal Requirements */}
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

      {/* Gas Priority Fee */}
      {/* <div className="row no-gutters mt-4">
        <div className="col-12">
          <GasPriorityFee />
        </div>
      </div> */}
      <SigningModal show={openSigning} />
      <AllowanceModal show={openAllowance} signingModal={setOpenSigning} getAllowance={getAllowance} handleClose={handleCloseAllowance} approvalAmount={(lockAmount * 10 ** 9) - allowance} tokenAmount={lockAmount} increaseAndDecreaseAllowanceMakeDeploy={increaseAndDecreaseAllowanceMakeDeploy} />
    </>
  );
};

export default VotingPowerActionables;
