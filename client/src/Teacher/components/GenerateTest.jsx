import React ,{useState} from 'react'

const GenerateTest = () => {

    const [testName, setTestName] = useState('')
  return (
    
    <>

    Generate test
    <div className='flex flex-col'>
        <label>Test Name</label>
    <input type='text' placeholder='Enter test name' className='bg-white'>
    </input>
    
    </div>
    






    </>
  )
}

export default GenerateTest