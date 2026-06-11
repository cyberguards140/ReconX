from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    client = Column(String, nullable=True)
    target_scope = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    targets = relationship("Target", back_populates="project", cascade="all, delete-orphan")
    scans = relationship("Scan", back_populates="project", cascade="all, delete-orphan")

class Target(Base):
    __tablename__ = "targets"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    value = Column(String, nullable=False)
    target_type = Column(String, nullable=False) # ip, domain, url

    project = relationship("Project", back_populates="targets")

class Scan(Base):
    __tablename__ = "scans"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    cluster = Column(String, nullable=False)
    tool = Column(String, nullable=False)
    command = Column(String, nullable=False)
    status = Column(String, default="pending") # pending, running, completed, failed
    started_at = Column(DateTime(timezone=True), nullable=True)
    finished_at = Column(DateTime(timezone=True), nullable=True)

    project = relationship("Project", back_populates="scans")
    result = relationship("Result", back_populates="scan", uselist=False, cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")

class Result(Base):
    __tablename__ = "results"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"), unique=True)
    raw_output = Column(Text, nullable=True)
    parsed_json = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="result")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    scan_id = Column(Integer, ForeignKey("scans.id"))
    title = Column(String, nullable=False)
    severity = Column(String, nullable=False) # Critical, High, Medium, Low, Info
    description = Column(Text, nullable=True)
    evidence = Column(Text, nullable=True)

    scan = relationship("Scan", back_populates="findings")

class Workflow(Base):
    __tablename__ = "workflows"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    steps_json = Column(Text, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
