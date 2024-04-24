export interface Signature {
  workspaceSecret: string;
  date: string;
  method: string;
  route: string;
  body?: string;
  contentType?: string;
}
