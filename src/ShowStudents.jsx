
import React, { useState, useEffect } from "react";
import axios from "axios";

function ShowStudents() {
  const [faculty, setFaculty] = useState("");
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [messageSaved, setMessageSaved] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

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
        const initialAttendance = {};
        response.data.map((std) => {
          std.students.map((student) => {
            initialAttendance[student.id] = { name: student.name, status: "A" };
          });
        });
        setAttendance(initialAttendance);
      } else {
        console.log("Failed");
      }
    } catch (error) {
      console.error("Error", error);
    }
  }

  function toggleAttendance(studentId) {
    setAttendance((prevAttendance) => ({
      ...prevAttendance,
      [studentId]: {
        ...prevAttendance[studentId],
        status: prevAttendance[studentId].status === "A" ? "P" : "A",
      },
    }));
  }

  async function submitAttendance() {
    try {
      const response = await axios.post("http://localhost:3000/saveAttendance", {
        faculty,
        date: selectedDate,
        attendance: attendance,
      });
      if (response.status === 200) {
        setMessageSaved("Attendance submitted successfully!!!");
      } else {
        setMessageSaved("Failed!!!");
      }
    } catch (error) {
      setMessageSaved("Error submitting attendance");
    }
  }

  return (
    <div className="wrapper max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Faculty Students</h1>
      <div className="mt-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="faculty"
        >
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
          <option value="" disabled>
            Select faculty
          </option>
          {faculties.map((faculty, index) => {
            return faculty.facultyList.map((list, ind) => {
              return (
                <option key={ind} value={list.name}>
                  {list.name}
                </option>
              );
            });
          })}
        </select>
      </div>

      <div className="mt-4">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="date"
        >
          Select Date
        </label>
        <input
          type="date"
          id="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm"
        />
      </div>

      <div className="mt-6">
        {students.map((student) => {
          return student.students.map((item) => {
            return (
              <li
                key={item.id}
                className="text-gray-800 border-2 border-gray-200 px-2 py-1 rounded-sm"
              >
                {item.name}
                <button
                  onClick={() => toggleAttendance(item.id)}
                  className="ml-4 px-3 py-1 border rounded-md bg-gray-200"
                >
                  {attendance[item.id]?.status || "A"}
                </button>
              </li>
            );
          });
        })}
      </div>
      <button
        type="submit"
        className="bg-green-600 text-white mt-4 flex justify-center m-auto items-center py-2 px-4 text-sm font-medium rounded-md"
        onClick={submitAttendance}
      >
        Save Attendance
      </button>
      {messageSaved && (
        <div className="mt-4 p-4 text-center text-green-500 font-bold text-xl rounded-md">
          {messageSaved}
        </div>
      )}
    </div>
  );
}

export default ShowStudents;
