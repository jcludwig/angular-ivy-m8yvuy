import { OnChanges, SimpleChange, OnDestroy, SimpleChanges, EventEmitter } from '@angular/core';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { map, filter, takeUntil } from 'rxjs/operators';

interface TypedSimpleChange<T> extends SimpleChange {
  currentValue: T;
  previousValue: T;
}

interface EmittedEvent<T> {
  name: string;
  data: T;
}

type TypedSimpleChanges<T> = Partial<{
  readonly [P in keyof T]: TypedSimpleChange<T[P]>;
}> & SimpleChanges;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends () => void ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

export abstract class RxComponent<TBindings, TEmitters = []> implements OnChanges, OnDestroy {
  private readonly ngOnChanges$ = new ReplaySubject<TypedSimpleChanges<TBindings>>(1);
  private readonly emit$ = new ReplaySubject<EmittedEvent<any>>(1);
  private readonly ngOnDestroy$ = new ReplaySubject<boolean>(1);
  /** Automatically disposes subscriptions when component destroyed */
  public readonly lifecycleSubscriptions = new Subscription();

   /** Observable that completes when component destroyed */
  public get onDestroy$(): Observable<boolean> {
    return this.ngOnDestroy$.asObservable();
  }

  /** Observable that notifies changes and completes when component destroyed */
  public get onChanges$(): Observable<TypedSimpleChanges<TBindings>> {
    return this.ngOnChanges$.pipe(
      takeUntil(this.ngOnDestroy$)
    );
  }

  public ngOnChanges(changes: TypedSimpleChanges<TBindings>): void {
    this.ngOnChanges$.next(changes);
  }

  public ngOnDestroy(): void {
    this.lifecycleSubscriptions.unsubscribe();
    this.ngOnDestroy$.next(true);
    this.ngOnDestroy$.complete();
  }

  /** Expose an observable for listening to component property changes */
  public changes$<K extends keyof NonFunctionProperties<TBindings>>(input: K): Observable<TBindings[K]> {
    return this.ngOnChanges$.pipe(
      filter((changes: TypedSimpleChanges<TBindings>) => !!changes[input]),
      map((changes: TypedSimpleChanges<TBindings>) => changes[input].currentValue),
      takeUntil(this.ngOnDestroy$)
    );
  }

  public onEmit$<T>(name: string): Observable<EmittedEvent<T>> {
    return this.emit$.pipe(
      filter((event: EmittedEvent<any>): event is EmittedEvent<T> => event.name === name),
      takeUntil(this.ngOnDestroy$)
    );
  }

  public collectEmit<T>(name: string, data: T): void {
    this.emit$.next({
      name,
      data,
    });
  }
}