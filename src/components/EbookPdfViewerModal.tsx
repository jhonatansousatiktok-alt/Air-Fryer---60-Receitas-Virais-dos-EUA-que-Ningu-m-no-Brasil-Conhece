import React from 'react';
import { X, BookOpen, Download, ExternalLink, Flame, CheckCircle, Sparkles } from 'lucide-react';
import { CHAPTERS_INFO } from '../data/recipes';

interface EbookPdfViewerModalProps {
  onClose: () => void;
  onSelectCategory: (categoryId: string) => void;
}

export const EbookPdfViewerModal: React.FC<EbookPdfViewerModalProps> = ({
  onClose,
  onSelectCategory,
}) => {
  const pdfUrl = '/assets/aistudio/E-book__Air_Fryer_Secrets__60_Receitas_Virais_dos_EUA_que_Ningu_m_no_Brasil_Conhece_4f8047bc.pdf';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-neutral-900 border border-neutral-750 rounded-3xl shadow-2xl overflow-hidden my-auto text-neutral-100 max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-neutral-950/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ebook-modal-title" className="text-lg font-black text-white">
                E-book Original: Air Fryer Secrets
              </h2>
              <p className="text-xs text-neutral-400">
                60 Receitas Virais dos EUA que Ninguém no Brasil Conhece
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar leitor do e-book"
            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Hero Banner */}
          <div className="bg-gradient-to-r from-amber-950/60 via-orange-950/40 to-neutral-900 border border-amber-500/30 rounded-2xl p-6 shadow-inner">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500 text-neutral-950 inline-block mb-3">
              Documento Completo
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
              O Lado Secreto da Sua Air Fryer
            </h3>
            <p className="text-sm text-neutral-300 leading-relaxed max-w-2xl">
              Você já domina o básico: batata frita, frango dourado e pão de queijo. Este livro ensina a usar os 90% restantes do potencial do aparelho, adaptando as maiores tendências do TikTok americano com ingredientes brasileiros!
            </p>

            <div className="flex flex-wrap gap-3 mt-6">
              <a
                href={pdfUrl}
                download="Air_Fryer_Secrets_60_Receitas_Virais.pdf"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-neutral-950 transition active:scale-95 shadow-lg shadow-amber-500/20"
              >
                <Download className="w-4 h-4" />
                Baixar PDF Original
              </a>

              <a
                href={pdfUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-neutral-800 hover:bg-neutral-750 text-white border border-neutral-700 transition"
              >
                <ExternalLink className="w-4 h-4" />
                Visualizar no Navegador
              </a>
            </div>
          </div>

          {/* Golden Rules from the Book */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Os 5 Pilares de Maestria do Livro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-neutral-300">
              <div className="bg-neutral-850 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-bold text-white block mb-1">1. Não Sobrecarregue a Cesta</span>
                Trabalhe sempre em lotes. O excesso de comida cozinha no vapor em vez de dourar e pururucar.
              </div>
              <div className="bg-neutral-850 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-bold text-white block mb-1">2. O Truque do Congelamento</span>
                Para queijos como muçarela e provolone, 1h no freezer evita que vazem antes da casca estalar.
              </div>
              <div className="bg-neutral-850 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-bold text-white block mb-1">3. Névoa de Água para Pães</span>
                Ao reaquecer pão de queijo e sonhos, uma leve borrifada de água cria vapor que devolve a maciez elástica.
              </div>
              <div className="bg-neutral-850 p-3.5 rounded-xl border border-neutral-800">
                <span className="font-bold text-white block mb-1">4. Ciência do Fermento nas Asas</span>
                Fermento em pó (sem sal) altera o pH da pele do frango, criando a crocância de fritura sem farinha.
              </div>
            </div>
          </div>

          {/* Chapters Directory */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-amber-400 mb-3">
              Capítulos do E-book (Navegação Rápida)
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {CHAPTERS_INFO.filter((c) => c.id !== 'todos').map((chap) => (
                <div
                  key={chap.id}
                  onClick={() => {
                    onSelectCategory(chap.id);
                    onClose();
                  }}
                  className="p-4 rounded-xl bg-neutral-850 hover:bg-neutral-800 border border-neutral-750 hover:border-amber-500/40 transition cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-amber-400 group-hover:underline">
                      {chap.title}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {chap.badge}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {chap.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
