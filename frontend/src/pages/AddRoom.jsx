import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { getSessionUser } from "../utils/session";

const initialForm = {
  state: "",
  city: "",
  houseNo: "",
  location: "",
  rent: "",
  image: "",
  roomType: "",
  ownerMobile: "",
};

const roomTypeLabel = {
  single: "Single",
  double: "Double",
  "1bhk": "1 BHK",
  "2bhk": "2 BHK",
  "3bhk": "3 BHK",
};

const getErrorMessage = (error, fallbackMessage) => (
  error?.response?.data?.message
  || error?.response?.data?.error
  || error?.message
  || fallbackMessage
);

export default function AddRoom() {
  const user = getSessionUser();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    const nextValue = name === "ownerMobile" ? value.replace(/\D/g, "").slice(0, 10) : value;
    setForm((current) => ({ ...current, [name]: nextValue }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm((current) => ({ ...current, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      setMessage("");
      setError("");

      if (!/^\d{10}$/.test(form.ownerMobile.trim())) {
        setError("Owner mobile number must be exactly 10 digits");
        return;
      }

      const fullLocation = [
        form.houseNo.trim(),
        form.location.trim(),
        form.city.trim(),
        form.state.trim(),
      ].filter(Boolean).join(", ");

      const response = await api.post("/rooms", {
        title: `${roomTypeLabel[form.roomType] || "Room"} in ${form.city.trim()}`,
        rent: Number(form.rent),
        state: form.state.trim(),
        city: form.city.trim(),
        houseNo: form.houseNo.trim(),
        location: fullLocation,
        image: form.image || "",
        roomType: form.roomType,
        userMobile: form.ownerMobile.trim(),
        ownerName: user?.name || "Owner",
        ownerMobile: form.ownerMobile.trim(),
      });

      setMessage(response.data?.message || "Room submitted for approval");
      setForm(initialForm);
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to add room"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 pb-10 pt-32 sm:px-6">
      <div className="mx-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl shadow-slate-900/10 ring-1 ring-slate-200">
        <h2 className="mb-6 text-center text-3xl font-bold text-slate-950">Add Room</h2>

        {message ? (
          <p className="mb-4 rounded bg-green-100 p-3 text-center text-green-700">
            {message}
          </p>
        ) : null}

        {error ? (
          <p className="mb-4 rounded bg-red-100 p-3 text-center text-red-700">
            {error}
          </p>
        ) : null}

        <form className="flex w-full flex-col gap-4" onSubmit={handleSubmit}>
          <input
            name="state"
            placeholder="State"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={handleChange}
            required
            value={form.state}
          />

          <input
            name="city"
            placeholder="City"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={handleChange}
            required
            value={form.city}
          />

          <input
            name="houseNo"
            placeholder="Flat No / House No"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={handleChange}
            required
            value={form.houseNo}
          />

          <input
            name="location"
            placeholder="Location"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={handleChange}
            required
            value={form.location}
          />

          <input
            name="rent"
            placeholder="Rent"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            min="1"
            onChange={handleChange}
            required
            type="number"
            value={form.rent}
          />

          <div className="flex flex-col gap-2">
            <label className="text-gray-600 font-medium">Room Image</label>
            <input
              type="file"
              accept="image/*"
              className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-lg"
              onChange={handleImageChange}
            />
            {form.image && (
              <img src={form.image} alt="Preview" className="mt-2 h-40 w-full rounded-xl border object-cover" />
            )}
          </div>

          <select
            name="roomType"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            onChange={handleChange}
            required
            value={form.roomType}
          >
            <option value="">Room Type</option>
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="1bhk">1 BHK</option>
            <option value="2bhk">2 BHK</option>
            <option value="3bhk">3 BHK</option>
          </select>

          <input
            name="ownerMobile"
            placeholder="Owner 10-digit Mobile No"
            className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-lg outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
            inputMode="numeric"
            maxLength="10"
            onChange={handleChange}
            pattern="[0-9]{10}"
            required
            type="tel"
            value={form.ownerMobile}
          />

          <button className="rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 p-3 text-lg font-semibold text-white shadow-lg shadow-indigo-500/25 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading} type="submit">
            {loading ? "Adding..." : "Add Room"}
          </button>
        </form>
      </div>
    </div>
  );
}
