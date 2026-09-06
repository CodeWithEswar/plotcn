import { ChartPreview } from "./chart-preview"
import { Icon } from "./icons"

export function EngineSection() {
  return (
    <section id="engines" className="section engine-section">
      <div className="site-container">
        <div className="section-topline">
          <span className="eyebrow">02 / THE ENGINE ROOM</span>
          <span className="section-note">CHOOSE YOUR LEVEL OF CONTROL</span>
        </div>
        <div className="engine-intro">
          <h2>Three engines.<br /><span>One visual language.</span></h2>
          <p>Declarative React dashboards, low-level canvas geometry, or mature geographic choropleths.<br />You shouldn’t have to choose between speed, control, and reach.</p>
        </div>
        <div className="engine-comparison grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Engine 1: Recharts */}
          <article className="flex flex-col">
            <div className="engine-name">
              <span className="engine-number">01</span>
              <h3>Recharts</h3>
              <span className="engine-pill">COMPOSE</span>
            </div>
            <p>From data to dashboard, beautifully fast.</p>
            <div className="engine-plot">
              <ChartPreview kind="area" compact />
            </div>
            <ul className="flex-1">
              <li><Icon name="check" />Declarative React components</li>
              <li><Icon name="check" />Familiar charts, thoughtful defaults</li>
              <li><Icon name="check" />Tooltips, legends, and responsive containers</li>
            </ul>
            <a href="https://recharts.org" target="_blank" rel="noreferrer" className="text-link mt-4">
              Explore Recharts<Icon name="external" />
            </a>
          </article>

          {/* Engine 2: D3.js */}
          <article className="flex flex-col">
            <div className="engine-name">
              <span className="engine-number">02</span>
              <h3>D3.js</h3>
              <span className="engine-pill">CREATE</span>
            </div>
            <p>When your data calls for a different kind of canvas.</p>
            <div className="engine-plot">
              <ChartPreview kind="stream" compact />
            </div>
            <ul className="flex-1">
              <li><Icon name="check" />Scales, shapes, and custom geometry</li>
              <li><Icon name="check" />Hierarchy, networks, and raw math</li>
              <li><Icon name="check" />Direct control over every visual decision</li>
            </ul>
            <a href="https://d3js.org" target="_blank" rel="noreferrer" className="text-link mt-4">
              Explore D3<Icon name="external" />
            </a>
          </article>

          {/* Engine 3: Google Charts */}
          <article className="flex flex-col">
            <div className="engine-name">
              <span className="engine-number">03</span>
              <h3>Google Charts</h3>
              <span className="engine-pill">SCALE</span>
            </div>
            <p>Battle-tested charting and geographic choropleths.</p>
            <div className="engine-plot">
              <ChartPreview kind="geochart" compact />
            </div>
            <ul className="flex-1">
              <li><Icon name="check" />Global choropleths & regional GeoCharts</li>
              <li><Icon name="check" />Enterprise timelines, gauges & core charts</li>
              <li><Icon name="check" />Dark theme adapters & responsive resize</li>
            </ul>
            <a href="/docs/google-charts" className="text-link mt-4">
              Explore Google Charts<Icon name="external" />
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
