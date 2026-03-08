import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

type AuthView = "signin" | "signup" | "forgot";

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  initialView?: AuthView;
}

const AuthModal = ({ open, onClose, initialView = "signin" }: AuthModalProps) => {
  const [view, setView] = useState<AuthView>(initialView);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"tourist" | "owner">("tourist");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, resetPassword } = useAuth();

  const reset = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setRole("tourist");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Mirë se vini! 🎉");
      reset();
      onClose();
    }
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Ju lutem shkruani emrin tuaj");
      return;
    }
    if (password.length < 6) {
      toast.error("Fjalëkalimi duhet të ketë të paktën 6 karaktere");
      return;
    }
    setLoading(true);
    const { error } = await signUp(email, password, fullName, role);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Kontrolloni emailin për të konfirmuar llogarinë! 📧");
      reset();
    }
    setLoading(false);
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Shkruani emailin tuaj");
      return;
    }
    setLoading(true);
    const { error } = await resetPassword(email);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Kontrolloni emailin për linkun e rivendosjes! 📧");
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); onClose(); } }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="text-center mb-2">
            <span className="text-3xl">🏔️</span>
            <span className="font-heading text-2xl font-bold text-foreground ml-2">
              Fshati<span className="text-seafoam">.al</span>
            </span>
          </div>
          <DialogTitle className="font-heading text-xl text-center">
            {view === "signin" && "Hyr në llogarinë"}
            {view === "signup" && "Krijo llogarinë"}
            {view === "forgot" && "Rivendos fjalëkalimin"}
          </DialogTitle>
        </DialogHeader>

        {view === "signin" && (
          <form onSubmit={handleSignIn} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="signin-email">Email</Label>
              <Input id="signin-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@shembull.com" required />
            </div>
            <div>
              <Label htmlFor="signin-password">Fjalëkalimi</Label>
              <Input id="signin-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <button type="button" onClick={() => setView("forgot")} className="text-xs text-sage hover:underline">
              Keni harruar fjalëkalimin?
            </button>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Duke hyrë..." : "Hyr"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Nuk keni llogari?{" "}
              <button type="button" onClick={() => setView("signup")} className="text-sage font-medium hover:underline">Regjistrohu</button>
            </p>
          </form>
        )}

        {view === "signup" && (
          <form onSubmit={handleSignUp} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="signup-name">Emri i plotë</Label>
              <Input id="signup-name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Emri Mbiemri" required />
            </div>
            <div>
              <Label htmlFor="signup-email">Email</Label>
              <Input id="signup-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@shembull.com" required />
            </div>
            <div>
              <Label htmlFor="signup-password">Fjalëkalimi</Label>
              <Input id="signup-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <Label>Lloji i llogarisë</Label>
              <div className="flex gap-3 mt-1">
                <button type="button" onClick={() => setRole("tourist")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${role === "tourist" ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                  🧳 Turist
                </button>
                <button type="button" onClick={() => setRole("owner")}
                  className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${role === "owner" ? "border-accent bg-accent/10 text-foreground" : "border-border text-muted-foreground hover:border-accent/50"}`}>
                  🏠 Pronar
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Duke u regjistruar..." : "Regjistrohu"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Keni llogari?{" "}
              <button type="button" onClick={() => setView("signin")} className="text-sage font-medium hover:underline">Hyr</button>
            </p>
          </form>
        )}

        {view === "forgot" && (
          <form onSubmit={handleForgot} className="space-y-4 pt-2">
            <p className="text-sm text-muted-foreground">Shkruani emailin tuaj dhe do t'ju dërgojmë një link për të rivendosur fjalëkalimin.</p>
            <div>
              <Label htmlFor="forgot-email">Email</Label>
              <Input id="forgot-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@shembull.com" required />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Duke dërguar..." : "Dërgo linkun"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <button type="button" onClick={() => setView("signin")} className="text-sage font-medium hover:underline">← Kthehu te hyrja</button>
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
