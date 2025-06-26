from fastcrud import FastCRUD

from ..models.project import Project
from ..schemas.project import ProjectCreateInternal, ProjectDeleteInternal, ProjectUpdateInternal, ProjectReadInternal

CRUDProject = FastCRUD[Project,  
    ProjectCreateInternal,
    ProjectUpdateInternal,
    ProjectUpdateInternal,
    ProjectDeleteInternal,
    ProjectReadInternal]
crud_projects = CRUDProject(Project)
