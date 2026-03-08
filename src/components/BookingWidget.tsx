import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { CalendarIcon, Minus, Plus, LogIn } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface BookingWidgetProps {
  item: {
    id: string;
    type: "accommodation" | "tour" | "guide";
    name: string;
    price: number;
    priceLabel?: string;
    emoji?: string;
  };
  tags?: string[];
}

const BookingWidget = ({ item, tags }: BookingWidgetProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);

  const isAccommodation = item.type === "accommodation";
  const totalGuests = adults + children;

  const nights =
    isAccommodation && checkIn && checkOut
      ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
      : 1;

  const totalPrice = isAccommodation
    ? item.price * nights * totalGuests
    : item.price * totalGuests;

  const handleBook = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }
    if (!checkIn) {
      toast.error("Ju lutem zgjidhni një datë");
      return;
    }

    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      user_id: user.id,
      item_type: item.type,
      item_id: item.id,
      item_name: item.name,
      check_in: format(checkIn, "yyyy-MM-dd"),
      check_out: checkOut ? format(checkOut, "yyyy-MM-dd") : null,
      guests: totalGuests,
      total_price: totalPrice,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Rezervimi u dërgua me sukses! 🎉");
    }
    setLoading(false);
  };

  const GuestCounter = ({
    label,
    subtitle,
    value,
    onChange,
    min = 0,
  }: {
    label: string;
    subtitle: string;
    value: number;
    onChange: (v: number) => void;
    min?: number;
  }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground disabled:opacity-30 transition-colors"
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-medium text-foreground">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(20, value + 1))}
          className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card space-y-5">
      {/* Price header */}
      <div className="text-center">
        {item.emoji && <span className="text-5xl block mb-3">{item.emoji}</span>}
        <p className="text-3xl font-heading font-bold text-primary">
          {item.priceLabel || `€${item.price}`}
        </p>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((t) => (
            <span key={t} className="text-xs bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Date pickers */}
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-muted-foreground">
            {isAccommodation ? "Check-in" : "Data"}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 h-10">
                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                {checkIn ? format(checkIn, "dd MMM yyyy") : "Zgjidh datën"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={checkIn}
                onSelect={setCheckIn}
                disabled={(d) => d < new Date()}
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {isAccommodation && (
          <div>
            <Label className="text-xs text-muted-foreground">Check-out</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1 h-10">
                  <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                  {checkOut ? format(checkOut, "dd MMM yyyy") : "Zgjidh datën"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOut}
                  onSelect={setCheckOut}
                  disabled={(d) => d < (checkIn || new Date())}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        )}
      </div>

      {/* Guest selector */}
      <div className="space-y-3 border-t border-border pt-4">
        <GuestCounter label="Të rritur" subtitle="Mosha 13+" value={adults} onChange={setAdults} min={1} />
        <GuestCounter label="Fëmijë" subtitle="Mosha 2–12" value={children} onChange={setChildren} />
      </div>

      {/* Price calculator */}
      <div className="bg-muted/50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>
            {isAccommodation
              ? `€${item.price} × ${nights} natë × ${totalGuests} persona`
              : `€${item.price} × ${totalGuests} persona`}
          </span>
        </div>
        <div className="flex justify-between font-heading text-lg font-bold text-foreground">
          <span>Totali</span>
          <span>€{totalPrice}</span>
        </div>
      </div>

      {/* CTA */}
      {user ? (
        <Button onClick={handleBook} className="w-full" size="lg" disabled={loading}>
          {loading ? "Duke procesuar..." : "Rezervo Tani"}
        </Button>
      ) : (
        <Button onClick={() => navigate("/auth")} variant="outline" className="w-full" size="lg">
          <LogIn className="mr-2 h-4 w-4" />
          Hyr për të rezervuar
        </Button>
      )}

      <p className="text-xs text-center text-muted-foreground">
        Nuk kërkohet pagesë deri në konfirmim
      </p>
    </div>
  );
};

export default BookingWidget;
