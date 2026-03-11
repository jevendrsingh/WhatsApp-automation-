from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.core.security import decode_access_token
from app.db.database import get_db
from app.models.models import Business

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_current_business(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)) -> Business:
    business_id = decode_access_token(token)
    if not business_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")
    business = db.query(Business).filter(Business.id == int(business_id)).first()
    if not business:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Business not found")
    return business
