// Sessions — card grid + detail page

// ============================================================
// Session modal (create / edit)
// ============================================================
// Loot pode vir como string ou objeto ({ text } / { name }); no formulário vira uma linha por item.
function lootToText(loot) {
  return (loot ?? []).filter(Boolean)
    .map(l => typeof l === 'string' ? l : (l.text || l.name || JSON.stringify(l)))
    .join('\n');
}

function SessionModal({ session, onClose }) {
  const isEdit = !!session?._id;
  const [form, setForm] = React.useState({
    num: session?.num ?? '',
    title: session?.title ?? '',
    date: session?.date ?? '',
    dateShort: session?.dateShort ?? '',
    location: session?.location ?? '',
    locationDetail: session?.locationDetail ?? '',
    summary: session?.summary ?? '',
    cast: (session?.cast ?? []).join('\n'),
    places: (session?.places ?? []).join('\n'),
    narrative: (session?.narrative ?? []).join('\n\n'),
    keypoints: (session?.keypoints ?? []).map(k => (k.danger ? '!' : '') + k.text).join('\n'),
    duration: session?.duration ?? '',
    session_xp: session?.session_xp ?? '',
    loot: lootToText(session?.loot),
    next: session?.next ?? '',
    gmnote: session?.gmnote ?? '',
    _id: session?._id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function parseKeypoints(text) {
    return text.split('\n').filter(Boolean).map(line => ({
      danger: line.startsWith('!'),
      text: line.replace(/^!/, '').trim(),
    }));
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveSession({
        ...form,
        cast: form.cast.split('\n').map(s => s.trim()).filter(Boolean),
        places: form.places.split('\n').map(s => s.trim()).filter(Boolean),
        narrative: form.narrative.split('\n\n').map(s => s.trim()).filter(Boolean),
        keypoints: parseKeypoints(form.keypoints),
        // Se o loot não foi mexido, mantém o array original (preserva itens em formato de objeto).
        loot: form.loot === lootToText(session?.loot)
          ? (session?.loot ?? [])
          : form.loot.split('\n').map(s => s.trim()).filter(Boolean),
      });
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setBusy(true);
    try {
      await window.DB.deleteSession(form._id);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 680 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Mesa · Diário de Sessões</div>
          <h2 className="modal-title">{isEdit ? 'Editar Sessão' : 'Nova Sessão'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Número</label>
              <input className="modal-input" type="number" value={form.num} onChange={e => set('num', e.target.value)} required placeholder="24" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Título</label>
              <input className="modal-input" value={form.title} onChange={e => set('title', e.target.value)} required placeholder="Nome da sessão" />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Data completa</label>
                <input className="modal-input" value={form.date} onChange={e => set('date', e.target.value)} placeholder="21 do Segundo Mês, 1281" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Data curta</label>
                <input className="modal-input" value={form.dateShort} onChange={e => set('dateShort', e.target.value)} placeholder="21 · MAI · 1281" />
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Local</label>
              <input className="modal-input" value={form.location} onChange={e => set('location', e.target.value)} placeholder="Nome do local" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Detalhe do local</label>
              <input className="modal-input" value={form.locationDetail} onChange={e => set('locationDetail', e.target.value)} placeholder="Descrição geográfica" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Resumo</label>
              <textarea className="modal-textarea" rows={3} value={form.summary} onChange={e => set('summary', e.target.value)} placeholder="Resumo de uma linha da sessão" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Elenco</label>
              <textarea className="modal-textarea" rows={3} value={form.cast} onChange={e => set('cast', e.target.value)} placeholder={"Käthryn\nHalric\nTannis (NPC)"} />
              <span className="modal-hint">Um nome por linha. NPCs: adicione (NPC) ao final.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Lugares</label>
              <textarea className="modal-textarea" rows={2} value={form.places} onChange={e => set('places', e.target.value)} placeholder={"Pântanos de Velheath\nEstalagem do Junco"} />
              <span className="modal-hint">Um lugar por linha.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Narrativa</label>
              <textarea className="modal-textarea" rows={5} value={form.narrative} onChange={e => set('narrative', e.target.value)} placeholder="Parágrafo de narração..." />
              <span className="modal-hint">Separe parágrafos com uma linha em branco.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Pontos-chave</label>
              <textarea className="modal-textarea" rows={4} value={form.keypoints} onChange={e => set('keypoints', e.target.value)} placeholder={"Käthryn jurou silêncio\n!Tannis: corrupção grau II"} />
              <span className="modal-hint">Um por linha. Prefixe com ! para marcar como perigo.</span>
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Duração</label>
                <input className="modal-input" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="4h30" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Experiência</label>
                <input className="modal-input" value={form.session_xp} onChange={e => set('session_xp', e.target.value)} placeholder="XP ganho na sessão" />
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Espólio</label>
              <textarea className="modal-textarea" rows={3} value={form.loot} onChange={e => set('loot', e.target.value)} placeholder={"Adaga de prata\n120 peças de ouro"} />
              <span className="modal-hint">Um item por linha.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Próxima sessão</label>
              <textarea className="modal-textarea" rows={2} value={form.next} onChange={e => set('next', e.target.value)} placeholder="Gancho para a próxima sessão" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Nota do mestre</label>
              <textarea className="modal-textarea" rows={4} value={form.gmnote} onChange={e => set('gmnote', e.target.value)} placeholder="Visível apenas para editores" />
              <span className="modal-hint">Só aparece para quem é editor.</span>
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar Sessão'}</button>
            {isEdit && (
              <button type="button" className={`btn-delete ${confirmDel ? 'confirm' : ''}`} onClick={handleDelete} disabled={busy}>
                {confirmDel ? 'Confirmar exclusão' : 'Apagar'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================
// Crônicas no tema vitral: diário (lista) e fólio da sessão
// ============================================================

// "Diego (PC)", "Mark (NPC)", "Lawrence Cainhurst" → { name, npc, char }
function vsCastEntry(raw) {
  const npc = /\(\s*npc/i.test(raw);
  const name = String(raw).replace(/\s*\(.*\)\s*$/, '').trim();
  const n = name.toLowerCase();
  const char = Object.values(Entities.characters || {}).find(c => c && c.name && c.tag !== 'ARTICLE' &&
    (c.name.toLowerCase() === n || c.name.toLowerCase().split(/\s+/)[0] === n.split(/\s+/)[0])) || null;
  return { raw, name, npc, char };
}

const vsPad = n => String(n).padStart(2, '0');

function VsSoul({ c, onNav }) {
  const url = useVtSlotUrl('char-portrait-' + c.id);
  const target = (String(c.tag || '').toUpperCase() === 'PC' ? 'character:' : 'npc:') + c.id;
  return (
    <button className="vh-soul" onClick={e => { e.stopPropagation(); onNav(target); }} title={c.name}>
      <VtGothicWindow frame={VT_FRAMES[0]} className="vh-soul-window" sizes="80px">
        <VtFramedImage url={url} framing={vtFraming(c)} placeholder="" />
      </VtGothicWindow>
      <span className="vh-soul-name">{c.name.split(' ')[0]}</span>
    </button>
  );
}

// Elenco: quem tem página vira mini-janela; o resto vira plaquinha de vidro
function VsCast({ cast, onNav, max = 99 }) {
  const entries = (cast || []).map(vsCastEntry);
  const souls = entries.filter(e => e.char).slice(0, max);
  const others = entries.filter(e => !e.char);
  return (
    <div className="vs-cast">
      {souls.length > 0 && <div className="vh-souls">{souls.map(e => <VsSoul key={e.char.id} c={e.char} onNav={onNav} />)}</div>}
      {others.length > 0 && (
        <div className="vs-chips">
          {others.map(e => <span key={e.raw} className={'vs-chip' + (e.npc ? ' vs-chip--npc' : '')}>{e.npc && <em>NPC</em>}{e.name}</span>)}
        </div>
      )}
    </div>
  );
}

// ============================================================
// Diário de sessões
// ============================================================
function Sessions({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const list = (Data.sessionIds || []).map(id => Entities.sessions[id]).filter(Boolean)
    .sort((a, b) => (b.num || 0) - (a.num || 0));
  const [latest, ...older] = list;

  return (
    <div className="vt vs vs-list" data-screen-label="13 Diário de Sessões">
      <section className="vt-pantheon-head vs-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Crônicas · O diário da mesa</div>
          <h1 className="vt-h1">Diário de Sessões</h1>
          <div className="vt-epithet">Cada sessão, um fólio</div>
          <p className="vt-pantheon-lede">
            O que aconteceu à mesa, transcrito pelo escriba logo após o jogo: quem estava lá,
            por onde passaram e o que ficou em aberto. Abra um fólio para ler a crônica inteira.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal('new')}>+ Nova sessão</button>
          </div>
        )}
      </section>

      {list.length === 0 && <p className="vt-pantheon-empty">Nenhuma sessão registrada ainda.</p>}

      {latest && (
        <section className="vh-section vs-latest-wrap">
          <div className="vt-label vs-kicker">A mais recente</div>
          <article className="vh-last vs-latest" onClick={() => onNav('session:' + latest.num)}>
            <div className="vh-last-num">
              <span className="vh-last-n">{vsPad(latest.num)}</span>
              <span className="vh-last-k">Sessão</span>
            </div>
            <div className="vh-last-body">
              <div className="vh-last-meta">{[latest.dateShort, latest.location].filter(Boolean).join(' · ')}</div>
              <h3 className="vh-last-title">{latest.title}</h3>
              {latest.summary && <p className="vh-last-summary">{latest.summary}</p>}
              <span className="vh-last-go">Abrir o fólio →</span>
            </div>
            <div className="vh-last-cast" onClick={e => e.stopPropagation()}>
              <div className="vh-mini-label">Estavam lá</div>
              <VsCast cast={latest.cast} onNav={onNav} max={6} />
            </div>
            {isEditor && <button className="vt-btn vs-edit" onClick={e => { e.stopPropagation(); setModal(latest); }}>Editar</button>}
          </article>
        </section>
      )}

      {older.length > 0 && (
        <section className="vh-section">
          <header className="vh-head">
            <span className="vh-head-num">✠</span>
            <h2 className="vh-head-title">Fólios anteriores</h2>
          </header>
          <ol className="vs-folios">
            {older.map(s => (
              <li key={s.num} className="vs-folio" onClick={() => onNav('session:' + s.num)}>
                <span className="vs-folio-num">{vsPad(s.num)}</span>
                <div className="vs-folio-body">
                  <div className="vh-last-meta">{[s.dateShort, s.location].filter(Boolean).join(' · ')}</div>
                  <h3 className="vs-folio-title">{s.title}</h3>
                  {s.summary && <p className="vs-folio-summary">{s.summary}</p>}
                  {(s.places || []).length > 0 && (
                    <div className="vs-folio-places">{s.places.slice(0, 4).map(p => <span key={p}>{p.replace(/\s*\(.*\)$/, '')}</span>)}</div>
                  )}
                </div>
                <div className="vs-folio-side">
                  <span className="vs-folio-count">{(s.cast || []).length} presentes</span>
                  <span className="vh-last-go">Abrir →</span>
                  {isEditor && <button className="vt-btn vs-edit" onClick={e => { e.stopPropagation(); setModal(s); }}>Editar</button>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="vt-pantheon-foot">
        “O que não se escreve, a mesa esquece. O que se escreve, o mundo lembra.”
        <div className="vt-quote-src">— O escriba da mesa</div>
      </footer>

      {modal && <SessionModal session={modal === 'new' ? null : modal} onClose={() => setModal(null)} />}
    </div>
  );
}

// ============================================================
// Fólio da sessão
// ============================================================
function SessionDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(false);

  const s = Entities.sessions[id];
  if (!s) {
    return (
      <div className="vt vs">
        <p className="vt-pantheon-empty">Sessão não encontrada. <a onClick={() => onNav('sessions')}>Voltar ao diário</a></p>
      </div>
    );
  }

  const nums = (Data.sessionIds || []).map(Number).filter(n => !isNaN(n)).sort((a, b) => a - b);
  const idx = nums.indexOf(Number(s.num));
  const prev = idx > 0 ? Entities.sessions[String(nums[idx - 1])] : null;
  const next = idx >= 0 && idx < nums.length - 1 ? Entities.sessions[String(nums[idx + 1])] : null;

  const attrs = [
    ['Data', s.date && /^\d{4}-\d{2}-\d{2}$/.test(s.date) ? (s.dateShort || s.date) : (s.date || s.dateShort)],
    ['Local', s.location],
    ['Duração', s.duration],
    ['Experiência', s.session_xp],
  ].filter(([, v]) => v || v === 0);
  const keypoints = (s.keypoints || []).filter(k => k && k.text);
  const loot = (s.loot || []).filter(Boolean);

  return (
    <div className="vt vt-article vs vs-detail" data-screen-label={'Sessão ' + s.num}>
      <div className="vt-topbar">
        <nav className="vt-breadcrumb">
          <a onClick={() => onNav('sessions')}>Diário de Sessões</a>
          <span className="vt-bc-sep" aria-hidden="true" />
          <span className="vt-breadcrumb-current">Sessão {vsPad(s.num)}</span>
        </nav>
        <div className="vt-topbar-actions">
          {isEditor && <button className="vt-btn" onClick={() => setModal(true)}>Editar sessão</button>}
        </div>
      </div>

      <section className="vs-hero">
        <div className="vs-seal">
          <span className="vs-seal-n">{vsPad(s.num)}</span>
          <span className="vs-seal-k">Sessão</span>
        </div>
        <div className="va-head">
          <div className="vt-label">Crônicas · {s.dateShort || 'Fólio da mesa'}</div>
          <h1 className="vt-h1">{s.title}</h1>
          {s.location && <div className="vt-epithet">{s.location}</div>}
          {s.locationDetail && <p className="vs-where">{s.locationDetail}</p>}
          <VtDivider />
          {s.summary && <blockquote className="va-epigraph">“{s.summary}”</blockquote>}
          {attrs.length > 0 && (
            <dl className="va-attrs">
              {attrs.map(([k, v]) => <div key={k} className="va-attr"><dt>{k}</dt><dd>{v}</dd></div>)}
            </dl>
          )}
        </div>
      </section>

      {((s.cast || []).length > 0 || (s.places || []).length > 0) && (
        <section className="va-section vs-who">
          {(s.cast || []).length > 0 && (
            <div className="vs-who-col">
              <h2 className="va-h2">Estavam lá</h2>
              <VsCast cast={s.cast} onNav={onNav} />
            </div>
          )}
          {(s.places || []).length > 0 && (
            <div className="vs-who-col">
              <h2 className="va-h2">Por onde passaram</h2>
              <ul className="vs-places">{s.places.map(p => <li key={p}>{p}</li>)}</ul>
            </div>
          )}
        </section>
      )}

      {(s.narrative || []).length > 0 && (
        <section className="va-body">
          <article className="va-prose">
            <h2 className="va-h2">A crônica</h2>
            {s.narrative.map((p, i) => <p key={i} className={i === 0 ? 'va-first' : ''}>{p}</p>)}
          </article>
        </section>
      )}

      {keypoints.length > 0 && (
        <section className="va-dogmas">
          <div className="va-tablet vs-tablet">
            <div className="vt-label va-tablet-label">Pontos-chave</div>
            <ol>
              {keypoints.map((k, i) => (
                <li key={i} className={k.danger ? 'is-danger' : ''}>
                  <span className="va-roman">{vtRoman(i + 1)}</span>
                  <span className="vs-point">{k.text}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {(loot.length > 0 || s.next || s.gmnote) && (
        <section className="va-section vs-extra">
          {loot.length > 0 && (
            <div className="vs-extra-box">
              <div className="vt-label">Espólio</div>
              <ul>{loot.map((l, i) => <li key={i}>{typeof l === 'string' ? l : (l.text || l.name || JSON.stringify(l))}</li>)}</ul>
            </div>
          )}
          {s.next && <div className="vs-extra-box"><div className="vt-label">Próxima sessão</div><p>{s.next}</p></div>}
          {s.gmnote && isEditor && <div className="vs-extra-box vs-extra-box--gm"><div className="vt-label">Nota do mestre</div><p>{s.gmnote}</p></div>}
        </section>
      )}

      <nav className="vs-pager">
        {prev
          ? <a className="vs-pager-link" onClick={() => onNav('session:' + prev.num)}><span>← Sessão {vsPad(prev.num)}</span><em>{prev.title}</em></a>
          : <span />}
        <a className="vs-pager-mid" onClick={() => onNav('sessions')}>✠ Diário</a>
        {next
          ? <a className="vs-pager-link vs-pager-link--next" onClick={() => onNav('session:' + next.num)}><span>Sessão {vsPad(next.num)} →</span><em>{next.title}</em></a>
          : <span />}
      </nav>

      {modal && <SessionModal session={s} onClose={() => setModal(false)} />}
    </div>
  );
}

window.Sessions = Sessions;
window.SessionDetail = SessionDetail;
