from pathlib import Path

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st

ROOT = Path(__file__).resolve().parent
DATA = ROOT / "data" / "processed"

st.set_page_config(
    page_title="StockSense | Demand Intelligence",
    page_icon="📦",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ---------- Premium dashboard styling ----------
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

    :root {
      --ss-bg: #080d19;
      --ss-panel: rgba(19, 28, 48, .78);
      --ss-border: rgba(142, 164, 205, .20);
      --ss-blue: #65d5ff;
      --ss-violet: #9b8cff;
      --ss-muted: #9aa9c4;
    }
    .stApp {
      background:
        radial-gradient(ellipse at 10% 0%, rgba(46, 94, 180, .18), transparent 35%),
        radial-gradient(ellipse at 92% 8%, rgba(119, 73, 214, .15), transparent 28%),
        linear-gradient(145deg, #080d19 0%, #0b1222 55%, #090e1a 100%);
      color: #eef4ff;
      font-family: 'DM Sans', sans-serif;
    }
    h1, h2, h3, [data-testid="stMetricValue"] {
      font-family: 'Space Grotesk', sans-serif !important;
      letter-spacing: -.025em;
    }
    .block-container { max-width: 1550px; padding-top: 1.5rem; padding-bottom: 3rem; }
    [data-testid="stSidebar"] {
      background: linear-gradient(180deg, rgba(20, 29, 49, .98), rgba(12, 18, 33, .98));
      border-right: 1px solid var(--ss-border);
    }
    [data-testid="stSidebar"] > div { padding-top: 1.3rem; }
    [data-testid="stRadio"] label { border-radius: 10px; }
    div[data-testid="stMetric"] {
      background: linear-gradient(145deg, rgba(27, 40, 67, .86), rgba(15, 23, 41, .82));
      border: 1px solid var(--ss-border);
      padding: 18px 18px 16px;
      border-radius: 18px;
      box-shadow: 0 8px 28px rgba(0, 0, 0, .14);
      transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease;
      min-height: 112px;
    }
    div[data-testid="stMetric"]:hover {
      transform: translateY(-4px);
      border-color: rgba(101, 213, 255, .55);
      box-shadow: 0 14px 32px rgba(29, 135, 209, .13);
    }
    div[data-testid="stMetricLabel"] { color: #aebbd2 !important; }
    div[data-testid="stMetricValue"] { color: #f3f7ff !important; }
    .ss-hero {
      position: relative; overflow: hidden;
      padding: 28px 30px; margin: 4px 0 22px;
      border: 1px solid rgba(124, 164, 255, .30); border-radius: 24px;
      background: linear-gradient(115deg, rgba(25, 52, 91, .82), rgba(46, 32, 86, .65) 70%, rgba(17, 27, 49, .82));
      box-shadow: 0 18px 55px rgba(0, 0, 0, .18), inset 0 1px rgba(255,255,255,.05);
    }
    .ss-hero:after {
      content: ''; position: absolute; width: 250px; height: 250px; border-radius: 50%;
      right: -65px; top: -135px; border: 1px solid rgba(101,213,255,.35);
      box-shadow: 0 0 0 25px rgba(101,213,255,.035), 0 0 0 55px rgba(155,140,255,.025);
    }
    .ss-eyebrow { text-transform: uppercase; letter-spacing: .18em; color: #8de4ff; font-size: .72rem; font-weight: 700; }
    .ss-hero h1 { margin: 8px 0 7px; font-size: clamp(2rem, 4vw, 3.1rem); color: #f6f8ff; }
    .ss-hero p { max-width: 760px; color: #c1cde3; margin-bottom: 0; font-size: 1rem; line-height: 1.65; }
    .ss-chip {
      display: inline-block; padding: 6px 10px; margin: 16px 7px 0 0; border-radius: 999px;
      color: #d9f6ff; background: rgba(101,213,255,.09); border: 1px solid rgba(101,213,255,.22);
      font-size: .76rem;
    }
    .ss-section { color: #eaf1ff; font-family: 'Space Grotesk', sans-serif; font-size: 1.15rem; font-weight: 600; margin: 12px 0 8px; }
    .ss-note { color: var(--ss-muted); font-size: .88rem; }
    div[data-testid="stDataFrame"], div[data-testid="stTable"] {
      border: 1px solid var(--ss-border); border-radius: 14px; overflow: hidden;
    }
    .stButton > button, .stDownloadButton > button {
      border-radius: 10px; border: 1px solid rgba(101,213,255,.35);
      background: linear-gradient(100deg, rgba(43,119,174,.28), rgba(105,81,190,.22));
      color: #edf8ff; transition: all .2s ease;
    }
    .stButton > button:hover, .stDownloadButton > button:hover {
      border-color: var(--ss-blue); transform: translateY(-1px);
      box-shadow: 0 8px 22px rgba(69,166,224,.14);
    }
    hr { border-color: rgba(142,164,205,.16); }
    #MainMenu, footer { visibility: hidden; }
    </style>
    """,
    unsafe_allow_html=True,
)

PLOTLY_TEMPLATE = "plotly_dark"


@st.cache_data(show_spinner=False)
def load_csv(filename):
    path = DATA / filename
    if not path.exists():
        return None
    return pd.read_csv(path)


@st.cache_data(show_spinner=False)
def load_sales():
    path = DATA / "store_daily_sales.csv"
    if not path.exists():
        return None
    frame = pd.read_csv(path, parse_dates=["Date"])
    required = {"Store", "Date", "Sales"}
    if not required.issubset(frame.columns):
        raise ValueError(f"store_daily_sales.csv needs columns: {sorted(required)}")
    frame = frame.dropna(subset=["Store", "Date", "Sales"])
    return frame.sort_values(["Date", "Store"])


def show_missing(filename):
    st.warning(
        f"Required data file `{filename}` was not found in `data/processed`. "
        "Run the corresponding notebook first."
    )


def money_like(value):
    return f"{value:,.0f}"


def polish_fig(fig, height=None):
    fig.update_layout(
        template=PLOTLY_TEMPLATE,
        paper_bgcolor="rgba(0,0,0,0)",
        plot_bgcolor="rgba(0,0,0,0)",
        font=dict(family="DM Sans, sans-serif", color="#dce7fa"),
        margin=dict(l=12, r=12, t=58, b=12),
        title=dict(x=0.02, xanchor="left", font=dict(size=16)),
        hoverlabel=dict(bgcolor="#111b2e", bordercolor="#65d5ff", font_color="#f4f8ff"),
        legend=dict(bgcolor="rgba(0,0,0,0)"),
    )
    fig.update_xaxes(showgrid=True, gridcolor="rgba(142,164,205,.10)", zeroline=False)
    fig.update_yaxes(showgrid=True, gridcolor="rgba(142,164,205,.10)", zeroline=False)
    if height:
        fig.update_layout(height=height)
    return fig


def hero(eyebrow, title, description, chips=None):
    chip_html = "".join(f'<span class="ss-chip">{chip}</span>' for chip in (chips or []))
    st.markdown(
        f"""
        <div class="ss-hero">
          <div class="ss-eyebrow">{eyebrow}</div>
          <h1>{title}</h1>
          <p>{description}</p>
          {chip_html}
        </div>
        """,
        unsafe_allow_html=True,
    )


def section(title, note=None):
    st.markdown(f'<div class="ss-section">{title}</div>', unsafe_allow_html=True)
    if note:
        st.markdown(f'<div class="ss-note">{note}</div>', unsafe_allow_html=True)


# ---------- Sidebar ----------
with st.sidebar:
    st.markdown("## 📦 StockSense")
    st.caption("DEMAND INTELLIGENCE PLATFORM")
    st.divider()
    page = st.radio(
        "WORKSPACE",
        [
            "Overview",
            "Sales Analytics",
            "Model Performance",
            "Inventory Intelligence",
            "What-if Simulator",
            "Anomaly Detection",
            "Explainability",
        ],
        label_visibility="visible",
    )
    st.divider()
    st.markdown("**DATA STATUS**")
    sales_path = DATA / "store_daily_sales.csv"
    st.caption("🟢 Sales dataset found" if sales_path.exists() else "🟠 Sales dataset missing")
    st.caption("Rossmann historical sales")
    st.markdown("---")
    st.caption("Forecasting · Inventory · Risk")


# ---------- Overview ----------
if page == "Overview":
    hero(
        "RETAIL ANALYTICS / WORKSPACE 01",
        "Demand intelligence, at a glance.",
        "Turn historical sales patterns into clearer forecasting, inventory and risk decisions — all in one interactive workspace.",
        ["XGBoost forecasting", "Inventory signals", "Anomaly monitoring"],
    )
    try:
        sales = load_sales()
    except Exception as exc:
        st.error(f"Could not load sales data: {exc}")
        st.stop()
    if sales is None:
        show_missing("store_daily_sales.csv")
        st.stop()

    total_stores = sales["Store"].nunique()
    observations = len(sales)
    total_sales = sales["Sales"].sum()
    average_daily_sales = sales["Sales"].mean()
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Stores covered", f"{total_stores:,}", help="Unique stores in the processed dataset")
    k2.metric("Sales observations", f"{observations:,}")
    k3.metric("Total recorded sales", money_like(total_sales))
    k4.metric("Avg. observation", money_like(average_daily_sales))

    st.info(
        "Data note: Rossmann Sales represents revenue, not physical product units. "
        "Inventory quantities and risk outputs are illustrative proxies, not verified stock counts."
    )

    section("Sales pulse", "Aggregated daily sales across all stores. Hover to inspect dates and values.")
    daily = sales.groupby("Date", as_index=False)["Sales"].sum().sort_values("Date")
    granularity = st.segmented_control(
        "Time aggregation",
        options=["Daily", "Weekly", "Monthly"],
        default="Weekly",
    )
    if granularity == "Weekly":
        plot_data = daily.set_index("Date").resample("W")["Sales"].sum().reset_index()
    elif granularity == "Monthly":
        plot_data = daily.set_index("Date").resample("MS")["Sales"].sum().reset_index()
    else:
        plot_data = daily
    fig = px.area(
        plot_data, x="Date", y="Sales", title=f"{granularity} recorded sales across stores",
        color_discrete_sequence=["#65d5ff"],
    )
    fig.update_traces(line=dict(width=2.5), fillcolor="rgba(101,213,255,.12)")
    st.plotly_chart(polish_fig(fig, 360), use_container_width=True)

    left, right = st.columns([1.15, .85])
    with left:
        section("Store explorer", "Choose a store to inspect its sales history.")
        store_ids = sorted(sales["Store"].unique())
        selected = st.selectbox("Select store", store_ids, key="overview_store")
        selected_sales = sales[sales["Store"] == selected].sort_values("Date")
        store_fig = px.line(
            selected_sales, x="Date", y="Sales",
            title=f"Store {selected} · historical sales",
            color_discrete_sequence=["#a99bff"],
        )
        store_fig.update_traces(line=dict(width=2))
        st.plotly_chart(polish_fig(store_fig, 330), use_container_width=True)
    with right:
        section("Latest observations")
        st.dataframe(
            sales.sort_values("Date", ascending=False).head(12),
            use_container_width=True, hide_index=True,
        )
        st.download_button(
            "Download latest observations",
            sales.sort_values("Date", ascending=False).head(500).to_csv(index=False).encode("utf-8"),
            file_name="stocksense_latest_observations.csv",
            mime="text/csv",
        )


# ---------- Sales Analytics ----------
elif page == "Sales Analytics":
    hero("EXPLORE / WORKSPACE 02", "Sales analytics", "Drill into a store and date window to uncover changes in historical sales.")
    try:
        sales = load_sales()
    except Exception as exc:
        st.error(f"Could not load sales data: {exc}")
        st.stop()
    if sales is None:
        show_missing("store_daily_sales.csv")
        st.stop()

    stores = sorted(sales["Store"].unique())
    f1, f2 = st.columns([1, 2])
    with f1:
        selected_store = st.selectbox("Store", stores, key="analytics_store")
    store_sales = sales[sales["Store"] == selected_store].sort_values("Date")
    start_date, end_date = store_sales["Date"].min().date(), store_sales["Date"].max().date()
    with f2:
        date_range = st.date_input("Date range", value=(start_date, end_date), min_value=start_date, max_value=end_date)
    if isinstance(date_range, (tuple, list)) and len(date_range) == 2:
        start, end = date_range
        filtered = store_sales[store_sales["Date"].dt.date.between(start, end)]
    else:
        filtered = store_sales

    if filtered.empty:
        st.info("No observations exist for this selection.")
    else:
        a, b, c, d = st.columns(4)
        a.metric("Observations", f"{len(filtered):,}")
        b.metric("Average sales", money_like(filtered["Sales"].mean()))
        c.metric("Peak sales", money_like(filtered["Sales"].max()))
        d.metric("Median sales", money_like(filtered["Sales"].median()))
        chart_type = st.radio("Chart style", ["Line", "Area", "Bar"], horizontal=True)
        if chart_type == "Area":
            fig = px.area(filtered, x="Date", y="Sales", color_discrete_sequence=["#65d5ff"])
        elif chart_type == "Bar":
            fig = px.bar(filtered, x="Date", y="Sales", color_discrete_sequence=["#8f83ff"])
        else:
            fig = px.line(filtered, x="Date", y="Sales", color_discrete_sequence=["#65d5ff"])
        fig.update_layout(title=f"Store {selected_store} · selected period")
        st.plotly_chart(polish_fig(fig, 420), use_container_width=True)
        with st.expander("View filtered data"):
            st.dataframe(filtered, use_container_width=True, hide_index=True)
        st.download_button(
            "Export filtered data",
            filtered.to_csv(index=False).encode("utf-8"),
            file_name=f"store_{selected_store}_sales.csv",
            mime="text/csv",
        )


# ---------- Model Performance ----------
elif page == "Model Performance":
    hero("FORECAST LAB / WORKSPACE 03", "Model performance", "Review saved evaluation outputs and compare models only on compatible validation windows.")
    comparison = load_csv("day11_model_comparison.csv")
    evaluation = load_csv("day10_xgboost_evaluation.csv")
    if comparison is None and evaluation is None:
        st.warning("No model evaluation CSV files were found.")
        st.stop()
    if comparison is not None:
        section("Model comparison")
        st.dataframe(comparison, use_container_width=True, hide_index=True)
        if {"Model", "MAE"}.issubset(comparison.columns):
            metric = st.selectbox("Compare using", [c for c in ["MAE", "RMSE", "sMAPE"] if c in comparison.columns], index=0)
            fig = px.bar(
                comparison.sort_values(metric), x="Model", y=metric, color="Model",
                title=f"{metric} by model · lower is better",
                color_discrete_sequence=["#65d5ff", "#9b8cff", "#52dfb3"],
            )
            st.plotly_chart(polish_fig(fig, 370), use_container_width=True)
    if evaluation is not None:
        with st.expander("XGBoost evaluation details"):
            st.dataframe(evaluation, use_container_width=True, hide_index=True)
    st.caption("Compare metrics only when models use the same target, split and evaluation procedure.")


# ---------- Inventory Intelligence ----------
elif page == "Inventory Intelligence":
    hero("OPERATIONS / WORKSPACE 04", "Inventory intelligence", "Inspect safety stock, reorder points, order recommendations and risk signals.")
    inventory = load_csv("day17_order_quantity.csv")
    risk = load_csv("day18_inventory_risk.csv")
    risk_summary = load_csv("day18_inventory_risk_summary.csv")
    safety = load_csv("day16_safety_stock_reorder_point.csv")

    if inventory is None:
        show_missing("day17_order_quantity.csv")
    else:
        section("Order quantity recommendations", "Use the store selector to narrow the table.")
        if "Store" in inventory.columns:
            stores = sorted(inventory["Store"].dropna().unique())
            selected = st.selectbox("Inspect store", stores, key="inventory_store")
            selected_rows = inventory[inventory["Store"] == selected]
        else:
            selected_rows = inventory
        st.dataframe(selected_rows.head(250), use_container_width=True, hide_index=True)
        st.download_button(
            "Download recommendations",
            selected_rows.to_csv(index=False).encode("utf-8"),
            file_name="stocksense_order_recommendations.csv",
            mime="text/csv",
        )
    c1, c2 = st.columns(2)
    with c1:
        if safety is not None:
            section("Safety stock & reorder points")
            st.dataframe(safety.head(100), use_container_width=True, hide_index=True)
    with c2:
        if risk_summary is not None:
            section("Risk summary")
            st.dataframe(risk_summary, use_container_width=True, hide_index=True)
    if risk is not None:
        with st.expander("Store-level inventory risk details"):
            st.dataframe(risk.head(250), use_container_width=True, hide_index=True)
    st.warning("These outputs use sales revenue as a demand proxy and illustrative lead-time assumptions. Do not interpret them as real units to order.")


# ---------- What-if Simulator ----------
elif page == "What-if Simulator":
    hero("SCENARIO STUDIO / WORKSPACE 05", "What-if simulator", "Explore how demand and lead-time assumptions change an illustrative inventory plan.")
    scenario = load_csv("day21_inventory_what_if.csv")
    inventory = load_csv("day17_order_quantity.csv")
    if scenario is None and inventory is None:
        st.warning("No what-if or inventory output was found. Run the Day 21 simulator notebook first.")
        st.stop()

    st.markdown("#### Scenario controls")
    col1, col2, col3 = st.columns(3)
    with col1:
        demand_change = st.slider("Demand change (%)", -30, 100, 10, 5)
    with col2:
        lead_time = st.slider("Lead time (days)", 1, 30, 7)
    with col3:
        service_level = st.select_slider("Service level target", options=["90%", "95%", "97.5%", "99%"], value="95%")

    if scenario is not None:
        st.caption("Saved Day 21 what-if results are shown below. Controls above describe a scenario; they do not retrain the forecast model.")
        st.dataframe(scenario.head(100), use_container_width=True, hide_index=True)
        st.download_button(
            "Download saved scenario data",
            scenario.to_csv(index=False).encode("utf-8"),
            file_name="stocksense_what_if_results.csv",
            mime="text/csv",
        )
    elif inventory is not None:
        st.caption("Illustrative scenario preview based on existing order recommendations.")
        numeric_cols = inventory.select_dtypes(include="number").columns.tolist()
        if numeric_cols:
            preview = inventory.head(100).copy()
            candidate = next((c for c in numeric_cols if any(word in c.lower() for word in ["order", "quantity", "demand", "sales"])), numeric_cols[0])
            preview[f"{candidate}_scenario_preview"] = preview[candidate] * (1 + demand_change / 100)
            st.dataframe(preview, use_container_width=True, hide_index=True)
    st.info(
        f"Scenario settings: demand {demand_change:+d}%, lead time {lead_time} days, service level {service_level}. "
        "This interactive panel is a sensitivity preview; the saved model is not retrained and inventory assumptions remain illustrative."
    )


# ---------- Anomaly Detection ----------
elif page == "Anomaly Detection":
    hero("RISK MONITOR / WORKSPACE 06", "Sales anomaly detection", "Review historical observations flagged for further investigation.")
    summary = load_csv("day19_anomaly_summary.csv")
    if summary is None:
        show_missing("day19_anomaly_summary.csv")
        st.stop()
    if {"Store", "Anomaly_Count"}.issubset(summary.columns):
        max_stores = min(30, len(summary))
        top_n = st.slider("Stores to display", 5, max(5, max_stores), min(15, max_stores))
        top = summary.nlargest(top_n, "Anomaly_Count")
        fig = px.bar(
            top.sort_values("Anomaly_Count"), x="Anomaly_Count", y="Store", orientation="h",
            title=f"Top {top_n} stores by flagged anomaly count",
            color="Anomaly_Count", color_continuous_scale=["#334d7a", "#65d5ff", "#9b8cff"],
        )
        st.plotly_chart(polish_fig(fig, max(350, top_n * 25)), use_container_width=True)
    st.dataframe(summary, use_container_width=True, hide_index=True)
    st.caption("An anomaly is a review signal, not proof of fraud, a data error or a stockout.")


# ---------- Explainability ----------
elif page == "Explainability":
    hero("MODEL INSIGHTS / WORKSPACE 07", "Model explainability", "Understand which features the saved XGBoost model relied on most in its evaluation.")
    importance = load_csv("day13_feature_importance.csv")
    if importance is None:
        show_missing("day13_feature_importance.csv")
        st.stop()
    if {"Feature", "Importance"}.issubset(importance.columns):
        top_n = st.slider("Number of features", 5, min(20, max(5, len(importance))), min(15, len(importance)))
        top = importance.nlargest(top_n, "Importance").sort_values("Importance")
        fig = px.bar(
            top, x="Importance", y="Feature", orientation="h",
            title=f"Top {top_n} features by model importance",
            color="Importance", color_continuous_scale=["#344d7a", "#65d5ff", "#a99bff"],
        )
        st.plotly_chart(polish_fig(fig, max(350, top_n * 30)), use_container_width=True)
    with st.expander("View importance table"):
        st.dataframe(importance.head(30), use_container_width=True, hide_index=True)
    st.info("Feature importance measures model reliance. It does not prove that a feature causes sales to increase or decrease.")


# ---------- Footer ----------
st.divider()
st.caption("StockSense · Demand Forecasting & Inventory Intelligence · Research prototype based on historical Rossmann sales data")
