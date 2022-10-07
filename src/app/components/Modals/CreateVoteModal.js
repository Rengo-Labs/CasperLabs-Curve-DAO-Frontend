import React from "react";

// MATERIAL UI
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";

//STYLES
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function CreateVoteModal(props) {
  return (
    <>
      <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            className="mb-4"
          >
            {props.title}
          </Typography>
          <TextField
            fullWidth
            id="outlined-multiline-static"
            required
            label="Description"
            multiline
            rows={4}
          />
          <div className="mt-4">
            <Typography variant="h6" gutterBottom component={"div"}>
              <span
                className="font-weight-bold"
                style={{ borderBottom: "1px dashed white", color: "#5300e8" }}
              >
                <Button
                  variant="contained"
                  size="large"
                  style={{ backgroundColor: "#5300e8", color: "white" }}
                  onClick={props.click}
                >
                  Submit
                </Button>
              </span>
            </Typography>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default CreateVoteModal;
