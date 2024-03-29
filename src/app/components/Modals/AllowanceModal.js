
import { FormControl, FormHelperText, Input, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import React from "react";
import { Modal } from "react-bootstrap";
import "../../assets/css/bootstrap.min.css";
import "../../assets/css/style.css";
import "../../assets/plugins/fontawesome/css/all.min.css";
import "../../assets/plugins/fontawesome/css/fontawesome.min.css";

function AllowanceModal(props) {
    const { enqueueSnackbar } = useSnackbar();

    return (
        <Modal centered show={props.show} onHide={props.handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Allowance Settings <i className="fas fa-cog"></i> </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typography variant="h6" gutterBottom  >Increase Allowance</Typography>
            </Modal.Body>
            <Modal.Body>

                <FormControl fullWidth variant="standard" sx={{ m: 1, mt: 3, width: '25ch' }}>
                    <Input
                        step="0.0001"
                        type='number'
                        min={0}
                        disabled
                        id="standard-adornment-weight"
                        value={props.approvalAmount / 10 ** 9}
                        aria-describedby="standard-weight-helper-text"
                        inputProps={{
                            'aria-label': 'weight',
                        }}
                    />
                    <FormHelperText id="standard-weight-helper-text">Allowance</FormHelperText>
                </FormControl>

            </Modal.Body>
            <Modal.Footer>
                <button
                    type="button"
                    className="btn-block btn-outline-primary btn-lg"
                    style={{
                        fontSize: '15px', fontWeight: '600',
                        padding: "10px",
                    }} onClick={() => props.increaseAndDecreaseAllowanceMakeDeploy(props.approvalAmount / 10 ** 9, props.handleClose, props.signingModal, enqueueSnackbar, props.getAllowance)}>
                    Increase Allowance
                </button>
            </Modal.Footer>
        </Modal>

    );
}

export default AllowanceModal;
