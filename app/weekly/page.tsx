"use client";

import { useEffect, useState } from "react";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function WeeklyPage() {
  const [reminders, setReminders] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pet-reminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  // Generate next 7 days
  const days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  function formatDate(date: any) {
    return date.toLocaleDateString("en-CA"); // yyyy-mm-dd
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-4xl mx-auto p-6">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">Weekly Overview</h2>

        <div className="space-y-6">
          {days.map((day: any) => {
            const dateStr = formatDate(day);

            // Filter reminders for this day
            const dayReminders = reminders
              .filter((r: any) => r.date === dateStr)
              .sort((a: any, b: any) => (a.time > b.time ? 1 : -1));

            return (
              <div
                key={dateStr}
                className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl hover:scale-[1.01] transition-all duration-300"
              >
                {/* Day Header */}
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDaysIcon className="h-5 w-5 text-blue-300" />
                  <h3 className="text-lg font-semibold text-blue-300">
                    {day.toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </h3>
                </div>

                {/* No tasks */}
                {dayReminders.length === 0 ? (
                  <p className="text-neutral-400">No tasks.</p>
                ) : (
                  <div className="space-y-2">
                    {dayReminders.map((r: any) => (
                      <div
                        key={r.id}
                        className="flex items-center gap-2 text-neutral-300 hover:text-white transition"
                      >
                        <ClockIcon className="h-4 w-4" />

                        <span
                          className={`${
                            r.done ? "line-through text-neutral-500" : ""
                          }`}
                        >
                          {r.task}
                        </span>

                        <span className="text-neutral-400">
                          • {r.time || "No time set"}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
