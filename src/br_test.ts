import { Context } from "./types.ts";
import { assertEquals, beforeEach, describe, it } from "../test_deps.ts";
import { BR } from "./br.ts";

describe("br", () => {
  let mockContext: Context,
    noBrNext: () => Promise<unknown>,
    brNext: () => Promise<unknown>;
  const brStr = new Array(1000).fill("Hello World").join("\n");
  beforeEach(() => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 200,
        body: "",
      },
      request: {
        method: "GET",
        url: "https://pan.baidu.com",
        headers: {
          get(key: string) {
            if (key.toLowerCase() === "Accept-Encoding".toLowerCase()) {
              return "gzip, deflate, br";
            }
            return "else";
          },
        },
      },
    } as unknown as Context;
    noBrNext = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          mockContext.response.body = "hello world";
          resolve();
        }, 0);
      });
    };
    brNext = () => {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          mockContext.response.body = brStr;
          resolve();
        }, 0);
      });
    };
  });

  it("no params", async () => {
    await BR()(mockContext, noBrNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );

    await BR()(mockContext, brNext);
    console.log(mockContext.response.headers);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      "br",
    );
  });

  it("params is true", async () => {
    await BR(true)(mockContext, noBrNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );

    await BR(true)(mockContext, brNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      "br",
    );
  });

  it("params is false", async () => {
    await BR(false)(mockContext, noBrNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );

    await BR(false)(mockContext, brNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );
  });

  it("br not allowed by browser", async () => {
    mockContext = {
      response: {
        headers: new Headers(),
        status: 200,
        body: "",
      },
      request: {
        method: "GET",
        url: "https://pan.baidu.com",
        headers: {
          get(key: string) {
            if (key.toLowerCase() === "Accept-Encoding".toLowerCase()) {
              return "gzip, deflate";
            }
          },
        },
      },
    } as unknown as Context;

    await BR(true)(mockContext, brNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );
  });

  it("change default maxSize", async () => {
    await BR({
      maxSize: brStr.length - 1,
    })(mockContext, brNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      null,
    );

    await BR({
      maxSize: brStr.length,
    })(mockContext, brNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      "br",
    );
  });

  it("change default minSize", async () => {
    await BR({
      minSize: 1,
    })(mockContext, noBrNext);
    assertEquals(
      mockContext.response.headers.get("content-encoding"),
      "br",
    );
  });
});
