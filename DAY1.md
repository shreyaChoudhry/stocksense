# StockSense — Day 1

## Project Goal

StockSense is an AI-powered e-commerce demand forecasting
and inventory optimization system.

## Dataset

Primary dataset:
Rossmann Store Sales

## Dataset Size

- Train: 1,017,209 rows × 9 columns
- Store: 1,115 rows × 10 columns
- Test: 41,088 rows × 8 columns

## Data Understanding

### Important Columns

- Store: Store identifier
- Date: Sales date
- Sales: Daily sales
- Customers: Number of customers
- Open: Whether store was open
- Promo: Whether promotion was active
- StateHoliday: State holiday indicator
- SchoolHoliday: School holiday indicator

### Dataset Date Range

2013-01-01 to 2015-07-31

### Number of Stores

1,115

## Time Series Concepts Learned

- Trend
- Seasonality
- Noise
- Lag
- Rolling average
- Forecast horizon
- Training period
- Validation period
- Test period
- Time-series leakage
- Temporal train/validation/test split

## Initial Observations

1. The training dataset contains over one million observations.
2. The dataset contains records from 1,115 stores.
3. Sales vary substantially across observations.
4. Promotions are present in a substantial portion of the training records.
5. The data covers a multi-year time period.
6. Sales patterns need to be analyzed with time/order preserved.

## Initial Visualization

Created:

- Matplotlib daily sales visualization
- Plotly interactive daily sales visualization

## Day 1 Completed

- [x] GitHub repository
- [x] Python virtual environment
- [x] Project structure
- [x] Dependencies
- [x] Rossmann dataset
- [x] Dataset inspection
- [x] Initial visualization
- [x] Data understanding
- [x] Time-series fundamentals