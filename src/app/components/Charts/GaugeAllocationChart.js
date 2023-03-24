import React from "react";
import ApexChart from "react-apexcharts";
const GaugeAllocationChart = ({ chart }) => {
  let seriesY = [];
  let labelData = [];

  for (let i = 0; i < chart.length; i++) {
    seriesY.push(chart[i].y)
    labelData.push(chart[i].name)
  }
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

export default GaugeAllocationChart;
