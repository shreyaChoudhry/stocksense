"use client";

import { useState } from "react";
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

export default function Home() {

  const [tab, setTab] = useState("Overview");

  const [days, setDays] = useState(14);

  const [filter, setFilter] = useState("All");

  const [toast, setToast] = useState("");

  const currentForecast = forecast[days as keyof typeof forecast];

  function notify(message: string) {

    setToast(message);

    window.setTimeout(() => setToast(""), 3000);

  }

  const visibleProducts = products.filter((product) =>

    filter === "All" || product.status === filter

  );

  return (

    <main>

      <nav className="navbar">

        <a href="#" className="brand">

          <span className="brand-icon">✳</span>

          StockSense<span className="live-dot" />

        </a>

        <div className="nav-links">

          <a href="#product">Product</a>

          <a href="#features">Features</a>

          <a href="#demo">Interactive Demo</a>

          <a href="#forecast">Demand AI <span className="version">v3.2</span></a>

          <a href="#pricing">Pricing</a>

        </div>

        <div className="nav-actions">

          <Link href="/login" className="sign-in">Sign In</Link>

          <Link href="/signup" className="button primary small">Get Started Free ↗</Link>

        </div>

      </nav>

      <section className="hero container" id="product">

        <div className="hero-copy">

          <div className="eyebrow"><span className="live-dot" /> AI-POWERED RETAIL INTELLIGENCE</div>

          <h1>

            Know What Sells.

            <span>Predict What&apos;s Next.</span>

          </h1>

          <p>

            Your inventory is more than numbers. Turn high-frequency sales

            data into smarter predictive replenishment, eliminate costly

            stockouts, and make every business decision count.

          </p>

          <div className="hero-buttons">

            <Link href="/signup" className="button primary">Get Started Free ↗</Link>

            <a href="#demo" className="button secondary">▶ Explore Live Demo</a>

          </div>

          <div className="trust-row">

            <span>✓ Smart Inventory</span>

            <span>✓ Demand AI v3.2</span>

            <span>✓ ₹ INR Native</span>

          </div>

        </div>

        <div className="dashboard hero-dashboard">

          <div className="dashboard-heading">

            <div>

              <strong>◈ Store Telemetry</strong>

              <small>Real-time inventory intelligence</small>

            </div>

            <span className="live-label">● Live Stream</span>

          </div>

          <div className="metric-grid">

            <div className="metric">

              <small>MONTHLY GMV</small>

              <strong>₹24,85,420</strong>

              <span className="green">↗ +18.6% vs target</span>

            </div>

            <div className="metric">

              <small>HEALTH INDEX</small>

              <strong>94%</strong>

              <span className="green">Optimal Stock</span>

            </div>

          </div>

          <div className="chart-card">

            <div className="chart-heading">

              <strong>〽 Demand Trajectory</strong>

              <span>Actuals — Predicted</span>

            </div>
<svg viewBox="0 0 500 190" role="img" aria-label="Illustrative demand forecast chart">

              <defs>

                <linearGradient id="chartFill" x1="0" x2="0" y1="0" y2="1">

                  <stop offset="0%" stopColor="#4df6df" stopOpacity=".3"/>

                  <stop offset="100%" stopColor="#4df6df" stopOpacity="0"/>

                </linearGradient>

              </defs>

              {[40, 90, 140].map((y) => (

                <line key={y} x1="0" x2="500" y1={y} y2={y} stroke="#273447" strokeDasharray="5 6"/>

              ))}

              <path d="M10 150 Q90 125 155 90 T250 110 L250 160 Q350 100 490 20 L490 150 L10 150Z" fill="url(#chartFill)"/>

              <path d="M10 150 Q90 125 155 90 T250 110" fill="none" stroke="#5ade95" strokeWidth="4"/>

              <path d="M250 110 Q350 75 410 48 T490 20" fill="none" stroke="#4df6df" strokeWidth="4" strokeDasharray="8 7"/>

              <circle cx="250" cy="110" r="6" fill="#4df6df"/>

              <text x="250" y="135" fill="#bacac5" textAnchor="middle" fontSize="12">Today</text>

            </svg>

          </div>

          <div className="alert">⚠ 4 items reach reorder threshold in less than 48 hrs</div>

        </div>

      </section>

      <section className="section container">

        <div className="section-heading">

          <div className="eyebrow">FRICTION IN TRADITIONAL RETAIL</div>

          <h2>Running a business shouldn&apos;t mean guessing.</h2>

          <p>Spreadsheets lag behind customer behavior. Without predictive modeling, store operators suffer from uncoordinated purchases, stock imbalances, and lost revenue.</p>

        </div>

        <div className="three-grid">

          <article className="problem-card red">

            <div className="card-icon">🛒</div>

            <h3>Unexpected Stockouts</h3>

            <p>Lost sales, frustrated loyal shoppers, and empty shelves during peak shopping periods when demand spikes without warning.</p>

            <strong>↘ Average 8.2% margin loss</strong>

          </article>

          <article className="problem-card yellow">

            <div className="card-icon">📦</div>

            <h3>Overstocked Dead Capital</h3>

            <p>Working capital trapped in slow-moving items, warehouse congestion, expiry risks, and heavy markdowns.</p>

            <strong>₹4.2L average locked capital</strong>

          </article>

          <article className="problem-card teal">

            <div className="card-icon">↗</div>

            <h3>Unpredictable Customer Demand</h3>

            <p>Regional patterns, holidays, and sudden weather shifts make manual spreadsheet forecasts unreliable.</p>

            <strong>AI-powered demand insights</strong>

          </article>

        </div>

      </section>

      <section className="section container" id="demo">

        <div className="section-heading">

          <div className="eyebrow">UNIFIED OPERATIONS WORKSPACE</div>

          <h2>Your entire business. One intelligent view.</h2>

          <p>Explore store performance, inventory levels and future demand in one interactive workspace.</p>

        </div>

        <div className="workspace">

          <div className="window-bar">

            <span>● <i>●</i> <b>●</b></span>

            <small>stocksense.app / workspace</small>

            <span className="demo-label">Illustrative Demo Data · ₹ INR</span>

          </div>

          <div className="tabs">

            {["Overview", "Inventory Matrix", "Forecasting Lab"].map((item) => (

              <button key={item} className={tab === item ? "active" : ""} onClick={() => setTab(item)}>

                {item}

              </button>

            ))}

          </div>

          {tab === "Overview" && (

            <div className="workspace-content">

              <div className="four-grid">

                <div className="metric"><small>TODAY&apos;S GMV</small><strong>₹3,42,100</strong><span className="green">↗ 14.2%</span></div>

                <div className="metric"><small>STOCK VELOCITY</small><strong>4.2x / mo</strong><span className="green">High efficiency</span></div>

                <div className="metric"><small>ACTIVE PO DRAFTS</small><strong className="yellow-text">7 Drafted</strong><span>₹48,200 pending</span></div>

                <div className="metric"><small>MODEL CONFIDENCE</small><strong className="green">99.4%</strong><span>Illustrative metric</span></div>

              </div>

              <div className="opportunity">

                <div><strong>✦ Top AI Opportunity</strong><p>Rebalance Dairy inventory between two outlets to avoid a potential stockout.</p></div>

                <button className="button primary small" onClick={() => notify("Demo: Rebalance review initiated")}>Review Opportunity</button>

              </div>

            </div>

          )}

          {tab === "Inventory Matrix" && (

            <div className="workspace-content table-wrap">

              <table>

                <thead><tr><th>Product</th><th>Stock</th><th>Reorder Point</th><th>Status</th><th>Price</th></tr></thead>

                <tbody>

                  {products.map((p) => (

                    <tr key={p.sku}>

                      <td>{p.name}</td><td>{p.stock}</td><td>{p.reorder}</td>

                      <td><span className={p.status === "Critical" ? "status critical" : p.status === "Healthy" ? "status healthy" : "status low"}>{p.status}</span></td>

                      <td>₹{p.price}</td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          )}

          {tab === "Forecasting Lab" && (

            <div className="workspace-content forecast-preview">

              <h3>Demand simulation</h3>

              <p>Choose a forecasting horizon to explore sample projected demand.</p>

              <div className="forecast-numbers">

                <div><small>PROJECTED UNITS</small><strong>{currentForecast.units}</strong></div>

                <div><small>ESTIMATED REVENUE</small><strong>{currentForecast.revenue}</strong></div>

                <div><small>CONFIDENCE</small><strong>{currentForecast.confidence}</strong></div>

              </div>

              <div className="forecast-buttons">

                {[7, 14, 30].map((n) => <button key={n} className={days === n ? "active" : ""} onClick={() => setDays(n)}>{n} Days</button>)}

              </div>

            </div>

          )}

        </div>

      </section>

      <section className="section container" id="forecast">

        <div className="section-heading">

          <div className="eyebrow">PREDICTIVE SIMULATION LABORATORY</div>

          <h2>See demand before it happens.</h2>

          <p>Explore different prediction horizons and understand how expected demand changes over time.</p>

        </div>

        <div className="forecast-panel">

          <div className="forecast-buttons">

            {[7, 14, 30].map((n) => (

              <button key={n} className={days === n ? "active" : ""} onClick={() => setDays(n)}>{n} Days</button>

            ))}

          </div>

          <div className="forecast-numbers">

            <div><small>FORECAST HORIZON</small><strong>Next {days} Days</strong></div>

            <div><small>PREDICTED UNITS</small><strong>{currentForecast.units}</strong></div>

            <div><small>ESTIMATED REVENUE</small><strong>{currentForecast.revenue}</strong></div>

            <div><small>MODEL CONFIDENCE</small><strong>{currentForecast.confidence}</strong></div>

          </div>

          <div className="forecast-chart">

            <div className="chart-line"/>

            <span>Historical demand</span><span>Predicted demand ↗</span>

          </div>

          <div className="opportunity">

            ✦ Illustrative forecast: demand growth scenario {currentForecast.growth}. Actual results require validated sales data.

          </div>

        </div>

      </section>

      <section className="section container">

        <div className="section-heading">

          <div className="eyebrow">CATALOG HEALTH & TELEMETRY</div>

          <h2>Every product deserves attention.</h2>

          <p>Find low-stock products and identify which items may need replenishment.</p>

        </div>

        <div className="filter-row">

          {["All", "Healthy", "Low Stock", "Critical"].map((f) => (

            <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>

          ))}

        </div>

        <div className="three-grid">

          {visibleProducts.map((p) => (

            <article className="product-card" key={p.sku}>

              <div className="product-top">

                <span className={p.status === "Critical" ? "status critical" : p.status === "Healthy" ? "status healthy" : "status low"}>{p.status}</span>

                <strong>₹{p.price}/unit</strong>

              </div>

              <h3>{p.name}</h3>

              <small>{p.sku} · {p.category}</small>

              <div className="stock-info"><span>Current: {p.stock}</span><span>Target: {p.reorder}</span></div>

              <div className="progress"><span style={{width: `${Math.min(100, p.stock / p.reorder * 100)}%`}}/></div>

              <button className="button secondary full" onClick={() => notify(`Demo: Reorder review for ${p.name}`)}>Review Reorder</button>

            </article>

          ))}

        </div>

      </section>

      <section className="section container" id="features">

        <div className="section-heading">

          <div className="eyebrow">CORE CAPABILITIES</div>

          <h2>Smarter retail operations start here.</h2>

        </div>

        <div className="three-grid">

          {[

            ["◈", "Inventory Intelligence", "Monitor stock levels, product movement and replenishment needs."],

            ["✦", "AI Demand Forecasting", "Explore future demand using historical sales and relevant business signals."],

            ["↗", "Sales Analytics", "Understand sales trends, revenue and product performance."],

            ["⇄", "Smart Reordering", "Review suggested replenishment quantities and supplier lead times."],

            ["▤", "Business Insights", "Turn business data into clear and understandable insights."],

            ["⌁", "Multi-Store Support", "Build visibility across stores and inventory locations."]

          ].map(([icon, title, description]) => (

            <article className="feature-card" key={title}>

              <div className="card-icon">{icon}</div>

              <h3>{title}</h3>

              <p>{description}</p>

            </article>

          ))}

        </div>

      </section>

      <section className="section container" id="pricing">

        <section className="section container" id="why-stocksense">

  <div className="section-heading">

    <div className="eyebrow">THE FUTURE OF SMART RETAIL</div>

    <h2>Built for businesses ready to grow smarter.</h2>

    <p>

      Bringing inventory intelligence, demand forecasting

      and business analytics together in one platform.

    </p>

  </div>

  <div className="three-grid">

    <article className="feature-card">

      <div className="card-icon">📦</div>

      <h3>Smarter Inventory</h3>

      <p>Understand stock levels and identify replenishment needs.</p>

    </article>

    <article className="feature-card">

      <div className="card-icon">✦</div>

      <h3>Predictive Intelligence</h3>

      <p>Explore demand patterns and make better inventory decisions.</p>

    </article>

    <article className="feature-card">

      <div className="card-icon">↗</div>

      <h3>Business Growth</h3>

      <p>Turn retail data into actionable business insights.</p>

    </article>

  </div>

</section>

      </section>

      <section className="final-cta container">

        <div className="eyebrow">GET STARTED IN MINUTES</div>

        <h2>Your next business decision starts here.</h2>

        <p>Know what sells. Predict what&apos;s next. Make smarter inventory decisions with StockSense.</p>

        <Link href="/signup" className="button primary">Explore StockSense ↗</Link>

      </section>

      <footer className="footer">

        <a href="#" className="brand"><span className="brand-icon">✳</span>StockSense</a>

        <p>Know What Sells. Predict What&apos;s Next.</p>

        <div className="footer-auth-links">
          <Link href="/login">Login</Link>
          <Link href="/signup">Create account</Link>
          <Link href="/auth">Authentication Center</Link>
        </div>
        <small>© 2026 StockSense. Built for smarter retail decisions.</small>

      </footer>

      {toast && <div className="toast">{toast}</div>}

    </main>

  );

}
