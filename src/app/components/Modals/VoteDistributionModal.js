import React from "react";
import ApexChart from "react-apexcharts";

// MATERIAL UI
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { Typography } from "@mui/material";

//STYLES
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 600,
  bgcolor: "background.paper",
  border: "1px solid #000",
  boxShadow: 24,
  p: 4,
};

function VoteDistributionModal(props) {
  // Content
  const options = {
    chart: {
      type: "donut",
      toolbar: {
        autoSelected: "pan",
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    series: props.series,
    labels: props.labels,
    plotOptions: {
      donut: {
        size: "15px",
        labels: {
          fontSize: "1.25rem",
        },
      },
    },
  };

  // const series = props.series;

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
            className="text-dark text-center mb-3"
            sx={{ fontSize: 19, fontWeight: "bold" }}
          >
            {props.title}
          </Typography>
          <ApexChart
            options={options}
            series={props.series}
            type="donut"
            width={500}
          />
          <div className="mt-3">
            <Button
              fullWidth
              variant="contained"
              size="large"
              style={{ backgroundColor: "#1976d2", color: "white" }}
              onClick={props.close}
            >
              Close Chart
            </Button>
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default VoteDistributionModal;
