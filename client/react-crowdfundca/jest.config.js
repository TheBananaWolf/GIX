module.exports = {
    preset: 'ts-jest', // 使用 ts-jest 预设，以支持 TypeScript
    testEnvironment: 'jsdom', // 使用 jsdom 测试环境，模拟浏览器环境
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'], // 指定测试环境设置文件
    moduleNameMapper: {
      // 如果你在项目中使用了路径别名，这里可以添加相应的映射
      // 例如："^@components/(.*)$": "<rootDir>/src/components/$1"
    },
    // 你可以根据需要添加更多的配置项
  };
  