import type { OmitResolvers, PromiseResolvers, PropsAdapter, RenderOptions, ResolveValue } from '@flow-render/shared';
import type { ComponentPublicInstance, VNode, VNodeArrayChildren } from 'vue';

export type RenderArgs<
  T extends object,
  Value = ResolveValue<T>,
  Props extends object = ComponentProps<T>,
  UserProps extends object = OmitResolvers<Props>,
  Adapter extends (...args: any[]) => object = PropsAdapter<Props, Value>,
> =
  Props extends PromiseResolvers<any>
    ? {} extends UserProps
      ? [props?: null | Adapter | UserProps, options?: RenderOptions]
      : [props: Adapter | UserProps, options?: RenderOptions]
    : [props: Adapter, options?: RenderOptions];

type ComponentProps<T> = T extends Record<keyof ComponentPublicInstance, any>
  ? T['$props'] & { children?: RawChildren | T['$slots'] }
  : T & { children?: RawChildren | RawSlots };

// `RawChildren` is copied from Vue unexported types
type RawChildren =
  boolean |
  number |
  string |
  VNode |
  VNodeArrayChildren |
  (() => any);

// `RawSlots` is copied from Vue unexported types
interface RawSlots {
  $stable?: boolean;
  [name: string]: unknown;
}
