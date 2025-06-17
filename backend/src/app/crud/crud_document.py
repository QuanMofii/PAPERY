from fastcrud import FastCRUD

from ..models.document import Document
from ..schemas.document import DocumentCreateInternal, DocumentUpdate, DocumentUpdateInternal, DocumentDelete

CRUDDocument = FastCRUD[Document, DocumentCreateInternal, DocumentUpdate, DocumentUpdateInternal, DocumentDelete, None]
crud_Documents = CRUDDocument(Document)
