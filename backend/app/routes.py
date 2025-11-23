from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from . import models, database
from pydantic import BaseModel
from typing import List, Optional

class PreferencesUpdate(BaseModel):
    allergies: Optional[List[str]]= None
    preferences: Optional[List[str]]= None

router = APIRouter(prefix="/user", tags=["Users"])
db_dependency = database.get_db

# Helper: recommended iron goal for females
def recommended_iron_goal(age: int, pregnant: bool = False, breastfeeding: bool = False) -> float:
    if pregnant:
        return 27.0
    if breastfeeding:
        return 9.5
    if 19 <= age <= 50:
        return 18.0
    return 8.0

# Create a new user (only if no user exists)
@router.post("/")
def create_user(
    name: str,
    age: int,
    pregnant: bool = False,
    breastfeeding: bool = False,
    db: Session = Depends(db_dependency),
):
    existing_user = db.query(models.User).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="User already exists")

    user = models.User(
        name=name,
        age=age,
        pregnant=pregnant,
        breastfeeding=breastfeeding,
    )

    daily_goal = recommended_iron_goal(age, pregnant, breastfeeding)

    try:
        # Add user
        db.add(user)
        db.commit()
        db.refresh(user)

        # Add IronGoal
        iron_goal = models.IronGoal(daily_target_mg=daily_goal)
        user.iron_goal = iron_goal
        db.add(iron_goal)

        # Add Preferences
        preferences = models.Preferences(dietary_preferences=[], allergies=[])
        user.preferences = preferences
        db.add(preferences)

        db.commit()

        return {"message": "User created", "daily_iron_goal": daily_goal}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")


# Get user profile
@router.get("/profile")
def get_user(db: Session = Depends(db_dependency)):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    prefs = user.preferences
    goal = user.iron_goal

    return {
        "name": user.name,
        "age": user.age,
        "pregnant": user.pregnant,
        "breastfeeding": user.breastfeeding,
        "dietary_preferences": prefs.dietary_preferences if prefs else [],
        "allergies": prefs.allergies if prefs else [],
        "daily_iron_goal": goal.daily_target_mg if goal else None,
    }

# User reset endpoint
# Delete / reset the single user
@router.delete("/reset")
def reset_user(db: Session = Depends(db_dependency)):
    user = db.query(models.User).first()

    if not user:
        return {"message": "No user to delete"}

    try:
        # Delete preferences and iron_goal first (because of foreign key)
        if user.preferences:
            db.delete(user.preferences)

        if user.iron_goal:
            db.delete(user.iron_goal)

        # Delete user
        db.delete(user)

        db.commit()
        return {"message": "User reset successful"}

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to reset user: {str(e)}")


# Update preferences
@router.put("/preferences")
def update_preferences(
    dietary_preferences: Optional[List[str]] = None,
    allergies: Optional[List[str]] = None,
    db: Session = Depends(db_dependency),
):
    user = db.query(models.User).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    prefs = user.preferences
    if not prefs:
        prefs = models.Preferences(dietary_preferences=[], allergies=[])
        user.preferences = prefs
        db.add(prefs)

    if dietary_preferences is not None:
        prefs.dietary_preferences = dietary_preferences
    if allergies is not None:
        prefs.allergies = allergies

    db.commit()
    db.refresh(prefs)

    return {
        "message": "Preferences updated",
        "dietary_preferences": prefs.dietary_preferences,
        "allergies": prefs.allergies
    }
