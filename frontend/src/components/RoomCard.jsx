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

function RoomCard({
  room,
  canDelete = false,
  canModerate = false,
  busy = false,
  onDelete,
  onModerate,
}) {
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
