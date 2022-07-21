// REACT
import React, { useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";
// COMPONENTS

// CONTENT
let areaSeries = [
  {
    name: "Asks",
    data: [
      354743306.09, 348776756.07, 330115577.86, 312991411.34, 288182979.05,
    ],
    // [
    //   {
    //     x: [0, 0.992, 0.994, 0.996, 0.998],
    // y: ["1", "100", "10k", "1M", "100M", "10G"],
    //   },
    // ],
  },
  {
    name: "Actual Price",
    type: "line",
    data: [0.9998],
  },
  {
    name: "Bids",
    data: [
      337921532.05, 345615678.13, 356421359.24, 358047976.99, 373733307.98,
    ],
    // [
    //   {
    //     X: [1, 1.002, 1.004, 1.006, 1.008],
    //     y: ["1", "100", "10k", "1M", "100M", "10G"],
    //   },
    // ],
  },
];

var optionsData = {
  chart: {
    type: "area",
    height: 350,
    id: "chart-area",
    toolbar: {
      autoSelected: "pan",
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "smooth",
  },
  //   series: [
  //     {
  //       name: areaSeries,
  //     },
  //   ],
  xaxis: {
    // type: "datetime",
    categories: [0, 0.992, 0.994, 0.996, 0.998, 1, 1.002, 1.004, 1.006, 1.008],
  },
  tooltip: {
    x: {
      format: "",
    },
  },
  //   title: {
  //     text: "Area Chart",
  //     align: "left",
  //   },
  //   plotOptions: {
  //     candlestick: {
  //       colors: {
  //         upward: "#5300E8",
  //         downward: "#EF6C00",
  //       },
  //     },
  //   },
  xaxis: {
    //   type: "numerical",
    categories: [0, 0.992, 0.994, 0.996, 0.998, 1, 1.002, 1.004, 1.006, 1.008],
    //   },
    //   yaxis: {
    //     //   tooltip: {
    //     //     enabled: true,
    //     //   },
    //     dataLabels: {
    //       title: "OHLC",
    //       enabled: true,
    //     },
    //   },
  },
};

// FUNCTIONAL COMPONENT
const SplineArea = () => {
  const [options, setOptions] = useState(optionsData);
  const [series, setSeries] = useState(areaSeries);
  return (
    <>
      <div className="">
        <div id="candlestick">
          <ApexChart
            options={options}
            series={series}
            type={options.chart.type}
            height={options.chart.height}
            // labels={options.yaxis.labels.title}
          />
        </div>
      </div>
    </>
  );
};

export default SplineArea;
