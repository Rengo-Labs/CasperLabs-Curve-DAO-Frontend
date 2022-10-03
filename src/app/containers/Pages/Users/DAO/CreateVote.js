import React, { useState } from "react";
// BOOTSTRAP
import "../../../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../../../assets/css/style.css";
// FONT AWESOME
import "../../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../../assets/plugins/fontawesome/css/fontawesome.min.css";
// COMPONENTS
// import Footer from "../../../../components/Footers/Footer";
// import HeaderHome from "../../../../components/Headers/Header";
import HomeBanner from "../Home/HomeBanner";
import CreateVoteTabs from "../../../../components/Tabs/CreateVoteTab";
import HeaderDAO from "../../../../components/Headers/HeaderDAO";

function CreateVote() {

  // eslint-disable-next-line
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
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
        <div className="container-fluid">
          <CreateVoteTabs />
        </div>
        {/* <Footer position={"relative"} /> */}
      </div>
    </>
  )
}

export default CreateVote