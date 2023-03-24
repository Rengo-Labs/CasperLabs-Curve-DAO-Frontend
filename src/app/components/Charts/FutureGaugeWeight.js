import React from "react";
import ApexChart from "react-apexcharts";
const FutureGaugeWeight = ({ futureWeight }) => {
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
      <ApexChart options={options} series={series} type="donut" width={550} />
  );
};
export default FutureGaugeWeight;
