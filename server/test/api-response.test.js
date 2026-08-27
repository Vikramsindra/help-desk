import { describe, it, expect } from "@jest/globals";
import ApiResponse from "../src/utils/ApiResponse.js";

describe("ApiResponse", () => {
  it("always sets success to true", () => {
    const res = new ApiResponse(null);
    expect(res.success).toBe(true);
  });

  it("includes the provided message", () => {
    const res = new ApiResponse(null, "Done");
    expect(res.message).toBe("Done");
  });

  it('defaults message to "Success" when not provided', () => {
    const res = new ApiResponse();
    expect(res.message).toBe("Success");
  });

  it("sets data to null by default", () => {
    const res = new ApiResponse();
    expect(res.data).toBeNull();
  });

  it("carries the provided data payload", () => {
    const payload = { id: "abc", title: "Test" };
    const res = new ApiResponse(payload, "OK");
    expect(res.data).toEqual(payload);
  });

  it("carries a list payload with items and pagination", () => {
    const payload = {
      items: [{ id: 1 }, { id: 2 }],
      pagination: {
        page: 1,
        limit: 20,
        totalItems: 2,
        totalPages: 1,
        hasNextPage: false,
        hasPreviousPage: false,
      },
    };
    const res = new ApiResponse(payload, "List fetched");

    expect(res.success).toBe(true);
    expect(res.data.items).toHaveLength(2);
    expect(res.data.pagination.totalItems).toBe(2);
    expect(res.data.pagination.hasNextPage).toBe(false);
    expect(res.data.pagination.hasPreviousPage).toBe(false);
  });

  it("serializes to the exact required JSON shape", () => {
    const res = new ApiResponse({ ticket: "t1" }, "Ticket fetched");
    const json = JSON.parse(JSON.stringify(res));

    expect(json).toEqual({
      success: true,
      message: "Ticket fetched",
      data: { ticket: "t1" },
    });
  });

  it("never contains an 'error' key", () => {
    const res = new ApiResponse({ x: 1 }, "OK");
    expect(res).not.toHaveProperty("error");
  });
});
