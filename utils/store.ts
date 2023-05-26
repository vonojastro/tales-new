import { create } from 'zustand'

interface UserStore {
  name: string;
  setName: (name: string) => void;
}
interface CommentMessageStore {
  commentMessage: string;
  setCommentMessage: ( commentMessage: string) => void;
}
interface MessageStore {
  message: string;
  setMessage: (message: string) => void;
}
interface DropDownStore {
  showDropdown: boolean;
  setShowDropdown: (showDropdown: boolean) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  name: 'asdad',
  setName: (name) => set({ name }),
}));

export const useCommentStore= create<CommentMessageStore>((set) => ({
  commentMessage: '',
  setCommentMessage: (  commentMessage) => set({ commentMessage}),
}));

export const useMessageStore= create<MessageStore>((set) => ({
  message: '',
  setMessage: ( message) => set({ message}),
}));

export const useDropdownStore= create<DropDownStore >((set) => ({
  showDropdown: false,
  setShowDropdown: (showDropdown) => set({ showDropdown}),
}));