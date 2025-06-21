import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import { Settings } from "@mui/icons-material";

interface CustomCardManageProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export default function CustomCardManage({
  title,
  description,
  icon,
  action,
}: CustomCardManageProps) {
  return (
    <Card>
      <CardContent>
        <Stack direction="row" spacing={4} justifyContent="space-between">
          <Stack direction="row" spacing={2} alignItems="center">
            {icon}
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
