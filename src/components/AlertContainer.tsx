import { Box } from "@mui/material";
import React from "react";

interface AlertContainerProps {
  children?: React.ReactNode;
  isDisplayAlert: boolean;
}
export default function AlertContainer({
  children,
  isDisplayAlert,
}: AlertContainerProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        // make sure it matchs the sidebar width
        left: { sm: 0, md: "240px" },
        right: 0,
        bottom: 5,
      }}
      className={`transition-all duration-300 ease-in-out ${
        isDisplayAlert ? "translate-y-0" : "translate-y-full"
      }`}
    >
      {isDisplayAlert && children}
    </Box>
  );
}
