import React from 'react'
import ApexChart from "react-apexcharts";

// MATERIAL UI
import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import { Typography } from '@mui/material';

//STYLES
   const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '1px solid #000',
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
    series: [
      50,20,13,10,7
    ],
    labels: [
        '0x5b3e....54ddb68',
        '0x6b7e....14iib60',
        '0x4b3a....24tdb65',
        '0x3c3s....12kkb68',
        '0xt83c....54ddo87',
    ],
    plotOptions: {
      donut: {
        size: "15px",
        labels: {
          fontSize: "1.25rem",
        },
      },
    },
  };

  const optionsAgainst = {
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
    seriesAgainst : [
        70,30
      ],
    labels: [
        '0x7b3c....56web69',
        '0x2b7y....19utb60',
    ],
    plotOptions: {
      donut: {
        size: "15px",
        labels: {
          fontSize: "1.25rem",
        },
      },
    },
  };

  const series = [
    50,20,13,10,7
  ];
  const seriesAgainst = [
    70,30
  ];

  return (
    <>
    <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography className='text-dark text-center mb-3' sx={{ fontSize: 19, fontWeight:"bold" }} >{props.title}</Typography>
            <ApexChart options={props.for===true?options:optionsAgainst} series={props.for===true?series:seriesAgainst} type="donut" width={500} />
            <div className='mt-3'>
                <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    style={{ backgroundColor: "#5300e8", color: "white" }}
                    onClick={props.close}
                    >
                    Close Chart
                </Button>
            </div>
        </Box>
    </Modal>
    </>
  )
}

export default VoteDistributionModal