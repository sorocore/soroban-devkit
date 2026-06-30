export type Result<T> = {
  ok: true;
  value: T;
} | {
  ok: false;
  error: Error;
};

export interface Logger {
  info(...args: unknown[]): void;
  warn(...args: unknown[]): void;
  error(...args: unknown[]): void;
}
