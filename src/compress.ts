// Copyright 2021 the oak authors. All rights reserved. MIT license.
import {
  CompressImpl,
  CompressOptions,
  CompressType,
  Context,
  Middleware,
} from "./types.ts";

export function compress(
  compress: CompressImpl,
  type: CompressType,
  options?: boolean | CompressOptions,
) {
  const defaultOptions: CompressOptions = {
    methods: ["GET"],
    minSize: 1024 * 10, // 10KB
    maxSize: undefined,
  };
  const finalOptions = defaultOptions;
  if (options && typeof options !== "boolean") {
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
    if (!tempArr.includes(type)) {
      // console.debug(`no ${finalOptions.type} encoding`);
      return next();
    }
    const methods = finalOptions.methods!;
    if (!methods.includes(ctx.request.method)) {
      // console.debug(`method ${ctx.request.method} is not allowed`);
      return next();
    }
    await next();

    if (finalOptions.extensions) {
      const pathname = ctx.request.url.pathname;
      if (!finalOptions.extensions.every((ext) => pathname.endsWith(ext))) {
        console.debug(
          `pathname ${pathname} not ends with extensions ${
            finalOptions.extensions.join(",")
          }`,
        );
        return;
      }
    }

    const body = ctx.response.body;
    let u8: Uint8Array;
    if (!body) {
      // console.debug(`response body is empty`);
      return;
    }
    if (typeof body === "object") {
      if (body instanceof Uint8Array) {
        u8 = body;
      } else {
        u8 = new TextEncoder().encode(JSON.stringify(body));
      }
    } else if (typeof body === "string") {
      u8 = new TextEncoder().encode(body);
    } else {
      console.debug("response body is simple type and not will compress");
      return;
    }

    if (finalOptions.filter) {
      if (!await finalOptions.filter(ctx, u8)) {
        // console.debug(`filter not pass`);
        return;
      }
    } else {
      const minSize = finalOptions.minSize!;
      const maxSize = finalOptions.maxSize;
      const len = u8.byteLength;
      if (len < minSize || (maxSize && len > maxSize)) {
        // console.debug(`response body size ${len} is not allowed`);
        return;
      }
    }
    ctx.response.body = compress(u8);
    ctx.response.headers.set("Content-Encoding", type);
    // ctx.response.headers.set("content-type", "text/plain;charset=UTF-8");
  };
  return middleware;
}
