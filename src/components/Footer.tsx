import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <Box sx={{ textAlign: "center" }}>
      <Typography variant="body1" color="text.secondary">
        BoxItAll &copy; {new Date().getFullYear()}
      </Typography>
    </Box>
  );
}
