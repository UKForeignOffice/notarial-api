export type PayState = {
  status: "created" | "started" | "submitted" | "capturable" | "success" | "cancelled" | "error";
  finished: boolean;
};

export type PayMetadata = {
  payId: string;
  reference: string;
  state: PayState | FailedPayState;
};

export type FailedPayState = {
  status: "failed";
  message: string;
  code: string;
  finished: boolean;
};
