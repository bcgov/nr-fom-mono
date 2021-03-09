class MockLogger {
  trace(...args: any) {
    // console.log(args);
  }
  debug(...args: any) {
    // console.log(args);
  }
  info(...args: any) {
    // console.log(args);
  }
  warn(...args: any) {
    // console.log(args);
  }
  error(...args: any) {
    // console.log(args);
  }
  fatal(...args: any) {}
  setContext(...args: any) {
    // console.log(args);
  }
  private(...args: any) {
    // console.log(args);
  }
}

export function mockLoggerFactory() {
  return new MockLogger();
}
