const esModules = ["@challenge/utils"]
/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: "ts-jest",
	testEnvironment: "jsdom",
	roots: ["<rootDir>/src",],
	testMatch: ["**/*.test.ts*"],
	transform: {
		"^.+\\.(ts|tsx)$": "ts-jest",
		[`(${esModules}).+\\.js$`]: "babel-jest"
	},
	transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
	setupFilesAfterEnv: ['<rootDir>/jest.setup.ts']
};
