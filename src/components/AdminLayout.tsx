"use client";

import { useRouter, usePathname } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");
    if (isAdmin !== "true") {
      router.push("/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    router.push("/admin/login");
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-60 bg-white border-r px-6 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-green-600">almà</h2>
          <div>
            <div
              onClick={() => router.push("/admin/leads")}
              className={`cursor-pointer px-2 py-1 rounded text-sm font-medium ${
                pathname === "/admin/leads"
                  ? "bg-green-100 text-green-800"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Leads
            </div>
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm bg-gray-100 rounded hover:bg-gray-200"
          >
            <div className="w-6 h-6 rounded-full bg-gray-400 text-white text-center text-xs leading-6">
              A
            </div>
            <span className="flex-1 text-left">Admin</span>
          </button>

          {showMenu && (
            <div className="absolute bottom-12 left-0 w-full bg-white border rounded shadow text-sm">
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 bg-gray-50 p-6">{children}</div>
    </div>
  );
};

export default AdminLayout;
