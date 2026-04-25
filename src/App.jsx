import { useState, useEffect } from "react";
import storage from "./storage.js";

// ─── DESENVOLVEDOR ────────────────────────────────────────────────────────────
const DEV = {
  nome:    "Rafael Rodrigues",
  titulo:  "Engenheiro Civil",
  espec:   "Especialista em Gerenciamento de Obras",
  crea:    "",   // preencha seu CREA aqui se desejar exibir
  email:   "",   // opcional
  versao:  "v8.1 — Abr/2026",
};

// ─── TEMA ─────────────────────────────────────────────────────────────────────
const C={bg:"#05080e",s1:"#0a1120",s2:"#101828",s3:"#182033",bd:"#1c2e47",bd2:"#253d5c",t1:"#e8edf5",t2:"#8ba3c0",t3:"#3d5a7a",gold:"#d4a843",grn:"#4ade80",blu:"#60a5fa",org:"#fb923c",red:"#f87171",pur:"#c084fc",cya:"#22d3ee",warn:"#fbbf24"};
const fR=v=>(v||0).toLocaleString("pt-BR",{style:"currency",currency:"BRL",maximumFractionDigits:0});
const fD=v=>(v||0).toLocaleString("pt-BR",{minimumFractionDigits:2,maximumFractionDigits:2});
const fN=(v,d=1)=>(v||0).toLocaleString("pt-BR",{maximumFractionDigits:d,minimumFractionDigits:d});

// ─── CUB BASE (valores mais recentes disponíveis por estado — R1 NBR 12721) ──
// Fonte oficial: Sinduscons estaduais · CBIC · cub.org.br
// Referência: Mar/2026 (maioria) · SC: Abr/2026 (Sinduscon-BC confirmado)
// ⚠️ O CUB é divulgado até o dia 5 de cada mês por cada Sinduscon.
//    Use o painel "Atualizar CUB" para manter os valores sempre atualizados
//    sem precisar alterar o código — os valores ficam salvos no storage local.
const CUB_BASE={
  PR:{n:"Paraná",          ref:"Mar/2026",b:2546.76,m:3181.51,a:3884.55, url:"https://sindusconpr.com.br"},
  SC:{n:"Santa Catarina",  ref:"Abr/2026",b:2402.59,m:3037.72,a:3711.00, url:"https://sindusconbc.com.br"},
  RS:{n:"Rio Grande do Sul",ref:"Mar/2026",b:2555.00,m:3194.20,a:3900.00, url:"https://sinduscon-rs.com.br"},
  SP:{n:"São Paulo",       ref:"Jan/2026",b:2043.00,m:2553.84,a:3118.00, url:"https://sindusconsp.com.br"},
  RJ:{n:"Rio de Janeiro",  ref:"Jan/2026",b:2307.00,m:2881.26,a:3520.00, url:"https://sinduscon-rj.com.br"},
  MG:{n:"Minas Gerais",    ref:"Jan/2026",b:2271.00,m:2838.67,a:3467.00, url:"https://sinduscon-mg.org.br"},
  ES:{n:"Espírito Santo",  ref:"Mar/2026",b:2253.00,m:2817.55,a:3440.00, url:"https://sinduscon-es.com.br"},
  GO:{n:"Goiás",           ref:"Mar/2026",b:2184.00,m:2729.69,a:3332.00, url:"https://sinduscongoias.com.br"},
  MT:{n:"Mato Grosso",     ref:"Fev/2026",b:2509.00,m:3136.88,a:3830.00, url:"https://sinduscon-mt.com.br"},
  MS:{n:"Mato Grosso do Sul",ref:"Fev/2026",b:1363.00,m:1703.59,a:2080.00, url:"https://sinduscon-ms.org.br"},
  DF:{n:"Distrito Federal",ref:"Mar/2026",b:1861.00,m:2326.48,a:2840.00, url:"https://sinduscon-df.com.br"},
  BA:{n:"Bahia",           ref:"Fev/2026",b:1664.00,m:2079.83,a:2540.00, url:"https://sindusconba.com.br"},
  CE:{n:"Ceará",           ref:"Fev/2026",b:1827.00,m:2284.42,a:2788.00, url:"https://sinduscon-ce.com.br"},
  PE:{n:"Pernambuco",      ref:"Mar/2026",b:1729.00,m:2161.15,a:2638.00, url:"https://sindusconpe.com.br"},
  MA:{n:"Maranhão",        ref:"Fev/2026",b:1493.00,m:1866.08,a:2279.00, url:"https://sindusconma.com.br"},
  PI:{n:"Piauí",           ref:"Jan/2026",b:1477.00,m:1846.15,a:2254.00, url:"https://sindusconpi.com.br"},
  RN:{n:"Rio Grande do Norte",ref:"Jan/2026",b:1585.00,m:1981.73,a:2419.00, url:"https://sinduscon-rn.com.br"},
  PB:{n:"Paraíba",         ref:"2025",    b:1600.00,m:2000.00,a:2442.00, url:"https://sindusconpb.com.br"},
  AL:{n:"Alagoas",         ref:"2025",    b:1540.00,m:1925.00,a:2350.00, url:"https://sinduscon-al.com.br"},
  SE:{n:"Sergipe",         ref:"2025",    b:1550.00,m:1938.00,a:2366.00, url:"https://sindusconse.com.br"},
  PA:{n:"Pará",            ref:"Mar/2026",b:1822.00,m:2277.45,a:2780.00, url:"https://sindusconpa.org.br"},
  AM:{n:"Amazonas",        ref:"2025",    b:1800.00,m:2250.00,a:2748.00, url:"https://sindusconam.com.br"},
  RO:{n:"Rondônia",        ref:"Mar/2026",b:1887.00,m:2359.16,a:2880.00, url:"https://sinduscon-ro.com.br"},
  AC:{n:"Acre",            ref:"2025",    b:1600.00,m:2000.00,a:2442.00, url:"https://sindusconac.com.br"},
  RR:{n:"Roraima",         ref:"2025",    b:1650.00,m:2062.00,a:2518.00, url:"https://sinduscon-rr.com.br"},
  TO:{n:"Tocantins",       ref:"2025",    b:1640.00,m:2050.00,a:2503.00, url:"https://sinduscon-to.com.br"},
};
const REGIOES={Sul:["PR","SC","RS"],Sudeste:["SP","RJ","MG","ES"],"Centro-Oeste":["GO","MT","MS","DF"],Nordeste:["BA","CE","PE","MA","PI","RN","PB","AL","SE"],Norte:["PA","AM","RO","AC","RR","TO"]};
const RCOR={Sul:C.grn,Sudeste:C.blu,"Centro-Oeste":C.gold,Nordeste:C.red,Norte:C.pur};

// ─── ÍNDICES UNITÁRIOS (NBR 12721 · SINAPI · TCPO 13ª ed.) ───────────────────
// ⚠️ APENAS para o Modo Detalhado — NÃO somam ao CUB no Modo CUB
const IDX={
  concreto_15mpa:{cimento_kg:308,areia_m3:0.876,brita1_m3:0.836},
  alvenaria_m2:{tijolo_un:31.47,cimento_kg:2.78,arenoso_m3:0.00926,areia_m3:0.01390},
  chapisco_m2:{cimento_kg:2.43,areia_m3:0.0061},
  emboco_m2:{cimento_kg:3.80,areia_m3:0.00948,arenoso_m3:0.0222},
  reboco_m2:{cimento_kg:9.72,areia_m3:0.0187},
  massa_m2:{massa_corrida_kg:0.58,lixa_un:0.50},
  contrapiso_m2:{cimento_kg:13.20,areia_m3:0.04062,brita1_m3:0.01578,brita2_m3:0.0369},
  piso_m2:{cimento_kg:8.60,piso_fator:1.10,cal_kg:1.825,areia_m3:0.0305},
  laje_m2:{cimento_kg:9.0,areia_m3:0.0305,barra_63_m:1.89,prego_kg:0.03,pontalete_m:1.71,sarrafo_m:0.97,tabua_m:0.56},
  telha_m2:{telhas_un:16},
  madeiramento_m2:{madeira_m3:0.045},
  // estrutura parametrizada por área — coeficientes médios SINAPI residencial
  estrutura_m2:{
    // fundação: ~0,30m³ concreto/m² de área (estacas+baldrame) — residência térrea simples
    concreto_fund_m3:0.30,
    // armação: ~22 kg/m² total (estacas+pilares+baldrame+vigas+laje)
    aco_total_kg:22,
    // tijolos: ~45 un/m² de parede × ~3,0m de parede/m² de piso (paredes internas+externas)
    tijolo_por_m2_area:45,
    // laje: ~1,0 m²/m² de área construída
    lajota_por_m2:15, // lajotas EPS H8 por m² de laje
  },
};

// ─── PARÂMETROS ESTRUTURAIS AUTOMÁTICOS (por área) ───────────────────────────
// Elimina valores fixos — tudo derivado da área real
function calcEstrutura(areaReal) {
  // Coeficientes paramétricos médios — residência unifamiliar térrea/sobrado simples
  // Fonte: SINAPI/PR · NBR 6118 · médias de mercado
  const estacas = Math.ceil(areaReal / 4.5);                     // ~1 estaca a cada 4,5m²
  const baldrame = Math.sqrt(areaReal) * 4 * 0.92;               // aprox. perímetro de retângulo equivalente
  const pilares  = Math.ceil(areaReal / 12);                     // ~1 pilar a cada 12m²
  const laje     = areaReal * 0.90;                              // 90% da área (descontando varanda/garagem)
  const telhado  = areaReal * 1.15;                              // 15% maior que área (beiral + inclinação)
  const contrapiso = areaReal * 0.95;                            // quase toda a área interna
  const alvenaria  = Math.sqrt(areaReal) * 4 * 0.92 * 2.80 * 0.85; // perímetro × pd × 0,85 (desconta vãos)
  const fachada    = Math.sqrt(areaReal) * 4 * 0.92 * 2.80 * 0.45; // ~45% é externo/fachada
  return { estacas, baldrame:+baldrame.toFixed(2), pilares, laje:+laje.toFixed(1), telhado:+telhado.toFixed(1), contrapiso:+contrapiso.toFixed(1), alvenaria:+alvenaria.toFixed(1), fachada:+fachada.toFixed(1) };
}

// Limites de validação para alertas
const LIMITES = {
  cub_min_m2: 40,    // abaixo disso CUB não é confiável
  cub_max_m2: 500,   // acima disso precisaria de outro padrão
  estr_min_baldrame: 20,
  estr_max_baldrame: 300,
  piso_min: 1, piso_max: 6, // pé direito razoável
};

// ─── TIPOS DE AMBIENTE ────────────────────────────────────────────────────────
const TIPOS={
  sala:{lb:"Sala/Jantar",ic:"🛋️",piso:"porcelanato",molhada:false,rodape:true,coefEq:1.00,altAz:0},
  cozinha:{lb:"Cozinha",ic:"🍳",piso:"ceramica",molhada:true,rodape:true,coefEq:1.00,altAz:1.20},
  quarto:{lb:"Quarto",ic:"🛏️",piso:"porcelanato",molhada:false,rodape:true,coefEq:1.00,altAz:0},
  suite:{lb:"Suíte",ic:"🛁",piso:"ceramica",molhada:true,rodape:true,coefEq:1.00,altAz:1.80},
  banheiro:{lb:"Banheiro",ic:"🚿",piso:"ceramica",molhada:true,rodape:false,coefEq:1.00,altAz:2.30},
  lavabo:{lb:"Lavabo",ic:"🪥",piso:"ceramica",molhada:true,rodape:false,coefEq:1.00,altAz:1.50},
  garagem:{lb:"Garagem",ic:"🚗",piso:"ceramica",molhada:false,rodape:false,coefEq:0.70,altAz:0},
  varanda:{lb:"Varanda",ic:"🌿",piso:"ceramica",molhada:false,rodape:false,coefEq:0.75,altAz:0},
  aserv:{lb:"Área de Serviço",ic:"🧺",piso:"ceramica",molhada:true,rodape:false,coefEq:0.50,altAz:1.50},
  circ:{lb:"Circulação/Hall",ic:"🚶",piso:"porcelanato",molhada:false,rodape:true,coefEq:1.00,altAz:0},
  escritorio:{lb:"Escritório",ic:"💻",piso:"porcelanato",molhada:false,rodape:true,coefEq:1.00,altAz:0},
  dispensa:{lb:"Dispensa",ic:"📦",piso:"ceramica",molhada:false,rodape:true,coefEq:1.00,altAz:0},
};

const AMB_DEF=[
  {id:"s1",tipo:"sala",lb:"Sala de Estar/Jantar",c:5.0,l:4.5,pd:2.80,ativo:true},
  {id:"cz",tipo:"cozinha",lb:"Cozinha",c:4.0,l:3.0,pd:2.80,ativo:true},
  {id:"q1",tipo:"quarto",lb:"Quarto 1",c:3.5,l:3.0,pd:2.80,ativo:true},
  {id:"q2",tipo:"quarto",lb:"Quarto 2",c:3.0,l:3.0,pd:2.80,ativo:true},
  {id:"q3",tipo:"quarto",lb:"Quarto 3",c:3.0,l:2.8,pd:2.80,ativo:true},
  {id:"su",tipo:"suite",lb:"Suíte",c:4.0,l:3.5,pd:2.80,ativo:true},
  {id:"b1",tipo:"banheiro",lb:"Banheiro Social",c:2.5,l:2.0,pd:2.80,ativo:true},
  {id:"b2",tipo:"banheiro",lb:"Banheiro Suíte",c:2.5,l:1.8,pd:2.80,ativo:true},
  {id:"ga",tipo:"garagem",lb:"Garagem (1 vaga)",c:5.5,l:2.8,pd:2.50,ativo:true},
  {id:"va",tipo:"varanda",lb:"Varanda/Área Ext.",c:4.0,l:2.0,pd:2.50,ativo:true},
  {id:"ci",tipo:"circ",lb:"Circulação/Hall",c:4.0,l:1.5,pd:2.80,ativo:true},
];

const ITENS_LIVRES_DEF=[
  {id:"il_proj_arq",cat:"preliminar",tipo:"proj",ic:"📐",lb:"Projeto Arquitetônico",obs:"Contrate arquiteto ou engenheiro. Exigido para alvará.",un:"vb",qtd:1,val:0},
  {id:"il_proj_est",cat:"preliminar",tipo:"proj",ic:"🏗️",lb:"Projeto Estrutural (cálculo)",obs:"Obrigatório para fundações, pilares, vigas e laje.",un:"vb",qtd:1,val:0},
  {id:"il_alvara",cat:"preliminar",tipo:"livre",ic:"📋",lb:"Alvará de Construção + ART/RRT",obs:"Taxa varia conforme município. Consulte a prefeitura.",un:"vb",qtd:1,val:0},
  {id:"il_sondagem",cat:"preliminar",tipo:"livre",ic:"🔍",lb:"Sondagem SPT do Terreno",obs:"Recomendado antes de definir o tipo de fundação.",un:"vb",qtd:1,val:0},
  {id:"il_ligagua",cat:"preliminar",tipo:"livre",ic:"💧",lb:"Ligação Provisória de Água",obs:"Custo junto à concessionária local.",un:"vb",qtd:1,val:0},
  {id:"il_ligenergia",cat:"preliminar",tipo:"livre",ic:"⚡",lb:"Ligação Provisória de Energia",obs:"Custo junto à concessionária local.",un:"vb",qtd:1,val:0},
  {id:"il_proj_ele",cat:"eletrica",tipo:"proj",ic:"📐",lb:"Projeto Elétrico",obs:"Exigido pela concessionária. Dimensiona circuitos, quadros e proteções.",un:"vb",qtd:1,val:0},
  {id:"il_quad_dist",cat:"eletrica",tipo:"livre",ic:"⚡",lb:"Quadro de Distribuição (disjuntores)",obs:"Quantidade de circuitos conforme projeto elétrico.",un:"un",qtd:1,val:0},
  {id:"il_cabo_25",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Cabo cobre flexível 2,5mm²",obs:"Iluminação e tomadas. Qtd. vem do projeto.",un:"m",qtd:0,val:0},
  {id:"il_cabo_40",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Cabo cobre flexível 4,0mm²",obs:"Chuveiro e ar-condicionado.",un:"m",qtd:0,val:0},
  {id:"il_cabo_16",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Cabo cobre flexível 16mm²",obs:"Ramal de entrada (circuito principal).",un:"m",qtd:0,val:0},
  {id:"il_eletroduto",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Eletroduto corrugado PVC 25mm",obs:"Embutido em laje e parede. Qtd. vem do projeto.",un:"m",qtd:0,val:0},
  {id:"il_tomadas",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Tomadas 2P+T 10A",obs:"Quantidade definida no projeto elétrico.",un:"un",qtd:0,val:0},
  {id:"il_interr",cat:"eletrica",tipo:"livre",ic:"🔌",lb:"Interruptores simples/duplos",obs:"Quantidade conforme pontos de iluminação.",un:"un",qtd:0,val:0},
  {id:"il_dps",cat:"eletrica",tipo:"livre",ic:"⚡",lb:"Dispositivo DPS Classe II",obs:"Proteção contra surto. Recomendado por NBR 5410.",un:"un",qtd:1,val:0},
  {id:"il_luminarias",cat:"eletrica",tipo:"livre",ic:"💡",lb:"Luminárias e pontos de luz",obs:"Tipo e quantidade conforme projeto ou cliente.",un:"un",qtd:0,val:0},
  {id:"il_medicao",cat:"eletrica",tipo:"livre",ic:"⚡",lb:"Caixa de Medição (padrão concessionária)",obs:"Especificação conforme distribuidora local.",un:"un",qtd:1,val:0},
  {id:"il_proj_hid",cat:"hidraulica",tipo:"proj",ic:"📐",lb:"Projeto Hidrossanitário",obs:"Define tubulações, reservatório e esgoto.",un:"vb",qtd:1,val:0},
  {id:"il_cx_agua",cat:"hidraulica",tipo:"livre",ic:"💧",lb:"Caixa d'Água (L)",obs:"Mín. 200L/pessoa. 4 pessoas → 1.000L.",un:"L",qtd:1000,val:0},
  {id:"il_regist",cat:"hidraulica",tipo:"livre",ic:"💧",lb:"Registros de gaveta/esfera",obs:"Quantidade conforme pontos de água do projeto.",un:"un",qtd:0,val:0},
  {id:"il_tubo_25",cat:"hidraulica",tipo:"livre",ic:"💧",lb:"Tubo PVC soldável 25mm água fria",obs:"Ramais internos. Qtd. pelo projeto.",un:"m",qtd:0,val:0},
  {id:"il_tubo_50",cat:"hidraulica",tipo:"livre",ic:"💧",lb:"Tubo PVC soldável 50mm",obs:"Sub-ramal e barrilete principal.",un:"m",qtd:0,val:0},
  {id:"il_esg_100",cat:"hidraulica",tipo:"livre",ic:"🪠",lb:"Tubo PVC esgoto DN 100mm",obs:"Ramal de vasos sanitários e coletor.",un:"m",qtd:0,val:0},
  {id:"il_esg_50",cat:"hidraulica",tipo:"livre",ic:"🪠",lb:"Tubo PVC esgoto DN 50mm",obs:"Ramal de lavatórios e pias.",un:"m",qtd:0,val:0},
  {id:"il_fossa",cat:"hidraulica",tipo:"livre",ic:"🪠",lb:"Fossa Séptica + Sumidouro",obs:"Onde não há rede pública. Volume conforme NBR 7229.",un:"vb",qtd:1,val:0},
  {id:"il_cx_gordura",cat:"hidraulica",tipo:"livre",ic:"🪠",lb:"Caixa de Gordura PVC",obs:"Obrigatória antes do ramal da cozinha.",un:"un",qtd:1,val:0},
  {id:"il_cavalete",cat:"hidraulica",tipo:"livre",ic:"💧",lb:"Cavalete + Hidrômetro",obs:"Padrão da concessionária local.",un:"un",qtd:1,val:0},
  {id:"il_porta_ent",cat:"esquadrias",tipo:"livre",ic:"🚪",lb:"Porta de Entrada",obs:"Padrão 0,90×2,10m. Varia conforme material.",un:"un",qtd:1,val:0},
  {id:"il_portas_int",cat:"esquadrias",tipo:"livre",ic:"🚪",lb:"Portas Internas c/ batente e guarnição",obs:"Conjunto completo: folha + batente + guarnição + ferragens.",un:"cj",qtd:0,val:0},
  {id:"il_janelas",cat:"esquadrias",tipo:"livre",ic:"🪟",lb:"Janelas de Alumínio / PVC",obs:"Dimensões e quantidade conforme projeto.",un:"m²",qtd:0,val:0},
  {id:"il_fechad",cat:"esquadrias",tipo:"livre",ic:"🔑",lb:"Fechaduras e Maçanetas",obs:"1 por porta.",un:"cj",qtd:0,val:0},
  {id:"il_gradil",cat:"esquadrias",tipo:"livre",ic:"⛩️",lb:"Portão e Gradil",obs:"Dimensão e material conforme projeto.",un:"vb",qtd:1,val:0},
  {id:"il_bacia",cat:"loucas",tipo:"livre",ic:"🚽",lb:"Bacias Sanitárias c/ caixa acoplada",obs:"1 por banheiro.",un:"un",qtd:0,val:0},
  {id:"il_lavatorio",cat:"loucas",tipo:"livre",ic:"🚿",lb:"Lavatórios c/ coluna",obs:"1 por banheiro. Inclui sifão e engate.",un:"un",qtd:0,val:0},
  {id:"il_banca_coz",cat:"loucas",tipo:"livre",ic:"🍳",lb:"Cuba/Pia de Cozinha + Torneira",obs:"Inox ou cuba de sobrepor. Inclui misturador.",un:"un",qtd:1,val:0},
  {id:"il_chuveiro",cat:"loucas",tipo:"livre",ic:"🚿",lb:"Box + Chuveiro/Ducha",obs:"Box vidro temperado + ducha elétrica ou a gás.",un:"cj",qtd:0,val:0},
  {id:"il_granito",cat:"loucas",tipo:"livre",ic:"🪨",lb:"Granito/Mármore — bancadas",obs:"Cozinha + banheiros. Medida conforme projeto.",un:"m²",qtd:0,val:0},
  {id:"il_acess_bh",cat:"loucas",tipo:"livre",ic:"🪞",lb:"Acessórios de Banheiro (kit 5 pçs)",obs:"Papeleira, toalheiro, cabide, porta-shampoo, espelho.",un:"cj",qtd:0,val:0},
  {id:"il_calçada",cat:"complementar",tipo:"livre",ic:"🛤️",lb:"Calçada + Passeio Público",obs:"Concreto desempenado + piso intertravado.",un:"m²",qtd:0,val:0},
  {id:"il_muro",cat:"complementar",tipo:"livre",ic:"🧱",lb:"Muro de Divisa",obs:"Altura e material conforme legislação municipal.",un:"m",qtd:0,val:0},
  {id:"il_paisag",cat:"complementar",tipo:"livre",ic:"🌿",lb:"Paisagismo e Grama",obs:"Área de jardim × custo de grama + plantio.",un:"m²",qtd:0,val:0},
  {id:"il_habite",cat:"complementar",tipo:"livre",ic:"📋",lb:"Habite-se + Regularização",obs:"Taxa municipal. Varia conforme cidade e área.",un:"vb",qtd:1,val:0},
  {id:"il_ar",cat:"complementar",tipo:"livre",ic:"❄️",lb:"Ar-Condicionado (pontos+split)",obs:"NÃO incluído no CUB. BTUs conforme ambiente.",un:"un",qtd:0,val:0},
  {id:"il_aquecedor",cat:"complementar",tipo:"livre",ic:"🔥",lb:"Aquecedor (elétrico/solar/gás)",obs:"NÃO incluído no CUB. Tipo conforme necessidade.",un:"un",qtd:0,val:0},
  {id:"il_limpeza",cat:"complementar",tipo:"livre",ic:"🧹",lb:"Limpeza Final de Obra",obs:"Limpeza pós-obra: vidros, pisos, louças e fachada.",un:"vb",qtd:1,val:0},
];

const CAT_LIVRE_INFO={preliminar:{lb:"📋 Serviços Preliminares & Legais",cor:C.t2},eletrica:{lb:"⚡ Instalações Elétricas",cor:"#fde047"},hidraulica:{lb:"💧 Instalações Hidráulicas & Esgoto",cor:C.blu},esquadrias:{lb:"🪟 Esquadrias & Ferragens",cor:C.pur},loucas:{lb:"🚿 Louças, Metais e Acessórios",cor:C.cya},complementar:{lb:"✅ Serviços Complementares",cor:C.grn}};

// ─── PARTICIPAÇÃO POR ETAPA NO CUB (fonte: Revista Construção & Mercado) ─────
// Usado APENAS no Modo CUB para detalhar o breakdown — sem criar novos valores
const CUB_PARTICIPACAO=[
  {lb:"Serviços Preliminares",pct:0.010,cor:"#94a3b8",ic:"📋"},
  {lb:"Fundação / Infraestrutura",pct:0.080,cor:C.org,ic:"⬇️"},
  {lb:"Superestrutura (pilares, vigas, lajes)",pct:0.120,cor:C.red,ic:"🏗️"},
  {lb:"Vedação (alvenaria, chapisco, reboco)",pct:0.090,cor:"#fbbf24",ic:"🧱"},
  {lb:"Cobertura (madeiramento + telha)",pct:0.065,cor:C.pur,ic:"🏠"},
  {lb:"Esquadrias (portas e janelas)",pct:0.080,cor:C.red,ic:"🪟"},
  {lb:"Revestimentos (pisos, azulejos, massa)",pct:0.145,cor:C.cya,ic:"⬜"},
  {lb:"Pinturas",pct:0.045,cor:"#a3e635",ic:"🎨"},
  {lb:"Instalações Hidráulicas e Sanitárias",pct:0.080,cor:C.blu,ic:"💧"},
  {lb:"Instalações Elétricas",pct:0.075,cor:"#fde047",ic:"⚡"},
  {lb:"Louças, Metais e Acessórios",pct:0.040,cor:C.cya,ic:"🚿"},
  {lb:"Serviços Complementares",pct:0.045,cor:C.grn,ic:"✅"},
  {lb:"Mão de Obra (rateio geral)",pct:0.120,cor:"#c084fc",ic:"👷"},
];

// ─── GUIA DE COMPRAS (Modo CUB) ───────────────────────────────────────────────
// Quantidade de materiais para REFERÊNCIA DE COMPRAS — deixa claro que é guia,
// NÃO é base de cálculo do custo (que já está no CUB)
function calcGuiaCompras(tot,estr){
  const P=1.10;
  const A=tot.areaReal,Apin=tot.pintura,Apar=tot.azulejo,Aalv=estr.alvenaria;
  const Alaje=estr.laje,Atelh=estr.telhado,Acont=estr.contrapiso;
  return[
    // estrutura parametrizada
    {g:"🏗️ Estrutura",k:"Aço total (CA-50/60)",v:A*IDX.estrutura_m2.aco_total_kg*P,un:"kg",obs:"Estimativa paramétrica — confirme com cálculo estrutural"},
    {g:"🏗️ Estrutura",k:"Lajota EPS H8 (laje pré-fab.)",v:Math.ceil(Alaje*IDX.estrutura_m2.lajota_por_m2*P),un:"un",obs:"15 lajotas/m² +10%"},
    {g:"🧱 Alvenaria",k:"Tijolo cerâmico 9×14×19cm",v:Math.ceil(Aalv*IDX.alvenaria_m2.tijolo_un*P),un:"un",obs:"31,47 un/m² de parede"},
    {g:"🏠 Cobertura",k:"Telha cerâmica plan/romana",v:Math.ceil(Atelh*IDX.telha_m2.telhas_un*P),un:"un",obs:"16 telhas/m² +10%"},
    {g:"🏠 Cobertura",k:"Madeiramento (cumeeira, caibros)",v:+(Atelh*IDX.madeiramento_m2.madeira_m3*P).toFixed(2),un:"m³",obs:"0,045 m³/m² projeção horizontal"},
    // cimento — separado por etapa para facilitar compra
    {g:"🪵 Cimento & Argamassa",k:"Cimento CP II-32 — Estrutura",v:+((A*IDX.estrutura_m2.concreto_fund_m3*IDX.concreto_15mpa.cimento_kg*P)/50).toFixed(0),un:"sc 50kg",obs:"Fundação + pilares + baldrame + capeamento laje"},
    {g:"🪵 Cimento & Argamassa",k:"Cimento CP II-32 — Alvenaria",v:+((Aalv*IDX.alvenaria_m2.cimento_kg*P)/50).toFixed(0),un:"sc 50kg",obs:"Assentamento de tijolos"},
    {g:"🪵 Cimento & Argamassa",k:"Cimento CP II-32 — Revestimento",v:+((Apin*IDX.chapisco_m2.cimento_kg+Apin*IDX.emboco_m2.cimento_kg+Apin*IDX.reboco_m2.cimento_kg)*P/50).toFixed(0),un:"sc 50kg",obs:"Chapisco + emboço + reboco"},
    {g:"🪵 Cimento & Argamassa",k:"Cimento CP II-32 — Contrapiso",v:+((Acont*IDX.contrapiso_m2.cimento_kg*P)/50).toFixed(0),un:"sc 50kg",obs:"Contrapiso regularizado"},
    {g:"🪵 Cimento & Argamassa",k:"Areia média — total estimado",v:+((A*0.30+Aalv*0.015+Apin*0.035+Acont*IDX.contrapiso_m2.areia_m3)*P).toFixed(1),un:"m³",obs:"Somatório de todas as etapas"},
    {g:"🪵 Cimento & Argamassa",k:"Brita nº1 — total estimado",v:+((A*IDX.estrutura_m2.concreto_fund_m3*IDX.concreto_15mpa.brita1_m3+Acont*IDX.contrapiso_m2.brita1_m3)*P).toFixed(1),un:"m³",obs:"Estrutura + contrapiso"},
    // revestimentos
    {g:"⬜ Revestimentos & Pisos",k:"Porcelanato retificado",v:+(tot.porcelanato*IDX.piso_m2.piso_fator).toFixed(1),un:"m²",obs:"Sala, quartos, circulação +10%"},
    {g:"⬜ Revestimentos & Pisos",k:"Cerâmica piso PEI≥4",v:+(tot.ceramicaPiso*IDX.piso_m2.piso_fator).toFixed(1),un:"m²",obs:"Banheiro, garagem, serviço +10%"},
    {g:"⬜ Revestimentos & Pisos",k:"Azulejo / Cerâmica parede",v:+(Apar*P).toFixed(1),un:"m²",obs:"Paredes molhadas +10%"},
    {g:"⬜ Revestimentos & Pisos",k:"Argamassa colante AC-II",v:+((Apar+tot.porcelanato+tot.ceramicaPiso)*6*P).toFixed(0),un:"kg",obs:"6 kg/m²"},
    {g:"⬜ Revestimentos & Pisos",k:"Rejunte cimentício",v:+((Apar+tot.porcelanato+tot.ceramicaPiso)*0.6).toFixed(0),un:"kg",obs:"0,6 kg/m²"},
    {g:"⬜ Revestimentos & Pisos",k:"Rodapé cerâmico 7,5cm",v:+(tot.rodape*1.05).toFixed(0),un:"m",obs:"+5% corte"},
    // pintura
    {g:"🎨 Pinturas",k:"Massa corrida interna",v:+(Apin*IDX.massa_m2.massa_corrida_kg).toFixed(0),un:"kg",obs:"0,58 kg/m²"},
    {g:"🎨 Pinturas",k:"Selador acrílico opaco",v:+(Apin*0.10).toFixed(0),un:"L",obs:"0,10 L/m²"},
    {g:"🎨 Pinturas",k:"Tinta látex acrílica interna",v:+(Apin*0.18).toFixed(0),un:"L",obs:"0,18 L/m² — 2 demãos"},
    {g:"🎨 Pinturas",k:"Lixa d'água grão 100",v:+(Apin*IDX.massa_m2.lixa_un).toFixed(0),un:"un",obs:"0,50 un/m²"},
  ];
}

// ─── CALC DIMENSIONAL ─────────────────────────────────────────────────────────
function calcDim(amb){
  const c=Number(amb.c)||0,l=Number(amb.l)||0,pd=Number(amb.pd)||2.8;
  const t=TIPOS[amb.tipo]||TIPOS.quarto;
  const piso=c*l,perim=2*(c+l);
  const azulejo=t.molhada?perim*t.altAz:0;
  return{piso,forro:piso,perim,rodape:t.rodape?perim:0,areaPar:perim*pd,azulejo,pintura:perim*pd-azulejo+piso,areaEq:piso*t.coefEq};
}
function totalizar(ambs){
  return ambs.filter(a=>a.ativo).reduce((acc,a)=>{
    const d=calcDim(a),t=TIPOS[a.tipo]||TIPOS.quarto;
    acc.piso+=d.piso;acc.forro+=d.forro;acc.perim+=d.perim;acc.rodape+=d.rodape;acc.azulejo+=d.azulejo;acc.pintura+=d.pintura;acc.areaReal+=d.piso;acc.areaEq+=d.areaEq;
    if(t.piso==="porcelanato")acc.porcelanato+=d.piso;else acc.ceramicaPiso+=d.piso;
    return acc;
  },{piso:0,forro:0,perim:0,rodape:0,azulejo:0,pintura:0,areaReal:0,areaEq:0,porcelanato:0,ceramicaPiso:0});
}

// ─── VALIDAÇÕES ───────────────────────────────────────────────────────────────
function gerarAlertas(tot,estr,modoCalc){
  const alertas=[];
  if(tot.areaReal<LIMITES.cub_min_m2) alertas.push({nivel:"erro",msg:`Área real (${fN(tot.areaReal,1)} m²) muito pequena. CUB perde precisão abaixo de 40 m².`});
  if(tot.areaReal>LIMITES.cub_max_m2) alertas.push({nivel:"aviso",msg:`Área real (${fN(tot.areaReal,1)} m²) acima de 500 m². Considere consultar orçamentista para esta escala.`});
  const pdVals=[];
  if(tot.piso>0&&tot.forro>0){
    // checa pé direito médio implícito
  }
  if(modoCalc==="cub"&&tot.areaReal>0){
    alertas.push({nivel:"info",msg:"Modo CUB ativo: os quantitativos de materiais são GUIA DE COMPRAS. O custo da obra vem exclusivamente do CUB — não há dupla contagem."});
  }
  if(modoCalc==="detalhado"){
    alertas.push({nivel:"aviso",msg:"Modo Detalhado: o custo é calculado pelos índices unitários. NÃO use o CUB simultaneamente para não duplicar o valor."});
    alertas.push({nivel:"info",msg:"Índices médios de mercado (SINAPI/TCPO). Variação real de ±20% dependendo de região, fornecedor e padrão de execução."});
  }
  if(estr.alvenaria>0&&tot.areaReal>0&&estr.alvenaria/tot.areaReal>4) alertas.push({nivel:"aviso",msg:`Alvenaria (${fN(estr.alvenaria,0)} m²) parece alta para ${fN(tot.areaReal,0)} m² de área. Verifique o valor.`});
  return alertas;
}

// ─── PDF ──────────────────────────────────────────────────────────────────────
function gerarPDF({obraName,uf,padrao,ambs,estr,tot,itensLivres,bdi,modoBdi,modoCalc,custoCUB,custoTotal,prVenda,bdiPct,cotacoes,guia}){
  const nomP=padrao==="b"?"Padrão Baixo (R1-B)":padrao==="m"?"Padrão Normal (R1-N)":"Padrão Alto (R1-A)";
  const data=new Date().toLocaleDateString("pt-BR");
  const totalLivres=itensLivres.reduce((s,i)=>s+(Number(i.val)||0),0);
  const html=`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"/><title>Orçamento — ${obraName||"Obra"}</title>
<style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;font-size:11px;color:#1a1a1a;padding:24px}
h1{font-size:20px;margin-bottom:4px}h2{font-size:13px;margin:18px 0 6px;border-bottom:2px solid #d4a843;padding-bottom:4px}
.header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:16px;padding-bottom:12px;border-bottom:3px solid #d4a843}
.meta{font-size:10px;color:#666;line-height:1.8}
.hero{background:#f9f4e8;border:2px solid #d4a843;border-radius:8px;padding:16px;margin-bottom:14px;display:flex;justify-content:space-between;align-items:center}
.hero-val{font-size:26px;font-weight:700;color:#b8891f}.hero-sub{font-size:10px;color:#888;margin-top:2px}
.modo-badge{display:inline-block;padding:3px 10px;border-radius:12px;font-size:9px;font-weight:700;margin-top:6px}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:8px;font-size:10px}
.grid2 div{background:#fff;border:1px solid #e5d7a0;border-radius:6px;padding:6px 10px}
.grid2 b{color:#b8891f;display:block;font-size:13px}
table{width:100%;border-collapse:collapse;margin-bottom:10px}
th{background:#1a2535;color:#d4a843;font-size:9px;text-transform:uppercase;letter-spacing:1px;padding:6px 8px;text-align:left}
th.r{text-align:right}td{padding:5px 8px;border-bottom:1px solid #eee;font-size:10px}td.r{text-align:right;font-weight:600}
tr:nth-child(even){background:#f9f9f9}.cat-h{background:#f0f0f0;font-weight:700;font-size:10px;padding:5px 8px}
.total-row{background:#1a2535!important}.total-row td{color:#d4a843;border:none;font-size:11px}
.alerta-box{background:#fffbeb;border:1px solid #f59e0b;border-radius:6px;padding:10px 12px;margin:14px 0;font-size:10px;color:#92400e;line-height:1.6}
.aviso-dupla{background:#fee2e2;border:1px solid #ef4444;border-radius:6px;padding:10px 12px;margin:10px 0;font-size:10px;color:#991b1b;font-weight:700}
.footer{margin-top:20px;padding-top:10px;border-top:1px solid #ddd;font-size:9px;color:#888;display:flex;justify-content:space-between}
@media print{body{padding:12px}}</style></head><body>
<div class="header"><div>
  <h1>${obraName||"Estimativa de Obra"}</h1>
  <div class="meta">Estado: <b>${CUB[uf]?.n||uf}</b> · ${nomP} · Área Real: <b>${fN(tot.areaReal,1)} m²</b> · Área Equiv.: <b>${fN(tot.areaEq,1)} m²</b><br/>
  Modo de Cálculo: <b>${modoCalc==="cub"?"CUB (Estimativa Rápida)":"Detalhado (Índices Unitários)"}</b> · BDI: <b>${modoBdi==="proprio"?"Obra Própria (0%)":"Prestação de Serviço ("+fN(bdiPct*100,2)+"%)"}</b><br/>
  Gerado em: <b>${data}</b></div>
</div>
${modoCalc==="cub"?`<div class="aviso-dupla">⚠️ ATENÇÃO: Os quantitativos de materiais neste documento são GUIA DE COMPRAS baseado em índices paramétricos. O CUSTO DA OBRA é calculado exclusivamente pelo CUB (NBR 12721). Não somar os dois valores — isso geraria dupla contagem.</div>`:""}
<div class="hero"><div>
  <div style="font-size:10px;color:#888;margin-bottom:4px">${modoCalc==="cub"?"CUSTO CUB (NBR 12721)":"CUSTO DETALHADO (Índices Unitários)"} + Itens por Projeto</div>
  <div class="hero-val">${fR(custoTotal)}</div>
  <div class="hero-sub">${modoCalc==="cub"?fD(CUB[uf]?.[padrao]||0)+"/m² × "+fN(tot.areaEq,1)+" m² equiv.":"Somatório de composições unitárias"} + ${fR(totalLivres)}</div>
</div><div class="grid2">
  <div><b>${fR(custoTotal*0.85)}</b>Otimista (−15%)</div>
  <div><b>${fR(custoTotal*1.20)}</b>Conservador (+20%)</div>
  ${modoBdi==="venda"?`<div><b>${fR(prVenda)}</b>Preço de Venda</div><div><b>${fN(bdiPct*100,2)}%</b>BDI</div>`:""}
</div></div>
<h2>1. Ambientes e Levantamento Dimensional</h2>
<table><thead><tr><th>Ambiente</th><th>C × L × PD</th><th class="r">Piso m²</th><th class="r">Rodapé m</th><th class="r">Azulejo m²</th><th class="r">Pintura m²</th><th class="r">Área Eq.</th></tr></thead><tbody>
${ambs.filter(a=>a.ativo).map(amb=>{const d=calcDim(amb),t=TIPOS[amb.tipo]||TIPOS.quarto;return`<tr><td>${t.ic} ${amb.lb}</td><td style="color:#666">${amb.c}×${amb.l}×${amb.pd}m</td><td class="r">${fN(d.piso,2)}</td><td class="r">${d.rodape>0?fN(d.rodape,2)+"m":"—"}</td><td class="r">${d.azulejo>0?fN(d.azulejo,2):"—"}</td><td class="r">${fN(d.pintura,2)}</td><td class="r">${fN(d.areaEq,2)}</td></tr>`;}).join("")}
<tr class="total-row"><td colspan="2"><b>TOTAL</b></td><td class="r"><b>${fN(tot.piso,1)}</b></td><td class="r"><b>${fN(tot.rodape,1)}m</b></td><td class="r"><b>${fN(tot.azulejo,1)}</b></td><td class="r"><b>${fN(tot.pintura,1)}</b></td><td class="r"><b>${fN(tot.areaEq,1)}</b></td></tr>
</tbody></table>
${modoCalc==="cub"?`
<h2>2. Breakdown do CUB por Etapa (informativo)</h2>
<table><thead><tr><th>Etapa</th><th class="r">% CUB</th><th class="r">Valor (R$)</th></tr></thead><tbody>
${CUB_PARTICIPACAO.map(e=>`<tr><td>${e.ic} ${e.lb}</td><td class="r">${(e.pct*100).toFixed(1)}%</td><td class="r"><b>${fR(custoCUB*e.pct)}</b></td></tr>`).join("")}
<tr class="total-row"><td colspan="2"><b>CUSTO CUB TOTAL</b></td><td class="r"><b>${fR(custoCUB)}</b></td></tr>
</tbody></table>
<h2>3. Guia de Compras de Materiais (referência — NÃO é o custo da obra)</h2>
<p style="font-size:9px;color:#666;margin-bottom:8px">Quantitativos estimados por índices paramétricos. Use como referência inicial de compras. Confirme com orçamentista antes de fechar contratos.</p>
<table><thead><tr><th>Material</th><th class="r">Quantidade</th><th>Unidade</th><th>Observação</th></tr></thead><tbody>
${(()=>{let rows="",lastG="";guia.forEach(i=>{if(i.g!==lastG){rows+=`<tr><td colspan="4" class="cat-h">${i.g}</td></tr>`;lastG=i.g;}rows+=`<tr><td>${i.k}</td><td class="r"><b>${fN(i.v,i.v<5?1:0)}</b></td><td>${i.un}</td><td style="font-size:9px;color:#666">${i.obs}</td></tr>`;});return rows;})()}
</tbody></table>`:`
<h2>2. Custo Detalhado por Composição Unitária</h2>
<p style="font-size:9px;color:#888;margin-bottom:8px">⚠️ Este custo JÁ inclui materiais calculados pelos índices. NÃO somar ao CUB.</p>`}
<h2>${modoCalc==="cub"?"4":"3"}. Itens por Projeto / Cotação Específica</h2>
<table><thead><tr><th>Item</th><th class="r">Qtd.</th><th>Un.</th><th class="r">Valor (R$)</th></tr></thead><tbody>
${Object.entries(CAT_LIVRE_INFO).map(([cat,ci])=>{const its=itensLivres.filter(i=>i.cat===cat);if(!its.length)return"";return`<tr><td colspan="4" class="cat-h">${ci.lb}</td></tr>`+its.map(i=>`<tr><td>${i.ic} ${i.lb}${i.tipo==="proj"?` <span style="background:#fee2e2;color:#991b1b;font-size:8px;padding:1px 4px;border-radius:3px">PROJETO</span>`:""}</td><td class="r">${i.qtd||"—"}</td><td>${i.un}</td><td class="r" style="color:${i.val>0?"#1a7a3a":"#aaa"}">${i.val>0?fR(Number(i.val)):"—"}</td></tr>`).join("");}).join("")}
<tr class="total-row"><td colspan="3"><b>TOTAL</b></td><td class="r"><b>${fR(totalLivres)}</b></td></tr>
</tbody></table>
<div class="alerta-box">⚠️ <b>Estimativa Paramétrica — Limitações:</b> Este documento é uma estimativa baseada no CUB (NBR 12721 · Sinduscon Mar/2026) e em índices de composição unitária (SINAPI · TCPO 13ª ed.). Não substitui orçamento discriminado elaborado por engenheiro habilitado com projeto executivo. Instalações elétricas e hidráulicas dependem de projetos específicos. Valores de CUB não incluem: terreno, sondagem especial, elevadores, ar-condicionado, projetos, taxas e remuneração do incorporador.</div>
<div class="footer"><span>Desenvolvido por <b>Rafael Rodrigues</b> · Eng. Civil · Especialista em Gerenciamento de Obras · CUB NBR 12721 · SINAPI · TCPO 13ª ed.</span><span>Gerado em ${data}</span></div>
</body></html>`;
  const blob=new Blob([html],{type:"text/html;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const win=window.open(url,"_blank");
  if(win)setTimeout(()=>win.print(),800);
}

// ─── UI HELPERS ───────────────────────────────────────────────────────────────
const Div=({label})=>(<div style={{display:"flex",alignItems:"center",gap:10,margin:"18px 0 10px"}}><div style={{flex:1,height:1,background:C.bd}}/>{label&&<span style={{fontSize:9,letterSpacing:3,color:C.t3,textTransform:"uppercase",whiteSpace:"nowrap"}}>{label}</span>}<div style={{flex:1,height:1,background:C.bd}}/></div>);
const Chip=({c,v,small})=>(<span style={{fontSize:small?8:9,fontWeight:700,color:c,background:c+"18",border:`1px solid ${c}30`,borderRadius:4,padding:"2px 6px"}}>{v}</span>);
const Card=({label,value,sub,cor=C.gold})=>(<div style={{background:C.s2,border:`1px solid ${cor}25`,borderRadius:10,padding:"9px 11px",textAlign:"center"}}><div style={{fontSize:9,color:C.t3,marginBottom:2}}>{label}</div><div style={{fontSize:14,fontWeight:700,color:cor}}>{value}</div>{sub&&<div style={{fontSize:9,color:C.t3,marginTop:1}}>{sub}</div>}</div>);
const InN=({value,onChange,step=0.1,w=60,cor=C.gold,suffix})=>(<div style={{display:"flex",alignItems:"center",gap:3}}><input type="number" value={value} min={0} step={step} onChange={e=>onChange(Number(e.target.value)||0)} style={{width:w,padding:"5px 6px",borderRadius:7,border:`1.5px solid ${cor}40`,background:C.bg,color:cor,fontSize:13,fontWeight:700,textAlign:"center",outline:"none"}}/>{suffix&&<span style={{fontSize:10,color:C.t3}}>{suffix}</span>}</div>);
const BtnP=({onClick,label,cor=C.gold,flex})=>(<button onClick={onClick} style={{flex,padding:"12px 20px",borderRadius:10,border:"none",background:cor,color:"#05080e",cursor:"pointer",fontSize:13,fontWeight:700,boxShadow:`0 4px 16px ${cor}40`}}>{label}</button>);
const BtnS=({onClick,label})=>(<button onClick={onClick} style={{padding:"12px 16px",borderRadius:10,border:`1px solid ${C.bd2}`,background:"transparent",color:C.t3,cursor:"pointer",fontSize:12}}>{label}</button>);

const Alerta=({nivel,msg})=>{
  const cols={erro:{bg:"#fee2e2",bd:"#ef4444",tx:"#991b1b",ic:"❌"},aviso:{bg:"#fffbeb",bd:"#f59e0b",tx:"#92400e",ic:"⚠️"},info:{bg:"#eff6ff",bd:"#3b82f6",tx:"#1e40af",ic:"ℹ️"}};
  const s=cols[nivel]||cols.info;
  return(<div style={{background:s.bg,border:`1px solid ${s.bd}`,borderRadius:8,padding:"8px 12px",marginBottom:6,fontSize:11,color:s.tx,lineHeight:1.5}}>
    {s.ic} {msg}
  </div>);
};

// ─── APP ──────────────────────────────────────────────────────────────────────
export default function App(){
  const TABS=["Obras","Modo & Estado","Ambientes","Materiais & Guia","Itens por Projeto","BDI & Resultado","⚙️ Atualizar CUB"];
  const [tab,setTab]=useState(1);
  const [anim,setAnim]=useState(true);

  const [modoCalc,setModoCalc]=useState("cub");

  // CUB customizado — sobrescreve CUB_BASE com valores atualizados pelo usuário (persistido no storage)
  const [cubCustom,setCubCustom]=useState({});
  const [cubEditSig,setCubEditSig]=useState(null);
  const [cubEditVals,setCubEditVals]=useState({b:"",m:"",a:"",ref:""});
  const CUB=Object.fromEntries(Object.entries(CUB_BASE).map(([k,v])=>[k,{...v,...(cubCustom[k]||{})}]));

  const [uf,setUf]=useState("PR");
  const [padrao,setPadrao]=useState("m");
  const [obraName,setObraName]=useState("");
  const [busca,setBusca]=useState("");
  const [ambs,setAmbs]=useState(AMB_DEF.map(a=>({...a})));
  const [pdGlobal,setPdGlobal]=useState(2.80);
  const [expandAmb,setExpandAmb]=useState(null);
  const [novoTipo,setNovoTipo]=useState("quarto");
  const [novoLb,setNovoLb]=useState("");

  // estrutura — agora derivada automaticamente + ajustável
  const [estrManual,setEstrManual]=useState(false); // false = auto | true = manual
  const [estrAdj,setEstrAdj]=useState({});           // ajustes sobre o valor automático

  const [expandCat,setExpandCat]=useState(null);
  const [expandCatLivre,setExpandCatLivre]=useState(null);
  const [itensLivres,setItensLivres]=useState(ITENS_LIVRES_DEF.map(i=>({...i})));
  const [bdi,setBdi]=useState({io:0,ic:0,fin:0,imp:0,luc:0,iss:0,pis:0,cof:0,rep:0});
  const [modoBdi,setModoBdi]=useState("proprio");
  const [cotacoes,setCotacoes]=useState({});

  // storage
  const [obrasSalvas,setObrasSalvas]=useState([]);
  const [storageMsg,setStorageMsg]=useState("");
  const [loadingStorage,setLoadingStorage]=useState(true);

  useEffect(()=>{
    (async()=>{
      try{
        // carrega obras salvas
        const res=await storage.list("obra:");
        if(res?.keys){const obras=await Promise.all(res.keys.map(async k=>{try{const r=await storage.get(k);return r?{key:k,...JSON.parse(r.value)}:null;}catch{return null;}}));setObrasSalvas(obras.filter(Boolean).sort((a,b)=>b.savedAt-a.savedAt));}
        // carrega CUB customizado salvo
        try{const rc=await storage.get("cub_custom");if(rc?.value)setCubCustom(JSON.parse(rc.value));}catch{}
      }catch(e){}finally{setLoadingStorage(false);}
    })();
  },[]);

  const showMsg=m=>{setStorageMsg(m);setTimeout(()=>setStorageMsg(""),3000);};

  // ── cálculos base ─────────────────────────────────────────────────────────
  const cubM2=CUB[uf][padrao];
  const corP=padrao==="b"?C.grn:padrao==="m"?C.blu:C.gold;
  const nomP=padrao==="b"?"Padrão Baixo R1-B":padrao==="m"?"Padrão Normal R1-N":"Padrão Alto R1-A";
  const tot=totalizar(ambs);

  // estrutura parametrizada automática
  const estrAuto=calcEstrutura(tot.areaReal);
  const estr=Object.fromEntries(
    Object.entries(estrAuto).map(([k,v])=>[k, estrManual&&estrAdj[k]!==undefined ? estrAdj[k] : v])
  );

  const alertas=gerarAlertas(tot,estr,modoCalc);
  const guia=calcGuiaCompras(tot,estr);

  const custoCUB=tot.areaEq*cubM2;
  const totalLivres=itensLivres.reduce((s,i)=>s+(Number(i.val)||0),0);

  // ── PONTO CRÍTICO CORRIGIDO: no modo CUB, custo = CUB + itens projeto ────
  // No modo Detalhado, custo = cotações somadas + itens projeto
  const totalCotacoes=guia.reduce((s,i)=>{const p=Number(cotacoes[i.k])||0;return s+(p>0?i.v*p:0);},0);
  const custoBase = modoCalc==="cub" ? custoCUB : totalCotacoes;
  const custoTotal=custoBase+totalLivres;

  const bdiPct=modoBdi==="proprio"?0:((1+(bdi.io+bdi.ic+bdi.fin+bdi.imp+bdi.luc)/100)/(1-(bdi.iss+bdi.pis+bdi.cof+bdi.rep)/100))-1;
  const prVenda=custoTotal*(1+bdiPct);

  const gruposLivres={};
  itensLivres.forEach(i=>{if(!gruposLivres[i.cat])gruposLivres[i.cat]=[];gruposLivres[i.cat].push(i);});

  const nav=n=>{setAnim(false);setTimeout(()=>{setTab(n);setAnim(true);},180);};
  const ufsFilt=Object.keys(CUB).filter(k=>CUB[k].n.toLowerCase().includes(busca.toLowerCase())||k.includes(busca.toUpperCase()));
  const updIL=(id,field,val)=>setItensLivres(p=>p.map(i=>i.id===id?{...i,[field]:val}:i));

  const salvarObra=async()=>{
    if(!obraName.trim()){showMsg("⚠️ Dê um nome à obra antes de salvar.");return;}
    const key="obra:"+Date.now();
    const payload={nome:obraName,uf,padrao,modoCalc,ambs,pdGlobal,estrManual,estrAdj,itensLivres,bdi,modoBdi,cotacoes,savedAt:Date.now()};
    try{await storage.set(key,JSON.stringify(payload));setObrasSalvas(p=>[{key,...payload},...p.filter(o=>o.nome!==obraName)].sort((a,b)=>b.savedAt-a.savedAt));showMsg("✅ Obra \""+obraName+"\" salva!");}
    catch(e){showMsg("❌ Erro ao salvar.");}
  };
  const carregarObra=o=>{
    setObraName(o.nome||"");setUf(o.uf||"PR");setPadrao(o.padrao||"m");setModoCalc(o.modoCalc||"cub");
    setAmbs(o.ambs||AMB_DEF.map(a=>({...a})));setPdGlobal(o.pdGlobal||2.80);
    setEstrManual(o.estrManual||false);setEstrAdj(o.estrAdj||{});
    setItensLivres(o.itensLivres||ITENS_LIVRES_DEF.map(i=>({...i})));
    setBdi(o.bdi||{io:0,ic:0,fin:0,imp:0,luc:0,iss:0,pis:0,cof:0,rep:0});
    setModoBdi(o.modoBdi||"proprio");setCotacoes(o.cotacoes||{});
    nav(1);showMsg("📂 Obra \""+o.nome+"\" carregada!");
  };
  const excluirObra=async(key,nome)=>{
    try{await storage.delete(key);setObrasSalvas(p=>p.filter(o=>o.key!==key));showMsg("🗑️ \""+nome+"\" excluída.");}
    catch(e){showMsg("❌ Erro ao excluir.");}
  };
  const novaObra=()=>{
    setObraName("");setUf("PR");setPadrao("m");setModoCalc("cub");
    setAmbs(AMB_DEF.map(a=>({...a})));setPdGlobal(2.80);setEstrManual(false);setEstrAdj({});
    setItensLivres(ITENS_LIVRES_DEF.map(i=>({...i})));setBdi({io:0,ic:0,fin:0,imp:0,luc:0,iss:0,pis:0,cof:0,rep:0});
    setModoBdi("proprio");setCotacoes({});nav(1);
  };

  // ── banner de modo ─────────────────────────────────────────────────────────
  const ModoBanner=()=>(
    <div style={{background:modoCalc==="cub"?C.blu+"18":C.org+"18",border:`1px solid ${modoCalc==="cub"?C.blu:C.org}50`,borderRadius:9,padding:"7px 13px",display:"flex",alignItems:"center",gap:10,marginBottom:10,fontSize:11}}>
      <span style={{fontSize:16}}>{modoCalc==="cub"?"📊":"🔬"}</span>
      <div style={{flex:1,color:modoCalc==="cub"?C.blu:C.org,fontWeight:700}}>
        {modoCalc==="cub"?"Modo CUB — Estimativa Rápida (NBR 12721)":"Modo Detalhado — Índices Unitários (SINAPI/TCPO)"}
      </div>
      <button onClick={()=>nav(1)} style={{fontSize:9,padding:"3px 8px",borderRadius:6,border:`1px solid ${modoCalc==="cub"?C.blu:C.org}`,background:"transparent",color:modoCalc==="cub"?C.blu:C.org,cursor:"pointer"}}>Alterar</button>
    </div>
  );

  return(
    <div style={{minHeight:"100vh",background:C.bg,color:C.t1,fontFamily:"'Palatino Linotype','Georgia',serif",paddingBottom:80}}>

      {/* HEADER */}
      <div style={{background:`linear-gradient(180deg,${C.s1} 0%,${C.bg} 100%)`,borderBottom:`1px solid ${C.bd}`,padding:"15px 13px 0"}}>
        <div style={{maxWidth:780,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6,gap:8,flexWrap:"wrap"}}>
            <div>
              <div style={{fontSize:8,letterSpacing:3,color:C.t3,textTransform:"uppercase",marginBottom:2}}>
                {DEV.nome} · {DEV.titulo} · {DEV.espec}
              </div>
              <h1 style={{margin:0,fontSize:"clamp(14px,2.8vw,22px)",fontWeight:700,letterSpacing:-0.5,background:`linear-gradient(90deg,${C.t1},${C.gold})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
                Estimador de Obra
              </h1>
              <div style={{display:"flex",alignItems:"center",gap:7,marginTop:2}}>
                <Chip c={modoCalc==="cub"?C.blu:C.org} v={modoCalc==="cub"?"📊 Modo CUB":"🔬 Modo Detalhado"}/>
                <span style={{fontSize:10,color:C.t3}}>{obraName||"[Nova Obra]"} · {CUB[uf].n}</span>
              </div>
            </div>
            <div style={{display:"flex",gap:7,alignItems:"center",flexWrap:"wrap"}}>
              <button onClick={salvarObra} style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.gold}`,background:C.gold+"20",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:700}}>💾 Salvar</button>
              <button onClick={()=>gerarPDF({obraName,uf,padrao,ambs,estr,tot,itensLivres,bdi,modoBdi,modoCalc,custoCUB,custoTotal,prVenda,bdiPct,cotacoes,guia})}
                style={{padding:"7px 12px",borderRadius:8,border:`1px solid ${C.red}`,background:C.red+"20",color:C.red,cursor:"pointer",fontSize:11,fontWeight:700}}>📄 PDF</button>
              <div style={{textAlign:"right"}}>
                <div style={{fontSize:9,color:C.t3}}>{modoCalc==="cub"?"Custo CUB":"Custo Detalhado"}</div>
                <div style={{fontSize:15,fontWeight:700,color:C.gold,lineHeight:1}}>{fR(custoTotal)}</div>
              </div>
            </div>
          </div>
          {storageMsg&&(<div style={{background:C.s2,border:`1px solid ${C.gold}50`,borderRadius:8,padding:"5px 12px",marginBottom:5,fontSize:11,color:C.gold,textAlign:"center"}}>{storageMsg}</div>)}
          <div style={{display:"flex",gap:1,overflowX:"auto"}}>
            {TABS.map((t,i)=>(
              <button key={i} onClick={()=>nav(i)} style={{padding:"6px 10px",fontSize:10,fontWeight:tab===i?700:400,cursor:"pointer",border:"none",borderRadius:"7px 7px 0 0",whiteSpace:"nowrap",background:tab===i?C.s2:"transparent",color:tab===i?C.gold:C.t3,borderBottom:tab===i?`2px solid ${C.gold}`:`2px solid transparent`,transition:"all 0.15s"}}>
                {i===0?"💾 ":""}<span style={{opacity:.4,marginRight:2}}>{i+1}.</span>{t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:780,margin:"0 auto",padding:"14px 12px",opacity:anim?1:0,transform:anim?"translateY(0)":"translateY(8px)",transition:"all 0.18s"}}>

        {/* ═══ TAB 0: OBRAS SALVAS ══════════════════════════════════════ */}
        {tab===0&&(<>
          <Div label="Obras Salvas"/>
          <div style={{display:"flex",gap:8,marginBottom:14}}>
            <button onClick={novaObra} style={{padding:"10px 18px",borderRadius:9,border:"none",background:C.gold,color:"#05080e",cursor:"pointer",fontSize:12,fontWeight:700,boxShadow:`0 3px 14px ${C.gold}40`}}>+ Nova Estimativa</button>
            <div style={{fontSize:11,color:C.t3,alignSelf:"center"}}>{obrasSalvas.length} obra{obrasSalvas.length!==1?"s":""} salva{obrasSalvas.length!==1?"s":""}</div>
          </div>
          {loadingStorage?(<div style={{textAlign:"center",padding:"40px",color:C.t3,fontSize:12}}>Carregando...</div>):obrasSalvas.length===0?(
            <div style={{background:C.s2,border:`1px dashed ${C.bd2}`,borderRadius:12,padding:"40px",textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>📂</div>
              <div style={{fontSize:13,color:C.t2,marginBottom:6}}>Nenhuma obra salva ainda</div>
              <div style={{fontSize:11,color:C.t3}}>Preencha e clique <b style={{color:C.gold}}>💾 Salvar</b> para guardar aqui.</div>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {obrasSalvas.map(o=>(
                <div key={o.key} style={{background:C.s2,border:`1px solid ${C.bd}`,borderRadius:12,padding:"13px 15px",display:"flex",alignItems:"center",gap:12}}>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:3}}>
                      <span style={{fontSize:13,fontWeight:700,color:C.t1}}>{o.nome||"Sem nome"}</span>
                      <Chip c={o.modoCalc==="cub"?C.blu:C.org} v={o.modoCalc==="cub"?"CUB":"Detalhado"} small/>
                    </div>
                    <div style={{fontSize:10,color:C.t3}}>{CUB[o.uf]?.n||o.uf} · {o.padrao==="b"?"Baixo":o.padrao==="m"?"Normal":"Alto"} · {fN(totalizar(o.ambs||[]).areaReal,0)} m² · {new Date(o.savedAt).toLocaleDateString("pt-BR")}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>carregarObra(o)} style={{padding:"7px 14px",borderRadius:8,border:`1px solid ${C.gold}`,background:C.gold+"20",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:700}}>📂 Abrir</button>
                    <button onClick={()=>excluirObra(o.key,o.nome)} style={{padding:"7px 10px",borderRadius:8,border:`1px solid ${C.red}40`,background:"transparent",color:C.red,cursor:"pointer",fontSize:11}}>🗑️</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>)}

        {/* ═══ TAB 1: MODO & ESTADO ═════════════════════════════════════ */}
        {tab===1&&(<>
          {/* SELETOR DE MODO — PRINCIPAL */}
          <Div label="Modo de Cálculo — Escolha antes de tudo"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:20}}>
            {[
              {k:"cub",ic:"📊",titulo:"Modo CUB",sub:"Estimativa Rápida",cor:C.blu,
                pontos:["✅ Custo calculado pelo CUB (NBR 12721)","✅ Resultado em 3 passos","✅ Ideal para estudo preliminar e proposta comercial","✅ Materiais = Guia de compras (sem dupla contagem)","⚠️ Precisão: ±15% a ±25%"],
                limit:"Não usar para orçamento executivo ou obra pública."},
              {k:"detalhado",ic:"🔬",titulo:"Modo Detalhado",sub:"Índices Unitários",cor:C.org,
                pontos:["✅ Custo calculado por índices SINAPI/TCPO","✅ Você coteja preço local de cada material","✅ Mais granular — vê custo por etapa","⚠️ Precisão: ±20% (índices médios de mercado)","❌ NÃO usar CUB ao mesmo tempo (dupla contagem)"],
                limit:"Requer cotação local. Não substitui projeto executivo."},
            ].map(({k,ic,titulo,sub,cor,pontos,limit})=>{
              const ativo=modoCalc===k;
              return(
                <button key={k} onClick={()=>setModoCalc(k)} style={{padding:"16px 14px",borderRadius:14,cursor:"pointer",textAlign:"left",border:`2px solid ${ativo?cor:C.bd}`,background:ativo?cor+"18":C.s2,transition:"all 0.15s"}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <span style={{fontSize:24}}>{ic}</span>
                    <div>
                      <div style={{fontSize:14,fontWeight:700,color:ativo?cor:C.t1}}>{titulo}</div>
                      <Chip c={cor} v={sub} small/>
                    </div>
                  </div>
                  <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:8}}>
                    {pontos.map((p,i)=>(<div key={i} style={{fontSize:10,color:ativo?C.t2:C.t3,lineHeight:1.4}}>{p}</div>))}
                  </div>
                  <div style={{background:ativo?cor+"20":"#1c2e47",borderRadius:6,padding:"5px 8px",fontSize:9,color:ativo?cor:C.t3}}>🚫 {limit}</div>
                </button>
              );
            })}
          </div>

          {/* aviso dupla contagem */}
          {modoCalc==="cub"&&(
            <div style={{background:"#0f2e47",border:`1px solid ${C.blu}50`,borderRadius:10,padding:"11px 13px",marginBottom:16,fontSize:11,color:C.blu,lineHeight:1.6}}>
              📊 <b>Como funciona o Modo CUB:</b><br/>
              O <b>custo da obra</b> = CUB × Área Equivalente (NBR 12721).<br/>
              Os <b>quantitativos de materiais</b> (tijolos, cimento, etc.) são <b>GUIA DE COMPRAS</b> — servem para saber o que comprar, mas <b>não são somados ao custo</b>.<br/>
              Isso evita dupla contagem, pois o CUB já inclui todos esses itens.
            </div>
          )}
          {modoCalc==="detalhado"&&(
            <div style={{background:"#2e1a0a",border:`1px solid ${C.org}50`,borderRadius:10,padding:"11px 13px",marginBottom:16,fontSize:11,color:C.org,lineHeight:1.6}}>
              🔬 <b>Como funciona o Modo Detalhado:</b><br/>
              O <b>custo</b> é calculado somando: quantidade de material × preço unitário local que você informa.<br/>
              <b>Não use o valor do CUB neste modo</b> — os índices unitários já cobrem os mesmos itens.<br/>
              Variação típica: ±20% dependendo de região, fornecedor e padrão de execução.
            </div>
          )}

          <Div label="Estado da Obra"/>
          <input placeholder="🔍 Filtrar estado..." value={busca} onChange={e=>setBusca(e.target.value)} style={{width:"100%",padding:"7px 10px",borderRadius:8,border:`1px solid ${C.bd}`,background:C.s2,color:C.t1,fontSize:12,marginBottom:10,boxSizing:"border-box",outline:"none"}}/>
          {Object.entries(REGIOES).map(([reg,ufs])=>{
            const lista=ufs.filter(u=>ufsFilt.includes(u));if(!lista.length)return null;const rc=RCOR[reg];
            return(<div key={reg} style={{marginBottom:10}}>
              <div style={{fontSize:8,color:rc,letterSpacing:3,textTransform:"uppercase",marginBottom:5}}>{reg}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                {lista.map(u=>(<button key={u} onClick={()=>setUf(u)} style={{padding:"6px 9px",borderRadius:8,cursor:"pointer",border:uf===u?`2px solid ${rc}`:`1px solid ${C.bd}`,background:uf===u?rc+"18":C.s2,color:uf===u?rc:C.t2,fontSize:11,fontWeight:uf===u?700:400}}>
                  <b>{u}</b><span style={{fontSize:8,display:"block",opacity:.6,marginTop:1}}>{fR(CUB[u][padrao])}</span>
                </button>))}
              </div>
            </div>);
          })}

          <Div label="Padrão Construtivo — NBR 12721"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[{k:"b",l:"Baixo",s:"R1-B",c:C.grn,d:"Acabamento simples"},
              {k:"m",l:"Normal",s:"R1-N",c:C.blu,d:"Padrão de mercado"},
              {k:"a",l:"Alto",s:"R1-A",c:C.gold,d:"Materiais nobres"},
            ].map(({k,l,s,c,d})=>(
              <button key={k} onClick={()=>setPadrao(k)} style={{padding:"12px 8px",borderRadius:10,cursor:"pointer",textAlign:"center",border:`2px solid ${padrao===k?c:C.bd}`,background:padrao===k?c+"18":C.s2}}>
                <Chip c={c} v={s}/>
                <div style={{fontSize:12,fontWeight:700,color:padrao===k?c:C.t1,marginTop:7}}>{l}</div>
                <div style={{fontSize:17,fontWeight:700,color:padrao===k?c:C.t2,margin:"5px 0 4px"}}>{fR(CUB[uf][k])}<span style={{fontSize:8,color:C.t3}}>/m²</span></div>
                <div style={{fontSize:9,color:C.t3}}>{d}</div>
              </button>
            ))}
          </div>

          <div style={{background:C.s2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 13px",marginBottom:14,fontSize:11,color:C.t2,lineHeight:1.5}}>
            ℹ️ <b style={{color:C.t1}}>Não incluídos no CUB:</b> terreno, sondagem especial, fundações em solo ruim, elevadores, ar-condicionado central, aquecedores, piscinas, projetos técnicos, taxas/licenças e remuneração do incorporador.
          </div>

          <div style={{marginBottom:10}}>
            <input value={obraName} onChange={e=>setObraName(e.target.value)} placeholder="Nome da obra (obrigatório para salvar)"
              style={{width:"100%",padding:"8px 11px",borderRadius:8,border:`1px solid ${C.bd}`,background:C.s2,color:C.t1,fontSize:13,outline:"none",boxSizing:"border-box"}}/>
          </div>
          <BtnP onClick={()=>nav(2)} label="Definir Ambientes →" cor={C.gold}/>
        </>)}

        {/* ═══ TAB 2: AMBIENTES ════════════════════════════════════════ */}
        {tab===2&&(<>
          <ModoBanner/>

          {/* alertas de validação */}
          {alertas.filter(a=>a.nivel!=="info").map((a,i)=><Alerta key={i} {...a}/>)}

          <Div label="Pé Direito Global"/>
          <div style={{display:"flex",alignItems:"center",gap:10,background:C.s2,borderRadius:10,padding:"10px 13px",border:`1px solid ${C.bd}`,marginBottom:12}}>
            <span style={{fontSize:12,color:C.t2,flex:1}}>Aplicar a todos os ambientes:</span>
            <InN value={pdGlobal} onChange={setPdGlobal} step={0.05} w={60} cor={C.gold} suffix="m"/>
            <button onClick={()=>setAmbs(p=>p.map(a=>({...a,pd:pdGlobal})))} style={{padding:"5px 12px",borderRadius:7,border:`1px solid ${C.gold}`,background:C.gold+"20",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:700}}>Aplicar</button>
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:12}}>
            {ambs.map((amb,i)=>{
              const d=calcDim(amb),t=TIPOS[amb.tipo]||TIPOS.quarto,open=expandAmb===amb.id;
              const pdWarning=Number(amb.pd)<LIMITES.piso_min||Number(amb.pd)>LIMITES.piso_max;
              return(
                <div key={amb.id} style={{background:amb.ativo?C.s2:C.s1,border:`1px solid ${open?C.gold:pdWarning&&amb.ativo?C.warn:C.bd}`,borderRadius:10,overflow:"hidden",opacity:amb.ativo?1:0.5}}>
                  <div style={{display:"flex",alignItems:"center",gap:7,padding:"8px 11px"}}>
                    <button onClick={()=>setAmbs(p=>{const n=[...p];n[i]={...n[i],ativo:!n[i].ativo};return n;})} style={{width:28,height:15,borderRadius:8,border:"none",cursor:"pointer",flexShrink:0,background:amb.ativo?C.gold:C.bd,position:"relative"}}><div style={{position:"absolute",top:1.5,width:11,height:11,borderRadius:"50%",background:"#fff",left:amb.ativo?15:2}}/></button>
                    <span style={{fontSize:14,minWidth:18}}>{t.ic}</span>
                    <span style={{fontSize:12,flex:1,color:amb.ativo?C.t1:C.t3}}>{amb.lb}</span>
                    <div style={{display:"flex",alignItems:"center",gap:3}}>
                      <InN value={amb.c} onChange={v=>setAmbs(p=>{const n=[...p];n[i]={...n[i],c:v};return n;})} step={0.1} w={50} cor={C.cya}/>
                      <span style={{color:C.t3,fontSize:10}}>×</span>
                      <InN value={amb.l} onChange={v=>setAmbs(p=>{const n=[...p];n[i]={...n[i],l:v};return n;})} step={0.1} w={50} cor={C.cya}/>
                      <span style={{color:C.t3,fontSize:9,marginLeft:2}}>m</span>
                    </div>
                    <span style={{fontSize:12,fontWeight:700,color:C.gold,minWidth:46,textAlign:"right"}}>{fN(d.piso,1)}m²</span>
                    <button onClick={()=>setExpandAmb(open?null:amb.id)} style={{background:"none",border:"none",cursor:"pointer",color:C.t3,fontSize:11}}>{open?"▲":"▼"}</button>
                    <button onClick={()=>setAmbs(p=>p.filter((_,j)=>j!==i))} style={{background:"none",border:"none",cursor:"pointer",color:C.red,fontSize:12}}>✕</button>
                  </div>
                  {open&&(
                    <div style={{padding:"0 11px 11px",borderTop:`1px solid ${C.bd}`}}>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginTop:8}}>
                        {[["Comprimento","c","m",C.cya],["Largura","l","m",C.cya],["Pé Direito","pd","m",Number(amb.pd)<1.8||Number(amb.pd)>5?C.red:C.pur]].map(([lb,k,sf,cor])=>(
                          <div key={k}><div style={{fontSize:9,color:cor,marginBottom:4,letterSpacing:1}}>{lb.toUpperCase()}</div><InN value={amb[k]} onChange={v=>setAmbs(p=>{const n=[...p];n[i]={...n[i],[k]:v};return n;})} step={0.05} w={65} cor={cor} suffix={sf}/></div>
                        ))}
                        <div><div style={{fontSize:9,color:C.t3,marginBottom:4,letterSpacing:1}}>TIPO</div>
                          <select value={amb.tipo} onChange={e=>setAmbs(p=>{const n=[...p];n[i]={...n[i],tipo:e.target.value};return n;})} style={{width:"100%",padding:"5px 6px",borderRadius:7,border:`1px solid ${C.bd}`,background:C.s3,color:C.t1,fontSize:11,outline:"none"}}>
                            {Object.entries(TIPOS).map(([k,t])=><option key={k} value={k}>{t.ic} {t.lb}</option>)}
                          </select>
                        </div>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5,marginTop:8}}>
                        {[["Piso/Forro",`${fN(d.piso,2)} m²`,C.gold],["Perímetro",`${fN(d.perim,2)} m`,C.cya],["Rodapé",d.rodape>0?`${fN(d.rodape,2)} m`:"—",C.t2],["Azulejo parede",d.azulejo>0?`${fN(d.azulejo,2)} m²`:"—",C.org],["Pintura",`${fN(d.pintura,2)} m²`,C.grn],["Área Eq. NBR",`${fN(d.areaEq,2)} m²`,C.blu]].map(([lb,v,c])=>(<div key={lb} style={{background:C.s3,borderRadius:7,padding:"6px 8px"}}><div style={{fontSize:9,color:C.t3}}>{lb}</div><div style={{fontSize:12,fontWeight:700,color:c}}>{v}</div></div>))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* adicionar */}
          <div style={{background:C.s2,border:`1px dashed ${C.bd2}`,borderRadius:10,padding:"10px 12px",marginBottom:12}}>
            <div style={{fontSize:9,color:C.t3,letterSpacing:2,marginBottom:6}}>ADICIONAR AMBIENTE</div>
            <div style={{display:"flex",gap:7,flexWrap:"wrap",alignItems:"center"}}>
              <select value={novoTipo} onChange={e=>setNovoTipo(e.target.value)} style={{padding:"6px 8px",borderRadius:7,border:`1px solid ${C.bd}`,background:C.s3,color:C.t1,fontSize:11,outline:"none"}}>
                {Object.entries(TIPOS).map(([k,t])=><option key={k} value={k}>{t.ic} {t.lb}</option>)}
              </select>
              <input value={novoLb} onChange={e=>setNovoLb(e.target.value)} placeholder="Nome..." style={{flex:1,minWidth:100,padding:"6px 9px",borderRadius:7,border:`1px solid ${C.bd}`,background:C.s3,color:C.t1,fontSize:11,outline:"none"}}/>
              <button onClick={()=>{if(novoLb){setAmbs(p=>[...p,{id:"a"+Date.now(),tipo:novoTipo,lb:novoLb,c:3,l:3,pd:pdGlobal,ativo:true}]);setNovoLb("");}}} style={{padding:"6px 14px",borderRadius:7,border:`1px solid ${C.gold}`,background:C.gold+"20",color:C.gold,cursor:"pointer",fontSize:11,fontWeight:700}}>+ Adicionar</button>
            </div>
          </div>

          {/* totais */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:6,marginBottom:6}}>
            <Card label="Área Real" value={`${fN(tot.areaReal,1)} m²`} cor={C.gold}/>
            <Card label="Área Equiv. NBR" value={`${fN(tot.areaEq,1)} m²`} cor={C.blu}/>
            <Card label={modoCalc==="cub"?"Custo CUB":"Base Detalhado"} value={fR(custoBase)} sub={modoCalc==="cub"?`${fR(cubM2)}/m²`:"cotações inseridas"} cor={C.gold}/>
            <Card label="Piso Total" value={`${fN(tot.piso,1)} m²`} cor={C.cya}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6,marginBottom:14}}>
            <Card label="Rodapé" value={`${fN(tot.rodape,1)} m`} cor={C.t2}/>
            <Card label="Azulejo Parede" value={`${fN(tot.azulejo,1)} m²`} cor={C.org}/>
            <Card label="Pintura (par.+teto)" value={`${fN(tot.pintura,1)} m²`} cor={C.grn}/>
          </div>

          {/* estrutura parametrizada */}
          <Div label="Dados Estruturais — Calculados Automaticamente pela Área"/>
          <div style={{background:C.s2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 13px",marginBottom:10,fontSize:11,color:C.t2,lineHeight:1.5}}>
            🤖 Valores calculados automaticamente a partir da área real ({fN(tot.areaReal,1)} m²) por coeficientes paramétricos médios (residência unifamiliar térrea/sobrado).
            <b style={{color:C.gold}}> Ative o ajuste manual</b> se tiver dados do projeto estrutural.
          </div>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <button onClick={()=>{setEstrManual(p=>!p);if(!estrManual)setEstrAdj({...estrAuto});}} style={{padding:"6px 14px",borderRadius:8,border:`1px solid ${estrManual?C.org:C.bd}`,background:estrManual?C.org+"20":"transparent",color:estrManual?C.org:C.t3,cursor:"pointer",fontSize:11,fontWeight:700}}>
              {estrManual?"🔓 Ajuste Manual Ativo":"🔒 Automático"}</button>
            {estrManual&&<span style={{fontSize:10,color:C.org}}>Editando sobre base calculada da área</span>}
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:14}}>
            {[{k:"estacas",lb:"Estacas",sug:"~1/4,5m²",un:"un",c:C.org},
              {k:"baldrame",lb:"Baldrame",sug:"perímetro estimado",un:"m",c:C.org},
              {k:"pilares",lb:"Pilares",sug:"~1/12m²",un:"un",c:C.org},
              {k:"laje",lb:"Área de Laje",sug:"90% da área",un:"m²",c:C.pur},
              {k:"telhado",lb:"Telhado (projeção)",sug:"área +15%",un:"m²",c:C.red},
              {k:"contrapiso",lb:"Contrapiso",sug:"95% da área",un:"m²",c:C.cya},
              {k:"alvenaria",lb:"Alvenaria (m² parede)",sug:"perímetro×PD−vãos",un:"m²",c:C.warn},
              {k:"fachada",lb:"Fachada / Ext.",sug:"~45% das paredes",un:"m²",c:C.grn},
            ].map(({k,lb,sug,un,c})=>(
              <div key={k} style={{background:C.s2,border:`1px solid ${c}20`,borderRadius:9,padding:"9px 11px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:1}}>
                  <span style={{fontSize:10,fontWeight:700,color:c}}>{lb}</span>
                  <span style={{fontSize:8,color:C.t3}}>{sug}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6,marginTop:5}}>
                  <div style={{fontSize:13,fontWeight:700,color:estrManual?C.t3:c,minWidth:50}}>{fN(estrAuto[k],k==="baldrame"?2:0)} {un}</div>
                  {estrManual&&(<>
                    <span style={{fontSize:10,color:C.t3}}>→</span>
                    <InN value={estrAdj[k]??estrAuto[k]} onChange={v=>setEstrAdj(p=>({...p,[k]:v}))} step={k==="baldrame"?0.5:1} w={72} cor={c} suffix={un}/>
                  </>)}
                  {!estrManual&&<span style={{fontSize:9,color:C.t3}}>{un}</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{display:"flex",gap:8}}>
            <BtnS onClick={()=>nav(1)} label="← Modo & Estado"/>
            <BtnP onClick={()=>nav(3)} label="Materiais & Guia →" cor={C.gold} flex={1}/>
          </div>
        </>)}

        {/* ═══ TAB 3: MATERIAIS & GUIA ═════════════════════════════════ */}
        {tab===3&&(<>
          <ModoBanner/>

          {/* alerta info modo */}
          {alertas.filter(a=>a.nivel==="info").map((a,i)=><Alerta key={i} {...a}/>)}

          {modoCalc==="cub"&&(<>
            <Div label="Breakdown do CUB por Etapa"/>
            <div style={{background:`${C.blu}12`,border:`1px solid ${C.blu}30`,borderRadius:10,padding:"10px 13px",marginBottom:12,fontSize:11,color:C.blu,lineHeight:1.5}}>
              📊 Esses valores <b>já estão incluídos no CUB</b>. São apenas informativos — mostram como o custo se distribui pelas etapas da obra.
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,marginBottom:18}}>
              {CUB_PARTICIPACAO.map((e,i)=>(
                <div key={i} style={{background:C.s2,borderRadius:9,padding:"8px 12px",border:`1px solid ${C.bd}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:3}}>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontSize:13}}>{e.ic}</span>
                      <span style={{fontSize:12,color:C.t2}}>{e.lb}</span>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <span style={{fontSize:13,fontWeight:700,color:e.cor}}>{fR(custoCUB*e.pct)}</span>
                      <span style={{fontSize:9,color:C.t3,marginLeft:6}}>{(e.pct*100).toFixed(1)}%</span>
                    </div>
                  </div>
                  <div style={{height:3,background:C.bd,borderRadius:2}}><div style={{width:`${e.pct/0.12*100}%`,maxWidth:"100%",height:"100%",background:e.cor,borderRadius:2}}/></div>
                </div>
              ))}
            </div>

            <Div label="Guia de Compras de Materiais"/>
            <div style={{background:"#2e1f0a",border:`1px solid ${C.warn}50`,borderRadius:10,padding:"10px 13px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:C.warn,marginBottom:4}}>⚠️ GUIA DE COMPRAS — não é o custo da obra</div>
              <div style={{fontSize:11,color:C.t2,lineHeight:1.5}}>
                Esses quantitativos servem para saber <b style={{color:C.t1}}>o que comprar e em que quantidade</b>. O custo já está no CUB acima. 
                Se você somar os preços desses materiais ao CUB, vai <b style={{color:C.red}}>duplicar o custo</b>.
              </div>
            </div>

            {/* guia agrupado */}
            {(()=>{
              const grupos={};
              guia.forEach(i=>{if(!grupos[i.g])grupos[i.g]=[];grupos[i.g].push(i);});
              return Object.entries(grupos).map(([g,itens])=>{
                const open=expandCat===g;
                return(
                  <div key={g} style={{background:C.s2,border:`1px solid ${open?C.warn:C.bd}`,borderRadius:10,marginBottom:5,overflow:"hidden"}}>
                    <button onClick={()=>setExpandCat(open?null:g)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 13px",background:"transparent",border:"none",cursor:"pointer",color:C.t1}}>
                      <span style={{fontSize:13,fontWeight:700,color:open?C.warn:C.t1}}>{g}</span>
                      <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:C.t3}}>{itens.length} itens</span><span style={{color:C.t3,fontSize:12}}>{open?"▲":"▼"}</span></div>
                    </button>
                    {open&&(
                      <div style={{padding:"0 13px 12px",borderTop:`1px solid ${C.bd}`}}>
                        <div style={{display:"grid",gridTemplateColumns:"1fr 80px 60px",gap:6,padding:"5px 0",fontSize:8,color:C.t3,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>
                          <span>Material</span><span style={{textAlign:"right"}}>Quantidade</span><span style={{textAlign:"right"}}>Un.</span>
                        </div>
                        {itens.map(item=>(
                          <div key={item.k} style={{display:"grid",gridTemplateColumns:"1fr 80px 60px",gap:6,padding:"6px 0",borderBottom:`1px solid ${C.bd}`}}>
                            <div>
                              <div style={{fontSize:12,color:C.t2}}>{item.k}</div>
                              <div style={{fontSize:9,color:C.t3,marginTop:1}}>{item.obs}</div>
                            </div>
                            <div style={{textAlign:"right",fontSize:13,fontWeight:700,color:C.warn}}>{fN(item.v,item.v<5?1:0)}</div>
                            <div style={{textAlign:"right",fontSize:10,color:C.t3}}>{item.un}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              });
            })()}
          </>)}

          {modoCalc==="detalhado"&&(<>
            <Div label="Cotação de Preços Locais — Modo Detalhado"/>
            <div style={{background:"#2e1a0a",border:`1px solid ${C.org}50`,borderRadius:10,padding:"10px 13px",marginBottom:12,fontSize:11,color:C.org,lineHeight:1.5}}>
              🔬 Informe o <b>preço unitário local</b> de cada material. O custo total é calculado automaticamente.<br/>
              <b style={{color:C.red}}>NÃO somar ao CUB.</b> Esses valores já cobrimos as mesmas etapas.
            </div>
            {(()=>{
              const grupos={};
              guia.forEach(i=>{if(!grupos[i.g])grupos[i.g]=[];grupos[i.g].push(i);});
              const totalGeral=guia.reduce((s,i)=>{const p=Number(cotacoes[i.k])||0;return s+(p>0?i.v*p:0);},0);
              return(<>
                {Object.entries(grupos).map(([g,itens])=>{
                  const open=expandCat===g;
                  const totalGrupo=itens.reduce((s,i)=>{const p=Number(cotacoes[i.k])||0;return s+(p>0?i.v*p:0);},0);
                  return(
                    <div key={g} style={{background:C.s2,border:`1px solid ${open?C.org:C.bd}`,borderRadius:10,marginBottom:5,overflow:"hidden"}}>
                      <button onClick={()=>setExpandCat(open?null:g)} style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"10px 13px",background:"transparent",border:"none",cursor:"pointer",color:C.t1}}>
                        <span style={{fontSize:13,fontWeight:700,color:open?C.org:C.t1}}>{g}</span>
                        <div style={{display:"flex",alignItems:"center",gap:10}}>
                          {totalGrupo>0&&<span style={{fontSize:11,color:C.grn,fontWeight:700}}>{fR(totalGrupo)}</span>}
                          <span style={{color:C.t3,fontSize:12}}>{open?"▲":"▼"}</span>
                        </div>
                      </button>
                      {open&&(
                        <div style={{padding:"0 13px 12px",borderTop:`1px solid ${C.bd}`}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 90px 90px",gap:5,padding:"5px 0",fontSize:8,color:C.t3,letterSpacing:1,textTransform:"uppercase",borderBottom:`1px solid ${C.bd}`}}>
                            <span>Material</span><span style={{textAlign:"right"}}>Qtd.</span><span style={{textAlign:"right"}}>Un.</span>
                            <span style={{textAlign:"right"}}>R$ unit.</span><span style={{textAlign:"right"}}>Total</span>
                          </div>
                          {itens.map(item=>{
                            const prUnit=Number(cotacoes[item.k])||0;
                            const prTotal=prUnit>0?item.v*prUnit:0;
                            return(
                              <div key={item.k} style={{display:"grid",gridTemplateColumns:"1fr 70px 50px 90px 90px",gap:5,padding:"6px 0",borderBottom:`1px solid ${C.bd}`,alignItems:"center"}}>
                                <div><div style={{fontSize:11,color:C.t2}}>{item.k}</div><div style={{fontSize:9,color:C.t3}}>{item.obs}</div></div>
                                <div style={{textAlign:"right",fontSize:12,fontWeight:700,color:C.org}}>{fN(item.v,item.v<5?1:0)}</div>
                                <div style={{textAlign:"right",fontSize:9,color:C.t3}}>{item.un}</div>
                                <input type="number" step="0.01" min={0} value={cotacoes[item.k]||""} placeholder="0,00"
                                  onChange={e=>setCotacoes(p=>({...p,[item.k]:e.target.value}))}
                                  style={{width:"100%",padding:"5px 7px",borderRadius:7,textAlign:"right",border:`1.5px solid ${prUnit>0?C.grn:C.bd2}`,background:prUnit>0?C.grn+"12":C.s3,color:prUnit>0?C.grn:C.t2,fontSize:11,fontWeight:700,outline:"none"}}/>
                                <div style={{textAlign:"right",fontSize:12,fontWeight:700,color:prTotal>0?C.grn:C.t3}}>{prTotal>0?fR(prTotal):"—"}</div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {totalGeral>0&&(
                  <div style={{background:C.grn+"15",border:`1px solid ${C.grn}40`,borderRadius:10,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:4}}>
                    <div style={{fontSize:11,color:C.t2}}>Total materiais cotados<br/><span style={{fontSize:9,color:C.t3}}>⚠️ Não inclui mão de obra — adicione em "Itens por Projeto"</span></div>
                    <div style={{fontSize:20,fontWeight:700,color:C.grn}}>{fR(totalGeral)}</div>
                  </div>
                )}
              </>);
            })()}
          </>)}

          <div style={{display:"flex",gap:8,marginTop:14}}>
            <BtnS onClick={()=>nav(2)} label="← Ambientes"/>
            <BtnP onClick={()=>nav(4)} label="Itens por Projeto →" cor={C.gold} flex={1}/>
          </div>
        </>)}

        {/* ═══ TAB 4: ITENS POR PROJETO ════════════════════════════════ */}
        {tab===4&&(<>
          <ModoBanner/>
          <Div label="Itens que Dependem de Projeto ou Cotação Específica"/>
          <div style={{background:C.s2,border:`1px solid ${C.warn}40`,borderRadius:10,padding:"10px 13px",marginBottom:12,fontSize:11,color:C.t2,lineHeight:1.5}}>
            ⚠️ Esses itens <b style={{color:C.warn}}>não são calculados automaticamente</b> (elétrica, hidráulica, esquadrias, louças etc.).
            Preencha <b style={{color:C.gold}}>quantidade e valor</b> conforme suas cotações. <Chip c={C.red} v="REQUER PROJETO" small/> = precisa de profissional habilitado antes de executar.
          </div>

          {Object.entries(CAT_LIVRE_INFO).map(([cat,ci])=>{
            const itens=gruposLivres[cat]||[];if(!itens.length)return null;
            const open=expandCatLivre===cat;
            const totalCat=itens.reduce((s,i)=>s+(Number(i.val)||0),0);
            return(
              <div key={cat} style={{background:C.s2,border:`1px solid ${open?ci.cor:C.bd}`,borderRadius:11,marginBottom:6,overflow:"hidden"}}>
                <button onClick={()=>setExpandCatLivre(open?null:cat)} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 13px",background:"transparent",border:"none",cursor:"pointer",color:C.t1,textAlign:"left"}}>
                  <div><span style={{fontSize:13,fontWeight:700,color:open?ci.cor:C.t1}}>{ci.lb}</span>{totalCat>0&&<span style={{fontSize:11,color:ci.cor,marginLeft:10,fontWeight:700}}>{fR(totalCat)}</span>}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:10,color:C.t3}}>{itens.filter(i=>i.val>0).length}/{itens.length} preenchidos</span><span style={{color:C.t3,fontSize:12}}>{open?"▲":"▼"}</span></div>
                </button>
                {open&&(
                  <div style={{padding:"0 13px 13px",borderTop:`1px solid ${C.bd}`}}>
                    {itens.map(item=>(
                      <div key={item.id} style={{padding:"9px 0",borderBottom:`1px solid ${C.bd}`}}>
                        <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:5}}>
                          <span style={{fontSize:14,minWidth:20}}>{item.ic}</span>
                          <div style={{flex:1}}>
                            <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                              <span style={{fontSize:12,color:item.tipo==="proj"?C.warn:C.t1,fontWeight:item.tipo==="proj"?700:400}}>{item.lb}</span>
                              {item.tipo==="proj"&&<Chip c={C.red} v="REQUER PROJETO" small/>}
                            </div>
                            <div style={{fontSize:10,color:C.t3,marginTop:2,lineHeight:1.4}}>{item.obs}</div>
                          </div>
                        </div>
                        <div style={{display:"flex",gap:8,alignItems:"center",flexWrap:"wrap",marginLeft:28}}>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{fontSize:9,color:C.t3}}>Qtd.</span>
                            <input type="number" value={item.qtd} min={0} step={1} onChange={e=>updIL(item.id,"qtd",Number(e.target.value))} style={{width:58,padding:"5px 6px",borderRadius:7,border:`1px solid ${C.bd2}`,background:C.s3,color:C.t1,fontSize:12,textAlign:"center",outline:"none"}}/>
                            <span style={{fontSize:9,color:C.t3}}>{item.un}</span>
                          </div>
                          <div style={{display:"flex",alignItems:"center",gap:4}}>
                            <span style={{fontSize:9,color:C.t3}}>Valor (R$)</span>
                            <input type="number" value={item.val||""} min={0} step={100} placeholder="0,00" onChange={e=>updIL(item.id,"val",Number(e.target.value))} style={{width:100,padding:"5px 8px",borderRadius:7,border:`1.5px solid ${item.val>0?C.gold:C.bd2}`,background:item.val>0?C.gold+"15":C.s3,color:item.val>0?C.gold:C.t2,fontSize:12,fontWeight:700,outline:"none"}}/>
                          </div>
                          {item.val>0&&<span style={{fontSize:11,color:C.gold,fontWeight:700}}>{fR(Number(item.val))}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          <div style={{background:totalLivres>0?`${C.gold}15`:C.s2,border:`1px solid ${totalLivres>0?C.gold:C.bd}`,borderRadius:11,padding:"12px 14px",marginTop:8,marginBottom:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div>
              <div style={{fontSize:10,color:C.t3}}>Total lançado nesta aba</div>
              <div style={{fontSize:11,color:C.t2,marginTop:2}}>{itensLivres.filter(i=>i.val>0).length} de {itensLivres.length} itens</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:20,fontWeight:700,color:C.gold}}>{fR(totalLivres)}</div>
              <div style={{fontSize:9,color:C.t3}}>+ {modoCalc==="cub"?"CUB":"Detalhado"} {fR(custoBase)} = {fR(custoTotal)}</div>
            </div>
          </div>

          <div style={{display:"flex",gap:8}}>
            <BtnS onClick={()=>nav(3)} label="← Materiais"/>
            <BtnP onClick={()=>nav(5)} label="BDI & Resultado →" cor={C.gold} flex={1}/>
          </div>
        </>)}

        {/* ═══ TAB 5: BDI & RESULTADO ══════════════════════════════════ */}
        {tab===5&&(<>
          <ModoBanner/>

          {/* hero */}
          <div style={{background:`radial-gradient(ellipse at center,${C.gold}15 0%,transparent 70%)`,border:`1px solid ${C.gold}40`,borderRadius:16,padding:"20px 14px",textAlign:"center",marginBottom:14}}>
            <div style={{fontSize:8,letterSpacing:4,color:C.t3,textTransform:"uppercase",marginBottom:4}}>
              {CUB[uf].n} · {nomP} · {fN(tot.areaEq,1)} m² equiv.
            </div>
            <div style={{fontSize:9,color:C.t3,marginBottom:6}}>
              {modoCalc==="cub"?"CUSTO CUB × Área Equivalente + Itens por Projeto":"CUSTO DETALHADO (Cotações) + Itens por Projeto"}
            </div>
            <div style={{fontSize:"clamp(24px,5.5vw,42px)",fontWeight:700,color:C.gold,lineHeight:1}}>{fR(custoTotal)}</div>
            <div style={{display:"flex",justifyContent:"center",gap:20,marginTop:8,flexWrap:"wrap",fontSize:11}}>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.t3}}>{modoCalc==="cub"?"CUB × Área Equiv.":"Materiais Cotados"}</div><div style={{fontWeight:700,color:C.blu}}>{fR(custoBase)}</div></div>
              <div style={{textAlign:"center"}}><div style={{fontSize:9,color:C.t3}}>Itens por Projeto</div><div style={{fontWeight:700,color:totalLivres>0?C.gold:C.t3}}>{totalLivres>0?"+"+fR(totalLivres):"—"}</div></div>
            </div>
          </div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:7,marginBottom:14}}>
            {[{l:"Otimista −15%",m:.85,c:C.grn},{l:"Base",m:1,c:C.gold},{l:"Conservador +20%",m:1.2,c:C.red}].map(({l,m,c})=>(
              <div key={l} style={{background:C.s2,border:`1px solid ${c}30`,borderRadius:10,padding:"10px 7px",textAlign:"center"}}>
                <div style={{fontSize:9,color:C.t3,marginBottom:2}}>{l}</div>
                <div style={{fontSize:m===1?17:13,fontWeight:700,color:c}}>{fR(custoTotal*m)}</div>
              </div>
            ))}
          </div>

          {/* BDI */}
          <Div label="BDI — Formação do Preço"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
            {[{modo:"proprio",ic:"🏠",titulo:"Obra Própria",desc:"BDI = 0%. Custo direto = seu investimento.",cor:C.grn},
              {modo:"venda",ic:"🏢",titulo:"Obra p/ Venda / Serviço",desc:"Aplica BDI com impostos e lucro da construtora.",cor:C.gold},
            ].map(({modo,ic,titulo,desc,cor})=>{
              const ativo=modoBdi===modo;
              return(
                <button key={modo} onClick={()=>{setModoBdi(modo);if(modo==="proprio")setBdi({io:0,ic:0,fin:0,imp:0,luc:0,iss:0,pis:0,cof:0,rep:0});else setBdi({io:5,ic:3,fin:1.5,imp:2,luc:8,iss:3,pis:0.65,cof:3,rep:0});}}
                  style={{padding:"12px",borderRadius:11,cursor:"pointer",textAlign:"left",border:`2px solid ${ativo?cor:C.bd}`,background:ativo?cor+"18":C.s2}}>
                  <div style={{fontSize:16,marginBottom:4}}>{ic}</div>
                  <div style={{fontSize:12,fontWeight:700,color:ativo?cor:C.t1,marginBottom:3}}>{titulo}</div>
                  <div style={{fontSize:10,color:C.t3}}>{desc}</div>
                </button>
              );
            })}
          </div>

          <div style={{background:C.s2,border:`1px solid ${C.bd2}`,borderRadius:12,padding:"13px 14px",marginBottom:14}}>
            {modoBdi==="proprio"?(
              <div style={{background:C.grn+"12",border:`1px solid ${C.grn}30`,borderRadius:10,padding:"12px",textAlign:"center"}}>
                <div style={{fontSize:13,fontWeight:700,color:C.grn,marginBottom:4}}>🏠 Modo Obra Própria — BDI = 0%</div>
                <div style={{fontSize:11,color:C.t2}}>Reserva de contingência recomendada: <b style={{color:C.warn}}>10–15% ≈ {fR(custoTotal*0.12)}</b></div>
              </div>
            ):(
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
                {[{k:"io",l:"IO — Custo Indireto Obra",c:C.blu,t:"Canteiro: água, luz, vigilante, EPI"},
                  {k:"ic",l:"IC — Custo Indireto Empresa",c:C.blu,t:"Escritório, contador, adm."},
                  {k:"fin",l:"F — Custo Financeiro",c:C.pur,t:"Juros por antecipação de capital"},
                  {k:"imp",l:"IP — Imprevistos",c:C.org,t:"Reserva para riscos não previstos"},
                  {k:"luc",l:"L — Lucro da Construtora",c:C.grn,t:"Margem de resultado da empresa"},
                  {k:"iss",l:"ISS",c:C.red,t:"2% a 5% conforme município"},
                  {k:"pis",l:"PIS",c:C.red,t:"0,65% (lucro presumido)"},
                  {k:"cof",l:"COFINS",c:C.red,t:"3,0% (lucro presumido)"},
                  {k:"rep",l:"REP — Incorporadores",c:C.gold,t:"Comissão de vendas"},
                ].map(({k,l,c,t})=>(
                  <div key={k} style={{background:C.s3,borderRadius:8,padding:"7px 9px"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{fontSize:10,color:C.t2,flex:1}}>{l}</span>
                      <div style={{display:"flex",alignItems:"center",gap:3}}>
                        <input type="number" step="0.5" min={0} value={bdi[k]} onChange={e=>setBdi(p=>({...p,[k]:Number(e.target.value)}))} style={{width:50,padding:"4px 5px",borderRadius:6,border:`1px solid ${c}40`,background:C.bg,color:c,fontSize:12,fontWeight:700,textAlign:"center",outline:"none"}}/>
                        <span style={{fontSize:9,color:C.t3}}>%</span>
                      </div>
                    </div>
                    <div style={{fontSize:9,color:C.t3,marginTop:2}}>{t}</div>
                  </div>
                ))}
              </div>
            )}
            <div style={{background:C.s3,borderRadius:10,padding:"11px 13px",display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,textAlign:"center"}}>
              <div><div style={{fontSize:8,color:C.t3}}>BDI</div><div style={{fontSize:16,fontWeight:700,color:modoBdi==="proprio"?C.grn:C.gold}}>{modoBdi==="proprio"?"0,00":fN(bdiPct*100,2)}%</div></div>
              <div><div style={{fontSize:8,color:C.t3}}>CUSTO DIRETO</div><div style={{fontSize:12,fontWeight:700,color:C.t2}}>{fR(custoTotal)}</div></div>
              <div><div style={{fontSize:8,color:C.t3}}>{modoBdi==="proprio"?"CONTINGÊNCIA REC.":"BDI (R$)"}</div><div style={{fontSize:12,fontWeight:700,color:modoBdi==="proprio"?C.warn:C.org}}>{modoBdi==="proprio"?"+"+fR(custoTotal*0.12):"+"+fR(prVenda-custoTotal)}</div></div>
              <div><div style={{fontSize:8,color:C.t3}}>{modoBdi==="proprio"?"SEU INVESTIMENTO":"PREÇO DE VENDA"}</div><div style={{fontSize:16,fontWeight:700,color:C.grn}}>{fR(prVenda)}</div></div>
            </div>
          </div>

          {/* PDF */}
          <button onClick={()=>gerarPDF({obraName,uf,padrao,ambs,estr,tot,itensLivres,bdi,modoBdi,modoCalc,custoCUB,custoTotal,prVenda,bdiPct,cotacoes,guia})}
            style={{width:"100%",padding:"13px",borderRadius:10,border:`1px solid ${C.red}`,background:C.red+"20",color:C.red,cursor:"pointer",fontSize:14,fontWeight:700,marginBottom:12,display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
            📄 Exportar PDF — Orçamento Completo
          </button>

          {/* comparativo */}
          <Div label="Comparativo por Estado"/>
          <div style={{display:"flex",flexDirection:"column",gap:3,marginBottom:16}}>
            {Object.entries(CUB).sort((a,b)=>b[1][padrao]-a[1][padrao]).map(([sig,e])=>{
              const val=modoCalc==="cub"?tot.areaEq*e[padrao]+totalLivres:custoTotal;
              const max=modoCalc==="cub"?tot.areaEq*Math.max(...Object.values(CUB).map(x=>x[padrao]))+totalLivres:custoTotal;
              const rc=Object.entries(REGIOES).find(([,ufs])=>ufs.includes(sig))?.[0];
              const cc=rc?RCOR[rc]:C.blu;
              return(
                <button key={sig} onClick={()=>setUf(sig)} style={{display:"flex",alignItems:"center",gap:7,width:"100%",textAlign:"left",background:uf===sig?C.gold+"12":C.s2,border:`1px solid ${uf===sig?C.gold:C.bd}`,borderRadius:7,padding:"6px 9px",cursor:"pointer"}}>
                  <span style={{fontSize:10,fontWeight:700,color:cc,minWidth:20}}>{sig}</span>
                  <div style={{flex:1}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                      <span style={{fontSize:10,color:uf===sig?C.gold:C.t2}}>{e.n}</span>
                      <span style={{fontSize:11,fontWeight:700,color:uf===sig?C.gold:C.t1}}>{modoCalc==="cub"?fR(val):"—"}</span>
                    </div>
                    <div style={{height:2,background:C.bd,borderRadius:2}}><div style={{width:modoCalc==="cub"?`${val/max*100}%`:(uf===sig?"100%":"0%"),height:"100%",background:uf===sig?C.gold:cc,borderRadius:2,opacity:uf===sig?1:.5}}/></div>
                  </div>
                  <span style={{fontSize:9,color:C.t3,minWidth:46,textAlign:"right"}}>{fR(e[padrao])}/m²</span>
                </button>
              );
            })}
            {modoCalc==="detalhado"&&<div style={{fontSize:10,color:C.t3,textAlign:"center",padding:"6px"}}>Comparativo por estado disponível apenas no Modo CUB.</div>}
          </div>

          <div style={{background:C.s2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"10px 12px",marginBottom:14,fontSize:11,color:C.t3,lineHeight:1.7}}>
            ⚠️ <b style={{color:C.t2}}>Estimativa paramétrica.</b> Não substitui orçamento discriminado com engenheiro habilitado e projeto executivo. Precisão: ±15–25% (Modo CUB) · ±20% (Modo Detalhado). Instalações elétricas e hidráulicas dependem de projetos específicos.
          </div>

          <div style={{display:"flex",gap:8}}>
            <BtnS onClick={()=>nav(4)} label="← Itens por Projeto"/>
            <button onClick={novaObra} style={{flex:1,padding:"12px",borderRadius:10,border:`1px solid ${C.gold}`,background:"transparent",color:C.gold,cursor:"pointer",fontSize:12,fontWeight:600}}>🔄 Nova Estimativa</button>
          </div>

          {/* CRÉDITOS */}
          <div style={{marginTop:24,background:`linear-gradient(135deg,${C.s2} 0%,${C.s3} 100%)`,border:`1px solid ${C.gold}30`,borderRadius:14,padding:"16px 18px",textAlign:"center"}}>
            <div style={{fontSize:9,letterSpacing:4,color:C.t3,textTransform:"uppercase",marginBottom:8}}>Desenvolvido por</div>
            <div style={{fontSize:17,fontWeight:700,color:C.gold,marginBottom:3}}>{DEV.nome}</div>
            <div style={{fontSize:12,color:C.t2,marginBottom:2}}>{DEV.titulo}</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:8}}>{DEV.espec}</div>
            <div style={{fontSize:9,color:C.t3}}>Versão {DEV.versao} · CUB · NBR 12721 · SINAPI · TCPO 13ª ed.</div>
          </div>
        </>)}

        {/* ═══ TAB 6: ATUALIZAR CUB ═════════════════════════════ */}
        {tab===6&&(<>
          <Div label="Atualizar CUB — Painel de Manutenção"/>
          <div style={{background:C.s2,border:`1px solid ${C.gold}40`,borderRadius:10,padding:"12px 14px",marginBottom:14,fontSize:11,color:C.t2,lineHeight:1.6}}>
            📅 O CUB é divulgado <b style={{color:C.t1}}>até o dia 5 de cada mês</b> pelos Sinduscons estaduais.
            Quando sair um novo valor, atualize aqui — os dados ficam <b style={{color:C.gold}}>salvos permanentemente</b> (storage local) e substituem o valor base sem alterar o código.<br/><br/>
            🔗 Consulte em: <b style={{color:C.t1}}>cub.org.br</b> ou no site do Sinduscon do estado desejado.
          </div>

          <div style={{background:"#1a0f00",border:`1px solid ${C.warn}50`,borderRadius:9,padding:"9px 12px",marginBottom:12,fontSize:11,color:C.warn}}>
            ⚠️ Estados com dados de 2025 (prioridade para atualizar): {Object.entries(CUB_BASE).filter(([,v])=>v.ref==="2025").map(([k])=>k).join(", ")}
          </div>

          <div style={{display:"flex",flexDirection:"column",gap:5,marginBottom:14}}>
            {Object.entries(CUB).map(([sig,e])=>{
              const custom=cubCustom[sig];
              const editando=cubEditSig===sig;
              const rc=Object.entries(REGIOES).find(([,ufs])=>ufs.includes(sig))?.[0];
              const cor=rc?RCOR[rc]:C.blu;
              const desatualizado=e.ref==="2025";
              return(
                <div key={sig} style={{background:editando?`${C.gold}12`:C.s2,border:`1px solid ${editando?C.gold:custom?C.grn:desatualizado?C.warn+"40":C.bd}`,borderRadius:10,overflow:"hidden"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,padding:"9px 12px"}}>
                    <span style={{fontSize:11,fontWeight:700,color:cor,minWidth:22}}>{sig}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:12,color:C.t1}}>{e.n}</div>
                      <div style={{fontSize:9,color:custom?C.grn:desatualizado?C.warn:C.t3}}>
                        {custom?"✅ Atualizado por você · ":""}{e.ref} · R1-N: {fD(e.m)}/m²
                      </div>
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {custom&&(
                        <button onClick={async()=>{
                          const nc={...cubCustom};delete nc[sig];
                          setCubCustom(nc);
                          try{await storage.set("cub_custom",JSON.stringify(nc));}catch{}
                          showMsg("↩️ "+sig+" restaurado ao valor base.");
                        }} style={{fontSize:9,padding:"3px 8px",borderRadius:6,border:`1px solid ${C.red}40`,background:"transparent",color:C.red,cursor:"pointer"}}>
                          Restaurar
                        </button>
                      )}
                      <button onClick={()=>{
                        if(editando)setCubEditSig(null);
                        else{setCubEditSig(sig);setCubEditVals({b:e.b,m:e.m,a:e.a,ref:e.ref});}
                      }} style={{fontSize:10,padding:"5px 12px",borderRadius:7,border:`1px solid ${editando?C.gold:C.bd2}`,background:editando?C.gold+"20":"transparent",color:editando?C.gold:C.t3,cursor:"pointer",fontWeight:700}}>
                        {editando?"✕ Fechar":"✏️ Atualizar"}
                      </button>
                    </div>
                  </div>
                  {editando&&(
                    <div style={{padding:"0 12px 12px",borderTop:`1px solid ${C.bd}`}}>
                      <div style={{fontSize:10,color:C.t3,margin:"8px 0",lineHeight:1.5}}>
                        Digite os novos valores R1 (residência unifamiliar) conforme divulgado pelo Sinduscon {sig}.<br/>
                        <b style={{color:C.warn}}>Use os valores sem desonerão (padrão NBR 12721).</b>
                      </div>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:8,marginBottom:10}}>
                        {[["R1-B (Baixo)","b",C.grn],["R1-N (Normal)","m",C.blu],["R1-A (Alto)","a",C.gold],["Referência (mês/ano)","ref",C.t2]].map(([lb,k,cor])=>(
                          <div key={k}>
                            <div style={{fontSize:9,color:cor,marginBottom:4,letterSpacing:1}}>{lb.toUpperCase()}</div>
                            {k==="ref"
                              ?<input value={cubEditVals.ref} onChange={ev=>setCubEditVals(p=>({...p,ref:ev.target.value}))} placeholder="Ex: Abr/2026"
                                  style={{width:"100%",padding:"6px 8px",borderRadius:7,border:`1px solid ${C.bd}`,background:C.bg,color:C.t1,fontSize:12,outline:"none",boxSizing:"border-box"}}/>
                              :<input type="number" step="0.01" value={cubEditVals[k]} onChange={ev=>setCubEditVals(p=>({...p,[k]:Number(ev.target.value)}))}
                                  style={{width:"100%",padding:"6px 8px",borderRadius:7,border:`1.5px solid ${cor}40`,background:C.bg,color:cor,fontSize:13,fontWeight:700,textAlign:"right",outline:"none",boxSizing:"border-box"}}/>
                            }
                            {k!=="ref"&&<div style={{fontSize:8,color:C.t3,marginTop:2}}>R$/m²</div>}
                          </div>
                        ))}
                      </div>
                      {(Number(cubEditVals.m)<1000||Number(cubEditVals.m)>9000)&&(
                        <div style={{fontSize:10,color:C.red,marginBottom:8}}>⚠️ R1-N fora da faixa esperada (R$1.000–R$9.000/m²). Confirme o valor no site do Sinduscon.</div>
                      )}
                      <button onClick={async()=>{
                        const nc={...cubCustom,[sig]:{b:Number(cubEditVals.b),m:Number(cubEditVals.m),a:Number(cubEditVals.a),ref:cubEditVals.ref}};
                        setCubCustom(nc);setCubEditSig(null);
                        try{await storage.set("cub_custom",JSON.stringify(nc));showMsg("✅ CUB de "+sig+" ("+cubEditVals.ref+") salvo — R1-N: "+fD(Number(cubEditVals.m))+"/m²");}
                        catch{showMsg("❌ Erro ao salvar.");}
                      }} style={{padding:"8px 20px",borderRadius:8,border:"none",background:C.gold,color:"#05080e",cursor:"pointer",fontSize:12,fontWeight:700,boxShadow:`0 3px 12px ${C.gold}40`}}>
                        💾 Salvar CUB de {sig}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {Object.keys(cubCustom).length>0&&(
            <div style={{background:C.grn+"12",border:`1px solid ${C.grn}30`,borderRadius:10,padding:"11px 13px",marginBottom:12}}>
              <div style={{fontSize:11,fontWeight:700,color:C.grn,marginBottom:6}}>✅ {Object.keys(cubCustom).length} estado{Object.keys(cubCustom).length>1?"s":""} com CUB atualizado por você:</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {Object.entries(cubCustom).map(([k,v])=>(
                  <div key={k} style={{background:C.grn+"20",borderRadius:7,padding:"4px 10px",fontSize:10,color:C.grn}}>
                    <b>{k}</b> · {v.ref} · R1-N: {fD(v.m)}/m²
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{background:C.s2,border:`1px solid ${C.bd}`,borderRadius:10,padding:"12px 14px",marginBottom:14,fontSize:11,color:C.t2,lineHeight:1.7}}>
            <div style={{fontWeight:700,color:C.t1,marginBottom:6}}>📋 Sites oficiais dos Sinduscons:</div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:3}}>
              {Object.entries(CUB_BASE).map(([sig,e])=>(
                <div key={sig} style={{fontSize:9,color:C.t3}}><b style={{color:C.t2}}>{sig}</b> — {e.url}</div>
              ))}
            </div>
          </div>

          {/* créditos */}
          <div style={{background:`linear-gradient(135deg,${C.s2} 0%,${C.s3} 100%)`,border:`1px solid ${C.gold}30`,borderRadius:14,padding:"16px 18px",textAlign:"center"}}>
            <div style={{fontSize:9,letterSpacing:4,color:C.t3,textTransform:"uppercase",marginBottom:8}}>Desenvolvido por</div>
            <div style={{fontSize:17,fontWeight:700,color:C.gold,marginBottom:3}}>{DEV.nome}</div>
            <div style={{fontSize:12,color:C.t2,marginBottom:2}}>{DEV.titulo}</div>
            <div style={{fontSize:11,color:C.t3,marginBottom:8}}>{DEV.espec}</div>
            {DEV.crea&&<div style={{fontSize:10,color:C.t3,marginBottom:4}}>CREA: {DEV.crea}</div>}
            {DEV.email&&<div style={{fontSize:10,color:C.blu,marginBottom:4}}>{DEV.email}</div>}
            <div style={{fontSize:9,color:C.t3}}>Versão {DEV.versao} · CUB · NBR 12721 · SINAPI · TCPO 13ª ed.</div>
          </div>
        </>)}
      </div>
    </div>
  );
}
