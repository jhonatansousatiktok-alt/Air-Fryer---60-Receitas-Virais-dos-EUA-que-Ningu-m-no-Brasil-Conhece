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
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-amber-500 mb-6 shadow-xl shadow-amber-950/20">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Sua lista de compras está vazia</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8 text-sm">
          Abra qualquer uma das 60 receitas virais e clique em &quot;Adicionar Ingredientes à Lista&quot; para gerar automaticamente suas compras organizadas por corredor!
        </p>

        <button
          onClick={onExploreRecipes}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20 transition active:scale-95"
        >
          <Sparkles className="w-5 h-5" />
          Explorar as 60 Receitas
        </button>

        {/* Quick add standalone item anyway */}
        <form onSubmit={handleAddSubmit} className="mt-12 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            placeholder="Ou adicione um item avulso..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            className="px-4 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white rounded-xl text-sm font-medium transition"
          >
            Adicionar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header bar */}
      <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 mb-8 shadow-xl backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-6 h-6 text-amber-500" />
              <h2 className="text-2xl font-bold text-white">Lista de Compras Inteligente</h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Ingredientes agrupados automaticamente por setor do supermercado.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleWhatsAppShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition active:scale-95"
              title="Compartilhar lista no WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
              Enviar no WhatsApp
            </button>

            <button
              onClick={handleCopyList}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition"
              title="Copiar lista de texto"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiada!' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Progress & stats */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-xs font-semibold text-neutral-300">
              {completedCount} de {totalCount} comprados ({Math.round((completedCount / totalCount) * 100)}%)
            </span>
            <div className="flex-1 sm:w-36 h-2 bg-neutral-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs w-full sm:w-auto justify-end">
            {completedCount > 0 && (
              <button
                onClick={onClearCompleted}
                className="text-neutral-400 hover:text-amber-400 transition"
              >
                Limpar comprados
              </button>
            )}
            <button
              onClick={onClearAll}
              className="text-neutral-500 hover:text-rose-400 transition"
            >
              Limpar toda a lista
            </button>
          </div>
        </div>
      </div>

      {/* Quick Add Custom Item */}
      <form onSubmit={handleAddSubmit} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Adicionar outro produto à lista (ex: Papel manteiga, azeite extra)..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 shadow-inner"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl text-sm transition active:scale-95 shadow-md shadow-amber-500/20"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Adicionar
        </button>
      </form>

      {/* Categorized Lists */}
      <div className="space-y-6">
        {Object.entries(grouped).map(([categoryName, catItems]) => (
          <div key={categoryName} className="bg-neutral-900 border border-neutral-800/80 rounded-2xl p-5 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center justify-between">
              <span>{categoryName}</span>
              <span className="text-xs font-normal text-neutral-500 lowercase">
                {catItems.filter((i) => i.checked).length}/{catItems.length} comprados
              </span>
            </h3>

            <div className="divide-y divide-neutral-800/60">
              {catItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-2.5 gap-3 group transition"
                >
                  <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => onToggleItem(item.id)}
                      className="w-4 h-4 rounded border-neutral-700 text-amber-500 focus:ring-amber-500/40 bg-neutral-800 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <span
                        className={`text-sm break-words transition ${
                          item.checked ? 'line-through text-neutral-500' : 'text-neutral-200'
                        }`}
                      >
                        {item.text}
                      </span>
                      {item.recipeTitle && (
                        <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                          Para: {item.recipeTitle}
                        </p>
                      )}
                    </div>
                  </label>

                  <button
                    onClick={() => onDeleteItem(item.id)}
                    aria-label={`Excluir item ${item.text}`}
                    className="p-1.5 text-neutral-500 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition opacity-60 group-hover:opacity-100"
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
