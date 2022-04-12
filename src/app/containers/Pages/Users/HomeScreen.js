// REACT
import React, { useState } from "react";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
// CUSTOM CSS
import "../../../assets/css/style.css";
// FONT AWESOME
import "../../../assets/plugins/fontawesome/css/all.min.css";
import "../../../assets/plugins/fontawesome/css/fontawesome.min.css";
// COMPONENTS
import Footer from "../../../components/Footers/Footer";
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import CurveTabs from "../../../components/Tabs/CurveTabs";

function HomeScreen() {
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
          <HeaderHome
            setActivePublicKey={setActivePublicKey}
            setSelectedWallet={setSelectedWallet}
            selectedWallet={selectedWallet}
            setTorus={setTorus}
            selectedNav={"Home"}
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
          <CurveTabs />
        </div>
        {/* <Footer position={"relative"} /> */}
      </div>
    </>
  );
}

export default HomeScreen;
