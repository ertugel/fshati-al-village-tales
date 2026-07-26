import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listDestinations from "./tools/list-destinations";
import listTours from "./tools/list-tours";
import listEvents from "./tools/list-events";
import listGuides from "./tools/list-guides";
import myBookings from "./tools/my-bookings";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "fshati-al-mcp",
  title: "Fshati.al",
  version: "0.1.0",
  instructions:
    "Tools for Fshati.al, Albania's rural tourism marketplace. Browse destinations, tours, events, and local guides, and read the signed-in user's own bookings.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listDestinations, listTours, listEvents, listGuides, myBookings],
});
