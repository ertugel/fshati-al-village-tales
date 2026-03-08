import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Home, LogOut, Check, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

const AdminPanel = () => {
  const { user, loading: authLoading, hasRole, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Tables<"bookings">[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (!authLoading && (!user || !hasRole("admin"))) {
      toast.error("Admin access required");
      navigate("/");
    }
  }, [user, authLoading, hasRole, navigate]);

  useEffect(() => {
    if (user && hasRole("admin")) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    setBookings(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase.from("bookings").update({ status }).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success(`Booking ${status}`); fetchBookings(); }
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
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-heading text-2xl font-semibold text-foreground">All Bookings</h2>
          <div className="flex gap-2">
            {["all", "pending", "approved", "rejected"].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-1.5 text-xs rounded-full font-medium transition-colors ${
                  filter === s
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
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
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(b.id, "approved")} className="text-accent-foreground">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => updateStatus(b.id, "rejected")} className="text-destructive">
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
      </div>
    </div>
  );
};

export default AdminPanel;
