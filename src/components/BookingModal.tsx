import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: "accommodation" | "tour" | "guide";
    name: string;
    price: number;
    priceLabel?: string;
  };
}

const BookingModal = ({ open, onClose, item }: BookingModalProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState(1);
  const [loading, setLoading] = useState(false);

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = item.type === "accommodation" ? item.price * nights * guests : item.price * guests;

  const handleBook = async () => {
    if (!user) {
      toast.error("Please sign in to book");
      navigate("/auth");
      return;
    }
    if (!checkIn) {
      toast.error("Please select a date");
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
      guests,
      total_price: totalPrice,
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Booking request sent! 🎉");
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Rezervo — {item.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label>Check-in Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkIn ? format(checkIn, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} /></PopoverContent>
            </Popover>
          </div>

          {item.type === "accommodation" && (
            <div>
              <Label>Check-out Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkOut ? format(checkOut, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} /></PopoverContent>
              </Popover>
            </div>
          )}

          <div>
            <Label>Number of Guests</Label>
            <Input type="number" min={1} max={20} value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} className="mt-1" />
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.type === "accommodation" ? `€${item.price} × ${nights} night${nights > 1 ? "s" : ""} × ${guests} guest${guests > 1 ? "s" : ""}` : `€${item.price} × ${guests} guest${guests > 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="flex justify-between font-heading text-lg font-bold">
              <span>Total</span>
              <span>€{totalPrice}</span>
            </div>
          </div>

          <Button onClick={handleBook} className="w-full" disabled={loading}>
            {loading ? "Processing..." : "Rezervo Tani"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
