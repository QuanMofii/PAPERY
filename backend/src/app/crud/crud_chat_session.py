from fastcrud import FastCRUD

from ..models.chat_session import ChatSession
from ..schemas.chat_session import ChatSessionCreateInternal, ChatSessionUpdate, ChatSessionUpdateInternal, ChatSessionDelete

CRUDChatSession = FastCRUD[ChatSession, ChatSessionCreateInternal, ChatSessionUpdate, ChatSessionUpdateInternal, ChatSessionDelete, None]
crud_ChatSessions = CRUDChatSession(ChatSession)
