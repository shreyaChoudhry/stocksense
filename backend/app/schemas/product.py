
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProductCreate(BaseModel):
    sku: str = Field(min_length=1, max_length=80)
    name: str = Field(min_length=1, max_length=180)
    category: str | None = Field(default=None, max_length=100)
    unit: str = Field(default="unit", max_length=30)
    cost_price: Decimal | None = Field(default=None, ge=0)
    selling_price: Decimal | None = Field(default=None, ge=0)
    supplier_id: UUID | None = None


class ProductUpdate(BaseModel):
    sku: str | None = Field(default=None, min_length=1, max_length=80)
    name: str | None = Field(default=None, min_length=1, max_length=180)
    category: str | None = Field(default=None, max_length=100)
    unit: str | None = Field(default=None, max_length=30)
    cost_price: Decimal | None = Field(default=None, ge=0)
    selling_price: Decimal | None = Field(default=None, ge=0)
    supplier_id: UUID | None = None
    is_active: bool | None = None


class ProductResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    business_id: UUID
    supplier_id: UUID | None
    sku: str
    name: str
    category: str | None
    unit: str
    cost_price: Decimal | None
    selling_price: Decimal | None
    is_active: bool
