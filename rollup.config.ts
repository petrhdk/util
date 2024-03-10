import type { RollupOptions } from "rollup";
import typescript from "rollup-plugin-typescript";
import dts from "rollup-plugin-dts";

const entries = [
  'core/index',
  'dom/index',
  'vue/index',
];

const external = [
  'vue',
];

const configs: RollupOptions[] = [];

for (const entry of entries) {
  configs.push({
    input: `src/${entry}.ts`,
    output: [
      {
        file: `dist/${entry}.mjs`,
        format: "es",
      },
      {
        file: `dist/${entry}.cjs`,
        format: "cjs",
      },
    ],
    plugins: [typescript()],
    external,
  });
}


export default configs;
