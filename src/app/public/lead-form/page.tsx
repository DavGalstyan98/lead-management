"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { v4 as uuidv4 } from "uuid";

import {
  leadFormPageValidation,
  LeadFormSchema,
} from "@/app/public/validation";
import { supabase } from "@/utils/supabase";

const LeadFormPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormSchema>({
    resolver: yupResolver(leadFormPageValidation),
  });

  const [submitted, setSubmitted] = useState(false);

  const onSubmit = async (data: LeadFormSchema) => {
    try {
      const file = (data.resume as FileList)[0];
      let resume_url = "";

      if (file) {
        const filePath = `resume-${uuidv4()}-${file.name}`;

        const { error: uploadError } = await supabase.storage
          .from("resumes")
          .upload(filePath, file);

        if (uploadError) {
          alert("Resume upload failed.");
          return;
        }

        const { data: urlData } = supabase.storage
          .from("resumes")
          .getPublicUrl(filePath);

        resume_url = urlData?.publicUrl || "";
      }

      const { error: insertError } = await supabase.from("leads").insert([
        {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          linked_in: data.linkedIn,
          visas: data.visas,
          resume_url,
          additional_info: data.additionalInfo,
          country: data.country,
        },
      ]);

      if (insertError) {
        alert("Failed to save lead to Supabase.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      alert(err);
    }
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto py-10 px-4 text-center">
        <h2 className="text-2xl font-semibold mb-4">Thank You</h2>
        <p className="text-gray-600 mb-6">
          Your information was submitted to our team of immigration attorneys.
          Expect an email from hello@tryalma.ai.
        </p>
        <button
          className="bg-black cursor-pointer text-white px-6 py-2 rounded hover:opacity-90 transition"
          onClick={() => setSubmitted(false)}
        >
          Go Back to Homepage
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10 px-4 text-center">
      <h1 className="text-3xl font-bold mb-4">
        Get An Assessment Of Your Immigration Case
      </h1>
      <h4 className="text-3xl font-bold mb-4">
        Want to understand your visa options?
      </h4>
      <p className="text-sm text-gray-600 mb-6">
        Submit the form below and our team of experienced attorneys will review
        your information and send a preliminary assessment of your case based on
        your goals.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <input
            placeholder="First Name"
            {...register("firstName")}
            className="w-full p-3 rounded border border-gray-300"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.firstName?.message}
          </p>
        </div>

        <div>
          <input
            placeholder="Last Name"
            {...register("lastName")}
            className="w-full p-3 rounded border border-gray-300"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.lastName?.message}
          </p>
        </div>

        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="w-full p-3 rounded border border-gray-300"
          />
          <p className="text-red-500 text-sm mt-1">{errors.email?.message}</p>
        </div>

        <div>
          <input
            placeholder="Country"
            {...register("country")}
            className="w-full p-3 rounded border border-gray-300"
          />
          <p className="text-red-500 text-sm mt-1">{errors.country?.message}</p>
        </div>

        <div>
          <input
            type="url"
            placeholder="LinkedIn / Website URL"
            {...register("linkedIn")}
            className="w-full p-3 rounded border border-gray-300"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.linkedIn?.message}
          </p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            Visa categories of interest?
          </label>
          <div className="flex flex-col space-y-1">
            {["O1", "EB1A", "EB2 NIW", "I don't know"].map((visa) => (
              <label key={visa} className="flex items-center space-x-2">
                <input type="checkbox" value={visa} {...register("visas")} />
                <span>{visa}</span>
              </label>
            ))}
          </div>
          <p className="text-red-500 text-sm mt-1">{errors.visas?.message}</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium">
            How can we help you?
          </label>
          <textarea
            placeholder="Write your message..."
            {...register("additionalInfo")}
            className="w-full p-3 rounded border border-gray-300 min-h-[100px]"
          />
          <p className="text-red-500 text-sm mt-1">
            {errors.additionalInfo?.message}
          </p>
        </div>

        <div>
          <label htmlFor="resume" className="block mb-1 text-sm font-medium">
            Resume Upload
          </label>
          <input id="resume" type="file" {...register("resume")} />
          <p className="text-red-500 text-sm mt-1">{errors.resume?.message}</p>
        </div>

        <button
          type="submit"
          className="w-full cursor-pointer bg-black text-white p-3 rounded hover:opacity-90 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default LeadFormPage;
