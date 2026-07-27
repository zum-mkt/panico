const LOWERCASE_WORDS = new Set(["de", "da", "do", "das", "dos", "e"]);

function capitalizeWord(word: string): string {
  return word.replace(
    /\p{L}+/gu,
    (chunk) => chunk.charAt(0).toLocaleUpperCase("pt-BR") + chunk.slice(1),
  );
}

// Nomes próprios que costumam vir sem acento/cedilha no banco.
const PROPER_NOUN_FIXES: [pattern: RegExp, replacement: string][] = [
  [/\bpanico\b/giu, "Paníco"],
  [/\blen[cç]ois\b/giu, "Lençóis"],
];

/** Normaliza texto vindo do banco (ex: "MARIA DA SILVA") para "Maria da Silva". */
export function toTitleCasePt(text?: string | null): string {
  if (!text) return "";
  const titleCased = text
    .trim()
    .toLocaleLowerCase("pt-BR")
    .split(/\s+/)
    .map((word, index) => (index > 0 && LOWERCASE_WORDS.has(word) ? word : capitalizeWord(word)))
    .join(" ");
  return PROPER_NOUN_FIXES.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), titleCased);
}

// Abreviações recorrentes em locais de velório/sepultamento cadastrados sem padrão.
// Cada chave só é expandida quando aparece como token isolado (limite de palavra),
// nunca dentro de uma palavra já escrita por extenso (ex: não afeta "CEMITERIO").
const LOCATION_ABBREVIATIONS: [key: string, expansion: string][] = [
  ["cemit", "cemitério"],
  ["cemi", "cemitério"],
  ["cem", "cemitério"],
  ["funer", "funerária"],
  ["fun", "funerária"],
  ["igrej", "igreja"],
  ["igr", "igreja"],
  ["ig", "igreja"],
  ["presb", "presbiteriana"],
  ["parq", "parque"],
  ["cent", "centro"],
  ["mun", "municipal"],
  ["mu", "municipal"],
  ["vel", "velório"],
  ["pta", "paulista"],
];

const LOCATION_ABBREVIATION_MAP = new Map(LOCATION_ABBREVIATIONS);
// Um "." sempre fecha a abreviação (mesmo colada na próxima, ex: "CEM.MUN.");
// sem ponto, só conta como abreviação se não for seguida de mais letras
// (evita casar "cem" dentro de "cemiterio" já escrito por extenso).
const LOCATION_ABBREVIATION_REGEX = new RegExp(
  `\\b(${LOCATION_ABBREVIATIONS.map(([key]) => key).join("|")})(?:\\.|(?=[^\\p{L}]|$))`,
  "giu",
);

function expandLocationAbbreviations(text: string): string {
  const expanded = text.replace(LOCATION_ABBREVIATION_REGEX, (match, key: string) => {
    const expansion = LOCATION_ABBREVIATION_MAP.get(key.toLowerCase());
    return expansion ? `${expansion} ` : match;
  });
  return expanded.replace(/\s+/g, " ").trim();
}

/** Normaliza e expande siglas de local vindas do banco (ex: "CEM.MUN.LENÇÓIS PTA." → "Cemitério Municipal Lençóis Paulista"). */
export function formatLocation(text?: string | null): string {
  if (!text) return "";
  return toTitleCasePt(expandLocationAbbreviations(text));
}
