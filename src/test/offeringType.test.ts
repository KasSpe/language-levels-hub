import { describe, expect, it } from "vitest";
import { getOfferingLabel } from "@/lib/offeringType";

describe("getOfferingLabel", () => {
  it("aanduiding voor expliciet én impliciet aanbod", () => {
    expect(getOfferingLabel({ explicit_contexts: ["Grammaticales"], implicit_contexts: ["Rollenspel"] }))
      .toBe("Expliciet + impliciet");
  });

  it("aanduiding voor enkel expliciet aanbod", () => {
    expect(getOfferingLabel({ explicit_contexts: ["Grammaticales"], implicit_contexts: [] }))
      .toBe("Expliciet");
  });

  it("aanduiding voor enkel impliciet aanbod", () => {
    expect(getOfferingLabel({ explicit_contexts: [], implicit_contexts: ["Rollenspel"] }))
      .toBe("Impliciet");
  });

  it("geen aanduiding zonder ingevulde contexten", () => {
    expect(getOfferingLabel({ explicit_contexts: [], implicit_contexts: [] })).toBeNull();
    expect(getOfferingLabel()).toBeNull();
  });
});
