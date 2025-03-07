import React from 'react'
import { Link } from 'react-router-dom'

const TeacherSidebar = () => {


    const navData = [{
        name: "Home",
        path: "/teacherlayout/teacher/subjects",
        icon: "fa-solid fa-house"
    }
,{
    name: "Tests",
    path: "/teacherlayout/teacher/getTests",
    icon: "fa-solid fa-house"

}
,{
    name: "Generate test",
    path: "/teacherlayout/teacher/generate-test",
    icon: "fa-solid fa-house"

}

]
  return (
    <div>
        

  

    <div className='flex flex-col items-center  h-screen bg-gray-200'>
        {
            navData.map((item, index) => (
                <Link key={index} to={item.path} style={{ color: "#000", textDecoration: "none" }}>
                    <i className={item.icon}></i>
                    {item.name}
                </Link>
            ))
        }
    </div>
    </div>
  )
}

export default TeacherSidebar