import pytest
import math


def calculate_inventory(
    average_daily_sales,
    daily_sales_std,
    lead_time,
    review_period,
    z_score,
    inventory_position,
):
    lead_time_demand = average_daily_sales * lead_time
    safety_stock = z_score * daily_sales_std * math.sqrt(lead_time)

    reorder_point = lead_time_demand + safety_stock
    target_stock = (
        average_daily_sales * (lead_time + review_period)
        + safety_stock
    )
    order_quantity = max(0, target_stock - inventory_position)

    return {
        "safety_stock": safety_stock,
        "reorder_point": reorder_point,
        "target_stock": target_stock,
        "order_quantity": order_quantity,
    }


def test_inventory_calculations():
    result = calculate_inventory(
        average_daily_sales=100,
        daily_sales_std=10,
        lead_time=4,
        review_period=7,
        z_score=1.645,
        inventory_position=500,
    )

    assert result["safety_stock"] == 32.9
    assert result["reorder_point"] == 432.9
    assert result["order_quantity"] == pytest.approx(632.9)


def test_no_order_when_stock_is_sufficient():
    result = calculate_inventory(
        average_daily_sales=10,
        daily_sales_std=0,
        lead_time=2,
        review_period=3,
        z_score=1.645,
        inventory_position=100,
    )

    assert result["order_quantity"] == 0

def test_zero_inventory_position_recommends_stock():
    result = calculate_inventory(
        average_daily_sales=100,
        daily_sales_std=10,
        lead_time=4,
        review_period=7,
        z_score=1.645,
        inventory_position=0,
    )

    assert result["order_quantity"] > 0


def test_negative_inventory_position_does_not_give_negative_order():
    result = calculate_inventory(
        average_daily_sales=100,
        daily_sales_std=10,
        lead_time=4,
        review_period=7,
        z_score=1.645,
        inventory_position=-100,
    )

    assert result["order_quantity"] >= 0
