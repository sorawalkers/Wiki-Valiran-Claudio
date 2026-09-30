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
    relation:   faction ? vtFactionRelation(faction) : 'neutra',
  });
  // a relação é guardada como a linha "Relação" da ficha (editada pelo seletor acima, não na lista)
  const [rows, setRows] = React.useState(
    (faction?.rows || []).filter(r => !/^rela[cç][aã]o$/i.test(r.k || '')).map(r => ({ ...r }))
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
      const { relation, ...fields } = form;
      const REL_LABEL = { aliada: 'Aliada', neutra: 'Neutra', inimiga: 'Inimiga' };
      await window.DB.saveFaction({
        // mantém o que este formulário não edita (texto, seções, ligações) — antes era apagado ao salvar
        ...(faction || {}),
        ...fields,
        id,
        rows: [{ k: 'Relação', v: REL_LABEL[relation] || 'Neutra' }, ...rows.filter(r => r.k || r.v)],
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
    background: 'transparent', border: '1px solid rgba(168,53,43,.6)',
    color: '#e59a8c', borderRadius: 2, padding: '5px 9px',
    cursor: 'pointer', fontSize: 11, fontFamily: "'Cinzel', serif",
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
                <label className="modal-label">Relação com o grupo</label>
                <select className="modal-select" value={form.relation} onChange={e => set('relation', e.target.value)}>
                  <option value="aliada">Aliada (estandarte azul)</option>
                  <option value="neutra">Neutra (estandarte cinza)</option>
                  <option value="inimiga">Inimiga (estandarte preto)</option>
                </select>
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
                <button type="button" className="editor-add-btn" style={{ padding: '5px 14px', fontSize: 10 }} onClick={addRow}>Linha</button>
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
    <div className="vt vt-pantheon vf" data-screen-label="10 Facções">
      <section className="vt-pantheon-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Casas · Anexo do Conselho</div>
          <h1 className="vt-h1">Casas e Facções</h1>
          <div className="vt-epithet">Nem todo poder se anuncia em bandeiras</div>
          <p className="vt-pantheon-lede">
            Dossiês das organizações que operam nas brechas: algumas oficiais, outras heréticas,
            uma delas literalmente apagada do registro. A consulta é permitida; a transcrição, não.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => setModal('new')}>+ Nova facção</button>
          </div>
        )}
      </section>

      {list.length === 0 && <p className="vt-pantheon-empty">Nenhum dossiê registrado ainda.</p>}

      <div className="vt-gallery vf-gallery">
        {list.map(d => (
          <VitralFactionCard key={d.id} f={d} isEditor={isEditor}
            onClick={() => onNav('faction:' + d.id)} onEdit={() => setModal(d)} />
        ))}
      </div>

      <footer className="vt-pantheon-foot">
        “Quem não tem estandarte ainda assim tem senhor.”
        <div className="vt-quote-src">— Anotação à margem do dossiê Blackflame</div>
      </footer>

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
// FactionDetail — artigo de vitral (VitralArticle kind="faction")
// ============================================================
function FactionDetail({ id, onNav }) {
  const { isEditor } = useAuth();
  const [editModal, setEditModal] = React.useState(false);
  const faction = (Entities.factions || {})[id];

  if (!faction) {
    return (
      <div className="vt vs"><p className="vt-pantheon-empty">Dossiê não encontrado. <a onClick={() => onNav('factions')}>Voltar às Casas</a></p></div>
    );
  }

  // artigo no tema vitral (mesmo layout dos personagens; carimbo no lugar do selo de papel)
  const c = {
    ...faction,
    name: (faction.name || '').trim(),
    infobox: { rows: faction.rows || [], retrato: faction.infobox?.retrato || VT_FACTION_FRAMING },
  };

  return (
    <React.Fragment>
      <VitralArticle c={c} kind="faction" onNav={onNav} backTo="factions" backLabel="Casas"
        isEditor={isEditor} onEdit={() => setEditModal(true)} />
      {editModal && (
        <ArticleEditor type="faction" entity={faction} onClose={() => setEditModal(false)} onDelete={() => onNav('factions')} />
      )}
    </React.Fragment>
  );
}

window.Factions = Factions;

window.FactionDetail = FactionDetail;
