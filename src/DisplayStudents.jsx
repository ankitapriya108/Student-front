import React, { useState, useEffect } from "react";
import axios from "axios";

function DisplayStudents() {
    const [faculty, setFaculty] = useState("");
    const [faculties, setFaculties] = useState([]);
    const [students, setStudents] = useState([]);
    const [messageSaved,setMessageSaved] = useState("")
  
    useEffect(() => {
        fetchFaculties();
    }, []);
  
    async function fetchFaculties() {
        try {
            const response = await axios.get("http://localhost:3000/getFaculty");
            if (response.status === 200) {
                setFaculties(response.data);
            } else {
                console.log("Failed");
            }
        } catch (error) {
            console.error("Error", error);
        }
    }
  
    async function fetchStudents(faculty) {
        try {
            const response = await axios.get(
                `http://localhost:3000/getStudent?faculty=${faculty}`
            );
            if (response.status === 200) {
                setStudents(response.data);
            } else {
                console.log("Failed");
            }
        } catch (error) {
            console.error("Error", error);
        }
    }

    async function handleDeleteStudent(id) {
      try {
          const response = await axios.delete(`http://localhost:3000/deleteStudent/${id}`);
          if (response.status === 200) {
              console.log("Student deleted successfully");
              fetchStudents(faculty);
          } else {
              console.log("Failed to delete student");
          }
      } catch (error) {
          console.error("Error deleting student", error);
      }
  }
    return (
        <div className="wrapper max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
            <h1 className="text-2xl font-bold mb-6 text-center">Students-List</h1>
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700" htmlFor="faculty">
                    Select Faculty
                </label>
                <select
                    id="faculty"
                    value={faculty}
                    onChange={(e) => {
                        setFaculty(e.target.value);
                        fetchStudents(e.target.value);
                    }}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
                >
                    <option value="" disabled>Select faculty</option>
                    {faculties.map((faculty, index) => {
                        return faculty.facultyList.map((list, ind) => (
                            <option key={ind} value={list.name}>
                                {list.name}
                            </option>
                        ));
                    })}
                </select>
            </div>
            <div className="mt-6">
                {students.map((student) => (
                    student.students.map((item) => (
                        <li key={item.id} className="flex justify-between items-center mb-[2rem] p-4 bg-gray-100 rounded-lg">
                            {item.name}
                            <button
                                className="bg-red-500 text-white rounded-md px-2 py-1"
                                onClick={() => handleDeleteStudent(item.id)}
                            >
                                Delete
                            </button>
                        </li>
                    ))
                ))}
            </div>
        </div>
    );
}

export default DisplayStudents;
