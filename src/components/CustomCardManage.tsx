import {
  Box,
  Button,
  Card,
  CardContent,
  ColorRange,
  Stack,
  Typography,
} from "@mui/material";
import { Settings } from "@mui/icons-material";

interface CustomCardManageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  colorRange: ColorRange;
}

export default function CustomCardManage({
  title,
  description,
  icon,
  action,
  colorRange,
}: CustomCardManageProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                backgroundColor: colorRange[100],
                borderRadius: 1,
                padding: 1,
                color: colorRange[500],
              }}
            >
              {icon}
            </Box>
            <Stack direction="column">
              <Typography variant="h6">{title}</Typography>
              <Typography>{description}</Typography>
            </Stack>
          </Stack>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Settings />}
            onClick={action}
          >
            Gestionar
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
