from uuid import UUID

from fastapi import Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_user
from app.database import SessionLocal
from app.models import Membership


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_business(
    business_id: UUID = Header(..., alias="X-Business-ID"),
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    try:
        user_id = UUID(current_user["id"])
    except (ValueError, KeyError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user identity",
        )

    membership = (
        db.query(Membership)
        .filter(
            Membership.user_id == user_id,
            Membership.business_id == business_id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this business",
        )

    return {
        "user_id": str(user_id),
        "business_id": str(business_id),
        "role": membership.role,
    }