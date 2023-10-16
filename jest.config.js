/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	rootDir: "./",
	roots: [
		"<rootDir>/packages/utils/src",
		"<rootDir>/packages/backend/src",
		"<rootDir>/packages/frontend/src",
	],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
	},
	collectCoverageFrom: [

		"<rootDir>/packages/**/src/**/*.ts*",
		"!<rootDir>/packages/**/src/**/index.ts*",
	],
	coverageDirectory: "<rootDir>/coverage",
	testPathIgnorePatterns: ["<rootDi>/node_modules", "<rootDir>/packages/**/dist"],
	moduleFileExtensions: ["ts", "js", "tsx"],
	coverageReporters: ["json", "lcov", "html"],
	projects: [
		{
			displayName: "backend",
			testEnvironment: "node",
			transform: {
				"^.+\\.ts$": "ts-jest",
			},
			testMatch: [
				"<rootDir>/packages/backend/src/**/*.test.ts"
			]
		},
		{
			displayName: "utils",
			testEnvironment: "node",
			transform: {
				"^.+\\.ts$": "ts-jest",
			},
			testMatch: [
				"<rootDir>/packages/utils/src/**/*.test.ts"
			]
		},
		{
			displayName: "frontend",
			testEnvironment: "jsdom",
			transform: {
				"^.+\\.(ts|tsx)$": "ts-jest",
			},
			testMatch: [
				"<rootDir>/packages/frontend/src/**/*.test.ts*"
			],
			setupFilesAfterEnv: ["<rootDir>/packages/frontend/jest.setup.ts"],
		},
	],
	testMatch: [
		"**/*.+(ts|tsx)",
		"**/?(*.)+(spec|test).+(ts|tsx)",
	],
};
