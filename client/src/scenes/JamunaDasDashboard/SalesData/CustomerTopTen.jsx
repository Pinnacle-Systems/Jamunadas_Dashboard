import React, { useMemo, useState, useEffect } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, Box, useTheme } from "@mui/material";
import SpinLoader from '../../../utils/spinLoader'

import { useGetTopTenCustomerQuery } from
  "../../../redux/service/jamunasDashboardService.js";

import TopTenCustomerYearWiseTable from
  "../SalesData/TableData/TopTenCustomerYearTable.jsx";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const CustomerTopTen = ({ yearFilter, setYearFilter, selectedCompany, finYrData, filterType, setFilterType }) => {
  const theme = useTheme();

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [tableParams, setTableParams] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "")
  const [selectedfilterType, setSelectedFilterType] = useState(filterType || "ALL")



  useEffect(() => {
    setSelectedYear(yearFilter)
  }, [yearFilter])
  useEffect(() => {
    setSelectedFilterType(filterType)
  }, [filterType])
  /* ---------------- INR Formatter ---------------- */
  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------------- API ---------------- */
  const { data: customer, isLoading, isFetching } = useGetTopTenCustomerQuery(
    { params: { selectedYear, selectedCompany, type: selectedfilterType } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize API Data ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(customer?.data)) return [];

    return customer.data
      .filter(item => Number(item.totalSales) > 0)
      .map((item, index) => ({
        y: Number(item.totalSales),
        customer: item.customer,
        finYear: item.finyr,
        company: item.company,
        color: COLORS[index % COLORS.length],
      }));
  }, [customer?.data]);

  /* ---------------- Customer Dropdown Options ---------------- */
  const customerOptions = useMemo(() => {
    return [...new Set(chartData.map(i => i.customer))];
  }, [chartData]);

  /* ---------------- Reset on Year / Company Change ---------------- */
  // useEffect(() => {
  //   setSelectedCustomer(null);
  //   setShowTable(false);
  //   setTableParams(null);
  // }, [selectedYear, selectedCompany]);

  /* ---------------- Chart Options ---------------- */
  const options = useMemo(() => ({
    chart: {
      type: "column",
      height: 440,
    },

    title: { text: "" },

    xAxis: {
      categories: chartData.map(i => i.customer),
      labels: {
        rotation: -45,
        style: { fontSize: "11px" },
      },
      title: { text: "Customer" },
    },

    yAxis: {
      type: "linear",
      min: 1,
      title: { text: "Sales" },
    },

    tooltip: {
      formatter() {
        return `
          <b>${this.point.customer}</b><br/>
          Sales: <b>${formatINR(this.y)}</b>
        `;
      },
    },

    plotOptions: {
      column: {
        cursor: "pointer",
        pointWidth: 28,
        dataLabels: {
          enabled: true,
          rotation: -90,
          inside: true,
          formatter() {
            return formatINR(this.y);
          },
          style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#fff",
            textOutline: "1px contrast",
          },
        },
        point: {
          events: {
            click() {
              setSelectedCustomer(this.options.customer);
              setTableParams({
                customer: this.options.customer,
                year: selectedYear,
                company: this.options.company,
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
      },
    ],

    legend: { enabled: false },
    credits: { enabled: false },
  }), [chartData]);

  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top 10 Customer On ${selectedYear} Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      {/* <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent> */}
      <CardContent sx={{ position: "relative", height: 480 }}>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />

        {(isLoading || isFetching) && (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          >
            <SpinLoader />
          </Box>
        )}
      </CardContent>


      {/* Table */}
      {showTable && tableParams && (
        <TopTenCustomerYearWiseTable
          customer={tableParams.customer}
          year={tableParams.year}
          company={tableParams.company}
          customerOptions={customerOptions}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter)
            setSelectedFilterType(filterType)

          }}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          selectedfilterType={selectedfilterType} setSelectedFilterType={setSelectedFilterType}

        />
      )}
    </Card>
  );
};

export default CustomerTopTen;
