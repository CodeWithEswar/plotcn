export type Accessor<TDatum, TValue> = (datum: TDatum, index: number) => TValue

export type AccessorInput<TDatum, TValue> =
  | Extract<keyof TDatum, string>
  | Accessor<TDatum, TValue>
