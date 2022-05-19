// REACT
import React from "react";
import { Link } from "react-router-dom";
// BOOTSTRAP
import "../../assets/css/bootstrap.min.css";
// MATERIAL UI
import Typography from "@mui/material/Typography";

// COMPONENT FUNCTION
const DaoInfoMessage = () => {
  return (
    <>
      <div className="row no-gutters">
        <div className="col-12">
          <div className="bg-primary text-white p-3">
            <div className="row no-gutters">
              <Typography variant="body1" gutterBottom component="div">
                Note: The list of pools and boost/reward info has moved away
                from this page. You can now find all this information on each
                pool page, on the main curve.fi site.
              </Typography>
            </div>
            <div className="row no-gutters mt-2">
              <Typography variant="body1" gutterBottom component="div">
                (For example, staking/unstaking lp tokens, seeing current/future
                boost, etc for the CRV/ETH pool can now be found on the
                curve.fi/crveth page. )
              </Typography>
            </div>
            <div className="row no-gutters mt-2">
              <Typography variant="body1" gutterBottom component="div">
                Head to your{" "}
                <span className="font-weight-bold">
                  <Link to={"/pools"} style={{ color: "white" }}>
                    dashboard
                  </Link>
                </span>{" "}
                to see all your pools!
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DaoInfoMessage;
