import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Send, MessageSquare } from "lucide-react";

interface Review {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: { full_name: string | null; avatar_url: string | null };
}

interface ReviewSectionProps {
  itemId: string;
  itemType: "tour" | "accommodation" | "guide";
  itemName: string;
}

const ReviewSection = ({ itemId, itemType, itemName }: ReviewSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [myReview, setMyReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [hasBooking, setHasBooking] = useState(false);
  const [checkingBooking, setCheckingBooking] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [itemId]);

  useEffect(() => {
    if (user) checkUserBooking();
  }, [user, itemId]);

  const checkUserBooking = async () => {
    if (!user) return;
    setCheckingBooking(true);
    const { data } = await supabase
      .from("bookings")
      .select("id")
      .eq("user_id", user.id)
      .eq("item_name", itemName)
      .in("status", ["confirmed", "completed", "pending"])
      .limit(1);
    setHasBooking(!!(data && data.length > 0));
    setCheckingBooking(false);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .order("created_at", { ascending: false });

    if (data) {
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = userIds.length
        ? await supabase.from("profiles").select("user_id, full_name, avatar_url").in("user_id", userIds)
        : { data: [] };

      const profileMap = Object.fromEntries((profiles || []).map((p) => [p.user_id, p]));
      const enriched = data.map((r) => ({ ...r, profile: profileMap[r.user_id] }));
      setReviews(enriched);

      if (user) {
        const mine = enriched.find((r) => r.user_id === user.id);
        if (mine) {
          setMyReview(mine);
          setRating(mine.rating);
          setComment(mine.comment || "");
        }
      }
    }
  };

  const handleSubmit = async () => {
    if (!user) { toast.error("Duhet të identifikoheni"); return; }
    if (rating === 0) { toast.error("Zgjidhni vlerësimin"); return; }
    if (comment.trim().length > 1000) { toast.error("Comment too long (max 1000 chars)"); return; }

    setLoading(true);
    if (myReview) {
      const { error } = await supabase.from("reviews").update({ rating, comment: comment.trim() || null }).eq("id", myReview.id);
      if (error) toast.error(error.message);
      else { toast.success("Vlerësimi u përditësua!"); setShowForm(false); }
    } else {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id, item_id: itemId, item_type: itemType, rating, comment: comment.trim() || null,
      });
      if (error) toast.error(error.message);
      else { toast.success("Faleminderit për vlerësimin!"); setShowForm(false); }
    }
    setLoading(false);
    fetchReviews();
  };

  const avgRating = useMemo(() => {
    if (!reviews.length) return 0;
    return reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  }, [reviews]);

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) counts[r.rating - 1]++; });
    return counts;
  }, [reviews]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "?";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-bold text-foreground">Vlerësime</h2>
        {user && !checkingBooking && hasBooking && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowForm(!showForm)}
            className="gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            {myReview ? "Përditëso vlerësimin" : "Shkruaj vlerësim"}
          </Button>
        )}
      </div>

      {/* Rating summary - Airbnb style */}
      {reviews.length > 0 && (
        <div className="bg-card rounded-2xl border border-border p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
          {/* Big average */}
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-heading font-bold text-foreground">{avgRating.toFixed(1)}</div>
            <div className="flex gap-0.5 justify-center mt-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "text-border"}`}
                />
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-1">{reviews.length} vlerësime</p>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 w-full space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingBreakdown[star - 1];
              const pct = reviews.length ? (count / reviews.length) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-4 text-right">{star}</span>
                  <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400 flex-shrink-0" />
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-400 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review form */}
      {showForm && user && (
        <div className="bg-card rounded-2xl border border-border p-6 space-y-4">
          <p className="font-heading text-lg font-semibold text-foreground">
            {myReview ? "Përditëso vlerësimin tuaj" : "Si ishte eksperienca juaj?"}
          </p>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-125 p-0.5"
              >
                <Star
                  className={`h-8 w-8 ${
                    s <= (hoverRating || rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                  }`}
                />
              </button>
            ))}
            {rating > 0 && (
              <span className="text-sm text-muted-foreground self-center ml-2">
                {["", "Dobët", "Mesatare", "Mirë", "Shumë mirë", "Shkëlqyer"][rating]}
              </span>
            )}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tregoni eksperiencën tuaj..."
            rows={3}
            maxLength={1000}
            className="bg-background"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{comment.length}/1000</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>Anulo</Button>
              <Button size="sm" onClick={handleSubmit} disabled={loading || rating === 0}>
                <Send className="h-3.5 w-3.5 mr-1.5" />
                {myReview ? "Përditëso" : "Dërgo"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Not eligible message */}
      {user && !checkingBooking && !hasBooking && (
        <p className="text-sm text-muted-foreground bg-muted/30 rounded-xl px-4 py-3">
          Vetëm përdoruesit me një rezervim mund të lënë vlerësim.
        </p>
      )}

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">Asnjë vlerësim ende. Bëhuni i pari!</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="flex gap-4">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {r.profile?.avatar_url ? (
                  <img src={r.profile.avatar_url} alt="" className="h-10 w-10 rounded-full object-cover" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-sage/20 flex items-center justify-center text-xs font-bold text-forest">
                    {getInitials(r.profile?.full_name)}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-semibold text-foreground">
                    {r.profile?.full_name || "Anonim"}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(r.created_at)}</span>
                </div>
                <div className="flex gap-0.5 mt-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`}
                    />
                  ))}
                </div>
                {r.comment && (
                  <p className="text-sm text-foreground/80 mt-2 leading-relaxed">{r.comment}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
