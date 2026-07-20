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
// FactionDetail — página individual de uma facção
// ============================================================
function FactionDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(false);
  const [imgSrc, setImgSrc] = React.useState(null);

  const faction = (Entities.factions || {})[id];

  const slotId = faction ? `faction-img-${faction.id}` : null;

  React.useEffect(() => {
    if (!slotId) return;
    const check = () => {
      const slot = window._imageSlotGet && window._imageSlotGet(slotId);
      if (slot && slot.u) { setImgSrc(slot.u); return true; }
      return false;
    };
    if (check()) return;
    let attempts = 0;
    const iv = setInterval(() => {
      if (check() || ++attempts > 25) clearInterval(iv);
    }, 200);
    return () => clearInterval(iv);
  }, [slotId]);

  if (!faction) {
    return (
      <div style={{ padding: '80px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'EB Garamond, serif', fontStyle: 'italic', color: 'var(--foam-dim)' }}>
          Dossiê não encontrado.
        </p>
        <button onClick={() => onNav('factions')} style={{
          marginTop: 24, padding: '10px 20px', background: 'transparent',
          color: 'var(--gold-bright)', border: '1px solid var(--gold-dim)',
          fontFamily: 'Cinzel, serif', fontSize: 11, letterSpacing: '0.2em',
          textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2,
        }}>← Facções</button>
      </div>
    );
  }

  const paragraphs = (faction.summary || '').split(/\n\n+/).map(s => s.trim()).filter(Boolean);

  return (
    <div className="page faction-detail" data-screen-label="Facção">
      <div className="page-breadcrumb" style={{
        fontFamily: 'JetBrains Mono, monospace', fontSize: 10, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--foam-dim)', marginBottom: 4,
        display: 'flex', gap: 8, alignItems: 'center',
      }}>
        <a style={{ color: 'var(--gold)', cursor: 'pointer' }} onClick={() => onNav('factions')}>Facções</a>
        <span>›</span>
        <span>{faction.name}</span>
      </div>

      <div className="faction-detail-header">
        {faction.stamp && (
          <div className={`faction-detail-stamp ${faction.stampClass || ''}`}>{faction.stamp}</div>
        )}
        <div className="faction-detail-id">DOSSIÊ · {faction.id.toUpperCase()}</div>
        <h1 className="faction-detail-title">{faction.name}</h1>
        {faction.alias && <p className="faction-detail-alias">{faction.alias}</p>}
        {isEditor && (
          <button className="editor-add-btn" style={{ position: 'absolute', bottom: 24, right: 0, padding: '5px 14px', fontSize: 10 }}
            onClick={() => setModal(true)}>
            Editar
          </button>
        )}
      </div>

      {/* Imagem / slot de upload */}
      <div className="faction-detail-img-slot">
        {imgSrc
          ? <img src={imgSrc} alt={faction.name} />
          : isEditor && <image-slot id={slotId} shape="rect" fit="contain" placeholder="Arraste imagem da facção"></image-slot>
        }
      </div>

      {faction.rows && faction.rows.length > 0 && (
        <dl className="faction-detail-rows">
          {faction.rows.map((r, i) => (
            <div key={i} className="faction-detail-row">
              <dt>{r.k}</dt>
              <dd className={r.redacted ? 'redacted' : ''}>{r.v}</dd>
            </div>
          ))}
        </dl>
      )}

      {paragraphs.length > 0 && (
        <div className="faction-detail-body">
          {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
        </div>
      )}

      {modal && (
        <FactionModal faction={faction} onClose={() => setModal(false)} />
      )}
    </div>
  );
}

window.Factions = Factions;
window.FactionDetail = FactionDetail;
