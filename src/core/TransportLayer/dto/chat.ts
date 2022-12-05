import { type ChatDialogDto } from 'storage/chat/types/chat-dialog.dto';
import { type ChatMessageDto } from 'storage/chat/types/chat-message.dto';
import { ResponseWithPagination } from '../types';

export type ChatDialogsResponse = ChatDialogDto[];
export type ChatMessagesResponse = ResponseWithPagination<ChatMessageDto[]>;
