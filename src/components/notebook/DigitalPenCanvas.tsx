import React, { useRef, useEffect, useState, useCallback } from 'react';
import { InkStroke } from '../../types';
import {
  Pen,
  Highlighter,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  Minimize2,
  Maximize2,
} from 'lucide-react';

interface DigitalPenCanvasProps {
  initialStrokes?: InkStroke[];
  onStrokesChange?: (strokes: InkStroke[]) => void;
  width?: number | string;
  height?: number | string;
  isActive?: boolean;
}

export const DigitalPenCanvas: React.FC<DigitalPenCanvasProps> = ({
  initialStrokes = [],
  onStrokesChange,
  width = '100%',
  height = '100%',
  isActive = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [tool, setTool] = useState<'pen' | 'highlighter' | 'fountain' | 'eraser'>('pen');
  const [color, setColor] = useState<string>('#1e3a8a'); // medical navy blue
  const [strokeWidth, setStrokeWidth] = useState<number>(2.5);
  const [strokes, setStrokes] = useState<InkStroke[]>(initialStrokes);
  const [undoStack, setUndoStack] = useState<InkStroke[][]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<InkStroke | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Sync initialStrokes when changing notebook/page
  useEffect(() => {
    setStrokes(initialStrokes);
  }, [initialStrokes]);

  // Color palette presets
  const colors = [
    { name: 'Navy Blue', hex: '#1e3a8a' },
    { name: 'Medical Red', hex: '#dc2626' },
    { name: 'Deep Black', hex: '#0f172a' },
    { name: 'Emerald Green', hex: '#059669' },
    { name: 'Purple', hex: '#7c3aed' },
    { name: 'Yellow Highlighter', hex: '#facc15' },
    { name: 'Pink Highlighter', hex: '#f43f5e' },
  ];

  // Redraw all strokes on canvas
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;

      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      if (stroke.tool === 'highlighter') {
        ctx.globalAlpha = 0.35;
        ctx.lineWidth = stroke.width * 3.5;
      } else {
        ctx.globalAlpha = 1.0;
      }

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        // Smooth quadratic curve midpoint interpolation
        const prev = stroke.points[i - 1];
        const curr = stroke.points[i];
        const midX = (prev.x + curr.x) / 2;
        const midY = (prev.y + curr.y) / 2;
        ctx.quadraticCurveTo(prev.x, prev.y, midX, midY);
      }
      ctx.lineTo(
        stroke.points[stroke.points.length - 1].x,
        stroke.points[stroke.points.length - 1].y
      );
      ctx.stroke();
      ctx.restore();
    }
  }, [strokes]);

  // Handle resizing canvas resolution to match container
  useEffect(() => {
    const updateCanvasSize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        // High DPI sharpness
        const dpr = window.devicePixelRatio || 1;
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        canvas.style.width = `${rect.width}px`;
        canvas.style.height = `${rect.height}px`;

        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
        }
        redraw();
      }
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [redraw, isFullscreen]);

  // Pointer event handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);

    if (tool === 'eraser') {
      // Stroke eraser: erase strokes that are close to pointer
      eraseNear(x, y);
      return;
    }

    const newStroke: InkStroke = {
      points: [{ x, y }],
      color: tool === 'highlighter' ? color : color,
      width: strokeWidth,
      tool,
    };

    currentStrokeRef.current = newStroke;
    setUndoStack((prev) => [...prev, strokes]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !isActive) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'eraser') {
      eraseNear(x, y);
      return;
    }

    if (currentStrokeRef.current) {
      currentStrokeRef.current.points.push({ x, y });

      // Real-time incremental stroke segment rendering
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = currentStrokeRef.current.color;
        ctx.lineWidth = currentStrokeRef.current.tool === 'highlighter' ? strokeWidth * 3.5 : strokeWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.globalAlpha = currentStrokeRef.current.tool === 'highlighter' ? 0.35 : 1.0;

        const pts = currentStrokeRef.current.points;
        const len = pts.length;
        if (len >= 2) {
          ctx.moveTo(pts[len - 2].x, pts[len - 2].y);
          ctx.lineTo(pts[len - 1].x, pts[len - 1].y);
          ctx.stroke();
        }
        ctx.restore();
      }
    }
  };

  const handlePointerUp = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    if (currentStrokeRef.current && currentStrokeRef.current.points.length > 1) {
      const updated = [...strokes, currentStrokeRef.current];
      setStrokes(updated);
      onStrokesChange?.(updated);
    }
    currentStrokeRef.current = null;
    redraw();
  };

  const eraseNear = (x: number, y: number) => {
    const threshold = strokeWidth * 6;
    const filtered = strokes.filter((st) => {
      return !st.points.some(
        (p) => Math.hypot(p.x - x, p.y - y) < threshold
      );
    });

    if (filtered.length !== strokes.length) {
      setStrokes(filtered);
      onStrokesChange?.(filtered);
    }
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    setUndoStack((prev) => prev.slice(0, prev.length - 1));
    setStrokes(previous);
    onStrokesChange?.(previous);
  };

  const handleClear = () => {
    if (strokes.length === 0) return;
    setUndoStack((prev) => [...prev, strokes]);
    setStrokes([]);
    onStrokesChange?.([]);
  };

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${
        isFullscreen ? 'fixed inset-0 z-50 bg-white/95 dark:bg-[#140e0a]/95 p-6' : ''
      }`}
      style={{ width, height }}
    >
      {/* Floating Digital Stylus Pen Toolbar */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 px-3 py-1.5 bg-[#1a120d]/95 dark:bg-[#1a120d]/95 text-[#efe4d4] backdrop-blur-md rounded-full shadow-xl border border-[#4b3322]/70">
        {/* Tool selectors */}
        <button
          onClick={() => setTool('pen')}
          title="Ballpoint / Fine Pen"
          className={`p-1.5 rounded-full transition-colors ${
            tool === 'pen' ? 'bg-sky-600 text-white' : 'hover:bg-[#2b1e15] text-stone-300'
          }`}
        >
          <Pen className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('highlighter')}
          title="Translucent Highlighter"
          className={`p-1.5 rounded-full transition-colors ${
            tool === 'highlighter' ? 'bg-amber-400 text-[#140e0a] font-bold' : 'hover:bg-[#2b1e15] text-stone-300'
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>

        <button
          onClick={() => setTool('eraser')}
          title="Eraser"
          className={`p-1.5 rounded-full transition-colors ${
            tool === 'eraser' ? 'bg-[#7f1d1d] text-[#fdf2f2]' : 'hover:bg-[#2b1e15] text-stone-300'
          }`}
        >
          <Eraser className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#382518] mx-1" />

        {/* Color buttons */}
        <div className="flex items-center gap-1">
          {colors.map((c) => (
            <button
              key={c.hex}
              onClick={() => {
                setColor(c.hex);
                if (tool === 'eraser') setTool('pen');
              }}
              title={c.name}
              className={`w-4 h-4 rounded-full border transition-transform ${
                color === c.hex && tool !== 'eraser' ? 'scale-125 border-white ring-2 ring-amber-400' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>

        <div className="w-px h-4 bg-[#382518] mx-1" />

        {/* Thickness selector */}
        <select
          value={strokeWidth}
          onChange={(e) => setStrokeWidth(Number(e.target.value))}
          className="bg-[#251a12] text-[11px] text-[#efe4d4] px-1.5 py-0.5 rounded border border-[#382518] font-mono outline-none cursor-pointer"
        >
          <option value={1.5}>Fine 1.5px</option>
          <option value={2.5}>Medium 2.5px</option>
          <option value={4}>Thick 4px</option>
          <option value={8}>Marker 8px</option>
        </select>

        <div className="w-px h-4 bg-[#382518] mx-1" />

        {/* Undo and Clear */}
        <button
          onClick={handleUndo}
          disabled={undoStack.length === 0}
          title="Undo Stroke"
          className="p-1.5 text-stone-300 hover:text-[#efe4d4] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={handleClear}
          title="Clear Digital Ink"
          className="p-1.5 text-stone-300 hover:text-[#c94a4f]"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={() => setIsFullscreen(!isFullscreen)}
          title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Drawing Canvas'}
          className="p-1.5 text-stone-300 hover:text-[#efe4d4] ml-0.5"
        >
          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Drawing Canvas overlay */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        className="absolute inset-0 z-20 touch-none cursor-crosshair"
      />
    </div>
  );
};
