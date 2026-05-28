
import { useEffect, useMemo, useState } from 'react';
import api from '../services/api';
import { clearSession, getSessionUser } from '../utils/session';

const initialEmployeeForm = {
  name: '',
  email: '',
  password: '',
};

const getErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.message
  || error?.response?.data?.error
  || error?.message
  || fallbackMessage
);

const formatDate = (value) => {
  if (!value) return 'Not available';
  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const statusStyles = {
  pending: 'bg-amber-50 text-amber-700 ring-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 ring-rose-200',
  booked: 'bg-slate-100 text-slate-700 ring-slate-200',
};

function InfoLine({ label, value }) {
  return (
    <p className="text-sm text-slate-500">
      <span className="font-semibold text-slate-700">{label}:</span>{' '}
      {value || 'Not available'}
    </p>
  );
}

function RoomPanel({ room, busy, onModerate, onDelete, onViewImage }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      {room.image ? (
        <img src={room.image} alt={room.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-slate-100 text-sm font-medium text-slate-400">
          No image
        </div>
      )}

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-950">{room.title}</h3>
            <p className="mt-1 text-sm text-slate-500">Rs. {room.rent}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ${statusStyles[room.status] || 'bg-slate-100 text-slate-700 ring-slate-200'}`}>
            {room.status}
          </span>
        </div>

        <div className="mt-4 grid gap-1.5">
          <InfoLine label="Type" value={room.roomType} />
          <InfoLine label="City" value={room.city} />
          <InfoLine label="State" value={room.state} />
          <InfoLine label="Location" value={room.location} />
          <InfoLine label="Owner" value={room.ownerName} />
          <InfoLine label="Owner Mobile" value={room.ownerMobile} />
          <InfoLine label="Added By" value={room.createdBy?.name} />
          <InfoLine label="User ID" value={room.createdBy?._id} />
          <InfoLine label="Added Date" value={formatDate(room.createdAt)} />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-2">
          {room.image ? (
            <button
              className="col-span-2 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
              onClick={() => onViewImage(room.image, room.title)}
              type="button"
            >
              View Image
            </button>
          ) : null}
          <button
            className="rounded-xl bg-emerald-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || room.status === 'accepted'}
            onClick={() => onModerate(room._id, 'accepted')}
            type="button"
          >
            {busy ? 'Updating...' : 'Accept'}
          </button>
          <button
            className="rounded-xl bg-rose-600 px-3 py-3 text-sm font-bold text-white shadow-lg shadow-rose-500/20 transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy || room.status === 'rejected'}
            onClick={() => onModerate(room._id, 'rejected')}
            type="button"
          >
            {busy ? 'Updating...' : 'Reject'}
          </button>
          <button
            className="col-span-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={busy}
            onClick={() => onDelete(room._id)}
            type="button"
          >
            {busy ? 'Deleting...' : 'Delete Room'}
          </button>
        </div>
      </div>
    </article>
  );
}

function HistoryRow({ room, deleted = false, busy, onModerate, onDelete, onViewImage }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="grid gap-1">
          <h3 className="text-lg font-bold text-slate-950">{room.title}</h3>
          <InfoLine label="Rent" value={`Rs. ${room.rent}`} />
          <InfoLine label="Room Type" value={room.roomType} />
          <InfoLine label="City" value={room.city} />
          <InfoLine label="Location" value={room.location} />
          <InfoLine label={deleted ? 'Added By' : 'Added By'} value={deleted ? room.addedBy?.name : room.createdBy?.name} />
          <InfoLine label="User ID" value={deleted ? room.addedBy?._id : room.createdBy?._id} />
          <InfoLine label="Added Date" value={formatDate(deleted ? room.roomCreatedAt : room.createdAt)} />
          {deleted ? (
            <>
              <InfoLine label="Deleted By" value={room.deletedBy?.name} />
              <InfoLine label="Deleted Admin ID" value={room.deletedBy?._id} />
              <InfoLine label="Deleted Date" value={formatDate(room.createdAt)} />
            </>
          ) : null}
        </div>

        <div className="flex min-w-44 flex-wrap gap-2 lg:justify-end">
          {room.image ? (
            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
              onClick={() => onViewImage(room.image, room.title)}
              type="button"
            >
              View Image
            </button>
          ) : null}
          {!deleted ? (
            <>
              <button
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
                disabled={busy}
                onClick={() => onModerate(room._id, 'rejected')}
                type="button"
              >
                Mark Filled
              </button>
              <button
                className="rounded-xl border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-60"
                disabled={busy}
                onClick={() => onDelete(room._id)}
                type="button"
              >
                Delete
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardPage() {
  const user = getSessionUser();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [employeeForm, setEmployeeForm] = useState(initialEmployeeForm);
  const [employeeLoading, setEmployeeLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);
  const [employeesError, setEmployeesError] = useState('');
  const [employeeMessage, setEmployeeMessage] = useState('');
  const [employeeError, setEmployeeError] = useState('');
  const [lastEmployeeCredentials, setLastEmployeeCredentials] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [roomsError, setRoomsError] = useState('');
  const [deletedRooms, setDeletedRooms] = useState([]);
  const [deletedRoomsLoading, setDeletedRoomsLoading] = useState(true);
  const [deletedRoomsError, setDeletedRoomsError] = useState('');
  const [busyRoomId, setBusyRoomId] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [stats, setStats] = useState({
    totalCount: 0,
    pendingCount: 0,
    acceptedCount: 0,
    rejectedCount: 0,
  });

  const acceptedRooms = useMemo(
    () => rooms.filter((room) => room.status === 'accepted'),
    [rooms],
  );
  const pendingRooms = useMemo(
    () => rooms.filter((room) => room.status === 'pending'),
    [rooms],
  );

  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'employees', label: 'Employees' },
    { id: 'pending', label: 'Pending Rooms' },
    { id: 'accepted', label: 'Accepted Rooms' },
    { id: 'deleted', label: 'Deleted Rooms' },
    { id: 'rooms', label: 'All Rooms' },
  ];

  const statCards = [
    { label: 'Total Rooms', value: stats.totalCount, tone: 'from-indigo-500 to-violet-600' },
    { label: 'Accepted', value: stats.acceptedCount, tone: 'from-emerald-500 to-teal-600' },
    { label: 'Rejected', value: stats.rejectedCount, tone: 'from-rose-500 to-red-600' },
    { label: 'Pending', value: stats.pendingCount, tone: 'from-amber-400 to-orange-500' },
  ];

  const showDashboard = activeSection === 'dashboard';
  const showEmployees = activeSection === 'employees';
  const showPending = activeSection === 'pending';
  const showAccepted = activeSection === 'accepted';
  const showDeleted = activeSection === 'deleted';
  const showRooms = activeSection === 'rooms';

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

  const loadStats = async () => {
    try {
      const response = await api.get('/stats');
      setStats({
        totalCount: response.data?.totalCount || 0,
        pendingCount: response.data?.pendingCount || 0,
        acceptedCount: response.data?.acceptedCount || 0,
        rejectedCount: response.data?.rejectedCount || 0,
      });
    } catch (error) {
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const loadEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await api.get('/employees');
      setEmployees(response.data?.employees || response.data || []);
      setEmployeesError('');
    } catch (error) {
      setEmployeesError(getErrorMessage(error, 'Unable to load employees'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setEmployeesLoading(false);
    }
  };

  const loadDeletedRooms = async () => {
    try {
      setDeletedRoomsLoading(true);
      const response = await api.get('/rooms/deleted');
      setDeletedRooms(response.data?.deletedRooms || []);
      setDeletedRoomsError('');
    } catch (error) {
      setDeletedRoomsError(getErrorMessage(error, 'Unable to load deleted rooms'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setDeletedRoomsLoading(false);
    }
  };

  useEffect(() => {
    loadRooms();
    loadStats();
    loadEmployees();
    loadDeletedRooms();
  }, []);

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target;
    setEmployeeForm((current) => ({ ...current, [name]: value }));
  };

  const handleCreateEmployee = async (event) => {
    event.preventDefault();

    try {
      setEmployeeLoading(true);
      setEmployeeMessage('');
      setEmployeeError('');

      const response = await api.post('/create-employee', {
        name: employeeForm.name.trim(),
        email: employeeForm.email.trim(),
        password: employeeForm.password,
      });

      setEmployeeMessage(response.data?.message || 'Employee created successfully');
      setLastEmployeeCredentials({
        userId: employeeForm.email.trim(),
        password: employeeForm.password,
      });
      setEmployeeForm(initialEmployeeForm);
      await loadEmployees();
    } catch (error) {
      setEmployeeError(getErrorMessage(error, 'Unable to create employee'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setEmployeeLoading(false);
    }
  };

  const handleModerate = async (roomId, status) => {
    const previousRooms = rooms;

    try {
      setBusyRoomId(roomId);
      setRoomsError('');
      setRooms((currentRooms) =>
        currentRooms.map((room) =>
          room._id === roomId ? { ...room, status } : room
        )
      );

      await api.put(`/rooms/${roomId}/status`, { status });
      await Promise.all([loadRooms(), loadStats()]);
    } catch (error) {
      setRooms(previousRooms);
      setRoomsError(getErrorMessage(error, 'Unable to update room status'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setBusyRoomId('');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    try {
      setBusyRoomId(roomId);
      await api.delete(`/rooms/${roomId}`);
      await Promise.all([loadRooms(), loadStats(), loadDeletedRooms()]);
    } catch (error) {
      setRoomsError(getErrorMessage(error, 'Unable to delete room'));

      if (error.response?.status === 401) {
        handleLogout();
      }
    } finally {
      setBusyRoomId('');
    }
  };

  const handleViewImage = (src, title) => {
    setImagePreview({ src, title: title || 'Room image' });
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="border-b border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-72 lg:flex-col lg:overflow-y-auto lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between gap-4 lg:block">
            <div>
              <button className="text-2xl font-extrabold text-slate-950" type="button">
                Room<span className="text-indigo-600">Finder</span>
              </button>
              <p className="mt-1 text-sm text-slate-500">Admin management</p>
            </div>

            <button
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 lg:hidden"
              onClick={handleLogout}
              type="button"
            >
              Logout
            </button>
          </div>

          <div className="mt-6 rounded-2xl bg-gradient-to-br from-slate-950 to-indigo-950 p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-lg font-bold">
                {(user?.name || 'A').charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{user?.name || 'Admin'}</p>
                <p className="text-sm text-white/65">{user?.email || 'admin'}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6 flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`whitespace-nowrap rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  activeSection === item.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
                onClick={() => setActiveSection(item.id)}
                type="button"
              >
                {item.label}
              </button>
            ))}
          </nav>

          <button
            className="mt-6 hidden w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 lg:mt-auto lg:block"
            onClick={handleLogout}
            type="button"
          >
            Log out
          </button>
        </aside>

        <section className="flex-1 p-4 sm:p-6 lg:p-8">
          <header className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm font-bold uppercase tracking-wide text-indigo-600">
              Admin Dashboard
            </p>
            <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-950">
                  Welcome, {user?.name || 'Admin'}
                </h1>
                <p className="mt-2 text-slate-500">
                  Create employees, review room listings, and manage accepted or deleted rooms.
                </p>
              </div>
              <button
                className="w-fit rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:shadow-xl"
                onClick={() => setActiveSection('employees')}
                type="button"
              >
                Create Employee
              </button>
            </div>
          </header>

          {(showDashboard || showRooms || showPending || showAccepted || showDeleted) ? (
            <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((card) => (
                <div key={card.label} className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
                  <div className={`mb-5 h-2 w-16 rounded-full bg-gradient-to-r ${card.tone}`} />
                  <p className="text-sm font-semibold text-slate-500">{card.label}</p>
                  <p className="mt-2 text-4xl font-bold text-slate-950">{card.value}</p>
                </div>
              ))}
            </section>
          ) : null}

          <div className="mt-6 grid gap-6">
            {(showDashboard || showEmployees) ? (
              <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h2 className="text-xl font-bold text-slate-950">Create Employee</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Create employee login credentials for room verification.
                  </p>

                  {employeeMessage ? (
                    <p className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                      {employeeMessage}
                    </p>
                  ) : null}
                  {employeeError ? (
                    <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                      {employeeError}
                    </p>
                  ) : null}

                  <form className="mt-5 grid gap-4" onSubmit={handleCreateEmployee}>
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        name="name"
                        onChange={handleEmployeeChange}
                        required
                        value={employeeForm.name}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Email / User ID</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        name="email"
                        onChange={handleEmployeeChange}
                        required
                        type="email"
                        value={employeeForm.email}
                      />
                    </label>
                    <label>
                      <span className="mb-2 block text-sm font-semibold text-slate-700">Password</span>
                      <input
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                        minLength={6}
                        name="password"
                        onChange={handleEmployeeChange}
                        required
                        type="password"
                        value={employeeForm.password}
                      />
                    </label>
                    <button
                      className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={employeeLoading}
                      type="submit"
                    >
                      {employeeLoading ? 'Creating...' : 'Create Employee'}
                    </button>
                  </form>
                </div>

                <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                  <h2 className="text-xl font-bold text-slate-950">Employees</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Employee user ID is their email. Existing passwords are hidden.
                  </p>

                  {lastEmployeeCredentials ? (
                    <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-4">
                      <p className="font-bold text-indigo-950">New Employee Login</p>
                      <p className="mt-2 text-sm text-indigo-800">User ID: {lastEmployeeCredentials.userId}</p>
                      <p className="text-sm text-indigo-800">Password: {lastEmployeeCredentials.password}</p>
                    </div>
                  ) : null}

                  {employeesError ? (
                    <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                      {employeesError}
                    </p>
                  ) : null}
                  {employeesLoading ? <p className="mt-5 text-sm text-slate-500">Loading employees...</p> : null}
                  {!employeesLoading && employees.length === 0 ? <p className="mt-5 text-sm text-slate-500">No employees created yet.</p> : null}

                  <div className="mt-5 grid gap-3">
                    {employees.map((employee) => (
                      <div key={employee._id} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 p-4">
                        <div>
                          <p className="font-bold text-slate-950">{employee.name}</p>
                          <p className="text-sm text-slate-500">{employee.email}</p>
                        </div>
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold capitalize text-slate-600">
                          {employee.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            ) : null}

            {(showDashboard || showPending) ? (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-950">Pending Rooms</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review submitted rooms and approve or reject them.
                </p>
                {roomsLoading ? <p className="mt-5 text-sm text-slate-500">Loading pending rooms...</p> : null}
                {!roomsLoading && pendingRooms.length === 0 ? <p className="mt-5 text-sm text-slate-500">No pending rooms right now.</p> : null}
                <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {pendingRooms.map((room) => (
                    <RoomPanel
                      key={room._id}
                      busy={busyRoomId === room._id}
                      onDelete={handleDeleteRoom}
                      onModerate={handleModerate}
                      onViewImage={handleViewImage}
                      room={room}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {(showDashboard || showAccepted) ? (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-950">Accepted Rooms</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Rooms accepted by admin. Mark filled or delete when needed.
                </p>
                {roomsLoading ? <p className="mt-5 text-sm text-slate-500">Loading accepted rooms...</p> : null}
                {!roomsLoading && acceptedRooms.length === 0 ? <p className="mt-5 text-sm text-slate-500">No accepted rooms yet.</p> : null}
                <div className="mt-5 grid gap-4">
                  {acceptedRooms.map((room) => (
                    <HistoryRow
                      key={room._id}
                      busy={busyRoomId === room._id}
                      onDelete={handleDeleteRoom}
                      onModerate={handleModerate}
                      onViewImage={handleViewImage}
                      room={room}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {(showDashboard || showDeleted) ? (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-950">Deleted Rooms</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Deleted room history with user and admin details.
                </p>
                {deletedRoomsError ? (
                  <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {deletedRoomsError}
                  </p>
                ) : null}
                {deletedRoomsLoading ? <p className="mt-5 text-sm text-slate-500">Loading deleted rooms...</p> : null}
                {!deletedRoomsLoading && deletedRooms.length === 0 ? <p className="mt-5 text-sm text-slate-500">No deleted rooms yet.</p> : null}
                <div className="mt-5 grid gap-4">
                  {deletedRooms.map((room) => (
                    <HistoryRow
                      key={room._id}
                      deleted
                      onViewImage={handleViewImage}
                      room={room}
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {(showDashboard || showRooms) ? (
              <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <h2 className="text-xl font-bold text-slate-950">All Rooms</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review submitted rooms, accept valid listings, reject invalid ones, or delete filled rooms.
                </p>
                {roomsError ? (
                  <p className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">
                    {roomsError}
                  </p>
                ) : null}
                {roomsLoading ? <p className="mt-5 text-sm text-slate-500">Loading rooms...</p> : null}
                {!roomsLoading && rooms.length === 0 ? <p className="mt-5 text-sm text-slate-500">No rooms found.</p> : null}
                <div className="mt-5 grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                  {rooms.map((room) => (
                    <RoomPanel
                      key={room._id}
                      busy={busyRoomId === room._id}
                      onDelete={handleDeleteRoom}
                      onModerate={handleModerate}
                      onViewImage={handleViewImage}
                      room={room}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </section>
      </div>

      {imagePreview ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <h2 className="text-lg font-bold text-slate-950">{imagePreview.title}</h2>
              <button
                className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                onClick={() => setImagePreview(null)}
                type="button"
              >
                Close
              </button>
            </div>
            <div className="max-h-[78vh] overflow-auto bg-slate-100 p-4">
              <img
                src={imagePreview.src}
                alt={imagePreview.title}
                className="mx-auto max-h-[72vh] w-auto max-w-full rounded-2xl object-contain shadow-lg"
              />
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}

export default AdminDashboardPage;
