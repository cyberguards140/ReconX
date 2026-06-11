from pydantic import BaseModel
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
    client: str | None = None
    target_scope: str | None = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase, OrmBase):
    id: int
    created_at: datetime
    targets: list[Target] = []

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
    started_at: datetime | None = None
    finished_at: datetime | None = None

# Finding
class FindingBase(BaseModel):
    title: str
    severity: str
    description: str | None = None
    evidence: str | None = None

class FindingCreate(FindingBase):
    pass

class Finding(FindingBase, OrmBase):
    id: int
    scan_id: int

# Result
class ResultBase(BaseModel):
    raw_output: str | None = None
    parsed_json: str | None = None

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
    tools: list[ToolCommand]

class WorkflowStep(BaseModel):
    cluster_name: str
    tools: list[ToolCommand]

class WorkflowRunRequest(BaseModel):
    target: str
    project_id: int = 1
    steps: list[WorkflowStep]
