import { Box, styled, useTheme } from "@mui/material";
import SimpleTable from "./SimpleTable";

import { Breadcrumb, SimpleCard } from "app/components";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";

// customer component
import CustomizedDialogs from "../dialog/CustomizedDialog";
import CustomizedExpansionPanels from "../expansion-panel/CustomizedExpansionPanel";
import PaginationTable from "./PaginationTable";
import Analytics from "app/views/dashboard/Analytics";
import DoughnutChart from "app/views/charts/echarts/Doughnut";
// STYLED COMPONENTS
const Container = styled("div")(({ theme }) => ({
  margin: "30px",
  [theme.breakpoints.down("sm")]: { margin: "16px" },
  "& .breadcrumb": {
    marginBottom: "30px",
    [theme.breakpoints.down("sm")]: { marginBottom: "16px" }
  }
}));

export default function AppTable() {
  const theme = useTheme();
  const { slug } = useParams();
  const [data, setData] = useState([]);

  const fetchContentByPath = async () => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_URL_BE
        }/api/navigations?populate=children&filters[children][path][$eq]=/material/${slug}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN}`
          }
        }
      );
      const responseData = await res.json();
      console.log("children", responseData);

      // Trích xuất danh sách `children` từ phản hồi và tìm phần tử có `path` trùng khớp
      const item = responseData?.data?.[0]?.attributes;
      const matchedChild = item?.children?.find((child) => child.path === `/material/${slug}`);

      // Lấy `content` của `children` nếu tìm thấy
      setData(matchedChild?.content || null);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  useEffect(() => {
    fetchContentByPath();
  }, []);
  console.log("data", data);

  return (
    <Container>
      <Box className="breadcrumb">
        <Breadcrumb routeSegments={[{ name: "Material", path: "/material" }, { name: "Table" }]} />
      </Box>

      {data === "CustomizedDialogs" && <CustomizedDialogs />}
      {data === "CustomizedExpansionPanels" && <CustomizedExpansionPanels />}
      {data === "DoughnutChart" && (
        <SimpleCard title="Doughnut Chart">
          <DoughnutChart
            height="350px"
            color={[
              theme.palette.primary.dark,
              theme.palette.primary.main,
              theme.palette.primary.light
            ]}
          />
        </SimpleCard>
      )}
      {data === "PaginationTable" && (
        <SimpleCard title="Pagination Table">
          <PaginationTable />
        </SimpleCard>
      )}
      {data === "Analytics" && <Analytics />}
    </Container>
  );
}
