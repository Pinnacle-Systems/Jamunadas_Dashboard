import {
  Box,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Typography,
  useTheme,
} from "@mui/material";
import { useGetTotalSalesQuery } from "../../redux/service/useGetTotalSalesQuery";
import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useDispatch } from "react-redux";
import { push } from "../../../redux/features/opentabs";

const SalesData = () => {
  const theme = useTheme();
  const {
    data: totalSales,
    isLoading,
    isError,
    error,
  } = useGetTotalSalesQuery();

  const dispatch = useDispatch();

  const sumTotal = totalSales?.data?.reduce(
    (sum, sales) => sum + sales.totalSales,
    0.0
  );
  const salesYear = totalSales?.data?.map((sales) => sales.year);

  const chartOptions = {
    chart: {
      type: "area",
      height: 250,
      zoomType: null,
      enabled: true,
    },
    title: {
      text: null,
    },
    subtitle: {
      text: "",
      align: "left",
    },
    xAxis: {
      title: { text: "Year", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
      categories: salesYear,
    },
    yAxis: {
      opposite: true,
      title: { text: "Sales", style: { fontSize: "12px" } },
      labels: { style: { fontSize: "10px" } },
    },
    legend: {
      align: "left",
      verticalAlign: "bottom",
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          // rotation: -45,
          formatter: function () {
            return this.y.toLocaleString("en-IN");
          },
        },
      },
      area: {
        marker: {
          enabled: true,
        },
        lineWidth: 1,
      },
    },
    series: [
      {
        name: "Yearly sales",
        data: totalSales?.data.map((sales) => ({
          name: sales.year,
          y: sales.totalSales,
          year: sales.year,
        })),
        point: {
          events: {
            click: function () {
              const year = this.year;
              console.log("selected year ", year);

              dispatch(
                push({
                  id: "SalesDetail",
                  name: "SalesDetail",
                  component: "SalesDetail",
                  data: { selectedYear: year },
                })
              );
            },
          },
        },
      },
    ],
    tooltip: {
      useHTML: true,
      shared: true,
      formatter: function () {
        const value = this.y.toLocaleString("en-IN");

        return `
          <b>${this.point.year || this.key}</b><br />
          <span style="color:${this.series.color}">Total Sales</span>:
          <b>${value}</b>
        `;
      },
    },
  };

  if (isLoading)
    return (
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 4,
          textAlign: "center",
          ml: 1,
        }}
      >
        <CircularProgress />
      </Card>
    );

  if (isError)
    return (
      <Typography color="error" sx={{ p: 2 }}>
        Error: {error?.message || "Failed to load data"}
      </Typography>
    );

  return (
    <Card sx={{ borderRadius: 3, boxShadow: 4, width: "100%", ml: 1 }}>
      <CardHeader
        title="Sales Distribution"
        titleTypographyProps={{ sx: { fontSize: "1rem", fontWeight: 600 } }}
      />
      <CardContent>
        <HighchartsReact highcharts={Highcharts} options={chartOptions} />
        <Box
          sx={{
            p: 1,
            bgcolor: "background.default",
            borderRadius: 3,
            textAlign: "center",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            OverAll Sales : {sumTotal?.toLocaleString("en-IN")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SalesData;
