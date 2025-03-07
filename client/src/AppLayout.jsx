import React from 'react'
import Sidebar from './Teacher/components/Sidebar'
import { Outlet } from 'react-router-dom'
import TeacherSidebar from './Teacher/components/TeacherSidebar'

const AppLayout = () => {
  return (
    <>
 {/* <div className='flex   w-screen h-screen'>
      <TeacherSidebar />
      <div className='flex-1 bg-amber-700'>
        <Outlet />
      </div>
      </div> */}

      <div className='h-full flex'>
        <div className='w-1/6 md:w-[8%] lg:w-[16%] xl:w-[14%] bg-gray-200 '>
        <TeacherSidebar/>
        </div>
        <div className='w-5/6 md:w-[92%] lg:w-[84%] xl:w-[86%] bg-gray-500'>
        <Outlet />
        </div>
      </div> 

        
    </>
  )
}

export default AppLayout