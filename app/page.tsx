"use client";

import { useEffect, useState } from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

export default function HomePage() {
  const [fact, setFact] = useState("");
  const [loadingFact, setLoadingFact] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [allReminders, setAllReminders] = useState([]);

  // NEW STATES
  const [audioAllowed, setAudioAllowed] = useState(false);
  const [blink, setBlink] = useState(false);
  const [toast, setToast] = useState("");

  // Load reminders + today's tasks + pet fact
  useEffect(() => {
    const saved = localStorage.getItem("pet-reminders");
    if (saved) {
      const parsed = JSON.parse(saved);
      setAllReminders(parsed);

      const today = new Date().toLocaleDateString("en-CA");
      setTasks(parsed.filter((r) => r.date === today));
    }

    async function loadFact() {
      try {
        const res = await fetch("https://catfact.ninja/fact");
        const data = await res.json();
        setFact(data.fact);
      } catch {
        setFact("Could not load pet fact.");
      }
      setLoadingFact(false);
    }

    loadFact();
  }, []);

  // Helper: Check if reminder is overdue
  function isOverdue(r) {
    const now = new Date();
    const reminderTime = new Date(`${r.date}T${r.time || "00:00"}`);
    return !r.done && reminderTime < now;
  }

  // SOUND + TOAST + BLINKING ICON — checks every 5 seconds
  useEffect(() => {
    if (!audioAllowed) return;
    if (allReminders.length === 0) return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentDate = now.toLocaleDateString("en-CA");
      const currentTime = now.toTimeString().slice(0, 5);

      allReminders.forEach((r) => {
        if (r.done) return;

        if (r.date === currentDate && r.time === currentTime) {
          // Play sound
          const audio = new Audio("/notification.mp3");
          audio.play().catch(() => console.log("Audio blocked until user interacts."));

          // Show toast
          setToast(`Reminder: ${r.task}`);
          setTimeout(() => setToast(""), 5000);

          // Blink icon
          setBlink(true);
          setTimeout(() => setBlink(false), 60000);
        }
      });
    }, 5000); // check every 5 seconds

    return () => clearInterval(interval);
  }, [allReminders, audioAllowed]);

  // Toggle done
  function toggleDone(id) {
    const updated = allReminders.map((r) =>
      r.id === id ? { ...r, done: !r.done } : r
    );

    localStorage.setItem("pet-reminders", JSON.stringify(updated));
    setAllReminders(updated);

    const today = new Date().toLocaleDateString("en-CA");
    setTasks(updated.filter((r) => r.date === today));
  }

  const completed = tasks.filter((t) => t.done).length;
  const pending = tasks.length - completed;
  const progress = tasks.length === 0 ? 0 : (completed / tasks.length) * 100;

  return (
    <div
      className="min-h-screen bg-neutral-950 p-8"
      onClick={() => setAudioAllowed(true)} // unlock audio
    >

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-10">
        <img
          src="/petpal-logo.png"
          alt="PetPal Logo"
          className="h-14 w-14 object-contain shadow-lg"
        />

        <div>
          <h1 className="text-3xl font-bold text-blue-300">Welcome to PetPal</h1>
        </div>

        {/* BLINKING NOTIFICATION ICON */}
        {blink && (
          <div className="h-4 w-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>

      {/* GRID LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* SUMMARY CARD */}
        <div className="lg:col-span-1 card bg-neutral-900 border border-neutral-800 shadow-xl p-6">
          <h2 className="text-xl font-semibold text-blue-300 mb-4">Today's Summary</h2>

          <div className="flex justify-between text-neutral-300 mb-3">
            <p>Completed: {completed}</p>
            <p>Pending: {pending}</p>
          </div>

          <div className="w-full bg-neutral-700 h-3 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* TASKS CARD */}
        <div className="lg:col-span-2 card bg-neutral-900 border border-neutral-800 shadow-xl p-6">
          <h2 className="text-2xl font-bold text-blue-400 mb-6">Today's Tasks</h2>

          {tasks.length === 0 ? (
            <p className="text-neutral-300 text-lg">No tasks for today.</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((t) => (
                <div
                  key={t.id}
                  className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl border border-neutral-700 hover:scale-[1.01] transition-all duration-300"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center">
                      <CheckCircleIcon className="h-6 w-6 text-white" />
                    </div>

                    <div>
                      <p
                        className={`text-lg font-semibold ${
                          t.done ? "line-through text-neutral-500" : "text-blue-300"
                        }`}
                      >
                        {t.task}
                      </p>

                      {/* TIME + OVERDUE LABEL */}
                      <p className="text-neutral-400 text-sm mt-1">
                        Time: {t.time || "No time set"}
                        {isOverdue(t) && (
                          <span className="ml-2 text-red-500 font-semibold">
                            • Overdue
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <button
                    className="btn-success px-4 py-2"
                    onClick={() => toggleDone(t.id)}
                  >
                    {t.done ? "Undo" : "Done"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* PET FACT */}
      <div className="card shadow-xl border border-neutral-800 bg-neutral-900 p-6 mt-12">
        <h2 className="text-2xl font-bold text-yellow-400 mb-4">Fun Pet Fact</h2>

        {loadingFact ? (
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-neutral-700 rounded w-3/4"></div>
            <div className="h-4 bg-neutral-700 rounded w-1/2"></div>
          </div>
        ) : (
          <p className="text-neutral-300 leading-relaxed text-lg">{fact}</p>
        )}
      </div>

      {/* POPUP TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-blue-600 text-white px-4 py-3 rounded-lg shadow-lg animate-pulse">
          {toast}
        </div>
      )}
    </div>
  );
}
