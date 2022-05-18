// REACT
import React, { Component, useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";

// CONTENT

// COMPONENT FUNCTION
const GaugeRelativeWeight = () => {
  // States

  // Content
  const options = {
    series: [
      5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
      1, 4, 2, 1, 5,
    ],
    labels: [
      "CSPR",
      "USDT",
      "BTC",
      "USDC",
      "wETH",
      "ETH",
      "wBTC",
      "nypd",
      "dpt",
      "xyz",
      "temp",
      "rich",
      "post",
      "angry",
      "bread",
      "rem",
      "ford",
      "grass",
      "tyu",
      "sre",
      "icu",
      "ssg",
      "tlp",
      "poo",
      "foo",
      "tint",
      "gear",
      "rock",
      "google",
      "tip",
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
    5, 4, 5, 2, 1, 6, 3, 4, 2, 1, 3, 5, 6, 1, 2, 4, 1, 3, 5, 1, 1, 2, 1, 3, 2,
    1, 4, 2, 1, 5,
  ];

  // Handlers

  return (
    <>
      <ApexChart options={options} series={series} type="donut" width={400} />
    </>
  );
};

export default GaugeRelativeWeight;
