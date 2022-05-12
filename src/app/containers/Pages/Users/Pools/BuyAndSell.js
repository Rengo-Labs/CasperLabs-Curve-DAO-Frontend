//REACT
import React, { useState } from "react";
// CUSTOM STYLING
import "../../../../assets/css/style.css";
import "../../../../assets/css/curveButton.css";
import "../../../../assets/css/common.css";
import "../../../../assets/css/BuyAndSell.css";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
//COMPONENTS
import HeaderHome from "../../../../components/Headers/Header";
import HomeBanner from "../Home/HomeBanner";
import BuyAndSellTab from "../../../../components/Tabs/BuyAndSellTab";
import Deposit from "../../../../components/Tabs/Deposit";
import Withdraw from "../../../../components/Tabs/Withdraw";
import CurrencyReserves from "../../../../components/Stats/CurrencyReserves";
//MATERIAL UI ICONS
//MATERIAL UI
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { StyledEngineProvider } from "@mui/styled-engine";

// CONTENT

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

//COMPONENT FUNCTION
const BuyAndSell = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [openSellInfo, setOpenSellInfo] = useState(false);

  // Handlers
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Pools"}
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
              <Box sx={{ width: "100%" }}>
                <Box>
                  <StyledEngineProvider injectFirst>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs example"
                      centered
                    >
                      <Tab
                        label="Buy And Sell"
                        {...a11yProps(0)}
                        className="mr-md-3 mr-lg-5 px-2"
                      />
                      <Tab
                        label="Deposits"
                        {...a11yProps(1)}
                        className="mr-md-3 mr-lg-5 px-2"
                      />
                      <Tab
                        label="Withdraw"
                        {...a11yProps(2)}
                        className="mr-md-3 mr-lg-5 px-2"
                      />
                    </Tabs>
                  </StyledEngineProvider>
                </Box>
                {/* Buy And Sell TabPanel */}
                <StyledEngineProvider injectFirst>
                  <div className="tabPanel-wrapper">
                    <TabPanel value={value} index={0} className="MuiBox-root">
                      <fieldset>
                        <legend>Buy and Sell</legend>
                        <div className="row no-gutters justify-content-center">
                          <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                            <BuyAndSellTab />
                          </div>
                        </div>
                      </fieldset>
                    </TabPanel>

                    {/* Deposits TabPanel */}
                    <TabPanel value={value} index={1}>
                      <fieldset>
                        <legend>Deposits</legend>
                        <div className="row no-gutters justify-content-center">
                          <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                            <Deposit />
                          </div>
                        </div>
                      </fieldset>
                    </TabPanel>
                    {/* Withdraw TabPanel */}
                    <TabPanel value={value} index={2}>
                      <fieldset>
                        <legend>Withdraw</legend>
                        <div className="row no-gutters justify-content-center">
                          <div className="curve-content-wrapper mui-form-width col-12 col-lg-12 col-xl-6">
                            <Withdraw />
                          </div>
                        </div>
                      </fieldset>
                    </TabPanel>
                  </div>
                </StyledEngineProvider>
              </Box>
            </div>
          </div>
        </div>
        {/* Currency Reserves */}
        <StyledEngineProvider injectFirst>
          <div className="container-fluid">
            <div className="curve-container">
              <div className="curve-content-banks">
                <Box sx={{ widht: "100%" }}>
                  <fieldset>
                    <legend>Currency Reserves</legend>
                    <div className="row no-gutters justify-content-center">
                      <div className="curve-content-wrapper col-12 col-lg-12 col-xl-6">
                        <CurrencyReserves />
                      </div>
                    </div>
                  </fieldset>
                </Box>
              </div>
            </div>
          </div>
        </StyledEngineProvider>
      </div>
    </>
  );
};

export default BuyAndSell;
