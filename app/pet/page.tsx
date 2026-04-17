"use client";

import { useState, useEffect } from "react";
import { UserCircleIcon } from "@heroicons/react/24/solid";

export default function PetProfilePage() {
  const [pet, setPet] = useState<any>(null); // single pet only
  const [form, setForm] = useState({ name: "", type: "", age: "" });
  const [isEditing, setIsEditing] = useState(false);

  // Load pet from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("pet-profile");
    if (saved) setPet(JSON.parse(saved));
  }, []);

  // Save pet to localStorage
  function savePet(updated: any) {
    setPet(updated);
    localStorage.setItem("pet-profile", JSON.stringify(updated));
  }

  // Add new pet (only one allowed)
  function addPet() {
    if (!form.name || !form.type || !form.age) return;

    const newPet = { ...form };
    savePet(newPet);

    setForm({ name: "", type: "", age: "" });
  }

  // Edit pet
  function editPet() {
    if (!pet) return;
    setForm(pet);
    setIsEditing(true);
  }

  // Save edited pet
  function saveEdit() {
    savePet(form);
    setIsEditing(false);
  }

  // Delete pet
  function deletePet() {
    setPet(null);
    localStorage.removeItem("pet-profile");
    setForm({ name: "", type: "", age: "" });
    setIsEditing(false);
  }

  // Color badge for type
  function typeColor(type: any) {
    const t = type.toLowerCase();
    if (t === "dog") return "bg-blue-600/30 text-blue-300";
    if (t === "cat") return "bg-purple-600/30 text-purple-300";
    return "bg-green-600/30 text-green-300";
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <div className="max-w-4xl mx-auto p-6">

        <h2 className="text-3xl font-bold text-blue-400 mb-6">Pet Profile</h2>

        {/* ---------------------- ADD PET FORM (only if no pet exists) ---------------------- */}
        {!pet && (
          <div className="bg-neutral-900 border border-neutral-800 p-6 rounded-xl shadow-xl space-y-4">
            <input
              className="input"
              placeholder="Pet Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="input"
              placeholder="Type (Dog, Cat...)"
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
            />
            <input
              className="input"
              placeholder="Age"
              value={form.age}
              onChange={(e) => setForm({ ...form, age: e.target.value })}
            />

            <button className="btn-primary w-full" onClick={addPet}>
              Add Pet
            </button>
          </div>
        )}

        {/* ---------------------- PET CARD (if pet exists) ---------------------- */}
        {pet && (
          <div className="bg-neutral-900 border border-neutral-800 p-5 rounded-xl shadow-xl">

            <div className="flex items-center gap-3">
              <UserCircleIcon className="h-10 w-10 text-blue-300" />

              <div>
                <h3 className="text-xl font-semibold text-blue-300">{pet.name}</h3>

                <span className={`px-2 py-1 text-xs rounded ${typeColor(pet.type)}`}>
                  {pet.type}
                </span>

                <p className="text-neutral-300 mt-1">Age: {pet.age}</p>
              </div>
            </div>

            {/* Buttons */}
            <button className="btn-primary w-full mt-3" onClick={editPet}>
              Edit
            </button>

            <button className="btn-danger w-full mt-3" onClick={deletePet}>
              Delete
            </button>

            {/* ---------------------- EDIT FORM ---------------------- */}
            {isEditing && (
              <div className="mt-4 space-y-4 border-t border-neutral-800 pt-4">
                <input
                  className="input"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  className="input"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                />
                <input
                  className="input"
                  value={form.age}
                  onChange={(e) => setForm({ ...form, age: e.target.value })}
                />

                <button className="btn-primary w-full" onClick={saveEdit}>
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
