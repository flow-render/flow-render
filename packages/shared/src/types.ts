export type ResolveFunction<V> = undefined extends V ? (value?: V) => void : (value: V) => void;
export type ResolveValue<P extends object> = P extends { resolve?: (value: infer V) => void } ? V : unknown;

export type RenderArgs<
  Props extends object,
  Value = ResolveValue<Props>,
  UserProps extends object = OmitResolvers<Props>,
  Adapter extends (...args: any[]) => object = PropsAdapter<Props, Value>,
> =
  Props extends PromiseResolvers<any>
    ? {} extends UserProps
      ? [props?: Adapter | UserProps]
      : [props: Adapter | UserProps]
    : [props: Adapter];

export type PropsAdapter<P extends object, V = ResolveValue<P>> = (resolve: ResolveFunction<V>, reject: (reason?: any) => void) => P;

export type OmitResolvers<P extends object> = Omit<P, keyof PromiseResolvers>;

export interface PromiseResolvers<V = unknown> {
  readonly resolve: ResolveFunction<V>;
  readonly reject: (reason?: any) => void;
}
