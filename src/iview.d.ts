import { Notice, Select, ModalInstance, Message } from 'iview';

declare module 'iview/types/notice' {
  export const Notice: Notice;
}

declare module 'iview/types/select' {
  export const Select: Select;
}

declare module 'iview/types/modal' {
  export const Modal: ModalInstance;
}

declare module 'iview/types/message' {
  export const Message: Message;
}
