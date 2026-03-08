import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Home, LogOut, Check, X, Plus, Edit2, Trash2, Save } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Booking = Tables<"bookings">;
type Tour = Tables<"tours">;
type Accommodation = Tables<"accommodations">;
type Guide = Tables<"guides">;

const AdminPanel = () => {
  const { user, loading: authLoading, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [tours, setTours] = useState<Tour[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("bookings");

  // Edit states
  const [editingTour, setEditingTour] = useState<Partial<Tour> | null>(null);
  const [editingAcc, setEditingAcc] = useState<Partial<Accommodation> | null>(null);
  const [editingGuide, setEditingGuide] = useState<Partial<Guide> | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !hasRole("admin"))) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, authLoading, hasRole, navigate]);

  useEffect(() => {
    if (user && hasRole("admin")) fetchAll();
  }, [user]);

  const fetchAll = async () => {
    setLoading(true);
    const [b, t, a, g] = await Promise.all([
      supabase.from("bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("tours").select("*").order("created_at", { ascending: false }),
      supabase.from("accommodations").select("*").order("created_at", { ascending: false }),
      supabase.from("guides").select("*").order("created_at", { ascending: false }),
    ]);
    setBookings(b.data || []);
    setTours(t.data || []);
    setAccommodations(a.data || []);
    setGuides(g.data || []);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Booking ${status}`); fetchAll(); }
  };

  // === TOUR CRUD ===
  const newTour = (): Partial<Tour> => ({
    title: "", description: "", price: 0, duration: "1 ditë", duration_category: "day-trip",
    difficulty: "easy", emoji: "🏔️", zone: "", includes: [], is_active: true,
  });

  const saveTour = async () => {
    if (!editingTour) return;
    const data = {
      title: editingTour.title || "",
      description: editingTour.description || "",
      price: editingTour.price || 0,
      duration: editingTour.duration || "1 ditë",
      duration_category: editingTour.duration_category || "day-trip",
      difficulty: editingTour.difficulty || "easy",
      emoji: editingTour.emoji || "🏔️",
      zone: editingTour.zone || "",
      includes: editingTour.includes || [],
      is_active: editingTour.is_active ?? true,
    };
    if (editingTour.id) {
      const { error } = await supabase.from("tours").update(data).eq("id", editingTour.id);
      if (error) toast.error(error.message); else toast.success("Tour updated!");
    } else {
      const { error } = await supabase.from("tours").insert(data);
      if (error) toast.error(error.message); else toast.success("Tour created!");
    }
    setEditingTour(null);
    fetchAll();
  };

  const deleteTour = async (id: string) => {
    const { error } = await supabase.from("tours").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Tour deleted!"); fetchAll(); }
  };

  // === ACCOMMODATION CRUD ===
  const newAcc = (): Partial<Accommodation> => ({
    name: "", description: "", location: "", type: "guesthouse", price_per_night: 0,
    amenities: [], images: [], is_active: true, owner_id: user!.id,
  });

  const saveAcc = async () => {
    if (!editingAcc) return;
    const data = {
      name: editingAcc.name || "",
      description: editingAcc.description || "",
      location: editingAcc.location || "",
      type: editingAcc.type || "guesthouse",
      price_per_night: editingAcc.price_per_night || 0,
      amenities: editingAcc.amenities || [],
      images: editingAcc.images || [],
      is_active: editingAcc.is_active ?? true,
      owner_id: editingAcc.owner_id || user!.id,
    };
    if (editingAcc.id) {
      const { error } = await supabase.from("accommodations").update(data).eq("id", editingAcc.id);
      if (error) toast.error(error.message); else toast.success("Accommodation updated!");
    } else {
      const { error } = await supabase.from("accommodations").insert(data);
      if (error) toast.error(error.message); else toast.success("Accommodation created!");
    }
    setEditingAcc(null);
    fetchAll();
  };

  const deleteAcc = async (id: string) => {
    const { error } = await supabase.from("accommodations").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted!"); fetchAll(); }
  };

  // === GUIDE CRUD ===
  const newGuide = (): Partial<Guide> => ({
    name: "", bio: "", specialization: "hiking", price_per_day: 0, avatar_emoji: "🧭",
    languages: [], zones: [], is_active: true,
  });

  const saveGuide = async () => {
    if (!editingGuide) return;
    const data = {
      name: editingGuide.name || "",
      bio: editingGuide.bio || "",
      specialization: editingGuide.specialization || "hiking",
      price_per_day: editingGuide.price_per_day || 0,
      price_max: editingGuide.price_max || null,
      avatar_emoji: editingGuide.avatar_emoji || "🧭",
      languages: editingGuide.languages || [],
      zones: editingGuide.zones || [],
      is_active: editingGuide.is_active ?? true,
    };
    if (editingGuide.id) {
      const { error } = await supabase.from("guides").update(data).eq("id", editingGuide.id);
      if (error) toast.error(error.message); else toast.success("Guide updated!");
    } else {
      const { error } = await supabase.from("guides").insert(data);
      if (error) toast.error(error.message); else toast.success("Guide created!");
    }
    setEditingGuide(null);
    fetchAll();
  };

  const deleteGuide = async (id: string) => {
    const { error } = await supabase.from("guides").delete().eq("id", id);
    if (error) toast.error(error.message); else { toast.success("Deleted!"); fetchAll(); }
  };

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚙️</span>
          <h1 className="font-heading text-xl font-bold text-foreground">Admin Panel</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-1" /> Home</Button>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1" /> Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="bookings">Bookings ({bookings.length})</TabsTrigger>
            <TabsTrigger value="tours">Tours ({tours.length})</TabsTrigger>
            <TabsTrigger value="accommodations">Accommodations ({accommodations.length})</TabsTrigger>
            <TabsTrigger value="guides">Guides ({guides.length})</TabsTrigger>
          </TabsList>

          {/* BOOKINGS TAB */}
          <TabsContent value="bookings">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">All Bookings</h2>
              <div className="flex gap-2">
                {["all", "pending", "approved", "rejected"].map((s) => (
                  <button key={s} onClick={() => setFilter(s)}
                    className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                      filter === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {s.charAt(0).toUpperCase() + s.slice(1)} ({s === "all" ? bookings.length : bookings.filter((b) => b.status === s).length})
                  </button>
                ))}
              </div>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-12 bg-card rounded-xl border border-border">
                <p className="text-muted-foreground">No bookings found.</p>
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-3 font-medium text-muted-foreground">Type</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Check-in</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Check-out</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Guests</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                      <th className="text-left p-3 font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((b) => (
                      <tr key={b.id} className="border-t border-border hover:bg-muted/30">
                        <td className="p-3 capitalize">{b.item_type}</td>
                        <td className="p-3 font-medium">{b.item_name}</td>
                        <td className="p-3">{b.check_in}</td>
                        <td className="p-3">{b.check_out || "—"}</td>
                        <td className="p-3">{b.guests}</td>
                        <td className="p-3 font-semibold">€{b.total_price}</td>
                        <td className="p-3">
                          <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                            b.status === "approved" ? "bg-accent/20 text-accent-foreground" :
                            b.status === "rejected" ? "bg-destructive/20 text-destructive" :
                            b.status === "cancelled" ? "bg-muted text-muted-foreground" :
                            "bg-primary/10 text-primary"
                          }`}>{b.status}</span>
                        </td>
                        <td className="p-3">
                          {b.status === "pending" && (
                            <div className="flex gap-1">
                              <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(b.id, "approved")} className="text-accent-foreground">
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => updateBookingStatus(b.id, "rejected")} className="text-destructive">
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          {/* TOURS TAB */}
          <TabsContent value="tours">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Manage Tours</h2>
              <Button onClick={() => setEditingTour(newTour())}><Plus className="h-4 w-4 mr-1" /> Add Tour</Button>
            </div>

            {editingTour && (
              <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold">{editingTour.id ? "Edit" : "New"} Tour</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Title</Label><Input value={editingTour.title || ""} onChange={(e) => setEditingTour({ ...editingTour, title: e.target.value })} /></div>
                  <div><Label>Emoji</Label><Input value={editingTour.emoji || ""} onChange={(e) => setEditingTour({ ...editingTour, emoji: e.target.value })} /></div>
                  <div><Label>Price (€)</Label><Input type="number" value={editingTour.price || 0} onChange={(e) => setEditingTour({ ...editingTour, price: Number(e.target.value) })} /></div>
                  <div><Label>Duration</Label><Input value={editingTour.duration || ""} onChange={(e) => setEditingTour({ ...editingTour, duration: e.target.value })} /></div>
                  <div>
                    <Label>Category</Label>
                    <Select value={editingTour.duration_category || "day-trip"} onValueChange={(v) => setEditingTour({ ...editingTour, duration_category: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day-trip">Day Trip</SelectItem>
                        <SelectItem value="multi-day">Multi-Day</SelectItem>
                        <SelectItem value="half-day">Half Day</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Difficulty</Label>
                    <Select value={editingTour.difficulty || "easy"} onValueChange={(v) => setEditingTour({ ...editingTour, difficulty: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="moderate">Moderate</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Zone</Label><Input value={editingTour.zone || ""} onChange={(e) => setEditingTour({ ...editingTour, zone: e.target.value })} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={editingTour.description || ""} onChange={(e) => setEditingTour({ ...editingTour, description: e.target.value })} rows={3} /></div>
                <div><Label>Includes (comma-separated)</Label><Input value={(editingTour.includes || []).join(", ")} onChange={(e) => setEditingTour({ ...editingTour, includes: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></div>
                <div className="flex gap-3">
                  <Button onClick={saveTour}><Save className="h-4 w-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => setEditingTour(null)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {tours.map((t) => (
                <div key={t.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{t.emoji}</span>
                      <span className="font-semibold text-foreground">{t.title}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${t.is_active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {t.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{t.zone} · €{t.price} · {t.duration} · {t.difficulty}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingTour(t)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteTour(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* ACCOMMODATIONS TAB */}
          <TabsContent value="accommodations">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Manage Accommodations</h2>
              <Button onClick={() => setEditingAcc(newAcc())}><Plus className="h-4 w-4 mr-1" /> Add Accommodation</Button>
            </div>

            {editingAcc && (
              <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold">{editingAcc.id ? "Edit" : "New"} Accommodation</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={editingAcc.name || ""} onChange={(e) => setEditingAcc({ ...editingAcc, name: e.target.value })} /></div>
                  <div>
                    <Label>Type</Label>
                    <Select value={editingAcc.type || "guesthouse"} onValueChange={(v) => setEditingAcc({ ...editingAcc, type: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="agritourism">Agritourism</SelectItem>
                        <SelectItem value="boutique_hotel">Boutique Hotel</SelectItem>
                        <SelectItem value="guesthouse">Guesthouse</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Location</Label><Input value={editingAcc.location || ""} onChange={(e) => setEditingAcc({ ...editingAcc, location: e.target.value })} /></div>
                  <div><Label>Price/Night (€)</Label><Input type="number" value={editingAcc.price_per_night || 0} onChange={(e) => setEditingAcc({ ...editingAcc, price_per_night: Number(e.target.value) })} /></div>
                </div>
                <div><Label>Description</Label><Textarea value={editingAcc.description || ""} onChange={(e) => setEditingAcc({ ...editingAcc, description: e.target.value })} rows={3} /></div>
                <div><Label>Amenities (comma-separated)</Label><Input value={(editingAcc.amenities || []).join(", ")} onChange={(e) => setEditingAcc({ ...editingAcc, amenities: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></div>
                <div className="flex gap-3">
                  <Button onClick={saveAcc}><Save className="h-4 w-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => setEditingAcc(null)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {accommodations.map((a) => (
                <div key={a.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span>{a.type === "agritourism" ? "🌿" : a.type === "boutique_hotel" ? "🏨" : a.type === "villa" ? "🏡" : "🏠"}</span>
                      <span className="font-semibold text-foreground">{a.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${a.is_active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {a.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{a.location} · €{a.price_per_night}/night · {a.type}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingAcc(a)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAcc(a.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          {/* GUIDES TAB */}
          <TabsContent value="guides">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading text-xl font-semibold text-foreground">Manage Guides</h2>
              <Button onClick={() => setEditingGuide(newGuide())}><Plus className="h-4 w-4 mr-1" /> Add Guide</Button>
            </div>

            {editingGuide && (
              <div className="bg-card rounded-xl border border-border p-6 mb-6 space-y-4">
                <h3 className="font-heading text-lg font-semibold">{editingGuide.id ? "Edit" : "New"} Guide</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Name</Label><Input value={editingGuide.name || ""} onChange={(e) => setEditingGuide({ ...editingGuide, name: e.target.value })} /></div>
                  <div><Label>Emoji</Label><Input value={editingGuide.avatar_emoji || ""} onChange={(e) => setEditingGuide({ ...editingGuide, avatar_emoji: e.target.value })} /></div>
                  <div><Label>Specialization</Label><Input value={editingGuide.specialization || ""} onChange={(e) => setEditingGuide({ ...editingGuide, specialization: e.target.value })} /></div>
                  <div><Label>Price/Day (€)</Label><Input type="number" value={editingGuide.price_per_day || 0} onChange={(e) => setEditingGuide({ ...editingGuide, price_per_day: Number(e.target.value) })} /></div>
                  <div><Label>Max Price (€)</Label><Input type="number" value={editingGuide.price_max || ""} onChange={(e) => setEditingGuide({ ...editingGuide, price_max: e.target.value ? Number(e.target.value) : null })} /></div>
                </div>
                <div><Label>Bio</Label><Textarea value={editingGuide.bio || ""} onChange={(e) => setEditingGuide({ ...editingGuide, bio: e.target.value })} rows={3} /></div>
                <div><Label>Languages (comma-separated)</Label><Input value={(editingGuide.languages || []).join(", ")} onChange={(e) => setEditingGuide({ ...editingGuide, languages: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></div>
                <div><Label>Zones (comma-separated)</Label><Input value={(editingGuide.zones || []).join(", ")} onChange={(e) => setEditingGuide({ ...editingGuide, zones: e.target.value.split(",").map(s => s.trim()).filter(Boolean) })} /></div>
                <div className="flex gap-3">
                  <Button onClick={saveGuide}><Save className="h-4 w-4 mr-1" /> Save</Button>
                  <Button variant="outline" onClick={() => setEditingGuide(null)}>Cancel</Button>
                </div>
              </div>
            )}

            <div className="space-y-3">
              {guides.map((g) => (
                <div key={g.id} className="bg-card rounded-xl border border-border p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{g.avatar_emoji}</span>
                      <span className="font-semibold text-foreground">{g.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${g.is_active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                        {g.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{g.specialization} · €{g.price_per_day}/day · {(g.languages || []).join(", ")}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => setEditingGuide(g)}><Edit2 className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteGuide(g.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
