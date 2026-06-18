import Link from "next/link";
import { createSupabaseServerClient } from "@/supabase/server";
import { SignOutButton } from "@/components/sign-out-button";
import { Users, Plane, ArrowRight } from "lucide-react";

export default async function DashboardPage() {
  const client = await createSupabaseServerClient();
  const { data } = await client.auth.getUser();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-6">
        <div className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-8 shadow-sm md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Dashboard
            </h1>
            <p className="mt-2 text-slate-600">
              Welcome back
            </p>

            <div className="mt-3 inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm text-slate-700">
              {data.user?.email}
            </div>
          </div>

          <SignOutButton />
        </div>
        <div className="mb-6">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">
            Quick Access
          </h2>

          <div className="grid gap-6 md:grid-cols-2">
            <Link
              href="/dashboard/leads"
              className="group rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-blue-100 p-4">
                  <Users className="h-7 w-7 text-blue-600" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Leads
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                View, manage, and track incoming leads.
              </p>
            </Link>

            <Link
              href="/dashboard/trips"
              className="group rounded-3xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-emerald-100 p-4">
                  <Plane className="h-7 w-7 text-emerald-600" />
                </div>

                <ArrowRight className="h-5 w-5 text-slate-400 transition group-hover:translate-x-1" />
              </div>

              <h3 className="mt-6 text-xl font-semibold text-slate-900">
                Trips
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                Manage itineraries, bookings, and trip details.
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}