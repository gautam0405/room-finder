import { useState } from "react";
import RoomCard from "../components/RoomCard";

export default function SearchRoom() {
  const [filters, setFilters] = useState({
    location: "",
    rent: "",
    type: "",
    furnished: "",
  });

  const [rooms, setRooms] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    // 🔥 Dummy data (later backend se aayega)
    const dummyRooms = [
      {
        image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
        title: "Modern Room",
        location: "Bhopal",
        price: 4000,
      },
      {
        image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
        title: "Luxury Flat",
        location: "Indore",
        price: 8000,
      },
      {
        image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        title: "Single Room",
        location: "Delhi",
        price: 3000,
      },
    ];

    setRooms(dummyRooms);
  };

  return (
    <div className="min-h-screen px-6 pb-10 pt-32">
      <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">

      <h2 className="mb-6 text-center text-3xl font-bold text-slate-950">Search Rooms</h2>

      {/* 🔍 FILTERS */}
      <div className="flex w-full flex-col gap-4">

        <input
          name="location"
          placeholder="Location"
          className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          onChange={handleChange}
        />

        <input
          name="rent"
          placeholder="Max Rent"
          className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
          onChange={handleChange}
        />

        <select name="type" className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" onChange={handleChange}>
          <option value="">Room Type</option>
          <option value="single">Single</option>
          <option value="double">Double</option>
          <option value="1 Bhk">1 Bhk</option>
          <option value="2 Bhk">2 Bhk</option>
          <option value="2 Bhk">2 Bhk</option>
        </select>

        <button
          className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      </div>

      {/* 🏠 ROOM CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {rooms.map((room, index) => (
          <RoomCard key={index} {...room} />
        ))}
      </div>

    </div>
  );
}
