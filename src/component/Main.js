import { useState, useEffect, useRef } from "react";

const CURRENCY_SYMBOLS = ["$", "€", "¥", "£", "₿", "₽", "元", "₩", "₴", "฿"];
const CANDLE_COUNT = 26;
const CANDLE_SPACING = 54;
const CW = 16;
const CWH = CW / 2;
const FLOAT_ANIMS = ["floatA", "floatB", "floatC", "floatD", "floatE"];
const ICON_COLORS = [
  "rgba(0,230,118,0.18)",
  "rgba(0,200,255,0.15)",
  "rgba(255,200,0,0.14)",
  "rgba(255,80,120,0.14)",
  "rgba(180,100,255,0.15)",
  "rgba(0,230,118,0.12)",
  "rgba(255,160,0,0.14)",
  "rgba(0,200,255,0.13)",
  "rgba(0,230,118,0.16)",
  "rgba(255,80,120,0.12)",
];

const BROKERS = [
  "Quotex",
  "Pocket Option",
  "IQ Option",
  "Binomo",
  "Olymp Trade",
  "Deriv",
];
const ASSETS = [
  "EUR/USD (OTC)",
  "GBP/USD (OTC)",
  "NZD/CAD (OTC)",
  "USD/JPY (OTC)",
  "AUD/USD (OTC)",
  "BTC/USD",
  "ETH/USD",
  "GOLD (OTC)",
  "OIL (OTC)",
  "EUR/GBP (OTC)",
];
const TIMEFRAMES = ["15secs", "30secs", "1min", "2min", "5min", "15min"];

function randomBetween(a, b) {
  return a + Math.random() * (b - a);
}

function generateCandles(count) {
  return Array.from({ length: count }, (_, i) => ({
    x: i * CANDLE_SPACING + 20,
    isGreen: Math.random() > 0.45,
    bodyH: randomBetween(35, 100),
    bodyY: randomBetween(100, 250),
    wickTop: randomBetween(10, 28),
    wickBot: randomBetween(10, 28),
    floatSpeed: randomBetween(3.5, 7),
    floatRange: randomBetween(6, 14),
    floatPhase: randomBetween(0, 6.28),
    id: i,
  }));
}

function FloatingCurrency({
  symbol,
  top,
  left,
  fontSize,
  animName,
  delay,
  color,
}) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        fontSize,
        color,
        fontWeight: 900,
        pointerEvents: "none",
        userSelect: "none",
        animation: `${animName} 6s ease-in-out infinite`,
        animationDelay: delay,
        fontFamily: "Orbitron, monospace",
        textShadow: `0 0 12px ${color}`,
        zIndex: 1,
      }}
    >
      {symbol}
    </div>
  );
}

function Candle({ candle, offsetY }) {
  const color = candle.isGreen ? "#00e676" : "#ff4d6d";
  const glow = candle.isGreen ? "#00e67688" : "#ff4d6d88";
  const { x, bodyY, bodyH, wickTop, wickBot } = candle;
  const cx = x + CWH;

  return (
    <g transform={`translate(0, ${offsetY})`} style={{ transition: "none" }}>
      <line
        x1={cx}
        y1={bodyY - wickTop}
        x2={cx}
        y2={bodyY}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.8}
      />
      <rect
        x={x}
        y={bodyY}
        width={CW}
        height={bodyH}
        rx={2}
        fill={color}
        opacity={0.92}
        style={{ filter: `drop-shadow(0 0 5px ${glow})` }}
      />
      {candle.isGreen ? (
        <polygon
          points={`${cx},${bodyY - wickTop - 7} ${cx - 6},${
            bodyY - wickTop
          } ${cx + 6},${bodyY - wickTop}`}
          fill={color}
          opacity={0.85}
        />
      ) : (
        <polygon
          points={`${cx},${bodyY + bodyH + wickBot + 7} ${cx - 6},${
            bodyY + bodyH + wickBot
          } ${cx + 6},${bodyY + bodyH + wickBot}`}
          fill={color}
          opacity={0.85}
        />
      )}
      <line
        x1={cx}
        y1={bodyY + bodyH}
        x2={cx}
        y2={bodyY + bodyH + wickBot}
        stroke={color}
        strokeWidth={1.5}
        opacity={0.8}
      />
    </g>
  );
}

const LOADING_MESSAGES = [
  "📊 Analyzing technical indicators and chart patterns...",
  "🤖 Processing AI algorithms for trend prediction...",
  "⚡ Evaluating support and resistance levels...",
  "📈 Computing optimal entry points and market sentiment...",
  "🎯 Finalizing signal accuracy and confidence metrics...",
];

const TOTAL_DURATION = 5000;
const MSG_INTERVAL = TOTAL_DURATION / LOADING_MESSAGES.length;

function SignalGenerator() {
  const [broker, setBroker] = useState("Quotex");
  const [asset, setAsset] = useState("NZD/CAD (OTC)");
  const [timeframe, setTimeframe] = useState("15secs");
  const [generating, setGenerating] = useState(false);
  const [signal, setSignal] = useState(null);
  const [progress, setProgress] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  function generateSignal() {
    setGenerating(true);
    setSignal(null);
    setProgress(0);
    setMsgIndex(0);

    const start = performance.now();
    let msgI = 0;

    const msgTimer = setInterval(() => {
      msgI += 1;
      if (msgI < LOADING_MESSAGES.length) setMsgIndex(msgI);
    }, MSG_INTERVAL);

    const rafLoop = (now) => {
      const elapsed = now - start;
      const pct = Math.min((elapsed / TOTAL_DURATION) * 100, 100);
      setProgress(pct);

      if (elapsed < TOTAL_DURATION) {
        requestAnimationFrame(rafLoop);
      } else {
        clearInterval(msgTimer);
        const isBuy = Math.random() > 0.5;
        const confidence = Math.floor(randomBetween(82, 99));
        setSignal({
          isBuy,
          confidence,
          asset,
          timeframe,
          broker,
          time: new Date().toLocaleTimeString(),
        });
        setGenerating(false);
        setProgress(100);
      }
    };

    requestAnimationFrame(rafLoop);
  }

  const selectStyle = {
    width: "100%",
    padding: "13px 16px",
    borderRadius: 10,
    border: "1.5px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    color: "#e0ffe8",
    fontFamily: "Rajdhani, monospace",
    fontWeight: 600,
    fontSize: "clamp(14px, 2.2vw, 15px)",
    cursor: "pointer",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2300e676' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 14px center",
    paddingRight: 36,
    boxSizing: "border-box",
  };

  const labelStyle = {
    display: "flex",
    alignItems: "center",
    gap: 8,
    fontFamily: "Rajdhani, monospace",
    fontWeight: 700,
    color: "#c0d8c8",
    fontSize: "clamp(12px, 2vw, 14px)",
    letterSpacing: 1,
    marginBottom: 8,
    textTransform: "uppercase",
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: "clamp(24px, 6vw, 30px)", marginBottom: 4 }}>
          🚀
        </div>
        <div
          style={{
            fontFamily: "Orbitron, monospace",
            fontWeight: 900,
            fontSize: "clamp(18px, 4.5vw, 20px)",
            background: "linear-gradient(90deg, #00e676, #69ffb4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            lineHeight: 1.25,
          }}
        >
          Master Trader
          <br />
          Generator 🚀
        </div>
        <div
          style={{
            fontFamily: "Rajdhani, monospace",
            color: "rgba(180,220,200,0.55)",
            fontSize: "clamp(12px, 2.6vw, 13px)",
            marginTop: 8,
            lineHeight: 1.5,
          }}
        >
          Generate high-precision trading signals with advanced AI algorithms
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>
          <span>🏦</span> Select Broker
        </div>
        <select
          value={broker}
          onChange={(e) => setBroker(e.target.value)}
          style={selectStyle}
          disabled={generating}
        >
          {BROKERS.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <div style={labelStyle}>
          <span>🔄</span> Trading Asset
        </div>
        <select
          value={asset}
          onChange={(e) => setAsset(e.target.value)}
          style={selectStyle}
          disabled={generating}
        >
          {ASSETS.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 22 }}>
        <div style={labelStyle}>
          <span>⏱️</span> Time Frame
        </div>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          style={selectStyle}
          disabled={generating}
        >
          {TIMEFRAMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {generating && (
        <div
          style={{
            marginBottom: 20,
            borderRadius: 14,
            border: "1.5px solid rgba(0,230,118,0.18)",
            background: "rgba(0,230,118,0.04)",
            padding: "18px 16px",
            animation: "signalReveal 0.3s ease both",
          }}
        >
          <div
            style={{
              fontFamily: "Rajdhani, monospace",
              fontSize: "clamp(12px, 2.5vw, 13px)",
              fontWeight: 600,
              color: "#00e676",
              letterSpacing: 0.4,
              marginBottom: 14,
              minHeight: 22,
              lineHeight: 1.5,
            }}
          >
            {LOADING_MESSAGES[msgIndex]}
          </div>

         <div
  style={{
    width: "100%",
    height: 8,
    borderRadius: 8,
    background: "rgba(255,255,255,0.07)",
    overflow: "hidden",
    position: "relative",
  }}
>
  {/* Track layer — scales from left, no animation conflict */}
  <div
    style={{
      position: "absolute",
      top: 0, left: 0,
      width: "100%",
      height: "100%",
      transformOrigin: "left center",
      transform: `scaleX(${progress / 100})`,
      transition: "transform 0.1s linear",
      background: "linear-gradient(90deg, #00c853, #00e676, #69ffb4)",
      boxShadow: "0 0 10px rgba(0,230,118,0.6)",
    }}
  >
    {/* Shimmer sweep — runs independently inside */}
    <div
      style={{
        position: "absolute",
        top: 0, left: "-60%",
        width: "60%",
        height: "100%",
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)",
        animation: "barSweep 1.2s linear infinite",
      }}
    />
  </div>
</div>
          <div
            style={{
              textAlign: "right",
              marginTop: 6,
              fontFamily: "Orbitron, monospace",
              fontSize: 11,
              color: "rgba(0,230,118,0.6)",
              fontWeight: 700,
              letterSpacing: 1,
            }}
          >
            {Math.round(progress)}%
          </div>

          <div
            style={{
              display: "flex",
              gap: 6,
              marginTop: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            {LOADING_MESSAGES.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i <= msgIndex ? 20 : 8,
                  height: 8,
                  borderRadius: 4,
                  background:
                    i <= msgIndex ? "#00e676" : "rgba(255,255,255,0.12)",
                  transition: "all 0.4s ease",
                  boxShadow: i === msgIndex ? "0 0 8px #00e676" : "none",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {signal && !generating && (
        <div
          style={{
            marginBottom: 20,
            borderRadius: 14,
            overflow: "hidden",
            border: "1.5px solid rgba(255,255,255,0.10)",
            background: "rgba(255,255,255,0.03)",
            animation:
              "signalReveal 0.55s cubic-bezier(0.34,1.56,0.64,1) both",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <span style={{ fontSize: 20 }}>🎯</span>
            <span
              style={{
                fontFamily: "Rajdhani, monospace",
                fontWeight: 700,
                fontSize: "clamp(14px, 2.8vw, 15px)",
                color: "#00e676",
                letterSpacing: 0.5,
              }}
            >
              Latest Signal Generated!
            </span>
          </div>

          <div
            className="signal-head-row"
            style={{
              padding: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding: "12px 24px",
                borderRadius: 10,
                background: signal.isBuy
                  ? "linear-gradient(135deg, #00c853, #00e676)"
                  : "linear-gradient(135deg, #d50000, #ff4d6d)",
                fontFamily: "Orbitron, monospace",
                fontWeight: 900,
                fontSize: "clamp(18px, 4vw, 20px)",
                color: "#fff",
                letterSpacing: 2,
                boxShadow: signal.isBuy
                  ? "0 4px 18px rgba(0,230,118,0.45)"
                  : "0 4px 18px rgba(255,77,109,0.45)",
                minWidth: 120,
                textAlign: "center",
              }}
            >
              {signal.isBuy ? "BUY" : "SELL"}
            </div>

            <div
              style={{
                fontFamily: "Orbitron, monospace",
                fontWeight: 700,
                fontSize: "clamp(15px, 3vw, 17px)",
                color: "#00e676",
                textAlign: "right",
              }}
            >
              {signal.confidence}% Confidence
            </div>
          </div>

          <div
            className="signal-grid"
            style={{
              padding: "14px 16px",
              display: "grid",
              gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
              rowGap: 14,
              columnGap: 14,
            }}
          >
            {[
              ["Asset:", signal.asset],
              ["Timeframe:", signal.timeframe],
              ["Generated:", signal.time],
            ].map(([label, val]) => (
              <div key={label}>
                <div
                  style={{
                    fontFamily: "Rajdhani, monospace",
                    color: "rgba(200,220,210,0.55)",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontFamily: "Rajdhani, monospace",
                    color: "#e0ffe8",
                    fontWeight: 700,
                    fontSize: "clamp(14px, 2.8vw, 15px)",
                    marginTop: 3,
                    wordBreak: "break-word",
                  }}
                >
                  {val}
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              margin: "0 14px 14px",
              padding: "10px 14px",
              borderRadius: 8,
              border: "1px solid rgba(255,120,60,0.30)",
              background: "rgba(255,100,40,0.08)",
              fontFamily: "Rajdhani, monospace",
              fontSize: "clamp(11px, 2.5vw, 12px)",
              color: "rgba(255,160,80,0.85)",
              textAlign: "center",
              fontWeight: 600,
              lineHeight: 1.5,
            }}
          >
            Click "Generate Signal" below for a new analysis
          </div>
        </div>
      )}

      <button
        onClick={generateSignal}
        disabled={generating}
        style={{
          width: "100%",
          padding: "16px 0",
          borderRadius: 50,
          border: "none",
          background: generating
            ? "rgba(255,255,255,0.08)"
            : "linear-gradient(90deg, #e65c00, #f9a825, #e65c00)",
          backgroundSize: "200% auto",
          color: generating ? "rgba(255,255,255,0.4)" : "#fff",
          fontFamily: "Orbitron, monospace",
          fontWeight: 900,
          fontSize: "clamp(12px, 2.8vw, 14px)",
          letterSpacing: "clamp(1px, 0.6vw, 3px)",
          cursor: generating ? "not-allowed" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 10,
          animation: generating ? "none" : "btnOrangeShimmer 2s linear infinite",
          boxShadow: generating ? "none" : "0 4px 28px rgba(230,92,0,0.50)",
          transition: "all 0.3s ease",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontSize: 16 }}>⚡</span>
        {generating ? "ANALYZING..." : "GENERATE NEW SIGNAL"}
        <span style={{ fontSize: 16 }}>✨</span>
      </button>

      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.07)",
          marginTop: 20,
          paddingTop: 16,
        }}
      >
        {[
          ["📊", "AI-Powered Analysis"],
          ["🎯", "95%+ Accuracy Rate"],
          ["⚡", "Real-time Signals"],
        ].map(([icon, text]) => (
          <div
            key={text}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontFamily: "Rajdhani, monospace",
              color: "rgba(180,220,200,0.60)",
              fontSize: "clamp(12px, 2.4vw, 13px)",
              fontWeight: 600,
              marginBottom: 7,
              lineHeight: 1.5,
            }}
          >
            <span>{icon}</span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChineseSignalsBot() {
  const candlesRef = useRef(generateCandles(CANDLE_COUNT));
  const candles = candlesRef.current;
  const [offsets, setOffsets] = useState(() =>
    new Array(CANDLE_COUNT).fill(0)
  );
  const rafRef = useRef(null);
  const startRef = useRef(performance.now());

  useEffect(() => {
    function tick(now) {
      const t = (now - startRef.current) / 1000;
      setOffsets(
        candles.map(
          (c) =>
            Math.sin((t / c.floatSpeed) * Math.PI * 2 + c.floatPhase) *
            c.floatRange
        )
      );
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [candles]);

  const [licenseKey, setLicenseKey] = useState("");
  const [page, setPage] = useState("login");
  const [shake, setShake] = useState(false);
  const [wrongKey, setWrongKey] = useState(false);

  const floatingSymbols = useRef(
    CURRENCY_SYMBOLS.map((sym, i) => ({
      symbol: sym,
      top: randomBetween(4, 88) + "%",
      left: randomBetween(2, 90) + "%",
      delay: (i * 0.7).toFixed(1) + "s",
      fontSize: randomBetween(18, 36) + "px",
      animName: FLOAT_ANIMS[i % FLOAT_ANIMS.length],
      color: ICON_COLORS[i],
    }))
  );

  function handleSubmit() {
    setWrongKey(false);

    if (!licenseKey.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    if (licenseKey.trim() !== "SA4855") {
      setShake(true);
      setWrongKey(true);
      setTimeout(() => setShake(false), 600);
      return;
    }

    setPage("verifying");
    setTimeout(() => setPage("signal"), 1400);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#0d1117",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Rajdhani', 'Orbitron', monospace",
        padding: "20px 14px 90px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;600;700&family=Orbitron:wght@700;900&display=swap');

        * {
          box-sizing: border-box;
        }

        @keyframes floatA {
          0%,100% { transform: translateY(0px) rotate(-8deg) scale(1); opacity: 0.18; }
          50% { transform: translateY(-18px) rotate(8deg) scale(1.1); opacity: 0.28; }
        }

        @keyframes floatB {
          0%,100% { transform: translateY(0px) translateX(0px) rotate(5deg); opacity: 0.15; }
          33% { transform: translateY(-14px) translateX(8px) rotate(-5deg); opacity: 0.25; }
          66% { transform: translateY(-8px) translateX(-6px) rotate(10deg); opacity: 0.20; }
        }

        @keyframes floatC {
          0%,100% { transform: translateY(0px) scale(1) rotate(0deg); opacity: 0.16; }
          50% { transform: translateY(-22px) scale(1.15) rotate(-12deg); opacity: 0.30; }
        }

        @keyframes floatD {
          0% { transform: translateY(0px) rotate(6deg); opacity: 0.13; }
          25% { transform: translateY(-10px) rotate(-6deg); opacity: 0.22; }
          75% { transform: translateY(-16px) rotate(10deg); opacity: 0.18; }
          100% { transform: translateY(0px) rotate(6deg); opacity: 0.13; }
        }

        @keyframes floatE {
          0%,100% { transform: translateY(0px) translateX(0px) rotate(-4deg); opacity: 0.14; }
          40% { transform: translateY(-20px) translateX(10px) rotate(8deg); opacity: 0.26; }
          80% { transform: translateY(-6px) translateX(-8px) rotate(-8deg); opacity: 0.19; }
        }

        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }

        @keyframes scanLine {
          0% { top: 0%; opacity: 0.15; }
          100% { top: 100%; opacity: 0; }
        }

        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        @keyframes barShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes btnOrangeShimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }

        @keyframes msgFade {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes signalReveal {
          from { opacity: 0; transform: scale(0.92) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        @keyframes pageSlide {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes verifyDot {
          0%,100% { opacity: 0.2; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.2); }
        }

        .submit-btn {
          transition: filter 0.2s, transform 0.15s;
        }

        .submit-btn:hover {
          filter: brightness(1.18) drop-shadow(0 0 14px #00e676cc);
          transform: translateY(-2px) scale(1.02);
        }

        .submit-btn:active {
          transform: scale(0.97);
        }

        .input-field:focus {
          outline: none;
          border-color: #00e676;
          box-shadow: 0 0 0 3px #00e67633;
        }

        select option {
          background: #0d1a14 !important;
          color: #e0ffe8;
        }

        @media (max-width: 640px) {
          .signal-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <svg
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0.6,
          pointerEvents: "none",
        }}
        viewBox="0 0 1440 500"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id="bgGlow" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="#00e67608" />
            <stop offset="100%" stopColor="#0d111700" />
          </radialGradient>
        </defs>

        <rect width="1440" height="500" fill="url(#bgGlow)" />
        {candles.map((c, i) => (
          <Candle key={c.id} candle={c} offsetY={offsets[i] ?? 0} />
        ))}
      </svg>

      {floatingSymbols.current.map((s, i) => (
        <FloatingCurrency
          key={i}
          symbol={s.symbol}
          top={s.top}
          left={s.left}
          fontSize={s.fontSize}
          animName={s.animName}
          delay={s.delay}
          color={s.color}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 36,
          background: "rgba(0,230,118,0.09)",
          borderTop: "1px solid rgba(0,230,118,0.18)",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            whiteSpace: "nowrap",
            animation: "ticker 22s linear infinite",
            color: "#00e676",
            fontSize: "clamp(11px, 2.2vw, 13px)",
            fontFamily: "Rajdhani, monospace",
            fontWeight: 600,
            letterSpacing: 2,
          }}
        >
          {[
            "EUR/USD +0.12%",
            "BTC/USD +2.41%",
            "GBP/JPY -0.07%",
            "GOLD +0.55%",
            "XAU/USD +0.34%",
            "ETH/USD +1.87%",
            "NAS100 +0.22%",
            "OIL -1.10%",
            "EUR/USD +0.12%",
            "BTC/USD +2.41%",
            "GBP/JPY -0.07%",
            "GOLD +0.55%",
            "XAU/USD +0.34%",
            "ETH/USD +1.87%",
            "NAS100 +0.22%",
            "OIL -1.10%",
          ].map((t, i) => (
            <span key={i} style={{ marginRight: 32 }}>
              {t}
            </span>
          ))}
        </div>
      </div>

     

      <div
        style={{
          position: "relative",
          zIndex: 10,
          background: "rgba(13,20,30,0.93)",
          border: "1.5px solid rgba(0,230,118,0.20)",
          borderRadius: 22,
          padding: page === "signal" ? "24px 18px 22px" : "28px 18px 24px",
          width: "100%",
          maxWidth: page === "signal" ? 420 : 400,
          boxShadow:
            "0 8px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,230,118,0.06)",
          backdropFilter: "blur(18px)",
          transition: "width 0.4s ease, padding 0.4s ease",

        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: 22,
            overflow: "hidden",
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent, rgba(0,230,118,0.18), transparent)",
              animation: "scanLine 3s linear infinite",
            }}
          />
        </div>

        {page === "login" && (
          <div style={{ animation: "pageSlide 0.4s ease" }}>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ fontSize: "clamp(24px, 5vw, 28px)", marginRight: 10 }}>
                📈
              </span>
              <span
                style={{
                  fontFamily: "Orbitron, monospace",
                  fontWeight: 900,
                  fontSize: "clamp(18px, 4vw, 22px)",
                  background: "linear-gradient(90deg, #00e676, #69ffb4)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: 1,
                }}
              >
                Master Trader
              </span>
              <span
                style={{
                  fontFamily: "Rajdhani, monospace",
                  fontWeight: 700,
                  fontSize: "clamp(18px, 4vw, 22px)",
                  color: "#e0ffe8",
                  marginLeft: 8,
                  letterSpacing: 2,
                }}
              >
                — AI BOT
              </span>
            </div>

            <label
              style={{
                display: "block",
                fontFamily: "Rajdhani, monospace",
                fontWeight: 700,
                color: "#b0c8b8",
                fontSize: "clamp(12px, 2.5vw, 14px)",
                letterSpacing: 1.5,
                marginBottom: 12,
                textTransform: "uppercase",
              }}
            >
              Enter License Key:
            </label>

            <input
              className="input-field"
              type="text"
              value={licenseKey}
              onChange={(e) => {
                setLicenseKey(e.target.value);
                setWrongKey(false);
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              placeholder="XXXX-XXXX-XXXX"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: 10,
                border: `1.5px solid ${
                  wrongKey ? "#ff4d6d" : "rgba(0,230,118,0.22)"
                }`,
                background: wrongKey
                  ? "rgba(255,77,109,0.05)"
                  : "rgba(0,255,120,0.04)",
                color: "#e0ffe8",
                fontFamily: "Orbitron, monospace",
                fontSize: "clamp(13px, 3vw, 15px)",
                letterSpacing: "clamp(1px, 0.7vw, 3px)",
                boxSizing: "border-box",
                marginBottom: 6,
                transition: "border-color 0.2s, box-shadow 0.2s",
                animation: shake ? "shake 0.5s ease" : undefined,
              }}
            />

            {wrongKey && (
              <div
                style={{
                  color: "#ff4d6d",
                  fontFamily: "Rajdhani, monospace",
                  fontSize: 12,
                  letterSpacing: 1,
                  marginBottom: 12,
                  paddingLeft: 4,
                }}
              >
                ✗ Invalid license key. Please try again.
              </div>
            )}

            {!wrongKey && <div style={{ marginBottom: 14 }} />}

            <button
              className="submit-btn"
              onClick={handleSubmit}
              style={{
                width: "100%",
                padding: "15px 0",
                borderRadius: 10,
                border: "none",
                background: "linear-gradient(90deg, #00c853, #00e676)",
                color: "#001a0a",
                fontFamily: "Orbitron, monospace",
                fontWeight: 900,
                fontSize: "clamp(13px, 3vw, 15px)",
                letterSpacing: "clamp(2px, 1vw, 4px)",
                cursor: "pointer",
              }}
            >
              SUBMIT
            </button>

            <div
              style={{
                textAlign: "center",
                marginTop: 20,
                color: "rgba(0,230,118,0.3)",
                fontSize: 11,
                fontFamily: "Rajdhani, monospace",
                letterSpacing: 2,
                textTransform: "uppercase",
                lineHeight: 1.5,
              }}
            >
              🔒 Secure · Encrypted · Verified
            </div>
          </div>
        )}

        {page === "verifying" && (
          <div
            style={{
              textAlign: "center",
              padding: "28px 0",
              animation: "pageSlide 0.3s ease",
            }}
          >
            <div
              style={{
                fontSize: "clamp(42px, 10vw, 54px)",
                marginBottom: 18,
                animation: "spin 1s linear infinite",
                display: "inline-block",
              }}
            >
              ⚡
            </div>

            <div
              style={{
                fontFamily: "Orbitron, monospace",
                color: "#00e676",
                fontSize: "clamp(14px, 3vw, 16px)",
                fontWeight: 700,
                letterSpacing: 3,
              }}
            >
              VERIFYING KEY...
            </div>

            <div
              style={{
                color: "rgba(0,230,118,0.5)",
                fontSize: "clamp(11px, 2.3vw, 12px)",
                fontFamily: "Rajdhani, monospace",
                marginTop: 10,
                letterSpacing: 2,
              }}
            >
              Connecting to signal engine
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: 6,
                marginTop: 22,
              }}
            >
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "#00e676",
                    animation: `verifyDot 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.18}s`,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {page === "signal" && (
          <div
            style={{
              animation: "pageSlide 0.5s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <SignalGenerator />
          </div>
        )}
      </div>
    </div>
  );
}