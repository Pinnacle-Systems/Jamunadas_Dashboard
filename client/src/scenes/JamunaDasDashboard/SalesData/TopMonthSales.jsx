import React, { useCallback, useEffect, useMemo, useState } from "react";
import ReactECharts from "echarts-for-react";
import "echarts-liquidfill";

import {
  Card,
  CardHeader,
  CardContent,
  useTheme,
  Box,
  Typography,
} from "@mui/material";

import { useGetTopItemMonthQuery } from "../../../redux/service/jamunasDashboardService.js";
import FinYear from "../../../components/FinYear.js";
import TopMonthTable from "./TableData/TopMonthTable.jsx";
import SpinLoader from "../../../utils/spinLoader.js";

const TopMonthSales = ({
  yearFilter,
  setYearFilter,
  selectedCompany,
  finYrData,
  filterType,
  setFilterType,
}) => {
  const theme = useTheme();

  const [selectMonths, setSelectMonths] = useState("");
  const [showTable, setShowTable] = useState(false);
  const [tableParams, setTableParams] = useState(null);
  const [selectedYear, setSelectedYear] = useState(yearFilter || "");
  const [selectedfilterType, setSelectedFilterType] = useState(
    filterType || "ALL"
  );
  const [valueType, setValueType] = useState("value");

  useEffect(() => {
    setSelectedYear(yearFilter);
  }, [yearFilter]);

  useEffect(() => {
    setSelectedFilterType(filterType);
  }, [filterType]);

  const formatINR = (value) =>
    `₹ ${Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

  const formatQty = (value) =>
    Number(value).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const { data: response, isFetching, isLoading } =
    useGetTopItemMonthQuery(
      {
        params: {
          selectedYear,
          selectedCompany,
          selectMonths,
          type: selectedfilterType,
          valueType,
        },
      },
      { skip: !selectedYear || !selectedCompany || !selectMonths }
    );

  /* ---------- Single item data ---------- */
  const itemData = useMemo(() => {
    if (!Array.isArray(response?.data) || response.data.length === 0)
      return null;

    const item = response.data[0];

    return {
      itemName: item.itemName,
      value:
        valueType === "value"
          ? Number(item.totalSales)
          : Number(item.count),
      salesMonth: item.salesMonth,
      company: item.company,
      salesYear: item.salesYear,
      uom: item.uom,
    };
  }, [response, valueType]);

  /* ---------- Click handler ---------- */
  const handleOpenTable = useCallback(() => {
    if (!itemData) return;

    setTableParams({
      itemName: itemData.itemName,
      company: itemData.company,
      year: itemData.salesYear,
      month: itemData.salesMonth,
    });

    setShowTable(true);
  }, [itemData]);

  /* ---------- Max logic ---------- */
  const gaugeMax = useMemo(() => {
    if (!itemData || itemData.value <= 0) return 100;

    const v = itemData.value;
    const magnitude = Math.pow(10, Math.floor(Math.log10(v)));

    return Math.ceil(v / magnitude) * magnitude * 1.25;
  }, [itemData]);

  /* ---------- Liquid Fill Chart ---------- */
  const chartOption = useMemo(() => {
    const percent =
      itemData && gaugeMax ? itemData.value / gaugeMax : 0;

    return {
      series: [
        {
          type: "liquidFill",
          radius: "75%",
          center: ["50%", "55%"],

          data: [percent, percent * 0.9, percent * 0.8],

          color: ["#1976d2"],

          amplitude: 6,
          waveLength: "80%",

          outline: {
            show: true,
            borderDistance: 4,
            itemStyle: {
              borderWidth: 2,
              borderColor: "#1976d2",
            },
          },

          backgroundStyle: {
            color: "#e3f2fd",
          },

          label: {
            fontSize: 18,
            fontWeight: "bold",
            color: "#1976d2",
            formatter: () =>
              valueType === "value"
                ? formatINR(itemData?.value || 0)
                : `${formatQty(itemData?.value || 0)} ${
                    itemData?.uom || ""
                  }`,
          },
        },
      ],
    };
  }, [itemData, gaugeMax, valueType]);

  return (
    <Card sx={{ backgroundColor: "#f5f5f5", mt: 1, ml: 1 }}>
      <CardHeader
        title={`Top Item sold in ${selectMonths || ""}`}
        titleTypographyProps={{ sx: { fontSize: ".9rem", fontWeight: 600 } }}
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mr: 2 }}>
            <Box sx={{ width: 150 }}>
              <FinYear
                selectedYear={selectedYear}
                selectmonths={selectMonths}
                setSelectmonths={setSelectMonths}
                autoBorder={true}
              />
            </Box>
          </Box>
        }
        sx={{
          p: 1,
          borderBottom: `2px solid ${theme.palette.divider}`,
        }}
      />

      <CardContent
        sx={{
          position: "relative",
          minHeight: 420,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          pt: 2,
        }}
      >
        {(isLoading || isFetching) && (
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
          </div>
        )}

        <Box sx={{ width: "100%", maxWidth: 320 }}>
          <ReactECharts
            option={chartOption}
            style={{ height: 340 }}
            onEvents={{ click: handleOpenTable }}
          />
        </Box>

        {/* Item details */}
        {itemData && (
          <Box
            sx={{
              textAlign: "center",
              cursor: "pointer",
            }}
            onClick={handleOpenTable}
          >
            <Typography sx={{ fontWeight: 700 }}>
              {itemData.itemName}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "gray" }}>
              {itemData.salesMonth} · {itemData.company}
            </Typography>
          </Box>
        )}

        {!itemData && !isLoading && !isFetching && selectMonths && (
          <Typography>No data available</Typography>
        )}
      </CardContent>

      {showTable && tableParams && (
        <TopMonthTable
          year={tableParams.year}
          month={tableParams.month}
          item={tableParams.itemName}
          company={tableParams.company}
          itemOptions={[itemData?.itemName].filter(Boolean)}
          setSelectedYear={setSelectedYear}
          selectedYear={selectedYear}
          finYrData={finYrData}
          closeTable={() => {
            setShowTable(false);
            setTableParams(null);
            setSelectedYear(yearFilter);
            setSelectedFilterType(filterType);
            setValueType("value");
          }}
          selectMonths={selectMonths}
          setSelectMonths={setSelectMonths}
          selectedfilterType={selectedfilterType}
          setSelectedFilterType={setSelectedFilterType}
          valueType={valueType}
          setValueType={setValueType}
        />
      )}
    </Card>
  );
};

export default TopMonthSales;