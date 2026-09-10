// Chunking + política de conteúdo redigido/GM-only.
//
// Uma função por tipo de entidade, todas com a mesma forma de saída:
// array de { sectionTitle, content }. `buildChunks` é o ponto de
// entrada único usado tanto por index-wiki.js quanto (via reimplementação
// em Deno, ver supabase/functions/wiki-chat) pela política que a Edge
// Function assume já ter sido aplicada nos dados.
//
// POLÍTICA DE CONTEÚDO — o que nunca entra no índice:
//
//   1. `sessions.gmnote` — nunca é lido aqui. O campo existe no banco e é
//      carregado pelo client (project-backend/db.js), mas pages/sessions.jsx
//      nunca o renderiza — é uma nota só-GM que hoje só não vaza porque
//      ninguém abre o DevTools. Indexar isso deixaria o chatbot capaz de
//      citar ativamente o que a própria wiki esconde passivamente.
//
//   2. Linhas de `factions.rows` com `redacted: true` — o valor (`v`) é
//      descartado inteiramente (nem a chave entra sozinha). Na wiki,
//      `redacted` é só um efeito visual em CSS (texto na cor do fundo);
//      o valor real continua no HTML. O índice do RAG não herda esse
//      "esconderijo" de graça — a exclusão é feita aqui, explicitamente.
//
// Tudo mais que já é publicamente renderizado na wiki (sections, resumos
// de sessão, narrativa, keypoints, regras da casa, avisos de callout)
// entra no índice normalmente.

function normalizeParas(paras) {
  return (paras || []).filter(p => typeof p === 'string' && p.trim()).join('\n\n');
}

function chunksFromSections(sections) {
  return (sections || [])
    .map(sec => ({ sectionTitle: sec.title || null, content: normalizeParas(sec.paras) }))
    .filter(c => c.content);
}

function buildCharacterChunks(row) {
  // characters e deities compartilham a mesma forma (sections / hero / infobox)
  return chunksFromSections(row.sections);
}

const buildDeityChunks = buildCharacterChunks;

function buildSessionChunks(row) {
  const chunks = [];
  if (row.summary && row.summary.trim()) {
    chunks.push({ sectionTitle: 'Resumo', content: row.summary.trim() });
  }
  const narrative = normalizeParas(row.narrative);
  if (narrative) {
    chunks.push({ sectionTitle: 'Narrativa', content: narrative });
  }
  const keypoints = (row.keypoints || [])
    .map(k => (typeof k === 'string' ? k : k.text))
    .filter(Boolean);
  if (keypoints.length) {
    chunks.push({ sectionTitle: 'Pontos-chave', content: keypoints.join('\n') });
  }
  // row.gmnote é ignorado de propósito — ver política no topo do arquivo.
  return chunks;
}

function buildFactionChunks(row) {
  const chunks = [];
  if (row.summary && row.summary.trim()) {
    chunks.push({ sectionTitle: 'Resumo', content: row.summary.trim() });
  }
  const visibleRows = (row.rows || []).filter(r => !r.redacted && r.k && r.v);
  if (visibleRows.length) {
    chunks.push({
      sectionTitle: 'Dossiê',
      content: visibleRows.map(r => `${r.k}: ${r.v}`).join('\n'),
    });
  }
  return chunks;
}

function buildRealmChunks(row) {
  const chunks = [];
  const overviewParts = [row.motto, row.desc].filter(Boolean);
  if (overviewParts.length) {
    chunks.push({ sectionTitle: 'Visão geral', content: overviewParts.join('\n\n') });
  }
  if (Array.isArray(row.resources) && row.resources.length) {
    chunks.push({ sectionTitle: 'Recursos', content: `Recursos: ${row.resources.join(', ')}` });
  }
  if (row.stats6 && typeof row.stats6 === 'object' && !Array.isArray(row.stats6)) {
    const lines = Object.entries(row.stats6)
      .filter(([, v]) => v !== null && v !== undefined && v !== '')
      .map(([k, v]) => `${k}: ${v}`);
    if (lines.length) chunks.push({ sectionTitle: 'Estatísticas', content: lines.join('\n') });
  }
  return chunks;
}

function buildHouseruleChunks(row) {
  const chunks = [];
  const body = normalizeParas(row.paragraphs);
  if (body) chunks.push({ sectionTitle: null, content: body });
  if (row.callout_text && row.callout_text.trim()) {
    const label = row.callout_label ? `${row.callout_label}: ` : '';
    chunks.push({ sectionTitle: 'Aviso', content: `${label}${row.callout_text.trim()}` });
  }
  return chunks;
}

const BUILDERS = {
  character: buildCharacterChunks,
  deity: buildDeityChunks,
  session: buildSessionChunks,
  faction: buildFactionChunks,
  realm: buildRealmChunks,
  houserule: buildHouseruleChunks,
};

/**
 * @param {string} entityType - uma chave de BUILDERS
 * @param {object} row - a linha crua vinda do Supabase
 * @returns {{ sectionTitle: string|null, content: string }[]}
 */
function buildChunks(entityType, row) {
  const builder = BUILDERS[entityType];
  if (!builder) throw new Error(`Tipo de entidade desconhecido: ${entityType}`);
  return builder(row);
}

module.exports = { buildChunks, ENTITY_TYPES: Object.keys(BUILDERS) };
