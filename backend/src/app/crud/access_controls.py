from fastcrud import FastCRUD

from ..models.access_control import AccessControl
from ..schemas.access_control import AccessControlCreateInternal, AccessControlDeleteInternal, AccessControlUpdateInternal, AccessControlReadInternal

CRUDAccessControl = FastCRUD[
    AccessControl,
    AccessControlCreateInternal,
    AccessControlUpdateInternal,
    AccessControlUpdateInternal,
    AccessControlDeleteInternal,
    AccessControlReadInternal
]
crud_access_controls = CRUDAccessControl(AccessControl)

