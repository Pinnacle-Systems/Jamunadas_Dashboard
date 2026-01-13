import React, { useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenCustomerQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import { useDispatch } from "react-redux";
// import CustomerWiseTable from "./CustomerWiseTable";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const CustomerTopTen = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const [showTable, setShowTable] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------------- API ---------------- */
  const { data: customer } = useGetTopTenCustomerQuery(
    { params: { selectedYear, selectedCompany } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize API Data ---------------- */
  const filteredData = Array.isArray(customer?.data) ? customer.data : [];

  const chartData = filteredData
    .filter(item => Number(item.totalSales) > 0)
    .map((item, index) => ({
      y: Number(item.totalSales),
      color: COLORS[index % COLORS.length],
      customer: item.customer,
    }));

  const categories = chartData.map(item => item.customer);

  /* ---------------- Click Handler ---------------- */
  const handlePointClick = (point) => {
    setSelectedCustomer({
      customerName: point.options.customer,
    });
    setShowTable(true);
  };

  /* ---------------- Chart Options ---------------- */
  const options = {
    chart: {
      type: "column",
      height: 420,
    },

    title: { text: "" },

    xAxis: {
      categories,
      labels: {
        rotation: -45,
        style: { fontSize: "11px" },
      },
      title: {
        text: "Customer",
      },
    },

    yAxis: {
      type: "logarithmic",
      min: 1,
      title: {
        text: "Sales",
        style: { fontSize: "13px" },
      },
    //   labels: {
    //     style: { fontSize: "11px", fontWeight: "500" },
    //     formatter() {
    //       return formatINR(this.value);
    //     },
    //   },
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
        pointWidth: 25,
        dataLabels: {
          enabled: true,
          rotation: -90,
          inside: true,
          style: {
            fontSize: "11px",
            fontWeight: "bold",
            color: "#fff",
            textOutline: "1px contrast",
          },
          formatter() {
            return formatINR(this.y);
          },
        },
        point: {
          events: {
            click() {
              handlePointClick(this);
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
  };

  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={` Top   10   Customer   in  year  ${selectedYear}   Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
          immutable
        />
      </CardContent>

      {/* {showTable && selectedCustomer && (
        <CustomerWiseTable
          customerName={selectedCustomer.customerName}
          closeTable={() => setShowTable(false)}
        />
      )} */}
    </Card>
  );
};

export default CustomerTopTen;
