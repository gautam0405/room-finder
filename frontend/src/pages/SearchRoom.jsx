import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import RoomCard from "../components/RoomCard";
import api from "../services/api";

const initialFilters = {
  location: "",
  rent: "",
  type: "",
};

export default function SearchRoom() {
  const locationState = useLocation();
  const [filters, setFilters] = useState(initialFilters);
  const [searchedFilters, setSearchedFilters] = useState(filters);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadApprovedRooms = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await api.get("/rooms/approved");
        setRooms(response.data?.rooms || []);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || "Unable to load approved rooms");
      } finally {
        setLoading(false);
      }
    };

    loadApprovedRooms();
  }, []);

  useEffect(() => {
    setFilters(initialFilters);
    setSearchedFilters(initialFilters);
    setHasSearched(false);
  }, [locationState.state?.resetAt]);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("search-results-visibility", {
        detail: { visible: hasSearched },
      })
    );

    return () => {
      window.dispatchEvent(
        new CustomEvent("search-results-visibility", {
          detail: { visible: false },
        })
      );
    };
  }, [hasSearched]);

  const handleChange = (event) => {
    setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSearch = () => {
    setSearchedFilters(filters);
    setHasSearched(true);
  };

  const filteredRooms = useMemo(() => {
    const location = searchedFilters.location.trim().toLowerCase();
    const maxRent = Number(searchedFilters.rent);
    const type = searchedFilters.type.trim().toLowerCase();

    return rooms.filter((room) => {
      const roomLocation = `${room.location || ""} ${room.city || ""} ${room.state || ""}`.toLowerCase();
      const matchesLocation = !location || roomLocation.includes(location);
      const matchesRent = !maxRent || Number(room.rent) <= maxRent;
      const matchesType = !type || String(room.roomType || "").toLowerCase() === type;

      return matchesLocation && matchesRent && matchesType;
    });
  }, [rooms, searchedFilters]);

  return (
    <div className="min-h-screen px-6 pb-10 pt-32">
      {!hasSearched ? (
        <div className="mx-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-xl shadow-slate-900/10 backdrop-blur">
          <h2 className="mb-6 text-center text-3xl font-bold text-slate-950">Search Rooms</h2>

          <div className="flex w-full flex-col gap-4">
            <input
              name="location"
              placeholder="Location"
              className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              onChange={handleChange}
              value={filters.location}
            />

            <input
              name="rent"
              placeholder="Max Rent"
              className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              min="1"
              onChange={handleChange}
              type="number"
              value={filters.rent}
            />

            <select
              name="type"
              className="rounded-xl border border-slate-200 p-3 text-lg outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              onChange={handleChange}
              value={filters.type}
            >
              <option value="">Room Type</option>
              <option value="single">Single</option>
              <option value="double">Double</option>
              <option value="1bhk">1 BHK</option>
              <option value="2bhk">2 BHK</option>
              <option value="3bhk">3 BHK</option>
            </select>

            <button
              className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
              onClick={handleSearch}
              type="button"
            >
              Search
            </button>
          </div>
        </div>
      ) : null}

      {hasSearched && loading ? (
        <p className="mt-8 text-center text-slate-500">Loading approved rooms...</p>
      ) : null}

      {hasSearched && error ? (
        <p className="mt-8 rounded-xl bg-red-50 p-4 text-center font-medium text-red-700">{error}</p>
      ) : null}

      {hasSearched && !loading && !error && filteredRooms.length === 0 ? (
        <p className="mt-8 text-center text-slate-500">No approved rooms found.</p>
      ) : null}

      {hasSearched ? (
        <div className="mt-2 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <RoomCard key={room._id} publicView room={room} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
