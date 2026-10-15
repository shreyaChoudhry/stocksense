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
            "Store Intelligence",
            "Forecast Analysis",
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


# ---------- Store Intelligence ----------
elif page == "Store Intelligence":
    hero(
        "STORE INSIGHTS / WORKSPACE 02",
        "Store intelligence",
        "Explore historical performance, model errors, anomaly signals and inventory risk for an individual store.",
    )

    predictions = load_csv("xgboost_predictions.csv")
    metrics = load_csv("day12_store_metrics.csv")
    anomalies = load_csv("day19_anomaly_summary.csv")
    risks = load_csv("day18_inventory_risk.csv")

    if predictions is None:
        show_missing("xgboost_predictions.csv")
        st.stop()

    required = {"Date", "Store", "Sales", "XGBoost_Prediction"}
    if not required.issubset(predictions.columns):
        st.error(f"Prediction file is missing columns: {sorted(required - set(predictions.columns))}")
        st.stop()

    predictions = predictions.copy()
    predictions["Date"] = pd.to_datetime(predictions["Date"], errors="coerce")
    predictions = predictions.dropna(
        subset=["Date", "Store", "Sales", "XGBoost_Prediction"]
    )

    stores = sorted(predictions["Store"].unique())
    selected_store = st.selectbox("Select store", stores, key="intelligence_store")

    store_data = predictions[predictions["Store"] == selected_store].sort_values("Date")

    if store_data.empty:
        st.info("No prediction observations available for this store.")
        st.stop()

    start_date = store_data["Date"].min().date()
    end_date = store_data["Date"].max().date()

    selected_dates = st.date_input(
        "Evaluation date range",
        value=(start_date, end_date),
        min_value=start_date,
        max_value=end_date,
        key="intelligence_dates",
    )

    if isinstance(selected_dates, (tuple, list)) and len(selected_dates) == 2:
        start, end = selected_dates
        store_data = store_data[
            store_data["Date"].dt.date.between(start, end)
        ]

    if store_data.empty:
        st.warning("No prediction observations exist for this date range.")
        st.stop()

    store_data = store_data.copy()
    store_data["Absolute_Error"] = (
        store_data["Sales"] - store_data["XGBoost_Prediction"]
    ).abs()

    actual_mae = store_data["Absolute_Error"].mean()
    mean_actual = store_data["Sales"].mean()

    a, b, c, d = st.columns(4)
    a.metric("Observations", f"{len(store_data):,}")
    b.metric("Actual mean sales", f"{mean_actual:,.0f}")
    c.metric("MAE in selected period", f"{actual_mae:,.2f}")
    d.metric(
        "Mean prediction",
        f"{store_data['XGBoost_Prediction'].mean():,.0f}",
    )

    section(
        "Actual vs XGBoost prediction",
        "Hover over the lines to compare actual recorded sales with model predictions.",
    )

    chart_data = store_data.melt(
        id_vars=["Date"],
        value_vars=["Sales", "XGBoost_Prediction"],
        var_name="Series",
        value_name="Value",
    )

    fig = px.line(
        chart_data,
        x="Date",
        y="Value",
        color="Series",
        title=f"Store {selected_store} · actual vs predicted",
        color_discrete_map={
            "Sales": "#65d5ff",
            "XGBoost_Prediction": "#a99bff",
        },
    )
    st.plotly_chart(polish_fig(fig, 420), use_container_width=True)

    section("Store-level diagnostics")

    left, right = st.columns(2)

    with left:
        if metrics is not None and "Store" in metrics.columns:
            selected_metrics = metrics[metrics["Store"] == selected_store]
            if not selected_metrics.empty:
                st.markdown("**Saved store metrics**")
                st.dataframe(
                    selected_metrics,
                    use_container_width=True,
                    hide_index=True,
                )
            else:
                st.info("No saved metrics found for this store.")
        else:
            st.info("Store metrics file is unavailable.")

    with right:
        if anomalies is not None and "Store" in anomalies.columns:
            selected_anomaly = anomalies[
                anomalies["Store"] == selected_store
            ]
            if not selected_anomaly.empty:
                st.markdown("**Anomaly summary**")
                st.dataframe(
                    selected_anomaly,
                    use_container_width=True,
                    hide_index=True,
                )
            else:
                st.info("No anomaly summary row found for this store.")
        else:
            st.info("Anomaly summary file is unavailable.")

    if risks is not None and "Store" in risks.columns:
        selected_risk = risks[risks["Store"] == selected_store]
        if not selected_risk.empty:
            section("Inventory risk details")
            st.dataframe(
                selected_risk,
                use_container_width=True,
                hide_index=True,
            )
        else:
            st.info("No inventory-risk row found for this store.")

    st.download_button(
        "Download selected store predictions",
        store_data.to_csv(index=False).encode("utf-8"),
        file_name=f"store_{selected_store}_predictions.csv",
        mime="text/csv",
    )

    st.caption(
        "The prediction chart uses saved evaluation predictions, not a new live forecast. "
        "MAE is calculated for the selected store and date range. "
        "Sales values represent revenue, not physical units."
    )

# ---------- Forecast Analysis ----------
elif page == "Forecast Analysis":
    hero(
        "FORECAST LAB / WORKSPACE",
        "Forecast analysis",
        "Compare saved XGBoost predictions against actual sales and inspect prediction errors.",
    )

    predictions = load_csv("xgboost_predictions.csv")

    if predictions is None:
        show_missing("xgboost_predictions.csv")
        st.stop()

    required = {"Date", "Store", "Sales", "XGBoost_Prediction"}
    if not required.issubset(predictions.columns):
        st.error(
            f"Prediction file is missing columns: "
            f"{sorted(required - set(predictions.columns))}"
        )
        st.stop()

    predictions = predictions.copy()
    predictions["Date"] = pd.to_datetime(
        predictions["Date"], errors="coerce"
    )
    predictions = predictions.dropna(
        subset=["Date", "Store", "Sales", "XGBoost_Prediction"]
    )

    stores = sorted(predictions["Store"].unique())

    col1, col2 = st.columns([1, 2])

    with col1:
        selected_store = st.selectbox(
            "Select store", stores, key="forecast_store"
        )

    store_data = predictions[
        predictions["Store"] == selected_store
    ].sort_values("Date")

    with col2:
        start_date = store_data["Date"].min().date()
        end_date = store_data["Date"].max().date()

        date_range = st.date_input(
            "Evaluation period",
            value=(start_date, end_date),
            min_value=start_date,
            max_value=end_date,
            key="forecast_date_range",
        )

    if isinstance(date_range, (tuple, list)) and len(date_range) == 2:
        start, end = date_range
        store_data = store_data[
            store_data["Date"].dt.date.between(start, end)
        ]

    if store_data.empty:
        st.warning("No prediction observations exist for this selection.")
        st.stop()

    store_data = store_data.copy()
    store_data["Error"] = (
        store_data["Sales"] - store_data["XGBoost_Prediction"]
    )
    store_data["Absolute_Error"] = store_data["Error"].abs()

    mae = store_data["Absolute_Error"].mean()
    rmse = (store_data["Error"].pow(2).mean()) ** 0.5
    mean_actual = store_data["Sales"].mean()
    mean_prediction = store_data["XGBoost_Prediction"].mean()

    m1, m2, m3, m4 = st.columns(4)
    m1.metric("Observations", f"{len(store_data):,}")
    m2.metric("MAE", f"{mae:,.2f}")
    m3.metric("RMSE", f"{rmse:,.2f}")
    m4.metric("Mean actual sales", f"{mean_actual:,.0f}")

    st.caption(
        "Metrics below are recalculated for the selected store and date range. "
        "They may differ from the saved global evaluation metrics."
    )

    section("Actual vs predicted sales")

    chart_data = store_data.melt(
        id_vars=["Date"],
        value_vars=["Sales", "XGBoost_Prediction"],
        var_name="Series",
        value_name="Sales_Value",
    )

    fig = px.line(
        chart_data,
        x="Date",
        y="Sales_Value",
        color="Series",
        title=f"Store {selected_store}: actual vs XGBoost prediction",
        color_discrete_map={
            "Sales": "#65d5ff",
            "XGBoost_Prediction": "#a99bff",
        },
    )

    st.plotly_chart(
        polish_fig(fig, 420),
        use_container_width=True,
    )

    section("Prediction error analysis")

    e1, e2 = st.columns(2)

    with e1:
        error_fig = px.histogram(
            store_data,
            x="Error",
            nbins=35,
            title="Prediction error distribution",
            color_discrete_sequence=["#65d5ff"],
        )
        error_fig.add_vline(
            x=0,
            line_dash="dash",
            line_color="#ff8585",
        )
        st.plotly_chart(
            polish_fig(error_fig, 350),
            use_container_width=True,
        )

    with e2:
        direction_counts = pd.DataFrame({
            "Prediction outcome": ["Underprediction", "Overprediction", "Exact"],
            "Observations": [
                int((store_data["Error"] > 0).sum()),
                int((store_data["Error"] < 0).sum()),
                int((store_data["Error"] == 0).sum()),
            ],
        })

        direction_fig = px.pie(
            direction_counts,
            names="Prediction outcome",
            values="Observations",
            hole=0.62,
            title="Prediction direction",
            color="Prediction outcome",
            color_discrete_map={
                "Underprediction": "#65d5ff",
                "Overprediction": "#a99bff",
                "Exact": "#52dfb3",
            },
        )
        st.plotly_chart(
            polish_fig(direction_fig, 350),
            use_container_width=True,
        )

    with st.expander("Inspect prediction records"):
        st.dataframe(
            store_data.sort_values(
                "Absolute_Error", ascending=False
            ),
            use_container_width=True,
            hide_index=True,
        )

    st.download_button(
        "Download forecast evaluation",
        store_data.to_csv(index=False).encode("utf-8"),
        file_name=f"store_{selected_store}_forecast_evaluation.csv",
        mime="text/csv",
    )

    st.info(
        "These are saved evaluation predictions, not future live forecasts. "
        "Sales represent revenue, not physical product units."
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

# ---------- What-if Simulator ----------
elif page == "What-if Simulator":
    hero(
        "SCENARIO STUDIO / WORKSPACE 05",
        "What-if simulator",
        "Explore how demand and lead-time changes affect illustrative inventory recommendations.",
    )

    inventory = load_csv("day17_order_quantity.csv")

    if inventory is None:
        show_missing("day17_order_quantity.csv")
        st.stop()

    required = {
        "Store",
        "Average_Daily_Sales",
        "Daily_Sales_Std",
        "Safety_Stock",
        "Reorder_Point",
        "Recommended_Order_Quantity",
    }

    if not required.issubset(inventory.columns):
        st.error(f"Inventory file is missing columns: {sorted(required - set(inventory.columns))}")
        st.stop()

    stores = sorted(inventory["Store"].dropna().unique())
    selected_store = st.selectbox("Select store", stores, key="whatif_store")

    row = inventory.loc[inventory["Store"] == selected_store].iloc[0]

    st.markdown("#### Adjust scenario parameters")

    c1, c2, c3 = st.columns(3)

    with c1:
        demand_change = st.slider(
            "Demand change (%)", -30, 100, 10, 5
        )

    with c2:
        lead_time = st.slider(
            "Lead time (days)", 1, 30, 7
        )

    with c3:
        service_level = st.select_slider(
            "Service level",
            options=[90, 95, 97, 99],
            value=95,
            format_func=lambda x: f"{x}%",
        )

    # Illustrative normal-demand assumptions.
    # Z values are approximations for the selected service levels.
    z_scores = {90: 1.282, 95: 1.645, 97: 1.881, 99: 2.326}

    average_daily = max(float(row["Average_Daily_Sales"]), 0)
    daily_std = max(float(row["Daily_Sales_Std"]), 0)

    adjusted_daily = average_daily * (1 + demand_change / 100)
    adjusted_lead_demand = adjusted_daily * lead_time

    adjusted_safety_stock = (
        z_scores[service_level] * daily_std * (lead_time ** 0.5)
    )

    adjusted_reorder_point = adjusted_lead_demand + adjusted_safety_stock

    review_period = 7
    target_stock = (
        adjusted_daily * (lead_time + review_period)
        + adjusted_safety_stock
    )

    # Existing inventory position is an assumption, not a measured stock count.
    assumed_inventory_position = max(
        float(row.get("Assumed_Inventory_Position", 0) or 0), 0
    )

    recommended_order = max(
        0, round(target_stock - assumed_inventory_position)
    )

    st.divider()
    st.markdown("#### Recalculated scenario")

    m1, m2, m3, m4 = st.columns(4)

    m1.metric(
        "Adjusted daily demand proxy",
        f"{adjusted_daily:,.1f}",
        help="Based on historical average sales, not physical units.",
    )
    m2.metric("Lead-time demand proxy", f"{adjusted_lead_demand:,.1f}")
    m3.metric("Safety-stock proxy", f"{adjusted_safety_stock:,.1f}")
    m4.metric("Illustrative order quantity", f"{recommended_order:,.0f}")

    comparison = pd.DataFrame({
        "Metric": [
            "Lead-time demand",
            "Safety stock",
            "Reorder point",
            "Target stock",
            "Recommended order quantity",
        ],
        "Original": [
            float(row["Lead_Time_Demand"]),
            float(row["Safety_Stock"]),
            float(row["Reorder_Point"]),
            float(row["Target_Stock"]),
            float(row["Recommended_Order_Quantity"]),
        ],
        "Scenario": [
            adjusted_lead_demand,
            adjusted_safety_stock,
            adjusted_reorder_point,
            target_stock,
            recommended_order,
        ],
    })

    st.dataframe(
        comparison.round(2),
        use_container_width=True,
        hide_index=True,
    )

    fig = px.bar(
        comparison[comparison["Metric"].isin([
            "Lead-time demand",
            "Safety stock",
            "Reorder point",
            "Recommended order quantity",
        ])],
        x="Metric",
        y=["Original", "Scenario"],
        barmode="group",
        title="Original vs adjusted scenario",
        color_discrete_sequence=["#65d5ff", "#a99bff"],
    )

    st.plotly_chart(polish_fig(fig, 390), use_container_width=True)

    st.info(
        "This is a sensitivity simulation, not a physical stock recommendation. "
        "Rossmann Sales represents revenue rather than units sold. "
        "The assumed inventory position and 7-day review period are illustrative. "
        "The model is not retrained when you change these controls."
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
