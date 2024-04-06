import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Container from "@mui/material/Container";
import Typography from "../items/Typography";
import { useNavigate } from "react-router-dom";
import { fetchData } from "../../services/apiService";

const ImageBackdrop = styled("div")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  background: "#000",
  opacity: 0.5,
  transition: theme.transitions.create("opacity"),
}));

const ImageIconButton = styled(ButtonBase)(({ theme }) => ({
  position: "relative",
  display: "block",
  padding: 0,
  borderRadius: 0,
  height: "40vh",
  [theme.breakpoints.down("md")]: {
    width: "100% !important",
    height: 100,
  },
  "&:hover": {
    zIndex: 1,
  },
  "&:hover .imageBackdrop": {
    opacity: 0.15,
  },
  "&:hover .imageMarked": {
    opacity: 0,
  },
  "&:hover .imageTitle": {
    border: "4px solid currentColor",
  },
  "& .imageTitle": {
    position: "relative",
    padding: `${theme.spacing(2)} ${theme.spacing(4)} 14px`,
  },
  "& .imageMarked": {
    height: 3,
    width: 18,
    background: theme.palette.common.white,
    position: "absolute",
    bottom: -2,
    left: "calc(50% - 9px)",
    transition: theme.transitions.create("opacity"),
  },
}));

const images = [
  {
    url: "https://images.unsplash.com/photo-1534081333815-ae5019106622?auto=format&fit=crop&w=400",
    title: "ARTS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1531299204812-e6d44d9a185c?auto=format&fit=crop&w=400",
    title: "TOYS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&w=400",
    title: "GAMES",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1453747063559-36695c8771bd?auto=format&fit=crop&w=400",
    title: "FILMS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1523309996740-d5315f9cc28b?auto=format&fit=crop&w=400",
    title: "OUTDOORS",
    width: "33%",
  },
  {
    url: "https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&w=400",
    title: "DIY",
    width: "33%",
  },
];

//use for topics searching page nivtation

// const navigate = useNavigate();
// const handleCategoryClick = (categoryId: string) => {
//   navigate('/project-list', { state: { categoryId: { categoryId} } });
// }

export default function ProductCategories() {
  const navigate = useNavigate();

  const afterSearch = async (values: any, inputVal: string) => {
    navigate("/project-search-list", {
      state: { searchResultList: { values }, searchKeyword: { inputVal } },
    });
    return;
  };

  const handleCategoryClick = (val: string) => {
    let modifiedTitle = val.toLowerCase();
    modifiedTitle = modifiedTitle.endsWith("s") ? modifiedTitle.slice(0, -1) : modifiedTitle;
    fetchData(`/api/searchProjects?q=${modifiedTitle}`, "", (values: any) =>
      afterSearch(values, val)
    );
  };

  return (
    <Container component="section" sx={{ mt: 8, mb: 4 }}>
      <Box sx={{ mt: 16, display: "flex", flexWrap: "wrap" }}>
        {images.map((image, index) => (
          <ImageIconButton
            key={image.title}
            style={{
              width: image.width,
            }}
          >
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                backgroundSize: "cover",
                backgroundPosition: "center 40%",
                backgroundImage: `url(${image.url})`,
              }}
            />
            <ImageBackdrop className="imageBackdrop" />
            <Box
              sx={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "common.white",
              }}
            >
              {/* T add a navigation to topic search */}
              {/* onClick={() => handleCategoryClick((index+1).toString())} */}
              <Typography
                component="h3"
                variant="h4"
                color="inherit"
                className="imageTitle"
                onClick={() =>
                  handleCategoryClick(image.title ?? "")
                }
              >
                {image.title}
                <div className="imageMarked" />
              </Typography>
            </Box>
          </ImageIconButton>
        ))}
      </Box>
    </Container>
  );
}
