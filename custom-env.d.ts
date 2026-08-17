declare module 'custom-env' {
  const customEnv: {
    env: (...args: any[]) => any
    dotenvConfig: (...args: any[]) => any
    config: (...args: any[]) => any
  }

  export default customEnv
}