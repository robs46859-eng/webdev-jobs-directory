/*
 * Landing Page — Email Campaign Landing
 * Arkham noir aesthetic with:
 * - Fictional Gotham City weekly weather forecast
 * - Joker face clock (no IP, just a fun SVG)
 * - Formspree contact form (robs46859@gmail.com)
 * - Clear CTAs for engagement
 *
 * DESIGN: Dark noir palette, M3 violet accents, Orbitron + Oswald + Special Elite fonts
 */
import { useState, useEffect } from "react";
import { Link } from "wouter";

// ── Fictional Gotham Weather Data ──
const GOTHAM_FORECAST = [
  { day: "MON", high: 42, low: 31, condition: "Acid Rain", icon: "🌧️", desc: "Toxic drizzle from Ace Chemicals" },
  { day: "TUE", high: 38, low: 28, condition: "Fog", icon: "🌫️", desc: "Dense fog rolling off Gotham Harbor" },
  { day: "WED", high: 45, low: 33, condition: "Overcast", icon: "☁️", desc: "Perpetual grey skies over the Narrows" },
  { day: "THU", high: 36, low: 24, condition: "Thunderstorm", icon: "⛈️", desc: "Electrical storm near Wayne Tower" },
  { day: "FRI", high: 40, low: 29, condition: "Smog", icon: "🏭", desc: "Industrial haze from East End" },
  { day: "SAT", high: 44, low: 32, condition: "Drizzle", icon: "🌦️", desc: "Light rain, Bat-Signal visible" },
  { day: "SUN", high: 35, low: 22, condition: "Blizzard", icon: "❄️", desc: "Mr. Freeze activity suspected" },
];

// ── Joker Face SVG Clock ──
function JokerClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const s = time.getSeconds();
  const m = time.getMinutes();
  const h = time.getHours() % 12;
  const secDeg = s * 6;
  const minDeg = m * 6 + s * 0.1;
  const hrDeg = h * 30 + m * 0.5;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="160" height="160" viewBox="0 0 160 160" className="drop-shadow-lg">
        {/* Clock face — dark with joker green tint */}
        <circle cx="80" cy="80" r="76" fill="#0d0f18" stroke="#50fa7b" strokeWidth="3" />
        <circle cx="80" cy="80" r="70" fill="none" stroke="#50fa7b" strokeWidth="1" opacity="0.3" />

        {/* Joker face — simplified */}
        {/* Eyes */}
        <ellipse cx="60" cy="60" rx="10" ry="12" fill="none" stroke="#50fa7b" strokeWidth="2" opacity="0.6" />
        <ellipse cx="100" cy="60" rx="10" ry="12" fill="none" stroke="#50fa7b" strokeWidth="2" opacity="0.6" />
        <circle cx="60" cy="58" r="4" fill="#50fa7b" opacity="0.8" />
        <circle cx="100" cy="58" r="4" fill="#50fa7b" opacity="0.8" />

        {/* Nose */}
        <path d="M 76 68 Q 80 76 84 68" fill="none" stroke="#50fa7b" strokeWidth="1.5" opacity="0.5" />

        {/* Joker smile */}
        <path d="M 45 85 Q 55 75 65 82 Q 80 100 95 82 Q 105 75 115 85" fill="none" stroke="#ff3333" strokeWidth="2.5" opacity="0.8" />
        <path d="M 45 85 Q 50 90 55 87" fill="none" stroke="#ff3333" strokeWidth="2" opacity="0.6" />
        <path d="M 115 85 Q 110 90 105 87" fill="none" stroke="#ff3333" strokeWidth="2" opacity="0.6" />

        {/* Tick marks */}
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 80 + 60 * Math.cos(angle);
          const y1 = 80 + 60 * Math.sin(angle);
          const x2 = 80 + 68 * Math.cos(angle);
          const y2 = 80 + 68 * Math.sin(angle);
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="#50fa7b" strokeWidth={i % 3 === 0 ? 3 : 1} opacity="0.7" />
          );
        })}

        {/* Hour hand */}
        <line
          x1="80" y1="80"
          x2={80 + 32 * Math.cos((hrDeg - 90) * Math.PI / 180)}
          y2={80 + 32 * Math.sin((hrDeg - 90) * Math.PI / 180)}
          stroke="#e8e0c8" strokeWidth="4" strokeLinecap="round"
        />

        {/* Minute hand */}
        <line
          x1="80" y1="80"
          x2={80 + 46 * Math.cos((minDeg - 90) * Math.PI / 180)}
          y2={80 + 46 * Math.sin((minDeg - 90) * Math.PI / 180)}
          stroke="#e8e0c8" strokeWidth="2.5" strokeLinecap="round"
        />

        {/* Second hand */}
        <line
          x1="80" y1="80"
          x2={80 + 52 * Math.cos((secDeg - 90) * Math.PI / 180)}
          y2={80 + 52 * Math.sin((secDeg - 90) * Math.PI / 180)}
          stroke="#ff3333" strokeWidth="1.5" strokeLinecap="round"
          style={{ filter: "drop-shadow(0 0 4px rgba(255,51,51,0.8))" }}
        />

        {/* Center dot */}
        <circle cx="80" cy="80" r="5" fill="#50fa7b" />
      </svg>
      <span
        className="tracking-widest"
        style={{ fontFamily: "'Oswald', sans-serif", color: "#50fa7b", fontSize: "0.75rem", textShadow: "0 0 8px rgba(80,250,123,0.6)" }}
      >
        {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
      </span>
      <span
        className="tracking-widest"
        style={{ fontFamily: "'Special Elite', cursive", color: "#ff3333", fontSize: "0.6rem", opacity: 0.7 }}
      >
        GOTHAM CITY TIME
      </span>
    </div>
  );
}

// ── Formspree Contact Form ──
function ContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xpwrjqkr", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (res.ok) {
        setSubmitted(true);
        form.reset();
      }
    } catch {
      // silent fail
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-4">🃏</div>
        <h3
          className="text-xl tracking-widest mb-2"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#50fa7b", textShadow: "0 0 12px rgba(80,250,123,0.5)" }}
        >
          MESSAGE RECEIVED
        </h3>
        <p style={{ fontFamily: "'Special Elite', cursive", color: "#8a9a8a", fontSize: "0.85rem" }}>
          Your intel has been filed. We'll be in touch from the shadows.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="mt-6 px-6 py-2 text-xs tracking-widest transition-all hover:opacity-80"
          style={{
            fontFamily: "'Oswald', sans-serif",
            color: "#50fa7b",
            border: "1px solid rgba(80,250,123,0.4)",
            background: "rgba(80,250,123,0.08)",
            letterSpacing: "0.12em",
          }}
        >
          SEND ANOTHER
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="_replyto" value="robs46859@gmail.com" />
      <input type="hidden" name="_subject" value="New Arkham Landing Page Inquiry" />

      <div>
        <label
          className="block text-xs tracking-widest mb-1.5"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.65rem" }}
        >
          YOUR NAME
        </label>
        <input
          type="text"
          name="name"
          required
          placeholder="Bruce Wayne"
          className="w-full px-4 py-3 text-sm transition-all focus:outline-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "rgba(217,70,239,0.06)",
            border: "1px solid rgba(217,70,239,0.25)",
            color: "#e8e0c8",
            borderRadius: "2px",
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs tracking-widest mb-1.5"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.65rem" }}
        >
          EMAIL ADDRESS
        </label>
        <input
          type="email"
          name="email"
          required
          placeholder="bruce@wayneenterprises.com"
          className="w-full px-4 py-3 text-sm transition-all focus:outline-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "rgba(217,70,239,0.06)",
            border: "1px solid rgba(217,70,239,0.25)",
            color: "#e8e0c8",
            borderRadius: "2px",
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs tracking-widest mb-1.5"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.65rem" }}
        >
          YOUR MESSAGE
        </label>
        <textarea
          name="message"
          required
          rows={4}
          placeholder="Tell us about your project..."
          className="w-full px-4 py-3 text-sm transition-all focus:outline-none resize-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "rgba(217,70,239,0.06)",
            border: "1px solid rgba(217,70,239,0.25)",
            color: "#e8e0c8",
            borderRadius: "2px",
          }}
        />
      </div>

      <div>
        <label
          className="block text-xs tracking-widest mb-1.5"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.65rem" }}
        >
          PROJECT TYPE
        </label>
        <select
          name="project_type"
          className="w-full px-4 py-3 text-sm transition-all focus:outline-none"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            background: "rgba(217,70,239,0.06)",
            border: "1px solid rgba(217,70,239,0.25)",
            color: "#e8e0c8",
            borderRadius: "2px",
          }}
        >
          <option value="website-design">Website Design</option>
          <option value="website-redesign">Website Redesign</option>
          <option value="web-application">Web Application</option>
          <option value="ecommerce">E-Commerce</option>
          <option value="other">Other</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 text-sm tracking-widest transition-all hover:opacity-90 mt-2"
        style={{
          fontFamily: "'Oswald', sans-serif",
          fontWeight: 700,
          color: "#0d0f18",
          background: "linear-gradient(135deg, #d946ef, #c084fc)",
          letterSpacing: "0.15em",
          borderRadius: "2px",
          boxShadow: "0 0 20px rgba(217,70,239,0.3)",
        }}
      >
        {submitting ? "TRANSMITTING..." : "SEND INTEL"}
      </button>
    </form>
  );
}

// ── Main Landing Page ──
export default function Landing() {
  const ROOM_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663452403431/KPXZebPSGaZWYwAsdwVntt/noir-room-bg-KiFVNE7F7Szawos5eGtkQj.webp";

  return (
    <div className="min-h-screen relative" style={{ background: "#080a12" }}>

      {/* ── HERO SECTION ── */}
      <section className="relative overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* Background image with dark overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${ROOM_BG})`, filter: "brightness(0.35) contrast(1.2)" }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,10,18,0.3) 0%, rgba(8,10,18,0.95) 100%)" }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <h1
            className="text-6xl md:text-8xl mb-4"
            style={{
              fontFamily: "'Orbitron', sans-serif",
              fontWeight: 900,
              color: "#ffffff",
              textShadow: "0 0 40px rgba(217,70,239,0.6), 0 0 80px rgba(217,70,239,0.3)",
              letterSpacing: "0.15em",
            }}
          >
            ARKHAM
          </h1>
          <p
            className="text-lg md:text-xl mb-2"
            style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.2em", fontWeight: 300 }}
          >
            WEB DEVELOPMENT SERVICES
          </p>
          <p
            className="max-w-lg mb-10"
            style={{ fontFamily: "'Special Elite', cursive", color: "#8a9a8a", fontSize: "0.95rem", lineHeight: 1.7 }}
          >
            We build websites that command attention. From the shadows of Gotham,
            we craft digital experiences that are dark, bold, and unforgettable.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="px-8 py-3.5 text-sm tracking-widest transition-all hover:opacity-90"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 700,
                color: "#0d0f18",
                background: "linear-gradient(135deg, #d946ef, #c084fc)",
                letterSpacing: "0.15em",
                borderRadius: "2px",
                boxShadow: "0 0 20px rgba(217,70,239,0.3)",
              }}
            >
              GET IN TOUCH
            </a>
            <Link
              href="/"
              className="px-8 py-3.5 text-sm tracking-widest transition-all hover:opacity-80"
              style={{
                fontFamily: "'Oswald', sans-serif",
                fontWeight: 400,
                color: "#d946ef",
                border: "1px solid rgba(217,70,239,0.4)",
                background: "rgba(217,70,239,0.06)",
                letterSpacing: "0.15em",
                borderRadius: "2px",
              }}
            >
              ENTER THE ROOM
            </Link>
          </div>

          {/* Invisible desk button — links to portfolio */}
          <Link
            href="/portfolio"
            className="absolute z-20 block"
            style={{
              bottom: "8%",
              left: "50%",
              transform: "translateX(-50%)",
              width: "22%",
              height: "18%",
              cursor: "pointer",
              background: "transparent",
              border: "none",
              outline: "none",
            }}
            title=""
          >
            <span className="sr-only">View Portfolio</span>
          </Link>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="w-5 h-8 rounded-full border-2 border-[#d946ef]/40 flex items-start justify-center pt-1.5">
              <div className="w-1 h-2 rounded-full bg-[#d946ef]/60" />
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES SECTION ── */}
      <section className="relative py-24 px-6" style={{ background: "#0a0c16" }}>
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-center text-3xl md:text-4xl mb-4"
            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}
          >
            WHAT WE BUILD
          </h2>
          <p
            className="text-center mb-16 max-w-lg mx-auto"
            style={{ fontFamily: "'Special Elite', cursive", color: "#6a7a6a", fontSize: "0.85rem" }}
          >
            Every project is a case file. Every pixel is evidence. We don't cut corners.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "WEBSITE DESIGN", desc: "Custom-built sites from the ground up. No templates, no shortcuts — just handcrafted code.", icon: "🖥️" },
              { title: "WEBSITE REDESIGN", desc: "Transform your existing site into something that commands respect. Modern, fast, and bold.", icon: "🔄" },
              { title: "WEB APPLICATIONS", desc: "Full-stack applications with real-time features, databases, and authentication built in.", icon: "⚡" },
            ].map((svc) => (
              <a
                key={svc.title}
                href="#contact"
                className="block p-8 transition-all hover:translate-y-[-2px]"
                style={{
                  background: "rgba(217,70,239,0.04)",
                  border: "1px solid rgba(217,70,239,0.15)",
                  borderRadius: "2px",
                }}
              >
                <div className="text-3xl mb-4">{svc.icon}</div>
                <h3
                  className="text-sm tracking-widest mb-3"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontWeight: 700 }}
                >
                  {svc.title}
                </h3>
                <p style={{ fontFamily: "'DM Sans', sans-serif", color: "#8a9a8a", fontSize: "0.8rem", lineHeight: 1.7 }}>
                  {svc.desc}
                </p>
                <span
                  className="inline-block mt-4 text-xs tracking-widest"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc", letterSpacing: "0.1em", fontSize: "0.6rem" }}
                >
                  INQUIRE →
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOTHAM WEATHER + JOKER CLOCK SECTION ── */}
      <section className="relative py-20 px-6" style={{ background: "#080a12", borderTop: "1px solid rgba(217,70,239,0.1)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

            {/* Gotham Weekly Forecast */}
            <div>
              <h2
                className="text-2xl mb-2"
                style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}
              >
                GOTHAM CITY
              </h2>
              <p
                className="mb-6"
                style={{ fontFamily: "'Special Elite', cursive", color: "#6a7a6a", fontSize: "0.75rem" }}
              >
                WEEKLY FORECAST — GCPD WEATHER BUREAU
              </p>

              <div className="flex flex-col gap-2">
                {GOTHAM_FORECAST.map((day) => (
                  <div
                    key={day.day}
                    className="flex items-center gap-4 px-4 py-3 transition-all hover:translate-x-1"
                    style={{
                      background: "rgba(217,70,239,0.03)",
                      border: "1px solid rgba(217,70,239,0.08)",
                      borderRadius: "2px",
                    }}
                  >
                    <span
                      className="text-xs w-10 shrink-0"
                      style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.1em", fontWeight: 700 }}
                    >
                      {day.day}
                    </span>
                    <span className="text-lg shrink-0">{day.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#e8e0c8", letterSpacing: "0.05em" }}>
                        {day.condition}
                      </p>
                      <p className="text-xs" style={{ fontFamily: "'Special Elite', cursive", color: "#5a6a5a", fontSize: "0.6rem" }}>
                        {day.desc}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#c084fc" }}>{day.high}°</span>
                      <span className="text-xs mx-1" style={{ color: "#3a4a3a" }}>/</span>
                      <span className="text-xs" style={{ fontFamily: "'Oswald', sans-serif", color: "#5a6a5a" }}>{day.low}°</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Joker Clock */}
            <div className="flex flex-col items-center justify-center">
              <JokerClock />
              <div className="mt-8 text-center">
                <p
                  className="text-xs tracking-widest mb-2"
                  style={{ fontFamily: "'Oswald', sans-serif", color: "#50fa7b", letterSpacing: "0.15em", fontSize: "0.65rem" }}
                >
                  THE CLOCK IS TICKING
                </p>
                <p
                  className="max-w-xs"
                  style={{ fontFamily: "'Special Elite', cursive", color: "#5a6a5a", fontSize: "0.75rem", lineHeight: 1.6 }}
                >
                  Every second your website isn't working for you, someone else's is.
                  Don't let the joke be on you.
                </p>
                <a
                  href="#contact"
                  className="inline-block mt-6 px-6 py-2.5 text-xs tracking-widest transition-all hover:opacity-80"
                  style={{
                    fontFamily: "'Oswald', sans-serif",
                    color: "#50fa7b",
                    border: "1px solid rgba(80,250,123,0.4)",
                    background: "rgba(80,250,123,0.06)",
                    letterSpacing: "0.12em",
                    borderRadius: "2px",
                  }}
                >
                  START NOW →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM SECTION ── */}
      <section
        id="contact"
        className="relative py-24 px-6"
        style={{ background: "#0a0c16", borderTop: "1px solid rgba(217,70,239,0.1)" }}
      >
        <div className="max-w-lg mx-auto">
          <h2
            className="text-center text-3xl md:text-4xl mb-2"
            style={{ fontFamily: "'Orbitron', sans-serif", fontWeight: 700, color: "#fff", letterSpacing: "0.1em" }}
          >
            CONTACT
          </h2>
          <p
            className="text-center mb-10"
            style={{ fontFamily: "'Special Elite', cursive", color: "#6a7a6a", fontSize: "0.8rem" }}
          >
            Drop your intel below. All transmissions are encrypted.
          </p>

          <ContactForm />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-8 px-6 text-center"
        style={{ background: "#060810", borderTop: "1px solid rgba(217,70,239,0.08)" }}
      >
        <Link
          href="/"
          className="inline-block text-xs tracking-widest transition-all hover:opacity-80 mb-3"
          style={{ fontFamily: "'Oswald', sans-serif", color: "#d946ef", letterSpacing: "0.12em", fontSize: "0.6rem" }}
        >
          ENTER THE BOARD ROOM →
        </Link>
        <p style={{ fontFamily: "'Special Elite', cursive", color: "#3a4a3a", fontSize: "0.6rem" }}>
          © {new Date().getFullYear()} ARKHAM — Built from the shadows of Gotham City
        </p>
      </footer>
    </div>
  );
}
