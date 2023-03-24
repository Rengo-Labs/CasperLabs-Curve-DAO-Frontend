import React, { useState } from "react";
import "../../assets/css/poolsTabs.css";
import "../../assets/css/bootstrap.min.css";
import PoolsDashboard from "../Dashboard/PoolsDashboard";
import PoolsTableAll from "../Tables/PoolsTableAll";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
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

const PoolsTabs = () => {
  const [value, setValue] = useState(0);
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
