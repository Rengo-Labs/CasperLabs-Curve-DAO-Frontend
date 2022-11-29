// REACT
import React, { useState } from "react";
// CHARTS
import ApexChart from "react-apexcharts";

let seriesDataX=[];
let seriesDataY=[];

  

// COMPONENT CLASS
const DaoVotingPower = ({chart}) => {
  // States

  // Content


if(chart!==undefined){

  for (let i=0;i<chart.length;i++){

    console.log("chart at i",chart[i][0]);
     seriesDataX.push(chart[i][0])
     if(isNaN(chart[i][1]) ){
      seriesDataY.push(0)
     }
     else{
      seriesDataY.push(chart[i][1]) 
     }
     
  }
}

 console.log("dataX:",seriesDataX);
 console.log("dataY:",seriesDataY);


  let series = [
    {
      name: "DAO Voting Power",
      type: "line",
      data: [
        seriesDataX
        // {
        //   x: new Date("2022-05-12"),
        //   y: [1831.43],
        // },
        // {
        //   x: new Date("2022-05-13"),
        //   y: [2261.32],
        // },
        // {
        //   x: new Date("2022-05-14"),
        //   y: [451561497.72],
        // },
        // {
        //   x: new Date("2022-05-15"),
        //   y: [451222282.92],
        // },
        // {
        //   x: new Date("2022-05-16"),
        //   y: [445795809.24],
        // },
        // {
        //   x: new Date("2022-05-17"),
        //   y: [418345769.97],
        // },
        // {
        //   x: new Date("2022-05-18"),
        //   y: [332834519.13],
        // },
        // {
        //   x: new Date("2022-05-19"),
        //   y: [130025169.05],
        // },
      ],
    },
    {
      name: "DAO Voting Power",
      type: "line",
      data: [
          seriesDataX
        // {
        //   x: new Date("2022-05-12"),
        //   y: [1831.43],
        // },
        // {
        //   x: new Date("2022-05-13"),
        //   y: [2261.32],
        // },
        // {
        //   x: new Date("2022-05-14"),
        //   y: [451561497.72],
        // },
        // {
        //   x: new Date("2022-05-15"),
        //   y: [451222282.92],
        // },
        // {
        //   x: new Date("2022-05-16"),
        //   y: [445795809.24],
        // },
        // {
        //   x: new Date("2022-05-17"),
        //   y: [418345769.97],
        // },
        // {
        //   x: new Date("2022-05-18"),
        //   y: [332834519.13],
        // },
        // {
        //   x: new Date("2022-05-19"),
        //   y: [130025169.05],
        // },
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
        categories: [seriesDataY]
      },
    },
  };



  let seriesLine = [
    {
      name: "DAO Voting Power",
      type: "line",
      data: [
        seriesDataX
    //     {
    //       x: new Date("2022-05-12"),
    //       y: [1831.43],
    //     },
    //     {
    //       x: new Date("2022-05-13"),
    //       y: [2261.32],
    //     },
    //     {
    //       x: new Date("2022-05-14"),
    //       y: [451561497.72],
    //     },
    //     {
    //       x: new Date("2022-05-15"),
    //       y: [451222282.92],
    //     },
    //     {
    //       x: new Date("2022-05-16"),
    //       y: [445795809.24],
    //     },
    //     {
    //       x: new Date("2022-05-17"),
    //       y: [418345769.97],
    //     },
    //     {
    //       x: new Date("2022-05-18"),
    //       y: [332834519.13],
    //     },
    //     {
    //       x: new Date("2022-05-19"),
    //       y: [130025169.05],
    //     },
    //   ],
    // },
    // {
    //   name: "DAO Voting Power",
    //   type: "line",
    //   data: [
    //     {
    //       x: new Date("2022-05-12"),
    //       y: [1831.43],
    //     },
    //     {
    //       x: new Date("2022-05-13"),
    //       y: [2261.32],
    //     },
    //     {
    //       x: new Date("2022-05-14"),
    //       y: [451561497.72],
    //     },
    //     {
    //       x: new Date("2022-05-15"),
    //       y: [451222282.92],
    //     },
    //     {
    //       x: new Date("2022-05-16"),
    //       y: [445795809.24],
    //     },
    //     {
    //       x: new Date("2022-05-17"),
    //       y: [418345769.97],
    //     },
    //     {
    //       x: new Date("2022-05-18"),
    //       y: [332834519.13],
    //     },
    //     {
    //       x: new Date("2022-05-19"),
    //       y: [130025169.05],
    //     },
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
      categories: [seriesDataY]
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

export default DaoVotingPower;
