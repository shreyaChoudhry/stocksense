
import uuid
from datetime import datetime, timezone

from sqlalchemy import (
    Column,
    String,
    Boolean,
    DateTime,
    ForeignKey,
    Numeric,
    UniqueConstraint,
    Index,
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
