// Pessoas Importantes — NPC gallery

// ============================================================
// NPC modal (create / edit) — reuses characters table
// ============================================================
function NpcModal({ character, onClose }) {
  const isEdit = !!character;
  const TAG_OPTIONS = ['NPC', 'ALIADO', 'INIMIGO'];
  const TAG_CLASS = { NPC: 'npc', ALIADO: 'ally', INIMIGO: 'foe' };

  const [form, setForm] = React.useState({
    id:          character?.id          ?? '',
    name:        character?.name        ?? '',
    role:        character?.role        ?? '',
    tag:         character?.tag         ?? 'NPC',
    hero:        character?.hero        ?? '',
    placeholder: character?.placeholder ?? true,
    _id:         character?.id,
  });
  const [busy, setBusy]             = React.useState(false);
  const [err, setErr]               = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function slugify(name) {
    return name.toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      const id = form.id || slugify(form.name);
      await window.DB.saveCharacter({
        ...form,
        id,
        tagClass: TAG_CLASS[form.tag] || 'npc',
        infobox:  character?.infobox  || { rows: [] },
        sections: character?.sections || [],
        related:  character?.related  || [],
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
      await window.DB.deleteCharacter(form._id);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 560 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Dramatis Personae · Pessoas Importantes (NPC)</div>
          <h2 className="modal-title">{isEdit ? 'Editar Pessoa' : 'Nova Pessoa Importante'}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field">
              <label className="modal-label">Nome</label>
              <input className="modal-input" value={form.name} onChange={e => set('name', e.target.value)} required placeholder="Nome do personagem" autoFocus />
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">ID (slug)</label>
                <input className="modal-input" value={form.id} onChange={e => set('id', e.target.value)} placeholder="gerado automaticamente" />
                <span className="modal-hint">Deixe em branco para gerar do nome.</span>
              </div>
              <div className="modal-field">
                <label className="modal-label">Tipo</label>
                <select className="modal-select" value={form.tag} onChange={e => set('tag', e.target.value)}>
                  {TAG_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div className="modal-field">
              <label className="modal-label">Papel / Descrição curta</label>
              <input className="modal-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Chanceler de Oshain · antagonista" />
            </div>
            <div className="modal-field">
              <label className="modal-label">Citação introdutória</label>
              <textarea className="modal-textarea" rows={3} value={form.hero} onChange={e => set('hero', e.target.value)} placeholder="Frase de abertura do artigo..." />
            </div>
            <div className="modal-field">
              <label className="modal-label" style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input
                  type="checkbox"
                  checked={form.placeholder}
                  onChange={e => set('placeholder', e.target.checked)}
                  style={{ width:14, height:14 }}
                />
                Entrada em compilação (sem artigo completo)
              </label>
            </div>
            {err && <div className="modal-error">{err}</div>}
          </div>
          <div className="modal-foot">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar'}</button>
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
// NPCs gallery
// ============================================================
function Npcs({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const rawCast = (Data.charIds || []).map(id => Entities.characters[id]).filter(c => c && c.tag !== 'PC');

  function getInfoboxRow(c, key) {
    return (c.infobox?.rows || []).find(r => r.k === key)?.v || '';
  }

  const cast = rawCast.map(c => ({
    ...c,
    faction: c.faction || getInfoboxRow(c, 'Origem') || getInfoboxRow(c, 'Facção'),
  }));

  return (
    <div className="page" data-screen-label="13 Pessoas Importantes">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Dramatis Personae · Figuras do Mundo</div>
            <h1 className="page-title">Pessoas Importantes</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Nova Pessoa
            </button>
          )}
        </div>
        <p className="page-lede">
          Aliados, antagonistas e figuras neutras que moldaram os eventos —
          todos que importam além da mesa de jogo.
        </p>
      </header>

      {cast.length === 0 && (
        <div style={{ padding:'60px 0', textAlign:'center', color:'var(--foam-dim)', fontFamily:'EB Garamond, serif', fontStyle:'italic', fontSize:16 }}>
          Nenhuma pessoa cadastrada ainda. Use o botão acima para adicionar.
        </div>
      )}

      <div className="cast-grid">
        {cast.map(c => (
          <article
            key={c.id}
            className="cast-card"
            onClick={() => onNav('character:' + c.id)}
          >
            <div className="cast-portrait">
              <image-slot
                id={`char-portrait-${c.id}`}
                shape="rect"
                placeholder={`Arraste retrato · ${c.name}`}
                style={{position:'absolute', inset:0, width:'100%', height:'100%'}}
              ></image-slot>
              <span className={`cast-portrait-tag ${c.tagClass}`} style={{zIndex:2}}>{c.tag}</span>
              {isEditor && (
                <button
                  className="editor-del-btn"
                  style={{ position:'absolute', bottom:12, right:12, zIndex:3 }}
                  onClick={e => { e.stopPropagation(); setModal(c); }}
                >
                  Editar
                </button>
              )}
            </div>
            <div className="cast-body">
              <h3 className="cast-name">{c.name}</h3>
              <p className="cast-role">{c.role}</p>
              {c.faction && (
                <div className="cast-meta">
                  <span className="faction">{c.faction}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {modal && (
        <NpcModal
          character={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Npcs = Npcs;
