// Dramatis Personae — character gallery

const STATIC_CAST = [
  { id: 'kathryn',    tag: 'PC',     tagClass: 'pc',   name: 'Käthryn Verlaine',    role: 'Paladina dissidente · Lancaster',         faction: 'Lancaster (caído)',   cls: 'Paladina · nv. 7' },
  { id: 'halric',     tag: 'PC',     tagClass: 'pc',   name: 'Halric Stillvein',    role: 'Bardo conluiado · um conto por estalagem', faction: 'Independente',        cls: 'Bardo · nv. 7' },
  { id: 'sothia',     tag: 'PC',     tagClass: 'pc',   name: 'Sothia das Cinzas',   role: 'Maga warforged · primeira da linhagem',    faction: 'Lorean Treaz',        cls: 'Feiticeira · nv. 7' },
  { id: 'mavor',      tag: 'PC',     tagClass: 'pc',   name: 'Mavor Iceblood',      role: 'Mercenário de Ferro · imune à Trama',      faction: 'Império de Ferro',    cls: 'Guerreiro · nv. 7' },
  { id: 'vensothiel', tag: 'ALIADO', tagClass: 'ally', name: 'Mestra Ven Sothiel',  role: 'Arquimaga decana · mentora arrelíquia',    faction: 'Lorean Treaz',        cls: 'Arquimaga · nv. 18' },
  { id: 'vagliesII',  tag: 'ALIADO', tagClass: 'ally', name: 'Vaglies II',           role: 'Filho do rei mártir · em exílio',          faction: 'Lancaster (exilado)', cls: 'Clérigo · nv. 12' },
  { id: 'annabella',  tag: 'INIMIGO',tagClass: 'foe',  name: 'Annabella Whiteflame',role: 'A Rainha Branca · não envelhece',          faction: 'Oshain',              cls: '???' },
  { id: 'noel',       tag: 'INIMIGO',tagClass: 'foe',  name: 'Noel Braent',          role: 'O Agente do Selo · rosto na multidão',    faction: 'Blackflame',          cls: 'Ladina arcana · ???' },
  { id: 'caedric',    tag: 'INIMIGO',tagClass: 'foe',  name: '"Irmão Caedric"',      role: 'Lacrimosi · prega libertação',            faction: 'Lacrimosi',           cls: 'Necromante · nv. 14' },
];

// ============================================================
// Character modal (create / edit)
// ============================================================
function CharacterModal({ character, onClose }) {
  const isEdit = !!character;
  const TAG_OPTIONS = ['PC', 'ALIADO', 'INIMIGO', 'NPC'];
  const TAG_CLASS = { PC: 'pc', ALIADO: 'ally', INIMIGO: 'foe', NPC: 'npc' };

  const [form, setForm] = React.useState({
    id: character?.id ?? '',
    name: character?.name ?? '',
    role: character?.role ?? '',
    tag: character?.tag ?? 'NPC',
    hero: character?.hero ?? '',
    placeholder: character?.placeholder ?? true,
    _id: character?.id,
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
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
        infobox: character?.infobox || { rows: [] },
        sections: character?.sections || [],
        related: character?.related || [],
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
          <div className="modal-eyebrow">Crônicas · Dramatis Personae</div>
          <h2 className="modal-title">{isEdit ? 'Editar Personagem' : 'Novo Personagem'}</h2>
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
              <input className="modal-input" value={form.role} onChange={e => set('role', e.target.value)} placeholder="Paladina dissidente · Lancaster" />
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
            <button type="submit" className="btn-save" disabled={busy}>{busy ? 'Salvando…' : 'Salvar Personagem'}</button>
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
// Characters gallery
// ============================================================
function Characters({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  // Merge: always show static characters + any DB-only additions
  // For static characters saved to DB, DB data takes precedence
  const staticIds = STATIC_CAST.map(c => c.id);
  const dbOnlyIds = (Data.charIds || []).filter(id => !staticIds.includes(id));
  const allIds = [...staticIds, ...dbOnlyIds];
  const rawCast = allIds.map(id =>
    Entities.characters[id] || STATIC_CAST.find(c => c.id === id)
  ).filter(Boolean);

  function getInfoboxRow(c, key) {
    return (c.infobox?.rows || []).find(r => r.k === key)?.v || '';
  }

  const cast = rawCast.map(c => ({
    ...c,
    faction: c.faction || getInfoboxRow(c, 'Origem') || getInfoboxRow(c, 'Facção'),
    cls: c.cls || getInfoboxRow(c, 'Classe'),
  }));

  return (
    <div className="page" data-screen-label="12 Dramatis Personae">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Crônicas · Volume IV · O Elenco</div>
            <h1 className="page-title">Dramatis Personae</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Novo Personagem
            </button>
          )}
        </div>
        <p className="page-lede">
          Todos os nomes que importam no momento atual da história — heróis
          de mesa, aliados ganhos, antagonistas confirmados. Clique em
          qualquer um para abrir a entrada completa.
        </p>
      </header>

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
              {(c.faction || c.cls) && (
                <div className="cast-meta">
                  <span className="faction">{c.faction}</span>
                  <span>{c.cls}</span>
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {modal && (
        <CharacterModal
          character={modal === 'new' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Characters = Characters;
