// REACT
import React, { useState } from "react";
import * as helpers from "../../components/Utils/Helpers";
// CHARTS
import ApexChart from "react-apexcharts";

// COMPONENT CLASS
const VestingTokens = ({vested,unvested}) => {
  // States

  console.log("vested in chart:",vested);
  let vestedDataX=[];
  let vestedDataY=[];
  if(vested!==undefined){
  for (let i=0;i<vested.length;i++){

    //console.log("chart at i",vested[i][0]);
    vestedDataX.push(vested[i][0])
    vestedDataY.push(vested[i][1]) 
  }
}

  console.log("dataX:",vestedDataX);
  console.log("dataY:",vestedDataY);
  const fixed = vestedDataY.map((i)=>{
    return i.toFixed(1)
  })
  const time  = vestedDataX.map((i)=>{
    return helpers.formatDateToHumanChart(i);
  })
  // console.log(time[7]);
  // console.log("fixed",fixed);


  let axisData = [];
  for (let i=0; i<vestedDataX.length; i++) {
   axisData[i] = {
       x: time[i],
       y: fixed[i],
   };
 }
//  axisData.length = axisData.length/1000
 console.log("axisData",axisData);


 let unvestedDataX=[];
 let unvestedDataY=[];
 if(unvested!==undefined){
 for (let i=0;i<unvested.length;i++){

   //console.log("chart at i",vested[i][0]);
   unvestedDataX.push(unvested[i][0])
   unvestedDataY.push(unvested[i][1]) 
 }
}

//  console.log("dataX:",vestedDataX);
//  console.log("dataY:",vestedDataY);
 const unvestedfixed = unvestedDataY.map((i)=>{
   return i.toFixed(1)
 })
 const unvestedtime  = unvestedDataX.map((i)=>{
   return helpers.formatDateToHumanChart(i);
 })
//  console.log(time[7]);
//  console.log("fixed",fixed);


 let unvestedData = [];
 for (let i=0; i<unvestedDataX.length; i++) {
  unvestedData[i] = {
      x: unvestedtime[i],
      y: unvestedfixed[i],
  };
}
console.log("unvestedData",unvestedData);

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
      data: axisData
      // [
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [9041.095890410958],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [9041.095898418958],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [9041.096890410958],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [9041.097892410958],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [9041.099890490958],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [5],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [1],
      //   },
      //   {
      //     x: new Date("2023-11-07"),
      //     y: [6],
      //   },
      // ],
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: unvestedData
      // [
      //   {
      //     x: new Date("2022-05-12"),
      //     y: [6],
      //   },
      //   {
      //     x: new Date("2022-05-13"),
      //     y: [4],
      //   },
      //   {
      //     x: new Date("2022-05-14"),
      //     y: [2],
      //   },
      //   {
      //     x: new Date("2022-05-15"),
      //     y: [5],
      //   },
      //   {
      //     x: new Date("2022-05-16"),
      //     y: [3],
      //   },
      //   {
      //     x: new Date("2022-05-17"),
      //     y: [2],
      //   },
      //   {
      //     x: new Date("2022-05-18"),
      //     y: [3],
      //   },
      //   {
      //     x: new Date("2022-05-19"),
      //     y: [1],
      //   },
      // ],
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
      // selection: {
      //   enabled: true,
      //   xaxis: {
      //     min: new Date("12 Oct 2022").getTime(),
      //     max: new Date("28 Dec 2023").getTime(),
      //   },
      // },
      zoom: {
        enabled: true,
      },
    },
    colors: ["#00cc52", "#1976d2"],
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
      data: axisData
      // [
      //   {
      //     x: new Date("2022-05-12"),
      //     y: [3],
      //   },
      //   {
      //     x: new Date("2022-05-13"),
      //     y: [2],
      //   },
      //   {
      //     x: new Date("2022-05-14"),
      //     y: [4],
      //   },
      //   {
      //     x: new Date("2022-05-15"),
      //     y: [1],
      //   },
      //   {
      //     x: new Date("2022-05-16"),
      //     y: [4],
      //   },
      //   {
      //     x: new Date("2022-05-17"),
      //     y: [5],
      //   },
      //   {
      //     x: new Date("2022-05-18"),
      //     y: [1],
      //   },
      //   {
      //     x: new Date("2022-05-19"),
      //     y: [6],
      //   },
      // ],
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: unvestedData
      // [
      //   {
      //     x: new Date("2022-05-12"),
      //     y: [6],
      //   },
      //   {
      //     x: new Date("2022-05-13"),
      //     y: [4],
      //   },
      //   {
      //     x: new Date("2022-05-14"),
      //     y: [2],
      //   },
      //   {
      //     x: new Date("2022-05-15"),
      //     y: [5],
      //   },
      //   {
      //     x: new Date("2022-05-16"),
      //     y: [3],
      //   },
      //   {
      //     x: new Date("2022-05-17"),
      //     y: [2],
      //   },
      //   {
      //     x: new Date("2022-05-18"),
      //     y: [3],
      //   },
      //   {
      //     x: new Date("2022-05-19"),
      //     y: [1],
      //   },
      // ],
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
          min: new Date("29 May 2023 ").getTime(),
          max: new Date("23 Aug 2023").getTime(),
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
    colors: ["#00cc52", "#1976d2"],
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
