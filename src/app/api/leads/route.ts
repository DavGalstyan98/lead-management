import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";

type Lead = {
  first_name: string;
  last_name: string;
  email: string;
  linked_in: string;
  visas: string[];
  resume_url?: string;
  additional_info: string;
  country: string;
};

export const GET = async () => {
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
};

export const POST = async (req: NextRequest) => {
  const body: Lead = await req.json();

  const { data, error } = await supabase.from("leads").insert([body]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data?.[0], { status: 201 });
};

export const PATCH = async (req: NextRequest) => {
  const { id } = await req.json();

  const { data, error } = await supabase
    .from("leads")
    .update({ status: "REACHED_OUT" })
    .eq("id", id)
    .select();

  if (error || !data || data.length === 0) {
    return NextResponse.json(
      { error: "Lead not found or update failed" },
      { status: 404 },
    );
  }

  return NextResponse.json(data[0]);
};
