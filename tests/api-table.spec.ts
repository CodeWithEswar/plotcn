import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { parseMarkdownTableRow } from "../components/docs/mdx-components"
import { inferColumnKind } from "../components/docs/api-table"

describe("Responsive API Table & Markdown Table Parser", () => {
  describe("parseMarkdownTableRow", () => {
    it("should parse simple standard markdown table row", () => {
      const line = "| Prop | Type | Default | Description |"
      const cells = parseMarkdownTableRow(line)
      assert.deepEqual(cells, ["Prop", "Type", "Default", "Description"])
    })

    it("should not split on escaped pipe in union type", () => {
      const line = '| `curve` | `"monotone" \\| "linear" \\| "step"` | `"monotone"` | Line interpolation curve |'
      const cells = parseMarkdownTableRow(line)
      assert.equal(cells.length, 4)
      assert.equal(cells[0], "`curve`")
      assert.equal(cells[1], '`"monotone" | "linear" | "step"`')
      assert.equal(cells[2], '`"monotone"`')
      assert.equal(cells[3], "Line interpolation curve")
    })

    it("should handle escaped pipe inside number/string union", () => {
      const line = "| `height` | `number \\| string` | `320` | Container height in pixels |"
      const cells = parseMarkdownTableRow(line)
      assert.equal(cells.length, 4)
      assert.equal(cells[0], "`height`")
      assert.equal(cells[1], "`number | string`")
      assert.equal(cells[2], "`320`")
      assert.equal(cells[3], "Container height in pixels")
    })

    it("should handle complex bracketed union type with escaped pipe", () => {
      const line = '| `domain` | `[number, number] \\| ["auto", "auto"]` | `"auto"` | Explicit Y-axis bounds |'
      const cells = parseMarkdownTableRow(line)
      assert.equal(cells.length, 4)
      assert.equal(cells[0], "`domain`")
      assert.equal(cells[1], '`[number, number] | ["auto", "auto"]`')
      assert.equal(cells[2], '`"auto"`')
      assert.equal(cells[3], "Explicit Y-axis bounds")
    })

    it("should handle 5-column table with required status", () => {
      const line = "| `missingValuePolicy` | `\"gap\" \\| \"connect\"` | `\"gap\"` | No | Handling of null observations |"
      const cells = parseMarkdownTableRow(line)
      assert.equal(cells.length, 5)
      assert.equal(cells[0], "`missingValuePolicy`")
      assert.equal(cells[1], '`"gap" | "connect"`')
      assert.equal(cells[2], '`"gap"`')
      assert.equal(cells[3], "No")
      assert.equal(cells[4], "Handling of null observations")
    })

    it("should handle pipes inside inline backticks even without backslash", () => {
      const line = "| `format` | `(val: number | string) => string` | `undefined` | Value formatter |"
      const cells = parseMarkdownTableRow(line)
      assert.equal(cells.length, 4)
      assert.equal(cells[0], "`format`")
      assert.equal(cells[1], "`(val: number | string) => string`")
      assert.equal(cells[2], "`undefined`")
      assert.equal(cells[3], "Value formatter")
    })

    it("should handle row without leading or trailing spaces gracefully", () => {
      const line = "|A|B|C|"
      const cells = parseMarkdownTableRow(line)
      assert.deepEqual(cells, ["A", "B", "C"])
    })
  })

  describe("inferColumnKind", () => {
    it("should identify property and field column names", () => {
      assert.equal(inferColumnKind("Prop"), "name")
      assert.equal(inferColumnKind("Property"), "name")
      assert.equal(inferColumnKind("Field"), "name")
      assert.equal(inferColumnKind("Callback"), "name")
      assert.equal(inferColumnKind("Policy"), "name")
    })

    it("should identify type and configuration columns", () => {
      assert.equal(inferColumnKind("Type"), "type")
      assert.equal(inferColumnKind("Payload"), "type")
      assert.equal(inferColumnKind("Prop Configuration"), "type")
    })

    it("should identify default column", () => {
      assert.equal(inferColumnKind("Default"), "default")
    })

    it("should identify required and status columns", () => {
      assert.equal(inferColumnKind("Required"), "status")
      assert.equal(inferColumnKind("Status"), "status")
    })

    it("should default other columns to description", () => {
      assert.equal(inferColumnKind("Description"), "description")
      assert.equal(inferColumnKind("Meaning"), "description")
      assert.equal(inferColumnKind("Visual Behavior"), "description")
    })
  })
})
