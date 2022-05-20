// REACT
import React, { useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";

// COMPONENT CLASS
const VestingTokens = () => {
  // States

  // Content
  let dataMain = [
    {
      x: new Date(),
    },
  ];

  let series = [
    {
      name: "Vested Tokens",
      type: "line",
      data: [
        {
          x: new Date("2022-05-12"),
          y: [3],
        },
        {
          x: new Date("2022-05-13"),
          y: [2],
        },
        {
          x: new Date("2022-05-14"),
          y: [4],
        },
        {
          x: new Date("2022-05-15"),
          y: [1],
        },
        {
          x: new Date("2022-05-16"),
          y: [4],
        },
        {
          x: new Date("2022-05-17"),
          y: [5],
        },
        {
          x: new Date("2022-05-18"),
          y: [1],
        },
        {
          x: new Date("2022-05-19"),
          y: [6],
        },
      ],
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: [
        {
          x: new Date("2022-05-12"),
          y: [6],
        },
        {
          x: new Date("2022-05-13"),
          y: [4],
        },
        {
          x: new Date("2022-05-14"),
          y: [2],
        },
        {
          x: new Date("2022-05-15"),
          y: [5],
        },
        {
          x: new Date("2022-05-16"),
          y: [3],
        },
        {
          x: new Date("2022-05-17"),
          y: [2],
        },
        {
          x: new Date("2022-05-18"),
          y: [3],
        },
        {
          x: new Date("2022-05-19"),
          y: [1],
        },
      ],
    },
  ];

  let options = {
    chart: {
      id: "chart2",
      type: "line",
      height: 230,
      toolbar: {
        autoSelected: "pan",
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    colors: ["#00cc52", "#5300E8"],
    stroke: {
      width: 3,
      curve: "smooth",
    },
    dataLabels: {
      enabled: false,
    },
    fill: {
      opacity: 1,
    },
    markers: {
      size: 0,
    },
    xaxis: {
      type: "datetime",
    },
    yaxis: {
      title: {
        text: "Amount Locked",
      },
    },
  };

  let seriesLine = [
    {
      name: "Vested Tokens",
      type: "line",
      data: [
        {
          x: new Date("2022-05-12"),
          y: [3],
        },
        {
          x: new Date("2022-05-13"),
          y: [2],
        },
        {
          x: new Date("2022-05-14"),
          y: [4],
        },
        {
          x: new Date("2022-05-15"),
          y: [1],
        },
        {
          x: new Date("2022-05-16"),
          y: [4],
        },
        {
          x: new Date("2022-05-17"),
          y: [5],
        },
        {
          x: new Date("2022-05-18"),
          y: [1],
        },
        {
          x: new Date("2022-05-19"),
          y: [6],
        },
      ],
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: [
        {
          x: new Date("2022-05-12"),
          y: [6],
        },
        {
          x: new Date("2022-05-13"),
          y: [4],
        },
        {
          x: new Date("2022-05-14"),
          y: [2],
        },
        {
          x: new Date("2022-05-15"),
          y: [5],
        },
        {
          x: new Date("2022-05-16"),
          y: [3],
        },
        {
          x: new Date("2022-05-17"),
          y: [2],
        },
        {
          x: new Date("2022-05-18"),
          y: [3],
        },
        {
          x: new Date("2022-05-19"),
          y: [1],
        },
      ],
    },
  ];
  let optionsLine = {
    chart: {
      id: "chart1",
      height: 130,
      type: "area",
      brush: {
        target: "chart2",
        enabled: true,
      },
      selection: {
        enabled: true,
        xaxis: {
          min: new Date("13 May 2022").getTime(),
          max: new Date().getTime(),
        },
      },
      // toolbar: {
      //   autoSelected: "pan",
      //   show: true,
      // },
      // zoom: {
      //   enabled: true,
      // },
    },
    colors: ["#00cc52", "#5300E8"],
    fill: {
      type: "gradient",
      gradient: {
        opacityFrom: 0.91,
        opacityTo: 0.1,
      },
    },
    xaxis: {
      type: "datetime",
      tooltip: {
        enabled: false,
      },
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  // Handlers

  return (
    <>
      <div id="wrapper" style={{ width: "100%" }}>
        <div id="chart-line2">
          <ApexChart
            options={options}
            series={series}
            type="line"
            height={230}
          />
        </div>
        <div id="chart-line">
          <ApexChart
            options={optionsLine}
            series={seriesLine}
            type="area"
            height={130}
          />
        </div>
      </div>
    </>
  );
};

//   const domContainer = document.querySelector('#app');
//   ReactDOM.render(React.createElement(ApexChart), domContainer);

export default VestingTokens;
