// Copyright 2021 the oak authors. All rights reserved. MIT license.
import { compressBrotli } from "../deps.ts";
import { compress } from "./compress.ts";
import { CompressOptions } from "./types.ts";

/** A middleware that will compress with brotli.
 *
 * ```ts
 * import { brotli } from "https://deno.land/x/oak_compress/mod.ts";
 * import { Application } from "https://deno.land/x/oak/mod.ts"
 *
 * const app = new Application();
 * app.use(brotli());
 *
 * // other middleware
 *
 * await app.listen(":80");
 * ```
 */
export function brotli(options?: boolean | CompressOptions) {
  return compress(compressBrotli, "br", options);
}
