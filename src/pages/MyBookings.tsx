import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CalendarDays, Users, MapPin, Clock } from "lucide-react";

interface Booking {
  id: string;
  item_type: string;
  item_name: string;
  check_in: string;
  check_out: string | null;
  guests: number;
  total_price: number;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/15 text-amber-700 border-amber-300",
  confirmed: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
  cancelled: "bg-destructive/15 text-destructive border-destructive/30",
  completed: "bg-primary/15 text-primary border-primary/30",
};

const typeEmoji: Record<string, string> = {
  accommodation: "🏡",
  tour: "🥾",
  guide: "🧭",
};

const MyBookings = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    const fetchBookings = async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      if (error) {
        toast.error("Could not load bookings");
      } else {
        setBookings(data || []);
      }
      setFetching(false);
    };
    fetchBookings();
  }, [user]);

  const handleCancel = async (id: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
    } else {
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b))
      );
      toast.success("Booking cancelled");
    }
  };

  if (loading || fetching) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto pt-28 px-4 text-center text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto pt-28 pb-16 px-4 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold text-foreground mb-2">
          Rezervimet e Mia
        </h1>
        <p className="text-muted-foreground mb-8">
          Historiku i rezervimeve dhe statusi aktual.
        </p>

        {bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-4xl mb-3">📭</p>
            <p className="text-muted-foreground">
              Nuk keni asnjë rezervim ende. Eksploroni turet dhe akomodimet tona!
            </p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Eksploro
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <Card
                key={b.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-4 border border-border"
              >
                <div className="text-3xl flex-shrink-0">
                  {typeEmoji[b.item_type] || "📋"}
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-heading font-semibold text-foreground truncate">
                      {b.item_name}
                    </h3>
                    <Badge
                      variant="outline"
                      className={`text-xs ${statusColors[b.status] || ""}`}
                    >
                      {b.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {b.check_in}
                      {b.check_out && ` → ${b.check_out}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {b.guests} guest{b.guests > 1 ? "s" : ""}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(b.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="font-heading font-bold text-lg text-foreground">
                    €{b.total_price}
                  </span>
                  {b.status === "pending" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive border-destructive/30 hover:bg-destructive/10"
                      onClick={() => handleCancel(b.id)}
                    >
                      Anulo
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
