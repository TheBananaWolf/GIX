import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import { useNavigate } from "react-router-dom";

// export type AppAppBarProps = {
//   cateNameList: any[];
// };

const SiteMap = () => {
  const navigate = useNavigate();
  const handleCategoryClick = (categoryId: String) => {
    navigate("/project-list", { state: { categoryId: { categoryId: categoryId } } });
  };

  return (
    <Box
      component="footer"
      sx={{ bgcolor: "background.paper", py: 6 }}
      data-testid="side-map"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} justifyContent="space-between">
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Find
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              <li>
                <Link
                  variant="subtitle1"
                  color="text.secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick("1")}
                >
                  Arts
                </Link>
              </li>
              <li>
                <Link
                  variant="subtitle1"
                  color="text.secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick("2")}
                >
                  Comics & Illustration
                </Link>
              </li>
              <li>
                <Link
                  variant="subtitle1"
                  color="text.secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick("3")}
                >
                  Design & Tech
                </Link>
              </li>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Find
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              <li>
                <Link
                  variant="subtitle1"
                  color="text.secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick("4")}
                >
                  Film
                </Link>
              </li>
              <li>
                <Link
                  variant="subtitle1"
                  color="text.secondary"
                  style={{ cursor: "pointer" }}
                  onClick={() => handleCategoryClick("5")}
                >
                  Food & Craft
                </Link>
              </li>
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Box component="ul" sx={{ m: 0, p: 0, listStyle: "none" }}>
              <li>
                <Link
                  href="https://www.mit.edu/"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.mit.edu/"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Career
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.mit.edu/"
                  variant="subtitle1"
                  color="text.secondary"
                >
                  Contact Info
                </Link>
              </li>
            </Box>
          </Grid>
          {/* Repeat for other sections */}
        </Grid>
        {/* <Box sx={{ borderTop: (theme) => `1px solid ${theme.palette.divider}`, mt: 8, py: [3, 6] }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © 2024 Apple Inc. All rights reserved.
          </Typography>
        </Box> */}
      </Container>
    </Box>
  );
};

export default SiteMap;
