import { Card, CardContent, Typography } from "@material-ui/core";
import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Alert } from "reactstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import Exit from "../../assets/img/exit.svg";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import TokenContent from "./TokenContent";

function TokenBModal(props) {
  return (
    <Modal centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{
        color: '#000027',
        fontWeight: '600'
      }}>
        <Typography style={{ fontSize: '20px' }} gutterBottom >
          <strong>
            Select Token
          </strong>
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
        </Typography>
        {!props.isTokenList &&
          props.activePublicKey !== "null" &&
          props.activePublicKey !== null &&
          props.activePublicKey !== undefined ? (
          <div className="text-center" style={{ padding: "20px" }}>
            <Spinner
              animation="border"
              role="status"
              style={{ color: "#6476bf" }}
            >
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : (
          props.activePublicKey !== "null" &&
            props.activePublicKey !== null &&
            props.activePublicKey !== undefined ? (
            props.tokenList.map((i, index) => (
              <div key={index}>
                <Card
                  onClick={() => {
                    props.setToken(i);
                    props.setTokenAAmount(0);
                    props.setTokenBAmount(0);
                    props.handleClose();
                  }}
                  className="custom-card"
                  style={{ borderRadius: "8px" }}
                >
                  <TokenContent
                    i={i}
                    activePublicKey={props.activePublicKey}
                  ></TokenContent>
                </Card>
                <hr></hr>
              </div>
            ))
          ) : (
            <Card style={{ marginBottom: "10px", borderRadius: "8px" }}>
              <CardContent>
                <Alert
                  style={{
                    marginBottom: "0px",
                    flexGrow: 1,
                    width: "100%",
                  }}
                  color="light"
                >
                  Connect to a wallet to view token list.
                </Alert>
              </CardContent>
            </Card>
          )
        )}
      </Modal.Body>
    </Modal>
  );
}

export default TokenBModal;
