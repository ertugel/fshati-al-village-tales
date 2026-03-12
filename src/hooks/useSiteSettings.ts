import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface SiteSettings {
  hero_headline: string;
  hero_sub: string;
  subscriber_count: string;
  whatsapp: string;
  email: string;
  online_label: string;
  show_events: string;
  show_guides: string;
  maintenance_message: string;
}

const defaults: SiteSettings = {
  hero_headline: "Ku çdo fshat tregon një histori",
  hero_sub: "Agroturizme, guida lokale dhe ture tematike",
  subscriber_count: "2847",
  whatsapp: "+355 69 XXX XXXX",
  email: "hello@fshati.al",
  online_label: "24 online",
  show_events: "true",
  show_guides: "true",
  maintenance_message: "",
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaults);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("site_settings").select("key, value");
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row: any) => { map[row.key] = row.value || ""; });
        setSettings((prev) => ({ ...prev, ...map }));
      }
      setLoading(false);
    };
    fetch();
  }, []);

  return { settings, loading };
}
