// REACT
import React, { Component, useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";

// CONTENT

// COMPONENT FUNCTION
const FutureGaugeWeight = ({futureWeight}) => {

  console.log("futureWeight in chart file:",futureWeight?.y);
  // States
  let seriesY=[];
  let labelData=[];

 if(futureWeight){
//   for(let i;i<futureWeight.length;i++){
//     seriesY.push(futureWeight[i].y)
//     labelData.push(futureWeight[i].name)
//   }
seriesY.push(futureWeight.y)
labelData.push(futureWeight.name)
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

  return (
    <>
      <ApexChart options={options} series={series} type="donut" width={400} />
    </>
  );
};

export default FutureGaugeWeight;
