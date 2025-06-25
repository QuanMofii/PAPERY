from fastcrud import FastCRUD

from ..models.chat_message import ChatMessage
from ..schemas.chat_message import ChatMessageCreateInternal, ChatMessageUpdate, ChatMessageUpdateInternal,  ChatMessageDeleteInternal,ChatMessageReadInternal

CRUDChatMessage = FastCRUD[ChatMessage,
    ChatMessageCreateInternal,
    ChatMessageUpdate,
    ChatMessageUpdateInternal,
    ChatMessageDeleteInternal,
    ChatMessageReadInternal]
crud_chatMessages = CRUDChatMessage(ChatMessage)
