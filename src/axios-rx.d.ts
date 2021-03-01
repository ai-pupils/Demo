import { AxiosRequestConfig } from 'axios';
import { Observable } from 'rxjs';

declare module 'axios-rx' {
  interface RxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Observable<T>;
  }
}
