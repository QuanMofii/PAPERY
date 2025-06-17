from fastcrud import FastCRUD

from ..models.chat_message import ChatMessage
from ..schemas.chat_message import ChatMessageCreateInternal, ChatMessageUpdate, ChatMessageUpdateInternal, ChatMessageDelete

CRUDChatMessage = FastCRUD[ChatMessage, ChatMessageCreateInternal, ChatMessageUpdate, ChatMessageUpdateInternal, ChatMessageDelete, None]
crud_ChatMessages = CRUDChatMessage(ChatMessage)
