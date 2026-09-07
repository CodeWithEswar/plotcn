# 16. TypeScript, Formatting & Internationalization

Plotcn should treat **type safety, formatting, locale behavior, and directional layout** as part of the component architecture rather than as documentation polish added later.

The governing principle is:

> **A Plotcn chart should be strongly typed at development time and culturally neutral at runtime.**

A visualization component should not silently assume:

```text
English
USD
MM/DD/YYYY
Western digit grouping
12-hour time
left-to-right layout
```

unless the application explicitly chooses those conventions.

---

## 16.1 Strict Public Types

All public chart APIs should use strict TypeScript.

Avoid:

```text
any
unknown leaking into normal chart props
untyped formatter callbacks
stringly-typed series keys
generic Record<string, any>
```

The goal is for consumers to receive:

```text
autocomplete
key inference
literal preservation
actionable compiler errors
safe formatter inputs
safe callback payloads
```

before the chart renders.

---

## 16.2 Generic Data Models

Chart components should generally be generic over the consumer's data model.

Conceptually:

```text
Chart<TData>
```

rather than requiring all consumers to convert data into one universal Plotcn datum type.

For example, a consumer might naturally have:

```text
month
revenue
profit
```

while another has:

```text
timestamp
latency
errorRate
```

Plotcn should preserve those models where practical.

---

## 16.3 Preserve Consumer Data Shape

Avoid requiring:

```text
data.map(...)
→ convert everything to
{
  x: ...,
  y: ...
}
```

for ordinary charts.

Instead, use:

```text
typed keys
or
typed accessors
```

to read the consumer's existing data.

This keeps Plotcn composable with real application models.

---

## 16.4 Typed Keys

For key-based APIs, infer valid keys from the datum type.

Conceptually:

```text
xKey
series[].key
valueKey
nameKey
```

should autocomplete from actual fields.

A chart should reject:

```text
series key = "reveneu"
```

when the data only contains:

```text
revenue
```

The compiler should catch this typo.

---

## 16.5 Numeric Key Constraints

Where a field must be numeric, constrain the key accordingly.

Example mental model:

```text
type Datum = {
  month: string
  revenue: number
  profit: number
  label: string
}
```

A numeric series key should allow:

```text
revenue
profit
```

but not:

```text
month
label
```

where TypeScript inference can express this cleanly.

---

## 16.6 Key Utility Types

`chart-core` may contain reusable utility types such as:

```text
StringKeyOf<T>
NumericKeyOf<T>
DateLikeKeyOf<T>
```

only if they are genuinely reused across chart families.

Do not create an enormous type-metaprogramming layer.

Keep compiler performance and readability in mind.

---

## 16.7 Typed Accessors

Advanced charts should support typed accessor functions.

Examples:

```text
x
y
value
children
source
target
```

Conceptually:

```text
(datum: TData) => number
```

or:

```text
(datum: TData) => Date
```

depending on chart semantics.

This is especially important for D3.

---

## 16.8 Key or Accessor

A good progressive API may support:

```text
easy path
→ key

advanced path
→ accessor
```

For example:

```text
xKey="month"
```

for common usage,

and:

```text
x={(datum) => datum.period.start}
```

for nested/advanced models.

Do not force accessors onto every beginner-facing chart if a key is simpler.

---

## 16.9 Literal Series Preservation

Series configuration should preserve literal keys.

Conceptually:

```text
series = [
  { key: "revenue", label: "Revenue" },
  { key: "profit", label: "Profit" },
]
```

should preserve:

```text
"revenue" | "profit"
```

rather than widening everything to:

```text
string
```

This improves:

```text
formatter callbacks
legend callbacks
visibility state
event payloads
```

---

## 16.10 `as const` and `satisfies`

Within Plotcn source and documentation, prefer patterns that preserve literals while still validating shape.

Examples of useful TypeScript tools:

```text
as const
satisfies
```

Use them intentionally.

Do not litter code with type assertions that hide errors.

---

## 16.11 No Public `any`

`any` should not appear in public chart prop types.

Avoid:

```text
data: any[]
formatter: (value: any) => any
options: any
onChange: (event: any) => void
```

Prefer exact types or `unknown` at genuinely untrusted boundaries.

---

## 16.12 `unknown` at Runtime Boundaries

If Plotcn receives untrusted runtime data:

```text
API response
JSON editor
plugin payload
```

use:

```text
unknown
```

then validate/narrow.

Do not convert `unknown` into `any` merely to make compilation easier.

---

## 16.13 Engine-Specific Types

Do not hide useful engine types where developers need them.

Recharts-specific advanced APIs may expose relevant Recharts types.

D3 charts can expose domain/accessor types.

Google Charts adapters can expose carefully narrowed Google configuration types.

The rule is:

> **Preserve useful engine capability without leaking engine internals into every high-level Plotcn prop.**

---

## 16.14 Google Options Typing

Avoid:

```text
options: any
```

for Google Charts.

Use:

```text
typed chart-specific options
```

or a controlled typed escape hatch.

If upstream typings are incomplete, define a narrow Plotcn interface around the supported options rather than collapsing to `any`.

---

## 16.15 Event Payload Typing

Callbacks should expose meaningful typed payloads.

Examples:

```text
onDatumEnter
onDatumLeave
onSelectionChange
onSeriesToggle
onZoomChange
```

should provide domain-specific payloads.

Avoid passing raw engine events unless intentionally documented as an advanced escape hatch.

---

## 16.16 Typed Datum Payload

Conceptually:

```text
datum
datumId
seriesKey
seriesLabel
value
index
```

should be strongly typed where applicable.

This enables autocomplete without forcing consumers to inspect undocumented payload structures.

---

## 16.17 Stable Event Types

Do not expose temporary internal implementation details in public callback types.

For example, avoid making a Plotcn event depend on:

```text
internal DOM node
private Google event object
temporary D3 layout structure
```

unless the API intentionally exposes engine-native behavior.

---

## 16.18 Formatter Types

Formatting callbacks should be typed according to the value they receive.

A numeric formatter should not accept arbitrary `unknown`.

A date formatter should receive a date-compatible value according to the component contract.

This keeps formatting logic safe.

---

## 16.19 Tooltip Formatter Types

Tooltip formatters should know:

```text
datum
series key
value
formatted label context
```

without exposing raw untyped engine payloads.

The same normalized interaction model from Section 8 should inform these types.

---

## 16.20 Legend Formatter Types

Legend formatters should receive:

```text
series ID
series label
visibility state
```

using the same series identity contract as the chart.

Do not maintain a second unrelated legend identity model.

---

## 16.21 Generic Constraints

Avoid overly clever generic constraints that make chart APIs difficult to use.

The ideal consumer experience is:

```text
write data
→ TypeScript infers the model
→ autocomplete works
```

not:

```text
declare five generic arguments manually
```

---

## 16.22 Explicit Generics as Escape Hatch

Explicit type parameters may still be useful when inference cannot resolve:

```text
union data
empty initial arrays
remote generic responses
```

but they should not be required for the common path.

---

## 16.23 Empty Array Inference

Be careful with:

```text
data = []
```

because TypeScript may infer overly narrow types.

Documentation should show patterns that preserve correct inference when empty/loading states are common.

Do not solve this by weakening the component type to `any[]`.

---

## 16.24 Readonly Inputs

Prefer:

```text
readonly TData[]
```

or equivalent immutable inputs where practical.

Plotcn should not mutate consumer data.

This aligns TypeScript with the runtime immutability rule from Section 12.

---

## 16.25 Readonly Series Configuration

Series definitions should generally be accepted as readonly.

This supports:

```text
as const
```

and literal preservation.

---

## 16.26 Avoid Giant Union Types

Do not create one universal:

```text
PlotcnChartProps
```

with hundreds of unions for:

```text
line
pie
network
geo
financial
Google
D3
Recharts
```

Each chart family should keep its own focused API.

---

## 16.27 Family-Level Shared Types

Share only concepts that are truly common.

Candidates:

```text
ChartDimensions
ChartMargins
ChartSeries
ChartStatus
ChartRenderer
ChartEngine
ChartThemeMode
```

Do not force chart-specific behavior into these.

---

## 16.28 Public vs Internal Types

Keep a clean distinction:

```text
public types
→ consumer-facing API

internal types
→ normalized implementation details
```

Do not expose internal normalized structures simply because they already exist.

---

## 16.29 Export Strategy

Use curated exports.

Good:

```text
chart types
series types
formatter types
event payload types
```

Avoid exporting every internal helper/type from the package.

Source-first consumers should still be able to inspect everything locally after installation.

---

## 16.30 Type Names

Use descriptive names.

Prefer:

```text
LineChartProps
LineSeries
TooltipFormatterContext
ChartDimensions
```

over:

```text
Props
Config
Thing
ChartOptions2
```

unless component-local context makes a shorter name obvious.

---

## 16.31 Type Documentation

Component detail pages should display actual TypeScript types for:

```text
props
series
events
formatters
data
```

but explain them in plain language as well.

Do not assume a type signature alone is sufficient documentation.

---

## 16.32 TypeScript Version Policy

Plotcn should align with the repository's supported modern TypeScript version.

Do not depend on experimental compiler features unless the project intentionally raises its minimum TypeScript requirement.

Registry-installed components must remain compatible with realistic consumer setups.

---

## 16.33 Compiler Strictness

The Plotcn repository should target strict compilation.

Prefer enabling/maintaining options such as:

```text
strict
noImplicitAny
strictNullChecks
noUncheckedIndexedAccess
exactOptionalPropertyTypes
```

where they are compatible with the project.

Do not silently weaken strictness just to accommodate chart code.

---

## 16.34 Nullability

TypeScript should reflect actual data semantics.

If a chart accepts missing observations:

```text
number | null
```

should be represented intentionally.

Do not declare:

```text
number
```

and then quietly accept `null` at runtime.

---

## 16.35 Optional vs Nullable

Preserve distinction:

```text
undefined
→ property absent

null
→ explicit missing observation
```

where the component's data contract treats them differently.

---

## 16.36 Type-Level Missing Policy

Do not make the type system imply that null equals zero.

If the chart supports null gaps, the type should reflect that explicitly.

---

## 16.37 Date Types

Avoid requiring JavaScript `Date` objects everywhere.

Applications often use:

```text
Date
numeric timestamp
ISO string
Temporal-like values in the future
```

Each component should define supported date representations clearly.

Do not accept arbitrary strings and guess.

---

## 16.38 Date Accessors

A robust time chart may normalize:

```text
consumer value
→ typed accessor
→ finite timestamp internally
```

The public type should clearly define accepted values.

---

## 16.39 `DateLike` Caution

If a shared `DateLike` type exists, keep it narrow.

Avoid:

```text
DateLike = any
```

or:

```text
string | number | Date
```

without documenting valid string semantics.

An arbitrary string is not automatically a valid date.

---

## 16.40 Formatting Architecture

Formatting should follow:

```text
raw semantic value
      ↓
formatting context
      ↓
Intl formatter
      ↓
display string
```

Do not mix parsing and formatting.

---

## 16.41 Core Formatting Utilities

Plotcn may provide:

```text
formatNumber()
formatCurrency()
formatPercentage()
formatCompact()
formatDate()
formatDuration()
```

These should be small, predictable wrappers around standards-based APIs.

---

## 16.42 Use `Intl`

Prefer:

```text
Intl.NumberFormat
Intl.DateTimeFormat
Intl.RelativeTimeFormat
Intl.ListFormat
Intl.PluralRules
```

where appropriate.

Do not maintain custom locale tables for standard formatting.

---

## 16.43 `formatNumber()`

Purpose:

```text
general localized numeric display
```

Should support:

```text
locale
minimumFractionDigits
maximumFractionDigits
signDisplay
useGrouping
```

where needed.

Example conceptual results:

```text
en-US
1,234.5

de-DE
1.234,5

hi-IN
1,234.5 / Indian grouping depending magnitude
```

Do not hardcode commas and periods.

---

## 16.44 Indian Number Grouping

Locale formatting should allow real locale behavior such as:

```text
1,23,45,678
```

where the chosen locale uses Indian grouping.

Do not globally force:

```text
12,345,678
```

for every user.

---

## 16.45 `formatCurrency()`

Must require or intentionally default a currency only at application/config level.

Do not assume:

```text
USD
```

inside the utility.

Conceptually:

```text
value
currency
locale
```

should produce locale-correct output.

Examples:

```text
USD
$1,250.00

EUR with suitable locale
1.250,00 €

INR with suitable locale
₹1,250.00
```

Actual placement depends on locale.

---

## 16.46 Currency Code Requirement

Prefer explicit:

```text
currency: "INR"
```

rather than inferring from:

```text
locale: "en-IN"
```

Locale does not reliably determine financial currency.

A user in India may display USD.

---

## 16.47 Currency Display Modes

Allow the underlying `Intl.NumberFormat` conventions when needed:

```text
symbol
narrowSymbol
code
name
```

Do not create Plotcn-specific replacements unnecessarily.

---

## 16.48 `formatPercentage()`

Define input semantics clearly.

There are two common models:

```text
fraction
0.42 → 42%

percentage points
42 → 42%
```

Plotcn must not guess.

Prefer a clear utility contract.

For example, one formatter may intentionally expect:

```text
0–1 fraction
```

while chart APIs may separately support percentage-point values.

Document the distinction.

---

## 16.49 Do Not Infer Percentages

Never infer percentage semantics because:

```text
value <= 1
```

That fails for legitimate:

```text
0.5%
```

or values above 100%.

Formatting semantics must be explicit.

---

## 16.50 `formatCompact()`

Use `Intl.NumberFormat` compact notation.

Examples:

```text
1.2K
1.2M
1.2B
```

depending locale.

Do not maintain hand-written:

```text
if value > 1000
```

formatting tables unless a specialized chart requires deterministic domain abbreviations.

---

## 16.51 Compact Formatting and Accessibility

Visual axes may use compact notation:

```text
1.2M
```

while accessible data alternatives can expose:

```text
1,200,000
```

where that improves comprehension.

Visual compactness should not reduce semantic clarity.

---

## 16.52 `formatDate()`

Use locale-aware date formatting.

Allow options such as:

```text
dateStyle
timeStyle
year
month
day
weekday
hour
minute
timeZone
```

Do not manually concatenate:

```text
MM/DD/YYYY
```

unless an application explicitly asks for that exact format.

---

## 16.53 Time Zone

Date formatting must account for timezone.

A timestamp can display differently in:

```text
UTC
Asia/Kolkata
America/New_York
Europe/Berlin
```

Do not assume the browser's local timezone when the application provides an explicit reporting timezone.

---

## 16.54 Date Parsing Is Not Formatting

`formatDate()` should not become a permissive parser.

Input should already be:

```text
valid Date
finite timestamp
validated supported date representation
```

Parsing belongs at the application/data normalization boundary.

---

## 16.55 Axis Date Formatting

Time-axis formatting should depend on visible domain/granularity.

Examples:

```text
intraday
→ 10:30

day-level
→ 7 Sep

month-level
→ Sep 2026

year-level
→ 2026
```

But locale formatting should still be preserved.

Do not hardcode English month abbreviations globally.

---

## 16.56 Tooltip Date Formatting

Tooltip dates can be more detailed than axis ticks.

Example:

```text
axis
→ Sep 7

tooltip
→ Sep 7, 2026, 10:30 PM
```

depending locale/context.

Use separate formatting contexts.

---

## 16.57 `formatDuration()`

Duration formatting should not assume:

```text
milliseconds
```

unless the API explicitly says so.

Choose a clear input model:

```text
milliseconds
seconds
or structured duration
```

and document it.

---

## 16.58 Duration Display

Potential display:

```text
950 ms
1.2 s
3 min 12 s
1 h 24 min
```

according to domain and locale.

Do not create ambiguous formats such as:

```text
01:02
```

without explaining whether it means:

```text
1 minute 2 seconds
1 hour 2 minutes
```

---

## 16.59 `Intl.DurationFormat`

If using `Intl.DurationFormat`, verify target environment/browser support and provide a fallback if required by Plotcn's compatibility policy.

Do not depend on newer APIs without considering consumer support.

---

## 16.60 Formatter Object Reuse

Creating `Intl` formatter instances repeatedly can have a cost.

For frequently used formatting, consider safe memoization/caching by:

```text
locale
options
currency
```

where beneficial.

Do not build an unbounded global cache.

---

## 16.61 Formatter Cache

A small bounded/internal formatter cache may be useful.

But avoid complex caching until profiling proves formatter construction matters.

For ordinary dashboards, correctness is more important than premature optimization.

---

## 16.62 Shared Formatting Layer

Formatting utilities belong naturally in:

```text
chart-core/
└── formatting/
```

because they can remain:

```text
pure
React-free
renderer-neutral
```

---

## 16.63 Formatting Utility Structure

Potential:

```text
formatting/
├── number.ts
├── currency.ts
├── percentage.ts
├── compact.ts
├── date.ts
├── duration.ts
├── locale.ts
└── types.ts
```

Do not create all files if the implementation remains trivial; grouping may be sufficient.

---

## 16.64 Default Locale Policy

Plotcn should not hardcode:

```text
en-US
```

as a universal default.

A utility may accept:

```text
locale?: string | string[]
```

and defer to the environment when omitted.

Applications that require deterministic server/client output should explicitly provide locale.

---

## 16.65 SSR Locale Consistency

Server and browser may have different locale defaults.

This can create hydration differences.

For SSR-sensitive text, prefer an application-resolved locale shared between server and client.

Do not rely blindly on:

```text
navigator.language
```

during initial rendering.

---

## 16.66 Deterministic Formatting

For static docs/demo output, use an explicitly chosen demo locale if deterministic output is required.

Label it as example behavior.

Do not imply that the demo locale is Plotcn's global default.

---

## 16.67 Locale Context

Plotcn should not immediately require a giant localization provider.

Possible approaches:

```text
formatter props
application formatter utilities
optional lightweight locale context later
```

Start small.

---

## 16.68 No Giant `IntlProvider`

Avoid introducing:

```text
<PlotcnIntlProvider>
```

unless repeated cross-chart requirements prove it necessary.

Charts should compose with the application's existing i18n system.

---

## 16.69 Application i18n Integration

Plotcn should work naturally with:

```text
next-intl
react-intl
FormatJS
i18next
Lingui
custom app localization
```

without requiring any of them.

Do not tie Plotcn to one i18n framework.

---

## 16.70 Formatter Injection

Consumers should be able to supply their own:

```text
valueFormatter
labelFormatter
dateFormatter
```

when domain-specific formatting is needed.

These callbacks should be typed.

---

## 16.71 Formatter Precedence

Use a clear model:

```text
component-specific formatter
→ application-provided formatter
→ Plotcn default formatter
```

or whatever the final API chooses.

Do not create unpredictable multiple formatter layers.

---

## 16.72 Formatting Context

The same value may need different formatting in:

```text
axis
tooltip
legend
summary
data table
```

Do not assume one string formatter is perfect everywhere.

A semantic formatter may receive context.

Conceptually:

```text
"axis"
"tooltip"
"legend"
"accessibility"
```

only if proven useful.

---

## 16.73 Avoid Over-Abstract Formatter APIs

Do not create:

```text
formatterRegistry
formattingEngine
format pipeline graph
```

for V1.

Simple typed callbacks plus core utilities are sufficient.

---

## 16.74 Number Precision

Formatting should avoid meaningless precision.

Examples:

```text
Revenue
₹84,218.37

Latency
42.6 ms

Conversion
3.42%
```

Precision should be domain/config-driven.

Plotcn should not globally force:

```text
2 decimal places
```

for every value.

---

## 16.75 Axis Precision

Axis ticks often need less precision than tooltip values.

Example:

```text
axis
₹1.2M

tooltip
₹1,243,218
```

This should be expected, not considered inconsistency.

---

## 16.76 Negative Number Formatting

Respect locale conventions for:

```text
minus sign
currency position
accounting format where requested
```

Do not concatenate:

```text
"-" + formattedValue
```

manually when `Intl` can handle it.

---

## 16.77 Sign Display

Useful options may include:

```text
auto
always
exceptZero
never
```

for metrics such as growth/change.

Prefer standards-based options.

---

## 16.78 Financial Accounting

For finance components, allow application formatting that uses:

```text
accounting
```

style where appropriate.

Do not make accounting display a global default.

---

## 16.79 Scientific/Engineering Notation

Advanced scientific charts may later need:

```text
scientific
engineering
```

notation.

This can remain future scope but should fit within the formatting architecture.

---

## 16.80 Units

Do not combine every value with a manually concatenated unit.

Where supported by `Intl.NumberFormat`, unit formatting may be used.

Examples:

```text
kilometer
megabyte
celsius
```

But many application-specific units may still require custom formatters.

---

## 16.81 Unit Placement

Some languages/locales place units differently.

Therefore avoid generic:

```text
`${value} ${unit}`
```

when locale-sensitive unit formatting exists and matters.

---

## 16.82 Directionality

Plotcn must not assume all layouts are left-to-right.

Support:

```text
ltr
rtl
```

where the application sets direction.

Prefer logical CSS properties.

---

## 16.83 CSS Logical Properties

Use:

```text
margin-inline
padding-inline
inset-inline
border-inline
text-align: start/end
```

or Tailwind logical utilities where supported by project conventions.

Avoid unnecessary:

```text
margin-left
padding-right
left: 0
```

for semantic layout.

---

## 16.84 Chart Geometry and RTL

RTL does **not** automatically mean every numerical chart should reverse X-axis direction.

This is important.

For example:

```text
time increases left-to-right
```

may remain appropriate even inside an RTL application depending product convention.

Directionality decisions must separate:

```text
UI chrome direction
```

from:

```text
data-domain direction
```

---

## 16.85 UI Chrome in RTL

Controls should adapt:

```text
breadcrumb order
navigation
legend layout
tooltips
action groups
side panels
```

according to application direction.

---

## 16.86 Axis Direction in RTL

Provide explicit policy rather than blindly applying CSS direction to SVG coordinates.

Potential:

```text
direction="auto" | "ltr" | "rtl"
```

only if a real requirement emerges.

Do not add a universal prop prematurely.

---

## 16.87 Arabic/Hebrew Labels

Axis and legend labels should render Unicode text correctly.

Do not:

```text
uppercase all metadata indiscriminately
letter-space Arabic text
force Latin-specific typography
```

Human-facing chart labels should preserve language typography.

---

## 16.88 Uppercase Technical Metadata

Plotcn may use uppercase for technical English metadata in its own developer UI:

```text
ENGINE
SVG
STATUS
```

But consumer-provided localized labels should not be uppercased automatically.

---

## 16.89 Text Measurement Across Scripts

Responsive tick calculations must not assume Latin character widths.

Scripts such as:

```text
Arabic
Devanagari
CJK
Thai
```

have different glyph behavior.

Approximate label measurement should be conservative.

---

## 16.90 Long Translations

Localized labels may be substantially longer than English.

UI should support:

```text
wrapping
truncation where safe
tooltip/full label
responsive rearrangement
```

Do not size controls based only on English text.

---

## 16.91 CJK Labels

Charts with CJK labels may require different wrapping/tick strategies.

Do not assume space-separated words.

---

## 16.92 Unicode Safety

Registry examples, data labels, tooltips, and legends should support Unicode naturally.

Do not manually sanitize away valid characters.

React text escaping remains the default security behavior.

---

## 16.93 Locale-Aware Sorting

Do not automatically sort categories using plain ASCII ordering if localized sorting is required.

Use:

```text
Intl.Collator
```

when sorting is explicitly part of the chart behavior.

But generic charts should normally preserve caller order.

---

## 16.94 No Implicit Sorting

Plotcn should not reorder categories simply because a locale is available.

Ordering remains application/data semantics unless the component specifically performs ranking/sorting.

---

## 16.95 Locale-Aware Search

For the Plotcn website catalog, basic lowercase search may be enough for V1.

If multilingual docs/search are introduced later, consider locale-aware normalization.

This should not affect consumer chart runtime.

---

## 16.96 Decimal Separators

Never parse chart numeric input from display-formatted strings such as:

```text
"1.234,56"
```

inside chart components.

Data should be numeric before formatting.

Formatting is one-way presentation.

---

## 16.97 Parsing Boundary

Architecture:

```text
localized user input
→ application parser/form
→ numeric/date value
→ Plotcn chart
→ localized formatter
```

Do not make the chart both parser and formatter.

---

## 16.98 Time Formatting

Support:

```text
12-hour
24-hour
```

according to locale/options.

Do not hardcode:

```text
AM/PM
```

or force 24-hour time globally.

---

## 16.99 Week Start

Calendar/time visualizations must not assume:

```text
Sunday
```

or:

```text
Monday
```

as universal week start.

Future calendar heatmaps/timelines should accept or derive locale/application week conventions.

---

## 16.100 Calendar Systems

V1 may primarily rely on Gregorian dates through JavaScript/Intl.

Do not claim broad non-Gregorian calendar support unless implemented/tested.

The architecture should avoid unnecessary assumptions that make future calendar support impossible.

---

## 16.101 Relative Time

If future charts show:

```text
2 hours ago
3 days ago
```

use:

```text
Intl.RelativeTimeFormat
```

or application localization.

Do not concatenate English strings.

---

## 16.102 Pluralization

Do not construct:

```text
1 item
2 items
```

with English-only suffix logic where localization matters.

Use application localization or `Intl.PluralRules`.

This is mostly relevant to surrounding chart UI rather than core geometry.

---

## 16.103 Tooltip Text

Default tooltip structural labels should be localization-friendly.

Avoid fixed English text inside reusable chart source where unnecessary.

For example, do not hardcode:

```text
No data
Previous
Current
Total
```

without a customization/localization path if those labels are user-facing.

---

## 16.104 State Messages

Shared:

```text
ChartLoading
ChartEmpty
ChartError
```

should accept text props.

Plotcn website may have English defaults, but consumer registry components should make state copy easy to customize.

---

## 16.105 Do Not Ship Translation Catalog

Plotcn does not need its own translation catalog in V1.

Source-first components should use:

```text
consumer-provided labels
small defaults
editable local source
```

rather than becoming a localization framework.

---

## 16.106 Accessibility and Locale

Accessible summaries should use the same locale/formatting semantics as visible data.

Do not announce:

```text
1.2M
```

if the visual locale and accessible table use incompatible conventions.

---

## 16.107 Accessible Expanded Formatting

Accessibility output may use more explicit wording.

For example:

```text
visual
₹1.2M

screen-reader table
₹1,200,000
```

This is acceptable when both represent the same value.

---

## 16.108 Screen Reader Language

Applications should set the appropriate document/component language.

Plotcn should not hardcode:

```text
lang="en"
```

inside chart components.

---

## 16.109 Bidirectional Text

Tooltips and legends should handle mixed-direction strings such as:

```text
Arabic label + Latin SKU
Hebrew label + USD amount
```

using browser bidi behavior and logical layout.

Avoid string concatenation patterns that break bidi ordering.

---

## 16.110 Bidi Isolation

Where mixed-direction dynamic values are composed into text, consider:

```text
<bdi>
```

or equivalent bidi-safe rendering when necessary.

Do not add it everywhere blindly; use where mixed-direction content can become ambiguous.

---

## 16.111 Numbering Systems

`Intl` may use locale-specific numbering systems.

Plotcn should not assume ASCII digits in layout algorithms when measuring rendered labels.

---

## 16.112 Formatting in Canvas

Canvas cannot use CSS text layout semantics as naturally as DOM/SVG.

For Canvas labels:

```text
format first
measure formatted string
render with inherited/resolved font
```

RTL/text-direction support must be tested specifically.

---

## 16.113 Formatting in Google Charts

Google adapters should receive already-resolved Plotcn/application formatting where possible.

Where Google owns formatting internally, document limitations and map supported locale/options intentionally.

Do not assume Google runtime formatting automatically matches Plotcn utilities.

---

## 16.114 Google Locale Loading

If Google Charts requires locale-specific loading/configuration for certain behavior, keep it scoped to Google integration.

Do not make it a global Plotcn localization dependency.

---

## 16.115 D3 Formatting

Do not rely on D3 formatting defaults as Plotcn's universal locale system.

D3 format helpers can be useful in specialized components, but Plotcn's shared formatting should remain standards-based and engine-neutral.

---

## 16.116 Recharts Formatting

Use typed Plotcn/application formatters for:

```text
tickFormatter
tooltip formatter
labels
legends
```

rather than creating unrelated formatting conventions in each Recharts chart.

---

## 16.117 Formatting Precomputation

Avoid formatting every datum repeatedly on every render.

For large charts:

```text
format only visible ticks
format tooltip value on interaction
```

rather than preformatting thousands of values unnecessarily.

---

## 16.118 Keep Raw Values Raw

Internal data should remain numeric/date semantic values.

Do not convert:

```text
1200000
```

to:

```text
"$1.2M"
```

inside the main dataset before scaling.

Formatting belongs at presentation boundaries.

---

## 16.119 Sorting Raw Values

Sorting/ranking must use raw numeric values, not formatted strings.

Avoid:

```text
"$9K" > "$10K"
```

style mistakes.

---

## 16.120 Formatter Return Types

Keep formatter return types appropriate.

For core utilities:

```text
string
```

is ideal.

React render-prop formatters may support:

```text
ReactNode
```

where custom composition is useful.

Do not mix those APIs unintentionally.

---

## 16.121 Serialization

Core formatting configuration should remain serializable where practical.

This helps:

```text
server rendering
docs metadata
playground state
registry examples
```

Custom function formatters naturally remain runtime code.

---

## 16.122 Playground Localization

The Playground should eventually allow testing:

```text
locale
currency
theme
direction
```

for supported charts.

This would make internationalization visible rather than merely documented.

Not all controls need to ship in V1.

---

## 16.123 Recommended Playground Locale Controls

Future useful presets:

```text
en-US
en-IN
de-DE
fr-FR
ar-SA
ja-JP
```

plus:

```text
LTR / RTL
```

Use these as testing presets, not claims of complete localization certification.

---

## 16.124 Detail Page Internationalization Examples

Component docs should include at least representative examples for formatting-sensitive components.

Examples:

```text
INR + en-IN
EUR + de-DE
Arabic RTL labels
Japanese date labels
```

when relevant.

Do not clutter every basic chart page with all locales.

---

## 16.125 Documentation Code Examples

Avoid hardcoding only:

```text
$ revenue
```

throughout docs.

Use varied examples where helpful.

This signals that currency is configurable.

---

## 16.126 Registry Component Defaults

Registry-installed source should not force English-only business labels.

Example data/demo may use English.

Reusable component internals should not require:

```text
Revenue
Total
Previous
```

unless supplied by props/config.

---

## 16.127 Locale Prop Strategy

Do not immediately add:

```text
locale
```

to every chart if applications already supply formatters.

A small number of high-level convenience charts may benefit from locale/currency props later.

First prove the shared formatting architecture.

---

## 16.128 Central Formatting Config

If repeated needs emerge, a component may accept something like:

```text
formatters
```

rather than ten locale props.

But avoid building a universal configuration object too early.

---

## 16.129 Currency in Series Metadata

A series may eventually support semantic formatting metadata such as:

```text
format: "currency"
currency: "INR"
```

only if that materially improves common usage.

Do not replace typed custom formatters with a huge formatting DSL.

---

## 16.130 Domain-Specific Formatters

Financial charts may require:

```text
price
volume
change
percent
```

with different formatting on one chart.

Therefore one chart-level:

```text
formatter
```

may not be enough.

Prefer series/value-role formatting where needed.

---

## 16.131 Date Range Labels

Responsive controls should not assume English separators.

Avoid manually composing:

```text
Jan 1 - Jan 31
```

where locale-aware date range formatting is available.

`Intl.DateTimeFormat.formatRange` may be useful where supported.

---

## 16.132 `formatRange`

If used, verify support/fallback expectations.

Do not make it a hard requirement without compatibility consideration.

---

## 16.133 Compact Date Labels

Mobile date ticks may need shorter formats.

Shorter does not mean English-specific abbreviation.

Use `Intl.DateTimeFormat` with narrower options.

---

## 16.134 Time Zones in Analytics

Analytics/reporting dashboards frequently use a business timezone different from the user's device.

Plotcn should allow formatter configuration to reflect that.

Do not silently use system timezone in documentation examples that imply business reporting.

---

## 16.135 DST Safety

Plotcn should not perform domain/business date arithmetic casually across daylight-saving boundaries.

Time-domain calculations should use timestamps/date utilities carefully.

Formatting timezone behavior is separate from domain arithmetic.

---

## 16.136 Calendar Binning

Future time aggregation such as:

```text
day
week
month
quarter
```

should not be hidden inside generic formatting utilities.

That is data transformation/domain logic, not presentation formatting.

---

## 16.137 Quarter Labels

If a chart shows:

```text
Q1
Q2
```

these may require application localization.

Do not assume `"Q"` is universal.

---

## 16.138 Metric Abbreviations

Do not globally hardcode:

```text
K
M
B
```

for compact values.

Use Intl compact notation when localization matters.

---

## 16.139 Tooltip Alignment

Use logical alignment:

```text
text-align: start
```

rather than `left` where practical.

Numeric columns may still use end alignment:

```text
text-align: end
```

which works naturally in RTL.

---

## 16.140 Legend Alignment

Legend layout should respect application direction.

But series order should remain semantically deterministic.

Do not reverse data-series meaning accidentally just because the UI is RTL.

---

## 16.141 Breadcrumb Direction

Plotcn's own website should allow bidi-correct breadcrumbs if internationalized later.

Use semantic list/nav structure rather than manually positioned slash strings.

---

## 16.142 Icons in RTL

Directional Hugeicons such as:

```text
arrow-left
arrow-right
chevron
```

may need mirroring depending semantic action.

Non-directional icons should not mirror.

Use direction-aware composition instead of manually duplicating assets.

---

## 16.143 Chart Arrows

Data annotations that represent increase/decrease are semantic, not navigation direction.

Do not mirror:

```text
up trend arrow
down trend arrow
```

because of RTL.

---

## 16.144 Positive/Negative Formatting

Positive/negative semantics remain independent of language direction.

Use:

```text
sign
color
marker
text
```

without relying on color alone.

---

## 16.145 Translation-Safe Layout

Avoid UI dimensions like:

```text
width: 80px
```

for textual controls whose labels may translate.

Prefer:

```text
content-driven width
min/max constraints
responsive wrapping
```

---

## 16.146 Package Manager Names

Brand names:

```text
npm
pnpm
Yarn
Bun
```

should preserve canonical branding and normally not be translated.

Similarly:

```text
Recharts
D3.js
Google Charts
Plotcn
```

remain brand names.

---

## 16.147 Chart Family Names

Generic chart family names may be localized by the application/docs layer if internationalized.

The registry IDs remain stable English identifiers.

---

## 16.148 Registry IDs

Registry names should remain stable, ASCII-friendly identifiers.

Example:

```text
signal-line
force-atlas
geo-world
```

Do not localize registry IDs.

Display names can be localized separately in future.

---

## 16.149 Prop Names

Prop names remain stable TypeScript identifiers.

Do not localize:

```text
showGrid
curve
series
```

Documentation descriptions may be translated.

---

## 16.150 Source-First Internationalization

Because consumers own the source, they can adapt:

```text
labels
copy
formatting
layout direction
```

without waiting for upstream configuration.

This reinforces the value of source-first distribution.

---

## 16.151 TypeScript Tests

Add compile-time type tests for important APIs.

Verify:

```text
valid series keys compile
invalid series keys fail
numeric keys constrained
accessors infer datum
event payloads infer datum
formatter values are typed
readonly data accepted
```

Do not rely only on runtime tests.

---

## 16.152 Type Regression Tests

When changing chart APIs, ensure type-level behavior remains stable.

A refactor that still renders correctly but loses:

```text
literal inference
autocomplete
```

is a regression.

---

## 16.153 Formatting Tests

Test representative locales:

```text
en-US
en-IN
de-DE
fr-FR
ar
ja-JP
```

for relevant utilities.

Verify:

```text
number separators
currency
percentages
dates
time zones
compact notation
```

Do not snapshot entire locale outputs across dozens of runtimes if results may vary by ICU version; target semantic expectations carefully.

---

## 16.154 RTL Tests

Test representative chart/detail UI under:

```text
dir="rtl"
```

Verify:

```text
legend
tooltip
actions
breadcrumbs
prop explorer
install console
mobile layouts
```

without blindly reversing chart-domain geometry.

---

## 16.155 Long-Label Tests

Test:

```text
German-style long labels
Arabic
CJK
Devanagari
mixed Latin/non-Latin
```

for:

```text
ticks
legend
tooltip
filter controls
state messages
```

---

## 16.156 Currency Tests

Test:

```text
USD
EUR
INR
JPY
```

including zero-decimal currency behavior where Intl applies.

Do not globally assume two decimals.

---

## 16.157 Date Tests

Test:

```text
UTC
Asia/Kolkata
America/New_York
```

especially around:

```text
day boundaries
DST changes
```

where relevant.

---

## 16.158 SSR Formatting Tests

Ensure server/client produce compatible output when locale/timezone is explicitly configured.

Avoid hydration mismatch.

---

## 16.159 Accessibility Tests with Localization

Verify accessible labels remain meaningful with:

```text
RTL text
localized numbers
localized dates
long translated labels
```

Do not test accessibility only in English.

---

## 16.160 Performance

Intl formatting should not be performed excessively for every datum during pointer movement.

Good:

```text
format active tooltip datum only
```

rather than:

```text
format all 50,000 points on every hover
```

---

## 16.161 No Localization Dependency Requirement

Do not add a large third-party i18n dependency to every registry component.

Use:

```text
native Intl
typed formatters
application integration
```

for V1.

---

## 16.162 Browser Polyfills

Do not bundle large Intl polyfills globally unless the supported browser matrix requires them.

Document compatibility and let applications/polyfill strategy handle older environments where appropriate.

---

## 16.163 Public Formatting Utilities

If formatting utilities become registry-installable/shared:

```text
small
dependency-free
Intl-based
```

is preferable.

Do not make consumers install a Plotcn runtime package.

---

## 16.164 Example Formatting API Philosophy

Keep utilities explicit:

```text
formatNumber(value, options)
formatCurrency(value, options)
```

rather than implicit global state.

This improves portability and testability.

---

## 16.165 Error Handling

Formatting invalid values should follow a clear contract.

Do not produce:

```text
NaN
Invalid Date
```

silently in chart UI.

Data validation should normally prevent these from reaching formatting.

Formatting helpers may still guard and fail predictably.

---

## 16.166 Missing Values

Missing values should use application/chart state conventions:

```text
—
No data
N/A
```

not pass through number/date formatting.

Formatting utilities operate on valid semantic values.

---

## 16.167 TypeScript and Formatting Boundary

Architecture:

```text
typed data
   ↓
validated semantic value
   ↓
typed formatter
   ↓
localized display string
```

This should remain consistent across engines.

---

## 16.168 Recharts Integration

Recharts adapters should consume typed formatters for:

```text
ticks
tooltips
labels
legends
```

without weakening the component's generic data type.

---

## 16.169 D3 Integration

D3 calculations should work on raw semantic values.

Formatting occurs at:

```text
tick generation/rendering
tooltip
labels
accessibility
```

not inside the scale domain itself.

---

## 16.170 Google Integration

Google data transformation should preserve raw values where Google expects them.

Formatting configuration should be mapped separately.

Avoid preformatting numbers into strings if that prevents correct chart scaling.

---

## 16.171 Canvas Integration

Canvas renderers should receive:

```text
raw geometry
formatted visible labels
```

separately.

Do not use preformatted strings as geometry input.

---

## 16.172 WebGL Future

WebGL buffers remain numeric.

Formatting belongs entirely in overlays/labels/tooltips/accessibility.

This clean separation makes future GPU rendering easier.

---

## 16.173 Documentation Structure

Create a future guide:

```text
/docs/typescript
/docs/formatting
/docs/internationalization
```

or combine intelligently under Fundamentals/Guides.

Avoid three shallow docs pages if one comprehensive guide is better.

---

## 16.174 Component Detail API Reference

Each detail page should show:

```text
Data type
Key constraints
Series type
Formatter type
Event types
```

in the Props/API area.

This is especially important for the 100+ component catalog.

---

## 16.175 Props Explorer Formatting Examples

For relevant props such as:

```text
valueFormatter
labelFormatter
```

the Prop Preview Lab should allow switching example locales.

Example:

```text
en-IN
₹12,34,567

de-DE
1.234.567 €
```

only where this improves documentation.

---

## 16.176 No Fake Locale Support Claims

Do not label:

```text
Fully internationalized
```

or:

```text
100+ languages supported
```

merely because `Intl` exists.

Claim only what is actually tested.

---

## 16.177 Internationalization Metadata

A chart metadata capability may eventually include:

```text
rtlTested
localeFormatting
```

only if the gallery/docs truly uses that distinction.

Do not add capability metadata merely for marketing.

---

## 16.178 V1 Requirements

V1 should guarantee:

```text
strict public TypeScript
no public any
typed keys/accessors
readonly input support
typed formatter callbacks
Intl-based number formatting
Intl-based currency formatting
Intl-based percentages
Intl-based date formatting
locale options
currency options
logical CSS where practical
RTL-safe UI chrome
no USD assumption
no English date assumption
```

---

## 16.179 V1 Non-Goals

Do not require:

```text
full translation management
Plotcn translation files
automatic locale detection provider
all world calendar systems
automatic currency inference
universal RTL chart-domain reversal
custom number parsing
built-in message catalogs
```

These are not necessary for a strong foundation.

---

## 16.180 Phase 2

Later:

```text
Playground locale testing
RTL preview switch
formatRange helpers
relative-time helpers
unit formatting
better locale-aware date scale policies
```

---

## 16.181 Phase 3

Later specialization:

```text
calendar-system support
advanced financial locale formatting
localized calendar heatmaps
locale-aware week conventions
specialized scientific notation
```

only where product demand exists.

---

## 16.182 Core TypeScript Invariants

Plotcn should preserve:

```text
01. Public APIs do not use any.

02. Consumer datum types remain generic.

03. Key-based APIs infer valid datum keys.

04. Numeric fields are constrained where practical.

05. Accessors remain strongly typed.

06. Literal series keys are preserved.

07. Readonly data/config is accepted.

08. Runtime validation still exists for unsafe external data.

09. Public event payloads are typed.

10. Engine-specific advanced types remain narrow and intentional.

11. Internal normalized types are not exposed unnecessarily.

12. Empty/loading data does not force weakening types.

13. Nullability reflects actual chart behavior.

14. Compile-time type behavior is tested.

15. Type sophistication never makes common usage unnecessarily difficult.
```

---

## 16.183 Core Formatting Invariants

```text
01. Formatting uses semantic raw values.

02. Intl APIs are preferred.

03. USD is never globally assumed.

04. en-US is never globally assumed.

05. Percent input semantics are explicit.

06. Dates are validated before formatting.

07. Time zones can be specified.

08. Compact formatting is locale-aware.

09. Axis and tooltip precision may differ intentionally.

10. Missing values do not pass through normal formatters.

11. Currency is explicit rather than inferred from locale.

12. Formatting does not mutate data.

13. Accessible output uses compatible locale semantics.

14. Formatting utilities remain renderer-neutral.

15. Chart engines share the same formatting philosophy.
```

---

## 16.184 Core Internationalization Invariants

```text
01. Plotcn does not assume LTR UI.

02. Logical CSS properties are preferred.

03. UI direction and data-domain direction remain separate.

04. Consumer labels are not forcibly uppercased.

05. Long translated labels are tested.

06. Unicode text works in ticks, legends and tooltips.

07. Mixed-direction text remains readable.

08. Brand/registry identifiers remain stable and untranslated.

09. Components integrate with application i18n rather than replacing it.

10. Plotcn ships no mandatory localization runtime.

11. SSR locale behavior should be deterministic when configured.

12. Localization support is tested rather than merely claimed.
```

---

## 16.185 Recommended Package Ownership

```text
chart-core/
├── formatting/
│   ├── number
│   ├── currency
│   ├── percentage
│   ├── compact
│   ├── date
│   └── duration
│
└── types/
    ├── accessors
    ├── keys
    └── shared
```

React-specific localized UI remains in:

```text
chart-react
```

or website/application components.

Do not create a standalone `chart-i18n` package until real reuse proves necessary.

---

## 16.186 Definition of Done

This section is complete when:

```text
strict TypeScript passes

no public chart prop uses any

reference charts infer data keys correctly

invalid series keys fail compilation

typed accessors work

formatter callbacks infer their values

formatNumber is locale-aware

formatCurrency requires/supports currency

formatPercentage has explicit input semantics

formatCompact uses Intl

formatDate supports locale/timezone options

formatDuration has documented units

light/dark layouts work in RTL UI

tooltips and legends use logical alignment

consumer labels support Unicode

SSR/client formatting can be deterministic

representative locale tests pass
```

---

## 16.187 Final Architecture

```text
                    CONSUMER DATA TYPE
                           │
                           ▼
                     Strict TypeScript
                    keys / accessors
                           │
                           ▼
                    Runtime validation
                           │
                           ▼
                     Semantic values
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼

           Geometry     Interaction   Formatting
                                      │
                                      ▼
                                   Intl APIs
                                      │
                       ┌──────────────┼──────────────┐
                       ▼              ▼              ▼

                    Locale         Currency       Time zone
                       │              │              │
                       └──────────────┼──────────────┘
                                      ▼
                              Display / A11y
                                      │
                                      ▼
                                User locale
```

Directionality remains parallel:

```text
Application direction
        │
        ▼
Logical UI layout
        │
        ├── toolbar
        ├── legend
        ├── tooltip
        ├── documentation
        └── controls

Data-domain direction
        │
        ▼
chart-specific semantic policy
```

The governing principle is:

> **Plotcn should know the type and meaning of a value before it formats it, and it should know the user's formatting context before it displays it.**

And the internationalization principle is:

> **Locale, currency, timezone, script, and text direction are application concerns that Plotcn must respect—not assumptions Plotcn should silently make.**
