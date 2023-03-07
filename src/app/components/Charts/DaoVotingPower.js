// REACT
import React, { useState } from "react";
import * as helpers from "../../components/Utils/Helpers";
// CHARTS
import ApexChart from "react-apexcharts";

let seriesDataX = [];
let seriesDataY = [];
let daoPowerX = [];
let daoPowerY = [];



// COMPONENT CLASS
const DaoVotingPower = ({ chart, daoPower }) => {
  // States

  // Content

  console.log("chart:", chart);
  console.log("daoPower:", daoPower);
    if (chart !== undefined) {
      let chartData = chart.splice(0, chart.length - 11)
      // console.log("chartDatachartDatachartDatachartDatachartDatachartData", chartData);
      for (let i = 0; i < chartData.length; i++) {

        // console.log("chart at i", chartData[i][0]);
        seriesDataX.push(chartData[i][0])
        if (isNaN(chartData[i][1])) {
          seriesDataY.push(50)
        }
        else {
          seriesDataY.push(chartData[i][1])
        }

      }
    }

    // console.log("dataX:", seriesDataX);
    // console.log("dataY:", seriesDataY);

    const fixed = seriesDataY.map((i) => {
      return i.toFixed(3)
    })
    const time = seriesDataX.map((i) => {
      return helpers.formatDateToHumanChart(i);
    })

    let axisData = [];
    for (var i = 0; i < seriesDataX.length; i++) {
      axisData[i] = {
        x: time[i],
        y: seriesDataY[i],
      };
    }
    // console.log("axisData", axisData);


    if (daoPower !== undefined) {

      for (let i = 0; i < daoPower.length; i++) {
        daoPowerX.push(daoPower[i][0])
        daoPowerY.push(daoPower[i][1])
      }
    }

    // console.log("dataXdao:", daoPowerX);
    // console.log("dataYdao:", daoPowerY);

    const daoTime = daoPowerX.map((i) => {
      return helpers.formatDateToHumanChart(i);
    })


    let daoPowerData = [];
    for (var i = 0; i < daoPower.length; i++) {
      daoPowerData[i] = {
        x: daoTime[i],
        y: daoPowerY[i],
      };
    }
    // console.log("daoPowerData", daoPowerData, daoPowerY.length);

    let series = [
      {
        name: "My Voting Power",
        type: "line",
        data: axisData

      },
      {
        name: "DAO Voting Power",
        type: "line",
        data: daoPowerData
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
          //categories: [seriesDataY]
        },
      },
    };



    let seriesLine = [
      {
        name: "My Voting Power",
        type: "line",
        data:
          axisData
      },
      {
        name: "DAO Voting Power",
        type: "line",
        data: daoPowerData

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
            min: new Date(daoPowerData.length > 0 ? daoPowerData[0].x : "1 jan 2023 11:41:14").getTime(),
            max: new Date(daoPowerData.length > 0 ? daoPowerData[daoPowerData.length - 1].x : "1 jan 2023 11:41:14").getTime(),
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
        //categories: [seriesDataY]
      },
      yaxis: {
        tickAmount: 2,
      },
    };
  console.log("seriesLine",seriesLine);
  console.log("series",series);

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
