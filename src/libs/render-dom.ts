import { CreateElement, FunctionalComponentOptions } from 'vue';

export default {
  name: 'RenderDom',
  functional: true,
  props: {
    render: Function
  },
  render: (h: CreateElement, ctx) => {
    return ctx.props.render(h);
  }
} as FunctionalComponentOptions;
