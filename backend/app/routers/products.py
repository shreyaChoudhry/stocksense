
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.models import Product, Supplier
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse
from app.tenancy import get_current_business, get_db

router = APIRouter(prefix="/products", tags=["Products"])


def verify_supplier(db: Session, supplier_id: UUID, business_id: UUID):
    supplier = db.query(Supplier).filter(
        Supplier.id == supplier_id,
        Supplier.business_id == business_id,
    ).first()

    if not supplier:
        raise HTTPException(
            status_code=400,
            detail="Supplier not found in this business",
        )


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(
    payload: ProductCreate,
    db: Session = Depends(get_db),
    business: dict = Depends(get_current_business),
):
    business_id = UUID(business["business_id"])

    existing = db.query(Product).filter(
        Product.business_id == business_id,
        Product.sku == payload.sku,
    ).first()

    if existing:
        raise HTTPException(status_code=409, detail="SKU already exists")

    if payload.supplier_id:
        verify_supplier(db, payload.supplier_id, business_id)

    product = Product(
        **payload.model_dump(),
        business_id=business_id,
    )

    try:
        db.add(product)
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product conflict")


@router.get("/", response_model=list[ProductResponse])
def list_products(
    search: str | None = None,
    category: str | None = None,
    include_inactive: bool = False,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    business: dict = Depends(get_current_business),
):
    business_id = UUID(business["business_id"])

    query = db.query(Product).filter(
        Product.business_id == business_id
    )

    if not include_inactive:
        query = query.filter(Product.is_active.is_(True))

    if search:
        term = f"%{search.strip()}%"
        query = query.filter(
            (Product.name.ilike(term)) |
            (Product.sku.ilike(term))
        )

    if category:
        query = query.filter(Product.category == category)

    return query.order_by(Product.created_at.desc()).offset(skip).limit(limit).all()


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    business: dict = Depends(get_current_business),
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == UUID(business["business_id"]),
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.patch("/{product_id}", response_model=ProductResponse)
def update_product(
    product_id: UUID,
    payload: ProductUpdate,
    db: Session = Depends(get_db),
    business: dict = Depends(get_current_business),
):
    business_id = UUID(business["business_id"])

    product = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == business_id,
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    updates = payload.model_dump(exclude_unset=True)

    if "sku" in updates:
        duplicate = db.query(Product).filter(
            Product.business_id == business_id,
            Product.sku == updates["sku"],
            Product.id != product_id,
        ).first()
        if duplicate:
            raise HTTPException(status_code=409, detail="SKU already exists")

    if updates.get("supplier_id"):
        verify_supplier(db, updates["supplier_id"], business_id)

    for field, value in updates.items():
        setattr(product, field, value)

    try:
        db.commit()
        db.refresh(product)
        return product
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Product conflict")


@router.delete("/{product_id}")
def deactivate_product(
    product_id: UUID,
    db: Session = Depends(get_db),
    business: dict = Depends(get_current_business),
):
    product = db.query(Product).filter(
        Product.id == product_id,
        Product.business_id == UUID(business["business_id"]),
    ).first()

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Soft delete preserves inventory history.
    product.is_active = False
    db.commit()

    return {"message": "Product deactivated successfully"}
