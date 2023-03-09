import React from "react";
import { Modal, Spinner } from "react-bootstrap";
import { Alert } from "reactstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";
import Exit from "../../assets/img/exit.svg"
import TokenContent from "./TokenContent";
import FutureAPYTable from "../Tables/FutureAPYTable";
import GaugeRelativeWeight from "../Charts/GaugeRelativeWeight";
import { Box, Button, Paper, Typography } from "@mui/material";

function VoteForGaugeWeightModal(props) {
  console.log("props.cells", props);
  return (
    <Modal size="lg" centered show={props.show} onHide={props.handleClose}>
      <Modal.Body style={{
        color: '#000027',
        fontWeight: '600'
      }}>
        <Typography style={{ fontSize: '20px' }} gutterBottom >
          <strong>
            Calculated outcome of your weight
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
        <FutureAPYTable cells={props.cells} gaugeWeightVoteData={props.gaugeWeightVoteData} />
        <div className="row no-gutters justify-content-center mt-4">
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Paper elevation={4}>
              <div className="py-5 px-4">
                <div className="row no-gutters justify-content-center">
                  <div className="col-12 text-center py-3">
                    <Typography
                      variant="h5"
                      gutterBottom
                      component="div"
                    >
                      <span className="font-weight-bold">
                        Calculated outcome of your weight
                      </span>
                    </Typography>
                  </div>
                  <GaugeRelativeWeight chart={props.graphData} />
                </div>
              </div>
            </Paper>
          </Box>
        </div>
        {/* {!props.isTokenList &&
          props.activePublicKey !== "null" &&
          props.activePublicKey !== null &&
          props.activePublicKey !== undefined ? (
          <div className="text-center" style={{ padding: "20px" }}>
            <Spinner
              animation="border"
              role="status"
              style={{ color: "#1976d2" }}
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
                    // console.log("props.token", props.token);
                    // console.log("props.tokenList", props.tokenList);
                    // if (props.token) {
                    //     props.setTokenList(props.tokenList.splice(0, 0, props.token))
                    // }
                    // console.log("props.tokenList.splice(i, 1)", props.tokenList.splice(i, 2));
                    // props.setTokenList(props.tokenList.splice(i, 1))
                    props.setToken(i);
                    props.setTokenAAmount(0);
                    props.setTokenBAmount(0);
                    props.handleClose();
                  }}
                  className="custom-card"
                  style={{ borderRadius: "8px", marginBottom: '15px' }}
                >
                  <TokenContent i={i}></TokenContent>
                </Card>
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

        )} */}
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="hoverButtonGlobal"
          // variant="contained"
          size="large"
          style={{ 
            // backgroundColor: "#1976d2", 
            // color: "white", 
            margin: '10px' }}
          onClick={() => props.voteForGaugeWeightsMakeDeploy(props.gauge, props.votingPowerPercentage)}
        >
          Submit
        </Button>

        <Button
          className="hoverButtonGlobal"
          // variant="contained"
          size="large"
          style={{ 
            // backgroundColor: "#1976d2", 
            // color: "white", 
            margin: '10px' 
          }}
          onClick={() => {
            // props.setSlippage(0.5);
            props.handleClose();
          }}
        >
          Hide
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default VoteForGaugeWeightModal;
