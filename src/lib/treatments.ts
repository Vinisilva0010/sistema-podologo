// src/lib/treatments.ts
// Treatment pages content. Statements about the clinic are copied verbatim from
// the clinic's own site (service cards, cases and FAQ). Only "about" is general
// health information written for these pages.
export type Faq = { question: string; answer: string };

export type Treatment = {
  slug: string;
  name: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  about: string[];
  caseStudy?: { title: string; text: string; before: string; after: string };
  faqs: Faq[];
  relatedPosts: string[];
};

const FAQ: Record<"pain" | "pedicure" | "diabetes" | "duration", Faq> = {
  pain: {
    question: "Dói muito para tratar unha encravada?",
    answer:
      "Não! Esse é o maior mito da podologia. Utilizo técnicas avançadas, instrumentais adequados e emolientes específicos que amolecem a região. O alívio é quase imediato após a remoção da espícula (o pedaço de unha que está machucando).",
  },
  pedicure: {
    question: "Qual a diferença entre ir na pedicure e na podóloga?",
    answer:
      "A pedicure cuida do embelezamento superficial (esmaltação, corte simples). A podologia é a área da SAÚDE focada em diagnosticar e tratar patologias (infecções, fungos, calos profundos, pé diabético) com biossegurança nível hospitalar (autoclave).",
  },
  diabetes: {
    question: "Vocês atendem pacientes com diabetes?",
    answer:
      "Sim, sou especialista em pé diabético. Pacientes com diabetes precisam de um cuidado redobrado devido à dificuldade de cicatrização e perda de sensibilidade. Sou 100% focada em prevenção e tratamento seguro sem cortes de risco.",
  },
  duration: {
    question: "Quanto tempo dura uma sessão?",
    answer:
      "Depende muito do caso. Uma profilaxia básica (limpeza preventiva) dura em média 50 minutos. Já o tratamento de uma unha muito inflamada pode levar 1 hora. O importante é: não fazemos nada correndo. Seu pé terá o tempo que precisar.",
  },
};

export const TREATMENTS: Treatment[] = [
  {
    slug: "unha-encravada",
    name: "Unha encravada",
    h1: "Tratamento de unha encravada no Jardim Aricanduva",
    metaTitle: "Tratamento de unha encravada no Jardim Aricanduva",
    metaDescription:
      "Tratamento de unha encravada com a podóloga Lais Laurentino no Jardim Aricanduva, zona leste de SP. Agende online ou tire sua dúvida pelo WhatsApp.",
    summary:
      "Remoção de espículas com técnica indolor e curativo especializado. Alívio imediato na primeira sessão.",
    about: [
      "A unha encravada acontece quando a borda da unha cresce para dentro da pele ao lado dela. Isso costuma causar dor, principalmente ao calçar sapatos ou ao caminhar, e a região pode ficar vermelha e inchada.",
    ],
    caseStudy: {
      title: "Reconstrução de Unha",
      text: "Paciente sofria com onicocriptose (unha encravada) há meses. Procedimento indolor realizado e com alívio imediato.",
      before: "/antes-1.png",
      after: "/depois-1.png",
    },
    faqs: [FAQ.pain, FAQ.duration, FAQ.pedicure],
    relatedPosts: ["post-um", "post-cinco"],
  },
  {
    slug: "calos-e-rachaduras",
    name: "Calos e rachaduras",
    h1: "Tratamento de calos e rachaduras nos pés no Jardim Aricanduva",
    metaTitle: "Tratamento de calos e rachaduras nos pés no Jardim Aricanduva",
    metaDescription:
      "Tratamento de calos e rachaduras no calcanhar com a podóloga Lais Laurentino no Jardim Aricanduva, zona leste de SP. Agende online.",
    summary:
      "Desbaste técnico e hidratação profunda. Devolvemos a elasticidade e o aspecto saudável dos seus pés.",
    about: [
      "Calos e calosidades são áreas de pele mais grossa que se formam em pontos de pressão ou atrito, como a sola e os dedos.",
      "As rachaduras, comuns no calcanhar, aparecem quando a pele fica seca e grossa e perde a elasticidade. Elas podem doer ao caminhar e, quando ficam profundas, podem sangrar.",
    ],
    caseStudy: {
      title: "Tratamento de Fissuras",
      text: "Recuperação da elasticidade da pele do calcanhar através de desbaste técnico e hidratação profunda.",
      before: "/antes-2.png",
      after: "/depois-2.png",
    },
    faqs: [FAQ.pedicure, FAQ.duration],
    relatedPosts: ["post-cinco", "post-quatro"],
  },
  {
    slug: "pe-diabetico",
    name: "Pé diabético",
    h1: "Cuidados com o pé diabético no Jardim Aricanduva",
    metaTitle: "Podologia para pé diabético no Jardim Aricanduva",
    metaDescription:
      "Cuidados com o pé diabético com a podóloga Lais Laurentino no Jardim Aricanduva, zona leste de SP. Avaliação preventiva e corte técnico. Agende online.",
    summary:
      "Avaliação preventiva, corte técnico e tratamento especializado com foco total em biossegurança.",
    about: [
      "Pessoas com diabetes podem ter menos sensibilidade nos pés e uma cicatrização mais lenta. Por isso, um calo, uma rachadura ou um pequeno corte pode passar despercebido e virar uma ferida.",
      "O cuidado com os pés faz parte da rotina de quem tem diabetes e complementa o acompanhamento médico.",
    ],
    faqs: [FAQ.diabetes, FAQ.duration, FAQ.pedicure],
    relatedPosts: ["post-dois"],
  },
  {
    slug: "micoses-e-fungos",
    name: "Infecções e fungos",
    h1: "Tratamento de micose e fungos nas unhas no Jardim Aricanduva",
    metaTitle: "Tratamento de micose e fungos nas unhas no Jardim Aricanduva",
    metaDescription:
      "Tratamento de micoses e fungos nas unhas e nos pés com a podóloga Lais Laurentino no Jardim Aricanduva, zona leste de SP. Agende online.",
    summary:
      "Tratamento de micoses com limpeza profunda e acompanhamento contínuo até a cura completa.",
    about: [
      "Micoses nas unhas e na pele dos pés são causadas por fungos, que se desenvolvem melhor em lugares úmidos e abafados, como dentro do sapato.",
      "Na unha, é comum ela mudar de cor, ficar mais grossa ou quebradiça.",
    ],
    faqs: [FAQ.pedicure, FAQ.duration],
    relatedPosts: ["post-tres"],
  },
];

export function getTreatment(slug: string): Treatment | undefined {
  return TREATMENTS.find((t) => t.slug === slug);
}