import React, { useState } from "react";
import "../../../../assets/css/bootstrap.min.css";
import "../../../../assets/css/style.css";
import "../../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../../assets/plugins/fontawesome/css/fontawesome.min.css";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";
import CreateVoteTabs from "../../../../components/Tabs/CreateVoteTab";
import HomeBanner from "../Home/HomeBanner";

function CreateVote() {

  // eslint-disable-next-line
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")// get the address of user logged in
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  // eslint-disable-next-line
  let [torus, setTorus] = useState();

  return (
    <>
      <div className="main-wrapper">
        <div className="home-section home-full-height">
          <HeaderDAO
            setActivePublicKey={setActivePublicKey}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
          />
          <div
            className="content"
            style={{ paddingTop: "100px" }}
            position="absolute"
          >
            <HomeBanner />
          </div>
        </div>
        <div className="container-fluid">
          <CreateVoteTabs />
        </div>
      </div>
    </>
  )
}

export default CreateVote