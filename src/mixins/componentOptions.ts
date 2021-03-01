import Component from 'vue-class-component';
import { Vue } from 'vue-property-decorator';
import { MonoTypeOperatorFunction, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { MetaType } from '@/interface';
import { createEmptyTrackMeta } from '@/utils/misc';

@Component({})
export default class ComponentOptionsMixin<T = any> extends Vue {
  public state: MetaType<T> = createEmptyTrackMeta();
  public dataTotal: number = 0;

  public get isFetching(): boolean {
    return this.state.isFetching;
  }

  public get isFulfill(): boolean {
    return this.state.isFulfill;
  }

  public get isError(): boolean {
    return this.state.isError;
  }

  public get error(): any {
    return this.state.error;
  }

  public get statePayload(): T | null | undefined {
    return this.state.payload;
  }

  public get stateData() {
    if (this.isFulfill) {
      return (this.statePayload as any).data;
    }
    return {}
  }

  public startFetch$(): Observable<boolean> {
    return of(true).pipe(
      tap(() => {
        this.state.isFetching = true;
      })
    );
  }

  public endFetch() {
    this.state.isFetching = false;
  }

  public startFetchOperator<T = any>(): MonoTypeOperatorFunction<T> {
    return (source: Observable<T>) =>
      source.pipe(tap(() => (this.state.isFetching = true)));
  }
}
