import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenItemDailyQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import TopTenItemTodayTable from "./TableData/TopTenItemTodayTable.jsx";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const StyleTop10Daily = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------- API ---------- */
  const { data: response } = useGetTopTenItemDailyQuery(
    { params: { selectedYear, selectedCompany } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------- Normalize Data ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data
      .filter(item => Number(item.totalSales) > 0)
      .map((item, index) => ({
        name: item.itemName,          // ✅ item name
        itemName: item.itemName,
        y: Number(item.totalSales),
        color: COLORS[index % COLORS.length],
        company: item.company,
        salesYear: item.salesYear,
      }));
  }, [response?.data]);
  const itemOptions = useMemo(() => {
    if (!Array.isArray(chartData)) return [];
    return [...new Set(chartData.map(item => item.itemName))];
  }, [chartData]);
  /* ---------- Chart Options ---------- */
  const options = {
    chart: {
      type: "pie",
      height: 420,
      backgroundColor: "#ffffff",
    },

    title: { text: "" },

    tooltip: {
      formatter() {
        return `
          <b>Item:</b> ${this.point.itemName}<br/>
          <b>Sales:</b> ${formatINR(this.y)}
        `;
      },
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        size: "85%",
        point: {
          events: {
            click() {
              setTableParams({
                itemName: this.itemName,
                company: this.company,
              });
              setShowTable(true);
            },
          },
        },
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
        title="Top 10 Items – Today Sales"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent>
      {showTable && tableParams && (
        <TopTenItemTodayTable
          itemName={tableParams.itemName}
          company={tableParams.company}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
          }}
          itemOptions={itemOptions}
        />
      )}

    </Card>
  );
};

export default StyleTop10Daily;
