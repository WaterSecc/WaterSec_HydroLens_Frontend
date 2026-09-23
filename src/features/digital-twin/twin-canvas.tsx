import { Background, BackgroundVariant, Controls, Handle, MiniMap, Position, ReactFlow, type Edge, type Node, type NodeProps } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import type { DigitalTwinModel, TwinComponent } from './model'
import { cn } from '@/lib/utils'

type TwinNode = Node<{ component: TwinComponent }, 'twinComponent'>

function ComponentNode({ data, selected }: NodeProps<TwinNode>) {
  const { component } = data
  const Icon = component.icon
  return <div className={cn('group relative w-[190px] rounded-xl border bg-card p-3 shadow-[0_8px_25px_rgb(15_23_42/.08)] transition-all duration-200', selected ? 'border-primary ring-4 ring-primary/10 shadow-lg' : 'hover:-translate-y-0.5 hover:border-primary/40')}>
    <Handle type="target" position={Position.Left} className="!size-2 !border-2 !border-card !bg-primary" />
    <div className="flex items-center gap-3"><span className={cn('grid size-10 shrink-0 place-items-center rounded-lg', component.kind === 'source' ? 'bg-blue-500 text-white' : component.kind === 'recreation' ? 'bg-cyan-500/10 text-cyan-600' : component.kind === 'service' ? 'bg-violet-500/10 text-violet-600' : component.kind === 'utility' ? 'bg-amber-500/10 text-amber-600' : 'bg-primary/10 text-primary')}><Icon className="size-5" /></span><div className="min-w-0"><p className="truncate text-sm font-semibold">{component.name}</p><div className="mt-1 flex items-center gap-1.5"><span className={cn('size-1.5 rounded-full', component.status === 'operational' ? 'bg-emerald-500' : component.status === 'attention' ? 'bg-amber-400' : 'bg-slate-400')} /><span className="text-[10px] capitalize text-muted-foreground">{component.status}</span></div></div></div>
    <div className="mt-3 flex items-end justify-between border-t pt-2"><span className="text-[10px] text-muted-foreground">Expected demand</span><span className="text-xs font-bold">{component.expectedDemand.value} <span className="font-medium text-muted-foreground">{component.expectedDemand.unit}</span></span></div>
    <Handle type="source" position={Position.Right} className="!size-2 !border-2 !border-card !bg-primary" />
  </div>
}

const nodeTypes = { twinComponent: ComponentNode }

export function TwinCanvas({ model, selectedId, onSelect }: { model: DigitalTwinModel; selectedId?: string; onSelect: (component: TwinComponent) => void }) {
  const nodes: TwinNode[] = model.components.map((component) => ({ id: component.id, type: 'twinComponent', position: component.position, selected: selectedId === component.id, data: { component }, draggable: true }))
  const edges: Edge[] = model.connections.map((connection) => ({ id: connection.id, source: connection.source, target: connection.target, label: connection.label, type: 'smoothstep', animated: true, style: { stroke: 'var(--primary)', strokeWidth: 1.5, opacity: .55 }, labelStyle: { fill: 'var(--muted-foreground)', fontSize: 9 }, labelBgStyle: { fill: 'var(--card)', fillOpacity: .9 } }))
  return <ReactFlow<TwinNode> className="!bg-[#f4f9ff]" nodes={nodes} edges={edges} nodeTypes={nodeTypes} onNodeClick={(_, node) => onSelect(node.data.component)} fitView fitViewOptions={{ padding: .12 }} minZoom={.3} maxZoom={1.8} proOptions={{ hideAttribution: true }} colorMode="light">
    <Background variant={BackgroundVariant.Dots} gap={26} size={1.2} color="#b8d2f0" />
    <MiniMap position="bottom-left" pannable zoomable nodeColor={(node) => node.id === 'supply' ? '#3b82f6' : node.id === selectedId ? '#06b6d4' : '#94a3b8'} className="!rounded-lg !border !border-border !bg-card" maskColor="color-mix(in oklab, var(--background) 75%, transparent)" />
    <Controls position="bottom-right" showInteractive={false} className="!overflow-hidden !rounded-lg !border !border-border !bg-card !shadow-md [&_button]:!border-border [&_button]:!bg-card [&_button]:!fill-foreground" />
  </ReactFlow>
}
