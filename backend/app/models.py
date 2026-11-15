
import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    Date,
    Text,
    Integer,
    ForeignKey,
    Numeric,
    UniqueConstraint,
    Index,
    CheckConstraint,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


def utc_now():
    return datetime.now(timezone.utc)


class Business(Base):
    __tablename__ = "businesses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(150), nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    memberships = relationship("Membership", back_populates="business")
    stores = relationship("Store", back_populates="business")
    products = relationship("Product", back_populates="business")
    suppliers = relationship("Supplier", back_populates="business")


class Membership(Base):
    __tablename__ = "memberships"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )
    user_id = Column(UUID(as_uuid=True), nullable=False)
    role = Column(String(30), nullable=False, default="owner")
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    business = relationship("Business", back_populates="memberships")

    __table_args__ = (
        UniqueConstraint("business_id", "user_id", name="uq_business_user"),
    )


class Store(Base):
    __tablename__ = "stores"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(150), nullable=False)
    address = Column(String(300), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    business = relationship("Business", back_populates="stores")

    __table_args__ = (
        Index("ix_stores_business_id", "business_id"),
    )


class Supplier(Base):
    __tablename__ = "suppliers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=True)
    phone = Column(String(30), nullable=True)
    lead_time_days = Column(Numeric(8, 2), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    business = relationship("Business", back_populates="suppliers")

    __table_args__ = (
        Index("ix_suppliers_business_id", "business_id"),
    )


class Product(Base):
    __tablename__ = "products"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )
    supplier_id = Column(
        UUID(as_uuid=True),
        ForeignKey("suppliers.id", ondelete="SET NULL"),
        nullable=True,
    )
    sku = Column(String(80), nullable=False)
    name = Column(String(180), nullable=False)
    category = Column(String(100), nullable=True)
    unit = Column(String(30), nullable=False, default="unit")
    cost_price = Column(Numeric(12, 2), nullable=True)
    selling_price = Column(Numeric(12, 2), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    business = relationship("Business", back_populates="products")

    __table_args__ = (
        UniqueConstraint("business_id", "sku", name="uq_business_product_sku"),
        Index("ix_products_business_id", "business_id"),
    )


class InventoryMovement(Base):
    __tablename__ = "inventory_movements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )

    store_id = Column(
        UUID(as_uuid=True),
        ForeignKey("stores.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    movement_type = Column(String(30), nullable=False)
    quantity = Column(Numeric(12, 2), nullable=False)

    reference = Column(String(100), nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    __table_args__ = (
        Index("ix_inventory_movements_business_id", "business_id"),
        Index("ix_inventory_movements_store_product", "store_id", "product_id"),
        CheckConstraint(
            "quantity <> 0",
            name="ck_inventory_movement_quantity_nonzero",
        ),
        CheckConstraint(
            "movement_type IN ('purchase', 'sale', 'adjustment', 'return')",
            name="ck_inventory_movement_type",
        ),
    )

class Sale(Base):
    __tablename__ = "sales"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )

    store_id = Column(
        UUID(as_uuid=True),
        ForeignKey("stores.id", ondelete="RESTRICT"),
        nullable=False,
    )

    receipt_number = Column(String(100), nullable=True)
    status = Column(String(20), nullable=False, default="completed")

    sold_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)
    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    __table_args__ = (
        Index("ix_sales_business_id", "business_id"),
        Index("ix_sales_store_sold_at", "store_id", "sold_at"),
        CheckConstraint(
            "status IN ('completed', 'voided', 'refunded')",
            name="ck_sales_status",
        ),
    )


class SaleItem(Base):
    __tablename__ = "sale_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    sale_id = Column(
        UUID(as_uuid=True),
        ForeignKey("sales.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="RESTRICT"),
        nullable=False,
    )

    quantity = Column(Numeric(12, 2), nullable=False)
    unit_price = Column(Numeric(12, 2), nullable=False)

    created_at = Column(DateTime(timezone=True), default=utc_now, nullable=False)

    __table_args__ = (
        Index("ix_sale_items_sale_id", "sale_id"),
        Index("ix_sale_items_product_id", "product_id"),
        CheckConstraint(
            "quantity > 0",
            name="ck_sale_items_quantity_positive",
        ),
        CheckConstraint(
            "unit_price >= 0",
            name="ck_sale_items_unit_price_nonnegative",
        ),
    )

class Forecast(Base):
    __tablename__ = "forecasts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )

    store_id = Column(
        UUID(as_uuid=True),
        ForeignKey("stores.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    forecast_date = Column(Date, nullable=False)
    predicted_quantity = Column(Numeric(12, 2), nullable=False)
    model_version = Column(String(80), nullable=False)

    generated_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    __table_args__ = (
        Index(
            "ix_forecasts_store_product_date",
            "store_id",
            "product_id",
            "forecast_date",
        ),
        CheckConstraint(
            "predicted_quantity >= 0",
            name="ck_forecasts_predicted_quantity_nonnegative",
        ),
        UniqueConstraint(
            "store_id",
            "product_id",
            "forecast_date",
            "model_version",
            name="uq_forecast_store_product_date_model",
        ),
    )


class ReorderRecommendation(Base):
    __tablename__ = "reorder_recommendations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )

    store_id = Column(
        UUID(as_uuid=True),
        ForeignKey("stores.id", ondelete="CASCADE"),
        nullable=False,
    )

    product_id = Column(
        UUID(as_uuid=True),
        ForeignKey("products.id", ondelete="CASCADE"),
        nullable=False,
    )

    forecast_id = Column(
        UUID(as_uuid=True),
        ForeignKey("forecasts.id", ondelete="SET NULL"),
        nullable=True,
    )

    current_stock = Column(Numeric(12, 2), nullable=False)
    reorder_point = Column(Numeric(12, 2), nullable=False)
    recommended_quantity = Column(Numeric(12, 2), nullable=False)

    status = Column(String(20), nullable=False, default="pending")

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    __table_args__ = (
        Index("ix_reorder_recommendations_store_product", "store_id", "product_id"),
        CheckConstraint(
            "current_stock >= 0",
            name="ck_reorder_current_stock_nonnegative",
        ),
        CheckConstraint(
            "reorder_point >= 0",
            name="ck_reorder_point_nonnegative",
        ),
        CheckConstraint(
            "recommended_quantity >= 0",
            name="ck_reorder_quantity_nonnegative",
        ),
        CheckConstraint(
            "status IN ('pending', 'accepted', 'ordered', 'dismissed')",
            name="ck_reorder_status",
        ),
    )

class Import(Base):
    __tablename__ = "imports"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="CASCADE"),
        nullable=False,
    )

    uploaded_by = Column(UUID(as_uuid=True), nullable=True)

    file_name = Column(String(255), nullable=False)
    file_format = Column(String(20), nullable=False)
    import_type = Column(String(30), nullable=False)

    status = Column(String(20), nullable=False, default="pending")

    total_rows = Column(Integer, nullable=False, default=0)
    processed_rows = Column(Integer, nullable=False, default=0)
    failed_rows = Column(Integer, nullable=False, default=0)

    error_message = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    completed_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        CheckConstraint(
            "status IN ('pending', 'processing', 'completed', 'failed')",
            name="ck_imports_status",
        ),
        CheckConstraint(
            "import_type IN ('products', 'sales', 'inventory')",
            name="ck_imports_type",
        ),
        CheckConstraint(
            "file_format IN ('csv', 'xlsx')",
            name="ck_imports_file_format",
        ),
        CheckConstraint(
            "total_rows >= 0 AND processed_rows >= 0 AND failed_rows >= 0",
            name="ck_imports_row_counts_nonnegative",
        ),
        CheckConstraint(
            "processed_rows + failed_rows <= total_rows",
            name="ck_imports_processed_rows_valid",
        ),
        Index(
            "ix_imports_business_created",
            "business_id",
            "created_at",
        ),
    )

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    business_id = Column(
        UUID(as_uuid=True),
        ForeignKey("businesses.id", ondelete="SET NULL"),
        nullable=True,
    )

    user_id = Column(UUID(as_uuid=True), nullable=True)

    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(UUID(as_uuid=True), nullable=True)

    description = Column(Text, nullable=True)

    created_at = Column(
        DateTime(timezone=True),
        default=utc_now,
        nullable=False,
    )

    __table_args__ = (
        Index(
            "ix_audit_logs_business_created",
            "business_id",
            "created_at",
        ),
        Index(
            "ix_audit_logs_entity",
            "entity_type",
            "entity_id",
        ),
        Index(
            "ix_audit_logs_user_created",
            "user_id",
            "created_at",
        ),
    )
