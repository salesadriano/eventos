/// <reference types="cypress" />

export type SpecMap = Record<string, () => Promise<void> | void>;

export function registerUseCaseSpecs(suiteName: string, specs: SpecMap): void {
  describe(suiteName, () => {
    for (const [specName, specFn] of Object.entries(specs)) {
      it(specName, () => {
        return specFn();
      });
    }
  });
}
