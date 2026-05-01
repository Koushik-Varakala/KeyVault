"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Tab = "keys" | "notes" | "usage";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("keys");

  // API Keys state
  const [apiKeys, setApiKeys] = useState<any[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);

  // Notes state
  const [notes, setNotes] = useState<any[]>([]);
  const [noteForm, setNoteForm] = useState({ title: "", content: "" });
  const [editingNote, setEditingNote] = useState<any | null>(null);
  const [noteSuccess, setNoteSuccess] = useState("");
  const [noteError, setNoteError] = useState("");

  // Usage state
  const [usageStats, setUsageStats] = useState<any[]>([]);

  useEffect(() => {
    fetchApiKeys();
    fetchUsageStats();
    fetchNotes();
  }, []);

  // --- API KEY HANDLERS ---
  const fetchApiKeys = async () => {
    const res = await fetch("/api/v1/api-keys");
    if (res.ok) setApiKeys((await res.json()).apiKeys);
  };

  const fetchUsageStats = async () => {
    const res = await fetch("/api/v1/usage");
    if (res.ok) setUsageStats((await res.json()).stats);
  };

  const handleCreateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/v1/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newKeyName }),
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedKey(data.apiKey.apiKey);
      setNewKeyName("");
      fetchApiKeys();
      fetchUsageStats();
    }
  };

  const handleRevokeKey = async (id: string) => {
    const res = await fetch(`/api/v1/api-keys/${id}`, { method: "DELETE" });
    if (res.ok) { fetchApiKeys(); fetchUsageStats(); }
  };

  // --- NOTES HANDLERS ---
  const fetchNotes = async () => {
    const res = await fetch("/api/v1/notes");
    if (res.ok) setNotes((await res.json()).notes);
  };

  const handleNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNoteError(""); setNoteSuccess("");

    if (editingNote) {
      const res = await fetch(`/api/v1/notes/${editingNote.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteForm),
      });
      if (res.ok) {
        setNoteSuccess("Note updated!");
        setEditingNote(null);
        setNoteForm({ title: "", content: "" });
        fetchNotes();
      } else {
        const d = await res.json();
        setNoteError(d.error || "Failed to update note");
      }
    } else {
      const res = await fetch("/api/v1/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noteForm),
      });
      if (res.ok) {
        setNoteSuccess("Note created!");
        setNoteForm({ title: "", content: "" });
        fetchNotes();
      } else {
        const d = await res.json();
        setNoteError(d.error || "Failed to create note");
      }
    }
    setTimeout(() => setNoteSuccess(""), 3000);
  };

  const handleDeleteNote = async (id: string) => {
    const res = await fetch(`/api/v1/notes/${id}`, { method: "DELETE" });
    if (res.ok) fetchNotes();
  };

  const handleEditNote = (note: any) => {
    setEditingNote(note);
    setNoteForm({ title: note.title, content: note.content });
    setActiveTab("notes");
  };

  const handleLogout = async () => {
    await fetch("/api/v1/auth/logout", { method: "POST" });
    window.location.href = "/login";
  };

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "keys", label: "🔑 API Keys", count: apiKeys.length },
    { id: "notes", label: "📝 Notes", count: notes.length },
    { id: "usage", label: "📊 Usage Stats" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white font-sans">
      {/* Header */}
      <header className="border-b border-white/5 px-8 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-xs font-bold">K</div>
            <span className="font-semibold tracking-tight">KeyVault</span>
          </Link>
          <span className="text-white/20">/</span>
          <span className="text-gray-400 text-sm">Dashboard</span>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 rounded-lg transition-all"
        >
          Sign Out
        </button>
      </header>

      <div className="max-w-6xl mx-auto px-8 py-10 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="text-3xl font-bold">Developer Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your API keys, notes, and monitor usage</p>
        </div>

        {/* Generated Key Banner */}
        {generatedKey && (
          <div className="p-5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-emerald-400 font-semibold">New API Key Generated!</h3>
                <p className="text-emerald-700 text-xs mt-1">Copy this now — it will never be shown again.</p>
              </div>
              <button onClick={() => setGeneratedKey(null)} className="text-emerald-700 hover:text-emerald-500 text-lg">×</button>
            </div>
            <div className="flex items-center gap-3 bg-black/30 rounded-lg px-4 py-3 border border-emerald-500/10">
              <code className="text-emerald-300 font-mono text-sm flex-1 break-all">{generatedKey}</code>
              <button
                onClick={() => navigator.clipboard.writeText(generatedKey)}
                className="text-xs px-3 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-md transition-all flex-shrink-0"
              >
                Copy
              </button>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit border border-white/5">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                activeTab === t.id
                  ? "bg-violet-600 text-white shadow-lg shadow-violet-500/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {t.label}
              {t.count !== undefined && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === t.id ? "bg-white/20" : "bg-white/5"}`}>
                  {t.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ===== API KEYS TAB ===== */}
        {activeTab === "keys" && (
          <div className="grid md:grid-cols-3 gap-6">
            <div className="col-span-1">
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                <h2 className="font-semibold mb-4">Generate New Key</h2>
                <form onSubmit={handleCreateKey} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Key Name</label>
                    <input
                      type="text"
                      value={newKeyName}
                      onChange={(e) => setNewKeyName(e.target.value)}
                      required
                      placeholder="e.g. Production App"
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-sm transition-colors"
                  >
                    Generate Key
                  </button>
                </form>
              </div>
            </div>

            <div className="col-span-2">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                  <h2 className="font-semibold">Your API Keys</h2>
                </div>
                <div className="divide-y divide-white/5">
                  {apiKeys.length === 0 ? (
                    <div className="px-6 py-12 text-center text-gray-600">No keys yet. Generate one to get started.</div>
                  ) : (
                    apiKeys.map((key) => (
                      <div key={key.id} className="px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{key.name}</span>
                            {key.isActive
                              ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                              : <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Revoked</span>
                            }
                          </div>
                          <div className="text-xs text-gray-600 font-mono">{key.maskedKey}</div>
                          <div className="text-xs text-gray-700 mt-1">Created {new Date(key.createdAt).toLocaleDateString()}</div>
                        </div>
                        {key.isActive && (
                          <button
                            onClick={() => handleRevokeKey(key.id)}
                            className="text-xs px-3 py-1.5 text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-lg transition-all"
                          >
                            Revoke
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ===== NOTES TAB ===== */}
        {activeTab === "notes" && (
          <div className="grid md:grid-cols-5 gap-6">
            {/* Form */}
            <div className="col-span-2">
              <div className="p-6 rounded-xl border border-white/5 bg-white/[0.02]">
                <h2 className="font-semibold mb-1">{editingNote ? "Edit Note" : "New Note"}</h2>
                <p className="text-gray-600 text-xs mb-5">
                  {editingNote ? "Update the note below" : "Create a personal note stored securely in your account"}
                </p>

                {noteSuccess && (
                  <div className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">{noteSuccess}</div>
                )}
                {noteError && (
                  <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{noteError}</div>
                )}

                <form onSubmit={handleNoteSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Title</label>
                    <input
                      type="text"
                      value={noteForm.title}
                      onChange={(e) => setNoteForm({ ...noteForm, title: e.target.value })}
                      required
                      placeholder="Note title..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">Content</label>
                    <textarea
                      value={noteForm.content}
                      onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                      required
                      rows={5}
                      placeholder="Write your note here..."
                      className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-violet-500 transition-colors resize-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 py-2.5 bg-violet-600 hover:bg-violet-500 rounded-lg font-medium text-sm transition-colors">
                      {editingNote ? "Update Note" : "Create Note"}
                    </button>
                    {editingNote && (
                      <button
                        type="button"
                        onClick={() => { setEditingNote(null); setNoteForm({ title: "", content: "" }); }}
                        className="px-4 py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>

            {/* Notes List */}
            <div className="col-span-3 space-y-3">
              {notes.length === 0 ? (
                <div className="p-12 rounded-xl border border-white/5 bg-white/[0.02] text-center text-gray-600">
                  No notes yet. Create your first note!
                </div>
              ) : (
                notes.map((note) => (
                  <div key={note.id} className="p-5 rounded-xl border border-white/5 bg-white/[0.02] hover:border-violet-500/20 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm group-hover:text-violet-300 transition-colors">{note.title}</h3>
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditNote(note)}
                          className="text-xs px-2.5 py-1 text-violet-400 border border-violet-500/20 hover:bg-violet-500/10 rounded-md transition-all"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteNote(note.id)}
                          className="text-xs px-2.5 py-1 text-red-400 border border-red-500/20 hover:bg-red-500/10 rounded-md transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">{note.content}</p>
                    <div className="text-xs text-gray-700 mt-3">
                      {new Date(note.updatedAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ===== USAGE STATS TAB ===== */}
        {activeTab === "usage" && (
          <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5">
              <h2 className="font-semibold">API Key Usage</h2>
              <p className="text-gray-600 text-xs mt-1">Total requests logged per key</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/5 text-gray-500 text-xs">
                  <tr>
                    <th className="px-6 py-4 font-medium">Key Name</th>
                    <th className="px-6 py-4 font-medium">Masked Key</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Total Requests</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {usageStats.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-gray-600">
                        No usage data yet. Make some API calls first.
                      </td>
                    </tr>
                  ) : (
                    usageStats.map((stat) => (
                      <tr key={stat.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 font-medium">{stat.name}</td>
                        <td className="px-6 py-4 font-mono text-gray-500 text-xs">{stat.maskedKey}</td>
                        <td className="px-6 py-4">
                          {stat.isActive
                            ? <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active</span>
                            : <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20">Revoked</span>
                          }
                        </td>
                        <td className="px-6 py-4 text-right font-mono font-semibold text-violet-300">{stat.totalRequests}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick API test card */}
        <div className="p-6 rounded-xl border border-violet-500/10 bg-violet-500/5">
          <h3 className="font-semibold text-sm mb-1 text-violet-300">🚀 Test the Protected API</h3>
          <p className="text-gray-500 text-xs mb-3">Use your API key to call the protected market data endpoint:</p>
          <pre className="text-xs text-violet-300 font-mono bg-black/30 rounded-lg px-4 py-3">
            {`curl -H "Authorization: Bearer <your_api_key>" \\
     http://localhost:3000/api/v1/protected-data`}
          </pre>
        </div>
      </div>
    </div>
  );
}
