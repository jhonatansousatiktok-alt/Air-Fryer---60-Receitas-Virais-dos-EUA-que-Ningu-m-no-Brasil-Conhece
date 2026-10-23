import React, { useState } from 'react';
import { ShoppingBag, Check, Trash2, Plus, MessageCircle, Copy, Share2, Sparkles, AlertCircle } from 'lucide-react';
import { ShoppingItem } from '../types/recipe';

interface ShoppingListViewProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
  onAddItem: (text: string) => void;
  onExploreRecipes: () => void;
}

export const ShoppingListView: React.FC<ShoppingListViewProps> = ({
  items,
  onToggleItem,
  onDeleteItem,
  onClearCompleted,
  onClearAll,
  onAddItem,
  onExploreRecipes,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  // Group items by category
  const grouped = items.reduce<Record<string, ShoppingItem[]>>((acc, item) => {
    const cat = item.category || 'Outros Ingredientes';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(item);
    return acc;
  }, {});

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.checked).length;

  const generateShareText = () => {
    let text = `🛒 *Minha Lista de Compras - Air Fryer Secrets*\n\n`;
    Object.entries(grouped).forEach(([cat, catItems]) => {
      text += `*${cat}*\n`;
      catItems.forEach((item) => {
        text += `${item.checked ? '✅ ~' : '◻️ '}${item.text}${item.checked ? '~' : ''}${item.recipeTitle ? ` _(${item.recipeTitle})_` : ''}\n`;
      });
      text += '\n';
    });
    text += `Total de itens: ${totalCount} (${completedCount} comprados)\nGerado no app Air Fryer Secrets`;
    return text;
  };

  const handleCopyList = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(generateShareText());
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center animate-fadeIn">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-white border border-[#E8DFD5] flex items-center justify-center text-[#3D5A3C] mb-6 shadow-md shadow-emerald-900/5">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#0F2942] mb-2">Sua lista de compras está vazia</h2>
        <p className="text-[#64748B] max-w-md mx-auto mb-8 text-sm leading-relaxed">
          Abra qualquer uma das 60 receitas virais e clique em &quot;Adicionar Ingredientes à Lista&quot; para gerar automaticamente suas compras organizadas por setor do supermercado!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold bg-[#C8521A] hover:bg-[#B34514] text-white shadow-md shadow-[#C8521A]/20 transition active:scale-95 text-sm"
        >
          <Sparkles className="w-4 h-4" />
          Explorar as 60 Receitas
        </button>

        {/* Quick add standalone item anyway */}
        <form onSubmit={handleAddSubmit} className="mt-12 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Ou adicione um item avulso..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 bg-white border border-[#E5DACD] focus:border-[#C8521A] rounded-xl px-4 py-2.5 text-sm text-[#0F2942] placeholder-[#94A3B8] focus:outline-none shadow-xs"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-[#0F2942] hover:bg-[#1E3A5A] text-white rounded-xl text-sm font-bold transition shadow-xs"
          >
            Adicionar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header bar */}
      <div className="bg-white border border-[#E8DFD5] rounded-3xl p-6 sm:p-7 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-[#3D5A3C]" />
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F2942]">Lista de Compras Inteligente</h2>
            </div>
            <p className="text-xs text-[#64748B] mt-1">
              Ingredientes agrupados automaticamente por setor do supermercado com cálculo de porções.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-sm transition active:scale-95"
              title="Compartilhar lista no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar no WhatsApp
            </button>

            <button
              onClick={handleCopyList}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#0F2942] border border-[#E5DACD] transition shadow-xs"
              title="Copiar texto da lista"
            >
              {copied ? <Check className="w-4 h-4 text-[#3D5A3C]" /> : <Copy className="w-4 h-4 text-[#C8521A]" />}
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-2 pt-2 border-t border-[#F0E8DD]">
          <div className="flex justify-between text-xs text-[#64748B] font-medium">
            <span>Progresso no supermercado:</span>
            <span className="font-bold text-[#0F2942]">{completedCount} de {totalCount} itens marcados ({Math.round((completedCount / (totalCount || 1)) * 100)}%)</span>
          </div>
          <div className="w-full h-2.5 bg-[#FAF4ED] rounded-full overflow-hidden border border-[#EBE1D4]">
            <div
              className="h-full bg-gradient-to-r from-[#3D5A3C] to-[#558253] transition-all duration-300"
              style={{ width: `${(completedCount / (totalCount || 1)) * 100}%` }}
            />
          </div>
        </div>

        {/* Add custom item form */}
        <form onSubmit={handleAddSubmit} className="mt-5 flex gap-2">
          <input
            type="text"
            placeholder="Adicionar item avulso (ex: papel manteiga, azeite extra virgem)..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 bg-[#FAF7F2] border border-[#E5DACD] focus:border-[#C8521A] focus:bg-white rounded-xl px-4 py-2.5 text-xs sm:text-sm text-[#0F2942] placeholder-[#94A3B8] focus:outline-none transition shadow-inner"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0F2942] hover:bg-[#1E3A5A] text-white rounded-xl text-xs sm:text-sm font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </button>
        </form>

        {/* Action buttons */}
        <div className="flex items-center justify-between gap-3 pt-4 mt-4 border-t border-[#F0E8DD] text-xs">
          <button
            onClick={onClearCompleted}
            disabled={completedCount === 0}
            className="text-[#64748B] hover:text-[#C8521A] disabled:opacity-40 transition font-medium"
          >
            Remover {completedCount} itens concluídos
          </button>
          <button
            onClick={onClearAll}
            className="text-rose-600 hover:text-rose-700 transition font-medium flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Limpar lista inteira
          </button>
        </div>
      </div>

      {/* Grouped Lists by Supermarket Sector */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([category, catItems]) => (
          <div key={category} className="bg-white border border-[#E8DFD5] rounded-3xl p-5 sm:p-6 shadow-sm">
            <h3 className="font-serif text-lg font-bold text-[#0F2942] mb-3 flex items-center justify-between border-b border-[#F0E8DD] pb-2.5">
              <span>{category}</span>
              <span className="text-xs font-semibold text-[#8A4A28] bg-[#FBF3EB] px-2.5 py-0.5 rounded-full border border-[#EED7C4]">
                {catItems.length} {catItems.length === 1 ? 'item' : 'itens'}
              </span>
            </h3>

            <div className="divide-y divide-[#F5EFE6]">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onToggleItem(item.id)}
                  className={`py-3 flex items-start justify-between gap-3 cursor-pointer group transition ${
                    item.checked ? 'opacity-50' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-5 h-5 rounded-md border mt-0.5 flex items-center justify-center transition-all ${
                      item.checked
                        ? 'bg-[#3D5A3C] border-[#3D5A3C] text-white'
                        : 'border-[#CBD5E1] bg-white group-hover:border-[#C8521A]'
                    }`}>
                      {item.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>

                    <div className="flex-1">
                      <p className={`text-sm sm:text-base leading-snug ${
                        item.checked ? 'line-through text-[#94A3B8]' : 'text-[#1E293B] font-medium'
                      }`}>
                        {item.text}
                      </p>
                      {item.recipeTitle && (
                        <span className="text-[11px] text-[#8A4A28] mt-0.5 block font-semibold">
                          Da receita: {item.recipeTitle}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteItem(item.id);
                    }}
                    aria-label={`Remover item ${item.text}`}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-rose-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
