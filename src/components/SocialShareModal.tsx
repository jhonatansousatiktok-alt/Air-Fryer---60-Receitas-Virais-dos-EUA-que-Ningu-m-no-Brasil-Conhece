import React from 'react';
import { Sparkles, X, Share2, Copy, Check, MessageCircle, Flame, Clock, Thermometer } from 'lucide-react';
import { Recipe } from '../types/recipe';

interface SocialShareModalProps {
  recipe: Recipe;
  onClose: () => void;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({ recipe, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  const shareText = `🔥 Olha essa receita incrível de Air Fryer que encontrei:
✨ *${recipe.title}*
${recipe.subtitle}

⏱ Tempo na Air Fryer: ${recipe.airFryerTime} a ${recipe.temperature}°C
🍽 Rendimento: ${recipe.servings} ${recipe.servingsUnit}

🛒 *Ingredientes Principais:*
${recipe.ingredients.slice(0, 5).map((ing) => `• ${ing}`).join('\n')}
${recipe.ingredients.length > 5 ? `... e mais ${recipe.ingredients.length - 5} ingredientes!` : ''}

💡 *Dica do Chef:* ${recipe.chefTip}

Feito no app Air Fryer Secrets - 60 Receitas Virais!`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: recipe.title,
          text: shareText,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-neutral-900 border border-neutral-750 rounded-2xl shadow-2xl overflow-hidden text-neutral-100 p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <button
          onClick={onClose}
          aria-label="Fechar compartilhamento"
          className="absolute top-4 right-4 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-amber-400">
          <Share2 className="w-5 h-5" />
          <h2 id="share-title" className="text-xl font-bold tracking-tight">Compartilhar Receita</h2>
        </div>

        {/* Visual Preview Card */}
        <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 mb-6 shadow-inner">
          <div className="flex gap-4">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-24 h-24 object-cover rounded-lg border border-neutral-800 shrink-0" 
            />
            <div className="min-w-0">
              <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-amber-500/20 text-amber-300 mb-1">
                Capítulo {recipe.chapter}
              </span>
              <h3 className="font-bold text-white text-base leading-snug truncate">{recipe.title}</h3>
              <p className="text-xs text-neutral-400 line-clamp-2 mt-0.5">{recipe.subtitle}</p>
              
              <div className="flex items-center gap-3 mt-2 text-xs text-neutral-300">
                <span className="flex items-center gap-1 font-medium text-amber-400">
                  <Thermometer className="w-3.5 h-3.5" />
                  {recipe.temperature}°C
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-orange-400" />
                  {recipe.airFryerTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-neutral-850 text-xs text-neutral-400 line-clamp-2">
            💡 <span className="italic">{recipe.chefTip}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition active:scale-[0.98]"
          >
            <MessageCircle className="w-5 h-5" />
            Compartilhar no WhatsApp com Amigos
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition active:scale-[0.98]"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium bg-amber-600 hover:bg-amber-500 text-white transition active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4" />
                Mais Opções
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-medium bg-neutral-800 hover:bg-neutral-750 text-neutral-200 border border-neutral-700 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                Enviar Mensagem
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
