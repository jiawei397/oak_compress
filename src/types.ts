// deno-lint-ignore-file no-explicit-any

export type BRMethods = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Interface describing BR options that can be set.
 * @publicApi
 */
export interface BROptions {
  /**
   * Configures the methods will encode with br.
   */
  methods?: BRMethods[];

  /**
   * If content length is less than minSize (byte), then will not br.
   */
  minSize?: number;

  /**
   * If content length is larget than maxSize (byte), then will not br.
   */
  maxSize?: number;
}

export interface Context {
  request: Request;
  response: Response;
}

export interface Request {
  headers: Headers;
  [x: string]: any;
}

export interface Response {
  headers: Headers;
  [x: string]: any;
}

export type Middleware = (
  ctx: Context,
  next: () => Promise<unknown>,
) => Promise<unknown>;
