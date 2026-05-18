// Dramatis Personae — character gallery (PC) · "Retrato com Placa de Bronze"

// ============================================================
// Helpers — status detection from infobox
// ============================================================
function getInfoboxRow(c, key) {
  return (c.infobox?.rows || []).find(r => r.k === key)?.v || '';
}
function deriveStatus(c) {
  const raw = getInfoboxRow(c, 'Status') || '';
  const up  = raw.toUpperCase();
  if (!raw) return null;
  if (/^MORT|FALEC/.test(up))                  return { label: 'MORTO',        cls: 'wine',  bucket: 'morto' };
  if (/DESAPAREC/.test(up))                    return { label: 'DESAPARECIDO', cls: 'gold',  bucket: 'outro' };
  if (/CATIV|PRISIONEIR|REFÉM|REFEM/.test(up)) return { label: 'CATIVO',       cls: 'gold',  bucket: 'outro' };
  if (/EM FUGA|FORAGIDO|FORAGIDA/.test(up))    return { label: 'EM FUGA',      cls: 'wine',  bucket: 'outro' };
  if (/^ATIV/.test(up))                        return { label: 'ATIVO',        cls: 'necro', bucket: 'ativo' };
  return { label: raw.split(/[—–-]/)[0].trim().toUpperCase().slice(0, 16), cls: 'gold', bucket: 'outro' };
}
function statusBucket(c) {
  return deriveStatus(c)?.bucket || 'sem';
}

// ============================================================
// Character modal (create / edit)
// ============================================================
function CharacterModal({ character, existingCampaigns, onClose }) {
  const isEdit = !!character;
  const TAG_OPTIONS = ['PC', 'ALIADO', 'INIMIGO', 'NPC'];
  const TAG_CLASS = { PC: 'pc', ALIADO: 'ally', INIMIGO: 'foe', NPC: 'npc' };

  const [form, setForm] = React.useState({
    id:          character?.id          ?? '',
    name:        character?.name        ?? '',
    role:        character?.role        ?? '',
    tag:         character?.tag         ?? 'PC',
    hero:        character?.hero        ?? '',
    campaign:    character?.campaign    ?? '',
    placeholder: character?.placeholder ?? true,
    _id:         character?.id,
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
        campaign: form.campaign?.trim() || null,
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
          <div className="modal-eyebrow">Dramatis Personae · Personagens (PC)</div>
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
              <label className="modal-label">Campanha</label>
              <input
                className="modal-input"
                list="char-campaign-list"
                value={form.campaign}
                onChange={e => set('campaign', e.target.value)}
                placeholder="Ex: Campanha 3 — Lancaster"
              />
              <datalist id="char-campaign-list">
                {existingCampaigns.map(c => <option key={c} value={c} />)}
              </datalist>
              <span className="modal-hint">Em branco = sem campanha atribuída.</span>
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
// PlacaCard — retrato + placa de bronze
// ============================================================
function PlacaCard({ char, nr, onClick, onEdit, isEditor }) {
  const status      = deriveStatus(char);
  const dead        = status?.bucket === 'morto';
  const morte       = getInfoboxRow(char, 'Morte');
  const ultimaVista = getInfoboxRow(char, 'Última Vista');
  const vistoPor    = getInfoboxRow(char, 'Visto Por');
  const hasNote     = !dead && status?.bucket === 'outro' && !!ultimaVista;
  const classe      = (char.cls || getInfoboxRow(char, 'Classe') || '').split('·')[0].trim();
  const origem      = (getInfoboxRow(char, 'Origem') || '').split(/[—–-]/)[0].trim();
  const campaignShort = (char.campaign || '').split(/[—–-]/)[0].trim();

  const variantCls = dead ? 'dead dead-tomb' : (hasNote ? 'lost-note' : '');

  return (
    <article
      className={`placa-card ${variantCls}`}
      onClick={onClick}
    >
      <div className="placa-frame">
        <image-slot
          id={`char-portrait-${char.id}`}
          shape="rect"
          placeholder={`Arraste retrato · ${char.name}`}
          {...(dead ? { fit: 'contain', position: '50% 20%' } : {})}
        ></image-slot>
        {dead && <div className="placa-cameo-ring" />}
        {status && (
          <div className={`placa-status ${status.cls}`}>
            <span className="placa-status-dot" />
            {status.label}
          </div>
        )}
        {dead && (
          <div className="placa-tomb-inscription">
            <div className="placa-tomb-name">{char.name}</div>
            {morte && <span className="placa-tomb-sep" />}
            {morte && <div className="placa-tomb-year">{morte}</div>}
          </div>
        )}
        {hasNote && (
          <div className="placa-lost-note">
            <span className="placa-lost-note-pin" />
            <div className="placa-lost-note-lbl">Última vista</div>
            <div className="placa-lost-note-text">{ultimaVista}</div>
            {vistoPor && <div className="placa-lost-note-sig">— {vistoPor}</div>}
          </div>
        )}
      </div>
      <div className="placa-plaque">
        <div className="placa-plaque-eyebrow">
          N.º {nr} · {char.tag}
          {campaignShort && <> · {campaignShort.toUpperCase()}</>}
        </div>
        {!dead && <h3 className="placa-plaque-name">{char.name}</h3>}
        <p className="placa-plaque-role">
          {classe && origem ? `${classe} · ${origem}` : (char.role || classe || origem)}
        </p>
      </div>
      {isEditor && (
        <button
          className="editor-add-btn"
          onClick={e => { e.stopPropagation(); onEdit(); }}
        >
          Editar
        </button>
      )}
    </article>
  );
}

// ============================================================
// FilterChips — barra de chips com label + opções
// ============================================================
function FilterChips({ label, value, options, onChange }) {
  return (
    <div className="cast-filter-group">
      <span className="cast-filter-label">{label}</span>
      <div className="cast-filter-chips">
        {options.map(opt => (
          <button
            key={opt.value}
            type="button"
            className={`cast-filter-chip ${value === opt.value ? 'active' : ''} ${opt.tone ? 'tone-' + opt.tone : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
            {opt.count != null && <span className="cast-filter-count">{opt.count}</span>}
          </button>
        ))}
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
  const [statusFilter, setStatusFilter]   = React.useState(() => localStorage.getItem('pc-status')   || 'todos');
  const [campaignFilter, setCampaignFilter] = React.useState(() => localStorage.getItem('pc-camp')   || 'todas');

  React.useEffect(() => { localStorage.setItem('pc-status', statusFilter); }, [statusFilter]);
  React.useEffect(() => { localStorage.setItem('pc-camp',   campaignFilter); }, [campaignFilter]);

  const cast = (Data.charIds || [])
    .map(id => Entities.characters[id])
    .filter(c => c && c.tag === 'PC');

  // Lista de campanhas distintas (ordenada, "Sem campanha" no final se houver órfãos)
  const campaignSet = new Set();
  let hasUnassigned = false;
  cast.forEach(c => {
    const v = (c.campaign || '').trim();
    if (v) campaignSet.add(v); else hasUnassigned = true;
  });
  const campaignList = Array.from(campaignSet).sort((a, b) =>
    a.localeCompare(b, 'pt-BR', { numeric: true, sensitivity: 'base' })
  );
  if (hasUnassigned) campaignList.push('__none__');

  // Contagens pra mostrar nos chips
  const counts = {
    statusTodos:   cast.length,
    statusAtivo:   cast.filter(c => statusBucket(c) === 'ativo').length,
    statusMorto:   cast.filter(c => statusBucket(c) === 'morto').length,
    statusOutro:   cast.filter(c => { const b = statusBucket(c); return b !== 'ativo' && b !== 'morto'; }).length,
  };
  const campaignCounts = {};
  cast.forEach(c => {
    const k = (c.campaign || '').trim() || '__none__';
    campaignCounts[k] = (campaignCounts[k] || 0) + 1;
  });

  // Aplica filtros
  const filtered = cast.filter(c => {
    // Status
    if (statusFilter !== 'todos') {
      const b = statusBucket(c);
      if (statusFilter === 'ativo' && b !== 'ativo')                 return false;
      if (statusFilter === 'morto' && b !== 'morto')                 return false;
      if (statusFilter === 'outro' && (b === 'ativo' || b === 'morto')) return false;
    }
    // Campanha
    if (campaignFilter !== 'todas') {
      const cc = (c.campaign || '').trim();
      if (campaignFilter === '__none__' ? cc !== '' : cc !== campaignFilter) return false;
    }
    return true;
  });

  const statusOptions = [
    { value: 'todos', label: 'Todos',  count: counts.statusTodos },
    { value: 'ativo', label: 'Ativos', count: counts.statusAtivo, tone: 'necro' },
    { value: 'morto', label: 'Mortos', count: counts.statusMorto, tone: 'wine' },
    { value: 'outro', label: 'Desconhecido', count: counts.statusOutro, tone: 'gold' },
  ];
  const campaignOptions = [
    { value: 'todas', label: 'Todas', count: cast.length },
    ...campaignList.map(c => c === '__none__'
      ? { value: '__none__', label: 'Sem campanha', count: campaignCounts['__none__'] || 0, tone: 'mute' }
      : { value: c, label: c, count: campaignCounts[c] || 0 }
    ),
  ];

  const filtersActive = statusFilter !== 'todos' || campaignFilter !== 'todas';

  return (
    <div className="page" data-screen-label="12 Dramatis Personae">
      <header className="page-header">
        <div className="page-header-row">
          <div>
            <div className="page-eyebrow">Dramatis Personae · Heróis de Mesa</div>
            <h1 className="page-title">Personagens (PC)</h1>
          </div>
          {isEditor && (
            <button className="editor-add-btn" onClick={() => setModal('new')}>
              Novo Personagem
            </button>
          )}
        </div>
        <p className="page-lede">
          Galeria dos heróis em campo — cada placa registra origem, classe e
          status atual. Clique em qualquer retrato para abrir a entrada
          completa.
        </p>

        {cast.length > 0 && (
          <div className="cast-filters">
            <FilterChips
              label="Status"
              value={statusFilter}
              options={statusOptions}
              onChange={setStatusFilter}
            />
            <FilterChips
              label="Campanha"
              value={campaignFilter}
              options={campaignOptions}
              onChange={setCampaignFilter}
            />
            {filtersActive && (
              <button
                type="button"
                className="cast-filter-reset"
                onClick={() => { setStatusFilter('todos'); setCampaignFilter('todas'); }}
              >LIMPAR FILTROS</button>
            )}
          </div>
        )}
      </header>

      {cast.length === 0 ? (
        <div className="cast-empty">
          Nenhum personagem cadastrado ainda. Use o botão acima para adicionar.
        </div>
      ) : filtered.length === 0 ? (
        <div className="cast-empty">
          Nenhum personagem corresponde aos filtros atuais.
        </div>
      ) : (
        <div className="placa-grid">
          {filtered.map((c, i) => (
            <PlacaCard
              key={c.id}
              char={c}
              nr={String(i + 1).padStart(3, '0')}
              onClick={() => onNav('character:' + c.id)}
              onEdit={() => setModal(c)}
              isEditor={isEditor}
            />
          ))}
        </div>
      )}

      {modal && (
        <CharacterModal
          character={modal === 'new' ? null : modal}
          existingCampaigns={campaignList.filter(c => c !== '__none__')}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Characters = Characters;
