import { useEffect, useState } from "react";
import { Box, Card, CardContent, CardHeader, useTheme } from "@mui/material";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";

import { useGetYearlySalesQuery } from "../../../redux/service/jamunasDashboardService.js";

const YearlySales = ({ selectedCompany, year }) => {
    const [xdata, setXdata] = useState([]);
    const [ydata, setYdata] = useState([]);
    const theme = useTheme();
    const [showTable, setShowTable] = useState(false);
    const [selectedCompanyData, setSelectedCompanyData] = useState(null);

    const { data: response, isLoading } = useGetYearlySalesQuery({
        params: { selectedCompany, year },
    });

    const formatINR = (value) =>
        `₹ ${Number(value).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        })}`;

    useEffect(() => {
        if (response?.data) {
            setXdata(response.data.map((item) => item.company));
            setYdata(response.data.map((item) => Number(item.totalSales)));
        }
    }, [response]);

    const colorArray = [
        "#8A37DE", "#005E72", "#E5181C", "#056028", "#1F2937",
        "#F44F5E", "#E55A89", "#D863B1", "#CA6CD8", "#B57BED",
        "#8D95EB", "#62ACEA", "#4BC3E6",
    ];

    const options = {
        chart: {
            type: "column",
            height: 380,
            options3d: { enabled: true, alpha: 7, beta: 7, depth: 50, viewDistance: 25 },
            backgroundColor: "#FFFFFF",
            borderRadius: "10px",
        },
        title: null,
        legend: { enabled: false },
        tooltip: {
            headerFormat: '<b>{point.key}</b><br/>',
            pointFormatter() {
                return `Turnover: <b>${formatINR(this.y)}</b>`;
            },
            style: { fontSize: "12px", color: "black" },
        },
        xAxis: {
            categories: xdata,
            labels: { style: { fontSize: "11px", color: "#6B7280" } },
            title: { text: `${year}`, style: { fontSize: "12px", fontWeight: "bold", color: "#374151" }, margin: 30 },
        },
        yAxis: {
            title: { text: "Sales", style: { fontSize: "12px", fontWeight: "bold", color: "#374151" }, margin: 25 },
            labels: {
                formatter() { return formatINR(this.value); },
                style: { fontSize: "11px", color: "#6B7280" },
            },
        },
        plotOptions: {
            column: {
                depth: 25,
                colorByPoint: true,
                borderRadius: 5,
            },
            series: {
                point: {
                    events: {
                        click: function () {
                            setSelectedCompanyData({ company: this.category });
                            setShowTable(true);
                        },
                    },
                },
            },
        },
        colors: colorArray,
        series: [
            {
                name: "Sales",
                data: ydata,
                dataLabels: {
                    enabled: true,
                    formatter() { return formatINR(this.y); },
                    style: { fontSize: "11px", color: "#333" },
                },
            },
        ],
    };

    return (
        <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
            <CardHeader
                title={`Year ${year} Sales`} titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
                sx={{ p: 1, borderBottom: `2px solid ${theme.palette.divider}` }}
            />
            <CardContent>
                {isLoading ? (
                    <Box sx={{ textAlign: "center", py: 5 }}>Loading...</Box>
                ) : (
                    <HighchartsReact highcharts={Highcharts} options={options} immutable />
                )}
            </CardContent>

            {/* Table can be added here */}
            {/* {showTable && selectedCompanyData && (
        <YearWiseTable
          company={selectedCompanyData.company}
          closeTable={() => setShowTable(false)}
        />
      )} */}
        </Card>
    );
};

export default YearlySales;
