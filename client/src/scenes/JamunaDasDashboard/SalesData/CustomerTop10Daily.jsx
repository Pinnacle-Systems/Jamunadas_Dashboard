// import React, { useMemo } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import Highcharts3D from "highcharts/highcharts-3d";
// import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
// import { useGetTopTenCustomerDailyQuery } from
//   "../../../redux/service/jamunasDashboardService.js";

// Highcharts3D(Highcharts);

// const COLORS = [
//   "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
//   "#B435E3", "#E35B5B", "#FFA500", "#800080",
//   "#00CED1", "#DC143C",
// ];

// const CustomerTop10Daily = ({ selectedYear, selectedCompany }) => {
//   const theme = useTheme();

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   /* ---------------- API ---------------- */
//   const { data: response } = useGetTopTenCustomerDailyQuery(
//     { params: { selectedYear, selectedCompany } },
//     { skip: !selectedYear || !selectedCompany }
//   );

//   /* ---------------- Normalize Data for Donut ---------------- */
//   const chartData = useMemo(() => {
//     if (!Array.isArray(response?.data)) return [];

//     return response.data.map((item, index) => ({
//       name: item.customer,                // 👈 MONTH shown on slice
//       y: Number(item.totalSales),
//       customer: item.customer,
//       // month: item.salesYear,
//       color: COLORS[index % COLORS.length],
//     }));
//   }, [response?.data]);

//   /* ---------------- Chart Options ---------------- */
//   const options = {
//     chart: {
//       type: "pie",
//       height: 420,
//       options3d: {
//         enabled: true,
//         alpha: 45,
//         beta: 0,
//       },
//       backgroundColor: "#ffffff",
//     },

//     title: {
//       text: "",
//     },

//     tooltip: {
//       formatter() {
//         return `
//           <b>Customer:</b> ${this.point.customer}<br/>
          
//           <b>Sales:</b> ${formatINR(this.y)}
//         `;
//       },
//     },

//     plotOptions: {
//       pie: {
//         innerSize: "60%",                 // 👈 DONUT
//         depth: 45,                        // 👈 3D depth
//         allowPointSelect: true,
//         cursor: "pointer",

//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return this.point.name;        // 👈 Month name only
//           },
//           style: {
//             fontSize: "11px",
//             fontWeight: "600",
//           },
//         },
//       },
//     },

//     series: [
//       {
//         name: "Sales",
//         data: chartData,
//       },
//     ],

//     legend: {
//       enabled: false,
//     },

//     credits: { enabled: false },
//   };


//   /* ---------------- Render ---------------- */
//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title={`Top 10 customer  on Today  Sales`}
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />

//       <CardContent>
//         <HighchartsReact
//           highcharts={Highcharts}
//           options={options}
//           immutable
//         />
//       </CardContent>
//     </Card>
//   );
// };

// export default CustomerTop10Daily;
import React, { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenCustomerDailyQuery } from
  "../../../redux/service/jamunasDashboardService.js";

const COLORS = [
  "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
  "#B435E3", "#E35B5B", "#FFA500", "#800080",
  "#00CED1", "#DC143C",
];

const CustomerTop10Daily = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  /* ---------------- API ---------------- */
  const { data: response } = useGetTopTenCustomerDailyQuery(
    { params: { selectedYear, selectedCompany } },
    { skip: !selectedYear || !selectedCompany }
  );

  /* ---------------- Normalize Data ---------------- */
  const chartData = useMemo(() => {
    if (!Array.isArray(response?.data)) return [];

    return response.data.map((item, index) => ({
      name: item.customer,
      y: Number(item.totalSales),
      color: COLORS[index % COLORS.length],
    }));
  }, [response?.data]);

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

      <CardContent>
        <HighchartsReact
          highcharts={Highcharts}
          options={options}
        />
      </CardContent>
    </Card>
  );
};

export default CustomerTop10Daily;
