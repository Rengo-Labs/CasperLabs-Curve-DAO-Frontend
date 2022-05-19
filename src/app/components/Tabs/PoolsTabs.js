//REACT
import React, { useState } from "react";
//CUSTOM CSS
import "../../assets/css/poolsTabs.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
//COMPONENTS
import PoolsTableAll from "../Tables/PoolsTableAll";
import PoolsDashboard from "../Dashboard/PoolsDashboard";
//MATERIAL UI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { StyledEngineProvider } from "@mui/styled-engine";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Link } from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";

//CONTENT
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

// TabPanel.propTypes = {
//   children: PropTypes.node,
//   index: PropTypes.number.isRequired,
//   value: PropTypes.number.isRequired,
// };

// function a11yProps(index) {
//   return {
//     id: `simple-tab-${index}`,
//     "aria-controls": `simple-tabpanel-${index}`,
//   };
// }

const cells = ["Pool", "Base vAPY", "Rewards tAPR", "Volume", "TVL"];
const sampleData =
  '[{"pool":{"logo": "../../assets/img/usdc.png", "title": "tricrypto2", "reference": "CRYPTO"},"base":"0.73%","rewards":"+3.09%","volume":"$62.7m","tvl":"$868.7m", "id": "123"},{"pool":{"logo": "/busd.png", "title": "sUSD", "reference": "USD"},"base":"2.09%","rewards":"+0.32%","volume":"$24.5m","tvl":"$96.2m"},{"pool":{"logo": "./busd.png", "title": "steth", "reference": "ETH"},"base":"2.09%","rewards":"+0.32%","volume":"$76.2m","tvl":"$121.1m"},{"pool":{"logo": "./busd.png", "title": "reth", "reference": "ETH"},"base":"1.89%","rewards":"+1.63%","volume":"$96.5m","tvl":"$415.23m"},{"pool":{"logo": "./busd.png", "title": "mim", "reference": "USD"},"base":"2.94%","rewards":"+4.28%","volume":"$17.73m","tvl":"$53.112m"},{"pool":{"logo": "./busd.png", "title": "link", "reference": "LINK"},"base":"0.00%","rewards":"+0.22%","volume":"$796m","tvl":"$10.9m"},{"pool":{"logo": "./busd.png", "title": "eurt", "reference": "EUR"},"base":"0.0%","rewards":"+0%","volume":"$0","tvl":"$386.6m"},{"pool":{"logo": "./busd.png", "title": "eurs", "reference": "EUR"},"base":"0.09%","rewards":"+1.71%","volume":"$1589m","tvl":"$35.5m"},{"pool":{"logo": "./busd.png", "title": "3pool", "reference": "USD"},"base":"0.43%","rewards":"+1.07%","volume":"$74.79m","tvl":"$105.3m"},{"pool":{"logo": "./busd.png", "title": "ankreth", "reference": "ETH"},"base":"1.17%","rewards":"+1.25%","volume":"98.92m","tvl":"$215.4m"},{"pool":{"logo": "./busd.png", "title": "cvxweth", "reference": "ETH"},"base":"2.01%","rewards":"+0.21%","volume":"$63.5m","tvl":"$179.1m"}]';
var poolsContent = []; // = JSON.parse(s);
try {
  poolsContent = JSON.parse(sampleData);
} catch (expecption) {}

//COMPONENT FUNCTION
const PoolsTabs = () => {
  //States
  const [value, setValue] = useState(0);

  //Handlers

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div>
        <Box>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            allowScrollButtonsMobile
            aria-label="scrollable force tabs example"
          >
            <Tab
              label="All"
              // {...a11yProps(0)}
            />
            <Tab label="USD" />
            <Tab label="BTC" />
            <Tab label="ETH" />
            <Tab label="Crypto" />
            <Tab label="Others" />
            <Tab label="My Dashboard" id="crvDashboard" />
          </Tabs>
          {/* </Box> */}
          <TabPanel value={value} index={0} className="MuiBox-root">
            <PoolsTableAll tab="all" />
          </TabPanel>
          <TabPanel value={value} index={1} className="MuiBox-root">
            <PoolsTableAll tab="usd" />
          </TabPanel>
          <TabPanel value={value} index={2} className="MuiBox-root">
            <PoolsTableAll tab="btc" />
          </TabPanel>
          <TabPanel value={value} index={3} className="MuiBox-root">
            <PoolsTableAll tab="eth" />
          </TabPanel>
          <TabPanel value={value} index={4} className="MuiBox-root">
            <PoolsTableAll tab="crypto" />
          </TabPanel>
          <TabPanel value={value} index={5} className="MuiBox-root">
            <PoolsTableAll tab="others" />
          </TabPanel>
          <TabPanel value={value} index={6} className="MuiBox-root">
            <PoolsDashboard />
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default PoolsTabs;
