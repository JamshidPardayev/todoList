import React, { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
const countries = ["Uzbekistan", "USA", "UK", "Germany", "Russia"];

export default function Todo() {
  const [students, setStudents] = useState(() => {
    const data = localStorage.getItem("students");
    return data ? JSON.parse(data) : [];
  });

  const [form, setForm] = useState({
    name: "",
    surname: "",
    date: "",
    ball: "",
    country: "",
  });

  const [filterType, setFilterType] = useState("name");
  const [searchTerm, setSearchTerm] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    localStorage.setItem("students", JSON.stringify(students));
  }, [students]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedForm = {
      ...form,
      name: form.name.trim(),
      surname: form.surname.trim(),
      country: form.country.trim(),
    };

    const ballValue = Number(trimmedForm.ball);

    if (!trimmedForm.name || !trimmedForm.surname || !trimmedForm.country || !trimmedForm.date) {
      return toast.error("Iltimos, barcha maydonlarni to‘ldiring.");
    }

    if (isNaN(ballValue) || ballValue < 0 || ballValue > 100) {
      return toast.error("Ball 0 dan 100 gacha bo‘lishi kerak.");
    }

    if (editId) {
      const updated = students.map((student) =>
        student.id === editId ? { ...trimmedForm, id: editId } : student
      );
      setStudents(updated);
      setEditId(null);
      toast.success("Student updated!");
    } else {
      const newStudent = { ...trimmedForm, id: uuidv4() };
      setStudents([...students, newStudent]);
      toast.success("Student added!");
    }

    setForm({ name: "", surname: "", date: "", ball: "", country: "" });
  };

  const handleDelete = (id) => {
    const filtered = students.filter((s) => s.id !== id);
    setStudents(filtered);
    toast.success("Student deleted!");
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditId(student.id);
    toast("Editing student...");
  };

  const filteredStudents = students
    .filter((student) =>
      student[filterType]?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((student) =>
      countryFilter ? student.country === countryFilter : true
    )
    .sort((a, b) => b.ball - a.ball);

  return (
    <div className="max-w-[700px] mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Student Manager</h1>
      <Toaster position="top-right" reverseOrder={false} />

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-white p-4 rounded-lg shadow-[0px_2px_8px_3px_#9c5ada]"
      >
        <input
          type="text"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          className="border border-violet-700 shadow-[0px_2px_8px_3px_#9c5ada] outline-none text-violet-700 p-2 rounded"
        />
        <input
          type="text"
          placeholder="Surname"
          value={form.surname}
          onChange={(e) => setForm({ ...form, surname: e.target.value })}
          required
          className="border border-violet-700 shadow-[0px_2px_8px_3px_#9c5ada] outline-none text-violet-700 p-2 rounded"
        />
        <input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
          className="border border-violet-700 shadow-[0px_2px_8px_3px_#9c5ada] outline-none text-violet-700 p-2 rounded"
        />
        <input
          type="number"
          placeholder="Ball (0-100)"
          value={form.ball}
          onChange={(e) => setForm({ ...form, ball: e.target.value })}
          required
          className="border border-violet-700 shadow-[0px_2px_8px_3px_#9c5ada] outline-none text-violet-700 p-2 rounded"
        />
        <select
          value={form.country}
          onChange={(e) => setForm({ ...form, country: e.target.value })}
          required
          className="col-span-2 border p-2 rounded border-violet-700 shadow-[0px_2px_8px_3px_#9c5ada] text-violet-700 outline-none"
        >
          <option value="">Select Country</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <button
          type="submit"
          className="col-span-2 bg-violet-600 text-white py-2 rounded hover:bg-violet-800 border border-violet-900 duration-300 cursor-pointer"
        >
          {editId ? "Update" : "Add"} Student
        </button>
      </form>

      <div className="mt-6 space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder={`Search by ${filterType}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded w-full shadow-[0px_2px_8px_3px_#9c5ada] border-violet-700 outline-none bg-white text-violet-900"
          />
          <label>
            <input
              type="radio"
              value="name"
              checked={filterType === "name"}
              onChange={(e) => setFilterType(e.target.value)}
            />{" "}
            Name
          </label>
          <label>
            <input
              type="radio"
              value="surname"
              checked={filterType === "surname"}
              onChange={(e) => setFilterType(e.target.value)}
            />{" "}
            Surname
          </label>
        </div>

        <select
          value={countryFilter}
          onChange={(e) => setCountryFilter(e.target.value)}
          className="border p-2 rounded w-full shadow-[0px_2px_8px_3px_#9c5ada] border-violet-700 outline-none bg-white text-violet-900"
        >
          <option value="">All Countries</option>
          {countries.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto mt-6">
        <table className="min-w-[700px] border text-center shadow-[0px_2px_8px_3px_#9c5ada] border-violet-700 outline-none bg-white text-violet-900">
          <thead className="bg-gray-200 text-black h-[30px]">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Surname</th>
              <th>Date</th>
              <th>Ball</th>
              <th>Country</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((s, i) => (
              <tr key={s.id} className="border-t h-[40px]">
                <td>{i + 1}</td>
                <td>{s.name}</td>
                <td>{s.surname}</td>
                <td>{s.date}</td>
                <td>{s.ball}</td>
                <td>{s.country}</td>
                <td className="space-x-2">
                  <button
                    onClick={() => handleEdit(s)}
                    className="bg-green-500 hover:bg-green-700 duration-300 py-1 px-3 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-500 hover:bg-red-700 duration-300 py-1 px-3 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
