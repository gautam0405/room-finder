import { useNavigate } from "react-router-dom";
import mapImg from "../assets/back.png";
import bgImage from "../assets/image 2.jpg";
export default function Hero() {
  const navigate = useNavigate();

  return (
    <>

      {/* HERO SECTION */}
      <section
        className="hero flex min-h-screen flex-col items-start justify-center px-4 pb-20 pt-32 sm:px-12 lg:px-24 xl:px-40"
        style={{
          backgroundImage: `linear-gradient(90deg, rgba(2,6,23,0.78), rgba(15,23,42,0.52), rgba(15,23,42,0.18)), url(${bgImage})`,
          backgroundSize: "cover",
          backgroundPosition: "top center",
          backgroundRepeat: "no-repeat",
        }}
      >

        <div className="hero-left max-w-xl">
          <h1 className="text-4xl sm:text-5xl font-bold text-white">
            Find Your Perfect Room Easily
          </h1>

          <p className="text-white/80 mt-4">
            Search, compare, and book rooms instantly.
          </p>

          <div className="hero-buttons flex gap-4 mt-6">
            <button
              className="bg-white text-slate-950 px-6 py-3 rounded-lg hover:scale-105 transition-all"
              onClick={() => navigate("/search")}
            >
              Search Rooms
            </button>

            <button
              className="border border-white/70 px-6 py-3 rounded-lg text-white hover:scale-105 hover:bg-white hover:text-slate-950 transition-all"
              onClick={() => navigate("/add")}
            >
              Add Your Room
            </button>
          </div>
        </div>

      </section>

      {/* 🔥 MAP SECTION (Scroll ke baad) */}
      <section className="w-full py-16 px-4 sm:px-12 lg:px-24 xl:px-40 bg-white">

        <div className="flex flex-col lg:flex-row items-center gap-10">

          {/* LEFT IMAGE */}
          <div className="w-full lg:w-1/2">
            <img
              src={mapImg}
              alt="map"
              className="w-full rounded-xl shadow-lg"
            />
          </div>

          {/* RIGHT CONTENT */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Room Finder. Anywhere. Anytime.
            </h2>

            <p className="text-gray-500 mt-4">
              Find the perfect room in your favorite city.
            </p>

            <div className="flex gap-10 mt-6">
              <div>
                <h3 className="text-3xl font-bold text-blue-600">9+</h3>
                <p className="text-gray-500">Destinations</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-blue-600">1000+</h3>
                <p className="text-gray-500">Rooms</p>
              </div>
            </div>

          </div>

        </div>

      </section>

    </>
  );
}
