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
import { useLanguage } from "@/hooks/useLanguage";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  item: { id: string; type: "accommodation" | "tour" | "guide"; name: string; price: number };
}

const BookingModal = ({ open, onClose, item }: BookingModalProps) => {
  const [checkIn, setCheckIn] = useState<Date>();
  const [checkOut, setCheckOut] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const { t } = useLanguage();

  const isAccommodation = item.type === "accommodation";
  const guestsNum = parseInt(guests) || 1;
  const nights = isAccommodation && checkIn && checkOut
    ? Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))) : 1;
  const totalPrice = isAccommodation ? item.price * nights * guestsNum : item.price * guestsNum;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn) { toast.error(t("booking.error_date")); return; }
    if (isAccommodation && !checkOut) { toast.error(t("booking.error_checkout")); return; }
    toast.success(t("booking.success"));
    onClose();
    setCheckIn(undefined); setCheckOut(undefined); setGuests("1"); setFullName(""); setEmail(""); setPhone(""); setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">{t("booking.title")}: {item.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label>{t("booking.fullname")}</Label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("booking.fullname")} required className="mt-1" />
            </div>
            <div>
              <Label>{t("booking.email")}</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" required className="mt-1" />
            </div>
          </div>
          <div>
            <Label>{t("booking.phone")}</Label>
            <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+355 6X XXX XXXX" required className="mt-1" />
          </div>

          <div className={isAccommodation ? "grid grid-cols-1 sm:grid-cols-2 gap-3" : ""}>
            <div>
              <Label>{isAccommodation ? t("booking.checkin") : t("booking.date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !checkIn && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {checkIn ? format(checkIn, "PPP") : t("booking.select_date")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={checkIn} onSelect={setCheckIn} disabled={(d) => d < new Date()} className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
            {isAccommodation && (
              <div>
                <Label>{t("booking.checkout")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal mt-1", !checkOut && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {checkOut ? format(checkOut, "PPP") : t("booking.select_date")}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={checkOut} onSelect={setCheckOut} disabled={(d) => d < (checkIn || new Date())} className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          <div>
            <Label>{t("booking.guests")}</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{i + 1} {i === 0 ? t("booking.guest") : t("booking.guests_plural")}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>{t("booking.special")} <span className="text-muted-foreground font-normal">({t("booking.optional")})</span></Label>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("booking.special_placeholder")} rows={3} className="mt-1" />
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-1">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>
                {isAccommodation
                  ? `€${item.price} × ${nights} night${nights > 1 ? "s" : ""} × ${guestsNum} ${guestsNum > 1 ? t("booking.guests_plural") : t("booking.guest")}`
                  : `€${item.price} × ${guestsNum} ${guestsNum > 1 ? t("booking.guests_plural") : t("booking.guest")}`}
              </span>
            </div>
            <div className="flex justify-between font-heading text-lg font-bold text-foreground">
              <span>{t("booking.estimated")}</span>
              <span>€{totalPrice}</span>
            </div>
          </div>

          <Button type="submit" className="w-full">{t("booking.submit")}</Button>

          <p className="flex items-center gap-1.5 text-xs text-muted-foreground text-center justify-center">
            <Info className="h-3.5 w-3.5" /> {t("booking.no_payment")}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BookingModal;
