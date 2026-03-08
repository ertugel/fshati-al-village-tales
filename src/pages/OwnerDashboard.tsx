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
import { Plus, Edit2, Trash2, LogOut, Home } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Accommodation = Tables<"accommodations">;

const OwnerDashboard = () => {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [bookings, setBookings] = useState<Tables<"bookings">[]>([]);
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
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    const [accRes, bookRes] = await Promise.all([
      supabase.from("accommodations").select("*").eq("owner_id", user!.id).order("created_at", { ascending: false }),
      supabase.from("bookings").select("*").eq("item_type", "accommodation"),
    ]);
    setAccommodations(accRes.data || []);
    // Filter bookings for owner's accommodations
    const accIds = (accRes.data || []).map((a) => a.id);
    setBookings((bookRes.data || []).filter((b) => accIds.includes(b.item_id)));
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
    const { error } = await supabase.from("accommodations").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Deleted!"); fetchData(); }
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

  if (authLoading || loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><p className="text-muted-foreground">Loading...</p></div>;
  }

  return (
    <div className="min-h-screen bg-background">
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
        {/* Accommodations */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">My Listings</h2>
          <Button onClick={() => { resetForm(); setShowForm(true); }}>
            <Plus className="h-4 w-4 mr-1" /> Add Listing
          </Button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card rounded-xl border border-border p-6 mb-8 space-y-4">
            <h3 className="font-heading text-lg font-semibold">{editingId ? "Edit" : "New"} Listing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} required /></div>
              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agritourism">Agritourism</SelectItem>
                    <SelectItem value="boutique_hotel">Boutique Hotel</SelectItem>
                    <SelectItem value="guesthouse">Guesthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Location</Label><Input value={location} onChange={(e) => setLocation(e.target.value)} required /></div>
              <div><Label>Price per Night (€)</Label><Input type="number" min="1" value={price} onChange={(e) => setPrice(e.target.value)} required /></div>
            </div>
            <div><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} /></div>
            <div><Label>Amenities (comma-separated)</Label><Input value={amenities} onChange={(e) => setAmenities(e.target.value)} placeholder="WiFi, Parking, Pool" /></div>
            <div className="flex gap-3">
              <Button type="submit">{editingId ? "Update" : "Create"}</Button>
              <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </form>
        )}

        {accommodations.length === 0 ? (
          <div className="text-center py-12 bg-card rounded-xl border border-border">
            <p className="text-3xl mb-2">🏡</p>
            <p className="text-muted-foreground">No listings yet. Add your first accommodation!</p>
          </div>
        ) : (
          <div className="grid gap-4 mb-12">
            {accommodations.map((acc) => (
              <div key={acc.id} className="bg-card rounded-xl border border-border p-5 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{acc.type === "agritourism" ? "🌿" : acc.type === "boutique_hotel" ? "🏨" : acc.type === "villa" ? "🏡" : "🏠"}</span>
                    <h3 className="font-heading text-lg font-semibold text-foreground">{acc.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${acc.is_active ? "bg-accent/20 text-accent-foreground" : "bg-muted text-muted-foreground"}`}>
                      {acc.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{acc.location} · €{acc.price_per_night}/night</p>
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
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-4">Incoming Bookings</h2>
        {bookings.length === 0 ? (
          <div className="text-center py-8 bg-card rounded-xl border border-border">
            <p className="text-muted-foreground">No bookings yet.</p>
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium text-muted-foreground">Item</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Dates</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Guests</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Total</th>
                  <th className="text-left p-3 font-medium text-muted-foreground">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="p-3">{b.item_name}</td>
                    <td className="p-3">{b.check_in}{b.check_out ? ` → ${b.check_out}` : ""}</td>
                    <td className="p-3">{b.guests}</td>
                    <td className="p-3 font-medium">€{b.total_price}</td>
                    <td className="p-3">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        b.status === "approved" ? "bg-accent/20 text-accent-foreground" :
                        b.status === "rejected" ? "bg-destructive/20 text-destructive" :
                        "bg-muted text-muted-foreground"
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
