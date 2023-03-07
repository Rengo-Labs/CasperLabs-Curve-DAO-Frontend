// REACT
import React, { Component, useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";

// CONTENT

// COMPONENT FUNCTION
const GaugeRelativeWeight = ({ chart }) => {
  console.log("chart data in chart screen..", chart);

  // States

  let seriesY = [];
  let labelData = [];

  for (let i = 0; i < chart.length; i++) {
    seriesY.push(chart[i].value);
    labelData.push(chart[i].name);
  }

  //   if(chart){
  //     seriesY.push(chart[0]?.y)
  //     labelData.push(chart[0]?.name)
  //  }
  console.log("seriesY", seriesY);
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
    series: seriesY,
    // [
    //   5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
    //   1, 4, 2, 1, 5,
    // ]
    labels: labelData,
    // [
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
    // ]
    plotOptions: {
      donut: {
        size: "15px",
        labels: {
          fontSize: "1.25rem",
        },
      },
    },
  };

  const series = seriesY;
  // [
  //   5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
  //   1, 4, 2, 1, 5,
  // ];

  // Handlers

  return (
    <>
      <ApexChart options={options} series={series} type="donut" width={550} />
    </>
  );
};

export default GaugeRelativeWeight;
