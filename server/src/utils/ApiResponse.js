/**
 * Standard envelope for every successful API response.
 *
 * Shape:
 *   { success: true, message: string, data: T | null }
 *
 * Usage:
 *   return res.status(200).json(new ApiResponse(data, "Fetched successfully"));
 *
 * Exceptions that do NOT use ApiResponse:
 *   - HTTP 204 No Content  (logout) — must have no body
 *   - Health-check endpoint (/api/health) — plain status object
 */
class ApiResponse {
  /**
   * @param {*}      data    The payload to return to the client (null for empty success)
   * @param {string} message Human-readable success description
   */
  constructor(data = null, message = "Success") {
    this.success = true;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
