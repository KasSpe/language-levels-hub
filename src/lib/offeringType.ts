export interface OfferingContexts {
  explicit_contexts: string[];
  implicit_contexts: string[];
}

export const getOfferingLabel = (contexts?: OfferingContexts): string | null => {
  const hasExplicit = (contexts?.explicit_contexts.length ?? 0) > 0;
  const hasImplicit = (contexts?.implicit_contexts.length ?? 0) > 0;

  if (hasExplicit && hasImplicit) return "Expliciet + impliciet";
  if (hasExplicit) return "Expliciet";
  if (hasImplicit) return "Impliciet";
  return null;
};
