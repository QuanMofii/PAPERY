from fastcrud import FastCRUD

from ..models.document import Document
from ..schemas.document import DocumentCreateInternal, DocumentUpdateInternal, DocumentDeleteInternal, DocumentReadInternal

CRUDDocument = FastCRUD[Document, 
    DocumentCreateInternal,
    DocumentUpdateInternal,
    DocumentUpdateInternal,
    DocumentDeleteInternal,
    DocumentReadInternal]
    
crud_documents = CRUDDocument(Document)
