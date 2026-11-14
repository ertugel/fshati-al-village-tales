import type { ReactNode } from "react";
import type { TourCardData } from "@/lib/tours";

const TourCardBody = ({ tour, action }: { tour: TourCardData; action: ReactNode }) => (
  <>
    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
      <span>⏱ {tour.duration}</span><span>•</span><span>📍 {tour.zone}</span>
    </div>
    <h3 className="font-heading text-lg font-bold text-foreground mb-1">{tour.title}</h3>
    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{tour.description}</p>
    <div className="flex items-center justify-between">
      <span className="text-xl font-bold text-sage">€{tour.price}</span>
      {action}
    </div>
  </>
);

export default TourCardBody;
