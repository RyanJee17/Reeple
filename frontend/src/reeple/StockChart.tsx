import { useMemo, useState } from 'react';
import { StockButton as Button } from './StockButton';
import { STOCK_STATUS, type StockAnalysis } from './stock';

const decimal = (value: number | null) => value === null ? '—' : value.toLocaleString('fr-FR', { maximumFractionDigits: 1 });

export function StockSparkline({ values, title = 'Ventes sur 12 semaines' }: { values?: number[]; title?: string }) {
  if (!values) return <span className="stock-missing">Historique absent</span>;
  const max = Math.max(1, ...values);
  return <svg className="stock-sparkline" viewBox="0 0 144 38" role="img" aria-label={`${title} : ${values.join(', ')}`}>
    <title>{title}</title>
    <line x1="0" y1="37" x2="144" y2="37" className="stock-spark-baseline" />
    {values.map((value, index) => <rect key={index} x={index * 12 + 1} y={37 - Math.max(1, value / max * 34)} width="8" height={Math.max(1, value / max * 34)} className={index >= 8 ? 'recent' : ''} />)}
  </svg>;
}

export function StockShape({ status, x = 0, y = 0, size = 6 }: { status: StockAnalysis['status']; x?: number; y?: number; size?: number }) {
  if (status === 'watch') return <path d={`M ${x} ${y - size} L ${x + size} ${y + size} L ${x - size} ${y + size} Z`} />;
  if (status === 'overstock') return <rect x={x - size} y={y - size} width={size * 2} height={size * 2} />;
  if (status === 'dormant') return <path d={`M ${x} ${y - size} L ${x + size} ${y} L ${x} ${y + size} L ${x - size} ${y} Z`} />;
  return <circle cx={x} cy={y} r={size} />;
}

interface StockChartProps {
  analyses: StockAnalysis[];
  selected?: StockAnalysis;
  markers: Map<string, number>;
  onSelect: (id: string) => void;
  onViewRow: (id: string) => void;
}

export function StockChart({ analyses, selected, markers, onSelect, onViewRow }: StockChartProps) {
  const [showOk, setShowOk] = useState(false);
  const [focusFamily, setFocusFamily] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const available = useMemo(() => analyses.filter(item => item.age !== null && item.averageSales !== null), [analyses]);
  const candidates = available.filter(item => showOk || item.status !== 'ok');
  const points = candidates.slice(0, 750);
  const hovered = points.find(item => item.reference.id === hoveredId);
  const width = 900, height = 600, left = 64, right = 24, top = 38, bottom = 84;
  const chartWidth = width - left - right, chartHeight = height - top - bottom;
  const xMax = Math.max(360, Math.ceil(Math.max(0, ...points.map(item => item.age ?? 0)) / 90) * 90);
  const threshold = selected?.reference.minimumWeeklySales;
  const yMax = Math.max(8, Math.ceil(Math.max((threshold ?? 0) * 1.5, ...points.map(item => item.averageSales ?? 0)) / 2) * 2);
  const x = (age: number) => left + age / xMax * chartWidth;
  const y = (sales: number) => top + chartHeight - sales / yMax * chartHeight;
  const excluded = analyses.length - available.length;

  return <div className="stock-chart-panel">
    <div className="stock-chart-heading"><div><h2>Ancienneté et ventes</h2><p>{selected ? <>Seuil de {selected.reference.title} · {selected.reference.family ?? 'famille non renseignée'}</> : 'Un point par référence · taille selon le stock'}</p></div><Button className="stock-button stock-small" variant="ghost" aria-pressed={focusFamily} onClick={() => setFocusFamily(!focusFamily)}>{focusFamily ? 'Tout voir' : 'Isoler la famille'}</Button></div>
    <div className="stock-chart-meta"><button onClick={() => setShowOk(!showOk)}>{showOk ? 'Masquer les références OK' : `${available.filter(item => item.status === 'ok').length} OK masquées · afficher`}</button><span>Ventes moyennes · 4 dernières semaines</span></div>
    {!available.length ? <div className="stock-chart-empty"><h3>Les données du graphique manquent encore.</h3><p>Ajoutez les 12 semaines de ventes et la date d’entrée en stock dans votre prochain export. Le tableau reste consultable.</p></div> : <div className="stock-chart-canvas" onMouseLeave={() => setHoveredId(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="group" aria-label="Ancienneté en stock et ventes moyennes. Sélectionnez un repère pour retrouver sa référence.">
        <title>Ancienneté et ventes de votre stock</title>
        {threshold !== undefined && <>
          <rect x={left} y={y(Math.min(yMax, threshold * 1.5))} width={chartWidth} height={Math.max(0, y(threshold) - y(Math.min(yMax, threshold * 1.5)))} className="stock-chart-zone" />
          <line x1={left} x2={width - right} y1={y(threshold)} y2={y(threshold)} className="stock-chart-threshold" />
          <text x={width - right - 8} y={y(threshold) + 22} textAnchor="end" className="stock-chart-axis-label">Seuil renseigné · {threshold} ventes / sem.</text>
          <text x={width - right - 8} y={y(Math.min(yMax, threshold * 1.5)) + 20} textAnchor="end" className="stock-chart-axis-label">Zone de vigilance</text>
        </>}
        {[0, 1, 2, 3, 4].map(index => {
          const value = yMax / 4 * index;
          return <g key={`y-${index}`}><line x1={left} x2={width - right} y1={y(value)} y2={y(value)} className="stock-chart-grid" /><text x={left - 14} y={y(value) + 5} textAnchor="end" className="stock-chart-axis-label">{decimal(value)}</text></g>;
        })}
        {[0, 1, 2, 3, 4].map(index => {
          const value = xMax / 4 * index;
          return <g key={`x-${index}`}><line x1={x(value)} x2={x(value)} y1={top} y2={height - bottom} className="stock-chart-grid" /><text x={x(value)} y={height - bottom + 27} textAnchor="middle" className="stock-chart-axis-label">{Math.round(value)} j</text></g>;
        })}
        <line x1={left} x2={width - right} y1={height - bottom} y2={height - bottom} className="stock-chart-axis" />
        <line x1={left} x2={left} y1={top} y2={height - bottom} className="stock-chart-axis" />
        <text x={width - right} y={height - 22} textAnchor="end" className="stock-chart-axis-label">Ancienneté (jours en stock)</text>
        <text transform={`translate(19 ${top + chartHeight / 2}) rotate(-90)`} textAnchor="middle" className="stock-chart-axis-label">Ventes / semaine (moy. 4 sem.)</text>
        {points.map(item => {
          const id = item.reference.id;
          const pointX = x(item.age!), pointY = y(item.averageSales!);
          const size = Math.min(19, Math.max(6, Math.sqrt(item.reference.stock) * 3));
          const marker = markers.get(id);
          const muted = focusFamily && selected?.reference.family !== item.reference.family;
          return <g key={id} role="button" tabIndex={0} aria-label={`${item.reference.title} : ${STOCK_STATUS[item.status].label}, ${item.reference.stock} en stock, ${decimal(item.averageSales)} ventes par semaine`} aria-pressed={selected?.reference.id === id} className={`stock-chart-point ${item.status} ${muted ? 'muted' : ''} ${selected?.reference.id === id ? 'selected' : ''}`} onClick={() => { onSelect(id); setHoveredId(id); }} onMouseEnter={() => setHoveredId(id)} onFocus={() => setHoveredId(id)} onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelect(id); setHoveredId(id); } }}>
            <circle cx={pointX} cy={pointY} r={Math.max(16, size + 3)} className="stock-chart-hit" />
            <StockShape status={item.status} x={pointX} y={pointY} size={size} />
            {marker && <g className="stock-chart-marker"><line x1={pointX + size / 2} x2={pointX + 29} y1={pointY - size / 2} y2={Math.max(16, pointY - 30)} /><circle cx={pointX + 30} cy={Math.max(16, pointY - 30)} r="13" /><text x={pointX + 30} y={Math.max(16, pointY - 30) + 4} textAnchor="middle">{marker}</text></g>}
          </g>;
        })}
      </svg>
      {hovered && <div className="stock-chart-tooltip" style={{ left: `${Math.min(65, Math.max(10, x(hovered.age!) / width * 100 - 8))}%`, top: `${Math.max(8, Math.min(58, y(hovered.averageSales!) / height * 100 - 28))}%` }}>
        <strong>{hovered.reference.title}</strong><span>{hovered.reference.publisher ?? 'Éditeur non renseigné'} · {hovered.reference.family ?? 'Famille non renseignée'}</span>
        <div className="stock-tooltip-metrics"><span>Stock<b>{hovered.reference.stock}</b></span><span>Ventes / sem.<b>{decimal(hovered.averageSales)}</b></span><span>Couverture<b>{decimal(hovered.coverage)} sem.</b></span></div>
        <StockSparkline values={hovered.reference.weeklySales} />
        <button onClick={() => { onViewRow(hovered.reference.id); setHoveredId(null); }}>Voir dans le tableau ↓</button>
      </div>}
    </div>}
    <div className="stock-chart-legend">{(['watch', 'overstock', 'dormant', 'ok'] as const).map(status => <span key={status} className={`stock-legend-item ${status}`}><svg viewBox="0 0 20 20" aria-hidden="true"><StockShape status={status} x={10} y={10} size={5} /></svg>{STOCK_STATUS[status].label}</span>)}<span className="stock-size-legend"><i /><span>5 ex.</span><i className="large" /><span>25 ex.</span></span><span className="stock-legend-item"><b className="stock-marker-number">n</b>Suggestion Reeple</span></div>
    {(excluded > 0 || candidates.length > 750) && <p className="stock-chart-limit">{excluded > 0 && `${excluded} référence(s) sans date d’entrée ou historique restent uniquement dans le tableau. `}{candidates.length > 750 && `750 repères affichés sur ${candidates.length}. Affinez les filtres pour consulter les autres.`}</p>}
  </div>;
}
