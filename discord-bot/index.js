const http = require('http');
const { Client, GatewayIntentBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');

// Railway exige uma porta HTTP aberta para manter o container vivo
http.createServer((_, res) => res.end('ok')).listen(process.env.PORT || 3000);

const DISCORD_TOKEN    = process.env.DISCORD_TOKEN;
const CHANNEL_ID       = process.env.DISCORD_CHANNEL_ID || '1498988634395902063';
const SUPABASE_URL     = process.env.SUPABASE_URL       || 'https://ytphxqybjxokokbnnbrz.supabase.co';
const SUPABASE_KEY     = process.env.SUPABASE_SERVICE_KEY; // service_role key — bypasses RLS

const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

const discord = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discord.once('clientReady', () => {
  console.log(`Bot online: ${discord.user.tag}`);
  console.log(`Monitorando canal: ${CHANNEL_ID}`);
});

discord.on('messageCreate', async (msg) => {
  if (msg.channelId !== CHANNEL_ID) return;
  if (msg.author.bot) return;
  if (!msg.content.trim()) return;

  try {
    await createEntry(msg);
  } catch (err) {
    console.error('[ERRO] Falha ao processar mensagem:', err);
  }
});

async function createEntry(msg) {
  const lines = msg.content.trim().split('\n');
  const title = lines[0].replace(/\*\*/g, '').trim(); // remove markdown bold se houver
  if (!title) return;

  const bodyText = lines.slice(1).join('\n').trim();

  const images = [...msg.attachments.values()].filter(
    (a) => a.contentType && a.contentType.startsWith('image/')
  );

  // ID único: slug + timestamp da mensagem (em segundos)
  const slug    = slugify(title);
  const entryId = `${slug}-${Math.floor(msg.createdTimestamp / 1000)}`;

  // Monta body: texto primeiro, depois [img] para cada imagem
  const bodyParts = [];
  if (bodyText) bodyParts.push(bodyText);
  images.forEach(() => bodyParts.push('[img]'));
  const body = bodyParts.length ? bodyParts.join('\n\n') : null;

  // Data em português
  const d = new Date(msg.createdTimestamp);
  const MESES_CURTO  = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  const MESES_LONGO  = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const dateShort    = `${String(d.getDate()).padStart(2,'0')}/${MESES_CURTO[d.getMonth()]}`;
  const dateLong     = `${d.getDate()} de ${MESES_LONGO[d.getMonth()]} de ${d.getFullYear()}`;

  // Faz upload das imagens para Supabase Storage
  for (let i = 0; i < images.length; i++) {
    const img    = images[i];
    const slotId = `sys-img-${entryId}-${i}`;
    const ext    = (img.name.split('.').pop() || 'jpg').toLowerCase().replace('jpeg', 'jpg');
    const path   = `slots/${slotId}.${ext}`;

    try {
      const resp   = await fetch(img.url);
      const buffer = await resp.arrayBuffer();

      const { error: upErr } = await sb.storage
        .from('media')
        .upload(path, buffer, { upsert: true, contentType: img.contentType });

      if (upErr) {
        console.error(`[STORAGE] Erro no upload da imagem ${i}:`, upErr.message);
        continue;
      }

      const { data: { publicUrl } } = sb.storage.from('media').getPublicUrl(path);
      const url = `${publicUrl}?v=${Date.now()}`;

      const { error: slotErr } = await sb.from('image_slots').upsert({
        id: slotId,
        url,
        updated_at: new Date().toISOString(),
      });

      if (slotErr) console.error(`[DB] Erro em image_slots:`, slotErr.message);
      else console.log(`  ↳ Imagem ${i} salva: ${slotId}`);

    } catch (imgErr) {
      console.error(`[IMAGEM] Falha no download/upload:`, imgErr.message);
    }
  }

  // Insere entry em system_entries
  const { error } = await sb.from('system_entries').insert({
    id: entryId,
    title,
    body,
    compact: !body,
    date_short: dateShort,
    date_long: dateLong,
    sort_order: Math.floor(msg.createdTimestamp / 1000),
  });

  if (error) {
    console.error('[DB] Erro ao criar entry:', error.message);
  } else {
    console.log(`✓ Entry criada: "${title}" → ${entryId}`);
  }
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

discord.login(DISCORD_TOKEN);
