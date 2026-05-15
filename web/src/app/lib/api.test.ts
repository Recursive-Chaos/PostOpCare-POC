import { beforeEach, describe, expect, it, vi } from "vitest";
import { API_URL, authFetch } from "./api";

describe("authFetch", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("face logout cand backend-ul raspunde cu 401", async () => {
    window.history.pushState({}, "", "/login");
    localStorage.setItem("user", JSON.stringify({ role: "doctor" }));
    localStorage.setItem("session", JSON.stringify({ access_token: "token" }));

    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 401 }));

    await authFetch(`${API_URL}/doctor/patients`);

    expect(localStorage.getItem("user")).toBeNull();
    expect(localStorage.getItem("session")).toBeNull();
  });
});
