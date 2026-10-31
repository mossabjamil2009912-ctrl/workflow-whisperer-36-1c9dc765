import { describe, it, expect } from "vitest";
import { sendBlocker } from "@/lib/report-rules";

describe("report request sending", () => {
  it("cannot send without an uploaded file", () => expect(sendBlocker({ status: "pending" }, null)).not.toBeNull());
  it("cannot send an already-sent request twice", () => expect(sendBlocker({ status: "sent" }, { path: "x" })).not.toBeNull());
  it("pending with file can be sent", () => expect(sendBlocker({ status: "pending" }, { path: "x" })).toBeNull());
});
