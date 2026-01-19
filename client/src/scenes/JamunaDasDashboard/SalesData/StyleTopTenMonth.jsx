// import React, { useMemo, useState } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
// import { useGetTopTenItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
// import FinYear from "../../../components/FinYear.js";
// import TopTenItemMonthWiseTable from './TableData/TopTenItemrMonthTable.jsx'
// const StyleTopTenMonth = ({ selectedYear, selectedCompany, finYrData }) => {
//   const theme = useTheme();
//   const [selectMonths, setSelectMonths] = useState("");
//   const [showTable, setShowTable] = useState(false);
//   const [tableParams, setTableParams] = useState(null);

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const { data: response } = useGetTopTenItemMonthQuery(
//     { params: { selectedYear, selectedCompany, selectMonths } },
//     { skip: !selectedYear || !selectedCompany || !selectMonths }
//   );

//   // ---------- Normalize Data ----------
//   const COLORS = useMemo(() =>
//     [
//       "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
//       "#B435E3", "#E35B5B", "#FFA500", "#800080",
//       "#00CED1", "#DC143C",
//     ], []
//   )
//   const chartData = useMemo(() => {
//     if (!Array.isArray(response?.data)) return [];

//     return response.data
//       .filter(item => Number(item.totalSales) > 0)
//       .map((item, index) => ({
//         name: item.itemName,
//         y: Number(item.totalSales),
//         color: COLORS[index % COLORS.length],
//         itemName: item.itemName,
//         salesMonth: item.salesMonth,

//         company: item.company,
//         salesYear: item.salesYear,
//       }));
//   }, [response, COLORS]);
//   const itemOptions = useMemo(() => {
//     if (!Array.isArray(chartData)) return [];
//     return [...new Set(chartData.map(item => item.itemName))];
//   }, [chartData]);
//   const categories = chartData.map(item => item.name);

//   // ---------- Chart Options ----------
//   const options = {
//     chart: {
//       type: "area",
//       height: 420,
//     },

//     title: { text: "" },



//     xAxis: {
//       categories,
//       title: { text: "Item Name" },
//       labels: {
//         rotation: -45,
//         style: { fontSize: "11px" },
//       },
//       lineColor: "#ddd",
//       tickColor: "#ddd",
//     },
//     yAxis: {
//       min: 0,
//       title: {
//         text: "Sales Value",
//         style: { fontSize: "13px" },
//       },
//       gridLineColor: "#eee",

//     },

//     tooltip: {
//       formatter() {
//         return `
//         <b>${this.point.itemName}</b><br/>
//         Total Sales: <b>${formatINR(this.y)}</b>
//       `;
//       },
//     },

//     plotOptions: {
//       area: {
//         cursor: "pointer",
//         fillOpacity: 0.35,
//         lineWidth: 2,

//         marker: {
//           enabled: true,
//           radius: 3,
//           lineWidth: 1,
//           lineColor: "#fff",
//         },
//         states: {
//           hover: {
//             lineWidth: 3,
//           },
//         },

//         dataLabels: {
//           enabled: true,
//           formatter() {
//             return formatINR(this.y);
//           },
//           style: {
//             fontSize: "10px",
//             fontWeight: "bold",
//              color: "#333",
//         textOutline: "none",
//           },
//         }, point: {
//           events: {
//             click() {
//               setTableParams({
//                 itemName: this.itemName,
//                 company: this.company,
//                 year: this.salesYear,
//                 month: this.salesMonth
//               });
//               setShowTable(true);
//             },
//           },
//         },

//       },
//     },

//     series: [
//       {
//         name: "Sales",
//         data: chartData,
//         color: "#1976d2", // line color (blue)
//         fillColor: {
//           linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
//           stops: [
//             [0, "rgb(226, 56, 56)"], // blue (top)
//             [1, "rgb(153, 91, 91)"], // light blue (bottom)
//           ],
//         },
//       },
//     ],


//     legend: { enabled: false },
//     credits: { enabled: false },
//   };

//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title={`Top 10 Items – ${selectMonths || "Month"} Sales`}
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         action={
//           <Box sx={{ width: 150 }}>
//             <FinYear
//               selectedYear={selectedYear}
//               selectmonths={selectMonths}
//               setSelectmonths={setSelectMonths}
//             />
//           </Box>
//         }
//         sx={{
//           p: 1,
//           borderBottom: `2px solid ${theme.palette.divider}`,
//           "& .MuiCardHeader-action": { alignSelf: "center", marginTop: -1, marginRight: 5 },
//         }}
//       />
//       <CardContent>
//         <HighchartsReact highcharts={Highcharts} options={options} />
//       </CardContent>
//       {showTable && tableParams && (
//         <TopTenItemMonthWiseTable
//           year={tableParams.year}
//           month={tableParams.month}
//           customer={tableParams.customer}
//           item={tableParams.itemName}
//           company={tableParams.company}
//           itemOptions={itemOptions}
//           finYrData={finYrData}
//           closeTable={() => {
//             setShowTable(false);
//             setTableParams(null);
//           }}
//         />
//       )}
//     </Card>
//   );
// };

// export default StyleTopTenMonth;
import React, { useMemo, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme, Box } from "@mui/material";
import { useGetTopTenItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopTenItemMonthWiseTable from "./TableData/TopTenItemrMonthTable.jsx";

const StyleTopTenMonth = ({ selectedYear, selectedCompany, finYrData }) => {
  const theme = useTheme();
  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response } = useGetTopTenItemMonthQuery(
    { params: { selectedYear, selectedCompany, selectMonths } },
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
            [0, "rgb(226, 56, 56)"],
            [1, "rgb(153, 91, 91)"],
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
        title={`Top 10 Items – ${selectMonths || "Month"} Sales`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
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
        <HighchartsReact highcharts={Highcharts} options={options} />
      </CardContent>

      {showTable && tableParams && (
        <TopTenItemMonthWiseTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          itemOptions={itemOptions}
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

export default StyleTopTenMonth;
