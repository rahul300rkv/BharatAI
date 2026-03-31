const pkg = require("./package.json");
const resolve = require("@rollup/plugin-node-resolve");
const commonjs = require("@rollup/plugin-commonjs");
const typescript = require("@rollup/plugin-typescript");

const nodeBuiltinsRE = /^node:.*/;

module.exports = {
	input: "src/pptxgen.ts",
	output: [
		{ file: "./dist/pptxgen.js", format: "iife", name: "PptxGenJS", globals: { jszip: "JSZip" }, sourcemap: false },
		{ file: "./dist/pptxgen.cjs.js", format: "cjs", exports: "default", sourcemap: false },
		{ file: "./dist/pptxgen.es.js", format: "es", sourcemap: false },
	],
	external: [
		nodeBuiltinsRE,
		...Object.keys(pkg.dependencies || {}),
		...Object.keys(pkg.peerDependencies || {}),
	],
	plugins: [
		resolve({ preferBuiltins: true }),
		commonjs(),
		typescript({
			tsconfig: "./tsconfig.json",
			outDir: "./dist",
			declaration: false,
			declarationDir: null,
			sourceMap: false,
		}),
	],
};
