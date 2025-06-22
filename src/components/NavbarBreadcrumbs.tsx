import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import { Link, useLocation } from "react-router";
import getBreadcrumbs, { pathDictionary } from "../utils/breadcrumbsUtils";

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

export default function NavbarBreadcrumbs() {
  const location = useLocation();
  const breadcrumbs = getBreadcrumbs(location.pathname, pathDictionary);

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((breadcrumb) => (
        <div key={breadcrumb.pathName}>
          <Link to={breadcrumb.pathName}>
            <Typography
              variant="body1"
              key={breadcrumb.pathName}
              sx={{
                color: breadcrumb.isActive ? "text.primary" : "text.secondary",
                fontWeight: breadcrumb.isActive ? 600 : 400,
              }}
            >
              {breadcrumb.name}
            </Typography>
          </Link>
        </div>
      ))}
    </StyledBreadcrumbs>
  );
}
