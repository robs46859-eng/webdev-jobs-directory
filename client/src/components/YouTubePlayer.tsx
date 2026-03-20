import { Volume2 } from "lucide-react";

interface YouTubePlayerProps {
  videoId: string;
  title: string;
}

export default function YouTubePlayer({ videoId, title }: YouTubePlayerProps) {
  return (
    <div className="shrink-0">
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{ background: "#111820", borderBottom: "1px solid rgba(217,70,239,0.15)" }}
      >
        <Volume2 size={12} style={{ color: "#d946ef" }} />
        <p
          className="text-xs truncate flex-1"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#e8e0c8" }}
        >
          {title}
        </p>
      </div>
    </div>
  );
}
