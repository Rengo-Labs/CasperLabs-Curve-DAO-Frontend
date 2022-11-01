import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useParams } from "react-router-dom";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../../../assets/css/style.css";
import "../../../../assets/css/common.css";
// FONT AWESOME
import "../../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../../assets/plugins/fontawesome/css/fontawesome.min.css";
// COMPONENTS
import HomeBanner from "../Home/HomeBanner";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import VoteInfoProgressBar from "../../../../components/Progress bar/VoteInfoProgressBar";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ShowVoters from "../../../../components/Show Voters/ShowVoters";
// MATERIAL UI
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

function VoteInfo(props) {
  // eslint-disable-next-line
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  // eslint-disable-next-line
  let [torus, setTorus] = useState();
  let [showVoters, setShowVoters] = useState(false);
  const history = useHistory();
  let { id } = useParams();

  return (
    <>
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderDAO
            setActivePublicKey={setActivePublicKey}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            // selectedNav={"Locker"}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          >
            <HomeBanner />
          </div>
        </div>
        <div className="container-fluid" style={{ maxWidth: 1300 }}>
          <div className="curve-container">
            <div className="row no-gutters bg-white">
              <div className="col-lg-9 curve-content-wrapper  mui-form-width ">
                <fieldset>
                  <legend>Vote Info</legend>
                  <div className="px-3 py-3 text-dark d-flex">
                    <Typography variant="h5" component={"div"}>
                      Ownership
                    </Typography>
                    <Typography
                      className="pt-1 pl-3"
                      variant="p"
                      component={"div"}
                    >
                      (51%/12%)
                    </Typography>
                  </div>
                  <Typography
                    className="px-3 text-dark"
                    sx={{ fontSize: 19, fontWeight: "bold" }}
                    component={"div"}
                  >
                    Vote #215
                  </Typography>
                  <Typography
                    className="px-3 text-dark"
                    sx={{ fontSize: 19, fontWeight: "bold" }}
                    component={"div"}
                  >
                    Description:
                  </Typography>
                  <Typography sx={{ fontSize: 16 }} className="px-3 text-dark">
                    Whitelist Abracadabra, allowing it to lock CRV for veCRV
                    (https://gov.curve.fi/t/something)
                  </Typography>
                  <Typography
                    className="px-3 text-dark"
                    sx={{ fontSize: 19, fontWeight: "bold" }}
                    component={"div"}
                  >
                    Proposed by: 0x7457...d7d66c
                  </Typography>
                  <div className="px-3 text-dark">
                    <Typography
                      sx={{ fontSize: 19, fontWeight: "bold" }}
                      component={"div"}
                    >
                      Votes:
                    </Typography>
                    <VoteInfoProgressBar
                      width="w-25"
                      polarQestion="Yes"
                      percent="52"
                      color="#5300E8"
                    />
                    <Typography className="mb-2">330.18</Typography>
                    <VoteInfoProgressBar
                      width="w-25"
                      polarQestion="No"
                      percent="14"
                      color="#9fade6"
                    />
                    <Typography className="mb-2">1.187</Typography>
                    <Typography sx={{ fontSize: 18 }}>
                      Total Votes: 9
                    </Typography>
                  </div>
                  <Typography
                    className="px-3 text-dark"
                    sx={{ fontSize: 19, fontWeight: "bold", cursor: "pointer" }}
                    component={"div"}
                    onClick={() => {
                      history.push("/locks");
                    }}
                  >
                    Vote distribution at snapshot chart
                  </Typography>
                  <div className="ml-3 my-2">
                    <Button
                      variant="contained"
                      size="small"
                      style={{ backgroundColor: "#5300e8", color: "white" }}
                      onClick={() => setShowVoters(!showVoters)}
                    >
                      {!showVoters ? "Show Voters" : "Hide Voters"}
                    </Button>
                  </div>
                  {!showVoters ? null : <ShowVoters voteId={id} />}
                  <div className="py-3 px-3 mx-3 bg-primary text-white">
                    <Typography>
                      You didn't have enough veCRV balance(0.00 required) when
                      vote was created on block snapshot 15679279 at 05/10/2022
                      03:39:47
                    </Typography>
                    <Typography className="mt-2">
                      Lock CRV to be able to vote on next proposals in
                    </Typography>
                    <Typography
                      className="mt-3"
                      sx={{ fontSize: 19, fontWeight: "bold", color: "white" }}
                      component={"div"}
                    >
                      <Link
                        to={"/locker"}
                        style={{
                          color: "#fff",
                          padding: "8px",
                          border: "1px solid white",
                          borderRadius: "4px",
                        }}
                      >
                        Locker Page
                      </Link>
                    </Typography>
                  </div>
                </fieldset>
              </div>
              <div className="col-lg-3 curve-content-wrapper text-dark mui-form-width ">
                <fieldset>
                  <legend>Status</legend>
                  <div className="d-flex pl-4">
                    <Typography sx={{ fontSize: 18 }}>/</Typography>
                    <Typography className="ml-3" sx={{ fontSize: 19 }}>
                      Open
                    </Typography>
                  </div>
                  <div className="d-flex pl-3">
                    <HourglassBottomIcon />
                    <Typography className="ml-2" sx={{ fontSize: 19 }}>
                      05D:13H:30M:09S
                    </Typography>
                  </div>
                  <div className="d-flex pt-3 pl-3">
                    <AccessTimeIcon />
                    <Typography className="ml-2" sx={{ fontSize: 19 }}>
                      05/10/2022 03:39:47
                    </Typography>
                  </div>
                  <div className="d-flex pl-3">
                    <AccessTimeIcon />
                    <Typography className="ml-2" sx={{ fontSize: 19 }}>
                      12/10/2022 03:39:47
                    </Typography>
                  </div>
                </fieldset>
                <fieldset className="mt-2">
                  <legend>Support</legend>
                  <div className="d-flex pl-4">
                    <Typography sx={{ fontSize: 18, color: "#019267" }}>
                      99.99%
                    </Typography>
                    <Typography className="ml-3" sx={{ fontSize: 19 }}>
                      ({">"} 51% required)
                    </Typography>
                  </div>
                </fieldset>
                <fieldset className="mt-2">
                  <legend>Quorum</legend>
                  <div className="d-flex pl-4">
                    <Typography sx={{ fontSize: 18, color: "#de1738" }}>
                      0.06%
                    </Typography>
                    <Typography className="ml-3" sx={{ fontSize: 19 }}>
                      ({">"} 30% required)
                    </Typography>
                  </div>
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VoteInfo;
