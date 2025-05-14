# 🧠 Lead Management Frontend

A full-featured Lead Management application built with **Next.js**, **Supabase**, **Tailwind CSS**, and **React Hook Form**.

It provides a public-facing form for lead submission and a secure internal admin dashboard to review and manage submissions.

---

## - Features

- Public lead form with validation and resume upload
- Admin login with password protection
- Internal dashboard for lead review and status updates
-  Update lead status from `PENDING` to `REACHED_OUT`
- Supabase for real-time data storage
- Unit tests with Jest & React Testing Library
- Responsive UI using Tailwind CSS

---

## - Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS
- **Database & Storage**: Supabase
- **Forms**: React Hook Form + Yup
- **Auth**: Custom password-based mock login
- **Testing**: Jest + Testing Library

---

## - Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DavGalstyan98/lead-management.git
cd lead-management
## - Admin Access

- Go to: `/admin/login`
- **Password**: `admin123`

Once logged in, you will be redirected to the dashboard where you can:
- View all submitted leads
- See submission time and status
- Mark any `PENDING` lead as `REACHED_OUT`

> The admin login uses client-side password logic for simplicity (no Supabase Auth required).

---

##  Application Flow

1. **User goes to** `/public/lead-form` and fills out their information.
2. - Upon submission, data is stored in Supabase and confirmation is shown.
3. - Admin logs in at `/admin/login` using the password (`admin123`).
4. - Admin views all leads in `/admin/leads`:
   - Sorted by `submitted_at` (latest first)
   - Status displayed (`PENDING` / `REACHED_OUT`)
   - Country and email included
5. - Admin can click **“Mark as Reached Out”** to update a lead’s status.
