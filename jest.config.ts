// export default {
  //     testEnvironment: "jsdom", // Use jsdom for React testing
  //     moduleNameMapper: {
    //       "\\.(css|less|scss|sass)$": "identity-obj-proxy", // Mock CSS modules
    //     },
    //   };
    
    export default {
          setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'], // Path to your setup file
      preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
    // process `*.tsx` files with `ts-jest`
  },
  moduleNameMapper: {
    // '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/src/__ mocks __/fileMock.ts',
    '\\.(css|less|sass|scss)$': '<rootDir>/src/__mocks__/styleMock.ts'
  },
};