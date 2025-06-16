from fastcrud import FastCRUD

from ..models.project import Project
from ..schemas.project import ProjectCreateInternal, ProjectDelete, ProjectUpdate, ProjectUpdateInternal

CRUDProject = FastCRUD[Project, ProjectCreateInternal, ProjectUpdate, ProjectUpdateInternal, ProjectDelete, None]
crud_projects = CRUDProject(Project)
