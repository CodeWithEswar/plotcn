import type { Accessor } from "./accessors"

export interface SeriesDefinition<TDatum> {
  id: string
  label: string
  value: Accessor<TDatum, number>
}
