// REACT
import React, { useState } from "react";
// CUSTOME STYLING
import "../../../assets/css/style.css";
// BOOTSTRAP
import "../../../assets/css/bootstrap.min.css";
// COMPONENTS
import HeaderHome from "../../../components/Headers/Header";
import HomeBanner from "./Home/HomeBanner";
import AllPools from "../../../components/Pools/AllPools";

// COMPONENT FUNCTION
const Pools = () => {
  // States
  let [activePublicKey, setActivePublicKey] = useState(
    localStorage.getItem("Address")
  );
  let [selectedWallet, setSelectedWallet] = useState(
    localStorage.getItem("selectedWallet")
  );
  let [torus, setTorus] = useState();
  return (
    <>
      <div className="home-section home-full-height">
        <HeaderHome
          setActivePublicKey={setActivePublicKey}
          setSelectedWallet={setSelectedWallet}
          selectedWallet={selectedWallet}
          setTorus={setTorus}
          selectedNav={"Pools"}
        />
        <div
          className="content"
          style={{ paddingTop: "100px" }}
          position="absolute"
        >
          <HomeBanner />
        </div>
        <div className="container-fluid">
          <AllPools />
        </div>
      </div>
    </>
  );
};

export default Pools;
