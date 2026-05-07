import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { clearSession, getSessionUser } from '../utils/session';

const getErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.message
  || error?.response?.data?.error
  || error?.message
  || fallbackMessage
);

function EmployeeDashboardPage() {
  const user = getSessionUser();

  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState('');
  const [busyRoomId, setBusyRoomId] = useState('');

  // ✅ NEW STATES
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const loadRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await api.get('/rooms');
      setRooms(response.data?.rooms || []);
      setRoomsError('');
    } catch (error) {
      setRoomsError(getErrorMessage(error, 'Unable to load rooms'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setRoomsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // ✅ ACCEPT / REJECT / BOOKED
  const handleModerate = async (roomId, status) => {
    try {
      setBusyRoomId(roomId);
      await api.put(`/rooms/${roomId}`, { status });
      await loadRooms();
    } catch (error) {
      setRoomsError(getErrorMessage(error, 'Unable to update room status'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setBusyRoomId('');
    }
  };

  // ⭐ RATING (UI ONLY)
  const handleRating = async (roomId, rating) => {
    try {
      await api.put(`/rooms/${roomId}`, { rating });
      await loadRooms();
    } catch {
      alert("Rating failed ❌");
    }
  };

  // ✅ COUNTS
  const pendingCount = rooms.filter((room) => room.status === 'pending').length;
  const acceptedCount = rooms.filter((room) => room.status === 'accepted').length;
  const rejectedCount = rooms.filter((room) => room.status === 'rejected').length;

  return (
    <main className="page-shell" style={{ background: "#f5f6fa", minHeight: "100vh" }}>
      <DashboardHeader
        eyebrow="EMPLOYEE DASHBOARD"
        onLogout={handleLogout}
        subtitle="Review submitted rooms and update their approval status."
        title={`Welcome, ${user?.name || 'Employee'}`}
      />

      <section className="dashboard-grid">

        {/* 📊 STATS */}
        <div className="panel panel-span">
          <h2>Room Summary</h2>
          <div className="stats-grid">
            <div className="stat-box">
              <span>Pending</span>
              <strong>{pendingCount}</strong>
            </div>
            <div className="stat-box">
              <span>Accepted</span>
              <strong>{acceptedCount}</strong>
            </div>
            <div className="stat-box">
              <span>Rejected</span>
              <strong>{rejectedCount}</strong>
            </div>
          </div>
        </div>

        {/* 🔍 SEARCH */}
        <div className="panel panel-span">
          <input
            placeholder="Search by title or location..."
            onChange={(e) => setSearch(e.target.value)}
            style={{ padding: "8px", width: "100%", marginBottom: "10px" }}
          />

          {/* 🔘 FILTER */}
          <div>
            {["all", "pending", "accepted", "rejected"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  marginRight: "8px",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  border: "none",
                  background: filter === f ? "#333" : "#eee",
                  color: filter === f ? "#fff" : "#000",
                }}
              >
                {f.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* 🏠 ROOMS */}
        <div className="panel panel-span">
          <h2>All Rooms</h2>

          {roomsError && <p className="feedback feedback-error">{roomsError}</p>}
          {roomsLoading && <p>Loading rooms...</p>}

          <div
            className="room-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
              gap: "15px",
            }}
          >
            {rooms
              .filter((room) => {
                if (room.status === "booked") return false;

                const matchFilter =
                  filter === "all" || room.status === filter;

                const matchSearch =
                  room.title.toLowerCase().includes(search.toLowerCase()) ||
                  room.location.toLowerCase().includes(search.toLowerCase());

                return matchFilter && matchSearch;
              })
              .map((room) => (
                <div key={room._id}>

                  <RoomCard
                    busy={busyRoomId === room._id}
                    canModerate
                    onModerate={handleModerate}
                    room={room}
                  />

                  {/* ⭐ RATING */}
                  <div style={{ marginTop: "5px" }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        style={{
                          cursor: "pointer",
                          color: star <= (room.rating || 0) ? "gold" : "gray",
                          fontSize: "18px",
                        }}
                        onClick={() => handleRating(room._id, star)}
                      >
                        ★
                      </span>
                    ))}
                  </div>

                  {/* ✅ BOOK BUTTON */}
                  {room.status === "accepted" && (
                    <button
                      onClick={() => handleModerate(room._id, "booked")}
                      style={{
                        marginTop: "5px",
                        background: "green",
                        color: "#fff",
                        border: "none",
                        padding: "5px 10px",
                      }}
                    >
                      Mark as Booked
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>

      </section>
    </main>
  );
}

export default EmployeeDashboardPage;