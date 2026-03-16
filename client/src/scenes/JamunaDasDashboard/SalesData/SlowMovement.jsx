
import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetTopTenItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopTenItemMonthWiseTable from "./TableData/TopTenItemrMonthTable.jsx";
import SpinLoader from '../../../utils/spinLoader'

const SlowMovement = ({ yearFilter, setYearFilter, selectedCompany, finYrData, filterType, setFilterType }) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "")
  const [selectedfilterType, setSelectedFilterType] = useState(filterType || "ALL")



  useEffect(() => {
    setSelectedYear(yearFilter)
  }, [yearFilter])
  useEffect(() => {
    setSelectedFilterType(filterType)
  }, [filterType])


  console.log({ selectedYear, selectedCompany, selectMonths }, "StyleTopTenMonth");


  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response, isFetching, isLoading } = useGetTopTenItemMonthQuery(
    { params: { selectedYear, selectedCompany, selectMonths, type: selectedfilterType } },
    { skip: !selectedYear || !selectedCompany || !selectMonths }
  );

  /* ---------- Colors ---------- */
  const COLORS = useMemo(
    () => [
      "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
      "#B435E3", "#E35B5B", "#FFA500", "#800080",
      "#00CED1", "#DC143C",
    ],
    []
  );

  /* ---------- Normalize Data ---------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data
      .filter(item => Number(item.totalSales) > 0)
      .map((item, index) => ({
        name: item.itemName,
        y: Number(item.totalSales),
        color: COLORS[index % COLORS.length],
        itemName: item.itemName,
        salesMonth: item.salesMonth,
        company: item.company,
        salesYear: item.salesYear,
      }));
  }, [response, COLORS]);

  const itemOptions = useMemo(() => {
    return [...new Set(chartData.map(item => item.itemName))];
  }, [chartData]);

  const categories = chartData.map(item => item.name);

  /* ---------- Chart Options ---------- */
  const options = {
    chart: {
      type: "areaspline", // ✅ CHANGED
      height: 420,
    },

    title: { text: "" },

    xAxis: {
      categories,
      title: { text: "Item Name" },
      labels: {
        rotation: -45,
        style: { fontSize: "11px" },
      },
      lineColor: "#ddd",
      tickColor: "#ddd",
    },

    yAxis: {
      min: 0,
      title: {
        text: "Sales Value",
        style: { fontSize: "13px" },
      },
      gridLineColor: "#eee",
    },

    tooltip: {
      formatter() {
        return `
          <b>${this.point.itemName}</b><br/>
          Total Sales: <b>${formatINR(this.y)}</b>
        `;
      },
    },

    plotOptions: {
      areaspline: { // ✅ CHANGED
        cursor: "pointer",
        fillOpacity: 0.35,
        lineWidth: 2,

        marker: {
          enabled: true,
          radius: 3,
          lineWidth: 1,
          lineColor: "#fff",
        },

        states: {
          hover: {
            lineWidth: 3,
          },
        },

        dataLabels: {
          enabled: true,
          formatter() {
            return formatINR(this.y);
          },
          style: {
            fontSize: "10px",
            fontWeight: "bold",
            color: "#333",
            textOutline: "none",
          },
        },

        point: {
          events: {
            click() {
              setTableParams({
                itemName: this.itemName,
                company: this.company,
                year: this.salesYear,
                month: this.salesMonth,
              });
              setShowTable(true);
            },
          },
        },
      },
    },

    series: [
      {
        name: "Sales",
        data: chartData,
        color: "#1976d2",
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, "rgba(173, 28, 240, 0.6)"], // blue (top)
            [1, "rgba(243, 4, 4, 0.1)"], // light blue (bottom)
          ],
        },
      },
    ],

    legend: { enabled: false },
    credits: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Slow Movement Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ width: 150 }}>
            <FinYear
              selectedYear={selectedYear}
              selectmonths={selectMonths}
              setSelectmonths={setSelectMonths}
              autoBorder={true}

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

      {/* <CardContent>
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
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(2px)",
            }}
          >
            <SpinLoader />
          </div>
        )}

        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>


      {showTable && tableParams && (
        <TopTenItemMonthWiseTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          itemOptions={itemOptions}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter)
            setSelectedFilterType(filterType)

          }}
          selectMonths={selectMonths}
          setSelectMonths={setSelectMonths}
          selectedfilterType={selectedfilterType} setSelectedFilterType={setSelectedFilterType}

        />
      )}
    </Card>
  );
};

export default SlowMovement;