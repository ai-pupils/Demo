import http from '@http';
import { DataResponse } from '@/interface';
import { of } from 'rxjs';

export interface LoginParams {
  userName: string;
  password: string;
}
export function login(data: LoginParams) {
  return http.request<DataResponse>({
    url: '/passport/login.fl',
    method: 'post',
    data: { account: data.userName, password: data.password },
    paramType: 'form'
  } as any);
}

export function logout() {
  return http.request<DataResponse>({
    // url: '/passport/logout.fl',
    url: '/passport/saml_logout?slo',
    method: 'get'
  });
}

export function getProfile() {
  return http.request<DataResponse>({
    url: '/passport/get_person_info.fl',
    method: 'post'
  });
}

export function getUserInfo(token: any) {
  return of({
    data: {
      avator: '',
      name: '',
      user_id: '',
      access: 'admin'
    }
  });
}

export function getMessage() {
  return of({ data: {} });
}

export function getContentByMsgId(id: any) {
  return of({ data: {} });
}

export function hasRead(id: any) {
  return of({ data: {} });
}

export function removeReaded(id: any) {
  return of({ data: {} });
}

export function restoreTrash(id: any) {
  return of({ data: {} });
}

export function getUnreadCount() {
  return of({ data: {} });
}
