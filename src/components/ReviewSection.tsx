import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Star, Send } from "lucide-react";

interface Review {
  id: string;
  user_id: string;
  item_id: string;
  item_type: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profile?: { full_name: string | null };
}

interface ReviewSectionProps {
  itemId: string;
  itemType: "tour" | "accommodation";
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

  useEffect(() => {
    fetchReviews();
  }, [itemId]);

  const fetchReviews = async () => {
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("item_id", itemId)
      .eq("item_type", itemType)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch profile names
      const userIds = [...new Set(data.map((r) => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name")
        .in("user_id", userIds);

      const profileMap = Object.fromEntries(
        (profiles || []).map((p) => [p.user_id, p])
      );

      const enriched = data.map((r) => ({
        ...r,
        profile: profileMap[r.user_id],
      }));
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

    setLoading(true);
    if (myReview) {
      const { error } = await supabase
        .from("reviews")
        .update({ rating, comment: comment.trim() || null })
        .eq("id", myReview.id);
      if (error) toast.error(error.message);
      else toast.success("Vlerësimi u përditësua!");
    } else {
      const { error } = await supabase.from("reviews").insert({
        user_id: user.id,
        item_id: itemId,
        item_type: itemType,
        rating,
        comment: comment.trim() || null,
      });
      if (error) toast.error(error.message);
      else toast.success("Faleminderit për vlerësimin!");
    }
    setLoading(false);
    fetchReviews();
  };

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-3">
        <h4 className="font-heading text-lg font-semibold text-foreground">
          Vlerësime ({reviews.length})
        </h4>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="h-4 w-4 fill-primary text-primary" />
          {avgRating}
        </div>
      </div>

      {user && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <p className="text-sm font-medium text-foreground">
            {myReview ? "Përditëso vlerësimin" : "Lini një vlerësim"}
          </p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                onMouseEnter={() => setHoverRating(s)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(s)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`h-6 w-6 ${
                    s <= (hoverRating || rating)
                      ? "fill-primary text-primary"
                      : "text-muted-foreground/40"
                  }`}
                />
              </button>
            ))}
          </div>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Shkruani komentin tuaj..."
            rows={2}
            className="bg-background"
          />
          <Button size="sm" onClick={handleSubmit} disabled={loading}>
            <Send className="h-3.5 w-3.5 mr-1" />
            {myReview ? "Përditëso" : "Dërgo"}
          </Button>
        </div>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">Asnjë vlerësim ende.</p>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="bg-card rounded-lg border border-border p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-foreground">
                  {r.profile?.full_name || "Anonim"}
                </span>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`h-3.5 w-3.5 ${
                        s <= r.rating ? "fill-primary text-primary" : "text-muted-foreground/30"
                      }`}
                    />
                  ))}
                </div>
              </div>
              {r.comment && (
                <p className="text-sm text-muted-foreground">{r.comment}</p>
              )}
              <p className="text-xs text-muted-foreground/60 mt-1">
                {new Date(r.created_at).toLocaleDateString("sq-AL")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
