export type TUser = {
  id: number;
  first_name: string;
  second_name: string;
  display_name: string | null;
  login: string;
  email: string;
  phone: string;
  avatar?: string;
  role?: string;
};

export type TLastMessageUser = {
  first_name: string;
  second_name: string;
  avatar: string;
  display_name: string;
  login: string;
};

export type TChatLastMessage = {
  id: number;
  user: TLastMessageUser;
  time: string;
  content: string;
};

export type TChat = {
  id?: number;
  title?: string;
  avatar?: string;
  unread_count?: number;
  created_by?: number;
  last_message?: TChatLastMessage;
};

export type TMessage = {
  id: number;
  time: string;
  user_id: number;
  content: string;
  type: "message" | "file";
  file?: {
    id: number;
    user_id: number;
    path: string;
    filename: string;
    content_type: string;
    content_size: number;
    upload_date: string;
  };
};

// export type TWSLastMessage = {
//   chat_id: number;
//   time: string;
//   type: string;
//   user_id: string;
//   content: string;
//   file?: {
//     id: number;
//     user_id: number;
//     path: string;
//     filename: string;
//     content_type: string;
//     content_size: number;
//     upload_date: string;
//   }
// };

// export type TSendedMessage = {
//   id: string;
//   time: string;
//   user_id: string;
//   content: string;
//   type: "message" | "file";
// };

export type TAppState = {
  user?: TUser | null;
  chats?: TChat[];
  currentChatId?: number | null;
  lastMessages?: TMessage[];
};

export enum EStoreEvents {
  Updated = "updated",
}
