# oak_compress

[![Deno](https://github.com/jiawei397/oak_cors/actions/workflows/deno.yml/badge.svg)](https://github.com/jiawei397/oak_cors/actions/workflows/deno.yml)

A simple and opinionated `brotli` and `gzip` compress middleware for Deno
[oak](https://deno.land/x/oak).

## Example

```typescript
import { gzip } from "./mod.ts";
import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";

const app = new Application();
app.use(gzip());

// other middleware

app.use((ctx) => {
  const str = new Array(100000).fill("Hello World").join("\n");
  ctx.response.body = str;
});

console.log("app started with: http://localhost");
await app.listen(":80");
```
