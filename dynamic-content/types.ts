export type Conditions = {
  [key: string]: {
    evaluateField: string;
    evaluateValue: string[];
    useField: string;
    defaultDisplayName: string;
    formField: {
      name: string;
      displayName: string;
      type: string;
    };
    section?: string;
    operation: string;
  };
};

export type Row = Record<string, string>;

export type ConstantsMap = {
  [key in "content" | "booking-links"]: {
    fieldMap: Record<string, string>;
    relevant: string[];
  };
};

export type FileConstants = {
  fieldMap: Record<string, string>;
  relevant: string[];
};
