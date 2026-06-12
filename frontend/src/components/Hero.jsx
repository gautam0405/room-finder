import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import mapImg from "../assets/back.png";

const heroSlides = [
  {
    src: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1800&q=85",
    alt: "Bright furnished apartment bedroom",
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1800&q=85",
    alt: "Modern student room with warm bedding",
  },
  {
    src: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1800&q=85",
    alt: "Clean apartment living space",
  },
  {
    src: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1800&q=85",
    alt: "Contemporary hostel room",
  },
  {
    src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=1800&q=85",
    alt: "Stylish compact apartment interior",
  },
];

export default function Hero() {
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide((currentSlide) => (currentSlide + 1) % heroSlides.length);
    }, 3000);

    return () => clearInterval(slideTimer);
  }, []);

  return (
    <>

      {/* HERO SECTION */}
      <section className="hero relative flex min-h-[86vh] overflow-hidden bg-slate-950 px-4 pb-16 pt-32 sm:px-12 lg:min-h-screen lg:px-24 xl:px-40">
        <div className="absolute inset-0">
          {heroSlides.map((slide, index) => (
            <img
              key={slide.src}
              src={slide.src}
              alt={slide.alt}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
                activeSlide === index ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/55 to-slate-950/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-slate-950/30" />

        <div className="hero-left relative z-10 flex max-w-2xl flex-col justify-center">
          

          <h1 className="text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect Room Easily
          </h1>

          <p className="mt-5 max-w-xl text-base leading-7 text-white/85 sm:text-lg">
            Search trusted stays, compare amenities, and choose a room that fits
            your budget, commute, and lifestyle.
          </p>

          <div className="hero-buttons mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              className="rounded-lg bg-white px-6 py-3 font-semibold text-slate-950 shadow-lg shadow-slate-950/20 transition-all hover:-translate-y-0.5 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={() => navigate("/search")}
            >
              Search Rooms
            </button>

            <button
              className="rounded-lg border border-white/70 bg-white/10 px-6 py-3 font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-950"
              onClick={() => navigate("/add")}
            >
              Add Your Room
            </button>
          </div>

          <div className="mt-10 flex gap-2" aria-label="Room image slideshow">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.src}
                type="button"
                className={`h-1.5 rounded-full transition-all ${
                  activeSlide === index ? "w-10 bg-white" : "w-4 bg-white/45"
                }`}
                aria-label={`Show slide ${index + 1}`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
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
