import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import {
  BarChart3, Mountain, PartyPopper, Compass, ClipboardList,
  ArrowLeft, Plus, Pencil, Trash2, Loader2, MessageCircle, Settings,
  Pin, PinOff, Star, Eye, EyeOff, Upload, Image,
} from "lucide-react";

// ── Types ───────────────────────────────────────────────
interface Destination {
  id: string; name: string; type: string | null; zone: string | null;
  price: number | null; price_unit: string | null; description: string | null;
  emoji: string | null; badge: string | null; rating: number | null;
  review_count: number | null; featured: boolean | null; status: string | null;
  image_gradient: string | null; image_url: string | null; created_at: string;
}
interface Event {
  id: string; title: string; type: string | null; start_date: string;
  end_date: string | null; location: string; zone: string | null;
  description: string | null; emoji: string | null; price: number | null;
  price_note: string | null; featured: boolean | null; status: string | null;
  created_at: string;
}
interface Tour {
  id: string; title: string; duration_category: string; price: number;
  duration: string; difficulty: string | null; zone: string | null;
  description: string | null; emoji: string | null; featured: boolean | null;
  status: string | null; created_at: string;
}
interface Booking {
  id: string; created_at: string; destination_name: string | null;
  full_name: string | null; email: string | null; phone: string | null;
  check_in: string | null; check_out: string | null; guests: number;
  total_price: number | null; message: string | null; status: string;
  item_name: string | null; item_type: string | null;
}
interface ChatMsg {
  id: string; created_at: string; username: string; country_flag: string;
  message: string; is_admin: boolean; is_pinned: boolean; deleted: boolean;
}

type Tab = "dashboard" | "destinations" | "events" | "tours" | "bookings" | "chat" | "settings";

const sidebarItems: { key: Tab; label: string }[] = [
  { key: "dashboard", label: "📊 Dashboard" },
  { key: "destinations", label: "🏔️ Destinacione" },
  { key: "events", label: "🎉 Evente" },
  { key: "tours", label: "🧭 Ture" },
  { key: "bookings", label: "📋 Rezervime" },
  { key: "chat", label: "💬 Chat" },
  { key: "settings", label: "⚙️ Cilësimet" },
];

// ── Main Component ──────────────────────────────────────
const AdminPanel = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("dashboard");
  const [loading, setLoading] = useState(true);

  // Data
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);

  // Chat
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [showDeleted, setShowDeleted] = useState(false);

  // Settings
  const [siteSettings, setSiteSettings] = useState<Record<string, string>>({});
  const [savingSettings, setSavingSettings] = useState(false);

  // Modals
  const [editDest, setEditDest] = useState<Partial<Destination> | null>(null);
  const [editEvent, setEditEvent] = useState<Partial<Event> | null>(null);
  const [editTour, setEditTour] = useState<Partial<Tour> | null>(null);
  const [deleteId, setDeleteId] = useState<{ table: string; id: string } | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [d, e, t, b] = await Promise.all([
      supabase.from("destinations").select("*").order("created_at", { ascending: false }),
      supabase.from("events").select("*").order("start_date", { ascending: true }),
      supabase.from("tours").select("*").order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
    ]);
    setDestinations((d.data as Destination[]) || []);
    setEvents((e.data as Event[]) || []);
    setTours((t.data as Tour[]) || []);
    setBookings((b.data as Booking[]) || []);
    setLoading(false);
  }, []);

  const fetchChat = useCallback(async () => {
    // Use 'as any' because chat_messages may not be in generated types yet
    const { data } = await (supabase.from("chat_messages" as any).select("*").order("created_at", { ascending: false }).limit(200) as any);
    if (data) setChatMessages(data as ChatMsg[]);
  }, []);

  const fetchSettings = useCallback(async () => {
    const { data } = await (supabase.from("site_settings" as any).select("key, value") as any);
    if (data) {
      const map: Record<string, string> = {};
      (data as any[]).forEach((r) => { map[r.key] = r.value || ""; });
      setSiteSettings(map);
    }
  }, []);

  useEffect(() => { fetchAll(); fetchChat(); fetchSettings(); }, [fetchAll, fetchChat, fetchSettings]);

  // Auto-refresh chat every 30s
  useEffect(() => {
    if (tab !== "chat") return;
    const interval = setInterval(fetchChat, 30000);
    return () => clearInterval(interval);
  }, [tab, fetchChat]);

  // ── CRUD helpers ────────────────────────────────────
  const saveDest = async () => {
    if (!editDest) return;
    const payload = {
      name: editDest.name || "", type: editDest.type || "agro", zone: editDest.zone || "",
      price: editDest.price || 0, price_unit: editDest.price_unit || "natë",
      description: editDest.description || "", emoji: editDest.emoji || "🏔️",
      badge: editDest.badge || null, rating: editDest.rating || 4.8,
      review_count: editDest.review_count || 0, featured: editDest.featured ?? false,
      status: editDest.status || "active", image_gradient: editDest.image_gradient || "",
    };
    const { error } = editDest.id
      ? await supabase.from("destinations").update(payload).eq("id", editDest.id)
      : await supabase.from("destinations").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editDest.id ? "Përditësuar!" : "Shtuar!"); setEditDest(null); fetchAll(); }
  };

  const saveEvent = async () => {
    if (!editEvent) return;
    const payload = {
      title: editEvent.title || "", type: editEvent.type || "festival",
      start_date: editEvent.start_date || new Date().toISOString().split("T")[0],
      end_date: editEvent.end_date || null, location: editEvent.location || "",
      zone: editEvent.zone || "", description: editEvent.description || "",
      emoji: editEvent.emoji || "🎉", price: editEvent.price || 0,
      price_note: editEvent.price_note || "Falas", featured: editEvent.featured ?? false,
      status: editEvent.status || "upcoming",
    };
    const { error } = editEvent.id
      ? await supabase.from("events").update(payload).eq("id", editEvent.id)
      : await supabase.from("events").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editEvent.id ? "Përditësuar!" : "Shtuar!"); setEditEvent(null); fetchAll(); }
  };

  const saveTour = async () => {
    if (!editTour) return;
    const payload = {
      title: editTour.title || "", duration_category: editTour.duration_category || "day",
      price: editTour.price || 0, duration: editTour.duration || "1 ditë",
      difficulty: editTour.difficulty || "Easy", zone: editTour.zone || "",
      description: editTour.description || "", emoji: editTour.emoji || "🧭",
      featured: editTour.featured ?? false, status: editTour.status || "active",
    };
    const { error } = editTour.id
      ? await supabase.from("tours").update(payload).eq("id", editTour.id)
      : await supabase.from("tours").insert(payload);
    if (error) toast.error(error.message);
    else { toast.success(editTour.id ? "Përditësuar!" : "Shtuar!"); setEditTour(null); fetchAll(); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const { error } = await supabase.from(deleteId.table as any).delete().eq("id", deleteId.id);
    if (error) toast.error(error.message);
    else { toast.success("Fshirë!"); setDeleteId(null); fetchAll(); }
  };

  const updateBookingStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Statusi: ${status}`); fetchAll(); }
  };

  // ── Chat admin helpers ──────────────────────────────
  const togglePin = async (id: string, pinned: boolean) => {
    await (supabase.from("chat_messages" as any).update({ is_pinned: !pinned }).eq("id", id) as any);
    fetchChat();
  };
  const softDelete = async (id: string) => {
    await (supabase.from("chat_messages" as any).update({ deleted: true }).eq("id", id) as any);
    toast.success("Mesazhi u fshi"); fetchChat();
  };
  const markAdmin = async (id: string) => {
    await (supabase.from("chat_messages" as any).update({ is_admin: true }).eq("id", id) as any);
    toast.success("Marked as admin"); fetchChat();
  };
  const clearAll = async () => {
    if (!confirm("Jeni të sigurt? Kjo do fshijë të gjitha mesazhet.")) return;
    await (supabase.from("chat_messages" as any).update({ deleted: true }).neq("id", "00000000-0000-0000-0000-000000000000") as any);
    toast.success("Të gjitha mesazhet u fshinë"); fetchChat();
  };

  // ── Settings helpers ────────────────────────────────
  const updateSetting = (key: string, value: string) => {
    setSiteSettings((prev) => ({ ...prev, [key]: value }));
  };
  const saveSettings = async () => {
    setSavingSettings(true);
    for (const [key, value] of Object.entries(siteSettings)) {
      await (supabase.from("site_settings" as any).upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" }) as any);
    }
    toast.success("Cilësimet u ruajtën!");
    setSavingSettings(false);
  };

  const pendingBookings = bookings.filter((b) => b.status === "pending").length;
  const totalChat = chatMessages.length;
  const deletedChat = chatMessages.filter((m) => m.deleted).length;
  const pinnedChat = chatMessages.filter((m) => m.is_pinned).length;
  const todayChat = chatMessages.filter((m) => {
    const d = new Date(m.created_at);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  }).length;

  const filteredChat = showDeleted ? chatMessages : chatMessages.filter((m) => !m.deleted);

  const handleImageUpload = async (destId: string, file: File) => {
    const ext = file.name.split(".").pop();
    const path = `destinations/${destId}.${ext}`;
    const { error: uploadError } = await supabase.storage.from("fshati-images").upload(path, file, { upsert: true });
    if (uploadError) { toast.error(uploadError.message); return; }
    const { data: { publicUrl } } = supabase.storage.from("fshati-images").getPublicUrl(path);
    const { error } = await supabase.from("destinations").update({ image_url: publicUrl } as any).eq("id", destId);
    if (error) toast.error(error.message);
    else { toast.success("Foto u ngarkua!"); fetchAll(); }
  };

  // ── Render ──────────────────────────────────────────
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#F8F4ED" }}>
      {/* Sidebar */}
      <aside className="w-64 min-h-screen flex-shrink-0 flex flex-col" style={{ backgroundColor: "#1C3D2E" }}>
        <div className="p-6">
          <h1 className="font-heading text-xl font-bold text-cream">🏔️ Fshati<span className="text-seafoam">.al</span></h1>
          <p className="text-xs text-cream/50 mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {sidebarItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setTab(item.key)}
              className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                tab === item.key ? "text-cream" : "text-cream/60 hover:text-cream hover:bg-white/5"
              }`}
              style={tab === item.key ? { backgroundColor: "#2D5A3D" } : {}}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-3">
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium text-cream/60 hover:text-cream hover:bg-white/5 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> ⬅️ Kthehu
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-8 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {/* Dashboard */}
            {tab === "dashboard" && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Dashboard</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
                  {[
                    { label: "Destinacione", value: destinations.length, emoji: "🏔️" },
                    { label: "Evente", value: events.filter((e) => e.status === "upcoming").length, emoji: "🎉" },
                    { label: "Ture", value: tours.length, emoji: "🧭" },
                    { label: "Rezervime Pending", value: pendingBookings, emoji: "📋" },
                    { label: "Mesazhe Chat", value: totalChat - deletedChat, emoji: "💬" },
                    { label: "Mesazhe Sot", value: todayChat, emoji: "📅" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white rounded-xl p-6 shadow-sm border border-border">
                      <p className="text-3xl mb-2">{s.emoji}</p>
                      <p className="text-3xl font-bold text-foreground">{s.value}</p>
                      <p className="text-sm text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Destinations Tab */}
            {tab === "destinations" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Destinacione</h2>
                  <Button onClick={() => setEditDest({ emoji: "🏔️", type: "agro", price_unit: "natë", rating: 4.8, status: "active", featured: false })} className="bg-forest hover:bg-pine text-cream">
                    <Plus className="h-4 w-4 mr-1" /> Shto Destinacion
                  </Button>
                </div>
                <div className="bg-white rounded-xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#D4EDE0" }}>
                        <TableHead></TableHead><TableHead>Emri</TableHead><TableHead>Zona</TableHead>
                        <TableHead>Lloji</TableHead><TableHead>Çmimi</TableHead><TableHead>Rating</TableHead>
                        <TableHead>Featured</TableHead><TableHead>Statusi</TableHead><TableHead>Veprimet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {destinations.map((d) => (
                        <TableRow key={d.id}>
                          <TableCell>{d.emoji}</TableCell>
                          <TableCell className="font-medium">{d.name}</TableCell>
                          <TableCell>{d.zone}</TableCell>
                          <TableCell className="capitalize">{d.type}</TableCell>
                          <TableCell>€{d.price}/{d.price_unit}</TableCell>
                          <TableCell>⭐ {d.rating}</TableCell>
                          <TableCell>{d.featured ? "✅" : "—"}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${d.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{d.status}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setEditDest(d)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" className="relative" title="Upload foto">
                                <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => { if (e.target.files?.[0]) handleImageUpload(d.id, e.target.files[0]); }} />
                                {(d as any).image_url ? <Image className="h-4 w-4 text-green-600" /> : <Upload className="h-4 w-4" />}
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId({ table: "destinations", id: d.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Events Tab */}
            {tab === "events" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Evente</h2>
                  <Button onClick={() => setEditEvent({ emoji: "🎉", type: "festival", status: "upcoming", featured: false, price: 0, price_note: "Falas" })} className="bg-forest hover:bg-pine text-cream">
                    <Plus className="h-4 w-4 mr-1" /> Shto Event
                  </Button>
                </div>
                <div className="bg-white rounded-xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#D4EDE0" }}>
                        <TableHead></TableHead><TableHead>Titulli</TableHead><TableHead>Lloji</TableHead>
                        <TableHead>Data Fillimit</TableHead><TableHead>Lokacioni</TableHead><TableHead>Çmimi</TableHead>
                        <TableHead>Featured</TableHead><TableHead>Statusi</TableHead><TableHead>Veprimet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {events.map((ev) => (
                        <TableRow key={ev.id}>
                          <TableCell>{ev.emoji}</TableCell>
                          <TableCell className="font-medium">{ev.title}</TableCell>
                          <TableCell className="capitalize">{ev.type}</TableCell>
                          <TableCell>{ev.start_date}</TableCell>
                          <TableCell>{ev.location}</TableCell>
                          <TableCell>{ev.price_note}</TableCell>
                          <TableCell>{ev.featured ? "✅" : "—"}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${ev.status === "upcoming" ? "bg-blue-100 text-blue-700" : "bg-muted text-muted-foreground"}`}>{ev.status}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setEditEvent(ev)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId({ table: "events", id: ev.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Tours Tab */}
            {tab === "tours" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Ture</h2>
                  <Button onClick={() => setEditTour({ emoji: "🧭", duration_category: "day", difficulty: "Easy", status: "active", featured: false })} className="bg-forest hover:bg-pine text-cream">
                    <Plus className="h-4 w-4 mr-1" /> Shto Tur
                  </Button>
                </div>
                <div className="bg-white rounded-xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#D4EDE0" }}>
                        <TableHead></TableHead><TableHead>Titulli</TableHead><TableHead>Kategoria</TableHead>
                        <TableHead>Çmimi</TableHead><TableHead>Kohëzgjatja</TableHead><TableHead>Vështirësia</TableHead>
                        <TableHead>Zona</TableHead><TableHead>Statusi</TableHead><TableHead>Veprimet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tours.map((t) => (
                        <TableRow key={t.id}>
                          <TableCell>{t.emoji}</TableCell>
                          <TableCell className="font-medium">{t.title}</TableCell>
                          <TableCell>{t.duration_category}</TableCell>
                          <TableCell>€{t.price}</TableCell>
                          <TableCell>{t.duration}</TableCell>
                          <TableCell>{t.difficulty}</TableCell>
                          <TableCell>{t.zone}</TableCell>
                          <TableCell>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${t.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>{t.status}</span>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => setEditTour(t)}><Pencil className="h-4 w-4" /></Button>
                              <Button variant="ghost" size="icon" onClick={() => setDeleteId({ table: "tours", id: t.id })}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {tab === "bookings" && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Rezervime</h2>
                <div className="bg-white rounded-xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#D4EDE0" }}>
                        <TableHead>Data</TableHead><TableHead>Emri</TableHead><TableHead>Email</TableHead>
                        <TableHead>Destinacioni</TableHead><TableHead>Check-in</TableHead><TableHead>Check-out</TableHead>
                        <TableHead>Persona</TableHead><TableHead>Totali</TableHead><TableHead>Statusi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookings.map((b) => (
                        <TableRow key={b.id}>
                          <TableCell className="text-xs">{new Date(b.created_at).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{b.full_name || b.item_name || "—"}</TableCell>
                          <TableCell>{b.email || "—"}</TableCell>
                          <TableCell>{b.destination_name || b.item_name || "—"}</TableCell>
                          <TableCell>{b.check_in || "—"}</TableCell>
                          <TableCell>{b.check_out || "—"}</TableCell>
                          <TableCell>{b.guests}</TableCell>
                          <TableCell>{b.total_price ? `€${b.total_price}` : "—"}</TableCell>
                          <TableCell>
                            <Select value={b.status} onValueChange={(v) => updateBookingStatus(b.id, v)}>
                              <SelectTrigger className={`w-[130px] text-xs font-medium ${
                                b.status === "pending" ? "bg-yellow-100 text-yellow-800 border-yellow-200" :
                                b.status === "confirmed" ? "bg-green-100 text-green-700 border-green-200" :
                                "bg-red-100 text-red-700 border-red-200"
                              }`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="confirmed">Confirmed</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                      {bookings.length === 0 && (
                        <TableRow><TableCell colSpan={9} className="text-center py-8 text-muted-foreground">Nuk ka rezervime ende.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Chat Admin Tab */}
            {tab === "chat" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-2xl font-bold text-foreground">Chat Moderation</h2>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">Total: {totalChat}</span>
                      <span className="text-muted-foreground">Fshira: {deletedChat}</span>
                      <span className="text-muted-foreground">📌 {pinnedChat}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={showDeleted} onCheckedChange={setShowDeleted} />
                      <Label className="text-sm">Shfaq të fshirat</Label>
                    </div>
                    <Button variant="destructive" size="sm" onClick={clearAll}>
                      <Trash2 className="h-4 w-4 mr-1" /> Pastro të gjitha
                    </Button>
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow style={{ backgroundColor: "#D4EDE0" }}>
                        <TableHead>🏳️</TableHead><TableHead>Përdoruesi</TableHead><TableHead>Mesazhi</TableHead>
                        <TableHead>Ora</TableHead><TableHead>Status</TableHead><TableHead>Veprimet</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredChat.map((m) => (
                        <TableRow key={m.id} className={m.deleted ? "opacity-40" : ""}>
                          <TableCell>{m.country_flag}</TableCell>
                          <TableCell className="font-medium">
                            {m.username}
                            {m.is_admin && <span className="ml-1 text-xs bg-yellow-400/80 text-yellow-900 px-1.5 rounded font-bold">⭐</span>}
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{m.message}</TableCell>
                          <TableCell className="text-xs">{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                          <TableCell>
                            {m.deleted && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">Fshirë</span>}
                            {m.is_pinned && <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded">📌 Pinned</span>}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" onClick={() => togglePin(m.id, m.is_pinned)} title={m.is_pinned ? "Unpin" : "Pin"}>
                                {m.is_pinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
                              </Button>
                              {!m.deleted && (
                                <Button variant="ghost" size="icon" onClick={() => softDelete(m.id)} title="Fshi">
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              )}
                              {!m.is_admin && (
                                <Button variant="ghost" size="icon" onClick={() => markAdmin(m.id)} title="Mark Admin">
                                  <Star className="h-4 w-4 text-yellow-500" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                      {filteredChat.length === 0 && (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Nuk ka mesazhe.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {tab === "settings" && (
              <div>
                <h2 className="font-heading text-2xl font-bold text-foreground mb-6">Cilësimet e Sajtit</h2>
                <div className="bg-white rounded-xl border border-border p-6 max-w-2xl space-y-5">
                  <div>
                    <Label>Hero Headline</Label>
                    <Input value={siteSettings.hero_headline || ""} onChange={(e) => updateSetting("hero_headline", e.target.value)} className="mt-1" />
                  </div>
                  <div>
                    <Label>Hero Subheadline</Label>
                    <Input value={siteSettings.hero_sub || ""} onChange={(e) => updateSetting("hero_sub", e.target.value)} className="mt-1" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Newsletter Subscriber Count</Label>
                      <Input type="number" value={siteSettings.subscriber_count || ""} onChange={(e) => updateSetting("subscriber_count", e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Online Chat Label</Label>
                      <Input value={siteSettings.online_label || ""} onChange={(e) => updateSetting("online_label", e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>WhatsApp</Label>
                      <Input value={siteSettings.whatsapp || ""} onChange={(e) => updateSetting("whatsapp", e.target.value)} className="mt-1" />
                    </div>
                    <div>
                      <Label>Email Contact</Label>
                      <Input value={siteSettings.email || ""} onChange={(e) => updateSetting("email", e.target.value)} className="mt-1" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <Switch checked={siteSettings.show_events === "true"} onCheckedChange={(v) => updateSetting("show_events", v ? "true" : "false")} />
                      <Label>Shfaq Events Section</Label>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={siteSettings.show_guides === "true"} onCheckedChange={(v) => updateSetting("show_guides", v ? "true" : "false")} />
                      <Label>Shfaq Guides Section</Label>
                    </div>
                  </div>
                  <div>
                    <Label>Default Language</Label>
                    <Select value={siteSettings.default_language || "sq"} onValueChange={(v) => updateSetting("default_language", v)}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sq">🇦🇱 Shqip (SQ)</SelectItem>
                        <SelectItem value="en">🇬🇧 English (EN)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Maintenance Mode Message (bosh = çaktivizuar)</Label>
                    <Textarea value={siteSettings.maintenance_message || ""} onChange={(e) => updateSetting("maintenance_message", e.target.value)} rows={2} className="mt-1" placeholder="Sajti është në mirëmbajtje..." />
                  </div>
                  <Button onClick={saveSettings} disabled={savingSettings} className="bg-forest hover:bg-pine text-cream">
                    {savingSettings ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Ruaj Ndryshimet
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Destination Form Modal ─────────────────── */}
        <Dialog open={!!editDest} onOpenChange={(v) => !v && setEditDest(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">{editDest?.id ? "Ndrysho" : "Shto"} Destinacion</DialogTitle></DialogHeader>
            {editDest && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Emri</Label><Input value={editDest.name || ""} onChange={(e) => setEditDest({ ...editDest, name: e.target.value })} className="mt-1" /></div>
                  <div><Label>Emoji</Label><Input value={editDest.emoji || ""} onChange={(e) => setEditDest({ ...editDest, emoji: e.target.value })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Lloji</Label>
                    <Select value={editDest.type || "agro"} onValueChange={(v) => setEditDest({ ...editDest, type: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["agro", "hotel", "wine", "beach", "cultural"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Zona</Label><Input value={editDest.zone || ""} onChange={(e) => setEditDest({ ...editDest, zone: e.target.value })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div><Label>Çmimi</Label><Input type="number" value={editDest.price || 0} onChange={(e) => setEditDest({ ...editDest, price: Number(e.target.value) })} className="mt-1" /></div>
                  <div>
                    <Label>Njësia</Label>
                    <Select value={editDest.price_unit || "natë"} onValueChange={(v) => setEditDest({ ...editDest, price_unit: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["natë", "person", "group"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Rating</Label><Input type="number" step="0.1" value={editDest.rating || 4.8} onChange={(e) => setEditDest({ ...editDest, rating: Number(e.target.value) })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Badge</Label><Input value={editDest.badge || ""} onChange={(e) => setEditDest({ ...editDest, badge: e.target.value })} className="mt-1" /></div>
                  <div>
                    <Label>Statusi</Label>
                    <Select value={editDest.status || "active"} onValueChange={(v) => setEditDest({ ...editDest, status: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Përshkrimi</Label><Textarea value={editDest.description || ""} onChange={(e) => setEditDest({ ...editDest, description: e.target.value })} rows={3} className="mt-1" /></div>
                <div><Label>Image Gradient (CSS)</Label><Input value={editDest.image_gradient || ""} onChange={(e) => setEditDest({ ...editDest, image_gradient: e.target.value })} className="mt-1" placeholder="linear-gradient(135deg,#1a4a2e,#0d2b3e)" /></div>
                <div className="flex items-center gap-3">
                  <Switch checked={editDest.featured ?? false} onCheckedChange={(v) => setEditDest({ ...editDest, featured: v })} />
                  <Label>Featured</Label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveDest} className="bg-forest hover:bg-pine text-cream">Ruaj</Button>
                  <Button variant="outline" onClick={() => setEditDest(null)}>Anulo</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Event Form Modal ───────────────────────── */}
        <Dialog open={!!editEvent} onOpenChange={(v) => !v && setEditEvent(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">{editEvent?.id ? "Ndrysho" : "Shto"} Event</DialogTitle></DialogHeader>
            {editEvent && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Titulli</Label><Input value={editEvent.title || ""} onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })} className="mt-1" /></div>
                  <div><Label>Emoji</Label><Input value={editEvent.emoji || ""} onChange={(e) => setEditEvent({ ...editEvent, emoji: e.target.value })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Lloji</Label>
                    <Select value={editEvent.type || "festival"} onValueChange={(v) => setEditEvent({ ...editEvent, type: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["festival", "market", "concert", "sport", "cultural", "food"].map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Lokacioni</Label><Input value={editEvent.location || ""} onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Data Fillimit</Label><Input type="date" value={editEvent.start_date || ""} onChange={(e) => setEditEvent({ ...editEvent, start_date: e.target.value })} className="mt-1" /></div>
                  <div><Label>Data Mbarimit</Label><Input type="date" value={editEvent.end_date || ""} onChange={(e) => setEditEvent({ ...editEvent, end_date: e.target.value || null })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Zona</Label><Input value={editEvent.zone || ""} onChange={(e) => setEditEvent({ ...editEvent, zone: e.target.value })} className="mt-1" /></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div><Label>Çmimi</Label><Input type="number" value={editEvent.price || 0} onChange={(e) => setEditEvent({ ...editEvent, price: Number(e.target.value) })} className="mt-1" /></div>
                    <div><Label>Shënim</Label><Input value={editEvent.price_note || ""} onChange={(e) => setEditEvent({ ...editEvent, price_note: e.target.value })} className="mt-1" /></div>
                  </div>
                </div>
                <div><Label>Përshkrimi</Label><Textarea value={editEvent.description || ""} onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })} rows={3} className="mt-1" /></div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Statusi</Label>
                    <Select value={editEvent.status || "upcoming"} onValueChange={(v) => setEditEvent({ ...editEvent, status: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="upcoming">Upcoming</SelectItem>
                        <SelectItem value="ongoing">Ongoing</SelectItem>
                        <SelectItem value="past">Past</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-3 mt-6">
                    <Switch checked={editEvent.featured ?? false} onCheckedChange={(v) => setEditEvent({ ...editEvent, featured: v })} />
                    <Label>Featured</Label>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveEvent} className="bg-forest hover:bg-pine text-cream">Ruaj</Button>
                  <Button variant="outline" onClick={() => setEditEvent(null)}>Anulo</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Tour Form Modal ────────────────────────── */}
        <Dialog open={!!editTour} onOpenChange={(v) => !v && setEditTour(null)}>
          <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle className="font-heading">{editTour?.id ? "Ndrysho" : "Shto"} Tur</DialogTitle></DialogHeader>
            {editTour && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Titulli</Label><Input value={editTour.title || ""} onChange={(e) => setEditTour({ ...editTour, title: e.target.value })} className="mt-1" /></div>
                  <div><Label>Emoji</Label><Input value={editTour.emoji || ""} onChange={(e) => setEditTour({ ...editTour, emoji: e.target.value })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Kategoria</Label>
                    <Select value={editTour.duration_category || "day"} onValueChange={(v) => setEditTour({ ...editTour, duration_category: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day</SelectItem>
                        <SelectItem value="3-4days">3-4 Days</SelectItem>
                        <SelectItem value="5-7days">5-7 Days</SelectItem>
                        <SelectItem value="10-11days">10-11 Days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Çmimi (€)</Label><Input type="number" value={editTour.price || 0} onChange={(e) => setEditTour({ ...editTour, price: Number(e.target.value) })} className="mt-1" /></div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Kohëzgjatja</Label><Input value={editTour.duration || ""} onChange={(e) => setEditTour({ ...editTour, duration: e.target.value })} className="mt-1" /></div>
                  <div>
                    <Label>Vështirësia</Label>
                    <Select value={editTour.difficulty || "Easy"} onValueChange={(v) => setEditTour({ ...editTour, difficulty: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Zona</Label><Input value={editTour.zone || ""} onChange={(e) => setEditTour({ ...editTour, zone: e.target.value })} className="mt-1" /></div>
                  <div>
                    <Label>Statusi</Label>
                    <Select value={editTour.status || "active"} onValueChange={(v) => setEditTour({ ...editTour, status: v })}>
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label>Përshkrimi</Label><Textarea value={editTour.description || ""} onChange={(e) => setEditTour({ ...editTour, description: e.target.value })} rows={3} className="mt-1" /></div>
                <div className="flex items-center gap-3">
                  <Switch checked={editTour.featured ?? false} onCheckedChange={(v) => setEditTour({ ...editTour, featured: v })} />
                  <Label>Featured</Label>
                </div>
                <div className="flex gap-3">
                  <Button onClick={saveTour} className="bg-forest hover:bg-pine text-cream">Ruaj</Button>
                  <Button variant="outline" onClick={() => setEditTour(null)}>Anulo</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* ── Delete Confirmation ────────────────────── */}
        <Dialog open={!!deleteId} onOpenChange={(v) => !v && setDeleteId(null)}>
          <DialogContent className="sm:max-w-sm">
            <DialogHeader><DialogTitle className="font-heading">Konfirmo Fshirjen</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">Jeni të sigurt? Ky veprim nuk mund të kthehet.</p>
            <div className="flex gap-3 mt-4">
              <Button variant="destructive" onClick={handleDelete}>Fshi</Button>
              <Button variant="outline" onClick={() => setDeleteId(null)}>Anulo</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default AdminPanel;
