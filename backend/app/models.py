from sqlalchemy import Column, Integer, String, Boolean, Float, JSON, ForeignKey
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    age = Column(Integer)
    pregnant = Column(Boolean, default=False)
    breastfeeding = Column(Boolean, default=False)
    custom_iron_goal = Column(Float, nullable=True)


    preferences = relationship(
        "Preferences",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )
    iron_goal = relationship(
        "IronGoal",
        back_populates="user",
        uselist=False,
        cascade="all, delete"
    )

class Preferences(Base):
    __tablename__ = "preferences"

    id = Column(Integer, primary_key=True, index=True)
    dietary_preferences = Column(JSON, default=list)
    allergies = Column(JSON, default=list)

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="preferences")

class IronGoal(Base):
    __tablename__ = "iron_goals"

    id = Column(Integer, primary_key=True, index=True)
    daily_target_mg = Column(Float)

    user_id = Column(Integer, ForeignKey("user.id"))
    user = relationship("User", back_populates="iron_goal")
