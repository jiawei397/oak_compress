// deno-lint-ignore-file no-explicit-any

/**
 * Compress a byte array.
 *
 * ```typescript
 * import { compress } from "https://deno.land/x/brotli/mod.ts";
 * const text = new TextEncoder().encode("X".repeat(64));
 * console.log(text.length);                   // 64 Bytes
 * console.log(compress(text).length);         // 10 Bytes
 * ```
 *
 * @param input Input data.
 */
export type CompressImpl = (input: Uint8Array) => Uint8Array;

export type CompressMethods = "GET" | "POST" | "PUT" | "DELETE";

export type CompressFilter = (
  ctx: Context,
  content: Uint8Array,
) => boolean | Promise<boolean>;

export type CompressType = "gzip" | "br" | "deflate";

/**
 * Interface describing compress options that can be set.
 * @publicApi
 */
export interface CompressOptions {
  filter?: CompressFilter;
  /**
   * Configures the methods will encode with br.
   */
  methods?: CompressMethods[];

  /**
   * If content length is less than minSize (byte), then will not br.
   */
  minSize?: number;

  /**
   * If content length is larger than maxSize (byte), then will not br.
   */
  maxSize?: number;

  extensions?: string[];
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
