function createElement (
  type: keyof HTMLElementTagNameMap | (() => ReturnType<typeof createElement>),
  config: Record<string, unknown> | null,
  ...children
) {
  return {
    type,
    props: {
      ...config,
      children,
    },
  };
};


export {
  createElement
}
