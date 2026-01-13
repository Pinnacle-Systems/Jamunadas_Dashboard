import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenCustomerWeekQuery } from
  "../../../redux/service/jamunasDashboardService.js";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const CustomerTop10Week = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------------- API ---------------- */
  const { data: response } = useGetTopTenCustomerWeekQuery(
    { params: { selectedYear, selectedCompany } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize Data ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((item, index) => ({
      name: item.customer,
      y: Number(item.totalSales),
      customer: item.customer,
      color: COLORS[index % COLORS.length],
    }));
  }, [response?.data]);
  const top3Customers = useMemo(() => {
    return chartData
      .slice() // clone
      .sort((a, b) => b.y - a.y)
      .slice(0, 3);
  }, [chartData]);

  /* ---------------- Chart Options ---------------- */
  const options = {
    chart: {
      type: "line",   // 👈 smoother than line
      scrollablePlotArea: { minWidth: 300 },
      marginTop: 10,
      height: 420,
      borderRadius: 10,
    },


    xAxis: {
      min: 0,
      max: 9,
      tickInterval: 1,
      
      labels: {
        formatter: function () {
           return this.value + 1; // 👈 show 10 → 1
        },
        style: { fontSize: "10px" },
      },

      lineWidth: 1,
      lineColor: "#000000", // ⚫ black axis
      tickLength: 4,
      tickColor: "#000000",
    },



    yAxis: {
      min: 0,
      visible: false,
      gridLineWidth: 1,
      gridLineColor: "#e0e0e0",
      gridLineDashStyle: "Dash",
    },


    tooltip: {
      shared: false,
      style: { fontSize: "12px" },
      formatter: function () {
        return `
        <b>Customer:</b> ${this.point.customer}<br/>
        <b>Total Sales:</b> ${formatINR(this.y)}
      `;
      },
    },

    plotOptions: {
      series: {
        marker: {
          enabled: true,
          radius: 4,
          symbol: "circle",
        },
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y); // 👈 show value on each point
          },
          style: {
            fontSize: "10px",
            fontWeight: "600",
          },
        },
      },
    },

    title: null,

    legend: { enabled: false },
    credits: { enabled: false },

    series: [
      {
        name: "Sales",
        data: chartData.map((item, index) => ({
          x: index,             // 👈 normal ascending
          y: item.y,
          customer: item.customer,
        })),

        color: "#FF0000",
        lineWidth: 2,

        states: {
          inactive: { opacity: 1 },
        },

        marker: {
          fillColor: "#000000", // ⚫ black dots
          lineWidth: 2,
          lineColor: "#ffffff",
        },
      },
    ],

  };

  /* ---------------- Render ---------------- */
  // return (
  //   <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
  //     <CardHeader
  //       title="Top 10 customer for last one week"
  //       titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
  //       sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
  //     />

  //     <CardContent>
  //       <HighchartsReact highcharts={Highcharts} options={options} />
  //     </CardContent>
  //   </Card>
  // );
  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Top 10 customer for last one week"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      {/* ⬇️ REPLACE CardContent WITH THIS */}
      <CardContent sx={{ position: "relative" }}>
        {/* 🏆 Rank Badges */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 12,
            zIndex: 10,
            display: "flex",
            gap: "6px",
          }}
        >
          {top3Customers.map((item, index) => (
            <div
              key={item.customer}
              style={{
                padding: "4px 8px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: 600,
                background:
                  index === 0
                    ? "#FFD700" // 🥇 Gold
                    : index === 1
                      ? "#C0C0C0" // 🥈 Silver
                      : "#CD7F32", // 🥉 Bronze
                color: "#000",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                whiteSpace: "nowrap",
                flexDirection:"column"
              }}
            >
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.customer}
            </div>
          ))}
        </div>

        {/* 📊 Chart */}
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );

};

export default CustomerTop10Week;
