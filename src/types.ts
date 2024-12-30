export interface Handle {
  did: string;
  time: number;
  handle: string;
}

export interface List {
  label: string;
  rkey: string;
  test: RegExp;
}
