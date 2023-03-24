import React from "react";
import ApexChart from "react-apexcharts";
import * as helpers from "../../components/Utils/Helpers";
const VestingTokens = ({ vested, unvested }) => {
  console.log("vested in chart:", vested);
  let vestedDataX = [];
  let vestedDataY = [];
  if (vested !== undefined) {
    for (let i = 0; i < vested.length; i++) {
      vestedDataX.push(vested[i][0])
      vestedDataY.push(vested[i][1])
    }
  }

  console.log("dataX:", vestedDataX);
  console.log("dataY:", vestedDataY);
  const fixed = vestedDataY.map((i) => {
    return i.toFixed(1)
  })
  const time = vestedDataX.map((i) => {
    return helpers.formatDateToHumanChart(i);
  })
  let axisData = [];
  for (let i = 0; i < vestedDataX.length; i++) {
    axisData[i] = {
      x: time[i],
      y: fixed[i],
    };
  }
  console.log("axisData", axisData);
  let unvestedDataX = [];
  let unvestedDataY = [];
  if (unvested !== undefined) {
    for (let i = 0; i < unvested.length; i++) {
      unvestedDataX.push(unvested[i][0])
      unvestedDataY.push(unvested[i][1])
    }
  }

  const unvestedfixed = unvestedDataY.map((i) => {
    return i.toFixed(1)
  })
  const unvestedtime = unvestedDataX.map((i) => {
    return helpers.formatDateToHumanChart(i);
  })
  let unvestedData = [];
  for (let i = 0; i < unvestedDataX.length; i++) {
    unvestedData[i] = {
      x: unvestedtime[i],
      y: unvestedfixed[i],
    };
  }
  console.log("unvestedData", unvestedData);
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
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: unvestedData
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
      },
    },
  };

  let seriesLine = [
    {
      name: "Vested Tokens",
      type: "line",
      data: axisData
    },
    {
      name: "Unvested Tokens",
      type: "line",
      data: unvestedData
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


export default VestingTokens;
