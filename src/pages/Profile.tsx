import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, User } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (!user) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      if (data) {
        setFullName(data.full_name || "");
        setAvatarUrl(data.avatar_url || "");
      }
      const { data: contact } = await supabase
        .from("profile_contact")
        .select("phone")
        .eq("user_id", user.id)
        .maybeSingle();
      if (contact) {
        setPhone(contact.phone || "");
      }
      setLoading(false);
    };
    fetchProfile();
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName.trim(),
        avatar_url: avatarUrl.trim() || null,
      })
      .eq("user_id", user.id);

    const { error: contactError } = await supabase
      .from("profile_contact")
      .upsert({ user_id: user.id, phone: phone.trim() || null }, { onConflict: "user_id" });

    if (error || contactError) {
      toast({ title: "Gabim", description: (error || contactError)?.message, variant: "destructive" });
    } else {
      toast({ title: "U ruajt!", description: "Profili u përditësua me sukses." });
    }
    setSaving(false);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Duhet të hysh në llogari për të parë profilin.</p>
          <a href="/auth" className="text-primary underline">Hyr / Regjistrohu</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="gradient-hero text-primary-foreground py-16 pt-24">
        <div className="container mx-auto px-4">
          <a href="/" className="inline-flex items-center gap-1 text-primary-foreground/70 hover:text-primary-foreground text-sm mb-4">
            <ArrowLeft className="h-4 w-4" /> Kthehu
          </a>
          <h1 className="font-heading text-3xl md:text-4xl font-bold">Profili Im</h1>
          <p className="text-primary-foreground/70 mt-1">Menaxho të dhënat e llogarisë tënde</p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8 pb-16">
        <Card className="max-w-lg mx-auto shadow-card">
          <CardHeader>
            <CardTitle className="font-heading text-xl flex items-center gap-2">
              <User className="h-5 w-5" /> Të dhënat personale
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {loading ? (
              <p className="text-muted-foreground text-sm">Po ngarkohet...</p>
            ) : (
              <>
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={avatarUrl} />
                    <AvatarFallback className="text-lg bg-accent text-accent-foreground">
                      {fullName ? fullName[0].toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Label htmlFor="avatar">URL e fotos</Label>
                    <Input
                      id="avatar"
                      value={avatarUrl}
                      onChange={(e) => setAvatarUrl(e.target.value)}
                      placeholder="https://example.com/photo.jpg"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="name">Emri i plotë</Label>
                  <Input
                    id="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Emri Mbiemri"
                    maxLength={100}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Numri i telefonit</Label>
                  <Input
                    id="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+355 69 123 4567"
                    maxLength={20}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled className="opacity-60" />
                </div>

                <Button onClick={handleSave} disabled={saving} className="w-full gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? "Po ruhet..." : "Ruaj ndryshimet"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
