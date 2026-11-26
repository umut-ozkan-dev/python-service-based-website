"use client";

import { Loader2, RefreshCw } from "lucide-react";
import { useEffect, useState } from "react";

import { ApiClientError, fetchAdminLeadDetailApi, fetchAdminLeadsApi, patchAdminLeadApi } from "@/lib/api";
import { TOKEN } from "@/lib/tokens";
import type { LeadDetail, LeadListResponse, LeadResponseStatus } from "@/lib/types";

const KEY = "relay_admin_key";

function formatStamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [authed, setAuthed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [board, setBoard] = useState<LeadListResponse | null>(null);
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<LeadDetail | null>(null);
  const [notes, setNotes] = useState("");
  const [detailError, setDetailError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      setApiKey(stored);
      void load(stored, "", "");
    }
  }, []);

  async function load(key: string, nextRegion: string, nextStatus: string) {
    setLoading(true);
    setError(null);
    const query = new URLSearchParams();
    if (nextRegion) query.set("region", nextRegion);
    if (nextStatus) query.set("status", nextStatus);
    const suffix = query.toString() ? `?${query}` : "";
    try {
      const data = await fetchAdminLeadsApi(key, suffix);
      sessionStorage.setItem(KEY, key);
      setAuthed(true);
      setBoard(data);
    } catch (err) {
      setAuthed(false);
      sessionStorage.removeItem(KEY);
      setError(err instanceof ApiClientError ? err.message : "Unable to reach the server.");
    } finally {
      setLoading(false);
    }
  }

  async function openLead(id: string) {
    setSaving(true);
    setDetailError(null);
    try {
      const detail = await fetchAdminLeadDetailApi(apiKey, id);
      setSelected(detail);
      setNotes(detail.admin_notes || "");
    } catch (err) {
      setDetailError(err instanceof ApiClientError ? err.message : "Unable to reach the server.");
    } finally {
      setSaving(false);
    }
  }

  async function update(payload: { response_status?: LeadResponseStatus; admin_notes?: string }) {
    if (!selected) return;
    setSaving(true);
    setDetailError(null);
    try {
      const detail = await patchAdminLeadApi(apiKey, selected.id, payload);
      setSelected(detail);
      setNotes(detail.admin_notes || "");
      await load(apiKey, region, status);
    } catch (err) {
      setDetailError(err instanceof ApiClientError ? err.message : "Unable to reach the server.");
    } finally {
      setSaving(false);
    }
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#040507] px-5 pt-28 pb-20">
        <form className={`${TOKEN.PANEL} w-full max-w-md`} onSubmit={(event) => { event.preventDefault(); void load(apiKey, "", ""); }}>
          <p className="font-heading text-2xl text-white">relay<span className="text-sky-400">.</span> / operations console</p>
          <label htmlFor="admin_key" className={`${TOKEN.LABEL} mt-6`}>Admin API key</label>
          <input id="admin_key" type="password" className={TOKEN.INPUT} value={apiKey} onChange={(event) => setApiKey(event.target.value)} />
          {error ? <p className="mt-3 text-sm text-rose-300">{error}</p> : null}
          <button type="submit" className={`${TOKEN.BTN_PRIMARY} mt-6 w-full`} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}Sign in</button>
        </form>
      </div>
    );
  }

  const booked = board?.items.filter((item) => item.response_status === "booked").length ?? 0;

  return (
    <div className="min-h-screen bg-[#040507] px-5 pt-28 pb-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-heading text-2xl text-white">relay<span className="text-sky-400">.</span> / operations console</p>
          <div className="flex gap-2">
            <button type="button" className={TOKEN.BTN_SECONDARY} onClick={() => void load(apiKey, region, status)}><RefreshCw className="h-4 w-4" />Refresh</button>
            <button type="button" className={TOKEN.BTN_GHOST} onClick={() => { sessionStorage.removeItem(KEY); setApiKey(""); setSelected(null); setNotes(""); setDetailError(null); setBoard(null); setAuthed(false); }}>Sign out</button>
          </div>
        </div>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className={TOKEN.PANEL_ELEVATED}><p className="text-xs text-slate-500">Total leads</p><p className="mt-2 font-heading text-3xl text-white">{board?.total ?? 0}</p></div>
          <div className={TOKEN.PANEL_ELEVATED}><p className="text-xs text-slate-500">Booked calls</p><p className="mt-2 font-heading text-3xl text-white">{booked}</p></div>
          <div className={TOKEN.PANEL_ELEVATED}><p className="text-xs text-slate-500">Recent simulations</p><p className="mt-2 font-heading text-3xl text-white">{board?.recent_simulations.length ?? 0}</p></div>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className={`${TOKEN.PANEL} lg:col-span-7`}>
            <div className="flex flex-wrap gap-2">
              {["", "US", "UK"].map((item) => (
                <button key={item || "all"} type="button" className={region === item ? TOKEN.BADGE_CYAN : TOKEN.BTN_GHOST} onClick={() => { setRegion(item); void load(apiKey, item, status); }}>{item || "All"}</button>
              ))}
              <select className={TOKEN.SELECT + " max-w-[12rem]"} value={status} onChange={(event) => { setStatus(event.target.value); void load(apiKey, region, event.target.value); }}>
                <option value="">Any status</option>
                <option value="received">Received</option>
                <option value="responded">Responded</option>
                <option value="booked">Booked</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <ul className="mt-4 divide-y divide-white/[0.08]">
              {board?.items.map((item) => (
                <li key={item.id}>
                  <button type="button" className={`flex w-full items-center justify-between gap-3 py-3 text-left ${selected?.id === item.id ? "rounded-lg bg-white/[0.05] px-2.5" : ""}`} onClick={() => void openLead(item.id)}>
                    <span>
                      <span className="block text-sm text-white">{item.business_name}</span>
                      <span className="text-xs text-slate-500">{item.full_name} · {item.automation_focus.replaceAll("_", " ")}</span>
                    </span>
                    <span className="text-xs text-slate-400">{item.response_status}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
          <aside className={`${TOKEN.PANEL} lg:col-span-5`}>
            {detailError ? <p className="mb-3 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{detailError}</p> : null}
            {selected ? (
              <>
                <h2 className="text-lg text-white">{selected.business_name}</h2>
                <p className="mt-1 text-sm text-slate-400">{selected.work_email}{selected.phone ? ` · ${selected.phone}` : ""}</p>
                <p className="mt-4 text-sm text-slate-300">{selected.notes || "No notes submitted."}</p>
                <p className="mt-2 text-sm text-slate-500">Tools: {selected.current_tools || "Not listed"}</p>
                <ul className="mt-4 space-y-2">
                  {selected.dispatch_logs.map((log) => (
                    <li key={log.id} className="flex items-center justify-between text-xs text-slate-400">
                      <span>{log.channel}</span>
                      <span>{log.status} · {log.latency_ms} ms</span>
                    </li>
                  ))}
                </ul>
                <label htmlFor="admin_notes" className={`${TOKEN.LABEL} mt-4`}>Admin notes</label>
                <textarea id="admin_notes" className={TOKEN.INPUT} rows={3} value={notes} onChange={(event) => setNotes(event.target.value)} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" className={TOKEN.BTN_SECONDARY} disabled={saving} onClick={() => void update({ admin_notes: notes })}>Save notes</button>
                  {selected.response_status !== "booked" ? <button type="button" className={TOKEN.BTN_PRIMARY} disabled={saving} onClick={() => void update({ response_status: "booked", admin_notes: notes })}>Mark booked</button> : null}
                  {selected.response_status !== "archived" ? <button type="button" className={TOKEN.BTN_SECONDARY} disabled={saving} onClick={() => void update({ response_status: "archived", admin_notes: notes })}>Archive</button> : null}
                  {selected.response_status === "archived" ? <button type="button" className={TOKEN.BTN_GHOST} disabled={saving} onClick={() => void update({ response_status: "responded", admin_notes: notes })}>Reopen</button> : null}
                </div>
              </>
            ) : <p className="text-sm text-slate-500">Select a lead to inspect the dispatch log.</p>}
          </aside>
        </div>
        <section className={`${TOKEN.PANEL} mt-6`}>
          <h2 className="text-sm text-white">Recent workflow walkthrough runs</h2>
          <ul className="mt-3 divide-y divide-white/[0.08] text-sm text-slate-400">
            {board?.recent_simulations.map((item) => (
              <li key={item.id} className="flex justify-between gap-3 py-2">
                <span>{item.vertical} · {item.channel} · {item.region}</span>
                <span>{formatStamp(item.created_at)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
