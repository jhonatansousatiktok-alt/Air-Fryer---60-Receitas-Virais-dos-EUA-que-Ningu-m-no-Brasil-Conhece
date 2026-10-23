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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-[#FCFAF7] border border-[#E8DFD3] rounded-3xl shadow-2xl overflow-hidden my-auto text-[#1E293B] max-h-[92vh] flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ebook-modal-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#EBE3D7] bg-white/95">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF0E7] text-[#C8521A]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="ebook-modal-title" className="font-serif text-xl font-bold text-[#0F2942]">
                E-book Original: Air Fryer Secrets
              </h2>
              <p className="text-xs text-[#64748B]">
                60 Receitas Virais dos EUA que Ninguém no Brasil Conhece
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar leitor do e-book"
            className="p-2 rounded-xl bg-[#FAF5EE] hover:bg-[#F2E8DC] text-[#64748B] hover:text-[#0F2942] border border-[#E5DACD] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Hero Banner with Official Book Cover */}
          <div className="bg-gradient-to-r from-[#FAF3EB] via-[#F6ECE0] to-[#FAF3EB] border border-[#ECD9C5] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center gap-6">
            {/* Book Cover Visual with 3D shadow */}
            <div className="shrink-0 relative group">
              <img
                src="/assets/aistudio/image_f932da62.png"
                alt="Capa do Livro Air Fryer Secrets"
                className="w-40 sm:w-48 h-auto rounded-2xl shadow-[0_12px_30px_rgba(40,20,10,0.22)] border-2 border-white ring-1 ring-[#DFCDBB] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-[#0F2942] text-amber-300 text-[10px] font-black uppercase tracking-wider shadow-md">
                Capa Oficial
              </span>
            </div>

            <div className="flex-1">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#C8521A] text-white inline-block mb-3 shadow-xs">
                Documento Oficial em PDF
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#0F2942] mb-2 leading-tight">
                Air Fryer Secrets: O Lado Secreto da Sua Air Fryer
              </h3>
              <p className="text-sm sm:text-base text-[#374151] leading-relaxed">
                Você já domina o básico: batata frita, frango dourado e pão de queijo. Este livro ensina a usar os 90% restantes do potencial do aparelho, adaptando as maiores tendências do TikTok americano com ingredientes brasileiros!
              </p>

              <div className="flex flex-wrap gap-3 mt-6">
                <a
                  href={pdfUrl}
                  download="Air_Fryer_Secrets_60_Receitas_Virais.pdf"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#C8521A] hover:bg-[#B34514] text-white transition active:scale-95 shadow-md shadow-[#C8521A]/20"
                >
                  <Download className="w-4 h-4" />
                  Baixar PDF Original
                </a>

                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white hover:bg-[#F5EFE6] text-[#0F2942] border border-[#DFCDBB] transition shadow-xs"
                >
                  <ExternalLink className="w-4 h-4 text-[#C8521A]" />
                  Visualizar no Navegador
                </a>

                <a
                  href="/assets/aistudio/image_f932da62.png"
                  download="Capa_Oficial_Air_Fryer_Secrets.png"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#F0E6D8] hover:bg-[#E8DCCB] text-[#5C3D28] border border-[#E0CFBC] transition shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  Baixar Imagem da Capa
                </a>
              </div>
            </div>
          </div>

          {/* Golden Rules from the Book */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#0F2942] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C8521A]" />
              Os 4 Pilares de Maestria do Livro
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#475569]">
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
                <span className="font-serif font-bold text-[#0F2942] text-sm block mb-1">1. Não Sobrecarregue a Cesta</span>
                Trabalhe sempre em lotes. O excesso de comida cozinha no vapor em vez de dourar e pururucar.
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
                <span className="font-serif font-bold text-[#0F2942] text-sm block mb-1">2. O Truque do Congelamento</span>
                Para queijos como muçarela e provolone, 1h no freezer evita que vazem antes da casca estalar.
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
                <span className="font-serif font-bold text-[#0F2942] text-sm block mb-1">3. Névoa de Água para Pães</span>
                Ao reaquecer pão de queijo e sonhos, uma leve borrifada de água cria vapor que devolve a maciez elástica.
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#E8DFD5] shadow-xs">
                <span className="font-serif font-bold text-[#0F2942] text-sm block mb-1">4. Ciência do Fermento nas Asas</span>
                Fermento em pó (sem sal) altera o pH da pele do frango, criando a crocância de fritura sem farinha.
              </div>
            </div>
          </div>

          {/* Chapters Directory */}
          <div>
            <h4 className="font-serif text-base font-bold text-[#0F2942] mb-3">
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
                  className="p-4 rounded-2xl bg-white hover:bg-[#FAF4ED] border border-[#E8DFD5] hover:border-[#C8521A]/40 transition cursor-pointer group shadow-xs"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-serif font-bold text-sm text-[#0F2942] group-hover:text-[#C8521A] transition">
                      {chap.title}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAF0E7] text-[#C8521A] border border-[#E9D0C1]">
                      {chap.badge}
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] leading-relaxed">
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
