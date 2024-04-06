import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { fetchData } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';


const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));


const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
  transition: theme.transitions.create('box-shadow', {
    duration: theme.transitions.duration.enteringScreen,
    easing: theme.transitions.easing.easeOut,
  }),
  '&:focus-within': {
    boxShadow: `0 4px 8px 0 ${alpha(theme.palette.common.black, 0.5)}`, // 加深阴影制造上浮效果
  },
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create(['width', 'border-bottom'], {
      duration: theme.transitions.duration.enteringScreen,
      easing: theme.transitions.easing.easeOut,
    }),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
      '&:focus': {
        width: '20ch', // 伸长
        borderBottom: '2px solid #FFC107', // 添加底部细线
      },
    },
  },
}));










function SeachInputBox() {
  const [focused, setFocused] = React.useState(false);
  const [inputVal, setInputVal] = React.useState("");
  const navigate = useNavigate();

  const handleKeyDown = (event:any) => {
    if (event.key === 'Enter') {
      // Perform search here
      fetchData(`/api/searchProjects?q=${inputVal}`, "", afterSearch);
    }
  };

  const afterSearch = async (values: any) => {
    navigate('/project-search-list', { state: { searchResultList: { values}, searchKeyword: {inputVal}} });
    return;
  };

  const handleInputChange = (event:any) => {
    setInputVal(event.target.value);
  };


  return <Search>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        inputProps={{ 'aria-label': 'search' }}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown} 
        value={inputVal}
      //   onFocus={() => setFocused(true)}
      //   onBlur={() => setFocused(false)}
      //   style={{
      //     // 根据 focused 状态动态调整宽度
      //     width: focused ? '40ch' : '20ch', // Adjust width dynamically
      //   }}
      />
    </Search>;
}

export default SeachInputBox;
