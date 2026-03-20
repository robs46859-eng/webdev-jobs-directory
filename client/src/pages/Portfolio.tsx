/*
 * Portfolio Page — "Case Files" 
 * 5 project slots styled as classified evidence folders in the Arkham noir aesthetic.
 * Each project card has: title, description, tags, image placeholder, and a link.
 *
 * DESIGN: Dark noir palette, M3 violet accents, Orbitron + Oswald + Special Elite fonts
 */
import { useState } from "react";
import { Link } from "wouter";

interface Project {
  id: number;
  caseNumber: string;
  title: string;
  client: string;
  description: string;
  tags: string[];
  status: "CLASSIFIED" | "OPEN" | "CLOSED";
  year: string;
  imageUrl: string | null;
  liveUrl: string | null;
}

const PROJECTS: Project[] = [
  {
    id: 1,
    caseNumber: "CF-001",
    title: "Project Alpha",
    client: "Client Name",
    description: "A full website design and development project. Details to be added — this case file is awaiting evidence submission.",
    tags: ["Website Design", "React", "Tailwind CSS"],
    status: "OPEN",
    year: "2025",
    imageUrl: null,
    liveUrl: null,
  },
  {
    id: 2,
    caseNumber: "CF-002",
    title: "Project Beta",
    client: "Client Name",
    description: "A website redesign project transforming an outdated presence into a modern, high-performance experience. Details pending.",
    tags: ["Redesign", "UI/UX", "Performance"],
    status: "OPEN",
    year: "2025",
    imageUrl: null,
    liveUrl: null,
  },
  {
    id: 3,
    caseNumber: "CF-003",
    title: "Project Gamma",
    client: "Client Name",
    description: "A custom web application with real-time features, authentication, and database integration. Evidence to be filed.",
    tags: ["Web App", "Full-Stack", "Database"],
    status: "OPEN",
    year: "2025",
    imageUrl: null,
    liveUrl: null,
  },
  {
    id: 4,
    caseNumber: "CF-004",
    title: "Project Delta",
    client: "Client Name",
    description: "An e-commerce build with payment processing, inventory management, and a custom storefront. Case file pending.",
    tags: ["E-Commerce", "Stripe", "Next.js"],
    status: "OPEN",
    year: "2026",
    imageUrl: null,
    liveUrl: null,
  },
  {
    id: 5,
    caseNumber: "CF-005",
    title: "Project Epsilon",
    client: "Client Name",
    description: "A branding and landing page project designed to establish a commanding digital presence. Awaiting documentation.",
    tags: ["Branding", "Landing Page", "Animation"],
    status: "OPEN",
    year: "2026",
    imageUrl: null,
    liveUrl: null,
  },
];

function StatusBadge({ status }: { status: Project["status"] }) {
  const colors = {
    CLASSIFIED: { bg: "rgba(255,51,51,0.12)", border: "rgba(255,51,51,0.4)", text: "#ff3333" },
    OPEN: { bg: "rgba(80,250,123,0.08)", border: "rgba(80,250,123,0.3)", text: "#50fa7b" },
    CLOSED: { bg: "rgba(217,70,239,0.08)", border: "rgba(217,70,239,0.3)", text: "#d946ef" },
  };
  const c = colors[status];
  return (
    <span
      className="inline-block px-2.5 py-0.5 text-xs tracking-widest"
      style={{
        fontFamily: "'Oswald', sans-serif",
        fontSize: "0.55rem",
        letterSpacing: "0.15em",
        color: c.text,
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderRadius: "1px",
      }}
    >
      {status}
    </span>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        background: hovered ? "rgba(217,70,239,0.06)" : "rgba(217,70,239,0.02)",
        border: `1px solid ${hovered ? "rgba(217,70,239,0.3)" : "rgba(217,70,239,0.1)"}`,
        borderRadius: "2px",
        transform: hovered ? "translateY(-4px)" : "none",
        boxShadow: hovered ? "0 8px 32px rgba(217,70,239,0.15)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Case file tab */}
      <div
        className="absolute -top-3 left-6 px-3 py-0.5"
        style={{
          background: "#0a0c16",
          border: "1px solid rgba(217,70,239,0.2)",
          borderBottom: "none",
          borderRadius: "2px 2px 0 0",
        }}
      >
        <span
          className="text-xs tracking-widest"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", fontSize: "0.55rem", letterSpacing: "0.15em" }}
        >
          {project.caseNumber}
        </span>
      </div>

      <div className="p-6 pt-5">
        {/* Header row */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3
              className="text-lg tracking-wide mb-1"
              style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.08em" }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.1em", fontSize: "0.65rem" }}
            >
              {project.client} — {project.year}
            </p>
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* Image placeholder */}
        <div
          className="relative mb-4 overflow-hidden flex items-center justify-center"
          style={{
            height: "180px",
            background: "rgba(10,12,22,0.8)",
            border: "1px solid rgba(217,70,239,0.08)",
            borderRadius: "2px",
          }}
        >
          {project.imageUrl ? (
            <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center">
              <div className="text-3xl mb-2" style={{ opacity: 0.3 }}>📁</div>
              <p
                className="text-xs tracking-widest"
                style={{ fontFamily: "'Special Elite', cursive", color: "#3a4a3a", fontSize: "0.65rem" }}
              >
                EVIDENCE PHOTO PENDING
              </p>
            </div>
          )}

          {/* Scan lines overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
            }}
          />
        </div>

        {/* Description */}
        <p
          className="mb-4"
          style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9a8a", fontSize: "0.8rem", lineHeight: 1.7 }}
        >
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontSize: "0.55rem",
                letterSpacing: "0.08em",
                color: "#c084fc",
                background: "rgba(192,132,252,0.06)",
                border: "1px solid rgba(192,132,252,0.15)",
                borderRadius: "1px",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: "1px solid rgba(217,70,239,0.08)" }}>
          <span
            className="text-xs tracking-widest"
            style={{ fontFamily: "'Special Elite', cursive", color: "#3a4a3a", fontSize: "0.6rem" }}
          >
            FILE #{String(index + 1).padStart(3, "0")}
          </span>
          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs tracking-widest transition-all hover:opacity-80"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#50fa7b", letterSpacing: "0.1em", fontSize: "0.6rem" }}
            >
              VIEW LIVE →
            </a>
          ) : (
            <span
              className="text-xs tracking-widest"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#5a6a5a", letterSpacing: "0.1em", fontSize: "0.6rem" }}
            >
              COMING SOON
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Portfolio() {
  return (
    <div className="min-h-screen" style={{ background: "#080a12" }}>

      {/* ── HEADER ── */}
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: "rgba(8,10,18,0.92)", borderBottom: "1px solid rgba(217,70,239,0.1)", backdropFilter: "blur(12px)" }}
      >
        <Link
          href="/landing"
          className="text-xs tracking-widest transition-all hover:opacity-80"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.6rem" }}
        >
          ← BACK TO HQ
        </Link>
        <h1
          className="text-lg"
          style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}
        >
          CASE FILES
        </h1>
        <Link
          href="/"
          className="text-xs tracking-widest transition-all hover:opacity-80"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.12em", fontSize: "0.6rem" }}
        >
          THE ROOM →
        </Link>
      </header>

      {/* ── HERO ── */}
      <section className="py-16 px-6 text-center" style={{ borderBottom: "1px solid rgba(217,70,239,0.08)" }}>
        <p
          className="text-xs tracking-widest mb-3"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.2em", fontSize: "0.65rem" }}
        >
          ARKHAM PORTFOLIO
        </p>
        <h2
          className="text-4xl md:text-5xl mb-4"
          style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 900, color: "#fff", letterSpacing: "0.1em", textShadow: "0 0 30px rgba(217,70,239,0.4)" }}
        >
          CASE FILES
        </h2>
        <p
          className="max-w-md mx-auto"
          style={{ fontFamily: "'Special Elite', cursive", color: "#6a7a6a", fontSize: "0.85rem", lineHeight: 1.7 }}
        >
          Every project tells a story. These are the cases we've cracked —
          each one a testament to craft, code, and obsessive attention to detail.
        </p>
      </section>

      {/* ── PROJECT GRID ── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {PROJECTS.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}

          {/* "Add more" card */}
          <Link
            href="/landing#contact"
            className="flex flex-col items-center justify-center p-8 transition-all hover:translate-y-[-2px]"
            style={{
              background: "rgba(217,70,239,0.02)",
              border: "1px dashed rgba(217,70,239,0.15)",
              borderRadius: "2px",
              minHeight: "300px",
            }}
          >
            <div className="text-4xl mb-3" style={{ opacity: 0.2 }}>+</div>
            <p
              className="text-xs tracking-widest mb-1"
              style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.65rem" }}
            >
              YOUR PROJECT HERE
            </p>
            <p
              className="text-center max-w-xs"
              style={{ fontFamily: "'Special Elite', cursive", color: "#4a5a4a", fontSize: "0.7rem" }}
            >
              Ready to open a new case? Get in touch and let's build something unforgettable.
            </p>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-6 text-center"
        style={{ background: "#060810", borderTop: "1px solid rgba(217,70,239,0.08)" }}
      >
        <div className="flex items-center justify-center gap-6 mb-3">
          <Link
            href="/landing"
            className="text-xs tracking-widest transition-all hover:opacity-80"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.6rem" }}
          >
            LANDING PAGE
          </Link>
          <Link
            href="/"
            className="text-xs tracking-widest transition-all hover:opacity-80"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.12em", fontSize: "0.6rem" }}
          >
            THE BOARD ROOM
          </Link>
          <Link
            href="/landing#contact"
            className="text-xs tracking-widest transition-all hover:opacity-80"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#50fa7b", letterSpacing: "0.12em", fontSize: "0.6rem" }}
          >
            CONTACT
          </Link>
        </div>
        <p style={{ fontFamily: "'Special Elite', cursive", color: "#3a4a3a", fontSize: "0.6rem" }}>
          © {new Date().getFullYear()} ARKHAM — Built from the shadows of Gotham City
        </p>
      </footer>
    </div>
  );
}
