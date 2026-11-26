import { describe, it, expect } from "vitest";
import { cleanOverviewText, getOverviewPhaseContent } from "@/lib/overviewContent";

describe("overzicht zonder labels", () => {
  it("verwijdert start, expliciet en symbolen", () => {
    expect(cleanOverviewText("🚩 Start · expliciet")).toBe("");
  });
  it("houdt de grammaticale inhoud", () => {
    expect(cleanOverviewText("plaats & uitgang: 🚩 Start · expliciet – uitgang -e")).toBe("plaats & uitgang – uitgang -e");
  });
  it("verbergt fasen met alleen labels", () => {
    expect(getOverviewPhaseContent({ title: "⬆ Verdieping · impliciet", bullets: [] }).hasContent).toBe(false);
  });
});
