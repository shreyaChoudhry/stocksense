 "use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const products = [
  { name: "Amul Taaza Milk (1L)", sku: "AML-TZ-1000", category: "Dairy", stock: 42, reorder: 100, price: 56, status: "Low Stock" },
  { name: "Tata Salt (1kg)", sku: "TAT-SL-1001", category: "Staples", stock: 380, reorder: 150, price: 28, status: "Healthy" },
  { name: "Fortune Sunflower Oil", sku: "FTN-OIL-094", category: "Edible Oils", stock: 18, reorder: 80, price: 145, status: "Critical" },
  { name: "Aashirvaad Atta (5kg)", sku: "ASH-ATA-500", category: "Grains", stock: 210, reorder: 120, price: 295, status: "Healthy" },
  { name: "Maggi Noodles (Pack of 4)", sku: "MAG-NDL-004", category: "Instant Foods", stock: 65, reorder: 90, price: 56, status: "Low Stock" },
];

const forecast = {
  7: { units: "4,120", revenue: "₹5,84,300", confidence: "99.8%", growth: "+18%" },
  14: { units: "8,940", revenue: "₹12,45,200", confidence: "99.4%", growth: "+32%" },
  30: { units: "22,400", revenue: "₹31,10,000", confidence: "98.1%", growth: "+41%" },
};

const features = [
  { number: "01", title: "Inventory intelligence", text: "See stock levels, product movement and replenishment needs in one clear view.", icon: "▤" },
  { number: "02", title: "AI demand forecasting", text: "Explore future demand using historical sales and relevant business signals.", icon: "⌁" },
  { number: "03", title: "Sales analytics", text: "Understand revenue trends, sales velocity and product performance.", icon: "↗" },
  { number: "04", title: "Smarter reordering", text: "Review suggested replenishment quantities and supplier lead times.", icon: "⇄" },
  { number: "05", title: "Business insights", text: "Turn operational data into practical, understandable next steps.", icon: "✳" },
  { number: "06", title: "Multi-store visibility", text: "Build a more consistent view across stores and inventory locations.", icon: "⌘" },
];

export default function Home() {
  const [tab, setTab] = useState("Overview");
  const [days, setDays] = useState(14);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const currentForecast = forecast[days as keyof typeof forecast];

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2800);
  }

  const visibleProducts = useMemo(
    () => products.filter((product) => filter === "All" || product.status === filter),
    [filter]
  );

  const closeMenu = () => setMenuOpen(false);

  return (
    <main>
      <nav className="navbar">
        <Link href="/" className="brand" aria-label="StockSense home" onClick={closeMenu}>
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path
                d="M5 25h7c2.3 0 3.4-1.2 4.2-4.1L21 7l8 34 5.3-16.2c.8-2.7 2-3.8 4.7-3.8h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span>Stock<span className="brand-light">Sense</span></span>
        </Link>

        <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? "nav-links-open" : ""}`}>
          <a href="#features" onClick={closeMenu}>Features</a>
          <a href="#how-it-works" onClick={closeMenu}>How it works</a>
          <a href="#demo" onClick={closeMenu}>Platform</a>
          <a href="#why-stocksense" onClick={closeMenu}>About</a>
        </div>

        <div className="nav-actions">
          <Link href="/login" className="nav-login">Log in</Link>
          <Link href="/signup" className="button button-primary nav-cta">Get started <span>↗</span></Link>
        </div>
      </nav>

      <section className="hero container" id="top">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> RETAIL INTELLIGENCE, REFINED</div>
          <h1>Know what sells.<br /><em>Predict what&apos;s next.</em></h1>
          <p className="hero-description">
            Bring inventory, sales and demand signals into focus. StockSense helps you make clearer replenishment decisions and run your business with confidence.
          </p>
          <div className="hero-actions">
            <Link href="/signup" className="button button-primary">Get started free <span>↗</span></Link>
            <a href="#demo" className="button button-quiet">Explore the platform <span>↓</span></a>
          </div>
          <div className="hero-proof">
            <div><strong>01</strong><span>One clear view</span></div>
            <i />
            <div><strong>AI</strong><span>Demand insights</span></div>
            <i />
            <div><strong>₹</strong><span>INR-ready</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-label="Illustrative StockSense analytics dashboard preview">
          <div className="chart-backdrop chart-backdrop-one" />
          <div className="chart-backdrop chart-backdrop-two" />
          <div className="hero-orbit" />
          <div className="laptop">
            <div className="laptop-screen">
              <div className="screen-topbar">
                <div className="screen-brand"><span className="mini-mark" aria-hidden="true">
                  <svg viewBox="0 0 48 48" focusable="false">
                    <path d="M5 25h7c2.3 0 3.4-1.2 4.2-4.1L21 7l8 34 5.3-16.2c.8-2.7 2-3.8 4.7-3.8h4" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span> StockSense</div>
                <span className="screen-date">OVERVIEW <span>⌄</span></span>
                <span className="screen-avatar">S</span>
              </div>
              <div className="screen-layout">
                <aside className="screen-sidebar">
                  <span className="side-active">▦ <b>Overview</b></span>
                  <span>▤ <b>Inventory</b></span>
                  <span>↗ <b>Sales</b></span>
                  <span>⌁ <b>Forecasts</b></span>
                  <span>⚙ <b>Settings</b></span>
                  <div className="sidebar-user"><span>SC</span><small>Store owner<br />Workspace</small></div>
                </aside>
                <div className="screen-main">
                  <div className="screen-heading"><div><small>THURSDAY, 05 NOVEMBER</small><strong>Good morning, Shreya.</strong></div><span className="live-indicator">● DEMO</span></div>
                  <div className="screen-metrics">
                    <div><small>MONTHLY SALES</small><strong>₹24.8L</strong><em>↗ 18.6%</em></div>
                    <div><small>STOCK HEALTH</small><strong>94%</strong><em>On track</em></div>
                    <div><small>ITEMS TO REVIEW</small><strong>04</strong><em className="warm">Needs attention</em></div>
                  </div>
                  <div className="screen-chart">
                    <div className="screen-chart-head"><strong>Demand trajectory</strong><small>Last 30 days　⌄</small></div>
                    <svg viewBox="0 0 560 170" role="img" aria-label="Illustrative rising demand line chart">
                      <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#b7f34a" stopOpacity=".22"/><stop offset="100%" stopColor="#b7f34a" stopOpacity="0"/></linearGradient></defs>
                      {[35, 75, 115, 155].map((y) => <line key={y} x1="0" x2="560" y1={y} y2={y} stroke="#29312b" strokeDasharray="3 7" />)}
                      <path d="M4 132 C38 120 48 95 82 108 S126 121 160 86 S211 92 242 75 S290 94 324 58 S376 79 408 52 S465 61 498 32 S535 39 556 18 L556 165 L4 165Z" fill="url(#areaFill)" />
                      <path d="M4 132 C38 120 48 95 82 108 S126 121 160 86 S211 92 242 75 S290 94 324 58 S376 79 408 52 S465 61 498 32 S535 39 556 18" fill="none" stroke="#b7f34a" strokeWidth="3" strokeLinecap="round"/>
                      <circle cx="556" cy="18" r="5" fill="#b7f34a"/>
                    </svg>
                    <div className="chart-axis"><span>OCT 06</span><span>OCT 13</span><span>OCT 20</span><span>OCT 27</span><span>NOV 05</span></div>
                  </div>
                  <div className="screen-bottom"><span><i className="legend-dot" /> Historical sales</span><span><i className="legend-dot legend-muted" /> Illustrative forecast</span><b>View report ↗</b></div>
                </div>
              </div>
            </div>
            <div className="laptop-base"><span /></div>
          </div>
          <div className="visual-caption"><span>STOCKSENSE WORKSPACE</span><span>ILLUSTRATIVE PREVIEW · INR</span></div>
        </div>
      </section>

      <section className="proof-strip">
        <div className="container proof-strip-inner">
          <div><span className="proof-icon">↗</span><span><strong>Sales visibility</strong><small>Understand what moves</small></span></div>
          <div><span className="proof-icon">⌁</span><span><strong>Demand intelligence</strong><small>Look ahead with context</small></span></div>
          <div><span className="proof-icon">▤</span><span><strong>Inventory control</strong><small>Know what needs attention</small></span></div>
          <div><span className="proof-icon">✳</span><span><strong>Clear decisions</strong><small>Act with more confidence</small></span></div>
        </div>
      </section>

      <section className="section container problem-section">
        <div className="section-intro">
          <div className="eyebrow">THE COST OF GUESSWORK</div>
          <h2>Running a business<br /><em>shouldn&apos;t feel like guesswork.</em></h2>
          <p>Scattered spreadsheets and delayed signals make it harder to see what is happening across your shelves. StockSense brings the essentials together.</p>
        </div>
        <div className="problem-list">
          <article><span>01</span><div><h3>Unexpected stockouts</h3><p>Spot products approaching their reorder threshold before an empty shelf becomes a missed sale.</p></div><b>↗</b></article>
          <article><span>02</span><div><h3>Capital tied up in excess stock</h3><p>Get a clearer view of slow-moving inventory and avoid ordering without context.</p></div><b>↗</b></article>
          <article><span>03</span><div><h3>Demand that keeps changing</h3><p>Use historical patterns and forecasting views to plan for what may come next.</p></div><b>↗</b></article>
        </div>
      </section>

      <section className="section container" id="how-it-works">
        <div className="section-heading">
          <div className="eyebrow">A CLEARER WAY TO OPERATE</div>
          <h2>From raw data to <em>considered action.</em></h2>
          <p>A simple workflow that turns everyday retail activity into a more useful operating picture.</p>
        </div>
        <div className="steps-grid">
          <article><span className="step-number">01 / CONNECT</span><div className="step-icon">↳</div><h3>Bring your data together</h3><p>Organise product, stock and sales information in one workspace.</p></article>
          <article><span className="step-number">02 / UNDERSTAND</span><div className="step-icon">⌁</div><h3>See the signals</h3><p>Explore performance, inventory health and illustrative demand forecasts.</p></article>
          <article><span className="step-number">03 / DECIDE</span><div className="step-icon">↗</div><h3>Make your next move</h3><p>Review replenishment needs and make decisions with better context.</p></article>
        </div>
      </section>

      <section className="section container" id="demo">
        <div className="section-heading section-heading-row">
          <div><div className="eyebrow">INSIDE STOCKSENSE</div><h2>Your business, <em>in focus.</em></h2></div>
          <p>Explore a sample workspace. Figures and product records shown here are illustrative demo data, not live business records.</p>
        </div>
        <div className="workspace">
          <div className="workspace-top"><div className="workspace-title"><span className="brand-mark tiny" aria-hidden="true">
              <svg viewBox="0 0 48 48" focusable="false">
                <path d="M5 25h7c2.3 0 3.4-1.2 4.2-4.1L21 7l8 34 5.3-16.2c.8-2.7 2-3.8 4.7-3.8h4" fill="none" stroke="currentColor" strokeWidth="4.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span><strong>StockSense <i>/ Workspace preview</i></strong></div><span className="demo-chip">ILLUSTRATIVE DEMO DATA</span></div>
          <div className="workspace-tabs">
            {["Overview", "Inventory Matrix", "Forecasting Lab"].map((item) => <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>{item}</button>)}
          </div>

          {tab === "Overview" && <div className="workspace-content">
            <div className="overview-grid">
              <div className="overview-metric"><small>TODAY&apos;S GMV</small><strong>₹3,42,100</strong><span>↗ 14.2% <i>illustrative</i></span></div>
              <div className="overview-metric"><small>STOCK VELOCITY</small><strong>4.2x / mo</strong><span>High efficiency</span></div>
              <div className="overview-metric"><small>ACTIVE PO DRAFTS</small><strong>07 drafted</strong><span>₹48,200 pending</span></div>
              <div className="overview-metric"><small>MODEL CONFIDENCE</small><strong>99.4%</strong><span>Sample metric</span></div>
            </div>
            <div className="opportunity"><div><span className="eyebrow">SUGGESTED AREA TO REVIEW</span><strong>Rebalance Dairy inventory</strong><p>Review stock distribution between outlets to understand potential replenishment needs.</p></div><button className="button button-outline" onClick={() => notify("Demo only: opportunity review selected.")}>Review insight ↗</button></div>
            <div className="workspace-chart">
              <div className="workspace-chart-head"><strong>Sales performance</strong><span>Sample trend · 30 days</span></div>
              <svg viewBox="0 0 900 180" role="img" aria-label="Illustrative sales trend chart">
                {[30, 75, 120, 165].map((y) => <line key={y} x1="0" x2="900" y1={y} y2={y} stroke="#252c25" strokeDasharray="4 7" />)}
                <path d="M0 135 C65 125 80 100 140 115 S230 140 280 90 S360 108 420 78 S500 102 550 65 S630 85 690 45 S770 64 820 30 S870 35 900 15" fill="none" stroke="#b7f34a" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              <div className="chart-axis"><span>OCT 06</span><span>OCT 13</span><span>OCT 20</span><span>OCT 27</span><span>NOV 05</span></div>
            </div>
          </div>}

          {tab === "Inventory Matrix" && <div className="workspace-content table-wrap">
            <div className="table-heading"><div><strong>Product inventory</strong><small>Sample product records</small></div><span>{products.length} products</span></div>
            <table><thead><tr><th>PRODUCT</th><th>ON HAND</th><th>REORDER POINT</th><th>STATUS</th><th>PRICE</th></tr></thead>
              <tbody>{products.map((product) => <tr key={product.sku}><td><strong>{product.name}</strong><small>{product.sku} · {product.category}</small></td><td>{product.stock}</td><td>{product.reorder}</td><td><span className={`status status-${product.status.toLowerCase().replace(" ", "-")}`}>{product.status}</span></td><td>₹{product.price}</td></tr>)}</tbody>
            </table>
          </div>}

          {tab === "Forecasting Lab" && <div className="workspace-content forecast-workspace">
            <div><span className="eyebrow">DEMAND SIMULATION</span><h3>Explore a planning horizon.</h3><p>Choose a sample horizon to see the illustrative projection change.</p></div>
            <div className="horizon-switch">{[7, 14, 30].map((n) => <button key={n} className={days === n ? "active" : ""} onClick={() => setDays(n)}>{n} days</button>)}</div>
            <div className="forecast-stats">
              <div><small>PROJECTED UNITS</small><strong>{currentForecast.units}</strong></div>
              <div><small>ESTIMATED REVENUE</small><strong>{currentForecast.revenue}</strong></div>
              <div><small>MODEL CONFIDENCE</small><strong>{currentForecast.confidence}</strong></div>
              <div><small>SCENARIO GROWTH</small><strong>{currentForecast.growth}</strong></div>
            </div>
            <p className="disclaimer">Illustrative scenario only. Actual forecasts require validated product-level sales history.</p>
          </div>}
        </div>
      </section>

      <section className="section container" id="forecast">
        <div className="forecast-band">
          <div className="forecast-band-copy"><div className="eyebrow">PLAN WITH A LONGER VIEW</div><h2>See demand before<br /><em>it becomes urgent.</em></h2><p>Explore how different planning horizons can shape your replenishment conversations. Treat every projection as a decision aid, not a guarantee.</p><Link href="/signup" className="text-link">Explore StockSense <span>↗</span></Link></div>
          <div className="forecast-band-panel">
            <div className="forecast-band-head"><span>ILLUSTRATIVE FORECAST</span><span>HORIZON</span></div>
            <div className="horizon-switch">{[7, 14, 30].map((n) => <button key={n} className={days === n ? "active" : ""} onClick={() => setDays(n)}>{n} days</button>)}</div>
            <div className="forecast-main-number"><small>PROJECTED UNITS · NEXT {days} DAYS</small><strong>{currentForecast.units}</strong><span>{currentForecast.growth} scenario growth</span></div>
            <div className="forecast-mini-chart"><span style={{height:"35%"}}/><span style={{height:"44%"}}/><span style={{height:"39%"}}/><span style={{height:"58%"}}/><span style={{height:"52%"}}/><span style={{height:"69%"}}/><span style={{height:"63%"}}/><span style={{height:"82%"}}/><span style={{height:"76%"}}/><span style={{height:"96%"}}/></div>
            <div className="forecast-band-foot"><span>Historical pattern</span><span>Illustrative projection ↗</span></div>
          </div>
        </div>
      </section>

      <section className="section container" id="features">
        <div className="section-heading">
          <div className="eyebrow">THE STOCKSENSE TOOLKIT</div>
          <h2>Everything connected.<br /><em>Nothing overcomplicated.</em></h2>
          <p>Practical tools for a clearer view of day-to-day retail operations.</p>
        </div>
        <div className="features-grid">
          {features.map((feature) => <article className="feature-card" key={feature.number}><div className="feature-card-top"><span>{feature.number}</span><b>{feature.icon}</b></div><h3>{feature.title}</h3><p>{feature.text}</p><span className="feature-rule" /></article>)}
        </div>
      </section>

      <section className="section container" id="why-stocksense">
        <div className="why-layout">
          <div className="why-heading"><div className="eyebrow">WHY STOCKSENSE</div><h2>Better context.<br /><em>More confident decisions.</em></h2></div>
          <div className="why-copy"><p>StockSense brings inventory visibility, demand exploration and sales analytics into one considered workspace—so teams can spend less time piecing together reports and more time understanding what needs attention.</p><div className="why-points"><span><b>—</b> Designed around everyday retail workflows</span><span><b>—</b> Clear views of stock and product movement</span><span><b>—</b> Forecasting presented with context and caveats</span></div></div>
        </div>
      </section>

      <section className="final-cta container">
        <div className="eyebrow">A CLEARER VIEW STARTS HERE</div>
        <h2>Make your next move<br /><em>with confidence.</em></h2>
        <p>Bring your retail operations into focus with StockSense.</p>
        <Link href="/signup" className="button button-primary">Get started free <span>↗</span></Link>
        <span className="cta-note">No guesswork. Just a better view of your business.</span>
      </section>

      <footer className="footer">
        <div className="footer-main container">
          <div className="footer-brand-block"><Link href="/" className="brand"><span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 48 48" focusable="false">
              <path
                d="M5 25h7c2.3 0 3.4-1.2 4.2-4.1L21 7l8 34 5.3-16.2c.8-2.7 2-3.8 4.7-3.8h4"
                fill="none"
                stroke="currentColor"
                strokeWidth="4.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span><span>Stock<span className="brand-light">Sense</span></span></Link><p>Know what sells. Predict what&apos;s next.</p></div>
          <div className="footer-links"><div><strong>EXPLORE</strong><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#demo">Platform</a></div><div><strong>ACCOUNT</strong><Link href="/login">Log in</Link><Link href="/signup">Create account</Link></div><div><strong>STOCKSENSE</strong><a href="#why-stocksense">About</a><a href="#top">Back to top ↑</a></div></div>
        </div>
        <div className="footer-bottom container"><span>© 2026 StockSense. Built for smarter retail decisions.</span><span>Retail intelligence, thoughtfully presented.</span></div>
      </footer>

      {toast && <div className="toast" role="status">{toast}</div>}
    </main>
  );
}
