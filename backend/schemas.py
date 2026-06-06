from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

# Common
class OrmBase(BaseModel):
    class Config:
        from_attributes = True

# Target
class TargetBase(BaseModel):
    value: str
    target_type: str

class TargetCreate(TargetBase):
    pass

class Target(TargetBase, OrmBase):
    id: int
    project_id: int

# Project
class ProjectBase(BaseModel):
    name: str
    client: Optional[str] = None
    target_scope: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase, OrmBase):
    id: int
    created_at: datetime
    targets: List[Target] = []

# Scan
class ScanBase(BaseModel):
    cluster: str
    tool: str
    command: str

class ScanCreate(ScanBase):
    pass

class Scan(ScanBase, OrmBase):
    id: int
    project_id: int
    status: str
    started_at: Optional[datetime] = None
    finished_at: Optional[datetime] = None

# Finding
class FindingBase(BaseModel):
    title: str
    severity: str
    description: Optional[str] = None
    evidence: Optional[str] = None

class FindingCreate(FindingBase):
    pass

class Finding(FindingBase, OrmBase):
    id: int
    scan_id: int

# Result
class ResultBase(BaseModel):
    raw_output: Optional[str] = None
    parsed_json: Optional[str] = None

class ResultCreate(ResultBase):
    pass

class Result(ResultBase, OrmBase):
    id: int
    scan_id: int

# Workflow
class WorkflowBase(BaseModel):
    name: str
    steps_json: str

class WorkflowCreate(WorkflowBase):
    pass

class Workflow(WorkflowBase, OrmBase):
    id: int
    created_at: datetime

# Execution
class ToolCommand(BaseModel):
    name: str
    cmd: str

class ClusterRunRequest(BaseModel):
    cluster_name: str
    target: str
    project_id: int = 1
    tools: List[ToolCommand]

class WorkflowStep(BaseModel):
    cluster_name: str
    tools: List[ToolCommand]

class WorkflowRunRequest(BaseModel):
    target: str
    project_id: int = 1
    steps: List[WorkflowStep]
