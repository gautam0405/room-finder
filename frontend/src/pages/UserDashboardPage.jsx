import { useEffect, useState } from 'react';
import DashboardHeader from '../components/DashboardHeader';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { clearSession, getSessionUser } from '../utils/session';

const initialRoomForm = {
  title: '',
  rent: '',
  location: '',
  image: '',
  userMobile: '',
  ownerName: '',
  ownerMobile: '',
};

const getErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.message
  || error?.response?.data?.error
  || error?.message
  || fallbackMessage
);

function UserDashboardPage() {
  const user = getSessionUser();
  const [form, setForm] = useState(initialRoomForm);
  const [isOwner, setIsOwner] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState('');

  useEffect(() => {
    if (isOwner) {
      setForm((current) => ({
        ...current,
        ownerName: user?.name || '',
        ownerMobile: current.userMobile,
      }));
    }
  }, [isOwner, user?.name, form.userMobile]);

  const handleLogout = () => {
    clearSession();
    window.location.href = '/';
  };

  const loadRooms = async () => {
    try {
      setRoomsLoading(true);
      const response = await api.get('/rooms/mine');
      setRooms(response.data?.rooms || []);
      setRoomsError('');
    } catch (error) {
      setRoomsError(getErrorMessage(error, 'Unable to load your rooms'));

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

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    const nextValue = ['userMobile', 'ownerMobile'].includes(name)
      ? value.replace(/\D/g, '').slice(0, 10)
      : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSubmitLoading(true);
      setSubmitMessage('');
      setSubmitError('');

      if (!/^\d{10}$/.test(form.userMobile.trim()) || !/^\d{10}$/.test(form.ownerMobile.trim())) {
        setSubmitError('Mobile numbers must be exactly 10 digits');
        return;
      }

      const response = await api.post('/rooms', {
        title: form.title.trim(),
        rent: Number(form.rent),
        location: form.location.trim(),
        image: form.image.trim(),
        userMobile: form.userMobile.trim(),
        ownerName: form.ownerName.trim(),
        ownerMobile: form.ownerMobile.trim(),
      });

      setSubmitMessage(response.data?.message || 'Room created successfully');
      setForm(initialRoomForm);
      setIsOwner(false);
      await loadRooms();
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Unable to create room right now'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <DashboardHeader
        eyebrow="USER DASHBOARD"
        onLogout={handleLogout}
        subtitle="Create a room listing and track approval status."
        title={`Welcome, ${user?.name || 'User'}`}
      />

      <section className="dashboard-grid">
        <div className="panel">
          <h2>Create Room</h2>
          <p className="muted-text">All new rooms are submitted with pending status.</p>

          {submitMessage ? <p className="feedback feedback-success">{submitMessage}</p> : null}
          {submitError ? <p className="feedback feedback-error">{submitError}</p> : null}

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field">
              <span>Title</span>
              <input name="title" onChange={handleFormChange} required value={form.title} />
            </label>

            <label className="field">
              <span>Rent</span>
              <input min="1" name="rent" onChange={handleFormChange} required type="number" value={form.rent} />
            </label>

            <label className="field">
              <span>Location</span>
              <input name="location" onChange={handleFormChange} required value={form.location} />
            </label>

            <label className="field">
              <span>Image URL</span>
              <input name="image" onChange={handleFormChange} placeholder="Optional" value={form.image} />
            </label>

            <label className="field">
              <span>User Mobile</span>
              <input
                inputMode="numeric"
                maxLength={10}
                name="userMobile"
                onChange={handleFormChange}
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                required
                type="tel"
                value={form.userMobile}
              />
            </label>

            <label className="checkbox-row">
              <input
                checked={isOwner}
                onChange={(event) => setIsOwner(event.target.checked)}
                type="checkbox"
              />
              <span>I am the owner</span>
            </label>

            <label className="field">
              <span>Owner Name</span>
              <input
                disabled={isOwner}
                name="ownerName"
                onChange={handleFormChange}
                required
                value={form.ownerName}
              />
            </label>

            <label className="field">
              <span>Owner Mobile</span>
              <input
                disabled={isOwner}
                inputMode="numeric"
                maxLength={10}
                name="ownerMobile"
                onChange={handleFormChange}
                pattern="[0-9]{10}"
                required
                type="tel"
                value={form.ownerMobile}
              />
            </label>

            <button className="button button-primary" disabled={submitLoading} type="submit">
              {submitLoading ? 'Submitting...' : 'Submit Room'}
            </button>
          </form>
        </div>

        <div className="panel panel-span">
          <h2>My Rooms</h2>
          <p className="muted-text">See whether your rooms are pending, accepted, or rejected.</p>

          {roomsError ? <p className="feedback feedback-error">{roomsError}</p> : null}
          {roomsLoading ? <p className="muted-text">Loading your rooms...</p> : null}
          {!roomsLoading && rooms.length === 0 ? <p className="muted-text">No rooms created yet.</p> : null}

          <div className="room-grid">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default UserDashboardPage;
