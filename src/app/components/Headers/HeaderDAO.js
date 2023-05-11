
import { Signer } from "casper-js-sdk";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/dropDownMenu.css";
import "../../assets/css/style.css";
import Logo from "../../assets/img/Logo.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import WalletModal from "../Modals/WalletModal";

export const CHAINS = {
  CASPER_MAINNET: "casper",
  CASPER_TESTNET: "casper-test",
};

export const SUPPORTED_NETWORKS = {
  [CHAINS.CASPER_MAINNET]: {
    blockExplorerUrl: "https://cspr.live",
    chainId: "0x1",
    displayName: "Casper Mainnet",
    logo: "https://cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_MAINNET,
  },
  [CHAINS.CASPER_TESTNET]: {
    blockExplorerUrl: "https://testnet.cspr.live",
    chainId: "0x2",
    displayName: "Casper Testnet",
    logo: "https://testnet.cspr.live/assets/icons/logos/cspr-live-full.svg",
    rpcTarget: "https://testnet.casper-node.tor.us",
    ticker: "CSPR",
    tickerName: "Casper Token",
    networkKey: CHAINS.CASPER_TESTNET,
  },
};

let torus = null;
console.log("torus", torus);

function HeaderDAO(props) {
  const { enqueueSnackbar } = useSnackbar();
  let [menuOpenedClass, setMenuOpenedClass] = useState();
  let [signerLocked, setSignerLocked] = useState();
  let [signerConnected, setSignerConnected] = useState(false);
  let [isLoading, setIsLoading] = useState(false);
  let [, setAccount] = useState("");

  const [openMenu, setOpenMenu] = useState(false);
  const [openWalletModal, setOpenWalletModal] = useState(false);
  const handleCloseWalletModal = () => {
    setOpenWalletModal(false);
  };
  const handleShowWalletModal = () => {
    setOpenWalletModal(true);
  };
  useEffect(() => {
    console.log(
      "localStorage.getItem(selectedWallet)",
      localStorage.getItem("selectedWallet")
    );
    if (
      props.selectedWallet === "Casper" ||
      localStorage.getItem("selectedWallet") === "Casper"
    ) {
      setTimeout(async () => {
        try {
          const connected = await checkConnection();
          setSignerConnected(connected);
        } catch (err) {
          console.log(err);
        }
      }, 100);
      if (signerConnected) {
        handleCloseWalletModal();
        let res = getActiveKeyFromSigner();
        localStorage.setItem("Address", res);
        props.setActivePublicKey(res);
      }
      window.addEventListener("signer:connected", (msg) => {
        handleCloseWalletModal();
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(true);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:disconnected", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(false);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:tabUpdated", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:activeKeyChanged", (msg) => {
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:locked", (msg) => {
        setSignerLocked(!msg.detail.isUnlocked);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:unlocked", (msg) => {
        handleCloseWalletModal();
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
      window.addEventListener("signer:initialState", (msg) => {
        console.log("Initial State: ", msg.detail);
        handleCloseWalletModal();
        setSignerLocked(!msg.detail.isUnlocked);
        setSignerConnected(msg.detail.isConnected);
        localStorage.setItem("Address", msg.detail.activeKey);
        props.setActivePublicKey(msg.detail.activeKey);
      });
    }
    // eslint-disable-next-line
  }, [props.selectedWallet]);

  async function checkConnection() {
    try {
      return await Signer.isConnected();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to connect", { variant });
    }
  }

  async function getActiveKeyFromSigner() {
    try {
      return await Signer.getActivePublicKey();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to get Active Public Key", { variant });
    }
  }
  async function connectToSigner() {
    try {
      setIsLoading(true);
      return await Signer.sendConnectionRequest();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to send Connection Request", { variant });
    } finally {
      setIsLoading(false);
    }
  }

  const selectedStyling = {
    border: "2px solid '#1976d2'",
    padding: "0.625rem 1rem",
    color: "#FFF",
    backgroundColor: "#1976d2",
  };
  const defaultStyling = {
    padding: "0.625rem 1rem",
  };
  const selectedNavStyle = {
    Home: props.selectedNav === "Home" ? selectedStyling : defaultStyling,
    Dao: props.selectedNav === "DAO" ? selectedStyling : defaultStyling,
    Calc: props.selectedNav === "Calc" ? selectedStyling : defaultStyling,
    Locker: props.selectedNav === "Locker" ? selectedStyling : defaultStyling,
    Minter: props.selectedNav === "Minter" ? selectedStyling : defaultStyling,
    Vesting: props.selectedNav === "Vesting" ? selectedStyling : defaultStyling,
    GaugeWeightVote:
      props.selectedNav === "GWVote" ? selectedStyling : defaultStyling,
  };

  let Disconnect = (e) => {
    console.log("Disconnect");
    Cookies.remove("Authorization");
    localStorage.removeItem("Address");
    localStorage.removeItem("selectedWallet");
    props.setActivePublicKey("");
    props.setSelectedWallet();
    try {
      Signer.disconnectFromSite();
    } catch {
      let variant = "Error";
      enqueueSnackbar("Unable to Disconnect", { variant });
    }

    window.location.reload();
  };


  return (
    <header className={`header ${menuOpenedClass}`}>
      <nav
        className="navbar navbar-expand-xl header-nav"
        style={{
          width: "100%",
          backgroundColor: "#e7ebf0",
        }}
      >
        <div className="navbar-header">
          <a
            id="mobile_btn"
            href="/"
            style={{ color: "#1976d2" }}
            onClick={(e) => {
              e.preventDefault();
              setMenuOpenedClass("menu-opened");
            }}
          >
            <span className="bar-icon">
              <span></span>
              <span></span>
              <span></span>
            </span>
          </a>
          <Link
            style={{ color: "#1976d2" }}
            to="/"
            className="navbar-brand logo"
          >
            <img src={Logo} alt="Logo" width="50" />
          </Link>
        </div>

        <div className="main-menu-wrapper">
          <div className="menu-header">
            <a
              id="menu_close"
              className="menu-close"
              style={{ color: "#1976d2" }}
              href="/"
              onClick={(e) => {
                e.preventDefault();
                setMenuOpenedClass("");
              }}
            >
              <i className="fas fa-times"></i> Close
            </a>
          </div>
          <ul
            className="main-nav "
            style={{
              marginTop: "4px",
            }}
          >
            {isLoading ? (
              <div className="text-center">
              </div>
            ) : localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <li className="login-link ">
                <a
                  href={
                    "https://testnet.cspr.live/account/" +
                    localStorage.getItem("Address")
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#1976d2" }}
                >
                  <span style={{ cursor: "pointer" }}>
                    {localStorage.getItem("Address").slice(0, 10)}. . .
                  </span>
                </a>
              </li>
            ) : signerLocked && signerConnected ? (
              <li
                onClick={() => {
                  handleShowWalletModal();
                }}
                className="login-link "
              >
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#1976d2" }}
                >
                  Connect to Wallet
                </a>
              </li>
            ) : (
              <li
                onClick={() => {
                  handleShowWalletModal();
                }}
                className="login-link "
              >
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#1976d2" }}
                >
                  Connect to Wallet
                </a>
              </li>
            )}

            <li
              onClick={() => {
                Disconnect();
              }}
              className="login-link "
            >
              {localStorage.getItem("Address") &&
                localStorage.getItem("Address") !== null &&
                localStorage.getItem("Address") !== "null" ? (
                <a
                  href="#"
                  className=" align-items-center justify-content-center text-center"
                  style={{ color: "#1976d2" }}
                >
                  <span style={{ cursor: "pointer" }}>Disconnect</span>
                </a>
              ) : null}
            </li>
            <li>
              <Link
                to="/dao-home"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.Home}>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/gw-vote"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.GaugeWeightVote}>
                  Gauge Weight Vote
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/calc"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.Calc}>Calc</span>
              </Link>
            </li>
            <li>
              <Link
                to="/locker"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.Locker}>Locker</span>
              </Link>
            </li>
            <li>
              <Link
                to="/minter"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.Minter}>Minter</span>
              </Link>
            </li>
            <li>
              <Link
                to="/vesting"
                className=" align-items-center justify-content-center text-center"
                style={{ color: "#1976d2" }}
              >
                <span style={selectedNavStyle.Vesting}>Vesting</span>
              </Link>
            </li>
          </ul>
        </div>
        <ul className="nav header-navbar-rht">
          <li>
            {isLoading ? (
              <div className="text-center">
                <Spinner
                  animation="border"
                  role="status"
                  style={{ color: "#e84646" }}
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </div>
            ) : localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <a
                href={
                  "https://testnet.cspr.live/account/" +
                  localStorage.getItem("Address")
                }
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1976d2" }}
              >
                <span style={{ cursor: "pointer" }}>
                  {localStorage.getItem("Address").substr(0, 10)}. . .
                </span>
              </a>
            ) : signerLocked && signerConnected ? (
              <>
                <Button
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#1976d2",
                    borderColor: "#1976d2",
                  }}
                  variant="primary"
                  className="fade-in-text"
                  onClick={
                    () => {
                      handleShowWalletModal();
                    }
                  }
                >
                  Connect to Wallet
                </Button>
              </>
            ) : (
              <>
                <Button
                  style={{
                    borderRadius: "8px",
                    backgroundColor: "#1976d2",
                    borderColor: "#1976d2",
                  }}
                  variant="primary"
                  className="fade-in-text"
                  onClick={() => {
                    handleShowWalletModal();
                  }}
                >
                  Connect to Wallet
                </Button>
              </>
            )}
          </li>
          <li>
            
            {localStorage.getItem("Address") &&
              localStorage.getItem("Address") !== null &&
              localStorage.getItem("Address") !== "null" ? (
              <span
                style={{ cursor: "pointer", color: "#1976d2" }}
                onClick={() => {
                  Disconnect();
                }}
              >
                Disconnect
              </span>
            ) : null}
          </li>
        </ul>
      </nav>
      <WalletModal
        show={openWalletModal}
        handleClose={handleCloseWalletModal}
        casperLogin={connectToSigner}
        setSelectedWallet={props.setSelectedWallet}
      />
    </header>
  );
}

export default HeaderDAO;
