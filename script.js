const $ = (s) => document.querySelector(s),
  $$ = (s) => [...document.querySelectorAll(s)];
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const short = (n) =>
  n >= 1e7
    ? "₹" + (n / 1e7).toFixed(2) + " Cr"
    : n >= 1e5
      ? "₹" + (n / 1e5).toFixed(2) + " Lakh"
      : inr(n);
const toast = (t) => {
  const e = $("#toast");
  e.textContent = t;
  e.style.display = "block";
  clearTimeout(toast.t);
  toast.t = setTimeout(() => (e.style.display = "none"), 3500);
};
const store = {
  get: (k) => {
    try {
      return localStorage.getItem(k);
    } catch (e) {
      return null;
    }
  },
  set: (k, v) => {
    try {
      localStorage.setItem(k, v);
    } catch (e) { }
  },
};


// Theme
const root = document.documentElement;

function setTheme(t) {
  root.dataset.theme = t;

  $("#theme").innerHTML = `
    <img
      src="${t === "dark"
      ? "images/light-mode.svg"
      : "images/dark-mode.svg"
    }"
      alt="${t === "dark" ? "Light theme" : "Dark theme"}"
      width="26"
      height="26"
    />
  `;

  store.set("msb_theme", t);
}

setTheme(
  store.get("msb_theme") ||
  (matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light")
);

$("#theme").onclick = () =>
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");

// Mobile menu
$("#burger").innerHTML = `
  <img
    src="https://cdn.jsdelivr.net/npm/lucide-static@latest/icons/menu.svg"
    alt="Menu"
    width="24"
    height="24"
  />
`;

$("#burger").onclick = () =>
  $("#menu").classList.toggle("open");

$$("#menu a").forEach((a) => {
  a.onclick = () => $("#menu").classList.remove("open");
});


// Ticker (static demo data)
const tk = [
  ["NIFTY 50", "24,850.30", "+0.42%"],
  ["BANK NIFTY", "53,120.75", "+0.31%"],
  ["SENSEX", "81,420.60", "+0.38%"],
  ["GOLD", "₹1,49,999", "+0.55%"],
  ["SILVER", "₹1,85,400", "-0.20%"],
  ["CRUDE OIL", "₹5,640", "+0.65%"],
  ["NATURAL GAS", "₹268.40", "-0.90%"],
];
const th = tk
  .map(
    ([n, p, c]) =>
      `<span><b>${n}</b>${p} <i class="${c[0] == "-" ? "dn" : "up"}" style="font-style:normal">${c[0] == "-" ? "▼" : "▲"} ${c}</i></span>`,
  )
  .join("");
$("#tt").innerHTML = th + th;

// Market status (IST)
function ist() {
  const p = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Kolkata",
      weekday: "short",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
      .formatToParts(new Date())
      .map((x) => [x.type, x.value]),
  );
  return { d: p.weekday, m: (+p.hour % 24) * 60 + +p.minute };
}
function status() {
  const t = ist(),
    wd = !["Sat", "Sun"].includes(t.d);
  const usDst = /EDT/.test(
    new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      timeZoneName: "short",
    }).format(new Date()),
  );
  const mcxEnd = usDst ? 23 * 60 + 55 : 23 * 60 + 30;
  const s = {
    nse: wd && t.m >= 555 && t.m < 930,
    mcx: wd && t.m >= 540 && t.m < mcxEnd,
  };
  $$("[data-ex]").forEach((e) => {
    const o = s[e.dataset.ex];
    e.textContent = o ? "● Market Open" : "● Market Closed";
    e.className = "badge " + (o ? "open" : "closed");
  });
  $("#mcxT").textContent =
    `9:00 AM – ${usDst ? "11:55" : "11:30"} PM, Mon–Fri`;
}
status();
setInterval(status, 30000);

// Content blocks
const R = (id, arr, fn) => {
  const e = $(id);
  if (e) e.innerHTML = arr.map(fn).join("");
};
R(
  "#mk",
  [
    [
      "green",
      "NSE &amp; BSE",
      "Equity and F&amp;O. Indices: Nifty 50, Bank Nifty, Fin Nifty, Sensex.",
      ["Nifty 50", "Bank Nifty", "Fin Nifty", "Sensex", "Stocks"],
    ],
    [
      "gold",
      "MCX",
      "Commodity futures traded on the Multi Commodity Exchange.",
      [
        "Gold",
        "Gold Mini",
        "Silver",
        "Silver Mini",
        "Crude Oil",
        "Natural Gas",
        "Copper",
        "Zinc",
        "Aluminium",
      ],
    ],
  ],
  ([c, t, d, l]) =>
    `<div class="card rv ${c}"><h3>${t}</h3><p>${d}</p><div class="chips">${l.map((x) => `<span>${x}</span>`).join("")}</div></div>`,
);
const brokers = [
  ["Mastertrust", "https://q.qboard.in/QDoRhM"],
  ["Zerodha", "#"],
  ["Upstox", "#"],
  ["Angel One", "#"],
  ["Fyers", "#"],
  ["Dhan", "#"],
  ["Groww", "#"],
];
const bl = brokers
  .map(
    ([b, u]) =>
      `<a href="${u}" ${u != "#" ? 'target="_blank" rel="noopener"' : ""} aria-label="${b}">${b}</a>`,
  )
  .join("");
$("#brk").innerHTML = bl;
$("#dm").innerHTML = bl;
R(
  "#steps",
  [
    [
      "Connect Broker",
      "Securely link your broker account via official APIs. Funds stay with you.",
    ],
    [
      "Choose Strategy",
      "Pick a strategy for Stocks &amp; F&amp;O or MCX commodities that fits your risk appetite.",
    ],
    [
      "Auto-Trade",
      "The algo places orders by your rules, with stop-loss and risk limits.",
    ],
  ],
  ([t, d], i) =>
    `<div class="card rv"><div class="num">${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`,
);
R(
  "#feat",
  [
    [
      "📈",
      "Backtesting",
      "Test every strategy on historical data before going live.",
    ],
    [
      "🛑",
      "Stop-Loss",
      "Automated stop-loss and targets on every trade.",
    ],
    [
      "🛡️",
      "Risk Management",
      "Position sizing and daily loss limits protect capital.",
    ],
    [
      "⚡",
      "Real-Time Signals",
      "Signals executed in milliseconds, no manual delay.",
    ],
  ],
  ([i, t, d]) =>
    `<div class="card rv"><div class="big-ic">${i}</div><h3>${t}</h3><p>${d}</p></div>`,
);
R(
  "#sv",
  [
    [
      "💼",
      "Demat Account",
      "Open a secure Demat account for stocks, ETFs, mutual funds and IPOs.",
      "https://mystockbazaar.com/demat-1",
      "Open Account",
    ],
    [
      "📊",
      "Systematic Investment Plan (SIP)",
      "Build long-term wealth through disciplined monthly mutual fund investments.",
      "https://mystockbazaar.com/sip-1",
      "Start SIP",
    ],
    [
      "🤝",
      "Loans",
      "Personal, Business, Home and Education loans with quick approval and simple paperwork.",
      "https://mystockbazaar.com/loan-1",
      "Apply Now",
    ],
    [
      "🛡️",
      "Insurance",
      "Health, Life, Motor and General Insurance from trusted providers.",
      "#",
      "Get Quote",
    ],
  ],
  ([i, t, d, h, b]) =>
    `<div class="card rv"><div class="big-ic">${i}</div><h3>${t}</h3><p>${d}</p><a href="${h}" ${h != "#" ? 'target="_blank" rel="noopener"' : ""}>${b} →</a></div>`,
);
R(
  "#why",
  [
    [
      "Dedicated Relationship Manager",
      "One-on-one guidance: trade ideas, market analysis, terminal support, risk management.",
    ],
    [
      "24×7 Customer Support",
      "Phone, online and face-to-face help from beginner to advanced.",
    ],
    [
      "Achieve Your Financial Goals",
      "Customised plans for trading and long-term investing.",
    ],
    [
      "Margin &amp; Leverage Assistance",
      "Guidance on exchange-approved leverage via supported brokers.",
    ],
    [
      "Experienced Professionals",
      "Learn from experienced market professionals.",
    ],
    [
      "Personalised Strategies",
      "Based on risk appetite, style, capital, goals and experience.",
    ],
  ],
  ([t, d], i) =>
    `<div class="card rv"><div class="num">0${i + 1}</div><h3>${t}</h3><p>${d}</p></div>`,
);
const plans = [
  ["Monthly", "₹999", "/month", "1 month", 0],
  ["Quarterly", "₹2,499", "/3 months", "Save about 17%", 1],
  ["Yearly", "₹7,999", "/year", "Save about 33%", 0],
];
R(
  "#pl",
  plans,
  ([n, p, u, s, pop]) =>
    `<div class="card price rv ${pop ? "pop" : ""}"><h3>${n}</h3><div class="amt">${p}<small>${u}</small></div><ul><li>Equity, F&amp;O and MCX algos</li><li>Backtesting &amp; risk controls</li><li>Real-time signals</li><li>${s}</li></ul><button class="btn bp" data-p="${n}">Buy ${n}</button></div>`,
);
$$("[data-p]").forEach(
  (b) =>
  (b.onclick = () =>
    toast(
      b.dataset.p +
      " plan selected. Connect your payment gateway (UPI / Cards / Net Banking) here.",
    )),
);
const faqs = [
  [
    "What is algo trading?",
    "Computer programs place orders automatically using pre-defined rules.",
  ],
  [
    "Is my money safe?",
    "Your funds stay in your own broker account. Orders go through authorised broker APIs.",
  ],
  [
    "How does the free trial work?",
    "You get a 3-day free trial of the Algo. After that, a membership is required.",
  ],
  [
    "Are returns guaranteed?",
    "No. Markets involve risk and past performance does not guarantee future results.",
  ],
  [
    "Which brokers are supported?",
    "Zerodha, Upstox, Angel One, Fyers and Dhan, among others.",
  ],
];
R(
  "#faq",
  faqs,
  ([q, a]) =>
    `<div class="fi"><button class="fq">${q}<span>+</span></button><div class="fa">${a}</div></div>`,
);
$$(".fi").forEach(
  (i) =>
  (i.querySelector(".fq").onclick = () => {
    const o = i.classList.contains("on");
    $$(".fi").forEach((x) => {
      x.classList.remove("on");
      x.querySelector(".fa").style.maxHeight = 0;
    });
    if (!o) {
      i.classList.add("on");
      const a = i.querySelector(".fa");
      a.style.maxHeight = a.scrollHeight + 30 + "px";
    }
  }),
);

// Performance charts (sample data)
function chart(d, c) {
  const mx = Math.max(...d),
    mn = Math.min(...d),
    pts = d.map((v, i) => [
      (i * 400) / (d.length - 1),
      180 - ((v - mn) / (mx - mn)) * 150,
    ]);
  const l = pts.map((p) => p.join(",")).join(" ");
  return `<svg viewBox="0 0 400 200" role="img" aria-label="Sample equity curve"><polygon points="0,200 ${l} 400,200" fill="${c}" opacity=".15"/><polyline points="${l}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round"/></svg>`;
}
const pf = {
  p1: [
    [100, 104, 102, 109, 113, 111, 118, 122, 120, 128, 133, 138],
    "#047A27",
    ["+38%", "−9%", "61%", "1.8"],
  ],
  p2: [
    [100, 98, 105, 110, 107, 115, 119, 116, 124, 129, 127, 135],
    "#D4A017",
    ["+35%", "−11%", "58%", "1.6"],
  ],
};
for (const k in pf) {
  const [d, c, s] = pf[k];
  $("#" + k).innerHTML =
    `<div class="perf"><div class="card">${chart(d, c)}</div><div class="card"><div class="kp">${["Sample Return", "Max Drawdown", "Win Rate", "Profit Factor"].map((n, i) => `<div><b>${s[i]}</b>${n}</div>`).join("")}</div></div></div>`;
}

// Tabs
$$(".tab").forEach(
  (t) =>
  (t.onclick = () => {
    $$(`.tab[data-g="${t.dataset.g}"]`).forEach((x) => {
      x.classList.remove("on");
      $("#" + x.dataset.t).classList.remove("on");
    });
    t.classList.add("on");
    $("#" + t.dataset.t).classList.add("on");
  }),
);

// Free trial (3 days) stored in localStorage
const DAY = 864e5,
  K = "msb_trial_start";
function trial() {
  const s = +store.get(K);
  const lab = $("#cdLabel"),
    btn = $("#startTrial");
  if (!s) {
    lab.textContent = "Trial not started";
    [$("#cd"), $("#ch"), $("#cm")].forEach((e) => (e.textContent = "0"));
    $("#lock").classList.remove("on");
    return;
  }
  const left = s + 3 * DAY - Date.now();
  if (left <= 0) {
    lab.textContent = "Free trial ended";
    [$("#cd"), $("#ch"), $("#cm")].forEach((e) => (e.textContent = "0"));
    $("#lock").classList.add("on");
    btn.textContent = "Trial Ended";
    btn.disabled = true;
    return;
  }
  lab.textContent = "Free trial time remaining";
  $("#cd").textContent = Math.floor(left / DAY);
  $("#ch").textContent = Math.floor((left % DAY) / 36e5);
  $("#cm").textContent = Math.floor((left % 36e5) / 6e4);
  btn.textContent = "Trial Active";
  btn.disabled = true;
}
$("#startTrial").onclick = () => {
  if (!store.get(K)) {
    store.set(K, Date.now());
    toast("Your 3-day free trial has started!");
  }
  trial();
  $("#algo .algo").scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
};
trial();
setInterval(trial, 30000);

// SIP calculator
function sip() {
  const P = +$("#m").value,
    Y = +$("#y").value,
    A = +$("#r").value,
    n = Y * 12,
    r = A / 1200,
    inv = P * n,
    fv = P * ((Math.pow(1 + r, n) - 1) / r) * (1 + r),
    ret = fv - inv;
  $("#mv").textContent = inr(P);
  $("#yv").textContent = Y + " Years";
  $("#rv").textContent = A + "%";
  $("#tv").textContent = short(fv);
  $("#iv").textContent = short(inv);
  $("#ev").textContent = short(ret);
  $("#dn").style.background =
    `conic-gradient(#047A27 0 ${(inv / fv) * 100}%,#D4A017 0)`;
}
$$("#sip input").forEach((i) => (i.oninput = sip));
sip();

// Team (set photo URL as the 3rd item of each member; leave '' to show initials)
const team = [
  [
    "/images/shashiKant.jpeg",
    "Shashikant Tiwari",
    "Founder",
    "",
    "With over 10 years of experience in the Indian financial markets, Shashikant Tiwari has collaborated with reputable organisations such as Kalkine, Nirmal Bang Securities, PISM Limited, Open Future, Pace Stock Broking Services and Sadhna Group. His areas of expertise include financial advice, Equity, F&amp;O Trading and Technical Analysis.",
  ],
  [
    "/images/siraj.jpeg",
    "Sirajuddin",
    "Visionary &amp; Business Strategist",
    "",
    "A graduate of Jamia Millia Islamia, Sirajuddin is a visionary business strategist with expertise in startup development and business growth. He has contributed to the success of multiple startups by helping them build effective strategies, strengthen operations and achieve sustainable growth.",
  ],
  [
    "/images/yogesh.jpeg",
    "Yogesh Yadav",
    "Head – Loan Services",
    "",
    "An experienced loan professional at My Stock Bazaar specialising in Personal Loans, Home Loans, Loan Against Property (LAP), Loan Against Securities (LAS) and Gold Loans. He oversees the entire Loan Services Division, offering trusted financial advice and guiding clients to select the right loan solutions.",
  ],
  [
    "/images/ayan.jpg",
    "Mohd Ayan",
    "Stock Market Associate",
    "",
    "With over 2 years of stock market experience, Mohd Ayan is dedicated to providing financial advice, conducting market research and offering client support. After completing his education at Government Boys Senior Secondary School in Delhi, he is now pursuing a BCA from IGNOU.",
  ],
  [
    "/images/noor.jpeg",
    "Noor Alam",
    "Stock Market Associate",
    "",
    "With over 2 years of experience in the stock market, Noor Alam specialises in Futures &amp; Options (F&amp;O). With a strong passion for learning and tackling new challenges, he completed his schooling at Kautilya Government Sarvodaya Co-Ed Vidyalaya in Delhi and is currently pursuing a BBA from Jamia Hamdard University.",
  ],
];
$("#team").innerHTML = team
  .map(
    ([a, n, r, p, b]) =>
      `<div class="tm rv">
          <div class="av">${p ? `<img src="${n}" alt="${n}" loading="lazy">` : `<image src=${a} alt=${n} />`}</div>
      <h3>${n}</h3><small>${r}</small><p>${b}</p><button class="more" aria-expanded="false">+ Show More</button></div>`,
  )
  .join("");
$$(".more").forEach(
  (b) =>
  (b.onclick = () => {
    const t = b.parentNode.classList.toggle("open");
    b.textContent = t ? "− Show Less" : "+ Show More";
    b.setAttribute("aria-expanded", t);
  }),
);

// Reveal + year
const io = new IntersectionObserver(
  (es) =>
    es.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    }),
  { threshold: 0.1 },
);
$$(".rv").forEach((e) => io.observe(e));
$("#yr").textContent = new Date().getFullYear();