# oak_compress

[![Deno](https://github.com/jiawei397/oak_compress/actions/workflows/deno.yml/badge.svg)](https://github.com/jiawei397/oak_compress/actions/workflows/deno.yml)

A simple and opinionated `deflate`、`brotli` and `gzip` compress middleware for
Deno [oak](https://deno.land/x/oak).

## Example

```typescript
import {
  brotli,
  deflate,
  gzip,
} from "https://deno.land/x/oak_compress@v0.0.1/mod.ts";
import { Application } from "https://deno.land/x/oak@v10.5.0/mod.ts";

const app = new Application();
app.use(brotli());
// app.use(gzip());
// app.use(deflate());

// other middleware

app.use((ctx) => {
  const str = new Array(100000).fill("Hello World").join("\n");
  ctx.response.body = str;
});

console.log("app started with: http://localhost");
await app.listen(":80");
```
