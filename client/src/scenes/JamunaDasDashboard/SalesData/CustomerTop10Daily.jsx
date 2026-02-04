import React, { useEffect, useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenCustomerDailyQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import TopTenCustomerTodayTable from './TableData/TopTenCustomerTodayTable.jsx'
import SpinLoader from '../../../utils/spinLoader'

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const CustomerTop10Daily = ({ selectedYear, selectedCompany, filterType, setFilterType }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedfilterType, setSelectedFilterType] = useState(filterType || "ALL")

  const [selectedCustomer, setSelectedCustomer] = useState();
  const [localCompany, setLocalCompany] = useState();

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  useEffect(() => {
    setSelectedFilterType(filterType)
  }, [filterType])
  /* ---------------- API ---------------- */
  const { data: response, isLoading, isFetching } = useGetTopTenCustomerDailyQuery(
    { params: { selectedYear, selectedCompany, type: selectedfilterType } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize Data ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((item, index) => ({
      name: item.customer,
      y: Number(item.totalSales),
      customer: item.customer,
      company: item.company,
      color: COLORS[index % COLORS.length],
    }));
  }, [response?.data]);
  const customerOptions = useMemo(() => {
    return [...new Set(chartData.map(i => i.customer))];
  }, [chartData]);
  /* ---------------- Chart Options ---------------- */
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
          <b>Customer:</b> ${this.point.name}<br/>
          <b>Sales:</b> ${formatINR(this.y)}
        `;
      },
    },

    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        size: "85%",            // 🎯 ensures full round shape
        point: {
          events: {
            click() {
              setTableParams({
                customer: this.customer,
                company: this.company,
              });
              setLocalCompany(this.company)
              setSelectedCustomer(this.customer)
              setShowTable(true);
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter() {
            return this.point.name;
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

    legend: {
      enabled: false,
    },

    credits: { enabled: false },
  };

  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Top 10 Customers – Today Sales"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      {/* <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent> */}
      <CardContent sx={{ position: "relative", minHeight: 460 }}>
        {(isLoading || isFetching) ? (
          <div
            style={{
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
          </div>) : (
          <HighchartsReact
            highcharts={Highcharts}
            options={options}
          />
        )}
      </CardContent>

      {showTable && tableParams && (
        <TopTenCustomerTodayTable
          customer={tableParams.customer}
          company={tableParams.company}
          customerOptions={customerOptions}
          setLocalCompany={setLocalCompany}
          localCompany={localCompany}
          setSelectedCustomer={setSelectedCustomer}
          selectedCustomer={selectedCustomer}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedFilterType(filterType)

          }}
          selectedfilterType={selectedfilterType} setSelectedFilterType={setSelectedFilterType}

        />
      )}

    </Card>
  );
};

export default CustomerTop10Daily;
