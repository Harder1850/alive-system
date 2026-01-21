// alive-system/ui-bridge/types.ts

export interface UiInput {
  input: string;
  source: "ui";
  timestamp: string; // ISO-8601
}

export interface UiOutput {
  output: string;
  type: "text";
  timestamp: string; // ISO-8601
}

