export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white px-6 sm:px-12 lg:px-24 xl:px-40 py-12">

      {/* TOP SECTION */}
      <div className="flex flex-col lg:flex-row justify-between gap-10 border-b border-white pb-8">

        {/* LEFT */}
        <div>
          <h2 className="text-3xl font-bold">Room Finder</h2>
          <p className="mt-3 text-gray-300 max-w-md">
            Find rooms easily across multiple cities. Safe, fast and reliable platform for students and professionals.
          </p>
        </div>

        {/* RIGHT */}
        <div>
          <h2 className="text-xl font-semibold">
            Join our network and grow your business!
          </h2>

          <button className="mt-4 bg-white text-black px-6 py-2 rounded-lg hover:scale-105 transition">
            List your property
          </button>
        </div>

      </div>

      {/* BOTTOM SECTION */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 mt-8 text-sm">

        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-gray-300">
            <li>About Us</li>
            <li>Careers</li>
            <li>Blogs</li>
            <li>Support</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Explore</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Find Rooms</li>
            <li>Add Property</li>
            <li>Top Cities</li>
            <li>Offers</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Legal</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Safety</li>
            <li>Refund Policy</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-gray-300">
            <li>Email: support@roomfinder.com</li>
            <li>Phone: +91 9876543210</li>
            <li>India</li>
          </ul>
        </div>

      </div>

    </footer>
  );
}