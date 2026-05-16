// Sessions — card grid + detail page

// ============================================================
// Session modal (create / edit)
// ============================================================
function SessionModal({ session, onClose }) {
  const isEdit = !!session?._id;
  const [form, setForm] = React.useState({
    num: session?.num ?? '',
    title: session?.title ?? '',
    date: session?.date ?? '',
    dateShort: session?.dateShort ?? '',
    location: session?.location ?? '',
    locationDetail: session?.locationDetail ?? '',
    duration: session?.duration ?? '',
    session_xp: session?.session_xp ?? '',
    summary: session?.summary ?? '',
    next: session?.next ?? '',
    cast: (session?.cast ?? []).join('\n'),
    places: (session?.places ?? []).join('\n'),
    narrative: (session?.narrative ?? []).join('\n\n'),
    keypoints: (session?.keypoints ?? []).map(k => (k.danger ? '!' : '') + k.text).join('\n'),
    loot: (session?.loot ?? []).join('\n'),
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
        loot: form.loot.split('\n').map(s => s.trim()).filter(Boolean),
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
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Número</label>
                <input className="modal-input" type="number" value={form.num} onChange={e => set('num', e.target.value)} required placeholder="24" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Duração</label>
                <input className="modal-input" value={form.duration} onChange={e => set('duration', e.target.value)} placeholder="4h 00min" />
              </div>
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
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">XP da sessão</label>
                <input className="modal-input" value={form.session_xp} onChange={e => set('session_xp', e.target.value)} placeholder="1.500 XP" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Próxima sessão</label>
                <input className="modal-input" value={form.next} onChange={e => set('next', e.target.value)} placeholder="Próxima sessão · 28 · MAI" />
              </div>
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
            <div className="modal-field">
              <label className="modal-label">Espólio</label>
              <textarea className="modal-textarea" rows={2} value={form.loot} onChange={e => set('loot', e.target.value)} placeholder="1× anel de prata sem brasão" />
              <span className="modal-hint">Um item por linha.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Nota do Mestre</label>
              <textarea className="modal-textarea" rows={2} value={form.gmnote} onChange={e => set('gmnote', e.target.value)} placeholder="Nota interna" />
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
// Sessions list
// ============================================================
function Sessions({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const sessionIds = Data.sessionIds || ['23', '22', '21'];

  return (
    <div className="page" data-screen-label="13 Diário de Sessões">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Mesa · Vol. VIII · Diário ativo</div>
            <h1 className="page-title">Diário de Sessões</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Nova Sessão
            </button>
          )}
        </div>
        <p className="page-lede">
          Cada sessão se torna um fólio. Os cards abaixo mostram o resumo
          rápido — pessoas, lugares, o que aconteceu em uma respiração. Clique
          em qualquer um para abrir o diário completo da sessão, transcrito
          pelo escriba da mesa logo após o jogo.
        </p>
      </header>

      <div className="session-card-grid">
        {sessionIds.map((id, i) => {
          const s = Entities.sessions[id];
          if (!s) return null;
          const peopleChips = s.cast.slice(0, 5);
          const placeChips = s.places.slice(0, 4);
          return (
            <article
              key={id}
              className={`session-card ${i === 0 ? 'latest' : ''}`}
              onClick={() => onNav('session:' + id)}
            >
              <div className="session-card-head">
                <div>
                  <div className="session-card-num">{String(s.num).padStart(2,'0')}</div>
                  <div className="session-card-num-label">Sessão</div>
                </div>
                <div>
                  <div className="session-card-date">{s.dateShort}</div>
                  {i === 0 && <div className="session-card-tag">Mais recente</div>}
                </div>
              </div>

              <h3 className="session-card-title">{s.title}</h3>
              <p className="session-card-location">↳ {s.location}</p>
              <p className="session-card-summary">{s.summary}</p>

              <div className="session-card-meta">
                <div className="session-card-meta-row">
                  <span className="session-card-meta-label">Pessoas</span>
                  <span className="session-card-meta-value">
                    {peopleChips.map(p => (
                      <span key={p} className={`chip-mini ${p.includes('(NPC') ? 'npc' : ''}`}>{p.replace(/ \(NPC.*\)/, '')}</span>
                    ))}
                  </span>
                </div>
                <div className="session-card-meta-row">
                  <span className="session-card-meta-label">Lugares</span>
                  <span className="session-card-meta-value">
                    {placeChips.map(p => (
                      <span key={p} className="chip-mini place">{p}</span>
                    ))}
                  </span>
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:16 }}>
                <div className="session-card-cta">Abrir diário completo →</div>
                {isEditor && (
                  <button
                    className="editor-del-btn"
                    onClick={e => { e.stopPropagation(); setModal(s); }}
                  >
                    Editar
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {modal && (
        <SessionModal
          session={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// Session detail (full journal page)
// ============================================================
function SessionDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(false);

  const s = Entities.sessions[id];
  if (!s) {
    return (
      <div className="page" data-screen-label={"Sessão " + id}>
        <button className="back-btn" onClick={() => onNav('sessions')}>Voltar ao diário</button>
        <h1 className="page-title">Sessão não encontrada</h1>
      </div>
    );
  }

  return (
    <div className="session-detail" data-screen-label={"Sessão " + s.num}>
      <div style={{ display:'flex', alignItems:'center', marginBottom:20 }}>
        <button className="back-btn" onClick={() => onNav('sessions')} style={{ marginBottom:0 }}>
          Voltar ao diário
        </button>
        {isEditor && (
          <button className="editor-add-btn" onClick={() => setModal(true)}>
            Editar Sessão
          </button>
        )}
      </div>

      <header className="session-detail-head">
        <div className="session-detail-num">{String(s.num).padStart(2,'0')}</div>
        <div className="session-detail-num-label">Sessão · {s.dateShort}</div>
        <h1 className="session-detail-title">{s.title}</h1>
        <p className="session-detail-location">↳ {s.location}</p>
        <p className="session-detail-location-sub">{s.locationDetail}</p>

        <div className="session-meta-strip">
          <div><span className="label">Data</span><span className="value">{s.date}</span></div>
          <div><span className="label">Duração</span><span className="value">{s.duration}</span></div>
          <div><span className="label">Experiência</span><span className="value">{s.session_xp}</span></div>
          <div><span className="label">Próxima</span><span className="value" style={{fontSize:12,letterSpacing:'0.04em'}}>{s.next}</span></div>
        </div>
      </header>

      <section className="session-detail-block">
        <h2>Resumo</h2>
        <p style={{fontStyle:'italic', color:'var(--foam)', fontSize:18}}>{s.summary}</p>
      </section>

      <section className="session-detail-block">
        <h2>Elenco da Sessão</h2>
        <div className="session-detail-chips">
          {s.cast.map(c => {
            const isNpc = c.includes('NPC');
            const name = c.replace(/ \((NPC[^)]*)\)/, '');
            return (
              <span key={c} className={`chip-mini ${isNpc ? 'npc' : ''}`} style={{fontSize:11, padding:'5px 10px'}}>
                {isNpc && <span style={{opacity:0.6, marginRight:4}}>NPC ·</span>}
                {name}
              </span>
            );
          })}
        </div>
      </section>

      <section className="session-detail-block">
        <h2>Lugares Visitados</h2>
        <div className="session-detail-chips">
          {s.places.map(p => (
            <span key={p} className="chip-mini place" style={{fontSize:11, padding:'5px 10px'}}>{p}</span>
          ))}
        </div>
      </section>

      <section className="session-detail-block">
        <h2>Narrativa</h2>
        {s.narrative.map((p, i) => <p key={i}>{p}</p>)}
      </section>

      <section className="session-detail-block">
        <h2>Pontos-Chave</h2>
        <ul className="session-keylist">
          {s.keypoints.map((k, i) => (
            <li key={i} className={k.danger ? 'danger' : ''}>{k.text}</li>
          ))}
        </ul>
      </section>

      {s.loot && s.loot.length > 0 && s.loot[0] !== "—" && (
        <section className="session-detail-block">
          <h2>Espólio & Descobertas</h2>
          <ul className="session-loot">
            {s.loot.map((l, i) => <li key={i}>{l}</li>)}
          </ul>
        </section>
      )}

      {s.gmnote && (
        <section className="session-detail-block">
          <div className="gm-note">{s.gmnote}</div>
        </section>
      )}

      {modal && <SessionModal session={s} onClose={() => setModal(false)} />}
    </div>
  );
}

window.Sessions = Sessions;
window.SessionDetail = SessionDetail;
