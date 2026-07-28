import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Edit2, Trash2, LogOut, Home, TrendingUp, Calendar, Star, Users } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Accommodation = Tables<"accommodations">;

const OwnerDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [bookings, setBookings] = useState<Tables<"bookings">[]>([]);
  const [reviews, setReviews] = useState<{ rating: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [type, setType] = useState("agritourism");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [amenities, setAmenities] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [accRes, bookRes] = await Promise.all([
      supabase.from("accommodations").select("*").eq("owner_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("item_type", "accommodation"),
    ]);
    const myAccs = accRes.data || [];
    setAccommodations(myAccs);
    const accIds = myAccs.map((a) => a.id);
    const myBookings = (bookRes.data || []).filter((b) => b.item_id && accIds.includes(b.item_id));
    setBookings(myBookings);

    // Fetch reviews for my accommodations
    if (accIds.length > 0) {
      const { data: revData } = await supabase
        .from("reviews")
        .select("rating")
        .eq("item_type", "accommodation")
        .in("item_id", accIds);
      setReviews(revData || []);
    }
    setLoading(false);
  };

  const resetForm = () => {
    setName(""); setType("agritourism"); setLocation(""); setDescription(""); setPrice(""); setAmenities("");
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (acc: Accommodation) => {
    setName(acc.name);
    setType(acc.type);
    setLocation(acc.location);
    setDescription(acc.description || "");
    setPrice(String(acc.price_per_night));
    setAmenities((acc.amenities || []).join(", "));
    setEditingId(acc.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    const { error } = await supabase.from("accommodations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); fetchData(); }
  };

  const updateBookingStatus = async (id: string, status: "confirmed" | "cancelled") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success(status === "confirmed" ? "Rezervimi u konfirmua!" : "Rezervimi u anulua.");
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      name: name.trim(),
      type,
      location: location.trim(),
      description: description.trim(),
      price_per_night: parseFloat(price),
      amenities: amenities.split(",").map((a) => a.trim()).filter(Boolean),
      owner_id: user!.id,
    };

    if (editingId) {
      const { error } = await supabase.from("accommodations").update(data).eq("id", editingId);
      if (error) toast.error(error.message);
      else { toast.success("Updated!"); resetForm(); fetchData(); }
    } else {
      const { error } = await supabase.from("accommodations").insert(data);
      if (error) toast.error(error.message);
      else { toast.success("Created!"); resetForm(); fetchData(); }
    }
  };

  // Stats calculations
  const now = new Date();
  const thisMonth = bookings.filter((b) => {
    const d = new Date(b.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const monthlyBookings = thisMonth.length;
  const monthlyRevenue = thisMonth.reduce((sum, b) => sum + (b.total_price || 0), 0);
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#F8F4ED" }}>
      <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏠</span>
          <h1 className="font-heading text-xl font-bold text-foreground">Owner Dashboard</h1>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/")}><Home className="h-4 w-4 mr-1" /> Home</Button>
          <Button variant="outline" size="sm" onClick={signOut}><LogOut className="h-4 w-4 mr-1" /> Sign Out</Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D4EDE0" }}>
                <Calendar className="h-5 w-5" style={{ color: "#1C3D2E" }} />
              </div>
              <span className="text-sm text-muted-foreground">Rezervime këtë muaj</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{monthlyBookings}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D4EDE0" }}>
                <TrendingUp className="h-5 w-5" style={{ color: "#1C3D2E" }} />
              </div>
              <span className="text-sm text-muted-foreground">Të ardhura këtë muaj</span>
            </div>
            <p className="text-3xl font-bold text-foreground">€{monthlyRevenue}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#D4EDE0" }}>
                <Star className="h-5 w-5" style={{ color: "#1C3D2E" }} />
              </div>
              <span className="text-sm text-muted-foreground">Rating mesatar</span>
            </div>
            <p className="text-3xl font-bold text-foreground">{avgRating} {avgRating !== "—" && "⭐"}</p>
          </div>
        </div>

        {/* Accommodations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">Pronat e Mia</h2>
          <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-forest hover:bg-pine text-cream">
            <Plus className="h-4 w-4 mr-1" /> Shto Pronë
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border p-6 mb-8 space-y-4 shadow-sm">
            <h3 className="font-heading text-lg font-semibold">{editingId ? "Ndrysho" : "Shto"} Pronë</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Emri</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div>
                <Label>Lloji</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agritourism">Agroturizëm</SelectItem>
                    <SelectItem value="boutique_hotel">Hotel Boutique</SelectItem>
                    <SelectItem value="guesthouse">Bujtinë</SelectItem>
                    <SelectItem value="villa">Vilë</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Lokacioni</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} required /></div>
              <div><Label>Çmimi për natë (€)</Label><Input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
            </div>
            <div><Label>Përshkrimi</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
            <div><Label>Komoditete (ndarë me presje)</Label><Input value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="WiFi, Parking, Pool" /></div>
            <div className="flex gap-3">
              <Button type="submit" className="bg-forest hover:bg-pine text-cream">{editingId ? "Përditëso" : "Krijo"}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Anulo</Button>
            </div>
          </form>
        )}

        {accommodations.length === 0 && !showForm ? (
          <div className="text-center py-16 bg-white rounded-xl border border-border shadow-sm">
            <p className="text-5xl mb-4">🏡</p>
            <h3 className="font-heading text-xl font-semibold text-foreground mb-2">Nuk keni prona ende</h3>
            <p className="text-muted-foreground mb-6">Shtoni pronën tuaj të parë dhe filloni të merrni rezervime!</p>
            <Button onClick={() => { resetForm(); setShowForm(true); }} className="bg-forest hover:bg-pine text-cream">
              <Plus className="h-4 w-4 mr-1" /> Shto Pronën e Parë
            </Button>
          </div>
        ) : (
          <div className="grid gap-4 mb-12">
            {accommodations.map((acc) => (
              <div key={acc.id} className="bg-white rounded-xl border border-border p-5 flex items-start justify-between shadow-sm">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{acc.type === "agritourism" ? "🌿" : acc.type === "boutique_hotel" ? "🏨" : acc.type === "villa" ? "🏡" : "🏠"}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{acc.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${acc.is_active ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {acc.is_active ? "Aktive" : "Joaktive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{acc.location} · €{acc.price_per_night}/natë · ⭐ {acc.rating}</p>
                  {acc.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{acc.description}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(acc)}><Edit2 className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(acc.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings for my accommodations */}
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Rezervimet e Mia</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-8 bg-white rounded-xl border border-border shadow-sm">
            <p className="text-muted-foreground">Nuk ka rezervime ende.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-border overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: "#D4EDE0" }}>
                  <th className="text-left p-3 font-medium text-foreground">Prona</th>
                  <th className="text-left p-3 font-medium text-foreground">Mysafiri</th>
                  <th className="text-left p-3 font-medium text-foreground">Datat</th>
                  <th className="text-left p-3 font-medium text-foreground">Persona</th>
                  <th className="text-left p-3 font-medium text-foreground">Totali</th>
                  <th className="text-left p-3 font-medium text-foreground">Statusi</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="p-3 font-medium">{b.item_name}</td>
                    <td className="p-3">
                      <div>{b.full_name}</div>
                      <div className="text-xs text-muted-foreground">{b.email}</div>
                    </td>
                    <td className="p-3">{b.check_in}{b.check_out ? ` → ${b.check_out}` : ""}</td>
                    <td className="p-3">{b.guests}</td>
                    <td className="p-3 font-medium">€{b.total_price}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.status === "confirmed" ? "bg-green-100 text-green-700" :
                        b.status === "cancelled" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-800"
                      }`}>{b.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
