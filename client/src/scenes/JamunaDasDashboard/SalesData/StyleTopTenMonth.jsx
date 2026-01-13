import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetTopTenItemMonthQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";

Highcharts3D(Highcharts);

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const StyleTopTenMonth = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------- API ---------- */
  const { data: response } = useGetTopTenItemMonthQuery(
    { params: { selectedYear, selectedCompany, selectMonths } },
    { skip: !selectedYear || !selectedCompany || !selectMonths }
  );

  /* ---------- Normalize Data ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data
      .filter(item => Number(item.totalSales) > 0)
      .map((item, index) => ({
        name: item.itemName,            // ✅ item shown on slice
        itemName: item.itemName,
        y: Number(item.totalSales),
        salesMonth: item.salesMonth,
        salesYear: item.salesYear,
        company: item.company,
        color: COLORS[index % COLORS.length],
      }));
  }, [response?.data]);

  /* ---------- Chart Options ---------- */
  const options = {
    chart: {
      type: "pie",
      height: 420,
      backgroundColor: "#ffffff",
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
    },

    title: { text: "" },

    tooltip: {
      formatter() {
        return `
          <b>Item:</b> ${this.point.itemName}<br/>
          <b>Month:</b> ${this.point.salesMonth}<br/>
          <b>Sales:</b> ${formatINR(this.y)}
        `;
      },
    },

    plotOptions: {
      pie: {
        innerSize: "60%",     // 🍩 donut
        depth: 45,            // 🧱 3D depth
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          formatter() {
            return this.point.itemName;
          },
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },
      },
    },

    series: [
      {
        name: "Sales",
        data: chartData,
      },
    ],

    legend: { enabled: false },
    credits: { enabled: false },
  };

  /* ---------- Render ---------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top 10 Items – ${selectMonths || "Month"} Sales`}
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
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
          "& .MuiCardHeader-action": {
            alignSelf: "center",
            marginTop: -1,
            marginRight: 5,
          },
        }}
      />

      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>
    </Card>
  );
};

export default StyleTopTenMonth;
