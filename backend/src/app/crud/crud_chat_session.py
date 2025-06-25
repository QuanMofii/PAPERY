from fastcrud import FastCRUD

from ..models.chat_session import ChatSession
from ..schemas.chat_session import ChatSessionCreateInternal, ChatSessionUpdate, ChatSessionUpdateInternal, ChatSessionDeleteInternal,ChatSessionReadInternal

CRUDChatSession = FastCRUD[ChatSession, 
    ChatSessionCreateInternal,
    ChatSessionUpdate,
    ChatSessionUpdateInternal,
    ChatSessionDeleteInternal,
    ChatSessionReadInternal]          
crud_chatSessions = CRUDChatSession(ChatSession)
