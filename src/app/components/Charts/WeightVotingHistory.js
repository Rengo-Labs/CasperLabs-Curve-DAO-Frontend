// REACT
import React, { Component, useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
//style
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };



// CONTENTseriesY

// COMPONENT FUNCTION
const WeightVotingHistory = ({data,show,close,setOpen}) => {
    //const [open, setOpen] = React.useState(false);
    //const handleOpen = () => setOpen(true);
    const handleClose = () => show =false;



  console.log("data in weight voting history:",data);
  // States
  let seriesY=[];
  let labelData=[];

 if(data){
  data.map((object) => {
    seriesY.push(object?.y)
    console.log("seriesY",seriesY);
    labelData.push(object?.name)
  })
 }

console.log("seriesY",seriesY);
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
    series: 
    // [
    //   5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
    //   1, 4, 2, 1, 5,
    // ]
    seriesY
    ,
    labels: labelData,
    //[
    //   "CSPR",
    //   "USDT",
    //   "BTC",
    //   "USDC",
    //   "wETH",
    //   "ETH",
    //   "wBTC",
    //   "nypd",
    //   "dpt",
    //   "xyz",
    //   "temp",
    //   "rich",
    //   "post",
    //   "angry",
    //   "bread",
    //   "rem",
    //   "ford",
    //   "grass",
    //   "tyu",
    //   "sre",
    //   "icu",
    //   "ssg",
    //   "tlp",
    //   "poo",
    //   "foo",
    //   "tint",
    //   "gear",
    //   "rock",
    //   "google",
    //   "tip",
    // ],
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
  // [
  //   5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
  //   1, 4, 2, 1, 5,
  // ];
  seriesY;

  // Handlers
console.log("open:",show);
console.log("close:",close);
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
            <Button onClick={()=>setOpen(false)} variant="contained" style={{backgroundColor:"#1976d2"}} fullWidth>Hide</Button>
        </Box>
      </Modal>
     
    </>
  );
};

export default WeightVotingHistory;
