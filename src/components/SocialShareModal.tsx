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
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-[#FCFAF7] border border-[#E8DFD3] rounded-3xl shadow-2xl overflow-hidden text-[#1E293B] p-6 sm:p-7"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
      >
        <button
          onClick={onClose}
          aria-label="Fechar compartilhamento"
          className="absolute top-4 right-4 p-2 rounded-xl bg-[#FAF5EE] text-[#64748B] hover:text-[#0F2942] hover:bg-[#F2E8DC] border border-[#E5DACD] transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-4 text-[#C8521A]">
          <Share2 className="w-5 h-5" />
          <h2 id="share-title" className="font-serif text-xl sm:text-2xl font-bold text-[#0F2942]">Compartilhar Receita</h2>
        </div>

        {/* Visual Preview Card */}
        <div className="bg-white border border-[#E8DFD5] rounded-2xl p-4 mb-6 shadow-sm">
          <div className="flex gap-4">
            <img 
              src={recipe.image} 
              alt={recipe.title} 
              className="w-24 h-24 object-cover rounded-xl border border-[#E8DFD5] shrink-0" 
            />
            <div className="min-w-0">
              <span className="inline-block px-2 py-0.5 text-xs font-bold rounded-md bg-[#FAF4ED] text-[#8A4A28] border border-[#ECDCCB] mb-1">
                Capítulo {recipe.chapter}
              </span>
              <h3 className="font-serif font-bold text-[#0F2942] text-base leading-snug truncate">{recipe.title}</h3>
              <p className="text-xs text-[#64748B] line-clamp-2 mt-0.5">{recipe.subtitle}</p>
              
              <div className="flex items-center gap-3 mt-2 text-xs">
                <span className="flex items-center gap-1 font-bold text-[#C8521A]">
                  <Thermometer className="w-3.5 h-3.5" />
                  {recipe.temperature}°C
                </span>
                <span className="flex items-center gap-1 font-medium text-[#0F2942]">
                  <Clock className="w-3.5 h-3.5 text-[#C8521A]" />
                  {recipe.airFryerTime}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#F0E8DD] text-xs text-[#526071] line-clamp-2">
            💡 <span className="italic">{recipe.chefTip}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl font-bold bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md shadow-[#25D366]/20 transition active:scale-[0.98] text-sm"
          >
            <MessageCircle className="w-5 h-5" />
            Compartilhar no WhatsApp com Amigos
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#0F2942] border border-[#E5DACD] transition active:scale-[0.98] text-xs"
            >
              {copied ? <Check className="w-4 h-4 text-[#3D5A3C]" /> : <Copy className="w-4 h-4 text-[#C8521A]" />}
              {copied ? 'Copiado!' : 'Copiar Texto'}
            </button>

            {typeof navigator !== 'undefined' && 'share' in navigator ? (
              <button
                onClick={handleNativeShare}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold bg-[#0F2942] hover:bg-[#1E3A5A] text-white transition active:scale-[0.98] text-xs"
              >
                <Share2 className="w-4 h-4" />
                Mais Opções
              </button>
            ) : (
              <button
                onClick={handleCopy}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl font-bold bg-[#0F2942] hover:bg-[#1E3A5A] text-white transition active:scale-[0.98] text-xs"
              >
                <Copy className="w-4 h-4" />
                Copiar
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
