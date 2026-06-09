// Script de importação única do histórico do canal Discord
// Uso: node import-history.js
// Requer: DISCORD_TOKEN e SUPABASE_SERVICE_KEY no ambiente (ou arquivo .env)

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID    = process.env.DISCORD_CHANNEL_ID || '1498988634395902063';
const SUPABASE_URL  = process.env.SUPABASE_URL        || 'https://ytphxqybjxokokbnnbrz.supabase.co';
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY;

if (!DISCORD_TOKEN || !SUPABASE_KEY) {
  console.error('Faltam variáveis: DISCORD_TOKEN e SUPABASE_SERVICE_KEY são obrigatórias.');
  console.error('Crie um arquivo .env copiando o .env.example e preencha os valores.');
  process.exit(1);
}

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

// ── Busca todas as mensagens do canal (pagina de 100 em 100) ────────────────
async function fetchAllMessages() {
  const all = [];
  let before = null;

  console.log('Buscando mensagens do Discord...');

  while (true) {
    const qs  = before ? `?limit=100&before=${before}` : '?limit=100';
    const url = `https://discord.com/api/v10/channels/${CHANNEL_ID}/messages${qs}`;

    const resp = await fetch(url, {
      headers: { Authorization: `Bot ${DISCORD_TOKEN}` },
    });

    if (!resp.ok) {
      const body = await resp.text();
      throw new Error(`Discord API ${resp.status}: ${body}`);
    }

    const batch = await resp.json();
    if (!batch.length) break;

    all.push(...batch);
    console.log(`  ${all.length} mensagens carregadas...`);

    before = batch[batch.length - 1].id; // ID mais antigo do lote
    if (batch.length < 100) break;       // última página

    await delay(600); // respeita rate limit do Discord
  }

  // Ordena do mais antigo ao mais recente
  return all.reverse();
}

// ── Processa e importa uma mensagem ────────────────────────────────────────
async function importMessage(msg, existing) {
  const content = msg.content?.trim();
  if (!content) return null; // ignora mensagens vazias / só-imagem sem texto

  const lines    = content.split('\n');
  const title    = lines[0].replace(/\*\*/g, '').trim();
  if (!title) return null;

  const bodyText = lines.slice(1).join('\n').trim();
  const images   = (msg.attachments || []).filter(
    (a) => a.content_type && a.content_type.startsWith('image/')
  );

  const slug    = slugify(title);
  const entryId = `${slug}-${Math.floor(new Date(msg.timestamp).getTime() / 1000)}`;

  // Pula se já existe
  if (existing.has(entryId)) {
    console.log(`  [já existe] ${title}`);
    return 'skip';
  }

  const bodyParts = [];
  if (bodyText) bodyParts.push(bodyText);
  images.forEach(() => bodyParts.push('[img]'));
  const body = bodyParts.length ? bodyParts.join('\n\n') : null;

  const ts        = new Date(msg.timestamp);
  const CURTO     = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const LONGO     = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dateShort = `${String(ts.getDate()).padStart(2,'0')}/${CURTO[ts.getMonth()]}`;
  const dateLong  = `${ts.getDate()} de ${LONGO[ts.getMonth()]} de ${ts.getFullYear()}`;

  // Upload de imagens
  for (let i = 0; i < images.length; i++) {
    const img    = images[i];
    const slotId = `sys-img-${entryId}-${i}`;
    const ext    = (img.filename.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
    const path   = `slots/${slotId}.${ext}`;

    try {
      const imgResp = await fetch(img.url);
      const buffer  = await imgResp.arrayBuffer();

      const { error: upErr } = await sb.storage
        .from('media')
        .upload(path, buffer, { upsert: true, contentType: img.content_type });

      if (upErr) { console.error(`    [storage] ${upErr.message}`); continue; }

      const { data: { publicUrl } } = sb.storage.from('media').getPublicUrl(path);

      const { error: slotErr } = await sb.from('image_slots').upsert({
        id: slotId,
        url: `${publicUrl}?v=${Date.now()}`,
        updated_at: new Date().toISOString(),
      });

      if (slotErr) console.error(`    [image_slots] ${slotErr.message}`);
    } catch (e) {
      console.error(`    [imagem ${i}] ${e.message}`);
    }
  }

  // Insere entry
  const { error } = await sb.from('system_entries').insert({
    id: entryId,
    title,
    body,
    compact: !body,
    date_short: dateShort,
    date_long: dateLong,
    sort_order: Math.floor(ts.getTime() / 1000),
  });

  if (error) {
    console.error(`  [ERRO] "${title}": ${error.message}`);
    return 'error';
  }

  return 'ok';
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  // Carrega IDs que já existem para não duplicar
  const { data: existing } = await sb.from('system_entries').select('id');
  const existingIds = new Set((existing || []).map((e) => e.id));
  console.log(`${existingIds.size} entries já existem no banco.\n`);

  const messages = await fetchAllMessages();
  console.log(`\n${messages.length} mensagens encontradas. Importando...\n`);

  const stats = { ok: 0, skip: 0, error: 0, ignored: 0 };

  for (const msg of messages) {
    const result = await importMessage(msg, existingIds);
    if (result === null)  { stats.ignored++; continue; }
    if (result === 'skip') { stats.skip++;   continue; }
    if (result === 'ok')   {
      stats.ok++;
      const title = msg.content?.split('\n')[0]?.replace(/\*\*/g, '').trim();
      console.log(`  ✓ ${title}`);
    }
    if (result === 'error') stats.error++;

    await delay(200); // pausa entre inserts
  }

  console.log(`
─────────────────────────────
Importação concluída:
  ✓ Importadas : ${stats.ok}
  ↷ Já existiam: ${stats.skip}
  ✗ Erros      : ${stats.error}
  · Ignoradas  : ${stats.ignored} (sem texto)
─────────────────────────────`);
}

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 60);
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

main().catch((err) => {
  console.error('Erro fatal:', err.message);
  process.exit(1);
});
