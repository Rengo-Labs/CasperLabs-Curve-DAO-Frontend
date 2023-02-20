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
  const [allowance, setAllowance] = useState(0);
  const [userCRVBalance, setUserCRVBalance] = useState(0);
  const [CRVLockedBalance, setCRVLockedBalance] = useState(0);
  const [dateDisplay, setDateDisplay] = useState();
  const [date, setDate] = useState();
  const [lockAmount, setLockAmount] = useState(0);
  const [openA, setOpenA] = useState(false);
  const [startingVPower, setStartingVPower] = useState();
  const [CRVLockedBalanceValue, setCRVLockedBalanceValue] = useState();
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
    let activePublicKey = localStorage.getItem("Address")
    if (activePublicKey && activePublicKey != 'null' && activePublicKey != undefined)
      getAllowance()
  }, []);

  const getAllowance = () => {
    let activePublicKey = localStorage.getItem("Address");

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
    let publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      async function fetchData() {
        let CRVLockBalance = await votingEscrowFunctions.balanceOf(VOTING_ESCROW_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        // console.log("Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString(hex)", Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        let CRVBalance = await erc20CrvFunctions.balanceOf(ERC20_CRV_CONTRACT_HASH, Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("hex"));
        console.log("CRV Locked Balance: ", CRVLockBalance);
        console.log("CRV Balance: ", CRVBalance);
        setCRVLockedBalanceValue(CRVLockBalance);
        setUserCRVBalance(CRVBalance / 10 ** 9);
      }
      fetchData();
    }
    return () => {
      controller.abort();
    }
  }, [localStorage.getItem("Address")]);



  useEffect(() => {
    let controller = new AbortController();

    let publicKeyHex = localStorage.getItem("Address");
    if (
      publicKeyHex !== null &&
      publicKeyHex !== "null" &&
      publicKeyHex !== undefined
    ) {
      async function fetchData() {
        let data = { account: Buffer.from(CLPublicKey.fromHex(publicKeyHex).toAccountHash()).toString("Hex") }
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
            CLPublicKey.fromHex(publicKeyHex).toAccountHash()
          ).toString("hex")
        );
        setCRVBalance(CRVBalance)
        setDeposit((CRVBalance / 10 ** 9).toFixed(0, 1))

      }
      fetchData()
    }

    return () => {
      controller.abort();
    };
  }, [])
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
          {hasEndedLock() ? (
            <>
              {/* WITHDRAWAL BUTTON */}
              <div className="row no-gutters justify-content-center">
                <div className="col-12 col-md-4">
                  <div className="btnWrapper my-4 text-center">
                    <Button
                      variant="contained"
                      size="large"
                      style={{ backgroundColor: "#5300e8", color: "white" }}
                      onClick={() => {
                        console.log("Action Taken");
                        // props.createLockMakeDeploy(lockAmount, date);
                        withdrawMakeDeploy(setOpenSigning, enqueueSnackbar);
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
                  <div className="row no-gutters align-items-center justify-content-center justify-content-lg-between">

                    <div className="col-12 col-lg-5">
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
                    </div>
                    {/* Max Button */}
                    <div className="col-12 col-lg-5 mt-3 mt-lg-0">
                      <div className="row no-gutters align-items-center">
                        <div className="col-12 col-lg-5">
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                              setLockAmount(userCRVBalance);
                            }}
                          >
                            Max
                          </Button>
                        </div>
                        <div className="col-12 col-lg-4">
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
                    </div>
                  </div>
                  {/* Lock Time */}
                  <div className="row no-gutters mt-4 align-items-center justify-content-center justify-content-lg-between">
                    <div className="col-12 col-lg-5 px-0">
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

                  </div>
                  {/* TIME BUTTONS */}
                  {/* <div className=""> */}
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
                  {/* </div> */}
                  {/* CREATE LOCK BUTTON */}
                  <div className="row no-gutters justify-content-center">
                    <div className="col-12" style={{ marginRight: "8%" }}>
                      <div className="btnWrapper my-4 text-center">
                        {lockAmount * 10 ** 9 > allowance ? (
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
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
                            variant="contained"

                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white", minWidth: "25%" }}
                            onClick={() => {
                              console.log("Action Taken");
                              // props.createLockMakeDeploy(lockAmount, date);
                              createLockMakeDeploy(lockAmount, date, setOpenSigning, enqueueSnackbar);
                            }}
                          >
                            Create Lock
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                // FALSE CONDIIION WORK

                <>
                  <div className="row no-gutters align-items-center justify-content-center justify-content-lg-between">

                    <div className="col-12 col-lg-5">
                      <TextInput
                        id="daoAmount"
                        label="Lock Amount"
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
                        sx={{ width: "100%" }}
                      />
                    </div>
                    {/* Max Button */}
                    <div className="col-12 col-lg-5 mt-3 mt-lg-0">
                      <div className="row no-gutters align-items-center">
                        <div className="col-12 col-lg-8">
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                              setLockAmount(userCRVBalance);
                            }}
                          >
                            Max
                          </Button>
                        </div>
                        <div className="col-12 col-lg-4">
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
                    </div>
                  </div>
                  {/* ADD BUTTON */}
                  <div className="row no-gutters justify-content-center">
                    <div className="col-12 col-md-4">
                      <div className="btnWrapper my-4 text-center">
                        {lockAmount * 10 ** 9 > allowance ? (
                          <Button
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
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
                            variant="contained"
                            size="large"
                            style={{ backgroundColor: "#5300e8", color: "white" }}
                            onClick={() => {
                              console.log("Action Taken");
                              // props.createLockMakeDeploy(lockAmount, date);
                              increaseAmountMakeDeploy(lockAmount, setOpenSigning, enqueueSnackbar);
                            }}
                          >
                            Add Amount
                          </Button>
                        )}

                      </div>
                    </div>
                  </div>
                  {/* Lock Time */}
                  <div className="row no-gutters mt-4 align-items-center justify-content-center justify-content-lg-between">
                    <div className="col-12 col-lg-5 px-0">
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
                    <LockTimeButtons
                      date={date}
                      setDate={setDate}
                      setDateDisplay={setDateDisplay}
                      setStartingVPower={setStartingVPower}
                      lockAmount={lockAmount}

                    />

                  </div>
                  <div className="row no-gutters justify-content-center">
                    <div className="col-12 col-md-4">
                      <div className="btnWrapper my-4 text-center">
                        <Button
                          variant="contained"
                          size="large"
                          style={{ backgroundColor: "#5300e8", color: "white" }}
                          onClick={() => {
                            console.log("Action Taken");
                            // props.createLockMakeDeploy(lockAmount, date);
                            increaseUnlockTimeMakeDeploy(date, setOpenSigning, enqueueSnackbar);
                          }}
                        >
                          Increase Time
                        </Button>
                      </div>
                    </div>
                  </div>
                </>

              )}
              {/* <div className="row no-gutters justify-content-center">
              <div className="col-12 col-md-4">
                <div className="btnWrapper my-4 text-center">
                  {lockAmount * 10 ** 9 > allowance ? (
                    <Button
                      variant="contained"
                      size="large"
                      style={{ backgroundColor: "#5300e8", color: "white" }}
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
                          style={{ backgroundColor: "#5300e8", color: "white" }}
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
                          style={{ backgroundColor: "#5300e8", color: "white" }}
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
                        style={{ backgroundColor: "#5300e8", color: "white" }}
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
      {newVotingPower() < 2500 ? < div className="no-gutters mt-4 justify-content-center align-items-center" >
        <Alert severity="info">
          You need at least 2500 veCRV to be able to create a &nbsp;
          <span
            className="font-weight-bold"
            style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
          >
            <Link to="/" style={{ textDecoration: "none", color: "#5300e8" }}>
              Curve DAO proposal
            </Link>
          </span>
        </Alert>
      </div > : null}
      {hasEndedLock() ? < div className="no-gutters mt-4 justify-content-center align-items-center" >
        <Alert severity="info">
          Your lock ended, you can withdraw your CRV
        </Alert>
      </div > : null}

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
