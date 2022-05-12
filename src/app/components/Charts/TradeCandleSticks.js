// REACT
import React, { Component, useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";
// COMPONENTS

// CONTENT
let seriesDate = [
  {
    x: new Date("2022-05-01"),
    y: [5555.81, 6650.5, 6623.04, 5921.33],
  },
  {
    x: new Date("2022-05-02"),
    y: [6429.81, 7122.5, 5923.04, 6135.33],
  },
  {
    x: new Date("2022-05-03"),
    y: [4894.81, 6917, 4594.33, 5454],
  },
  {
    x: new Date("2022-05-04"),
    y: [4894.81, 5526.54, 4594.33, 5454],
  },
  {
    x: new Date("2022-05-05"),
    y: [5629.81, 6217, 5194.33, 5384],
  },
  {
    x: new Date("2022-05-06"),
    y: [7562.48, 7563.85, 6512.13, 7063],
  },
  {
    x: new Date("2022-05-07"),
    y: [5324, 5561, 5328, 5854],
  },
  {
    x: new Date("2022-05-08"),
    y: [4891, 5417, 4594.33, 4619],
  },
  {
    x: new Date("2022-05-09"),
    y: [4694, 5917, 4594.33, 5114],
  },
  {
    x: new Date("2022-05-10"),
    y: [4894.81, 6917, 4594.33, 5454],
  },
  {
    x: new Date(),
    y: [6629.81, 6724.5, 6673, 6323.77],
  },
];

let seriesDataBar = [
  {
    x: new Date("2022-05-01"),
    y: 50000,
  },
  {
    x: new Date("2022-05-02"),
    y: 200000,
  },
  {
    x: new Date("2022-05-03"),
    y: 150000,
  },
  {
    x: new Date("2022-05-04"),
    y: 650000,
  },
  {
    x: new Date("2022-05-05"),
    y: 400000,
  },
  {
    x: new Date("2022-05-06"),
    y: 1500000,
  },
  {
    x: new Date("2022-05-07"),
    y: 1980000,
  },
  {
    x: new Date("2022-05-08"),
    y: 1600004,
  },
  {
    x: new Date("2022-05-09"),
    y: 900000,
  },
  {
    x: new Date("2022-05-10"),
    y: 750000,
  },
  {
    x: new Date(),
    y: 1400000,
  },
];

var optionsData = {
  chart: {
    type: "candlestick",
    height: 450,
    id: "chart-candlestick",
    toolbar: {
      autoSelected: "pan",
      show: true,
    },
    zoom: {
      enabled: true,
    },
  },
  series: [
    {
      name: "CandleStick",
      data: seriesDate,
    },
  ],
  title: {
    text: "CandleStick Chart",
    align: "left",
  },
  plotOptions: {
    candlestick: {
      colors: {
        upward: "#5300E8",
        downward: "#EF6C00",
      },
    },
  },
  xaxis: {
    type: "datetime",
    // categories: [
    //   "Sunday",
    //   "Monday",
    //   "Tuesday",
    //   "Wednesday",
    //   "Thursday",
    //   "Friday",
    //   "Saturday",
    // ],
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
    labels: {
      title: "OHLC",
      show: true,
    },
  },
};

var optionsDataBar = {
  chart: {
    type: "bar",
    height: 150,
    brush: {
      enabled: true,
      target: "chart-candlestick",
    },
    selection: {
      enabled: true,
      xaxis: {
        min: new Date("07 May 2022").getTime(),
        max: new Date().getTime(),
      },
      fill: {
        color: "#ccc",
        opacity: 0.4,
      },
      stroke: {
        color: "#0D47A1",
      },
    },
  },
  series: [
    {
      name: "Volume",
      data: seriesDataBar,
    },
  ],
  dataLabels: {
    enabled: false,
  },
  plotOptions: {
    bar: {
      columnWidth: "40%",
      colors: {
        ranges: [
          {
            from: -1000,
            to: 0,
            color: "#F15B46",
          },
          {
            from: 1,
            to: 10000,
            color: "#FEB019",
          },
        ],
      },
    },
  },
  stroke: {
    width: 0,
  },
  xaxis: {
    type: "datetime",
    axisBorder: {
      offsetX: 13,
    },
  },
  yaxis: {
    tooltip: {
      enabled: true,
    },
    labels: {
      title: "Volume",
      show: true,
    },
  },
};

const TradeCandleSticks = (props) => {
  const [options, setOptions] = useState(optionsData);
  const [barOptions, setBarOptions] = useState(optionsDataBar);

  return (
    <>
      <div className="">
        <div id="candlestick">
          <ApexChart
            options={options}
            series={options.series}
            type={options.chart.type}
            height={options.chart.height}
            labels={options.yaxis.labels.title}
          />
          <ApexChart
            options={barOptions}
            series={optionsDataBar.series}
            type={optionsDataBar.chart.type}
            height={optionsDataBar.chart.height}
            labels={optionsDataBar.yaxis.labels.title}
          />
        </div>
      </div>
    </>
  );
};

export default TradeCandleSticks;
