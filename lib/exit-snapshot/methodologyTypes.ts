export interface MethodologyInputRow {
  label: string;
  value: string;
}

export interface MethodologyParameterRow {
  label: string;
  value: string;
}

export interface MethodologyFormulaRow {
  step: number;
  name: string;
  expression: string;
  substitution: string;
  result: string;
}

export interface MethodologyOutputRow {
  label: string;
  value: string;
  highlight?: boolean;
}

export interface ExitSnapshotMethodology {
  taxYear: string;
  calculationDate: string;
  inputs: MethodologyInputRow[];
  parameters: MethodologyParameterRow[];
  formulas: MethodologyFormulaRow[];
  outputs: MethodologyOutputRow[];
}
