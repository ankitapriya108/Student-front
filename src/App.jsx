
import React,{useState,createContext} from 'react'
import StudentForm from './StudentForm.jsx'
import Faculty from './Faculty.jsx'
import FacultyList from './FacultyList.jsx'
import ShowStudents from './ShowStudents.jsx';
import "./App.css"
export const attendanceContext = createContext()
import { v4 as uuid } from 'uuid';
import DisplayStudents from './DisplayStudents.jsx';
import ExportExcel from './ExportExcel.jsx';


function App() {

const [facultyList, setFacultyList] = useState([{ id: uuid(), name: ""}]);

  const [students,setStudents] = useState([{ id: "", name: "", aadharCard: "" }])

  const [faculty,setFaculty] = useState([""])


  return (
    <>
<attendanceContext.Provider value={{facultyList, setFacultyList,
students,setStudents, faculty,setFaculty
}}>
<Faculty/>
<StudentForm/>
 <FacultyList/>
<ShowStudents />
<ExportExcel/>
<DisplayStudents/>
</attendanceContext.Provider>

    </>
  )
}

export default App
