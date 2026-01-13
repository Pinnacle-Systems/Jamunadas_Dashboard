import React, { useState, useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import { Card, CardHeader, CardContent, useTheme } from "@mui/material";
import { useGetTopTenItemYearQuery } from
    "../../../redux/service/jamunasDashboardService.js";

const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF8042",
    "#B435E3", "#E35B5B", "#FFA500", "#800080",
    "#00CED1", "#DC143C",
];

const StyleTopTenYear = ({ selectedYear, selectedCompany }) => {
    const theme = useTheme();
    const [showTable, setShowTable] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    /* ---------- INR Formatter ---------- */
    const formatINR = (value) =>
        `₹ ${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    /* ---------- API ---------- */
    const { data: apiResponse } = useGetTopTenItemYearQuery(
        { params: { selectedYear, selectedCompany } },
        { skip: !selectedYear || !selectedCompany }
    );

    /* ---------- Normalize API Data ---------- */
    const chartData = useMemo(() => {
        if (!Array.isArray(apiResponse?.data)) return [];

        return apiResponse.data
            .filter(item => Number(item.totalSales) > 0)
            .map((item, index) => ({
                name: item.itemName,
                y: Number(item.totalSales),
                color: COLORS[index % COLORS.length],
                itemName: item.itemName,
                company: item.company,
                salesYear: item.salesYear,
            }));
    }, [apiResponse]);

    const categories = chartData.map(item => item.name);

    /* ---------- Click Handler ---------- */
    const handlePointClick = (point) => {
        setSelectedItem({
            itemName: point.options.itemName,
            company: point.options.company,
            salesYear: point.options.salesYear,
        });
        setShowTable(true);
    };

    /* ---------- Chart Options ---------- */
    //   const options = {
    //     chart: {
    //       type: "column",
    //       height: 420,
    //     },

    //     title: { text: "" },

    //     xAxis: {
    //       categories,
    //       title: {
    //         text: "Item Name",
    //       },
    //       labels: {
    //         rotation: -45,
    //         style: { fontSize: "11px" },
    //       },
    //     },

    //     yAxis: {
    //       min: 0,
    //       title: {
    //         text: "Sales Value",
    //         style: { fontSize: "13px" },
    //       },
    //       labels: {
    //         formatter() {
    //           return formatINR(this.value);
    //         },
    //       },
    //     },

    //     tooltip: {
    //       formatter() {
    //         return `
    //           <b>${this.point.itemName}</b><br/>
    //           Sales: <b>${formatINR(this.y)}</b>
    //         `;
    //       },
    //     },

    //     plotOptions: {
    //       column: {
    //         cursor: "pointer",
    //         pointWidth: 28,
    //         dataLabels: {
    //           enabled: true,
    //           rotation: -90,
    //           inside: true,
    //           style: {
    //             fontSize: "10px",
    //             fontWeight: "bold",
    //             color: "#fff",
    //             textOutline: "1px contrast",
    //           },
    //           formatter() {
    //             return formatINR(this.y);
    //           },
    //         },
    //         point: {
    //           events: {
    //             click() {
    //               handlePointClick(this);
    //             },
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

    //     legend: { enabled: false },
    //     credits: { enabled: false },
    //   };
    const options = {
        chart: {
            type: "area",
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
        },

        yAxis: {
            min: 0,
            title: {
                text: "Sales Value",
                style: { fontSize: "13px" },
            },
            // labels: {
            //   formatter() {
            //     return formatINR(this.value);
            //   },
            // },
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
            area: {
                cursor: "pointer",
                fillOpacity: 0.5,
                marker: {
                    enabled: true,
                    radius: 4,
                },
                dataLabels: {
                    enabled: true,
                    formatter() {
                        return formatINR(this.y);
                    },
                    style: {
                        fontSize: "10px",
                        fontWeight: "bold",
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
                color: "#1976d2", // line color (blue)
                fillColor: {
                    linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                    stops: [
                        [0, "rgba(44, 233, 60, 0.6)"], // blue (top)
                        [1, "rgba(71, 170, 95, 0.1)"], // light blue (bottom)
                    ],
                },
            },
        ],


        legend: { enabled: false },
        credits: { enabled: false },
};

/* ---------- Render ---------- */
return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
        <CardHeader
            title={`Top 10 Items on  ${selectedYear} Sales`}
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
    </Card>
);
};

export default StyleTopTenYear;
