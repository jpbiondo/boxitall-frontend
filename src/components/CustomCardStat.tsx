import {
  Box,
  Card,
  CardContent,
  ColorRange,
  Stack,
  Typography,
} from "@mui/material";

interface CustomCardStatProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  colorRange: ColorRange;
}

export default function CustomCardStat({
  title,
  value,
  icon,
  colorRange,
}: CustomCardStatProps) {
  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
        >
          <Stack direction="column">
            <Typography fontWeight={600} color="text.secondary">
              {title}
            </Typography>
            <Typography fontWeight={600} color="text.primary" fontSize={32}>
              {value}
            </Typography>
          </Stack>
          <Stack direction="column" alignItems="center" justifyContent="center">
            <Box
              sx={{
                padding: 1,
                color: colorRange[500],
              }}
            >
              {icon}
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
