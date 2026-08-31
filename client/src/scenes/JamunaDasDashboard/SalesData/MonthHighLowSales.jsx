import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetLowestHighestMovementQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopTenItemMonthWiseTable from "./TableData/TopTenItemrMonthTable.jsx";
import SpinLoader from "../../../utils/spinLoader";

const MonthHighLowSales = ({
  yearFilter,
  setYearFilter,
  selectedCompany,
  finYrData,
  filterType,
  setFilterType,
}) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(
    filterType || "ALL",
  );

  useEffect(() => {
    setSelectedYear(yearFilter);
  }, [yearFilter]);
  useEffect(() => {
    setSelectedFilterType(filterType);
  }, [filterType]);

  console.log(
    { selectedYear, selectedCompany, selectMonths },
    "MonthHighLowSales",
  );

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const {
    data: response,
    isFetching,
    isLoading,
  } = useGetLowestHighestMovementQuery(
    {
      params: {
        selectedYear,
        compcode: selectedCompany,
      },
    },
    { skip: !selectedYear || !selectedCompany },
  );
  console.log(response, "MonthHighLowSales");
  /* ---------- Colors ---------- */
  const COLORS = useMemo(
    () => [
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
    ],
    [],
  );

  /* ---------- Normalize Data ---------- */
  const chartData = useMemo(() => {
    if (!response?.data) return { categories: [], series: [] };

    const {
      lowestSalesPeriod,
      highestSalesPeriod,
      lowestSalesItem,
      highestSalesItem,
    } = response.data;

    const categories = [
      lowestSalesPeriod?.payPeriod || "N/A",
      highestSalesPeriod?.payPeriod || "N/A",
      lowestSalesItem?.itemName || "N/A",
      highestSalesItem?.itemName || "N/A",
    ];

    const series = [
      {
        name: "Lowest",
        color: COLORS[0 % COLORS.length],
        data: [
          {
            x: 0,
            y: lowestSalesPeriod ? Number(lowestSalesPeriod.totalSales) : null,
            type: "Lowest Month",
          },
          {
            x: 2,
            y: lowestSalesItem ? Number(lowestSalesItem.totalSales) : null,
            type: "Lowest Item",
          },
        ],
      },
      {
        name: "Highest",
        color: COLORS[1 % COLORS.length],
        data: [
          {
            x: 1,
            y: highestSalesPeriod
              ? Number(highestSalesPeriod.totalSales)
              : null,
            type: "Highest Month",
          },
          {
            x: 3,
            y: highestSalesItem ? Number(highestSalesItem.totalSales) : null,
            type: "Highest Item",
          },
        ],
      },
    ];

    return { categories, series };
  }, [response, COLORS]);

  const itemOptions = useMemo(() => {
    return []; // Re-enable if needed for table filtering
  }, [chartData]);

  /* ---------- Chart Options ---------- */
  const options = {
    chart: {
      type: "column",
      height: 420,
    },

    title: { text: "" },

    xAxis: [
      {
        categories: chartData.categories,
        title: { text: "" },
        labels: {
          rotation: -45,
          style: { fontSize: "11px", maxWidth: "120px", fontWeight: "bold" },
        },
        lineColor: "#ddd",
        tickColor: "#ddd",
        plotLines: [
          {
            color: "#999999",
            width: 2,
            value: 1.5,
            zIndex: 5,
            dashStyle: "dash",
          },
        ],
      },
      {
        opposite: true,
        linkedTo: 0,
        tickPositions: [0.5, 2.5],
        labels: {
          formatter: function () {
            if (this.value === 0.5) return "Month";
            if (this.value === 2.5) return "Item";
            return "";
          },
          style: { fontSize: "14px", fontWeight: "bold" },
        },
        lineWidth: 0,
        tickWidth: 0,
      },
    ],

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
          <b>${this.point.type}</b><br/>
          ${this.x}<br/>
          Total Sales: <b>${formatINR(this.y)}</b>
        `;
      },
    },

    plotOptions: {
      column: {
        cursor: "default",
        grouping: false,
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
      },
    },

    series: chartData.series,

    legend: { enabled: true },
    credits: { enabled: false },
  };

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Lowest and Highest Movement on ${selectedYear} Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
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

        <HighchartsReact highcharts={Highcharts} options={options} immutable />
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
            setSelectedYear(yearFilter);
            setSelectedFilterType(filterType);
          }}
          selectMonths={selectMonths}
          setSelectMonths={setSelectMonths}
          selectedfilterType={selectedfilterType}
          setSelectedFilterType={setSelectedFilterType}
        />
      )}
    </Card>
  );
};

export default MonthHighLowSales;
