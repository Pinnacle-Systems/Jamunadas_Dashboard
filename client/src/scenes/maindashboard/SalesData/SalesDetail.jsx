import { Box, Grid, Typography } from "@mui/material";
import { DropdownWithSearch } from "../../../input/inputcomponent";
import { useEffect, useState } from "react";
import { useGetTotalSalesQuery } from "../../../redux/service/jamunasDashboardService";
import MonthlySales from "./MonthlySales";
import TopSalesman from "./TopSalesman";
import TopProducts from "./TopProducts";

const SalesDetail = ({ selectedYear }) => {
  const [yearFilter, setYearFilter] = useState();
  const { data: totalSales } = useGetTotalSalesQuery();

  const yearFilterOptions = totalSales?.data?.map((sales) => ({
    year: sales.year,
    id: sales.year,
  }));

  useEffect(() => {
    if (selectedYear && !yearFilter) {
      setYearFilter(selectedYear);
    }
  }, [selectedYear, yearFilter]);

  return (
    <>
      <div
        className="mt-2"
        style={{
          position: "sticky",
          top: 30,
          zIndex: 50,
          backgroundColor: "white",
        }}
      >
        <Grid
          container
          spacing={0}
          sx={{
            backgroundColor: "white",
            color: "black",
            p: 0.5,
            borderBottom: "1px solid #afafaf",
            borderTop: "1px solid #afafaf",
          }}
        >
          <Grid item md={5}>
            <Box sx={{ p: 0 }}>
              <Typography
                variant="h4"
                sx={{ fontWeight: 600, textAlign: "start", mt: 0.5, ml: 1 }}
              >
                Overview of Sales Distribution - {yearFilter ?? selectedYear}
              </Typography>
            </Box>
          </Grid>

          <Grid item md={7}>
            <Grid container spacing={1}>
              <Grid item md={6}>
                <Grid container spacing={1}>
                  <Grid item md={4}>
                    <DropdownWithSearch
                      options={yearFilterOptions}
                      labelField={"year"}
                      label={""}
                      value={yearFilter}
                      setValue={setYearFilter}
                      className="mt-1"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>

      <Grid container spacing={1}>
        <Grid item xs={12} md={12}>
          <MonthlySales />
        </Grid>
        <Grid item xs={12} md={6}>
          <TopSalesman />
        </Grid>
         <Grid item xs={12} md={6}>
          <TopProducts />
        </Grid>
      </Grid>
    </>
  );
};

export default SalesDetail;
