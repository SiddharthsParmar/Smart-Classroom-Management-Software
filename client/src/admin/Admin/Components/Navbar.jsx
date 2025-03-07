import React from 'react'
import { NavLink } from 'react-router-dom'

const Navbar = () => {

  const NavData = [
    {
      title: 'Home',
      path: '/home'
    },
    {
      title: 'Class',
      path: '/class'      
    },
    {
      title: 'Teacher',
      path: '/teacher' 
    },
    {
      title: 'Student',
      path: '/student' 
    }
  ];

  return (
    <>
      <div className='navbar'>
        <div className='navbar__logo'>Logo</div>
        <div className='navbar__menu'>
          {
            NavData.map((item, index) => {
              return (
                <NavLink to={item.path} key={index}>{item.title}</NavLink>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

export default Navbar