// export default {
//   testEnvironment: "jsdom",
//   transform: {
//     "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
//   },
//   moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
//   setupFilesAfterEnv: ["@testing-library/jest-dom"],
// }
//
module.exports = {
  testEnvironment: "jsdom",
  verbose: true,
  transform: {
    "^.+\\.(ts|tsx)$": ["ts-jest", { tsconfig: "tsconfig.json" }],
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
