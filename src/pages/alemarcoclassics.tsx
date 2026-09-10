import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import {
  ArrowDown,
  ArrowRight,
  BadgeCheck,
  Check,
  ChevronDown,
  ClipboardCheck,
  FileText,
  Gauge,
  Layers3,
  LockKeyhole,
  Menu,
  NotebookPen,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

type EvaluationItem = {
  id: string;
  name: string;
  description: string;
  parent_item_id: string;
  parent_item_name: string;
};


type EvaluationCriterion = {
  id: string;
  name: string;
  description: string;
  detailedInstructions: string;
  score: number;
  maxScore: number;
  weight: number;
};

type EvaluationResult = {
  item_id: string;
  item_name: string;
  item_description: string;
  criteria: EvaluationCriterion[];
  consultation_number: number;
  consultations_remaining: number;
};

const criteriaVisitorKey = "alemarco-classics-visitor-id";
const criteriaConsultedKey = "alemarco-classics-criteria-consulted";

function pickRandomItems(items: EvaluationItem[], count = 3) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function getCriteriaVisitorId() {
  const existing = window.localStorage.getItem(criteriaVisitorKey);
  if (existing) return existing;
  const id = crypto.randomUUID();
  window.localStorage.setItem(criteriaVisitorKey, id);
  return id;
}

function hasConsultedCriterion() {
  return window.localStorage.getItem(criteriaConsultedKey) === "true";
}

function markCriterionConsulted() {
  window.localStorage.setItem(criteriaConsultedKey, "true");
}

function getRpcErrorText(error: { message?: string; details?: string; hint?: string; code?: string } | null) {
  return [error?.message, error?.details, error?.hint, error?.code].filter(Boolean).join(" ");
}

function normalizeCriteria(value: unknown): EvaluationCriterion[] {
  if (Array.isArray(value)) return value as EvaluationCriterion[];
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed as EvaluationCriterion[] : [];
  } catch {
    return [];
  }
}


const heroVideo = "/alemarco-classics/alemarco_classics.mp4";
const heroImage = "/manus-storage/classics-hero_8f09da81.jpg";
//const dashboardImage = "/manus-storage/classics-dashboard_c7b98993.jpg";
const dashboardImage = "/alemarco-classics/avaliando.png";
const reportImage = "/alemarco-classics/report.jpg";


const modeData = {
  entusiasta: {
    label: "Entusiasta",
    eyebrow: "PARA UMA LEITURA RÁPIDA",
    title: "O essencial para decidir melhor.",
    text: "Uma avaliação objetiva para quem quer entender rapidamente o estado do carro antes de seguir para a próxima volta, conversa ou negociação.",
    count: "15 itens",
    time: "~ 12 min",
    checks: ["Carroceria e pintura", "Interior e acabamento", "Mecânica e elétrica", "Documentação"],
  },
  colecionador: {
    label: "Colecionador",
    eyebrow: "PARA UM REGISTRO COMPLETO",
    title: "Cada detalhe conta uma história.",
    text: "Um mergulho detalhado em originalidade, conservação e documentação para cuidar de uma peça com o rigor que ela merece.",
    count: "21 itens",
    time: "~ 25 min",
    checks: ["Carroceria e pintura", "Interior e acabamento", "Originalidade e detalhes", "Mecânica e elétrica", "Documentação e histórico", "Mercado de Colecionadores"],
  },
};

const categories = [
  { number: "01", title: "Externa", text: "Pintura, carroceria, vidros, cromados e sinais de uso.", icon: ScanLine },
  { number: "02", title: "Interna", text: "Estofamento, painel, instrumentos, odores e acabamento.", icon: Layers3 },
  { number: "03", title: "Mecânica", text: "Motor, fluidos, suspensão, freios, pneus e funcionamento.", icon: Wrench },
  { number: "04", title: "Documental", text: "Histórico, manual, notas e coerência do acervo.", icon: FileText },
];

const steps = [
  { number: "01", title: "Escolha o modo", text: "Comece com uma avaliação Entusiasta ou abra o modo Colecionador." },
  { number: "02", title: "Siga o roteiro", text: "Responda às perguntas com calma, direto do lado do seu clássico." },
  { number: "03", title: "Receba seu relatório", text: "Tenha uma leitura clara dos pontos fortes, alertas e próximos passos." },
];

function Mark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={`brand-mark ${compact ? "brand-mark--compact" : ""}`} aria-hidden="true">
      <img src="/alemarco-classics/icon.png" alt="" />
    </span>
  );
}


function StoreButtons() {
  return (
    <div className="flex flex-row flex-wrap items-center gap-3">
      <a
        className="inline-flex items-center"
        href="https://apps.apple.com/us/app/alemarco-classics/id6751519748"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/en-us.svg"
          alt="Disponível na App Store"
          className="block h-[40px] w-auto"
        />
      </a>

      <a
        className="inline-flex items-center"
        href="https://play.google.com/store/apps/details?id=com.alemarco.classics"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/googleplay-badge-01-getit.width-1440.png"
          alt="Disponível no Google Play"
          className="block h-[43px] w-auto"
        />
      </a>
    </div>
   );
}




export default function Home() {
  const [activeMode, setActiveMode] = useState<keyof typeof modeData>("entusiasta");
  const [menuOpen, setMenuOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState<EvaluationItem[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<EvaluationResult | null>(null);
  const [criteriaLoading, setCriteriaLoading] = useState(true);
  const [consultationLoading, setConsultationLoading] = useState(false);
  const [criteriaError, setCriteriaError] = useState(false);
  const [criteriaBlocked, setCriteriaBlocked] = useState(false);
  const [typedCriteria, setTypedCriteria] = useState<Record<string, string>>({});
  const mode = modeData[activeMode];

  useEffect(() => {
    let cancelled = false;
    // O limite é controlado server-side pela Edge Function/IP, não pelo storage.
    setCriteriaBlocked(false);

    const loadItems = async () => {
      const { data, error } = await supabase.rpc("get_public_classics_evaluation_items");
      if (cancelled) return;
      if (error) {
        console.error("Erro ao carregar itens Classics:", error);
        setCriteriaError(true);
        setCriteriaLoading(false);
        return;
      }
      setPreviewItems(pickRandomItems((data ?? []) as EvaluationItem[]));
      setCriteriaLoading(false);
    };

    void loadItems();
    return () => { cancelled = true; };
  }, []);

  const openItem = async (item: EvaluationItem) => {
    if (consultationLoading) {
      setCriteriaBlocked(true);
      return;
    }

    setConsultationLoading(true);
    setCriteriaError(false);
    const { data: payload, error } = await supabase.functions.invoke("classics-preview", {
      body: { criterionId: item.id },
    });
    const data = payload?.data ?? payload;

    if (error) {
      const errorResponse = "context" in error
        ? (error as { context?: Response }).context
        : undefined;
      const errorBody = errorResponse
        ? await errorResponse.clone().json().catch(() => null)
        : null;
      const errorText = [error.message, error.details, error.hint, error.code, JSON.stringify(errorBody)]
        .filter(Boolean)
        .join(" ");
      if (errorText.includes("CLASSICS_TRIAL_LIMIT_REACHED")) {
        setCriteriaBlocked(true);
      } else {
        console.error("Erro ao consultar avaliação Classics:", error);
        setCriteriaError(true);
      }
      setConsultationLoading(false);
      return;
    }

    // A RPC pode retornar uma linha em array ou um objeto único, dependendo
    // da configuração da função exposta pelo Supabase.
    const rawResult = (Array.isArray(data) ? data[0] : data) as EvaluationResult | undefined;
    const result = rawResult ? { ...rawResult, criteria: normalizeCriteria(rawResult.criteria) } : null;
    if (!result || !result.item_name || result.criteria.length === 0) {
      console.error("Resposta de avaliação Classics vazia ou em formato inesperado:", data);
      setCriteriaError(true);
      setConsultationLoading(false);
      return;
    }

    console.log("Critérios Classics recebidos:", result.criteria);

    setSelectedEvaluation(result);
    setCriteriaBlocked(true);
    setConsultationLoading(false);
  };

  useEffect(() => {
    if (!selectedEvaluation) {
      setTypedCriteria({});
      return;
    }

    let cancelled = false;
    setTypedCriteria({});
    const wait = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));

    const typeCriteria = async () => {
      for (const criterion of selectedEvaluation.criteria) {
        const fullText = criterion.description + "\u0000" + criterion.detailedInstructions;
        for (let cursor = 1; cursor <= fullText.length; cursor += 1) {
          if (cancelled) return;
          setTypedCriteria((current) => ({ ...current, [criterion.id]: fullText.slice(0, cursor) }));
          await wait(14);
        }
        await wait(220);
      }
    };

    void typeCriteria();
    return () => { cancelled = true; };
  }, [selectedEvaluation]);

  const scrollToDownload = () => {
    document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="classics-site">
      <section id="inicio" className="hero classics-hero" style={{ backgroundImage: `url(${heroImage})` }}>
        <video className="classics-hero__video" autoPlay loop muted playsInline preload="metadata" aria-hidden="true">
          <source src={heroVideo} type="video/mp4" />
        </video>
        <div className="hero__scrim" />
        <div className="hero__grain" />
        <header className="site-header">
          <a className="brand" href="#inicio" onClick={() => setMenuOpen(false)}><Mark /><span className="brand__copy"><strong>Alemarco</strong><small>Classics</small></span></a>
          <nav className={`site-nav ${menuOpen ? "site-nav--open" : ""}`}>
            <a href="#como-funciona" onClick={() => setMenuOpen(false)}>Como funciona</a>
            <a href="#modos" onClick={() => setMenuOpen(false)}>Modos de uso</a>
            <a href="#relatorio" onClick={() => setMenuOpen(false)}>O relatório</a>
          </nav>
          <a className="header-cta" href="#download">Baixar o app <ArrowRight size={15} /></a>
          <button className="menu-toggle" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Abrir menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </header>

        <div className="classics-hero__inner page-shell">
          <div className="classics-hero__intro">
            <div className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> ALEMARCO CLASSICS / AVALIAÇÃO GUIADA</div>
            <h1>O valor de um<br /><em>clássico,</em> em detalhes.</h1>
            <p className="hero__lead">Escolha um item e veja como o Alemarco Classics transforma uma inspeção cuidadosa em contexto para decidir melhor.</p>
            <div className="hero__proof"><span><LockKeyhole size={14} /> Consulta guiada</span><span><BadgeCheck size={14} /> Leitura objetiva</span><span><Sparkles size={14} /> Prévia gratuita</span></div>
          </div>

          <div className={`classics-command ${selectedEvaluation ? "classics-command--result" : ""}`}>
            <div className="classics-command__topline"><span><i /> Alemarco Classics está pronto</span><span>{selectedEvaluation ? `CONSULTA ${selectedEvaluation.consultation_number} / 01` : "PRÉVIA / 01"}</span></div>
            {!selectedEvaluation ? <>
              <div className="classics-command__heading"><span className="panel__kicker">CONSULTA GRATUITA</span><h2>O que você quer<br /><em>avaliar primeiro?</em></h2></div>
              <div className="classics-command__prompt"><span><small>Escolha um item para abrir a avaliação</small><strong>
              {criteriaLoading ? "Carregando itens..." : criteriaError ? "Não foi possível carregar" : "Selecione uma opção abaixo"}</strong></span><ClipboardCheck size={18} /></div>
              {criteriaLoading && <div className="criteria-state criteria-state--hero" role="status">Carregando 3 itens aleatórios...</div>}
              {criteriaError && <div className="criteria-state criteria-state--hero" role="alert">Não foi possível carregar os itens agora.</div>}
{!criteriaLoading && !criteriaError && (
  <div className="classics-command__chips">
    {previewItems.map((item, index) => (
      <button
        key={item.id}
        type="button"
        onClick={() => void openItem(item)}
        disabled={consultationLoading || criteriaBlocked}
      >
        <span>{String(index + 1).padStart(2, "0")}</span>

        <strong>
          <small>{item.parent_item_name}</small>
          {item.name}
        </strong>

        <ArrowRight size={15} />
      </button>
    ))}
  </div>
)}

              {consultationLoading && <div className="criteria-state criteria-state--hero" role="status">Consultando item selecionado...</div>}
              {criteriaBlocked && <div className="classics-command__blocked"><LockKeyhole size={15} /><span>Limite de consultas atingido. </span><button type="button" onClick={scrollToDownload}>Continuar no app <ArrowRight size={14} /></button></div>}
            </> : <>
              <div className="classics-command__heading"><span className="panel__kicker">ITEM / {selectedEvaluation.item_id}</span><h2>{selectedEvaluation.item_name}</h2><p>{selectedEvaluation.item_description}</p></div>
              <div className="classics-command__results">{selectedEvaluation.criteria.map((criterion) => <article className="classics-result" key={criterion.id}><span className="classics-result__index">{criterion.id}</span>{(() => { const typed = typedCriteria[criterion.id] ?? ""; const separator = typed.indexOf("\u0000"); const description = separator >= 0 ? typed.slice(0, separator) : typed; const instructions = separator >= 0 ? typed.slice(separator + 1) : ""; const complete = typed.length >= (criterion.description + "\u0000" + criterion.detailedInstructions).length; return <><h3>{criterion.name}</h3><p>{description}{!complete && <b className="criterion-caret">▌</b>}</p>{separator >= 0 && <div className="classics-result__instructions">{instructions.split("\n").map((line, index) => <p key={criterion.id + "-" + index}>{line || "\u00a0"}</p>)}{!complete && <b className="criterion-caret">▌</b>}</div>}</>; })()}</article>)}</div>
              <div className="classics-command__footer"><span>Consulta gratuita realizada</span><button type="button" onClick={scrollToDownload}>Continuar no app <ArrowRight size={14} /></button></div>
            </>}
          </div>
        </div>
        <a className="hero__scroll" href="#como-funciona"><span>Conheça o método</span><ArrowDown size={15} /></a>
      </section>
      <section id="como-funciona" className="intro-section page-shell section-padding">
        <div className="section-heading section-heading--split">
          <div><div className="eyebrow"><span className="eyebrow__number">01</span> AVALIAÇÃO SEM COMPLICAÇÃO</div><h2>Um olhar mais claro<br />sobre o que <em>importa.</em></h2></div>
          <p>O Alemarco Classics organiza a inspeção do seu veículo em uma sequência simples, com perguntas que fazem sentido e um relatório que você consegue usar.</p>
        </div>
        <div className="category-grid">
          {categories.map(({ number, title, text, icon: Icon }) => (
            <article className="category-card" key={title}>
              <div className="category-card__top"><span>{number}</span><Icon size={21} strokeWidth={1.5} /></div>
              <h3>{title}</h3><p>{text}</p><a href="#relatorio" aria-label={`Ver avaliação ${title}`}>Ver detalhes <ArrowRight size={14} /></a>
            </article>
          ))}
        </div>
      </section>

      <section id="modos" className="modes-section section-padding">
        <div className="page-shell">
          <div className="section-heading section-heading--split section-heading--light">
            <div><div className="eyebrow eyebrow--light"><span className="eyebrow__number">02</span> DOIS MODOS DE USO</div><h2>Do seu jeito.<br /><em>No seu tempo.</em></h2></div>
            <p>Porque nem toda avaliação precisa ter a mesma profundidade. Escolha o modo que combina com o momento — e mude quando quiser.</p>
          </div>
          <div className="mode-switcher" role="tablist" aria-label="Modos de avaliação">
            {(Object.keys(modeData) as Array<keyof typeof modeData>).map((key) => (
              <button key={key} className={`mode-tab ${activeMode === key ? "mode-tab--active" : ""}`} type="button" role="tab" aria-selected={activeMode === key} onClick={() => setActiveMode(key)}>
                <span>{key === "entusiasta" ? "01" : "02"}</span><strong>{modeData[key].label}</strong><small>{key === "entusiasta" ? "Simples e rápido" : "Detalhado e completo"}</small><ArrowRight size={16} />
              </button>
            ))}
          </div>
          <div className="mode-detail" key={activeMode}>
            <div className="mode-detail__copy"><div className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> {mode.eyebrow}</div><h3>{mode.title}</h3><p>{mode.text}</p><div className="mode-meta"><span><ClipboardCheck size={15} /> {mode.count}</span><span><Gauge size={15} /> {mode.time}</span></div></div>
            <div className="mode-checklist"><div className="checklist__header"><span>ROTEIRO DE AVALIAÇÃO</span><span>ATIVO</span></div>{mode.checks.map((check) => <div className="check-row" key={check}><span className="check-icon"><Check size={13} /></span><span>{check}</span><ChevronDown size={14} /></div>)}<div className="checklist__footer"><span><LockKeyhole size={13} /> Salvo no dispositivo</span><span>Offline first</span></div></div>
          </div>
        </div>
      </section>

      <section id="relatorio" className="report-section section-padding page-shell">
        <div className="section-heading section-heading--split">
          <div>
            <div className="eyebrow">
              <span className="eyebrow__number">03</span> 
                RESULTADO DA AVALIAÇÃO
            </div>
          <h2>Clareza para<br />
            <em>decidir melhor.</em>
          </h2>
        </div>
        <p>
        Ao final, você recebe uma visão organizada do veículo — sem jargão desnecessário, sem notas soltas e sem perder o contexto.</p></div>
        <div className="report-layout">
          <div className="report-visual report-visual--real">
            <div className="report-visual__frame">
              <img
                src={reportImage}
                alt="Tela real do relatório de avaliação do Alemarco Classics"
              />
            </div>

            <div className="report-visual__caption">
              <span>RELATÓRIO FINAL</span>
                <strong>Uma leitura clara do seu clássico.</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="offline-section section-padding">
        <div className="page-shell offline-layout"><div className="offline-copy"><div className="eyebrow"><span className="eyebrow__number">04</span> FEITO PARA A ESTRADA</div><h2>Avalie onde<br /><em>o carro estiver.</em></h2><p>Na garagem, em um encontro ou diante de uma oportunidade de compra. O Alemarco Classics funciona totalmente offline para você não depender de sinal.</p><div className="offline-points"><div><LockKeyhole size={18} /><span><strong>Privacidade por padrão</strong><small>Suas avaliações ficam no seu dispositivo.</small></span></div><div><NotebookPen size={18} /><span><strong>Créditos sob demanda</strong><small>Use apenas quando realmente precisar.</small></span></div></div></div><div className="offline-image"><img src={dashboardImage} alt="Painel clássico com instrumentos analógicos" /><div className="offline-image__label"><span>SEM SINAL.</span><strong>SEM PROBLEMA.</strong><i /></div></div></div>
      </section>

      <section className="steps-section section-padding page-shell">
        <div className="section-heading section-heading--center"><div className="eyebrow"><span className="eyebrow__number">05</span> DO PRIMEIRO TOQUE AO RELATÓRIO</div><h2>Um método simples<br /><em>para cuidar melhor.</em></h2></div>
        <div className="steps-grid">{steps.map((step) => <article className="step-card" key={step.number}><span className="step-card__number">{step.number}</span><div className="step-card__line" /><h3>{step.title}</h3><p>{step.text}</p></article>)}</div>
      </section>


      <section id="download" className="download-section">
        <div className="download-section__bg" style={{ backgroundImage: `url(${heroImage})` }} />
        <div className="download-section__scrim" />
        <div className="page-shell download-content">
        <div className="eyebrow eyebrow--light"><span className="eyebrow__dot" /> COMECE AGORA</div>
          <h2>Seu clássico<br />merece ser <em>entendido.</em></h2><p>Baixe o Alemarco Classics e faça sua próxima avaliação com mais confiança, praticidade e precisão.</p>
          <div className="store-buttons"><StoreButtons /></div>
            <small className="download-note">Disponível para iOS e Android · Avaliações offline</small>
        </div>
        <div className="download-mark"><Mark compact />
          <span>ALEMARCO CLASSICS / 2026</span>
        </div>
      </section>


      <footer className="site-footer page-shell">
        <div className="footer-links"><a href="#inicio">Início</a><a href="#modos">Modos</a><a href="https://alemarcoraridades.com/privacidade.html" target="_blank" rel="noreferrer">Privacidade</a></div><span>© 2026 AleMarco Raridades. Todos os direitos reservados.</span></footer>
    </main>
  );
}
