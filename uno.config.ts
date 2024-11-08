import {
  defineConfig,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss';
import {
  presetApplet,
  transformerAttributify,
} from 'unocss-applet';
import { PrimaryColor } from './src/config/color.config';

const remRE = /(-?[.\d]+)rem/g;

export default defineConfig({
  presets: [
    presetApplet(),
  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-col': 'flex flex-col',
    'flex-center': 'flex justify-center items-center',
    'flex-col-center': 'flex flex-col justify-center items-center',
    's-text-color': 'text-[#323233]', // text-color
    's-bg-color': 'bg-[#F9F9F8]', // bg-color
    'primary-color': `text-[${PrimaryColor}]`, // 主题色
    'primary-btn': `bg-[${PrimaryColor}]`,

  },
  transformers: [
    transformerDirectives(), // 启用 @apply 功能
    transformerVariantGroup(), // 启用 () 分组功能
    transformerAttributify({ ignoreAttributes: ['block'] }),
  ],
  rules: [
    [
      'p-safe',
      {
        padding: 'env(safe-area-inset-top) env(safe-area-inset-right) env(safe-area-inset-bottom) env(safe-area-inset-left)',
      },
    ],
    ['pt-safe', { 'padding-top': 'env(safe-area-inset-top)' }],
    ['pb-safe', { 'padding-bottom': 'env(safe-area-inset-bottom)' }],
  ],
  postprocess: (utils) => {
    utils.entries.forEach((i) => {
      const value = i[1];
      if (typeof value === 'string' && remRE.test(value)) {
        i[1] = value.replace(remRE, (_, p1) => `${p1 * 4}rpx`);
      }
    });
  },
});
