// Facções — DB-driven dossier page

// ============================================================
// Faction modal (create / edit)
// ============================================================
function FactionModal({ faction, onClose }) {
  const isEdit = !!faction;

  function slugify(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  const [form, setForm] = React.useState({
    id:         faction?.id         ?? '',
    name:       faction?.name       ?? '',
    alias:      faction?.alias      ?? '',
    stamp:      faction?.stamp      ?? '',
    stampClass: faction?.stampClass ?? '',
    summary:    faction?.summary    ?? '',
    sort_order: faction?.sort_order ?? 0,
  });
  const [rows, setRows] = React.useState(
    (faction?.rows || []).map(r => ({ ...r }))
  );
  const [busy, setBusy] = React.useState(false);
  const [err, setErr]   = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function addRow() { setRows(r => [...r, { k: '', v: '', redacted: false }]); }
  function removeRow(i) { setRows(r => r.filter((_, j) => j !== i)); }
  function updateRow(i, key, val) {
    setRows(r => r.map((row, j) => j === i ? { ...row, [key]: val } : row));
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const id = form.id || slugify(form.name);
      await window.DB.saveFaction({
        ...form,
        id,
        rows: rows.filter(r => r.k || r.v),
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
      await window.DB.deleteFaction(faction.id);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  const btnRemove = {
    background: 'transparent', border: '1px solid var(--wine)',
    color: 'var(--wine-bright)', borderRadius: 2, padding: '5px 9px',
    cursor: 'pointer', fontSize: 11, fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.1em', flexShrink: 0,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 620 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Arquivo · Dossiês</div>
          <h2 className="modal-title">{isEdit ? 'Editar Facção' : 'Nova Facção'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input
                className="modal-input" value={form.name} required autoFocus
                placeholder="Blackflame"
                onChange={e => { set('name', e.target.value); if (!form.id) set('id', slugify(e.target.value)); }}
              />
            </div>

            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id}
                  placeholder="gerado automaticamente"
                  onChange={e => set('id', e.target.value)} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Ordem</label>
                <input className="modal-input" type="number" value={form.sort_order}
                  onChange={e => set('sort_order', e.target.value)} placeholder="0" />
              </div>
            </div>

            <div className="modal-field">
              <label className="modal-label">Alias (subtítulo)</label>
              <input className="modal-input" value={form.alias}
                placeholder="A Mão Esquerda da Rainha"
                onChange={e => set('alias', e.target.value)} />
            </div>

            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Carimbo</label>
                <input className="modal-input" value={form.stamp}
                  placeholder="CONFIDENCIAL"
                  onChange={e => set('stamp', e.target.value)} />
              </div>
              <div className="modal-field">
                <label className="modal-label">Estilo do carimbo</label>
                <select className="modal-select" value={form.stampClass} onChange={e => set('stampClass', e.target.value)}>
                  <option value="">Padrão (vermelho)</option>
                  <option value="green">Verde (oficial)</option>
                </select>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--ink-line)', paddingTop: 16, marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <span className="modal-label">Linhas do dossiê</span>
                <button type="button" className="editor-add-btn" style={{ padding: '5px 14px', fontSize: 10 }} onClick={addRow}>+ Linha</button>
              </div>
              {rows.map((row, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto auto', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                  <input className="modal-input" value={row.k} onChange={e => updateRow(i, 'k', e.target.value)} placeholder="Chave" />
                  <input className="modal-input" value={row.v} onChange={e => updateRow(i, 'v', e.target.value)} placeholder="Valor" />
                  <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--foam-dim)', whiteSpace: 'nowrap', cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!row.redacted} onChange={e => updateRow(i, 'redacted', e.target.checked)} />
                    Redigido
                  </label>
                  <button type="button" style={btnRemove} onClick={() => removeRow(i)}>✕</button>
                </div>
              ))}
            </div>

            <div className="modal-field">
              <label className="modal-label">Resumo do dossiê</label>
              <textarea className="modal-textarea" rows={4} value={form.summary}
                onChange={e => set('summary', e.target.value)}
                placeholder="Descrição/intel sobre a facção..." />
            </div>

            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
            {isEdit && (
              <button type="button" className={`btn-delete${confirmDel ? ' confirm' : ''}`} disabled={busy} onClick={handleDelete}>
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
// Factions page
// ============================================================
function Factions({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const list = Object.values(Entities.factions || {})
    .filter(f => f && f.name)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  return (
    <div className="page" data-screen-label="10 Facções Secretas">
      <header className="page-header">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
          <div>
            <div className="page-eyebrow">Anexo do Conselho · Vol. VII · Acesso restrito</div>
            <h1 className="page-title">Facções</h1>
            <p className="page-lede">
              Nem todo poder se anuncia em bandeiras. Aqui se mantêm dossiês das
              organizações que operam nas brechas — algumas oficiais, outras
              heréticas, uma delas literalmente apagada do registro. A consulta
              é permitida; a transcrição, não.
            </p>
          </div>
          {isEditor && (
            <button className="editor-add-btn" style={{ flexShrink: 0, marginTop: 4 }} onClick={() => setModal('new')}>
              + Nova Facção
            </button>
          )}
        </div>
      </header>

      {list.length === 0 && (
        <p style={{ fontFamily: 'EB Garamond,serif', fontStyle: 'italic', color: 'var(--foam-dim)', textAlign: 'center', marginTop: 60 }}>
          Nenhum dossiê registrado ainda.
        </p>
      )}

      <div className="dossier-grid">
        {list.map(d => (
          <article key={d.id} className="dossier" style={{ position: 'relative' }}
            onClick={e => { if (e.target.closest('.editor-add-btn')) return; onNav('faction:' + d.id); }}>
            {isEditor && (
              <button
                className="editor-add-btn"
                style={{ position: 'absolute', top: 12, right: 12, padding: '4px 10px', fontSize: 9 }}
                onClick={e => { e.stopPropagation(); setModal(d); }}
              >
                Editar
              </button>
            )}
            {d.stamp && <div className={`dossier-stamp ${d.stampClass || ''}`}>{d.stamp}</div>}
            <div className="dossier-id">DOSSIÊ · {d.id.toUpperCase()}</div>
            <h3 className="dossier-name">{d.name}</h3>
            {d.alias && <p className="dossier-alias">{d.alias}</p>}

            {d.rows && d.rows.length > 0 && (
              <dl className="dossier-rows">
                {d.rows.map((r, i) => (
                  <div key={i} className="dossier-row">
                    <dt>{r.k}</dt>
                    <dd className={r.redacted ? 'redacted' : ''}>{r.v}</dd>
                  </div>
                ))}
              </dl>
            )}

            {d.summary && <p className="dossier-summary">{d.summary}</p>}
          </article>
        ))}
      </div>

      {modal && (
        <FactionModal
          faction={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

// ============================================================
// FactionDetail — dossier layout (igual a Personagens / NPCs)
// Depende de: npNorm, npSectionMatches, NpReport, NpGrid, e ícones
// definidos em npc-detail.jsx (carregado antes na index.html)
// ============================================================
function FactionDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal,  setEditModal]  = React.useState(false);
  const [openSet,    setOpenSet]    = React.useState(() => new Set([0]));
  const [query,      setQuery]      = React.useState('');
  const [tagFilter,  setTagFilter]  = React.useState(null);
  const [viewMode,   setViewMode]   = React.useState('list');
  const reportRefs = React.useRef({});

  const faction  = (Entities.factions || {})[id];
  const sections = faction ? (faction.sections || []) : [];
  const nq       = npNorm(query);

  const allTags = React.useMemo(
    () => Array.from(new Set(sections.flatMap(s => s.tags || []))),
    [sections]
  );
  const filtered = React.useMemo(
    () => sections.map((sec, i) => ({ sec, i, matches: npSectionMatches(sec, nq, tagFilter) })),
    [sections, nq, tagFilter]
  );
  const visibleFiltered = filtered.filter(f => f.matches);

  React.useEffect(() => {
    if (!nq) return;
    const matching = filtered.filter(f => f.matches).map(f => f.i);
    setOpenSet(prev => new Set([...prev, ...matching]));
  }, [nq]);

  if (!faction) {
    return (
      <div className="page">
        <button className="back-btn" onClick={() => onNav('factions')}>Voltar às Facções</button>
        <p className="page-lede" style={{ marginTop: 40, textAlign: 'center', fontStyle: 'italic' }}>
          Dossiê não encontrado.
        </p>
      </div>
    );
  }

  function toggleReport(idx) {
    setOpenSet(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx); else next.add(idx);
      return next;
    });
  }
  function expandAll()   { setOpenSet(new Set(sections.map((_, i) => i))); }
  function collapseAll() { setOpenSet(new Set()); }
  function handleGridSelect(idx) {
    setViewMode('list');
    setOpenSet(prev => new Set([...prev, idx]));
    requestAnimationFrame(() => {
      const el = reportRefs.current[idx];
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        el.classList.add('pulse');
        setTimeout(() => el.classList.remove('pulse'), 700);
      }
    });
  }

  return (
    <div className="article np-dossier" data-screen-label={'Facção · ' + faction.name}>

      {/* ── Esquerda: corpo do dossiê ─────────────────────────── */}
      <div className="parchment" style={{ minWidth: 0 }}>
        <div className="article-body np-body">

          <div className="np-topbar">
            <button className="back-btn" style={{ marginBottom: 0 }} onClick={() => onNav('factions')}>
              Voltar às Facções
            </button>
            {isEditor && (
              <button className="editor-add-btn" onClick={() => setEditModal(true)}>
                Editar Artigo
              </button>
            )}
          </div>

          <nav className="breadcrumb">
            <a onClick={() => onNav('home')}>Arquivo</a>
            <span className="sep">▸</span>
            <a onClick={() => onNav('factions')}>Facções</a>
            <span className="sep">▸</span>
            <span>{faction.name}</span>
          </nav>

          <div className="np-header">
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 6 }}>
              DOSSIÊ · {faction.id.toUpperCase()}
            </div>
            <h1 className="np-title">{faction.name}</h1>
            {faction.alias && <p className="np-subtitle">{faction.alias}</p>}
          </div>

          <div className="article-divider"><Sigil.Ornament /></div>

          {faction.hero && <p className="detail-hero">{faction.hero}</p>}

          {faction.placeholder && (
            <div className="placeholder-banner" style={{
              background: 'rgba(120,90,50,0.04)',
              border: '1px dashed var(--parchment-rule)',
              color: 'var(--parchment-text)',
            }}>
              <div className="placeholder-banner-eyebrow" style={{ color: 'var(--wine)' }}>Em compilação</div>
              <h3 style={{ color: 'var(--parchment-text)' }}>Esta entrada ainda está sendo transcrita</h3>
              <p style={{ color: 'var(--parchment-text-soft)' }}>
                O arquivista Cael reuniu o esqueleto desta entrada. Inteligência detalhada será acrescentada nas próximas sessões.
              </p>
            </div>
          )}

          {!faction.placeholder && sections.length > 0 && (
            <React.Fragment>
              <div className="np-toolbar">
                <div className="np-toolbar-search">
                  <NpSearchIcon />
                  <input
                    type="text"
                    placeholder="Buscar por texto ou tag…"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                  />
                  {query && (
                    <button className="np-toolbar-search-clear" onClick={() => setQuery('')}>Limpar</button>
                  )}
                </div>
                <button className="np-toolbar-btn" title="Expandir tudo" onClick={expandAll}><NpExpandIcon /></button>
                <button className="np-toolbar-btn" title="Recolher tudo" onClick={collapseAll}><NpCollapseIcon /></button>
                <div className="np-toolbar-divider" />
                <button className={'np-toolbar-btn' + (viewMode === 'list' ? ' active' : '')} title="Vista lista" onClick={() => setViewMode('list')}><NpListIcon /></button>
                <button className={'np-toolbar-btn' + (viewMode === 'grid' ? ' active' : '')} title="Vista grade" onClick={() => setViewMode('grid')}><NpGridIcon /></button>
              </div>

              {allTags.length > 0 && (
                <div className="np-tag-filter">
                  <span className="np-tag-filter-label">Filtrar:</span>
                  <button className={'np-tag-pill' + (!tagFilter ? ' active' : '')} onClick={() => setTagFilter(null)}>Tudo</button>
                  {allTags.map(t => (
                    <button key={t} className={'np-tag-pill' + (tagFilter === t ? ' active' : '')} onClick={() => setTagFilter(prev => prev === t ? null : t)}>{t}</button>
                  ))}
                </div>
              )}

              {visibleFiltered.length === 0 ? (
                <div className="np-empty"><strong>Nada encontrado</strong>Nenhuma seção corresponde à busca ou ao filtro ativo.</div>
              ) : viewMode === 'list' ? (
                <div className="np-reports">
                  {visibleFiltered.map(({ sec, i }) => (
                    <NpReport key={i} sec={sec} idx={i} isOpen={openSet.has(i)} query={query} onToggle={() => toggleReport(i)} reportRef={el => { reportRefs.current[i] = el; }} />
                  ))}
                </div>
              ) : (
                <NpGrid sections={visibleFiltered.map(f => f.sec)} onSelect={localIdx => handleGridSelect(visibleFiltered[localIdx].i)} />
              )}
            </React.Fragment>
          )}

          {!faction.placeholder && sections.length === 0 && (
            <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: 'var(--foam-dim)', textAlign: 'center', marginTop: 40 }}>
              {isEditor ? 'Nenhuma seção ainda — clique em "Editar Artigo" para adicionar.' : 'Nenhuma informação adicional registrada.'}
            </p>
          )}

        </div>
      </div>

      {/* ── Direita: infobox do dossiê ───────────────────────── */}
      <aside className="infobox-rail">
        <div className="infobox">
          <div className="infobox-head">
            <div className="infobox-portrait-wrap" style={{ position: 'relative' }}>
              <image-slot
                id={`faction-portrait-${faction.id}`}
                shape="rect"
                placeholder={`Imagem · ${faction.name}`}
                style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              ></image-slot>
              {faction.stamp && (
                <div className={`dossier-stamp ${faction.stampClass || ''}`}
                  style={{ position: 'absolute', top: 10, right: 8, fontSize: 10, padding: '2px 8px', letterSpacing: '0.2em' }}>
                  {faction.stamp}
                </div>
              )}
            </div>
            <h3 className="infobox-name">{faction.name}</h3>
            {faction.alias && <p className="infobox-sub">{faction.alias}</p>}
          </div>

          {faction.rows && faction.rows.length > 0 && (
            <dl className="infobox-rows">
              {faction.rows.map((r, i) => (
                <div key={i} className="infobox-row">
                  <dt>{r.k}</dt>
                  <dd className={r.redacted ? 'redacted' : ''}>{r.v}</dd>
                </div>
              ))}
            </dl>
          )}
        </div>

        {faction.related && faction.related.length > 0 && (
          <div className="related">
            <h4 className="related-title">Cf. Relacionados</h4>
            {faction.related.map(r => (
              <a key={r.title} className="related-link" onClick={() => onNav(r.target)}>
                <span className="related-link-tag">{r.tag}</span>
                <span className="related-link-title">{r.title}</span>
              </a>
            ))}
          </div>
        )}
      </aside>

      {editModal && (
        <ArticleEditor type="faction" entity={faction} onClose={() => setEditModal(false)} onDelete={() => onNav('factions')} />
      )}
    </div>
  );
}

window.Factions = Factions;
window.FactionDetail = FactionDetail;
