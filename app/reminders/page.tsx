"use client";

import { useState, useEffect } from "react";
import { ClockIcon, CalendarDaysIcon } from "@heroicons/react/24/outline";

export default function RemindersPage() {
  const [task, setTask] = useState("");
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");
  const [reminders, setReminders] = useState([]);
  const [editingId, setEditingId] = useState(null);

  // Load reminders
  useEffect(() => {
    const saved = localStorage.getItem("pet-reminders");
    if (saved) setReminders(JSON.parse(saved));
  }, []);

  // Save reminders
  function save(updated) {
    setReminders(updated);
    localStorage.setItem("pet-reminders", JSON.stringify(updated));
  }

  // Add or Save Edited Reminder
  function addOrSaveReminder() {
    if (!task || !date) return;

    if (editingId) {
      // EDIT MODE
      const updated = reminders.map((r) =>
        r.id === editingId ? { ...r, task, time, date } : r
      );
      save(updated);
      setEditingId(null);
    } else {
      // ADD MODE
      const newReminder = {
        id: Date.now(),
        task,
        time,
        date,
        done: false,
      };
      save([...reminders, newReminder]);
    }

    setTask("");
    setTime("");
    setDate("");
  }

  // Toggle Done
  function toggleDone(id) {
    save(
      reminders.map((r) =>
        r.id === id ? { ...r, done: !r.done } : r
      )
    );
  }

  // Delete
  function remove(id) {
    save(reminders.filter((r) => r.id !== id));
  }

  // Edit
  function editReminder(r) {
    setTask(r.task);
    setTime(r.time);
    setDate(r.date);
    setEditingId(r.id);
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-4xl mx-auto p-6">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">Reminders</h2>

        {/* ADD / EDIT FORM */}
        <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl space-y-4">
          <input
            className="input"
            placeholder="Task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
          />

          <input
            className="input"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />

          <input
            className="input"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />

          <button className="btn-primary w-full" onClick={addOrSaveReminder}>
            {editingId ? "Save Changes" : "Add Reminder"}
          </button>
        </div>

        {/* REMINDERS LIST */}
        <div className="space-y-4 mt-6">
          {reminders.map((r) => (
            <div
              key={r.id}
              className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-xl flex justify-between items-center"
            >
              <div>
                <p
                  className={`font-semibold text-lg ${
                    r.done ? "line-through text-neutral-500" : "text-blue-300"
                  }`}
                >
                  {r.task}
                </p>

                {/* DATE + TIME */}
                <div className="text-sm text-neutral-400 flex items-center gap-4 mt-1">
                  <span className="flex items-center gap-1">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {r.date}
                  </span>

                  {r.time && (
                    <span className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      {r.time}
                    </span>
                  )}
                </div>
              </div>

              {/* BUTTONS */}
              <div className="flex gap-2">
                <button className="btn-success" onClick={() => toggleDone(r.id)}>
                  {r.done ? "Undo" : "Done"}
                </button>

                <button className="btn-primary" onClick={() => editReminder(r)}>
                  Edit
                </button>

                <button className="btn-danger" onClick={() => remove(r.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
