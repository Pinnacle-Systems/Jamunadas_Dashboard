// import React, { useState, useMemo } from "react";
// import Highcharts from "highcharts";
// import HighchartsReact from "highcharts-react-official";
// import {
//   Card,
//   CardHeader,
//   CardContent,
//   useTheme,
// } from "@mui/material";
// import { useGetQuarterSalesQuery } from
//   "../../../redux/service/jamunasDashboardService.js";
// // import QuarterWiseTable from "./TableData/QuarterWiseTable";

// const MONTH_ORDER = {
//   Jan: 1, Feb: 2, Mar: 3,
//   Apr: 4, May: 5, Jun: 6,
//   Jul: 7, Aug: 8, Sep: 9,
//   Oct: 10, Nov: 11, Dec: 12,
// };

// const QuarterSales = ({ selectedYear, selectedCompany }) => {

//   const formatINR = (value) =>
//     `₹ ${Number(value).toLocaleString("en-IN", {
//       minimumFractionDigits: 2,
//       maximumFractionDigits: 2,
//     })}`;

//   const theme = useTheme();
//   const [showTable, setShowTable] = useState(false);
//   const [selectedQuarter, setSelectedQuarter] = useState(null);

//   const { data: response, isLoading } =
//     useGetQuarterSalesQuery({
//       params: { selectedYear, selectedCompany },
//     });

//   const QUARTER_COLORS = {
//     Q1: "#DC143C", // green
//     Q2: "#FF8042", // blue
//     Q3: "#00C49F", // orange
//     Q4: "#0088FE", // purple
//   };
//   /* ---------- PROCESS DATA ---------- */
//   const chartData = useMemo(() => {
//     const rawData = Array.isArray(response?.data) ? response.data : [];

//     const sorted = [...rawData].sort(
//       (a, b) =>
//         MONTH_ORDER[a.monthName.trim()] -
//         MONTH_ORDER[b.monthName.trim()]
//     );

//     const categories = sorted.map(d => d.monthName);
//     const quarterAxis = sorted.map(d => d.quarter);

//     return {
//       categories,
//       quarterAxis,
//       data: sorted.map(d => ({
//         y: Number(d.value) || 0,
//         quarter: d.quarter,
//         monthName: d.monthName,   // ✅ ADD THIS

//         color: QUARTER_COLORS[d.quarter], // 👈 COLOR BY QUARTER

//       })),
//     };
//   }, [response?.data]);

//   /* ---------- CHART OPTIONS ---------- */
//   const options = {
//     chart: {
//       type: "column",
//       height: 380,
//     },

//     title: { text: "" },


//     //   {
//     //     categories: chartData.categories,
//     //     labels: {
//     //       style: {
//     //         fontSize: "11px",
//     //         fontWeight: "600",
//     //       },
//     //     },
//     //   },
//     //   {
//     //     linkedTo: 0,
//     //     categories: chartData.quarterAxis,
//     //     opposite: false,
//     //     labels: {
//     //       groupedOptions: [
//     //         { rotation: 0 }
//     //       ],
//     //       style: {
//     //         fontSize: "13px",
//     //         fontWeight: "700",
//     //       },
//     //     },
//     //     tickPositions: [1, 4, 7, 10], // 👈 center of each quarter
//     //     tickLength: 0,
//     //     lineWidth: 0,
//     //   },
//     // ],
//     xAxis: [
//       {
//         categories: chartData.categories,
//         labels: {
//           style: {
//             fontSize: "11px",
//             fontWeight: "600",
//           },
//         },

//         plotLines: [
//           {
//             value: 2.5, // after Mar
//             color: "#999",
//             width: 1,
//             zIndex: 5,
//           },
//           {
//             value: 5.5, // after Jun
//             color: "#999",
//             width: 1,
//             zIndex: 5,
//           },
//           {
//             value: 8.5, // after Sep
//             color: "#999",
//             width: 1,
//             zIndex: 5,
//           },
//         ],
//       },
//       {
//         linkedTo: 0,
//         categories: chartData.quarterAxis,
//         opposite: false,
//         tickPositions: [1, 4, 7, 10],
//         tickLength: 0,
//         lineWidth: 0,

//         labels: {
//           useHTML: true,
//           formatter() {
//             const q = this.value;
//             const color = QUARTER_COLORS[q] || "#ccc";

//             return `
//         <span
//           style="
//             background:${color};
//             color:#fff;
//             padding:4px 10px;
//             border-radius:12px;
//             font-size:12px;
//             font-weight:700;
//             display:inline-block;
//             box-shadow: 0 2px 6px rgba(0,0,0,0.2);

//           "
//         >
//           ${q}
//         </span>
//       `;
//           },
//         },
//       }

//     ],

//     yAxis: {
//       visible: false,
//     },

//     legend: { enabled: false },

//     tooltip: {
//       useHTML: true,
//       backgroundColor: "#ffffff",
//       borderWidth: 1,
//       borderRadius: 6,
//       shadow: true,

//       formatter() {
//         return `
//       <div style="padding:6px 8px">
//         <div><b>Quarter :</b> ${this.point.quarter}</div>
//         <div><b>Month :</b> ${this.point.monthName}</div>
//         <div><b>Value :</b> ${formatINR(this.y)}</div>
//       </div>
//     `;
//       },
//     },

//     plotOptions: {
//       column: {
//         pointPadding: 0,
//         groupPadding: 0.15,
//         borderWidth: 0,
//         minPointLength: 100,

//       },

//       series: {
//         cursor: "pointer",
//         point: {
//           events: {
//             click() {
//               setSelectedQuarter({ quarter: this.quarter });
//               setShowTable(true);
//             },
//           },
//         },
//         dataLabels: [
//           {
//             enabled: true,
//             inside: true,
//             rotation: -90, // 👈 VALUE ROTATED
//             overflow: 'allow',  // 👈 force showing even if small
//             crop: false,
//             formatter() {
//               return formatINR(this.y); // 👈 use formatINR here
//             },

//             style: {
//               color: "#ffffff",
//               fontSize: "11px",
//               fontWeight: "600",
//               textOutline: "1px contrast",
//             },
//           },

//         ],
//       },
//     },


//     credits: { enabled: false },

//     series: [
//       {
//         data: chartData.data,
//       },
//     ],
//   };

//   /* ---------- RENDER ---------- */
//   return (
//     <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
//       <CardHeader
//         title="Quarter Wise TurnOver"
//         titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
//         sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
//       />

//       <CardContent>
//         {isLoading ? (
//           <div style={{ textAlign: "center", padding: "40px" }}>
//             Loading...
//           </div>
//         ) : (
//           <HighchartsReact highcharts={Highcharts} options={options} />
//         )}
//       </CardContent>

//       {/* {showTable && selectedQuarter && (
//         <QuarterWiseTable
//           quarter={selectedQuarter.quarter}

//           closeTable={() => setShowTable(false)}
//         />
//       )} */}
//     </Card>
//   );
// };




// export default QuarterSales;

import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
} from "@mui/material";
import { useGetQuarterSalesQuery } from
  "../../../redux/service/jamunasDashboardService.js";

// ---------------- MONTH MAP ----------------
const MONTH_MAP = {
  1: "Jan", 2: "Feb", 3: "Mar",
  4: "Apr", 5: "May", 6: "Jun",
  7: "Jul", 8: "Aug", 9: "Sep",
  10: "Oct", 11: "Nov", 12: "Dec",
};

const QUARTER_COLORS = {
  Q1: "#DC143C",
  Q2: "#FF8042",
  Q3: "#00C49F",
  Q4: "#0088FE",
};

const QuarterSales = ({ selectedYear, selectedCompany }) => {
  const theme = useTheme();
  const [showTable, setShowTable] = useState(false);
  const [selectedQuarter, setSelectedQuarter] = useState(null);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const { data: response, isLoading } =
    useGetQuarterSalesQuery({
      params: { selectedYear, selectedCompany },
    });

  /* ---------- PROCESS DATA (APR → MAR) ---------- */
  const chartData = useMemo(() => {
    const rawData = Array.isArray(response?.data) ? response.data : [];

    // Sort using backend financial order
    const sorted = [...rawData].sort((a, b) => {
      const [y1, m1] = a.order.split("-").map(v => Number(v.trim()));
      const [y2, m2] = b.order.split("-").map(v => Number(v.trim()));

      // Convert to comparable number (year * 12 + month)
      return (y1 * 12 + m1) - (y2 * 12 + m2);
    });


    const categories = [];
    const quarterAxis = [];
    const data = [];

    sorted.forEach(item => {
      const monthNo = Number(item.order.split("-")[1]);
      const monthName = MONTH_MAP[monthNo];

      categories.push(monthName);
      quarterAxis.push(item.quarter);

      data.push({
        y: Number(item.totalSales) || 0,
        quarter: item.quarter,
        monthName,
        color: QUARTER_COLORS[item.quarter],
      });
    });

    return { categories, quarterAxis, data };
  }, [response?.data]);

  /* ---------- CHART OPTIONS ---------- */
  const options = {
    chart: {
      type: "column",
      height: 380,
    },

    title: { text: "" },

    xAxis: [
      {
        categories: chartData.categories,
        labels: {
          style: {
            fontSize: "11px",
            fontWeight: "600",
          },
        },
        plotLines: [
          { value: 2.5, color: "#999", width: 1 },
          { value: 5.5, color: "#999", width: 1 },
          { value: 8.5, color: "#999", width: 1 },
        ],
      },
      {
        linkedTo: 0,
        categories: chartData.quarterAxis,
        tickPositions: [1, 4, 7, 10],
        tickLength: 0,
        lineWidth: 0,
        labels: {
          useHTML: true,
          formatter() {
            const color = QUARTER_COLORS[this.value] || "#ccc";
            return `
              <span style="
                background:${color};
                color:#fff;
                padding:4px 10px;
                border-radius:12px;
                font-size:12px;
                font-weight:700;
                display:inline-block;
                box-shadow:0 2px 6px rgba(0,0,0,0.2);
              ">
                ${this.value}
              </span>
            `;
          },
        },
      },
    ],

    yAxis: {
      visible: false,
    },

    legend: { enabled: false },

    tooltip: {
      useHTML: true,
      borderWidth: 0,   // IMPORTANT
      backgroundColor: "transparent",
      shadow: false,
      formatter() {
        const color = this.point.color;

        return `
      <div style="
        border:2px solid ${color};
        border-radius:8px;
        padding:8px 10px;
        background:#fff;
        box-shadow:0 4px 10px rgba(0,0,0,0.15);
        min-width:160px;
      ">
        <div><b>Quarter :</b> ${this.point.quarter}</div>
        <div><b>Month :</b> ${this.point.monthName}</div>
        <div><b>Sales :</b> ${formatINR(this.y)}</div>
      </div>
    `;
      },
    },


    plotOptions: {
      column: {
        pointPadding: 0,
        groupPadding: 0.15,
        borderWidth: 0,
        minPointLength: 120,
      },
      series: {
        cursor: "pointer",
        point: {
          events: {
            click() {
              setSelectedQuarter({ quarter: this.quarter });
              setShowTable(true);
            },
          },
        },
        dataLabels: {
          enabled: true,
          inside: true,
          rotation: -90,
          crop: false,
          overflow: "allow",
          formatter() {
            return formatINR(this.y);
          },
          style: {
            color: "#fff",
            fontSize: "11px",
            fontWeight: "600",
            textOutline: "none",
          },
        },
      },
    },

    credits: { enabled: false },

    series: [
      {
        data: chartData.data,
      },
    ],
  };

  /* ---------- RENDER ---------- */
  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title="Quarter Wise Sales"
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
      />

      <CardContent>
        {isLoading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            Loading...
          </div>
        ) : (
          <HighchartsReact highcharts={Highcharts} options={options} />
        )}
      </CardContent>
    </Card>
  );
};

export default QuarterSales;
