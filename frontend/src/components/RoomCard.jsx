const statusClassName = {
  pending: 'status-pill status-pending',
  accepted: 'status-pill status-accepted',
  rejected: 'status-pill status-rejected',
};

const formatDate = (value) => {
  if (!value) {
    return 'Not available';
  }

  return new Date(value).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const roomTypeLabel = {
  single: 'Single Room',
  double: 'Double Room',
  '1bhk': '1 BHK',
  '2bhk': '2 BHK',
  '3bhk': '3 BHK',
};

function RoomCard({
  room,
  canDelete = false,
  canModerate = false,
  publicView = false,
  busy = false,
  onDelete,
  onModerate,
}) {
  if (publicView) {
    const directionQuery = encodeURIComponent(
      [room.houseNo, room.location, room.city, room.state].filter(Boolean).join(', ')
    );

    return (
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-900/10 transition hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-52 bg-slate-100">
          {room.image ? (
            <img
              alt={roomTypeLabel[room.roomType] || 'Room'}
              className="h-full w-full object-cover"
              src={room.image}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
              No image
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wide text-emerald-700 shadow">
            Available
          </span>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-indigo-600">
                {roomTypeLabel[room.roomType] || 'Room'}
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-950">
                {room.city || 'Room Location'}
              </h3>
            </div>
            <div className="rounded-xl bg-slate-950 px-3 py-2 text-right text-white">
              <p className="text-xs text-white/70">Rent</p>
              <p className="text-base font-bold">Rs. {room.rent}</p>
            </div>
          </div>

          <div className="mt-4 space-y-2 text-sm text-slate-600">
            {room.houseNo ? <p><strong className="text-slate-800">Flat / House:</strong> {room.houseNo}</p> : null}
            <p><strong className="text-slate-800">Location:</strong> {room.location}</p>
            {room.state ? <p><strong className="text-slate-800">State:</strong> {room.state}</p> : null}
            <p><strong className="text-slate-800">Owner:</strong> {room.ownerName || 'Owner'}</p>
            <p><strong className="text-slate-800">Owner Mobile:</strong> {room.ownerMobile}</p>
          </div>

          <a
            className="mt-5 flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 hover:shadow-xl"
            href={`https://www.google.com/maps/search/?api=1&query=${directionQuery}`}
            rel="noreferrer"
            target="_blank"
          >
            View Direction
          </a>
        </div>
      </article>
    );
  }

  return (
    <article className="room-card">
      {room.image ? (
        <img alt={room.title} className="room-card-image" src={room.image} />
      ) : (
        <div className="room-card-image room-card-image-placeholder">No image</div>
      )}

      <div className="room-card-body">
        <div className="room-card-head">
          <h3>{room.title}</h3>
          <span className={statusClassName[room.status] || 'status-pill'}>{room.status}</span>
        </div>

        <div className="room-card-details">
          <p><strong>Rent:</strong> Rs. {room.rent}</p>
          {room.roomType ? <p><strong>Room Type:</strong> {room.roomType}</p> : null}
          {room.houseNo ? <p><strong>Flat / House No:</strong> {room.houseNo}</p> : null}
          {room.city ? <p><strong>City:</strong> {room.city}</p> : null}
          {room.state ? <p><strong>State:</strong> {room.state}</p> : null}
          <p><strong>Location:</strong> {room.location}</p>
          <p><strong>User Mobile:</strong> {room.userMobile}</p>
          <p><strong>Owner Name:</strong> {room.ownerName}</p>
          <p><strong>Owner Mobile:</strong> {room.ownerMobile}</p>
          <p><strong>Added Date:</strong> {formatDate(room.createdAt)}</p>
          {room.createdBy ? (
            <>
              <p><strong>Added By:</strong> {room.createdBy.name || 'Unknown'}</p>
              <p><strong>User ID:</strong> {room.createdBy._id}</p>
              <p><strong>User Email:</strong> {room.createdBy.email || 'Not available'}</p>
            </>
          ) : null}
        </div>

        {canModerate || canDelete ? (
          <div className="card-actions">
            {canModerate ? (
              <>
                <button
                  className="button button-success"
                  disabled={busy || room.status === 'accepted'}
                  onClick={() => onModerate(room._id, 'accepted')}
                  type="button"
                >
                  {busy ? 'Updating...' : 'Accept'}
                </button>
                <button
                  className="button button-danger"
                  disabled={busy || room.status === 'rejected'}
                  onClick={() => onModerate(room._id, 'rejected')}
                  type="button"
                >
                  {busy ? 'Updating...' : room.status === 'accepted' ? 'Mark Filled / Reject' : 'Reject'}
                </button>
              </>
            ) : null}

            {canDelete ? (
              <button
                className="button button-danger"
                disabled={busy}
                onClick={() => onDelete(room._id)}
                type="button"
              >
                {busy ? 'Deleting...' : 'Delete'}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </article>
  );
}

export default RoomCard;
