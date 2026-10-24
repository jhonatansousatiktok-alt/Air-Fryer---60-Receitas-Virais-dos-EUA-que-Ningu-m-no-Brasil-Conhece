import React, { useEffect } from 'react';
import { X, Download, BookOpen, Sparkles, ExternalLink, ShieldCheck } from 'lucide-react';

interface CoverLightboxModalProps {
  onClose: () => void;
  onOpenPdf: () => void;
}

export const CoverLightboxModal: React.FC<CoverLightboxModalProps> = ({ onClose, onOpenPdf }) => {
  const coverUrl = '/assets/aistudio/image_f932da62.png';
  const pdfUrl = '/assets/aistudio/E-book__Air_Fryer_Secrets__60_Receitas_Virais_dos_EUA_que_Ningu_m_no_Brasil_Conhece_4f8047bc.pdf';

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 bg-black/80 backdrop-blur-md overflow-hidden animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#131B26] border-t sm:border border-[#2A374A] rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-y-auto text-white flex flex-col md:flex-row max-h-[94vh] sm:max-h-[92vh]"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cover-modal-title"
      >
        {/* Mobile Pull Bar */}
        <div className="sm:hidden pt-2.5 pb-1 flex justify-center w-full absolute top-0 left-0 right-0 z-20">
          <div className="w-12 h-1 bg-white/25 rounded-full" />
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Fechar visualização da capa"
          className="absolute top-3 right-3 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white/80 hover:text-white border border-white/20 transition backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Book Cover Presentation with 3D feel */}
        <div className="md:w-1/2 p-6 sm:p-8 pt-8 sm:pt-8 flex items-center justify-center bg-gradient-to-b from-[#1E293B] to-[#0A0F17] relative overflow-hidden shrink-0">
          {/* Subtle warm glow behind cover */}
          <div className="absolute w-72 h-72 bg-[#C8521A]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative group max-w-[200px] sm:max-w-xs transition-transform duration-300 hover:scale-[1.02]">
            <img
              src={coverUrl}
              alt="Capa Oficial do Livro: Air Fryer Secrets - 60 Receitas Virais dos EUA que Ninguém no Brasil Conhece"
              className="w-full h-auto max-h-[38vh] sm:max-h-none rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-amber-500/30 object-contain ring-1 ring-white/10"
            />
            {/* Stamp / badge */}
            <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 px-2.5 py-0.5 sm:px-3 sm:py-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-[9px] sm:text-[10px] uppercase tracking-wider rounded-full shadow-lg border border-amber-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              100% Adaptado ao Brasil
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Context & Actions */}
        <div className="md:w-1/2 p-5 sm:p-8 flex flex-col justify-between space-y-5">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8521A]/20 border border-[#C8521A]/40 text-[#F97316] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              Capa Oficial do Aplicativo
            </div>

            <h2 id="cover-modal-title" className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
              Air Fryer Secrets
            </h2>
            <p className="font-serif text-amber-400 text-base font-semibold italic">
              60 Receitas Virais dos EUA que Ninguém no Brasil Conhece
            </p>

            <div className="h-[1px] bg-white/10 w-full my-2" />

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Esta é a capa oficial da obra culinária. Reúne técnicas exclusivas, segredos de textura, combinações de sabor virais do TikTok e Instagram adaptadas com maestria para a culinária e ingredientes brasileiros.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-amber-400 font-bold block text-sm">60 Receitas</span>
                <span className="text-slate-400 text-[11px]">Fotografias Reais</span>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-amber-400 font-bold block text-sm">6 Capítulos</span>
                <span className="text-slate-400 text-[11px]">Do Básico às Sobremesas</span>
              </div>
            </div>
          </div>

          <div className="space-y-2.5 pt-4">
            <a
              href={coverUrl}
              download="Capa_Oficial_Air_Fryer_Secrets.png"
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-[#C8521A] to-[#E2692D] hover:from-[#B34514] hover:to-[#C8521A] text-white transition active:scale-95 shadow-lg shadow-[#C8521A]/30"
            >
              <Download className="w-4 h-4" />
              Baixar Capa em Alta Resolução
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onClose();
                  onOpenPdf();
                }}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/15 transition"
              >
                <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                Abrir E-book
              </button>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl font-bold text-xs bg-white/10 hover:bg-white/15 text-white border border-white/15 transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                Baixar PDF
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
