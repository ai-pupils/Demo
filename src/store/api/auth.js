// 使用 axios: https://github.com/mzabriskie/axios
// 执行ajax请求
// 优点： 支持promise；支持 progress 事件；支持取消操作

import axios from '@/utils/axios';

const USER_LOGIN = '/passport/login.fl';

export const login = ({user, password}) => axios.post(USER_LOGIN, {account: user, password}, {paramType: 'form'});

const GET_USER_INFO = '/passport/get_person_info.fl';
export const getProfile = () => axios.post(GET_USER_INFO);

export const signout = () => axios.get('/passport/logout.fl');
