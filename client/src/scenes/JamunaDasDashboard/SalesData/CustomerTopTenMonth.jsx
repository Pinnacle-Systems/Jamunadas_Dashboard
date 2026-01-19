import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import Highcharts3D from "highcharts/highcharts-3d";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetTopTenCustomerMonthQuery } from
  "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopTenCustomerMonthWiseTable from './TableData/TopTenCustomerMonthTable.jsx'
Highcharts3D(Highcharts);

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];


const CustomerTopTenMonth = ({ selectedYear, selectedCompany, finYrData }) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");
  const [tableParams, setTableParams] = useState(null);
  const [showTable, setShowTable] = useState(false);
  console.log(selectMonths, "selectMonths");

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------------- API ---------------- */
  const { data: response } = useGetTopTenCustomerMonthQuery(
    { params: { selectedYear, selectedCompany, selectMonths } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize Data for Donut ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((item, index) => ({
      name: item.customer,                // 👈 MONTH shown on slice
      y: Number(item.totalSales),
      customer: item.customer,
      month: item.salesYear,
      year: item.fiYear,
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
      height: 440,
      options3d: {
        enabled: true,
        alpha: 45,
        beta: 0,
      },
      backgroundColor: "#ffffff",
    },

    title: {
      text: "",
    },

    tooltip: {
      formatter() {
        return `
          <b>Customer:</b> ${this.point.customer}<br/>
          <b>Month:</b> ${this.point.month}<br/>
          <b>Sales:</b> ${formatINR(this.y)}
        `;
      },
    },

    plotOptions: {
      pie: {
        innerSize: "60%",                 // 👈 DONUT
        depth: 45,                        // 👈 3D depth
        allowPointSelect: true,
        cursor: "pointer",

        dataLabels: {
          enabled: true,
          formatter() {
            return this.point.name;        // 👈 Month name only
          },
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },
        point: {
          events: {
            click() {
              setTableParams({
                year: this.options.year,
                month: this.options.month,
                customer: this.options.customer,
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

    legend: {
      enabled: false,
    },

    credits: { enabled: false },
  };

  /* ---------------- Render ---------------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top 10 customer on month ${selectMonths}  Sales`}
        titleTypographyProps={{
          sx: { fontSize: ".9rem", fontWeight: 600 },
        }}
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
            alignSelf: "center",     // vertical alignment fix
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
      {showTable && tableParams && (
        <TopTenCustomerMonthWiseTable
          year={tableParams.year}
          month={tableParams.month}
          customer={tableParams.customer}
          company={tableParams.company}
          customerOptions={customerOptions}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
          }}
        />
      )}
    </Card>
  );

};

export default CustomerTopTenMonth;
