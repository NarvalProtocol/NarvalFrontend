import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals", 
    "next/typescript",
    "prettier"
  ),
  {
    rules: {
      // 关闭默认导出偏好
      'import/prefer-default-export': 'off',
      // 禁止默认导出，但有例外
      'import/no-default-export': ['error', {
        allow: [
          '.*page.tsx$', // Next.js页面组件
          'src/app/layout.tsx', // Next.js布局
          'src/app/not-found.tsx', // Next.js 404页面
          'src/app/error.tsx', // Next.js错误页面
          'next.config.(js|ts|mjs)', // Next.js配置文件
          'postcss.config.(js|ts|mjs)', // PostCSS配置
          'tailwind.config.(js|ts|mjs)', // Tailwind配置
          'eslint.config.mjs', // ESLint配置
        ]
      }]
    }
  }
];

export default eslintConfig;
