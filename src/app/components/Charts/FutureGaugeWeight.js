// REACT
import React from "react";
// CHARTS
import ApexChart from "react-apexcharts";

// CONTENT

// COMPONENT FUNCTION
const FutureGaugeWeight = ({ futureWeight }) => {
  // console.log("futureWeight in chart file:", futureWeight);
  // States
  let seriesY = [];
  let labelData = [];

  if (futureWeight) {
    futureWeight?.map((weight) => {
      seriesY.push(weight.y);
      labelData.push(weight.name);
    });
  }

  console.log("seriesY", seriesY);
  console.log("label data", labelData);
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
    labels: labelData,
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

  return (
    <>
      <ApexChart options={options} series={series} type="donut" width={400} />
    </>
  );
};

export default FutureGaugeWeight;
