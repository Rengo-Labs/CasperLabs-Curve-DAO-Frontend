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
  let chartData = chart.splice(0,chart.length-11) 

  for (let i=0;i<chartData.length;i++){

    console.log("chart at i",chartData[i][0]);
     seriesDataX.push(chartData[i][0])
     if(isNaN(chartData[i][1]) ){
      seriesDataY.push(50)
     }
     else{
      seriesDataY.push(chartData[i][1]) 
     }
     
  }
}

 console.log("dataX:",seriesDataX);
 console.log("dataY:",seriesDataY);

 let axisData = [];
 for (var i=0; i<seriesDataX.length; i++) {
  axisData[i] = {
      x: seriesDataX[i],
      y: seriesDataY[i],
  };
}
console.log("axisData",axisData);

  let series = [
    {
      name: "DAO Voting Power",
      type: "line",
      data: axisData
        //seriesDataX
        
        // {
        //   x: seriesDataX[0],
        //   y: seriesDataY[0],
        // },
        // {
        //   x: seriesDataX[1],
        //   y: seriesDataY[1],
        // },
        // {
        //   x: seriesDataX[2],
        //   y: seriesDataY[2],
        // },
        // {
        //   x: seriesDataX[3],
        //   y: seriesDataY[3],
        // },
        // {
        //   x: seriesDataX[4],
        //   y: seriesDataY[4],
        // },
        // {
        //   x: seriesDataX[5],
        //   y: seriesDataY[5],
        // },
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
      //],
    },
    {
      name: "DAO Voting Power",
      type: "line",
      data:  axisData
          //seriesDataX
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
        //categories: [seriesDataY]
      },
    },
  };



  let seriesLine = [
    {
      name: "DAO Voting Power",
      type: "line",
      data: 
        axisData
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
       
     },
     {
      name: "DAO Voting Power",
      type: "line",
      data: axisData
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
      //categories: [seriesDataY]
    },
    yaxis: {
      tickAmount: 2,
    },
  };

  // Handlers

  // const series = [
  //   {
  //     name: "Temperature in Fahrenheit", //will be displayed on the y-axis
  //     data: [seriesDataX]
  //   }
  // ];
  // const options = {
  //   chart: {
  //     id: "line"
  //   },
  //   xaxis: {
  //     categories: [seriesDataY] //will be displayed on the x-asis
  //   }
  // };

  // const seriesLine = [
  //   {
  //     name: "Temperature in Fahrenheit", //will be displayed on the y-axis
  //     data: [seriesDataY]
  //   }
  // ];
  // const optionsLine = {
  //   chart: {
  //     id: "area"
  //   },
  //   xaxis: {
  //     categories: [seriesDataX] //will be displayed on the x-asis
  //   }
  // };

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
