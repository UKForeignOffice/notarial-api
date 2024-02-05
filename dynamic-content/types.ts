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
