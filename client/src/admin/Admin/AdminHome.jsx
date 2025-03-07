import React from 'react'
import Navbar from './Components/Navbar.jsx'
import AdminClass from './Pages/AdminClass.jsx'
const AdminHome = () => {
  return (
    <>
    <div className='container' style={{display:'flex', height:'100vh', width:'100vw' , justifyContent:'space-between'}}>


    <div className='Side-bar' style={{width:'20%', backgroundColor:'white', color:'white' , boxShadow:'0px 0px 10px 0px black'}}>  
    <Navbar/>



    </div>
    <div className='main-container'>
      
    </div>



    </div>




    </>
  )
}

export default AdminHome