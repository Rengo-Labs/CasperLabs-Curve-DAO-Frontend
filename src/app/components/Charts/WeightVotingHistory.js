import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import React from "react";
import ApexChart from "react-apexcharts";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};
const WeightVotingHistory = ({ data, show, close, setOpen }) => {
  let seriesY = [];
  let labelData = [];

  if (data) {
    data.map((object) => {
      seriesY.push(object?.y)
      console.log("seriesY", seriesY);
      labelData.push(object?.name)
    })
  }

  console.log("seriesY", seriesY);
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
    series:
      seriesY
    ,
    labels: labelData,

    plotOptions: {
      donut: {
        size: "15px",
        labels: {
          fontSize: "1.25rem",
        },
      },
    },
  };

  const series =

    seriesY;

  console.log("open:", show);
  console.log("close:", close);
  return (
    <>
      <Modal
        open={show}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
            <ApexChart options={options} series={series} type="donut" width={400} style={{marginLeft:40}} />
            <Button onClick={()=>setOpen(false)} className="hoverButtonGlobal" fullWidth>Hide</Button>
        </Box>
      </Modal>

    </>
  );
};

export default WeightVotingHistory;
