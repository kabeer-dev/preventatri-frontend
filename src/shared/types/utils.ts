export type BuildDynamicUrlParamsType = {
  search?: string;
  sort?: string;
  number?: number;
  limit?: number;
};

export type DecodeTokenResult = {
  data: any;
  hasExpired: boolean;
};

export interface BuildDynamicUrlArgs {
  baseEndpoint: string;
  params: Record<string, any>;
}
