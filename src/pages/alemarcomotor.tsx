/*
 * Direção visual: referência de produto automotivo contemporâneo, reinterpretada para Alemarco Motor.
 * Fluxo: hero com painel de ação, perguntas rápidas, modos de uso, evidências do app, áreas de vídeo e CTA.
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Check, Gauge, History, Play, ShieldCheck, Wrench, AlertTriangle, Image, SearchCheck } from "lucide-react";
import { supabase } from "../lib/supabase";

type Symptom = {
  id: string;
  name: string;
  system_id: string;
};

type Diagnosis = {
  id: string;
  diagnosis: string;
  solution: string;
  severity: string;
  sort_order: number;
};



const icon = "/alemarco-motor/icon.png";
const scanner = "/alemarco-motor/play_02_scanner_16x9.png";
const odometer = "/alemarco-motor/odometer.mp4";
const diagnosis = "/alemarco-motor/play_03_diagnostico_16x9.png";
const dashboard = "/alemarco-motor/dashboard.mp4";
const diagnosis_video = "/alemarco-motor/diagnosis_video.mp4"; 
const guide = "/alemarco-motor/play_04_ficha_instrucao_16x9.png";
const history = "/alemarco-motor/play_05_log_manutencao_16x9.png";
//const hero = "/alemarco-motor/foto_real_refinada.png";
const hero = "/alemarco-motor/video_bordas_desfocadas_final.mp4";



const modes = [
  { id: "01", title: "Painel de manutenção", text: "Tudo o que o seu carro precisa, organizado por prioridade e no momento certo.", icon: Wrench },
  { id: "02", title: "Diagnóstico por sintoma", text: "Descreva o comportamento do veículo e entenda os próximos caminhos possíveis.", icon: SearchCheck },
  { id: "03", title: "Histórico que acompanha", text: "O histórico pertence ao clássico. Registre, importe e transfira com o carro.", icon: History },
  { id: "04", title: "Velocímetro GPS", text: "Cada volta com seu clássico é acompanhada um belo velocímetro retrô. E a quilometragem é transportada para o seu painel.", icon: Gauge },
];

function StoreButtons() {
  
   return <div className="flex flex-row items-center gap-3 flex-wrap">
<a className="block h-12 w-[162px] overflow-hidden" href="https://apps.apple.com/br/app/alemarco-motor/id6762020003" target="_blank" rel="noreferrer">
  <img
    src= {"https://toolbox.marketingtools.apple.com/api/assets/featured-content/apps/badges/badge-2/en-us.svg"}
    alt= {"Disponível na App Store"}
    className="block h-full w-full object-fill"
  />
</a>
<a className="block h-12 w-[162px] overflow-hidden" href="https://play.google.com/store/apps/details?id=com.alemarco.motor" target="_blank" rel="noreferrer">
  <img
    src= {"https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"}
    alt= {"Disponível na Google Play"}
    className="block h-full w-full scale-[1.30] object-fill"
  />
</a>
</div>;
}


function pickSymptoms(items: Symptom[]) {
  return [...items]
    .sort(() => Math.random() - 0.5)
    .slice(0, 4);
}

function VideoSlot({ poster, eyebrow, title, description }: { poster: string; eyebrow: string; title: string; description: string }) {
  const isVideo = poster.endsWith(".mp4");
  return <article className="video-slot"><div className="video-frame">{isVideo ? <video autoPlay loop muted playsInline preload="metadata" aria-label={title}><source src={poster} type="video/mp4" /></video> : <img src={poster} alt="" />}<div className="video-frame__veil" />{!isVideo && <button type="button" className="video-play" aria-label={`Reproduzir vídeo: ${title}`}><Play size={18} fill="currentColor" /></button>}<span className="video-placeholder">{isVideo ? "ALEMARCO MOTOR" : "VIDEO / ADICIONAR ARQUIVO"}</span></div><div className="video-copy"><span>{eyebrow}</span><h3>{title}</h3><p>{description}</p></div></article>;
}

 function getVisitorId() {
    const storageKey = "alemarco-visitor-id";
    const existingId = window.localStorage.getItem(storageKey);

    if (existingId) return existingId;

    const newId = crypto.randomUUID();
    window.localStorage.setItem(storageKey, newId);
    return newId;
  }


export default function Home() {
  const [visibleSymptoms, setVisibleSymptoms] = useState<Symptom[]>([]);
  const [selectedDiagnoses, setSelectedDiagnoses] = useState<Diagnosis[]>([]);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [authRequired, setAuthRequired] = useState(false);
  const [consultationBlocked, setConsultationBlocked] = useState(false);
  const [promptText, setPromptText] = useState("");
  const [selectedSymptom, setSelectedSymptom] = useState<Symptom | null>(null);
  const [typedResponse, setTypedResponse] = useState("");
  const [visibleDiagnosisCount, setVisibleDiagnosisCount] = useState(0);
  const [typedDiagnoses, setTypedDiagnoses] = useState<Record<string, string>>({});
  const severityLabels: Record<string, string> = {
  low: "Baixa",
  medium: "Média",
  high: "Alta",
  critical: "Crítica",
};

 useEffect(() => {
  let cancelled = false;

  const loadSymptoms = async () => {
    const { data, error } = await supabase.rpc(
      "get_public_symptoms"
    );
    console.log("Sintomas recebidos:", data);
    console.log("Erro da RPC:", error);


    if (cancelled) return;

    if (error) {
      console.error("Erro ao carregar sintomas:", error);
      setVisibleSymptoms([]);
      return;
    }

    const loadedSymptoms = (data ?? []) as Symptom[];

    setVisibleSymptoms(
      pickSymptoms(loadedSymptoms)
    );
  };

  void loadSymptoms();

  return () => {
    cancelled = true;
  };
}, []);


  const openDiagnosis = async (symptom: Symptom) => {
    setLoadingDiagnosis(true);
    setAuthRequired(false);
    setConsultationBlocked(false);
    setSelectedDiagnoses([]);


  const visitorId = getVisitorId();

  const { data, error } = await supabase.rpc(
    "get_diagnoses_for_visitor",
    {
      p_symptom_id: symptom.id,
      p_visitor_id: visitorId,
    }
  );

  if (error) {
    const errorText = [
      error.message,
      error.details,
      error.hint,
      error.code,
    ]
      .filter(Boolean)
      .join(" ");

    if (errorText.includes("CONSULTATION_LIMIT_REACHED")) {
      setConsultationBlocked(true);
      setSelectedSymptom(null);
    } else {
      console.error("Erro ao buscar diagnóstico:", error);
    }

    setLoadingDiagnosis(false);
    return;
  }

  setSelectedDiagnoses((data ?? []) as Diagnosis[]);
  setSelectedSymptom(symptom);
  setLoadingDiagnosis(false);
  window.setTimeout(() => document.getElementById("diagnostico")?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);
  };


  useEffect(() => {
    if (selectedSymptom) {
      setPromptText(selectedSymptom.name);
      return;
    }
    if (visibleSymptoms.length === 0) return;
    let phraseIndex = 0;
    let cursor = 0;
    let deleting = false;
    let pauseUntil = Date.now() + 400;
    const promptTimer = window.setInterval(() => {
      const phrase = `Meu carro apresenta ${visibleSymptoms[phraseIndex].name.toLowerCase()}`;
      if (Date.now() < pauseUntil) return;
      if (!deleting) {
        cursor += 1;
        setPromptText(phrase.slice(0, cursor));
        if (cursor >= phrase.length) {
          deleting = true;
          pauseUntil = Date.now() + 1250;
        }
      } else {
        cursor -= 1;
        setPromptText(phrase.slice(0, Math.max(0, cursor)));
        if (cursor <= 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % visibleSymptoms.length;
          pauseUntil = Date.now() + 260;
        }
      }
    }, 42);
    return () => window.clearInterval(promptTimer);
  }, [visibleSymptoms, selectedSymptom]);


  useEffect(() => {
    if (!selectedSymptom) {
      setTypedResponse("");
      setVisibleDiagnosisCount(0);
      setTypedDiagnoses({});
      return;
    }
    const intro = `Entendi. Você relatou “${selectedSymptom.name.toLowerCase()}”. Vou organizar as possibilidades mais prováveis para esse sintoma e indicar o próximo ponto de verificação.`;
    let cursor = 0;
    setTypedResponse("");
    setVisibleDiagnosisCount(0);
    setTypedDiagnoses({});
    const typeTimer = window.setInterval(() => {
      cursor += 1;
      setTypedResponse(intro.slice(0, cursor));
      if (cursor >= intro.length) window.clearInterval(typeTimer);
    }, 16);
    let cancelled = false;
    const wait = (milliseconds: number) => new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
    const revealTimer = window.setTimeout(async () => {
      for (let index = 0; index < selectedDiagnoses.length; index += 1) {
        if (cancelled) return;
        const item = selectedDiagnoses[index];
        setVisibleDiagnosisCount(index + 1);
        const fullText = `${item.diagnosis}\u0000${item.solution}`;
        for (let cursor = 1; cursor <= fullText.length; cursor += 1) {
          if (cancelled) return;
          setTypedDiagnoses((current) => ({ ...current, [item.id]: fullText.slice(0, cursor) }));
          await wait(18);
        }
        await wait(240);
      }
    }, intro.length * 16 + 420);
    return () => {
      cancelled = true;
      window.clearInterval(typeTimer);
      window.clearTimeout(revealTimer);
    };
  }, [selectedSymptom, selectedDiagnoses.length]);

  return <main className="drox-page alemarco-motor-landing">
    <header className="drox-nav"><a href="#inicio" className="drox-brand"><img src={icon} alt="" /><span>Alemarco Motor</span></a><nav><a href="#modos">Modos de uso</a><a href="#produto">O app</a><a href="#videos">Vídeos</a></nav><a className="drox-nav-cta" href="#download">Baixar grátis <ArrowRight size={14} /></a></header>

    <section id="inicio" className="drox-hero" style={{ position: "relative", overflow: "hidden" }}>
      <video autoPlay loop muted playsInline preload="auto" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", zIndex: 0, pointerEvents: "none" }}>
        <source src={hero} type="video/mp4" />
      </video>
      <div aria-hidden="true" style={{ position: "absolute", inset: 0, zIndex: 1, background: "linear-gradient(90deg, rgba(5,7,8,.94) 0%, rgba(5,7,8,.68) 46%, rgba(5,7,8,.25) 100%)" }} />
      <div className="drox-hero__noise" />
      <div className={`drox-hero__inner ${selectedSymptom ? "drox-hero__inner--diagnosis" : ""}`}><span className="drox-overline">ALEMARCO MOTOR / O SEU PAINEL INTELIGENTE</span>{selectedSymptom ? <div className="drox-command drox-command--diagnosis"><div className="drox-command__top"><span><i /> Alemarco Motor está analisando</span><span>01 / 04</span></div><div className="drox-ai-panel drox-ai-panel--hero"><div className="drox-ai-message"><div className="drox-ai-avatar"><img src={icon} alt="" /></div><div><span className="drox-overline">RESPOSTA / {selectedSymptom.system_id}</span><p>{typedResponse}<b className="drox-caret">▌</b></p></div></div><div className="drox-ai-notice"><AlertTriangle size={14} /> Possíveis causas ordenadas por nível de severidade. Confirme a causa antes de substituir peças.</div><div className="drox-ai-results">{selectedDiagnoses.slice(0, visibleDiagnosisCount).map((item, index) => <article className={`drox-ai-result drox-ai-result--${item.severity}`} key={item.id}><span>{String(index + 1).padStart(2, "0")} / {severityLabels[item.severity] ?? item.severity}</span><div>{(() => {
              const typed = typedDiagnoses[item.id] ?? "";
              const separator = typed.indexOf("\u0000");
              const title = separator >= 0 ? typed.slice(0, separator) : typed;
              const solution = separator >= 0 ? typed.slice(separator + 1) : "";
              const complete = typed.length >= `${item.diagnosis}\u0000${item.solution}`.length;
              return <><h3>{title}{!complete && <b className="drox-caret">▌</b>}</h3>{separator >= 0 && <p>{solution}{!complete && <b className="drox-caret">▌</b>}</p>}</>;
            })()}</div></article>)}{typedResponse.length > 0 && visibleDiagnosisCount >= selectedDiagnoses.length && <p className="drox-ai-footnote">A confirmação exige inspeção adequada. Se o sintoma envolver freios, óleo ou superaquecimento, evite continuar rodando até avaliar o veículo.</p>}</div><button type="button" className="drox-ai-close" onClick={() => setSelectedSymptom(null)} aria-label="Voltar às sugestões">× Voltar</button></div></div> : <><h1>Seu carro sob<br /><em>controle,</em> de verdade.</h1><p>Manutenção, diagnóstico e histórico para quem cuida de carros clássicos com mais segurança e previsibilidade.</p><div className="drox-command"><div className="drox-command__top"><span><i /> Alemarco Motor está pronto</span><span>01 / 04</span></div><button type="button" className="drox-command__input" onClick={() => openDiagnosis(visibleSymptoms[0])} aria-label="Abrir diagnóstico para o sintoma sugerido"><span><small>Descreva o que você quer acompanhar</small><strong>{promptText}<b className="drox-prompt-caret">▌</b></strong></span><ArrowRight size={16} /></button>
            <div className="drox-chips">{visibleSymptoms.map((symptom) => <button key={symptom.id} type="button" onClick={() => openDiagnosis(symptom)}>{symptom.name}</button>)}</div></div></>}</div>
      {consultationBlocked && <div role="alert" className="alemarco-consultation-block" style={{ position: "absolute", zIndex: 20, top: "calc(50% + 270px)", left: "50%", width: "min(92%, 560px)", transform: "translateX(-50%)", padding: "1.25rem 1.5rem", borderRadius: "1rem", background: "rgba(8, 12, 15, .96)", border: "1px solid rgba(255,255,255,.18)", boxShadow: "0 24px 80px rgba(0,0,0,.55)", backdropFilter: "blur(16px)", fontFamily: "inherit", color: "inherit" }}><span className="drox-overline">LIMITE GRATUITO ATINGIDO</span><h3>Continue o diagnóstico no app.</h3><p>Você já utilizou as 2 consultas gratuitas. Baixe o Alemarco Motor para continuar acompanhando seu carro.</p><a className="drox-nav-cta" href="#download" onClick={(event) => { event.preventDefault(); document.getElementById("download")?.scrollIntoView({ behavior: "smooth", block: "start" }); }}>Baixar o app <ArrowRight size={14} /></a></div>}
      <a className="drox-scroll" href="#modos"><span>Conheça o painel</span><ArrowDown size={15} /></a>
    </section>


    <section id="modos" className="drox-section drox-modes"><div className="drox-section-head"><span className="drox-overline">01 / MODOS DE USO</span><h2>Várias formas de<br /><em>cuidar melhor.</em></h2><p>O Alemarco Motor transforma o celular em uma central simples para acompanhar o carro antes, durante e depois de cada saída.</p></div><div className="mode-grid">{modes.map(({ id, title, text, icon: ModeIcon }) => <article className="mode-card" key={id}><div className="mode-card__top"><span>{id}</span><ModeIcon size={20} /></div><h3>{title}</h3><p>{text}</p><a href="#produto">Explorar <ArrowRight size={14} /></a></article>)}</div></section>

    <section id="produto" className="drox-section drox-product"><div className="drox-section-head drox-section-head--wide"><span className="drox-overline">02 / EM AÇÃO</span><h2>Do sintoma ao<br /><em>próximo passo.</em></h2><p>Veja como as ferramentas do app ajudam a registrar o que acontece e transformar sinais em decisões mais claras.</p></div><div className="proof-strip"><div className="proof-main"><img src={diagnosis} alt="Tela de diagnóstico por sintoma do Alemarco Motor" /><div><span>DIAGNÓSTICO TÉCNICO</span><strong>Seu mecânico de bolso.</strong></div></div><div className="proof-side"><img src={scanner} alt="Scanner de odômetro do Alemarco Motor" /><div><span>REGISTRO DE QUILOMETRAGEM</span><strong>Aponte, escaneie, pronto.</strong></div></div><div className="proof-side"><img src={guide} alt="Ficha de instrução do Alemarco Motor" /><div><span>GUIA DE PROCEDIMENTO</span><strong>Manutenção passo a passo.</strong></div></div></div></section>

    <section id="videos" className="drox-section drox-video-section"><div className="drox-section-head drox-section-head--wide"><span className="drox-overline">03 / SEU CLÁSSICO</span><h2>Seu clássico acompanhado<br /><em>em movimento.</em></h2><p>Estes são os espaços reservados para seus vídeos curtos. Basta enviar os arquivos e eles serão inseridos aqui sem alterar a composição da página.</p></div><div className="video-grid">

<VideoSlot poster={odometer} eyebrow="ESCANEIE E, PRONTO" title="Registre em segundos" description="A quilometragem atualizada no seu painel de forma prática e precisa." />
<VideoSlot poster={dashboard} eyebrow="MONITORAMENTO ATIVO" title="Seu painel sempre no controle" description="Gerencie toda a sua garagem em apenas um painel." />
<VideoSlot poster={diagnosis_video} eyebrow="DISPONÍVEL ATÉ OFF LINE" title="Encontre o diagnóstico correto" description="Apareceu um problema, seu diagnóstico rápido está disponível a qualquer momento." /></div></section>

    <section className="drox-section drox-heritage"><div className="heritage-panel"><div><span className="drox-overline">04 / O HISTÓRICO</span><h2>O carro muda de dono.<br /><em>A história fica.</em></h2><p>Importe o histórico quando comprar ou transfira para o próximo proprietário quando vender. O histórico pertence ao clássico.</p><div className="heritage-check"><ShieldCheck size={17} /> Seus dados continuam sob seu controle.</div></div><img src={history} alt="Procedimento de manutenção no Alemarco Motor" /></div></section>



    <section id="download" className="drox-final"><div><span className="drox-overline">COMECE AGORA</span>
<h2>Seu clássico<br />merece este <em>painel.</em></h2>
<p>Teste o Alemarco Motor por 30 dias e comece a cuidar do seu carro com mais clareza.</p><br />
<StoreButtons /></div>
<div className="drox-final__mark"><img src={icon} alt="" /><span>ALEMARCO MOTOR / 2026</span></div></section>
    <footer className="drox-footer"><a href="#inicio" className="drox-brand"></a>
<a href="https://alemarcoraridades.com/privacidade.html" target="_blank" rel="noreferrer">Privacidade</a><span>© 2026 AleMarco Raridades. Todos os direitos reservados.</span></footer>
  </main>;
}
