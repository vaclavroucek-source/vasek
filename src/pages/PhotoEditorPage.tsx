import { useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Minus, Plus, Trash2, Type, Upload } from 'lucide-react';

interface TextEl {
  id: string;
  content: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
}

interface PhotoState {
  src: string;
  x: number;
  y: number;
  scale: number;
}

interface DragState {
  kind: 'photo' | 'text';
  pointerId: number;
  startCx: number;
  startCy: number;
  startOx: number;
  startOy: number;
  textId?: string;
  moved: boolean;
}

interface PinchState {
  active: boolean;
  pointers: Map<number, { x: number; y: number }>;
  startDist: number;
  startScale: number;
}

const SYNE = "'Syne', sans-serif";

export function PhotoEditorPage() {
  const [photo, setPhoto] = useState<PhotoState | null>(null);
  const [texts, setTexts] = useState<TextEl[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const pinchRef = useRef<PinchState>({
    active: false,
    pointers: new Map(),
    startDist: 0,
    startScale: 1,
  });

  const selectedText = texts.find(t => t.id === selectedId) ?? null;

  // ── File ─────────────────────────────────────────────────────────────────

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const src = URL.createObjectURL(file);
    setPhoto({ src, x: 0, y: 0, scale: 1 });
    setSelectedId(null);
    e.target.value = '';
  };

  const onImgLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const scale = Math.min(
      canvas.clientWidth / img.naturalWidth,
      canvas.clientHeight / img.naturalHeight,
    );
    setPhoto(p => p ? { ...p, scale } : p);
  };

  // ── Texts ─────────────────────────────────────────────────────────────────

  const addText = () => {
    const cw = canvasRef.current?.clientWidth ?? 300;
    const ch = canvasRef.current?.clientHeight ?? 400;
    const id = uuidv4();
    setTexts(prev => [
      ...prev,
      { id, content: 'Text', x: cw / 2 - 40, y: ch / 2 - 24, fontSize: 40, color: '#ffffff' },
    ]);
    setSelectedId(id);
  };

  const deleteSelected = () => {
    setTexts(prev => prev.filter(t => t.id !== selectedId));
    setSelectedId(null);
  };

  const patch = (updates: Partial<TextEl>) =>
    setTexts(prev => prev.map(t => (t.id === selectedId ? { ...t, ...updates } : t)));

  const clampScale = (s: number) => Math.max(0.05, Math.min(8, s));

  // ── Canvas pointer (photo pan + pinch) ───────────────────────────────────

  const onCanvasDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('[data-txt]')) return;

    setSelectedId(null);

    const pin = pinchRef.current;
    pin.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (pin.pointers.size === 1 && photo) {
      dragRef.current = {
        kind: 'photo',
        pointerId: e.pointerId,
        startCx: e.clientX,
        startCy: e.clientY,
        startOx: photo.x,
        startOy: photo.y,
        moved: false,
      };
    } else if (pin.pointers.size === 2 && photo) {
      dragRef.current = null;
      const pts = Array.from(pin.pointers.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      pin.active = true;
      pin.startDist = dist;
      pin.startScale = photo.scale;
    }
  };

  const onCanvasMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const pin = pinchRef.current;
    pin.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

    if (pin.active && pin.pointers.size === 2) {
      const pts = Array.from(pin.pointers.values());
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      setPhoto(p => p ? { ...p, scale: clampScale((dist / pin.startDist) * pin.startScale) } : p);
      return;
    }

    const drag = dragRef.current;
    if (!drag || drag.kind !== 'photo' || drag.pointerId !== e.pointerId) return;
    const dx = e.clientX - drag.startCx;
    const dy = e.clientY - drag.startCy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    if (drag.moved) setPhoto(p => p ? { ...p, x: drag.startOx + dx, y: drag.startOy + dy } : p);
  };

  const onCanvasUp = (e: React.PointerEvent<HTMLDivElement>) => {
    pinchRef.current.pointers.delete(e.pointerId);
    if (pinchRef.current.pointers.size < 2) pinchRef.current.active = false;
    if (dragRef.current?.pointerId === e.pointerId) dragRef.current = null;
  };

  // ── Text element pointer (drag) ───────────────────────────────────────────

  const onTextDown = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    const el = texts.find(t => t.id === id);
    if (!el) return;
    dragRef.current = {
      kind: 'text',
      textId: id,
      pointerId: e.pointerId,
      startCx: e.clientX,
      startCy: e.clientY,
      startOx: el.x,
      startOy: el.y,
      moved: false,
    };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onTextMove = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    const drag = dragRef.current;
    if (!drag || drag.kind !== 'text' || drag.textId !== id) return;
    const dx = e.clientX - drag.startCx;
    const dy = e.clientY - drag.startCy;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) drag.moved = true;
    if (drag.moved)
      setTexts(prev =>
        prev.map(t => (t.id === id ? { ...t, x: drag.startOx + dx, y: drag.startOy + dy } : t)),
      );
  };

  const onTextUp = (e: React.PointerEvent<HTMLDivElement>, id: string) => {
    const drag = dragRef.current;
    if (!drag || drag.textId !== id) return;
    if (!drag.moved) setSelectedId(prev => (prev === id ? null : id));
    dragRef.current = null;
  };

  return (
    <div
      className="flex flex-col bg-neutral-950"
      style={{ minHeight: '100dvh', fontFamily: SYNE }}
    >
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <header className="shrink-0 flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800">
        <h1 className="text-white font-bold text-lg tracking-tight">Photo Editor</h1>
        <div className="flex gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-neutral-800 text-neutral-200 text-sm font-bold active:bg-neutral-700 transition-colors"
          >
            <Upload size={15} />
            Foto
          </button>
          <button
            onClick={addText}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold active:bg-blue-500 transition-colors"
          >
            <Type size={15} />
            Text
          </button>
        </div>
      </header>

      <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      {/* ── Canvas ───────────────────────────────────────────────────────── */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-hidden select-none"
        style={{
          minHeight: '55dvh',
          background: '#0d0d0d',
          touchAction: 'none',
          cursor: photo ? 'grab' : 'default',
        }}
        onPointerDown={onCanvasDown}
        onPointerMove={onCanvasMove}
        onPointerUp={onCanvasUp}
        onPointerCancel={onCanvasUp}
      >
        {/* Empty state */}
        {!photo && (
          <button
            className="absolute inset-0 flex flex-col items-center justify-center text-neutral-700 w-full"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={56} strokeWidth={1.2} />
            <span className="mt-4 text-base font-bold text-neutral-600">Nahrát fotku</span>
            <span className="mt-1 text-sm text-neutral-700">Klepni pro výběr</span>
          </button>
        )}

        {/* Photo */}
        {photo && (
          <img
            src={photo.src}
            alt=""
            onLoad={onImgLoad}
            draggable={false}
            className="absolute pointer-events-none max-w-none"
            style={{
              top: '50%',
              left: '50%',
              transform: `translate(calc(-50% + ${photo.x}px), calc(-50% + ${photo.y}px)) scale(${photo.scale})`,
              transformOrigin: 'center',
            }}
          />
        )}

        {/* Text elements */}
        {texts.map(el => (
          <div
            key={el.id}
            data-txt="1"
            className="absolute whitespace-pre"
            style={{
              left: el.x,
              top: el.y,
              fontSize: el.fontSize,
              color: el.color,
              fontFamily: SYNE,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              textShadow: '0 2px 12px rgba(0,0,0,0.7)',
              cursor: 'move',
              touchAction: 'none',
              userSelect: 'none',
              outline: selectedId === el.id ? '2px solid #3b82f6' : 'none',
              outlineOffset: 6,
            }}
            onPointerDown={e => onTextDown(e, el.id)}
            onPointerMove={e => onTextMove(e, el.id)}
            onPointerUp={e => onTextUp(e, el.id)}
            onPointerCancel={e => onTextUp(e, el.id)}
          >
            {el.content}
          </div>
        ))}
      </div>

      {/* ── Scale strip ──────────────────────────────────────────────────── */}
      {photo && (
        <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-neutral-900 border-t border-neutral-800">
          <button
            className="p-1.5 rounded-lg text-neutral-400 active:text-white active:bg-neutral-700 transition-colors"
            onClick={() => setPhoto(p => p ? { ...p, scale: clampScale(p.scale - 0.1) } : p)}
          >
            <Minus size={16} />
          </button>
          <input
            type="range"
            min={0.05}
            max={8}
            step={0.01}
            value={photo.scale}
            onChange={e => setPhoto(p => p ? { ...p, scale: parseFloat(e.target.value) } : p)}
            className="flex-1 accent-blue-500"
            style={{ height: 4 }}
          />
          <button
            className="p-1.5 rounded-lg text-neutral-400 active:text-white active:bg-neutral-700 transition-colors"
            onClick={() => setPhoto(p => p ? { ...p, scale: clampScale(p.scale + 0.1) } : p)}
          >
            <Plus size={16} />
          </button>
          <span className="text-neutral-600 text-xs tabular-nums w-10 text-right">
            {photo.scale.toFixed(2)}×
          </span>
        </div>
      )}

      {/* ── Text properties ──────────────────────────────────────────────── */}
      {selectedText && (
        <div className="shrink-0 px-4 pt-3 pb-5 bg-neutral-900 border-t border-neutral-800 space-y-3">
          {/* Text input + delete */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={selectedText.content}
              onChange={e => patch({ content: e.target.value })}
              className="flex-1 bg-neutral-800 text-white rounded-xl px-3 py-2.5 text-base outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Text…"
              style={{ fontFamily: SYNE, fontWeight: 700 }}
            />
            <button
              onClick={deleteSelected}
              className="p-2.5 rounded-xl bg-red-950/60 text-red-400 active:bg-red-900 transition-colors shrink-0"
            >
              <Trash2 size={17} />
            </button>
          </div>

          {/* Size + color */}
          <div className="flex items-center gap-4">
            {/* Size */}
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <span className="text-neutral-500 text-xs shrink-0">Velikost</span>
              <input
                type="range"
                min={10}
                max={150}
                step={1}
                value={selectedText.fontSize}
                onChange={e => patch({ fontSize: parseInt(e.target.value) })}
                className="flex-1 accent-blue-500 min-w-0"
              />
              <span className="text-neutral-500 text-xs tabular-nums w-9 text-right shrink-0">
                {selectedText.fontSize}
              </span>
            </div>

            {/* Color */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-neutral-500 text-xs">Barva</span>
              <label className="cursor-pointer relative block w-9 h-9">
                <span
                  className="absolute inset-0 rounded-xl border-2 border-neutral-700"
                  style={{ background: selectedText.color }}
                />
                <input
                  type="color"
                  value={selectedText.color}
                  onChange={e => patch({ color: e.target.value })}
                  className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
