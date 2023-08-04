export class EnvAccessorUtils {
  static get(key: string, fallback = ''): string {
    return process.env[key] ?? fallback;
  }
}
