import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Fjalëkalimet nuk përputhen");
      return;
    }
    if (password.length < 6) {
      toast.error("Fjalëkalimi duhet të ketë të paktën 6 karaktere");
      return;
    }
    setLoading(true);
    const { supabase } = await import("@/integrations/supabase/client");
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Fjalëkalimi u ndryshua me sukses! 🎉");
      navigate("/home");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-card rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <span className="text-3xl">🔑</span>
            <h1 className="font-heading text-2xl font-bold text-foreground mt-2">Rivendos Fjalëkalimin</h1>
            <p className="text-sm text-muted-foreground mt-1">Shkruani fjalëkalimin e ri</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-password">Fjalëkalimi i ri</Label>
              <Input id="new-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <div>
              <Label htmlFor="confirm-password">Konfirmo fjalëkalimin</Label>
              <Input id="confirm-password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Duke ndryshuar..." : "Ndrysho Fjalëkalimin"}
            </Button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ResetPassword;
