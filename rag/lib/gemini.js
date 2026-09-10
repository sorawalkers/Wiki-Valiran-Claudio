// Cliente mínimo para a Gemini API — só o que o indexador e o script
// de teste de busca precisam (embeddings). A geração de resposta do
// chatbot (Gemini Flash) vive na Edge Function (Deno), não aqui.

const EMBEDDING_MODEL = 'text-embedding-004';
const EMBEDDING_DIM = 768;
const API_BASE = 'https://generativelanguage.googleapis.com/v1beta';

// A Gemini API aceita até 100 requests por chamada de batchEmbedContents.
// Usamos um lote bem menor para não estourar o rate limit do tier free
// (15 RPM em muitas contas) — ver rag/README.md.
const BATCH_SIZE = 10;

function chunkArray(arr, size) {
  const out = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

/**
 * @param {string[]} texts
 * @param {string} apiKey
 * @returns {Promise<number[][]>} um vetor de 768 dimensões por texto, na mesma ordem
 */
async function embedTexts(texts, apiKey) {
  if (!apiKey) throw new Error('GEMINI_API_KEY ausente.');
  const results = new Array(texts.length);
  const batches = chunkArray(texts.map((text, i) => ({ text, i })), BATCH_SIZE);

  for (const batch of batches) {
    const url = `${API_BASE}/models/${EMBEDDING_MODEL}:batchEmbedContents?key=${apiKey}`;
    const body = {
      requests: batch.map(({ text }) => ({
        model: `models/${EMBEDDING_MODEL}`,
        content: { parts: [{ text }] },
        outputDimensionality: EMBEDDING_DIM,
      })),
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`Gemini embedContent falhou (${res.status}): ${errText}`);
    }

    const data = await res.json();
    const embeddings = data.embeddings || [];
    if (embeddings.length !== batch.length) {
      throw new Error(
        `Gemini retornou ${embeddings.length} embeddings para um lote de ${batch.length}.`
      );
    }
    batch.forEach(({ i }, idx) => {
      results[i] = embeddings[idx].values;
    });

    // Pequena pausa entre lotes — gentileza com o rate limit do tier free.
    await new Promise(r => setTimeout(r, 300));
  }

  return results;
}

/** Atalho para embedar um único texto (usado pelo script de teste de busca). */
async function embedText(text, apiKey) {
  const [vec] = await embedTexts([text], apiKey);
  return vec;
}

module.exports = { embedTexts, embedText, EMBEDDING_MODEL, EMBEDDING_DIM };
