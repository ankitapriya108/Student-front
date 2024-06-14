import React, { useState, useEffect } from "react";
import axios from "axios";

function StudentForm() {
  const [studentsData, setStudentsData] = useState([{ id: Date.now(), name: "", aadharCard: "" }]);
  const [faculty, setFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchFaculties();
  }, []);

  async function fetchFaculties() {
    try {
      const response = await axios.get("http://localhost:3000/getFaculty");
      if (response.status === 200) {
        const flattenedFaculties = response.data.reduce(
          (acc, obj) => acc.concat(obj.facultyList),
          []
        );
        setFaculties(flattenedFaculties);
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.error("error", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/saveStudent", {
        students: studentsData,
        faculty,
      });
      if (response.status === 200) {
        setMessage("Students added successfully!");
        setStudentsData([{ id: Date.now(), name: "", aadharCard: "" }]);
        setFaculty("");
      } else {
        setMessage("Failed");
      }
    } catch (error) {
      console.error("error", error);
      setMessage("error");
    }
  }

  const handleInputChange = (ind, e) => {
    const { name, value } = e.target;
    const updatedStudentsData = [...studentsData];
    updatedStudentsData[ind][name] = value;
    setStudentsData(updatedStudentsData);
  };

  const handleAddStudent = () => {
    setStudentsData([...studentsData, { id: Date.now(), name: "", aadharCard: "" }]);
  };

  return (
    <div className="wrapper max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Add Students</h1>
      <form onSubmit={handleSubmit}>
        {studentsData.map((student, ind) => (
          <div className="student-entry" key={student.id}>
            <div>
              <label className="block text-sm font-medium text-gray-700" htmlFor="">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={student.name}
                onChange={(e) => handleInputChange(ind, e)}
                required
                className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
            <div className="my-4">
              <label htmlFor="">Aadhaar Card Number</label>
              <input
                type="text"
                name="aadharCard"
                value={student.aadharCard}
                onChange={(e) => handleInputChange(ind, e)}
                required
                className="mt-1 mb-4 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddStudent}
          className="bg-green-600 text-white mt-4 flex justify-center m-auto items-center py-2 px-4 text-sm font-medium rounded-md"
        >
          Add Student
        </button>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="faculty">
            Select Faculty
          </label>
          <select
            id="faculty"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
          >
            <option value="" disabled>
              Select faculty
            </option>
            {faculties.map((teacher) => (
              <option key={teacher._id} value={teacher.name}>
                {teacher.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="bg-green-600 text-white mt-4 flex justify-center m-auto items-center py-2 px-4 text-sm font-medium rounded-md"
          type="submit"
        >
          Save Students
        </button>
      </form>
      {message && (
        <div className="mt-4 p-4 text-center text-green-500 font-bold text-xl rounded-md">
          {message}
        </div>
      )}
    </div>
  );
}

export default StudentForm;