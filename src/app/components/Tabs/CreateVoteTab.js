// REACT
import React, { useState } from "react";
// CUSTOM CSS
import "../../assets/css/curveTabs.css";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// COMPONENTS
import GaugeVote from "../Gauge/GaugeVote";
import EmergencyMember from "../Emergency Member/EmergencyMember";
import VotingEscrow from "../VotingEscrow/VotingEscrow";
import Vesting from "../Vesting/Vesting";
import PoolVote from "../Pools/PoolVote";
// MATERIAL UI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import { StyledEngineProvider } from "@mui/styled-engine";

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
const CreateVoteTabs = () => {
  // States
  const [value, setValue] = useState(0);

  //   Handlers
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div>
        <Box>
          <Box
            sx={{
              padding: "20px",
              borderColor: "divider",
              boxShadow: 0,
            }}
          >
            <StyledEngineProvider injectFirst>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="basic tabs example"
                centered
                className="tabBtn"
                variant="scrollable"
              >
                <Tab
                  label="Pool Vote"
                  {...a11yProps(0)}
                />
                <Tab
                  label="Gauge Vote"
                  {...a11yProps(1)}
                />
                <Tab
                  label="Emergency Member"
                  {...a11yProps(2)}
                />
                <Tab
                  label="Voting Escrow"
                  {...a11yProps(3)}
                />
                <Tab
                  label="Pool Proxy"
                  {...a11yProps(4)}
                />
                <Tab
                  label="Registry"
                  {...a11yProps(5)}
                />
                <Tab
                  label="Vesting"
                  {...a11yProps(6)}
                />
                <Tab
                  label="Smart Wallet Checker"
                  {...a11yProps(7)}
                />
              </Tabs>
            </StyledEngineProvider>
          </Box>
          <TabPanel value={value} index={0} className="MuiBox-root">
            <PoolVote/>
          </TabPanel>
          <TabPanel value={value} index={1} className="MuiBox-root">
            <GaugeVote/>
          </TabPanel>
          <TabPanel value={value} index={2} className="MuiBox-root">
            <EmergencyMember/>
          </TabPanel>
          <TabPanel value={value} index={3} className="MuiBox-root">
            <VotingEscrow/>
          </TabPanel>
          <TabPanel value={value} index={4} className="MuiBox-root">
          </TabPanel>
          <TabPanel value={value} index={5} className="MuiBox-root">
          </TabPanel>
          <TabPanel value={value} index={6} className="MuiBox-root">
            <Vesting/>
          </TabPanel>
          <TabPanel value={value} index={7} className="MuiBox-root">
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default CreateVoteTabs;