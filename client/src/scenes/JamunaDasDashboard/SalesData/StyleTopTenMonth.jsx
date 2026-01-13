import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetTopTenItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";

const StyleTopTenMonth = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");
  const X_GAP = 2.2; // 👈 controls gap between bubbles (try 1.4–2.0)

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response } = useGetTopTenItemMonthQuery(
    { params: { selectedYear, selectedCompany, selectMonths } },
    { skip: !selectedYear || !selectedCompany || !selectMonths }
  );

  // ---------- Normalize Data ----------
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    const sorted = response.data
      .filter(item => Number(item.totalSales) > 0)
      .sort((a, b) => Number(b.totalSales) - Number(a.totalSales))
      .slice(0, 10);

    return sorted.map((item, index) => {
      // Create gradient for each bubble
      const gradient = {
        linearGradient: { x1: 0, y1: 0, x2: 1, y2: 1 },
        stops: [
          [0, `hsl(${index * 36}, 80%, 60%)`],
          [1, `hsl(${index * 36}, 60%, 40%)`],
        ],
      };

      return {
        x: (index + 1) * X_GAP,
        y: 3,           // fixed vertical
        z: Number(item.totalSales), // bubble size
        rank: index + 1,
        itemName: item.itemName,
        salesMonth: item.salesMonth,
        salesYear: item.salesYear,
        color: gradient,
      };
    });
  }, [response?.data]);

  // ---------- Chart Options ----------
  const options = {
    chart: {
      type: "bubble",
      height: 400,
      backgroundColor: "#fff",
    },

    title: { text: "" },
    credits: { enabled: false },
    legend: { enabled: false },

    xAxis: {
      visible: false, min: 0, max: X_GAP * 11, // 👈 keeps equal margins
    },
    yAxis: { visible: false, min: 0, max: 6 },

    tooltip: {
      useHTML: true,
      borderWidth: 2,
      shadow: true,
      formatter() {
        return `
          <div style="border-left: 4px solid ${this.point.color.stops[0][1]}; padding-left: 8px;">
            <b>${this.point.itemName}</b><br/>
            <b>Month:</b> ${this.point.salesMonth}<br/>
            <b>Year:</b> ${this.point.salesYear}<br/>
            <b>Sales:</b> ${formatINR(this.point.z)}
          </div>
        `;
      },
      backgroundColor: "#fff",
    },

    plotOptions: {
      bubble: {
        minSize: 80,
        maxSize: 140,
        dataLabels: {
          enabled: true,
          useHTML: true,
          formatter() {
            const fontSize = Math.max(14, Math.min(18, this.point.z / 6));
            return `<div style="
                text-align:center;
                color:#fff;
                font-weight:700;
                font-size:${fontSize}px;
                text-shadow:1px 1px 2px rgba(0,0,0,0.7);
              ">${this.point.rank}</div>`;
          },
        },
      },
      series: { states: { inactive: { opacity: 1 } } },
    },

    series: [
      { data: chartData, marker: { lineColor: "#000", lineWidth: 2 } },
    ],
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top 10 Items – ${selectMonths || "Month"} Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ width: 150 }}>
            <FinYear
              selectedYear={selectedYear}
              selectmonths={selectMonths}
              setSelectmonths={setSelectMonths}
            />
          </Box>
        }
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
          "& .MuiCardHeader-action": { alignSelf: "center", marginTop: -1, marginRight: 5 },
        }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>
    </Card>
  );
};

export default StyleTopTenMonth;
