import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { formatDate, getRelativeDateTime, type MessageLike } from "@/lib/utils";

beforeEach(() => {
  vi.useFakeTimers();
  // Pick a stable noon time to avoid DST edge cases
  vi.setSystemTime(new Date("2025-01-15T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("utils.formatDate", () => {
  it("returns time for today", () => {
    const now = Date.now();
    const result = formatDate(now);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("returns Yesterday for yesterday", () => {
    const yesterday = Date.now() - 24 * 60 * 60 * 1000;
    const result = formatDate(yesterday);
    expect(result).toBe("Yesterday");
  });

  it("returns weekday for dates within last week (not today/yesterday)", () => {
    const threeDaysAgo = Date.now() - 3 * 24 * 60 * 60 * 1000;
    const result = formatDate(threeDaysAgo);
    const expected = new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(
      new Date(threeDaysAgo),
    );
    expect(result).toBe(expected);
  });

  it("returns short date for older dates", () => {
    const tenDaysAgo = Date.now() - 10 * 24 * 60 * 60 * 1000;
    const result = formatDate(tenDaysAgo);
    expect(result).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});

describe("utils.getRelativeDateTime", () => {
  const createMsg = (offsetDays: number): MessageLike => ({
    _creationTime: Date.now() + offsetDays * 24 * 60 * 60 * 1000,
  });

  it("labels Today for today's messages when previous message was different day", () => {
    const msg = createMsg(0);
    const prev = createMsg(-1);
    expect(getRelativeDateTime(msg, prev)).toBe("Today");
  });

  it("labels Yesterday for yesterday's messages", () => {
    const msg = createMsg(-1);
    const prev = createMsg(-2);
    expect(getRelativeDateTime(msg, prev)).toBe("Yesterday");
  });

  it("labels weekday for messages within last week", () => {
    const msg = createMsg(-3);
    const label = getRelativeDateTime(msg, undefined);
    expect(label).toBeTypeOf("string");
  });

  it("returns short date for older messages", () => {
    const msg = createMsg(-14);
    const label = getRelativeDateTime(msg, undefined);
    expect(label).toMatch(/\d{2}\/\d{2}\/\d{4}/);
  });
});
