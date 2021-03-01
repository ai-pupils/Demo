import {
  login,
  logout,
  getUserInfo,
  getMessage,
  getContentByMsgId,
  hasRead,
  removeReaded,
  restoreTrash,
  getUnreadCount
} from '@/api/user';
import { setToken, getToken } from '@/libs/util';
import { Module } from 'vuex';

export interface UserStoreState {
  userName: string;
  userId: string;
  avatorImgPath: string;
  token: any;
  access: any;
  hasGetInfo: boolean;
  unreadCount: number;
  messageUnreadList: any[];
  messageReadedList: any[];
  messageTrashList: any[];
  messageContentStore: any;
}

const UserStoreModule: Module<UserStoreState, any> = {
  namespaced: true,
  state: {
    userName: '',
    userId: '',
    avatorImgPath: '',
    token: getToken(),
    access: '',
    hasGetInfo: false,
    unreadCount: 0,
    messageUnreadList: [],
    messageReadedList: [],
    messageTrashList: [],
    messageContentStore: {}
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setAccess(state, access) {
      state.access = access;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    setMessageCount(state, count) {
      state.unreadCount = count;
    },
    setMessageUnreadList(state, list) {
      state.messageUnreadList = list;
    },
    setMessageReadedList(state, list) {
      state.messageReadedList = list;
    },
    setMessageTrashList(state, list) {
      state.messageTrashList = list;
    },
    updateMessageContentStore(state, { msg_id, content }) {
      state.messageContentStore[msg_id] = content;
    },
    moveMsg(state: any, { from, to, msg_id }) {
      const index = state[from].findIndex((_: any) => _.msg_id === msg_id);
      const msgItem = state[from].splice(index, 1)[0];
      msgItem.loading = false;
      state[to].unshift(msgItem);
    }
  },
  getters: {
    messageUnreadCount: state => state.messageUnreadList.length,
    messageReadedCount: state => state.messageReadedList.length,
    messageTrashCount: state => state.messageTrashList.length
  },
  actions: {
    // 登录
    handleLogin({ commit }, { userName, password }) {
      userName = userName.trim();
      return new Promise((resolve, reject) => {
        login({
          userName,
          password
        })
          .toPromise()
          .then(res => {
            if (res.status !== 0) {
              return reject(res);
            }
            const data: any = res.data;
            commit('setToken', 'token');
            resolve();
          })
          .catch((err: any) => {
            reject(err);
          });
      });
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .toPromise()
          .then((res: any) => {
            commit('setToken', '');
            commit('setAccess', []);
            resolve(res);
          })
          .catch((err: any) => {
            reject(err);
          });
        // 如果你的退出登录无需请求接口，则可以直接使用下面三行代码而无需使用logout调用接口
        // commit('setToken', '')
        // commit('setAccess', [])
        // resolve()
      });
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getUserInfo(state.token)
            .toPromise()
            .then((res: any) => {
              const data = res.data;
              commit('setAvator', data.avator);
              commit('setUserName', data.name);
              commit('setUserId', data.user_id);
              commit('setAccess', data.access);
              commit('setHasGetInfo', true);
              resolve(data);
            })
            .catch((err: any) => {
              reject(err);
            });
        } catch (error) {
          reject(error);
        }
      });
    },
    // 此方法用来获取未读消息条数，接口只返回数值，不返回消息列表
    getUnreadMessageCount({ state, commit }) {
      getUnreadCount()
        .toPromise()
        .then((res: any) => {
          const { data } = res;
          commit('setMessageCount', data);
        });
    },
    // 获取消息列表，其中包含未读、已读、回收站三个列表
    getMessageList({ state, commit }) {
      return new Promise((resolve, reject) => {
        getMessage()
          .toPromise()
          .then((res: any) => {
            const { unread, readed, trash } = res.data;
            commit(
              'setMessageUnreadList',
              unread.sort((a: any, b: any) => {
                const l: any = new Date(b.create_time);
                const r: any = new Date(a.create_time);
                return l - r;
              })
            );
            commit(
              'setMessageReadedList',
              readed
                .map((_: any) => {
                  _.loading = false;
                  return _;
                })
                .sort((a: any, b: any) => {
                  const l: any = new Date(b.create_time);
                  const r: any = new Date(a.create_time);
                  return l - r;
                })
            );
            commit(
              'setMessageTrashList',
              trash
                .map((_: any) => {
                  _.loading = false;
                  return _;
                })
                .sort((a: any, b: any) => {
                  const l: any = new Date(b.create_time);
                  const r: any = new Date(a.create_time);
                  return l - r;
                })
            );
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },
    // 根据当前点击的消息的id获取内容
    getContentByMsgId({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        let contentItem = state.messageContentStore[msg_id];
        if (contentItem) {
          resolve(contentItem);
        } else {
          getContentByMsgId(msg_id)
            .toPromise()
            .then((res: any) => {
              const content = res.data;
              commit('updateMessageContentStore', { msg_id, content });
              resolve(content);
            });
        }
      });
    },
    // 把一个未读消息标记为已读
    hasRead({ state, commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        hasRead(msg_id)
          .toPromise()
          .then(() => {
            commit('moveMsg', {
              from: 'messageUnreadList',
              to: 'messageReadedList',
              msg_id
            });
            commit('setMessageCount', state.unreadCount - 1);
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },
    // 删除一个已读消息到回收站
    removeReaded({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        removeReaded(msg_id)
          .toPromise()
          .then(() => {
            commit('moveMsg', {
              from: 'messageReadedList',
              to: 'messageTrashList',
              msg_id
            });
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    },
    // 还原一个已删除消息到已读消息
    restoreTrash({ commit }, { msg_id }) {
      return new Promise((resolve, reject) => {
        restoreTrash(msg_id)
          .toPromise()
          .then(() => {
            commit('moveMsg', {
              from: 'messageTrashList',
              to: 'messageReadedList',
              msg_id
            });
            resolve();
          })
          .catch((error: any) => {
            reject(error);
          });
      });
    }
  }
};

export default UserStoreModule;
