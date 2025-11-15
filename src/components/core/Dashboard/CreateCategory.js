import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

export default function CreateCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const token = useSelector((state) => state.auth.token);

  const BASE_URL = process.env.REACT_APP_BASE_URL || "";

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`${BASE_URL}/category/showAllCategories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (err) {
      console.warn("Failed to fetch categories");
    }
  };

  // Create Category
  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return toast.error("Fill all fields");

    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/category/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Category created!");
        setName("");
        setDescription("");
        fetchCategories();
      } else {
        toast.error(data.message || "Failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Category
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this category?")) return;

    try {
      const res = await fetch(`${BASE_URL}/category/delete/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        toast.success("Deleted!");
        fetchCategories();
      } else {
        toast.error("Delete failed");
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  // Start Edit
  const startEdit = (cat) => {
    setEditingId(cat._id);
    setEditName(cat.name);
    setEditDesc(cat.description);
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingId(null);
    setEditName("");
    setEditDesc("");
  };

  // Update Category
  const handleUpdate = async () => {
    if (!editName.trim() || !editDesc.trim()) return toast.error("Fill all");

    try {
      const res = await fetch(`${BASE_URL}/category/update/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, description: editDesc }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        toast.success("Updated!");
        cancelEdit();
        fetchCategories();
      } else {
        toast.error(data.message || "Update failed");
      }
    } catch (err) {
      toast.error("Error");
    }
  };

  // Load categories on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="flex w-full items-start gap-x-6 p-6">
      {/* Left: Create Form */}
      <div className="flex flex-1 flex-col">
        <h1 className="mb-6 text-3xl font-medium text-richblack-5">Create Category</h1>

        <form onSubmit={handleCreate} className="max-w-2xl space-y-6 rounded-md border border-richblack-700 bg-richblack-800 p-8">
          <div>
            <label className="block text-sm text-richblack-300 mb-2">Category Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Web Development"
              className="w-full rounded-md bg-richblack-900 px-4 py-2 text-richblack-5"
            />
          </div>

          <div>
            <label className="block text-sm text-richblack-300 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={4}
              className="w-full rounded-md bg-richblack-900 px-4 py-2 text-richblack-5 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-yellow-50 px-6 py-2 text-black font-medium disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create"}
            </button>
            <button
              type="button"
              onClick={() => { setName(""); setDescription(""); }}
              className="rounded-md border border-richblack-700 px-6 py-2 text-richblack-300"
            >
              Reset
            </button>
          </div>
        </form>

        {/* Right: Categories List (CRUD) */}
        <div className="mt-10">
          <h2 className="mb-4 text-2xl font-medium text-richblack-5">All Categories</h2>

          {categories.length === 0 ? (
            <p className="text-richblack-300">No categories yet. Create one!</p>
          ) : (
            <div className="space-y-4">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="flex items-center justify-between rounded-md border border-richblack-700 bg-richblack-800 p-4"
                >
                  {editingId === cat._id ? (
                    // Edit Mode
                    <div className="flex-1 space-y-3">
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded bg-richblack-900 px-3 py-1 text-richblack-5"
                      />
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={2}
                        className="w-full rounded bg-richblack-900 px-3 py-1 text-richblack-5 resize-none"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={handleUpdate}
                          className="rounded bg-green-600 px-3 py-1 text-white text-sm"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="rounded bg-gray-600 px-3 py-1 text-white text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <>
                      <div>
                        <h3 className="font-medium text-richblack-5">{cat.name}</h3>
                        <p className="text-sm text-richblack-300">{cat.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(cat)}
                          className="rounded bg-blue-600 px-3 py-1 text-white text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="rounded bg-red-600 px-3 py-1 text-white text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="sticky top-10 hidden max-w-[400px] flex-1 rounded-md border border-richblack-700 bg-richblack-800 p-6 xl:block">
        <p className="mb-4 text-lg text-richblack-5">CRUD Tips</p>
        <ul className="ml-5 list-disc space-y-2 text-sm text-richblack-5">
          <li>Create: Fill form → Submit</li>
          <li>Read: Auto-loaded below</li>
          <li>Update: Click Edit → Save</li>
          <li>Delete: Click Delete → Confirm</li>
        </ul>
      </div>
    </div>
  );
}