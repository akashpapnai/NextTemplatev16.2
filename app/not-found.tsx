"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export default function NotFound() {
  const [glitch, setGlitch] = useState(false);
  const [floatOffset, setFloatOffset] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Floating animation
  useEffect(() => {
    let frame: number;
    let t = 0;
    const animate = () => {
      t += 0.018;
      setFloatOffset(Math.sin(t) * 10);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  // Glitch trigger
  useEffect(() => {
    const loop = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 350);
    }, 4000);
    return () => clearInterval(loop);
  }, []);

  // Mouse parallax
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 30,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Star field canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const stars: { x: number; y: number; r: number; o: number; speed: number }[] = [];
    for (let i = 0; i < 120; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.5 + 0.3,
        o: Math.random() * 0.7 + 0.1,
        speed: Math.random() * 0.003 + 0.001,
      });
    }

    let animId: number;
    let t = 0;
    const draw = () => {
      t += 0.01;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const twinkle = s.o * (0.6 + 0.4 * Math.sin(t * s.speed * 200 + s.x));
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(165, 180, 252, ${twinkle})`; // indigo-300 tone
        ctx.fill();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    const onResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white relative overflow-hidden">
      <style>{`
        @keyframes ticker {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .ticker { animation: ticker 22s linear infinite; }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spin-slow { animation: spin-slow 20s linear infinite; }

        @keyframes spin-rev {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .spin-rev { animation: spin-rev 15s linear infinite; }

        @keyframes pulse-ring {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.35; transform: scale(1.05); }
        }
        .pulse-ring { animation: pulse-ring 3s ease-in-out infinite; }

        .glitch { position: relative; }
        .glitch.on::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #a5b4fc, #6366f1);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          clip-path: inset(20% 0 60% 0);
          transform: translate(-3px, 0);
          animation: gc 0.1s steps(1) 3;
        }
        .glitch.on::after {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          background: linear-gradient(to bottom, #c7d2fe, #818cf8);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          clip-path: inset(55% 0 10% 0);
          transform: translate(3px, 0);
          animation: gc2 0.1s steps(1) 3;
        }
        @keyframes gc {
          0%,100% { clip-path: inset(20% 0 60% 0); }
          50% { clip-path: inset(70% 0 5% 0); }
        }
        @keyframes gc2 {
          0%,100% { clip-path: inset(55% 0 10% 0); }
          50% { clip-path: inset(5% 0 75% 0); }
        }

        .dash-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 28px;
          border-radius: 14px;
          font-weight: 600;
          font-size: 15px;
          color: #fff;
          background: #4f46e5;
          border: 1px solid #6366f1;
          text-decoration: none;
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 0 0 rgba(99,102,241,0);
        }
        .dash-btn:hover {
          background: #4338ca;
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(99,102,241,0.45);
        }
        .dash-btn:active { transform: scale(0.97); }

        .stat-card {
          background: rgba(99,102,241,0.07);
          border: 1px solid rgba(99,102,241,0.2);
          border-radius: 16px;
          padding: 16px 20px;
          text-align: center;
          transition: border-color 0.2s, background 0.2s;
        }
        .stat-card:hover {
          background: rgba(99,102,241,0.12);
          border-color: rgba(99,102,241,0.4);
        }
      `}</style>

      {/* Star canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }} />

      {/* Original background glows — kept exactly */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 1 }}>
        <div
          className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl"
          style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }}
        />
        <div
          className="absolute bottom-0 right-0 w-120 h-120 bg-pink-500/10 rounded-full blur-3xl"
          style={{ transform: `translate(${-mousePos.x * 0.3}px, ${-mousePos.y * 0.3}px)` }}
        />
        {/* Extra subtle indigo mid blob */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-md h-md bg-indigo-600/10 rounded-full blur-3xl"
          style={{ transform: `translate(calc(-50% + ${mousePos.x * 0.2}px), calc(-50% + ${mousePos.y * 0.2}px))` }}
        />
      </div>

      {/* Decorative spinning rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
        <div className="spin-slow" style={{ width: 480, height: 480, borderRadius: "50%", border: "1px dashed rgba(99,102,241,0.18)" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 1 }}>
        <div className="spin-rev" style={{ width: 360, height: 360, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.12)" }} />
      </div>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none pulse-ring" style={{ zIndex: 1 }}>
        <div style={{ width: 560, height: 560, borderRadius: "50%", border: "1px solid rgba(99,102,241,0.15)" }} />
      </div>

      {/* Main content */}
      <div
        className="relative flex flex-col items-center justify-center min-h-screen px-6 text-center pb-12"
        style={{ zIndex: 10 }}
      >

        {/* 404 */}
        <div
          style={{ transform: `translateY(${floatOffset}px)`, transition: "transform 0.05s linear" }}
          className="relative"
        >
          {/* Glow behind the number */}
          <div className="absolute inset-0 blur-3xl opacity-25 bg-indigo-500 rounded-full" />
          <h1
            data-text="404"
            className={`glitch${glitch ? " on" : ""} text-[120px] md:text-[180px] font-black tracking-tight text-transparent bg-clip-text bg-linear-to-b from-indigo-300 to-indigo-600 leading-none select-none`}
          >
            404
          </h1>
        </div>

        {/* Hindi copy — original lines preserved */}
        <div className="mt-2 space-y-3">
          <p className="text-2xl md:text-4xl font-bold">
            अब की बार...
          </p>
          <p className="text-3xl md:text-5xl font-extrabold text-indigo-400">
            चार सौ चार 😭
          </p>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl leading-relaxed">
            लगता है जिस पेज को आप ढूंढ रहे हैं,
            वो इंटरनेट की दुनिया में कहीं खो गया है।
            <br />
            या फिर डेवलपर ने रात के 2 बजे deploy किया था 🚀
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-sm">
          {[
            { num: "404", label: "Error Code" },
            { num: "∞", label: "Pages खोजे" },
            { num: "0", label: "Pages मिले" },
          ].map(({ num, label }) => (
            <div key={label} className="stat-card">
              <p className="text-xl font-extrabold text-indigo-400 leading-none mb-1">{num}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Dashboard button */}
        <div className="mt-8">
          <Link href="/dashboard" className="dash-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Dashboard
          </Link>
        </div>

        {/* Original footer line */}
        <p className="mt-10 text-xs text-slate-600">
          Error 404 • Page Not Found • लेकिन टेंशन लेने का नहीं ✨
        </p>
      </div>

      {/* Scrolling ticker */}
      <div
        className="fixed bottom-0 left-0 right-0 overflow-hidden"
        style={{
          zIndex: 20,
          borderTop: "1px solid rgba(99,102,241,0.15)",
          background: "rgba(2,6,23,0.85)",
          backdropFilter: "blur(10px)",
          padding: "8px 0",
        }}
      >
        <div className="ticker" style={{ display: "flex", whiteSpace: "nowrap", width: "max-content" }}>
          {[...Array(2)].map((_, i) => (
            <span key={i} style={{ display: "inline-flex" }}>
              {[
                { text: "404 NOT FOUND", accent: true },
                { text: "•", accent: false },
                { text: "पेज गायब है", accent: false },
                { text: "•", accent: false },
                { text: "DEVELOPER WAS SLEEPING", accent: true },
                { text: "•", accent: false },
                { text: "टेंशन मत लो", accent: false },
                { text: "•", accent: false },
                { text: "ROUTE MISSING", accent: true },
                { text: "•", accent: false },
                { text: "चार सौ चार", accent: false },
                { text: "•", accent: false },
                { text: "PAGE WENT ON VACATION", accent: true },
                { text: "•", accent: false },
                { text: "घर वापस जाओ", accent: false },
                { text: "•", accent: false },
              ].map((item, j) => (
                <span
                  key={j}
                  style={{
                    fontSize: "10px",
                    fontWeight: item.text === "•" ? 400 : 700,
                    letterSpacing: item.text === "•" ? 0 : "0.12em",
                    color: item.text === "•"
                      ? "rgba(99,102,241,0.25)"
                      : item.accent
                      ? "#818cf8"
                      : "rgba(148,163,184,0.5)",
                    padding: "0 14px",
                  }}
                >
                  {item.text}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}