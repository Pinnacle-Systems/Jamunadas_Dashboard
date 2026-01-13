import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HighchartsMore from "highcharts/highcharts-more";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenCustomerWeekQuery } from
  "../../../redux/service/jamunasDashboardService.js";

HighchartsMore(Highcharts);

/* 🎨 Color palette */
const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#B435E3",
  "#E35B5B",
  "#FFA500",
  "#800080",
  "#00CED1",
  "#DC143C",
];

const CustomerTop10Week = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();

  /* ---------------- Utils ---------------- */
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

  /* ---------------- Normalize & Sort ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data
      .map((item) => ({
        customer: item.customer,
        y: Number(item.totalSales),
      }))
      .sort((a, b) => b.y - a.y)
      .slice(0, 10);
  }, [response?.data]);

  /* ---------------- Top 3 ---------------- */
  const top3Customers = useMemo(() => chartData.slice(0, 3), [chartData]);

  /* ---------------- Lollipop Data ---------------- */
  const stemData = chartData.map((item, index) => ({
    x: index,
    low: 0,
    high: item.y,
    customer: item.customer,
    color: COLORS[index % COLORS.length], // 🎨 stick color
  }));

  const dotData = chartData.map((item, index) => ({
    x: index,
    y: item.y,
    customer: item.customer,
    color: COLORS[index % COLORS.length], // 🎨 dot color (same)
  }));

  /* ---------------- Chart Options ---------------- */
  const options = {
    chart: {
      type: "columnrange",
      height: 420,
      marginTop: 30,
      borderRadius: 10,
      backgroundColor: "transparent",
    },

    title: null,
    legend: { enabled: false },
    credits: { enabled: false },

    xAxis: {
      min: 0,
      max: 9,
      tickInterval: 1,
      labels: {
        formatter() {
          return this.value + 1; // Rank 1–10
        },
        style: { fontSize: "11px", fontWeight: 600 },
      },
      lineWidth: 1,
      lineColor: "#000",
      tickColor: "#000",
    },

    yAxis: {
      min: 0,
      visible: false,
      gridLineWidth: 0,
    },

    /* 🧩 Tooltip with dynamic border color */
    tooltip: {
      useHTML: true,
      borderRadius: 6,
      backgroundColor: "transparent",
      shadow: false,
      formatter() {
        const value = this.y ?? this.point.high;
        const color = this.point.color || "#000";

        return `
          <div style="
            border:2px solid ${color};
        border-radius:8px;
        padding:8px 10px;
        background:#fff;
        box-shadow:0 4px 10px rgba(0,0,0,0.15);
        min-width:160px;
          ">
            <b>${this.point.customer}</b><br/>
            Sales: <b>${formatINR(value)}</b>
          </div>
        `;
      },
    },

    series: [
      /* 🦯 STEM */
      {
        type: "columnrange",
        data: stemData,
        pointWidth: 6,
        borderWidth: 0,
        enableMouseTracking: true,
        states: { inactive: { opacity: 1 } },
      },

      /* 🍭 DOT */
      {
        type: "scatter",
        data: dotData,
        marker: {
          symbol: "circle",
          radius: 6,
          lineWidth: 2,
          lineColor: "#ffffff",
        },
        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          y: -14,
          style: {
            fontSize: "11px",
            fontWeight: 600,
            textOutline: "none",
          },
        },
        states: { inactive: { opacity: 1 } },
      },
    ],
  };

  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Top 10 Customer – Last One Week"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent sx={{ position: "relative" }}>
        {/* 🏆 Top 3 Badges */}
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
                    ? "#FFD700"
                    : index === 1
                      ? "#C0C0C0"
                      : "#CD7F32",
                color: "#000",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.customer}
            </div>
          ))}
        </div>

        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default CustomerTop10Week;
