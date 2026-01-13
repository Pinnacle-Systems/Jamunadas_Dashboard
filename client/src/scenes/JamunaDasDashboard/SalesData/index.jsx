import React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useDispatch } from "react-redux";
import ReactApexChart from "react-apexcharts";

import { useGetTotalSalesQuery } from "../../../redux/service/jamunasDashboardService";
import { push } from "../../../redux/features/opentabs";

// ---------- COMMON INR FORMATTER ----------
const formatINR = (value) =>
  `₹ ${Number(value).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const SalesData = () => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const {
    data: totalSales,
    isLoading,
    isError,
    error,
  } = useGetTotalSalesQuery();

  // ---------- SAFE DATA ----------
  const salesData =
    totalSales?.data?.map((item) => ({
      year: item.year,
      company: item.company,
      totalSales: Number(item.totalSales || 0),
    })) || [];

  const salesYear = salesData.map((item) => item.year);
  const salesValue = salesData.map((item) => item.totalSales);

  const sumTotal = salesData.reduce(
    (sum, item) => sum + item.totalSales,
    0
  );

  // ---------- APEX BAR CHART OPTIONS ----------
  const apexOptions = {
    chart: {
      type: "bar",
      height: 300,
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const index = config.dataPointIndex;

          const selectedYear = salesData[index]?.year;
          const selectedCompany = salesData[index]?.company;

          dispatch(
            push({
              id: "SalesDetail",
              name: "SalesDetail",
              component: "SalesDetail",
              data: {
                selectedYear,
                selectedCompany,   // ✅ pass company
              },
            })
          );
        },
      },

    },

    grid: {
      padding: {
        top: 0,
        bottom: 10,
      },
    },

    plotOptions: {
      bar: {
        borderRadius: 6,
        horizontal: false,
        distributed: true,
        columnWidth: "35%",
      },
    },

    colors: [
      "#F44F5E",
      "#E55A89",
      "#D863B1",
      "#CA6CD8",
      "#B57BED",
      "#8D95EB",
      "#62ACEA",
      "#4BC3E6",
    ],

    dataLabels: {
      enabled: false,
    },

    tooltip: {
      y: {
        formatter: function (value) {
          return formatINR(value);
        },
      },
    },

    xaxis: {
      categories: salesYear,
    },
    yaxis: {
      labels: {
        formatter: function (value) {
          return formatINR(value);   // ✅ reuse same formatter
        },
        style: {
          fontSize: "11px",
        },
      },
    },


    legend: {
      show: false,
    },
  };

  const apexSeries = [
    {
      name: "Yearly Sales",
      data: salesValue,
    },
  ];

  // ---------- LOADING ----------
  if (isLoading) {
    return (
      <Card sx={{ borderRadius: 3, boxShadow: 4, textAlign: "center", ml: 1 }}>
        <CircularProgress />
      </Card>
    );
  }

  // ---------- ERROR ----------
  if (isError) {
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );
  }

  // ---------- UI ----------
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Sales Distribution Year Wise"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
      />

      <CardContent>
        {salesData.length > 0 && (
          <ReactApexChart
            options={apexOptions}
            series={apexSeries}
            type="bar"
            height={300}
          />
        )}

        <Box
          sx={{
            mt: 1,
            p: 1,
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Overall Sales : {formatINR(sumTotal)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesData;
