import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Save, 
  Trash2, 
  Move,
  ZoomIn,
  ZoomOut,
  Download,
  Share2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Node {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  parentId?: string;
}

interface Connection {
  from: string;
  to: string;
}

const COLORS = [
  { name: "Violet", value: "#8b5cf6" },
  { name: "Rose", value: "#ec4899" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Vert", value: "#10b981" },
  { name: "Bleu", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
];

const MindMap = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const svgRef = useRef<SVGSVGElement>(null);
  
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", text: "Bac Français 2025", x: 400, y: 300, color: "#8b5cf6" }
  ]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [mapTitle, setMapTitle] = useState("Carte mentale");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadMindMap();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadMindMap = async () => {
    try {
      const { data, error } = await supabase
        .from("mind_maps")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      if (data) {
        setMapTitle(data.title);
        setNodes((data.nodes as unknown as Node[]) || []);
        setConnections((data.connections as unknown as Connection[]) || []);
      }
    } catch (error) {
      console.error("Error loading mind map:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger la carte mentale",
        variant: "destructive",
      });
      navigate("/cartes-mentales");
    } finally {
      setLoading(false);
    }
  };

  const addNode = () => {
    const newNode: Node = {
      id: Date.now().toString(),
      text: "Nouveau concept",
      x: 400 + Math.random() * 100,
      y: 300 + Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)].value,
    };
    
    if (selectedNode) {
      newNode.parentId = selectedNode;
      setConnections([...connections, { from: selectedNode, to: newNode.id }]);
    }
    
    setNodes([...nodes, newNode]);
    setSelectedNode(newNode.id);
  };

  const deleteNode = (nodeId: string) => {
    // Supprimer le nœud et ses connexions
    setNodes(nodes.filter(n => n.id !== nodeId));
    setConnections(connections.filter(c => c.from !== nodeId && c.to !== nodeId));
    if (selectedNode === nodeId) setSelectedNode(null);
  };

  const updateNodeText = (nodeId: string, text: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, text } : n));
  };

  const updateNodeColor = (nodeId: string, color: string) => {
    setNodes(nodes.map(n => n.id === nodeId ? { ...n, color } : n));
  };

  const handleMouseDown = (e: React.MouseEvent, nodeId: string) => {
    if (e.button !== 0) return; // Only left click
    
    const node = nodes.find(n => n.id === nodeId);
    if (!node) return;

    setDraggingNode(nodeId);
    setSelectedNode(nodeId);
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    setDragOffset({
      x: svgP.x - node.x,
      y: svgP.y - node.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode) return;
    
    const svg = svgRef.current;
    if (!svg) return;
    
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const svgP = pt.matrixTransform(svg.getScreenCTM()?.inverse());
    
    setNodes(nodes.map(n => 
      n.id === draggingNode 
        ? { ...n, x: svgP.x - dragOffset.x, y: svgP.y - dragOffset.y }
        : n
    ));
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const connectNodes = (fromId: string, toId: string) => {
    if (fromId === toId) return;
    const exists = connections.find(c => 
      (c.from === fromId && c.to === toId) || (c.from === toId && c.to === fromId)
    );
    if (!exists) {
      setConnections([...connections, { from: fromId, to: toId }]);
    }
  };

  const saveMindMap = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Erreur",
          description: "Vous devez être connecté pour sauvegarder",
          variant: "destructive",
        });
        return;
      }

      if (!id) {
        toast({
          title: "Erreur",
          description: "Aucune carte mentale sélectionnée",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("mind_maps")
        .update({
          nodes: nodes as any,
          connections: connections as any,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (error) throw error;

      toast({
        title: "Sauvegardé !",
        description: "Ta carte mentale a été sauvegardée",
      });
    } catch (error) {
      console.error("Error saving mind map:", error);
      toast({
        title: "Erreur",
        description: "Impossible de sauvegarder la carte",
        variant: "destructive",
      });
    }
  };

  const exportAsPNG = () => {
    toast({
      title: "Fonctionnalité à venir",
      description: "L'export en PNG sera bientôt disponible",
    });
  };

  const selectedNodeData = nodes.find(n => n.id === selectedNode);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b-2 border-gray-900 p-4">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/cartes-mentales")}
            className="border-2 border-gray-900"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
              
              <div>
                <h1 className="text-2xl font-black text-gray-900">{mapTitle}</h1>
                <p className="text-sm text-gray-600">Organise visuellement tes révisions</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}
                className="border-2 border-gray-900"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              
              <span className="text-sm font-bold min-w-[60px] text-center">
                {Math.round(zoom * 100)}%
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoom(Math.min(2, zoom + 0.1))}
                className="border-2 border-gray-900"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>

              <div className="w-px h-8 bg-gray-300 mx-2" />

              <Button
                variant="outline"
                size="sm"
                onClick={exportAsPNG}
                className="border-2 border-gray-900"
              >
                <Download className="w-4 h-4 mr-2" />
                Exporter
              </Button>

              <Button
                size="sm"
                onClick={saveMindMap}
                className="bg-violet-600 hover:bg-violet-700 font-bold"
              >
                <Save className="w-4 h-4 mr-2" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Canvas */}
          <div className="flex-1 relative bg-white">
            <svg
              ref={svgRef}
              className="w-full h-full cursor-move"
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                >
                  <polygon points="0 0, 10 3, 0 6" fill="#64748b" />
                </marker>
              </defs>

              <g transform={`scale(${zoom}) translate(${pan.x}, ${pan.y})`}>
                {/* Connections */}
                {connections.map((conn, idx) => {
                  const fromNode = nodes.find(n => n.id === conn.from);
                  const toNode = nodes.find(n => n.id === conn.to);
                  if (!fromNode || !toNode) return null;

                  return (
                    <line
                      key={idx}
                      x1={fromNode.x}
                      y1={fromNode.y}
                      x2={toNode.x}
                      y2={toNode.y}
                      stroke="#64748b"
                      strokeWidth="2"
                      markerEnd="url(#arrowhead)"
                    />
                  );
                })}

                {/* Nodes */}
                {nodes.map((node) => (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onMouseDown={(e) => handleMouseDown(e, node.id)}
                    onClick={() => setSelectedNode(node.id)}
                    onDoubleClick={() => setEditingNode(node.id)}
                    className="cursor-pointer"
                  >
                    <rect
                      x="-80"
                      y="-30"
                      width="160"
                      height="60"
                      rx="12"
                      fill={node.color}
                      stroke={selectedNode === node.id ? "#000" : "none"}
                      strokeWidth="3"
                      className="transition-all"
                    />
                    <text
                      x="0"
                      y="5"
                      textAnchor="middle"
                      fill="white"
                      fontSize="14"
                      fontWeight="bold"
                      className="pointer-events-none select-none"
                    >
                      {node.text.length > 20 ? node.text.substring(0, 20) + "..." : node.text}
                    </text>
                  </g>
                ))}
              </g>
            </svg>

            {/* Floating Toolbar */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <Card className="border-2 border-gray-900 shadow-2xl">
                <CardContent className="p-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    onClick={addNode}
                    className="bg-violet-600 hover:bg-violet-700 font-bold"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nouveau nœud
                  </Button>

                  {selectedNode && (
                    <>
                      <div className="w-px h-8 bg-gray-300" />
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteNode(selectedNode)}
                        className="border-2 border-gray-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Panel - Properties */}
          {selectedNodeData && (
            <div className="w-80 bg-white border-l-2 border-gray-900 p-6 overflow-y-auto">
              <h3 className="text-xl font-black text-gray-900 mb-4">Propriétés</h3>

              <div className="space-y-6">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Texte
                  </label>
                  <Input
                    value={selectedNodeData.text}
                    onChange={(e) => updateNodeText(selectedNode, e.target.value)}
                    className="border-2 border-gray-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Couleur
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {COLORS.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => updateNodeColor(selectedNode, color.value)}
                        className={`h-12 rounded-lg border-2 transition-all ${
                          selectedNodeData.color === color.value
                            ? "border-gray-900 scale-110"
                            : "border-gray-300 hover:scale-105"
                        }`}
                        style={{ backgroundColor: color.value }}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Actions
                  </label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-2 border-gray-900"
                      onClick={addNode}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Ajouter un nœud enfant
                    </Button>
                    
                    <Button
                      variant="outline"
                      className="w-full border-2 border-red-600 text-red-600 hover:bg-red-50"
                      onClick={() => deleteNode(selectedNode)}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Supprimer ce nœud
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t-2 border-gray-200">
                  <p className="text-xs text-gray-500 mb-2">💡 Astuce</p>
                  <p className="text-sm text-gray-600">
                    Double-clique sur un nœud pour éditer rapidement son texte. 
                    Glisse-dépose pour réorganiser ta carte.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MindMap;
