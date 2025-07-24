"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Plus, Sun, Moon, ZoomIn, ZoomOut, LocateFixed, Save, Upload, Download, Trash2, Edit3, ChevronsRight, ChevronsLeft, ExternalLink, Copy, Orbit } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { TodoCardType, TodoLink, Point, AppState } from '@/lib/types';
import { getContrastingTextColor, detectUrlType, generateRandomColor } from '@/lib/utils';

// --- CONSTANTS ---
const CARD_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8',
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA', '#F1948A', '#AED6F1',
];
const MIN_ZOOM = 0.1;
const MAX_ZOOM = 3;
const LOCAL_STORAGE_KEY = 'todo-universe-state';
const BRIEF_MAX_LENGTH = 120;
const ORBIT_RADIUS = 350;

// --- DATA PERSISTENCE ---
const saveData = (state: AppState) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save state to localStorage", error);
  }
};

const loadData = (): AppState | null => {
  try {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      const parsed = JSON.parse(savedState);
      // Ensure backward compatibility
      parsed.cards = parsed.cards.map((card: any) => ({
        ...card,
        links: card.links || [],
      }));
      if (typeof parsed.orbitMode === 'undefined') {
        parsed.orbitMode = false;
      }
      return parsed;
    }
    return null;
  } catch (error) {
    console.error("Failed to load state from localStorage", error);
    return null;
  }
};

// --- SUB-COMPONENTS ---

const StarField = React.memo(({ theme, camera }: { theme: 'light' | 'dark', camera: AppState['camera'] }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const backgroundElements = useRef<any[]>([]).current;

    useEffect(() => {
        if (backgroundElements.length > 0) return; // Only generate once
        
        // Stars
        for (let i = 0; i < 1500; i++) {
            backgroundElements.push({
                type: 'star',
                x: Math.random() * 10000 - 5000,
                y: Math.random() * 10000 - 5000,
                size: Math.random() * 2 + 0.5,
                opacity: Math.random() * 0.7 + 0.3,
                twinkleSpeed: Math.random() * 0.015,
            });
        }
        
        // Galaxies/Nebulae
        for (let i = 0; i < 50; i++) {
            backgroundElements.push({
                type: 'nebula',
                x: Math.random() * 10000 - 5000,
                y: Math.random() * 10000 - 5000,
                size: Math.random() * 400 + 100,
                color: `rgba(${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 50 + 100)}, ${Math.floor(Math.random() * 50 + 155)}, ${Math.random() * 0.1 + 0.05})`,
            });
        }
    }, [backgroundElements]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = (time: number) => {
            if(!canvas) return;
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            
            const bgColor = theme === 'dark' ? '#000000' : '#0f172a';
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            backgroundElements.forEach(el => {
                const screenX = (el.x - camera.position.x) * camera.zoom + centerX;
                const screenY = (el.y - camera.position.y) * camera.zoom + centerY;
                
                if (el.type === 'star') {
                    if (screenX < 0 || screenX > canvas.width || screenY < 0 || screenY > canvas.height) return;
                    const twinkle = Math.abs(Math.sin(time * el.twinkleSpeed));
                    const starColor = theme === 'dark' ? `rgba(255, 255, 255, ${el.opacity * twinkle})` : `rgba(226, 232, 240, ${el.opacity * twinkle})`;
                    ctx.fillStyle = starColor;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, el.size * camera.zoom, 0, Math.PI * 2);
                    ctx.fill();
                } else if (el.type === 'nebula') {
                    const scaledSize = el.size * camera.zoom;
                    if (screenX + scaledSize < 0 || screenX - scaledSize > canvas.width || screenY + scaledSize < 0 || screenY - scaledSize > canvas.height) return;

                    const gradient = ctx.createRadialGradient(screenX, screenY, 0, screenX, screenY, scaledSize);
                    gradient.addColorStop(0, el.color);
                    gradient.addColorStop(1, 'transparent');
                    ctx.fillStyle = gradient;
                    ctx.fillRect(screenX - scaledSize, screenY - scaledSize, scaledSize * 2, scaledSize * 2);
                }
            });
            animationFrameId = requestAnimationFrame(render);
        };
        
        render(0);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme, camera, backgroundElements]);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full -z-10" />;
});

StarField.displayName = 'StarField';

const MeteorShower = React.memo(() => {
    const shouldReduceMotion = useReducedMotion();
    const [meteors, setMeteors] = useState<any[]>([]);

    useEffect(() => {
        if (shouldReduceMotion) return;

        const createMeteor = () => {
            const id = Date.now() + Math.random();
            const x = Math.random() * window.innerWidth * 1.5;
            const y = -50;
            const length = Math.random() * 100 + 50;
            const angle = Math.PI / 4;
            const duration = Math.random() * 3 + 2;
            setMeteors(prev => [...prev, { id, x, y, length, angle, duration }]);
            setTimeout(() => {
                setMeteors(prev => prev.filter(m => m.id !== id));
            }, duration * 1000);
        };

        const interval = setInterval(createMeteor, 2000);
        return () => clearInterval(interval);
    }, [shouldReduceMotion]);

    if (shouldReduceMotion) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden -z-10">
            <AnimatePresence>
                {meteors.map(meteor => (
                    <motion.div
                        key={meteor.id}
                        initial={{ x: meteor.x, y: meteor.y, opacity: 1 }}
                        animate={{
                            x: meteor.x - window.innerWidth,
                            y: meteor.y + window.innerWidth,
                            opacity: 0
                        }}
                        transition={{ duration: meteor.duration, ease: "linear" }}
                        style={{
                            position: 'absolute',
                            width: '2px',
                            height: `${meteor.length}px`,
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.8), rgba(255,255,255,0))',
                            transform: `rotate(${meteor.angle}rad)`,
                        }}
                    />
                ))}
            </AnimatePresence>
        </div>
    );
});

MeteorShower.displayName = 'MeteorShower';

const TodoCard = React.memo(({ card, camera, onUpdate, onDelete, onPositionChange, orbitMode, orbitAngle }: {
    card: TodoCardType;
    camera: AppState['camera'];
    onUpdate: (id: string, updates: Partial<TodoCardType>) => void;
    onDelete: (id: string) => void;
    onPositionChange: (id: string, pos: Point) => void;
    orbitMode: boolean;
    orbitAngle: number;
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editBrief, setEditBrief] = useState(card.brief);
    const [editNotes, setEditNotes] = useState(card.notes);
    const [editLinks, setEditLinks] = useState(card.links || []);
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [newLinkLabel, setNewLinkLabel] = useState("");
    const textColor = getContrastingTextColor(card.color);
    const shouldReduceMotion = useReducedMotion();

    const handleDrag = useCallback((event: MouseEvent | TouchEvent | PointerEvent, info: any) => {
        if (orbitMode) return;
        const newPosition = {
            x: card.position.x + info.delta.x / camera.zoom,
            y: card.position.y + info.delta.y / camera.zoom,
        };
        onPositionChange(card.id, newPosition);
    }, [orbitMode, card.position.x, card.position.y, camera.zoom, card.id, onPositionChange]);
    
    const handleSave = useCallback(() => {
        onUpdate(card.id, { 
            brief: editBrief, 
            notes: editNotes, 
            links: editLinks, 
            updatedAt: new Date().toISOString() 
        });
        setIsEditing(false);
    }, [card.id, editBrief, editNotes, editLinks, onUpdate]);

    const addLink = useCallback(() => {
        if (!newLinkUrl || !newLinkLabel) {
            alert("Please provide both a URL and a label for the link.");
            return;
        }
        const newLink: TodoLink = {
            id: `link-${Date.now()}`,
            url: newLinkUrl,
            label: newLinkLabel,
            type: detectUrlType(newLinkUrl)
        };
        setEditLinks(prev => [...prev, newLink]);
        setNewLinkUrl("");
        setNewLinkLabel("");
    }, [newLinkUrl, newLinkLabel]);

    const removeLink = useCallback((linkId: string) => {
        setEditLinks(prev => prev.filter(link => link.id !== linkId));
    }, []);

    const copyToClipboard = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            alert("Path copied to clipboard!");
        } catch (err) {
            console.error('Could not copy text: ', err);
            alert("Failed to copy path.");
        }
    }, []);

    const stopPropagation = useCallback((e: React.MouseEvent | React.PointerEvent) => {
        e.stopPropagation();
    }, []);

    const motionProps = orbitMode ? {
        x: (Math.cos(orbitAngle) * ORBIT_RADIUS - camera.position.x) * camera.zoom,
        y: (Math.sin(orbitAngle) * ORBIT_RADIUS - camera.position.y) * camera.zoom,
        rotate: shouldReduceMotion ? 0 : orbitAngle * (180 / Math.PI) + 90,
    } : {
        x: (card.position.x - camera.position.x) * camera.zoom,
        y: (card.position.y - camera.position.y) * camera.zoom,
        rotate: 0,
    };

    return (
        <motion.div
            drag={!orbitMode}
            dragMomentum={false}
            onDrag={handleDrag}
            animate={{...motionProps, scale: camera.zoom}}
            transition={{ type: 'spring', stiffness: 500, damping: 50 }}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                cursor: orbitMode ? 'default' : 'grab',
                pointerEvents: 'auto'
            }}
            whileDrag={{ cursor: 'grabbing', zIndex: 10 }}
            className="w-72 rounded-lg shadow-lg"
        >
            <div
                className="p-4 rounded-lg border-2 border-opacity-30 flex flex-col h-full min-h-[200px]"
                style={{ backgroundColor: card.color, color: textColor, borderColor: `${textColor}40` }}
            >
                {isEditing ? (
                    <div className="flex flex-col gap-2 flex-grow" onPointerDown={stopPropagation}>
                        <div>
                            <label className="text-xs font-bold opacity-70">Brief</label>
                            <input
                                type="text"
                                value={editBrief}
                                onChange={(e) => setEditBrief(e.target.value)}
                                maxLength={BRIEF_MAX_LENGTH}
                                className="bg-transparent border-b-2 p-1 text-lg font-bold w-full focus:outline-none"
                                style={{ borderColor: textColor, color: textColor }}
                            />
                            <div className="text-right text-xs opacity-70 mt-1">{editBrief.length}/{BRIEF_MAX_LENGTH}</div>
                        </div>
                        
                        <div className="text-xs">
                            <label className="font-bold opacity-70">Links</label>
                            <div className="space-y-1 max-h-20 overflow-y-auto border rounded p-1" style={{borderColor: `${textColor}40`}}>
                                {(editLinks || []).map(link => (
                                    <div key={link.id} className="flex items-center justify-between gap-2">
                                        <span className="truncate">{link.label}</span>
                                        <button onClick={() => removeLink(link.id)} onPointerDown={stopPropagation} className="p-0.5 rounded hover:bg-black/20">✕</button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-1 mt-1">
                                <input type="text" placeholder="URL" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="bg-transparent border rounded p-1 w-1/2 focus:outline-none" style={{borderColor: `${textColor}40`}}/>
                                <input type="text" placeholder="Label" value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} className="bg-transparent border rounded p-1 w-1/2 focus:outline-none" style={{borderColor: `${textColor}40`}}/>
                                <button onClick={addLink} onPointerDown={stopPropagation} className="p-1 rounded hover:bg-black/10"><Plus size={16}/></button>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold opacity-70">Notes (Markdown)</label>
                            <textarea
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                className="bg-transparent border rounded p-1 text-sm w-full h-24 resize-none focus:outline-none"
                                style={{ borderColor: textColor, color: textColor }}
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-auto">
                            <button onClick={() => setIsEditing(false)} className="px-3 py-1 rounded" style={{backgroundColor: `${textColor}20`}}>Cancel</button>
                            <button onClick={handleSave} className="px-3 py-1 rounded bg-green-500 text-white">Save</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold break-words pr-2 flex-grow">{card.brief || 'New Task'}</h3>
                            <div className="flex gap-1" onPointerDown={stopPropagation}>
                                <button onClick={() => setIsEditing(true)} className="p-1 rounded hover:bg-black/10"><Edit3 size={16} /></button>
                                <button onClick={() => onDelete(card.id)} className="p-1 rounded hover:bg-black/10"><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div className="prose prose-sm mt-2 flex-grow break-words max-w-none" style={{ color: textColor }}>
                           <ReactMarkdown components={{
                                a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" style={{color: textColor, textDecoration: 'underline'}} />,
                                p: ({node, ...props}) => <p {...props} style={{margin: '0 0 0.5rem 0'}}/>,
                                ul: ({node, ...props}) => <ul {...props} style={{margin: '0 0 0.5rem 1rem'}}/>,
                                ol: ({node, ...props}) => <ol {...props} style={{margin: '0 0 0.5rem 1rem'}}/>,
                           }}>
                                {card.notes || '*No details yet*'}
                           </ReactMarkdown>
                        </div>
                        <div className="mt-auto">
                            <div className="mt-2 text-xs">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="font-bold">Links</span>
                                </div>
                                <div className="space-y-1 max-h-20 overflow-y-auto">
                                    {(card.links || []).map(link => (
                                        <div key={link.id} className="flex items-center justify-between gap-2">
                                            {link.type === 'external' ? (
                                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:underline truncate" style={{color: textColor}} onPointerDown={stopPropagation}>
                                                    <ExternalLink size={12}/> <span className="truncate">{link.label}</span>
                                                </a>
                                            ) : (
                                                <div className="flex items-center gap-1 truncate" onPointerDown={stopPropagation}>
                                                    <span className="truncate">{link.label}</span>
                                                    <button onClick={() => copyToClipboard(link.url)} className="p-0.5 rounded hover:bg-black/10"><Copy size={10}/></button>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                    {(!card.links || card.links.length === 0) && <div className="opacity-70 italic">No links yet.</div>}
                                </div>
                            </div>
                            <div className="text-xs opacity-70 mt-4 pt-2 border-t" style={{ borderColor: `${textColor}40` }}>
                                Updated: {new Date(card.updatedAt).toLocaleDateString()}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
});

TodoCard.displayName = 'TodoCard';

// Main App Component
export default function App() {
    const [state, setState] = useState<AppState>({
        cards: [],
        camera: { position: { x: 0, y: 0 }, zoom: 1 },
        theme: 'dark',
        orbitMode: false,
    });
    const [isPanning, setIsPanning] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [orbitAngle, setOrbitAngle] = useState(0);
    const universeRef = useRef<HTMLDivElement>(null);
    const shouldReduceMotion = useReducedMotion();
    const pinchState = useRef({ initialDistance: 0, initialZoom: 1 }).current;

    // Load data on initial mount
    useEffect(() => {
        const loadedState = loadData();
        if (loadedState) {
            setState(loadedState);
        } else {
             const welcomeCard: TodoCardType = {
                id: `card-${Date.now()}`,
                brief: 'Welcome to your To-Do Universe!',
                notes: 'Pan by dragging the background. Zoom with the scroll wheel or by pinching. Create new tasks from the sidebar!',
                position: { x: 0, y: 0 },
                color: CARD_COLORS[0],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                links: [],
            };
            setState(s => ({...s, cards: [welcomeCard]}));
        }
    }, []);

    // Save data whenever state changes
    useEffect(() => {
        saveData(state);
    }, [state]);

    // Orbit animation
    useEffect(() => {
        if (!state.orbitMode || shouldReduceMotion) return;
        let animationFrameId: number;
        const animate = () => {
            setOrbitAngle(prev => prev + 0.001);
            animationFrameId = requestAnimationFrame(animate);
        };
        animationFrameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(animationFrameId);
    }, [state.orbitMode, shouldReduceMotion]);

    // --- Interaction Handlers ---
    const handleWheel = useCallback((e: React.WheelEvent) => {
        if (!universeRef.current) return;
        const rect = universeRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const worldX = (mouseX - rect.width / 2) / state.camera.zoom + state.camera.position.x;
        const worldY = (mouseY - rect.height / 2) / state.camera.zoom + state.camera.position.y;
        
        const zoomFactor = e.deltaY < 0 ? 1.1 : 1 / 1.1;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, state.camera.zoom * zoomFactor));

        const newPosX = worldX - (mouseX - rect.width / 2) / newZoom;
        const newPosY = worldY - (mouseY - rect.height / 2) / newZoom;

        setState(s => ({
            ...s,
            camera: {
                zoom: newZoom,
                position: { x: newPosX, y: newPosY }
            }
        }));
    }, [state.camera.zoom, state.camera.position.x, state.camera.position.y]);
    
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
        if (e.target === universeRef.current) {
             setIsPanning(true);
             (e.target as HTMLElement).setPointerCapture(e.pointerId);
        }
    }, []);

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
        if(isPanning) {
            setIsPanning(false);
            (e.target as HTMLElement).releasePointerCapture(e.pointerId);
        }
    }, [isPanning]);
    
    const handlePointerMove = useCallback((e: React.PointerEvent) => {
        if (isPanning) {
            setState(s => ({
                ...s,
                camera: {
                    ...s.camera,
                    position: {
                        x: s.camera.position.x - e.movementX / s.camera.zoom,
                        y: s.camera.position.y - e.movementY / s.camera.zoom,
                    }
                }
            }));
        }
    }, [isPanning]);
    
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            pinchState.initialDistance = Math.sqrt(dx * dx + dy * dy);
            pinchState.initialZoom = state.camera.zoom;
        }
    }, [state.camera.zoom, pinchState]);
    
    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const currentDistance = Math.sqrt(dx * dx + dy * dy);
            const zoomFactor = currentDistance / pinchState.initialDistance;
            const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, pinchState.initialZoom * zoomFactor));

            if (universeRef.current) {
                const rect = universeRef.current.getBoundingClientRect();
                const touchCenterX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
                const touchCenterY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;

                const worldX = (touchCenterX - rect.width / 2) / state.camera.zoom + state.camera.position.x;
                const worldY = (touchCenterY - rect.height / 2) / state.camera.zoom + state.camera.position.y;

                const newPosX = worldX - (touchCenterX - rect.width / 2) / newZoom;
                const newPosY = worldY - (touchCenterY - rect.height / 2) / newZoom;

                setState(s => ({...s, camera: { zoom: newZoom, position: {x: newPosX, y: newPosY} }}));
            }
        }
    }, [state.camera.zoom, state.camera.position.x, state.camera.position.y, pinchState]);

    // --- Card Actions ---
    const createCard = useCallback(() => {
        setState(s => {
            const newCard: TodoCardType = {
                id: `card-${Date.now()}`,
                brief: 'New Task',
                notes: '',
                links: [],
                position: { 
                    x: s.camera.position.x + (Math.random() - 0.5) * 200 / s.camera.zoom,
                    y: s.camera.position.y + (Math.random() - 0.5) * 200 / s.camera.zoom,
                },
                color: generateRandomColor(CARD_COLORS, s.cards.length),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            return { ...s, cards: [...s.cards, newCard] };
        });
    }, []);

    const updateCard = useCallback((id: string, updates: Partial<TodoCardType>) => {
        setState(s => ({
            ...s,
            cards: s.cards.map(c => c.id === id ? { ...c, ...updates } : c)
        }));
    }, []);

    const deleteCard = useCallback((id: string) => {
        setState(s => ({ ...s, cards: s.cards.filter(c => c.id !== id) }));
    }, []);
    
    const updateCardPosition = useCallback((id: string, position: Point) => {
        setState(s => ({
            ...s,
            cards: s.cards.map(c => c.id === id ? { ...c, position } : c)
        }));
    }, []);

    // --- Camera & Theme Actions ---
    const toggleTheme = useCallback(() => {
        setState(s => ({ ...s, theme: s.theme === 'dark' ? 'light' : 'dark' }));
    }, []);

    const toggleOrbitMode = useCallback(() => {
        setState(s => ({ ...s, orbitMode: !s.orbitMode }));
    }, []);

    const zoom = useCallback((factor: number) => {
        setState(s => ({
            ...s,
            camera: { ...s.camera, zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, s.camera.zoom * factor)) }
        }));
    }, []);

    const resetView = useCallback(() => {
        setState(s => ({
            ...s,
            camera: { position: { x: 0, y: 0 }, zoom: 1 }
        }));
    }, []);
    
    // --- Data Import/Export ---
    const handleExport = useCallback(() => {
        const dataStr = JSON.stringify(state, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'todo-universe-backup.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [state]);

    const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const importedState = JSON.parse(e.target?.result as string);
                    if (importedState.cards && importedState.camera) {
                        setState(importedState);
                        alert("Universe restored successfully!");
                    } else {
                        alert("Invalid backup file format.");
                    }
                } catch (error) {
                    alert("Error reading backup file.");
                    console.error(error);
                }
            };
            reader.readAsText(file);
        }
    }, []);

    return (
        <div className={`w-screen h-screen overflow-hidden flex ${state.theme}`} data-theme={state.theme}>
            <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-16'} bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 flex flex-col shadow-2xl z-20`}>
                <div className="p-4 flex-grow">
                    <div className="flex items-center justify-between">
                         {isSidebarOpen && <h1 className="text-xl font-bold">🌌 To-Do Universe</h1>}
                         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                             {isSidebarOpen ? <ChevronsLeft /> : <ChevronsRight />}
                         </button>
                    </div>
                    {isSidebarOpen && (
                        <div className="mt-6 flex flex-col gap-2">
                             <button onClick={createCard} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                 <Plus size={20} /> New Task
                             </button>
                             <button onClick={toggleTheme} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                 {state.theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />} Toggle Theme
                             </button>
                             <button onClick={toggleOrbitMode} className={`flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${state.orbitMode ? 'text-blue-500' : ''}`}>
                                 <Orbit size={20} /> Toggle Orbit
                             </button>
                             <button onClick={() => zoom(1.2)} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                 <ZoomIn size={20} /> Zoom In
                             </button>
                             <button onClick={() => zoom(1 / 1.2)} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                 <ZoomOut size={20} /> Zoom Out
                             </button>
                             <button onClick={resetView} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                 <LocateFixed size={20} /> Reset View
                             </button>
                             <button onClick={handleExport} className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700">
                                <Download size={20} /> Backup Universe
                            </button>
                            <label className="flex items-center gap-2 w-full text-left p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer">
                                <Upload size={20} /> Restore Universe
                                <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                            </label>
                        </div>
                    )}
                </div>
                 <div className="p-4 text-xs text-gray-500 dark:text-gray-400">
                     {isSidebarOpen && (
                         <>
                            <div>Cards: {state.cards.length}</div>
                            <div>Zoom: {Math.round(state.camera.zoom * 100)}%</div>
                            <div>Mode: {state.orbitMode ? 'Orbit' : 'Free'}</div>
                         </>
                     )}
                     <div className="mt-2">
                        <Save size={16} className="inline-block mr-1"/> Auto-saved
                     </div>
                 </div>
            </div>

            <main className="flex-1 relative touch-none"
                ref={universeRef}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerMove={handlePointerMove}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
            >
                <StarField theme={state.theme} camera={state.camera} />
                {state.theme === 'light' && <MeteorShower />}
                
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <AnimatePresence>
                        {state.cards.map((card, index) => (
                            <TodoCard
                                key={card.id}
                                card={card}
                                camera={state.camera}
                                onUpdate={updateCard}
                                onDelete={deleteCard}
                                onPositionChange={updateCardPosition}
                                orbitMode={state.orbitMode}
                                orbitAngle={orbitAngle + (index * (2 * Math.PI) / (state.cards.length || 1))}
                            />
                        ))}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}