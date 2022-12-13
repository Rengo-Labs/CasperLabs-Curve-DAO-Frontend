
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Casper from "../../assets/img/cspr.png";
import Torus from "../../assets/img/torus.png";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Exit from "../../assets/img/exit.svg";
import { Avatar, Card, CardHeader, Typography } from "@mui/material";

function WalletModal(props) {
  // console.log("props", props);
  return (
    <Modal centered show={props.show} onHide={props.handleClose}>
      {/* <Modal.Header style={{ textAlign: 'center' }}>
      </Modal.Header> */}
      <Modal.Body style={{ textAlign: 'center' }} >
        <Typography variant="h5" style={{ color: '#000027' }} gutterBottom >
          <strong>
            Select Wallet
            <span
            onClick={props.handleClose}
            style={{
              float: "right",
              cursor: "pointer",
            }}
          >
            <img
              src={Exit}
              alt="exit"
              width="15"
            />
          </span>
          </strong>
        </Typography>

      </Modal.Body>
      <Modal.Body>
        <Card
          onClick={() => {
            props.casperLogin();
            localStorage.setItem("selectedWallet", "Casper");
            props.setSelectedWallet("Casper");
          }}
          className="custom-card"
          style={{ borderRadius: "8px" }}
        >
          <CardHeader
            avatar={<Avatar src={Casper} aria-label="Casper Signer" />}
            title="Casper Signer"
            subheader="Connect to Casper Signer"
          />
        </Card>
      </Modal.Body>
    </Modal>
  );
}

export default WalletModal;
