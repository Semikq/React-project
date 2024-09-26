import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Link } from 'react-router-dom';
import { AppBar, Box, Toolbar, IconButton, Typography, Avatar, CircularProgress} from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useUserQuery } from './Redux/api';

const Menu = React.forwardRef(({HideBurgerMenu, setHideBurgerMenu}, ref) =>{
  return <IconButton size="large" edge="start" color="inherit" aria-label="open drawer"   sx={{ mr: 2 }} onClick={() => setHideBurgerMenu(!HideBurgerMenu)}>
    <MenuIcon sx={{ width: 40, height: 40 }} />
  </IconButton>
})

function PrimarySearchAppBar({info}) {
  const [hideBurgerMenu, setHideBurgerMenu] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setHideBurgerMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <Box>
      <AppBar position="static" style={{ background: "#3F3F3F" }}>
        <Toolbar>
          <Menu HideBurgerMenu={hideBurgerMenu} setHideBurgerMenu={setHideBurgerMenu}/>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block', color: "white" } }}>CodePen</Typography>
          </Link>        
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <IconButton size="large" edge="end" aria-label="account of current user" aria-haspopup="true" color="inherit">
            <Link to={`/profile/${info._id}`} style={{ color: "white" }}>
              <Avatar alt={info.login} src={`/${info.avatar.url}`} />
            </Link>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {hideBurgerMenu && (
        <>
          <div className='burgerMenu' ref={menuRef}>
            <div className='triangle-up'></div>
            <div className='ListMenu'>
              <Link style={{ color: "red" }} className="attributesAuth line" to={`/create-project`} onClick={() => setHideBurgerMenu(false)}>Create Project</Link>
              <Link className="attributesAuth line" to='/' onClick={() => setHideBurgerMenu(false)}>All Project</Link>
              <Link className="attributesAuth line" to={`/profile/${info._id}`} onClick={() => setHideBurgerMenu(false)}>Profile</Link>
            </div>
          </div>
        </>
      )}
    </Box>
  );
}

export default function(){
  const id = useSelector(state => state.auth.payload.sub.id)
  const {isLoading, data} = useUserQuery({ _id: id })
  console.log(data)
  return isLoading ? <CircularProgress/> : <PrimarySearchAppBar info={data.UserFindOne}/>
}