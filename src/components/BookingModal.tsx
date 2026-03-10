import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { CalendarIcon, Info } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string;
    type: "accommodation" | "tour" | "guide";
    name: string;
    price: number;
  };
}

const BookingModal = ({ open, onClose, item }: BookingModalProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  const isAccommodation = item.type === "accommodation";
  const guestsNum = parseInt(guests) || 1;
  const nights = isAccommodation && checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)))
    : 1;
  const totalPrice = isAccommodation ? item.price * nights * guestsNum : item.price * guestsNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn) {
      toast.error("Please select a date");
      return;
    }
    if (isAccommodation && !checkOut) {
      toast.error("Please select a check-out date");
      return;
    }
    toast.success("✅ Request sent! We'll confirm within 24 hours.");
    onClose();
    // Reset
    setCheckIn(undefined);
    setCheckOut(undefined);
    setGuests("1");
    setFullName("");
    setEmail("");
    setPhone("");
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Request: {item.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Personal info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>Full Name</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" required className="mt-1" />
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Phone</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+355 6X XXX XXXX" required className="mt-1" />
          </div>

          {/* Dates */}
          <div className={isAccommodation ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
            <div>
              <Label>{isAccommodation ? "Check-in Date" : "Date"}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !checkIn && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>

            {isAccommodation && (
              <div>
                <Label>Check-out Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : "Select date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Guests */}
          <div>
            <Label>Number of Guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} {i === 0 ? "guest" : "guests"}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Special requests */}
          <div>
            <Label>Special Requests <span className="text-muted-foreground font-normal">(optional)</span></Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any dietary needs, accessibility requirements, or special wishes..." rows={3} className="mt-1" />
          </div>

          {/* Price estimate */}
          <div className="bg-muted/50 rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {isAccommodation
                  ? `€${item.price} × ${nights} night${nights > 1 ? "s" : ""} × ${guestsNum} guest${guestsNum > 1 ? "s" : ""}`
                  : `€${item.price} × ${guestsNum} guest${guestsNum > 1 ? "s" : ""}`}
              </span>
            </div>
            <div className="flex justify-between font-heading text-lg font-bold text-foreground">
              <span>Estimated Total</span>
              <span>€{totalPrice}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">Send Booking Request</Button>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground text-center justify-center">
            <Info className="h-3.5 w-3.5" /> No payment required now. We'll contact you.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
