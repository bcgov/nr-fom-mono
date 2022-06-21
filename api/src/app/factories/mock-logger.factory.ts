import { PinoLogger } from "nestjs-pino";

class MockLogger extends PinoLogger {
  constructor() {
    super({});
  }
  trace(...args: any) {
    // Do nothing
  }
  debug(...args: any) {
    // Do nothing
  }
  info(...args: any) {
    // Do nothing
  }
  warn(...args: any) {
    // Do nothing
  }
  error(...args: any) {
    // Do nothing
  }
  fatal(...args: any) {
    // Do nothing
  }
  setContext(...args: any) {
    // Do nothing
  }
  private(...args: any) {
    // Do nothing
  }
}

export function mockLoggerFactory() {
  return new MockLogger();
}
