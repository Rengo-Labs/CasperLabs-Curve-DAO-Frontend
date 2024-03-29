import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { StyledEngineProvider } from "@mui/styled-engine";
import PropTypes from "prop-types";
import React, { useState } from "react";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/curveTabs.css";
import GaugeVote from "../Gauge/GaugeVote";
import PoolVote from "../Pools/PoolVote";
import Vesting from "../Vesting/Vesting";
import VotingEscrow from "../VotingEscrow/VotingEscrow";

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
const CreateVoteTabs = () => {
  const [value, setValue] = useState(0);

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
                  label="Voting Escrow"
                  {...a11yProps(2)}
                />
                <Tab
                  label="Vesting"
                  {...a11yProps(3)}
                />
              </Tabs>
            </StyledEngineProvider>
          </Box>
          <TabPanel value={value} index={0} className="MuiBox-root">
            <PoolVote />
          </TabPanel>
          <TabPanel value={value} index={1} className="MuiBox-root">
            <GaugeVote />
          </TabPanel>
          <TabPanel value={value} index={2} className="MuiBox-root">
            <VotingEscrow />
          </TabPanel>
          <TabPanel value={value} index={3} className="MuiBox-root">
            <Vesting />
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default CreateVoteTabs;
