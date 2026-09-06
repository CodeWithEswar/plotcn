"use client"
import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
export class ChartBoundary extends Component<{children:ReactNode}, {failed:boolean}> {
  state = {failed:false}
  static getDerivedStateFromError() { return {failed:true} }
  render() { return this.state.failed ? <div className="chart-fallback" role="alert"><p>This preview could not load.</p><Button variant="outline" onClick={()=>this.setState({failed:false})}>Try again</Button></div> : this.props.children }
}
