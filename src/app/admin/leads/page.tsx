"use client";

import { useEffect, useState } from "react";
import AdminLayout from "@/components/AdminLayout";
import { supabase } from "@/utils/supabase";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  linkedIn: string;
  visas: string[];
  resume: string;
  additionalInfo: string;
  status: "PENDING" | "REACHED_OUT";
  submittedAt: string;
  country: string;
}

const AdminLeadsPage = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeads = async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("submitted_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      } else {
        setLeads(
          data?.map((item) => ({
            ...item,
            submittedAt: item.submitted_at,
            firstName: item.first_name,
            lastName: item.last_name,
          })) as Lead[],
        );
      }

      setLoading(false);
    };

    (async () => {
      await loadLeads();
    })();
  }, []);

  const markAsReachedOut = async (id: string) => {
    await fetch("/api/leads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: "REACHED_OUT" } : lead,
      ),
    );
  };

  if (loading) return <p className="text-center mt-10">Loading leads...</p>;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto py-10 px-4">
        <h1 className="text-2xl font-bold mb-6">Leads</h1>

        <div className="overflow-auto rounded-lg shadow border border-gray-200">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
              <tr>
                <th className="px-6 py-3">Name ↓</th>
                <th className="px-6 py-3">Submitted ↓</th>
                <th className="px-6 py-3">Status ↓</th>
                <th className="px-6 py-3">Country ↓</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium">
                    {lead.firstName} {lead.lastName}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {new Date(lead.submittedAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-semibold ${
                        lead.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lead.status === "PENDING" ? "Pending" : "Reached Out"}
                    </span>
                  </td>
                  <td className="px-6 py-4">{lead.country}</td>
                  <td className="px-6 py-4">
                    {lead.status === "PENDING" && (
                      <button
                        onClick={() => markAsReachedOut(lead.id)}
                        className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-100"
                      >
                        Mark as Reached Out
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLeadsPage;
