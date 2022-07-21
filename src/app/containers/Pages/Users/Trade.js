// REACT
import React, { useState } from "react";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
// CUSTOM STYLING
import "../../../assets/css/common.css";
import "../../../assets/css/style.css";
import "../../../assets/css/curveButton.css";
// COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import TradeCandleSticks from "../../../components/Charts/TradeCandleSticks";
import SplineArea from "../../../components/Charts/SplineArea";
import AdvancedOptions from "../../../components/Modals/AdvancedOptions";
import SelectInput from "../../../components/FormsUI/SelectInput";
// MATERIAL UI
import Paper from "@mui/material/Paper";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { makeStyles } from "@material-ui/core/styles";
import { StyledEngineProvider } from "@mui/styled-engine";
//MATERIAL UI ICONS
import SwapVertIcon from "@mui/icons-material/SwapVert";
// FORMIK AND YUP
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
//ICONS
import daiIcon from "../../../assets/img/dai.png";
import busdIcon from "../../../assets/img/busd.png";
import sbtcIcon from "../../../assets/img/sbtc.png";
import tusdIcon from "../../../assets/img/tusd.png";
import usdcIcon from "../../../assets/img/usdc.png";
import wbtcIcon from "../../../assets/img/wbtc.png";

// CONTENT

const tokens = [
  {
    name: "DAI",
    icon: daiIcon, // can also use a link
  },
  {
    name: "BUSD",
    icon: busdIcon, // can also use a link
  },
  {
    name: "sBTC",
    icon: sbtcIcon, // can also use a link
  },
  {
    name: "TUSD",
    icon: tusdIcon, // can also use a link
  },
  {
    name: "USDC",
    icon: usdcIcon, // can also use a link
  },
  {
    name: "wBTC",
    icon: wbtcIcon, // can also use a link
  },
];

// --Mui Theme
const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "25ch",
    },
  },
}));

// --Tabs
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

// COMPONENT FUNCTION
const Trade = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [poolTokens2, setPoolTokens2] = useState("3pool LP token");
  const [value, setValue] = useState(0);
  const [token, setToken] = useState("");
  const [tokenA, setTokenA] = useState("DAI");
  const [tokenB, setTokenB] = useState("USDC");
  const [openA, setOpenA] = useState(false);
  const [openB, setOpenB] = useState(false);
  const [tokenAQuantity, setTokenAQuantity] = useState();
  const [tokenBQuantity, setTokenBQuantity] = useState();
  const [xrateWithFee, setXrateWithFee] = useState(0.9991);
  const [tradeRoute, setTradeRoute] = useState("tusd");
  const [openAdvancedOptions, setOpenAdvancedOptions] = useState(false);

  const classes = useStyles();

  // Content
  const initialValues = {
    selectTokenForChart: "",
  };
  const validationSchema = Yup.object().shape({
    selectTokenForChart: Yup.string().required("Required"),
  });

  // Handlers
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleTokenChange = (event) => {
    setToken(event.target.value);
  };

  const handleChangetokenA = (event) => {
    setTokenA(event.target.value);
  };

  const handleChangetokenB = (event) => {
    setTokenB(event.target.value);
  };

  const handleCloseA = () => {
    setOpenA(false);
  };

  const handleCloseB = () => {
    setOpenB(false);
  };

  const handleOpenA = () => {
    setOpenA(true);
  };

  const handleOpenB = () => {
    setOpenB(true);
  };

  const handleTokenAQuantity = (e) => {
    setTokenAQuantity(e.target.value);
  };

  const handleTokenBQuantity = (e) => {
    setTokenBQuantity(e.target.value);
  };

  const onSubmitSelectToken = (values, props) => {
    console.log("Form data from Select Token", values);
  };

  const handleOpenAdvancedOptions = () => setOpenAdvancedOptions(true);
  const handleCloseAdvancedOptions = () => setOpenAdvancedOptions(false);

  return (
    <>
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderHome
            setActivePublicKey={setActivePublicKey}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            selectedNav={"Trade"}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          >
            <HomeBanner />
          </div>
          <div className="container-fluid">
            <div className="curve-container">
              <div className="curve-content-banks">
                <fieldset>
                  <legend>Trade</legend>
                  <div className="row no-gutters justify-content-center">
                    <div className="curve-content-wrapper col-12 col-lg-6 ">
                      <div className="row no-gutters">
                        {/* Candle Stick Chart */}
                        <div className="col-12">
                          <Paper elevation={4}>
                            <div className="py-5 px-4">
                              <Formik
                                initialValues={initialValues}
                                validationSchema={validationSchema}
                                onChange={onSubmitSelectToken}
                              >
                                <Form>
                                  <div className="row no-gutters">
                                    <div className="col-12 col-md-8 col-lg-6 mt-3">
                                      <SelectInput
                                        name="selectTokenForChart"
                                        label="Select Token for Chart"
                                        options={tokens}
                                      />
                                    </div>
                                  </div>
                                </Form>
                              </Formik>
                              <TradeCandleSticks token={token} />
                            </div>
                          </Paper>
                        </div>
                        {/* Spline Area Chart */}
                        <div className="col-12 mt-4">
                          <Paper elevation={4}>
                            <div className="py-5 px-4">
                              <SplineArea />
                            </div>
                          </Paper>
                        </div>
                        {/* Swap using all Curve pools */}
                        <div className="col-12 mt-4">
                          <Paper elevation={4}>
                            <div className="py-5 px-4">
                              {/* Heading */}
                              <div className="col-12">
                                <Typography
                                  variant="h5"
                                  gutterBottom
                                  component="div"
                                  fontWeight={900}
                                >
                                  Swap using all Curve pools
                                </Typography>
                              </div>
                              {/* TOKEN A */}
                              <div className="row no-gutters justify-content-center">
                                <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                                      <FormControl variant="filled">
                                        <Select
                                          labelId="constrolled-tokenA-selector"
                                          id="tokenA-controlled-open"
                                          open={openA}
                                          onClose={handleCloseA}
                                          onOpen={handleOpenA}
                                          value={tokenA}
                                          onChange={handleChangetokenA}
                                          placeholder="Select Token"
                                        >
                                          <MenuItem value={"DAI"}>
                                            <div className="iconsHanlde row no-gutters align-items-center">
                                              <img
                                                src={daiIcon}
                                                alt="DAI token icon"
                                              />
                                              <span>DAI</span>
                                            </div>
                                          </MenuItem>
                                          <MenuItem value={"USDC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={usdcIcon}
                                                alt="USDC token icon"
                                              />
                                              <span>USDC</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"USDT"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={usdcIcon}
                                                alt="USDT token icon"
                                              />
                                              <span>USDT</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"TUSD"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={tusdIcon}
                                                alt="TUSD token icon"
                                              />
                                              <span>TUSD</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"BUSD"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={busdIcon}
                                                alt="BUSD token icon"
                                              />
                                              <span>BUSD</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"wBTC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={wbtcIcon}
                                                alt="wBTC token icon"
                                              />
                                              <span>wBTC</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"sBTC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={sbtcIcon}
                                                alt="sBTC token icon"
                                              />
                                              <span>sBTC</span>
                                            </span>
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                                      <Box
                                        className={classes.root}
                                        noValidate
                                        autoComplete="off"
                                      >
                                        <TextField
                                          id="tokenQuantityA"
                                          placeholder="0.00"
                                          variant="filled"
                                          value={tokenAQuantity}
                                          onChange={handleTokenAQuantity}
                                        />
                                      </Box>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* SWAP ICON */}
                              <div className="row no-gutters justify-content-center">
                                <div className="col-12 text-center">
                                  <StyledEngineProvider injectFirst>
                                    <div className="swapIconWrapper">
                                      <SwapVertIcon className="tokenSwapIcon" />
                                    </div>
                                  </StyledEngineProvider>
                                </div>
                              </div>
                              {/* TOKEN B */}
                              <div className="row no-gutters justify-content-center">
                                <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                                  <div className="row no-gutters justify-content-center">
                                    <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                                      <FormControl variant="filled">
                                        <Select
                                          labelId="constrolled-tokenB-selector"
                                          id="tokenB-controlled-open"
                                          open={openB}
                                          onClose={handleCloseB}
                                          onOpen={handleOpenB}
                                          value={tokenB}
                                          onChange={handleChangetokenB}
                                          placeholder="Select Token"
                                        >
                                          <MenuItem value={"DAI"}>
                                            <div className="iconsHanlde row no-gutters align-items-center">
                                              <img
                                                src={daiIcon}
                                                alt="DAI token icon"
                                              />
                                              <span>DAI</span>
                                            </div>
                                          </MenuItem>
                                          <MenuItem value={"USDC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={usdcIcon}
                                                alt="USDC token icon"
                                              />
                                              <span>USDC</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"USDT"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={usdcIcon}
                                                alt="USDT token icon"
                                              />
                                              <span>USDT</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"TUSD"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={tusdIcon}
                                                alt="TUSD token icon"
                                              />
                                              <span>TUSD</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"BUSD"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={busdIcon}
                                                alt="BUSD token icon"
                                              />
                                              <span>BUSD</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"wBTC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={wbtcIcon}
                                                alt="wBTC token icon"
                                              />
                                              <span>wBTC</span>
                                            </span>
                                          </MenuItem>
                                          <MenuItem value={"sBTC"}>
                                            <span className="iconsHanlde">
                                              <img
                                                src={sbtcIcon}
                                                alt="sBTC token icon"
                                              />
                                              <span>sBTC</span>
                                            </span>
                                          </MenuItem>
                                        </Select>
                                      </FormControl>
                                    </div>
                                    <div className="col-12 col-md-8 col-lg-6 mt-3 mt-lg-0">
                                      <Box
                                        component="form"
                                        sx={{
                                          "& > :not(style)": {
                                            m: 1,
                                            width: "25ch",
                                          },
                                        }}
                                        noValidate
                                        autoComplete="off"
                                      >
                                        <TextField
                                          id="tokenQuantityB"
                                          placeholder="0.00"
                                          variant="filled"
                                          value={tokenBQuantity}
                                          onChange={handleTokenBQuantity}
                                        />
                                      </Box>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* EXCHANGE RATE AND TRADE ROUTE */}
                              <div className="row no-gutters justify-content-end">
                                <div className="curve-content-wrapper mui-wrapper mui-form-width col-12">
                                  <div className="col-12">
                                    <div className="text-right">
                                      <h4 className="text-body">
                                        Exchange rate {tokenA} / {tokenB}{" "}
                                        (including fees):{" "}
                                        <span className="text-success font-weight-bold">
                                          {xrateWithFee}
                                        </span>
                                      </h4>
                                      <h4 className="text-body">
                                        Trade routed through:{" "}
                                        <span className="text-success font-weight-bold">
                                          {tradeRoute}
                                        </span>
                                      </h4>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* MODAL BUTTON */}
                              <div className="row no-gutters px-4 px-xl-3 pb-4 pb-xl-3 justify-content-center">
                                <div className="col-12 text-center text-md-left">
                                  <div className="btnWrapper">
                                    <button onClick={handleOpenAdvancedOptions}>
                                      Advanced Options
                                    </button>
                                  </div>
                                </div>
                              </div>
                              {/* SELL BUTTON */}
                              <div className="row no-gutters justify-content-center">
                                <div className="btnWrapper">
                                  <button>Sell</button>
                                </div>
                              </div>
                            </div>
                          </Paper>
                        </div>
                      </div>
                    </div>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AdvancedOptions
        show={openAdvancedOptions}
        handleClose={handleCloseAdvancedOptions}
      />
    </>
  );
};

export default Trade;
