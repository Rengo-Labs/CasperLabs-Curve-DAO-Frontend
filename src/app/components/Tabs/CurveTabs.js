// REACT
import React, { useState } from "react";
// CUSTOM CSS
import "../../assets/css/curveTabs.css";
// COMPONENTS
import SwapUsingCurvePools from "../swap/SwapUsingCurvePools";
import CRVStats from "../Stats/CRVStats";
import CurvePools from "../Pools/CurvePools";
// MATERIAL UI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
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
const CurveTabs = () => {
  // States
  const [value, setValue] = useState(0);

  //   Handlers
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <div style={{ paddingBttom: "2rem", backgroundColor: "white" }}>
        <Box>
          <Box
            sx={{
              padding: "20px",
              borderColor: "divider",
              borderTopRightRadius: "8px",
              borderTopLeftRadius: "8px",
              backgroundColor: "#fff",
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
              >
                <Tab label="Swap Using Curve Pools" {...a11yProps(0)} />
                <Tab label="Curve Pools" {...a11yProps(1)} />
                <Tab label="Stats" {...a11yProps(2)} />
              </Tabs>
            </StyledEngineProvider>
          </Box>
          <TabPanel value={value} index={0} className="MuiBox-root">
            <SwapUsingCurvePools />
          </TabPanel>
          <TabPanel value={value} index={1} className="MuiBox-root">
            <CurvePools />
          </TabPanel>
          <TabPanel value={value} index={2} className="MuiBox-root">
            <CRVStats />
          </TabPanel>
        </Box>
      </div>
    </>
  );
};

export default CurveTabs;
