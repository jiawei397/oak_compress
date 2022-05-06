// Copyright 2021 the oak authors. All rights reserved. MIT license.
import { compress } from "../deps.ts";
import { BRFunc, BROptions, Context, Middleware } from "./types.ts";

/** A middleware that will deal with cors headers.
 *
 * ```ts
 * import { BR } from "https://deno.land/x/oak_br/mod.ts";
 * import { Application } from "https://deno.land/x/oak/mod.ts"
 *
 * const app = new Application();
 * app.use(BR());
 *
 * // other middleware
 *
 * await app.listen(":80");
 * ```
 */
export function BR(options?: boolean | BRFunc | BROptions) {
  const defaultOptions: BROptions = {
    methods: ["GET"],
    minSize: 1024 * 10, // 10KB
    maxSize: undefined,
  };
  const finalOptions = defaultOptions;
  if (
    options && typeof options !== "boolean" && typeof options !== "function"
  ) {
    Object.assign(finalOptions, options);
  }

  const middleware: Middleware = async function (
    ctx: Context,
    next: () => Promise<unknown>,
  ) {
    if (options === false) { // not need br
      return next();
    }
    const encodings = ctx.request.headers.get("Accept-Encoding");
    if (!encodings) {
      // console.debug("no encoding");
      return next();
    }
    const tempArr = encodings.split(", ");
    if (!tempArr.includes("br")) {
      // console.debug("no br encoding");
      return next();
    }
    const methods = finalOptions.methods!;
    if (!methods.includes(ctx.request.method)) {
      // console.debug(`method ${ctx.request.method} is not allowed`);
      return next();
    }
    await next();

    const brCallback = typeof options === "function" ? options : undefined;
    const body = ctx.response.body;
    if (brCallback) {
      if (!await brCallback(ctx)) {
        // console.debug(`callback not pass`);
        return;
      }
    } else {
      if (!body) {
        // console.debug(`response body is empty`);
        return;
      }
      const minSize = finalOptions.minSize!;
      const maxSize = finalOptions.maxSize;
      if (body.length < minSize || (maxSize && body.length > maxSize)) {
        // console.debug(`response body size ${body.length} is not allowed`);
        return;
      }
    }
    const u8 = new TextEncoder().encode(body);
    ctx.response.body = compress(u8);
    ctx.response.headers.set("Content-Encoding", "br");
    // ctx.response.headers.set("content-type", "text/plain;charset=UTF-8");
  };
  return middleware;
}
