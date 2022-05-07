// Copyright 2021 the oak authors. All rights reserved. MIT license.
import { compressGzip } from "../deps.ts";
import { compress } from "./compress.ts";
import { CompressOptions } from "./types.ts";

/** A middleware that will compress with brotli.
 *
 * ```ts
 * import { gzip } from "https://deno.land/x/oak_compress/mod.ts";
 * import { Application } from "https://deno.land/x/oak/mod.ts"
 *
 * const app = new Application();
 * app.use(gzip());
 *
 * // other middleware
 *
 * await app.listen(":80");
 * ```
 */
export function gzip(
  level = 5,
  options?:
    | boolean
    | CompressOptions,
) {
  return compress(
    (u8: Uint8Array) => {
      return compressGzip(u8, level);
    },
    "gzip",
    options,
  );
}
