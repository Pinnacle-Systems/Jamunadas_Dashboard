import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenItemWeekQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import TopTenItemWeekTable from './TableData/TopTenItemWeekTable.jsx'
import SpinLoader from '../../../utils/spinLoader'

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];
const StyleTop10Week = ({ selectedYear, selectedCompany, filterType, setFilterType }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedfilterType, setSelectedFilterType] = useState(filterType || "ALL")

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  useEffect(() => {
    setSelectedFilterType(filterType)
  }, [filterType])
  /* ---------- API ---------- */
  const { data: response, isFetching, isLoading } = useGetTopTenItemWeekQuery(
    { params: { selectedYear, selectedCompany, type: selectedfilterType } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------- Normalize Data ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data
      .filter(item => Number(item.totalSales) > 0)
      .map((item, index) => ({
        name: item.itemName,
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



  /* ---------- Top 3 Items ---------- */



  const top3Items = useMemo(() => {
    return chartData
      .slice()
      .sort((a, b) => b.y - a.y)
      .slice(0, 3);
  }, [chartData]);

  /* ---------- Chart Options ---------- */
  const options = {
    chart: {
      type: "spline",
      scrollablePlotArea: { minWidth: 300 },
      height: 420,
      marginTop: 10,
      borderRadius: 10,
    },

    title: null,

    xAxis: {
      min: 0,
      max: chartData.length - 1,
      tickInterval: 1,
      labels: {
        formatter() {
          return this.value + 1; // Rank 1 → 10
        },
        style: { fontSize: "10px" },
      },
      lineWidth: 1,
      lineColor: "#000",
      tickLength: 4,
      tickColor: "#000",
    },

    yAxis: {
      min: 0,
      visible: false,
      gridLineWidth: 1,
      gridLineColor: "#e0e0e0",
      gridLineDashStyle: "Dash",
    },

    tooltip: {
      formatter() {
        return `
          <b>Item:</b> ${this.point.itemName}<br/>
          <b>Sales:</b> ${formatINR(this.y)}
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
            return formatINR(this.y);
          },
          style: {
            fontSize: "10px",
            fontWeight: "600",
          },
        },
      },
    },

    legend: { enabled: false },
    credits: { enabled: false },

    series: [
      {
        name: "Sales",
        color: "#4c00ff",
        lineWidth: 2,
        data: chartData?.map((item, index) => ({
          x: index,
          y: item.y,
          itemName: item.itemName,
          company: item?.company
        })),
        marker: {
          fillColor: "#000",
          lineWidth: 2,
          lineColor: "#fff",
        },
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
      },
    ],
  };

  /* ---------- Render ---------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Top 10 Items Sold – Last One Week"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      {/* <CardContent sx={{ position: "relative" }}>
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
          {top3Items.map((item, index) => (
            <div
              key={item.itemName}
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
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.itemName}
            </div>
          ))}
        </div>

        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent> */}
      <CardContent sx={{ position: "relative", minHeight: 420 }}>
        {(isLoading || isFetching) && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
              backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <SpinLoader />
          </div>
        )}

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
          {top3Items.map((item, index) => (
            <div
              key={item.itemName}
              style={{
                padding: "4px 8px",
                borderRadius: "14px",
                fontSize: "11px",
                fontWeight: 600,
                background:
                  index === 0
                    ? "#0088FE"
                    : index === 1
                      ? "#00C49F"
                      : "#CD7F32",
                color: "white",
                boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                whiteSpace: "nowrap",
              }}
            >
              {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"} {item.itemName}
            </div>
          ))}
        </div>

        {/* 📈 Chart */}
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>


      {showTable && tableParams && (
        <TopTenItemWeekTable
          itemName={tableParams.itemName}
          company={tableParams.company}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedFilterType(filterType)

          }}
          itemOptions={itemOptions}
          selectedfilterType={selectedfilterType} setSelectedFilterType={setSelectedFilterType}

        />
      )}

    </Card>
  );
};

export default StyleTop10Week;
