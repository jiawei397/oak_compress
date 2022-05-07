// Copyright 2021 the oak authors. All rights reserved. MIT license.
import { compressDeflate } from "../deps.ts";
import { compress } from "./compress.ts";
import { CompressOptions } from "./types.ts";

/** A middleware that will compress with brotli.
 *
 * ```ts
 * import { deflate } from "https://deno.land/x/oak_compress/mod.ts";
 * import { Application } from "https://deno.land/x/oak/mod.ts"
 *
 * const app = new Application();
 * app.use(deflate());
 *
 * // other middleware
 *
 * await app.listen(":80");
 * ```
 */
export function deflate(
  level?: number,
  options?:
    | boolean
    | CompressOptions,
) {
  return compress(
    (u8: Uint8Array) => {
      return compressDeflate(u8, level);
    },
    "deflate",
    options,
  );
}
