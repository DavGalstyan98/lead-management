"use client";

import Link from "next/link";
import LeadFormPage from "@/app/public/lead-form/page";

const Home = () => (
  <div className="min-h-screen bg-white relative">
    <div className="absolute top-4 right-4">
      <Link
        href="/admin/login"
        className="bg-black text-white px-4 py-2 rounded hover:opacity-90 transition"
      >
        Login as Admin
      </Link>
    </div>

    <div className="max-w-3xl mx-auto pt-16 px-4">
      <LeadFormPage />
    </div>
  </div>
);

export default Home;
