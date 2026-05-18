// Pessoas Importantes — NPC gallery · "Ficha de Registro" + Índice + Busca + Filtros

// ============================================================
// Helpers
// ============================================================
function npcGetInfoboxRow(c, key) {
  return (c.infobox?.rows || []).find(r => r.k === key)?.v || '';
}
function npcDeriveStatus(c) {
  const raw = npcGetInfoboxRow(c, 'Status') || '';
  const up  = raw.toUpperCase();
  if (!raw) return null;
  if (/^MORT|FALEC/.test(up))                  return { label: 'MORTO',        cls: 'wine' };
  if (/DESAPAREC/.test(up))                    return { label: 'DESAPARECIDO', cls: 'gold' };
  if (/CATIV|PRISIONEIR|REFÉM|REFEM/.test(up)) return { label: 'CATIVO',       cls: 'gold' };
  if (/EM FUGA|FORAGIDO|FORAGIDA/.test(up))    return { label: 'EM FUGA',      cls: 'wine' };
  if (/^ATIV/.test(up))                        return { label: 'ATIVO',        cls: 'necro' };
  return { label: raw.split(/[—–-]/)[0].trim().toUpperCase().slice(0, 16), cls: 'gold' };
}

// ============================================================
// NPC modal (create / edit) — agora com campo Campanha
// ============================================================
function NpcModal({ character, existingCampaigns, onClose }) {
  const isEdit = !!character;
  const TAG_OPTIONS = ['NPC', 'ALIADO', 'INIMIGO'];
  const TAG_CLASS = { NPC: 'npc', ALIADO: 'ally', INIMIGO: 'foe' };

  const [form, setForm] = React.useState({
    id:          character?.id          ?? '',
    name:        character?.name        ?? '',
    role:        character?.role        ?? '',
    tag:         character?.tag         ?? 'NPC',
    hero:        character?.hero        ?? '',
    campaign:    character?.campaign    ?? '',
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
        campaign: form.campaign?.trim() || null,
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
              <label className="modal-label">Campanha</label>
              <input
                className="modal-input"
                list="npc-campaign-list"
                value={form.campaign}
                onChange={e => set('campaign', e.target.value)}
                placeholder="Ex: Campanha 3 — Lancaster"
              />
              <datalist id="npc-campaign-list">
                {existingCampaigns.map(c => <option key={c} value={c} />)}
              </datalist>
              <span className="modal-hint">Em branco = sem campanha atribuída.</span>
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
// FichaCard — dossiê pessoal (galeria)
// ============================================================
function FichaCard({ char, nr, onClick, onEdit, isEditor }) {
  const status  = npcDeriveStatus(char);
  const tagCls  = char.tagClass || 'npc';
  const classe  = npcGetInfoboxRow(char, 'Classe');
  const origem  = npcGetInfoboxRow(char, 'Origem');
  const raca    = npcGetInfoboxRow(char, 'Raça') || npcGetInfoboxRow(char, 'Raca');
  const faccao  = char.faction || npcGetInfoboxRow(char, 'Facção') || npcGetInfoboxRow(char, 'Faccao') || npcGetInfoboxRow(char, 'Filiação');
  const rows = [
    classe && { k: 'Classe',    v: classe },
    origem && { k: 'Origem',    v: origem },
    raca   && { k: 'Raça',      v: raca },
    faccao && { k: 'Filiação',  v: faccao },
  ].filter(Boolean);
  const campaignShort = (char.campaign || '').split(/[—–-]/)[0].trim();

  return (
    <article
      className={`ficha-card ${tagCls}`}
      onClick={onClick}
    >
      <div className="ficha-corner" />
      {status && <div className={`ficha-stamp ${status.cls}`}>{status.label}</div>}

      <div className="ficha-portrait">
        <image-slot
          id={`char-portrait-${char.id}`}
          shape="rect"
          placeholder={`Arraste retrato · ${char.name}`}
        ></image-slot>
      </div>

      <div className="ficha-body">
        <div className="ficha-id">
          FICHA Nº {nr} · DRAMATIS PERSONAE · {char.tag}
          {campaignShort && <> · {campaignShort.toUpperCase()}</>}
        </div>
        <h3 className="ficha-name">{char.name}</h3>
        {char.role && <p className="ficha-alias">{char.role}</p>}

        {rows.length > 0 && (
          <dl className="ficha-rows">
            {rows.map((r, i) => (
              <div key={i} className="ficha-row">
                <dt>{r.k}</dt><dd>{r.v}</dd>
              </div>
            ))}
          </dl>
        )}

        {char.hero && <p className="ficha-quote">"{char.hero}"</p>}
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
// IndiceRow — linha do índice (vista densa)
// ============================================================
function IndiceRow({ char, nr, onClick, onEdit, isEditor }) {
  const status = npcDeriveStatus(char);
  const dead   = status?.label === 'MORTO';
  const classe = (npcGetInfoboxRow(char, 'Classe') || '').split('·')[0].trim();
  const faccao = char.faction || npcGetInfoboxRow(char, 'Facção') || npcGetInfoboxRow(char, 'Faccao') || npcGetInfoboxRow(char, 'Filiação') || '—';
  const tagCls = char.tagClass || 'npc';

  return (
    <div
      className={`indice-row ${dead ? 'dead' : ''}`}
      onClick={onClick}
    >
      <div className="indice-num">{nr}</div>
      <div className="indice-portrait">
        <image-slot
          id={`char-portrait-${char.id}`}
          shape="rect"
          placeholder={char.name.charAt(0)}
        ></image-slot>
      </div>
      <div className="indice-main">
        <h4 className="indice-name">{char.name}</h4>
        <p className="indice-role">{char.role || '—'}</p>
      </div>
      <div className="indice-meta">
        <span className="indice-classe">{classe || '—'}</span>
        <span className="indice-faccao">{faccao}</span>
      </div>
      {status ? (
        <div className={`indice-status ${status.cls}`}>
          <span className="indice-status-dot" />
          {status.label}
        </div>
      ) : <div />}
      <div className={`indice-tag ${tagCls}`}>{char.tag}</div>
      {isEditor && (
        <button
          className="editor-add-btn"
          onClick={e => { e.stopPropagation(); onEdit(); }}
        >
          Editar
        </button>
      )}
    </div>
  );
}

// ============================================================
// FilterChips — chips de filtro (label + opções)
// ============================================================
function NpcFilterChips({ label, value, options, onChange }) {
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
// NPCs page — Ficha + toggle Galeria/Índice + Busca + Filtros
// ============================================================
function Npcs({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);
  const [view, setView]       = React.useState(() => localStorage.getItem('npc-view') || 'galeria');
  const [query, setQuery]     = React.useState('');
  const [relFilter, setRelFilter]       = React.useState(() => localStorage.getItem('npc-rel')   || 'todos');
  const [campaignFilter, setCampaignFilter] = React.useState(() => localStorage.getItem('npc-camp')  || 'todas');

  React.useEffect(() => { localStorage.setItem('npc-view', view);   }, [view]);
  React.useEffect(() => { localStorage.setItem('npc-rel',  relFilter);      }, [relFilter]);
  React.useEffect(() => { localStorage.setItem('npc-camp', campaignFilter); }, [campaignFilter]);

  const cast = (Data.charIds || [])
    .map(id => Entities.characters[id])
    .filter(c => c && c.tag !== 'PC' && c.tag !== 'ARTICLE');

  // Lista de campanhas distintas
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

  // Contagens por relação (tag)
  const relCounts = {
    todos:   cast.length,
    aliado:  cast.filter(c => c.tag === 'ALIADO').length,
    inimigo: cast.filter(c => c.tag === 'INIMIGO').length,
    neutro:  cast.filter(c => c.tag === 'NPC').length,
  };
  const campaignCounts = {};
  cast.forEach(c => {
    const k = (c.campaign || '').trim() || '__none__';
    campaignCounts[k] = (campaignCounts[k] || 0) + 1;
  });

  // Filtros: busca + relação + campanha
  const q = query.trim().toLowerCase();
  const filtered = cast.filter(c => {
    if (relFilter !== 'todos') {
      if (relFilter === 'aliado'  && c.tag !== 'ALIADO')  return false;
      if (relFilter === 'inimigo' && c.tag !== 'INIMIGO') return false;
      if (relFilter === 'neutro'  && c.tag !== 'NPC')     return false;
    }
    if (campaignFilter !== 'todas') {
      const cc = (c.campaign || '').trim();
      if (campaignFilter === '__none__' ? cc !== '' : cc !== campaignFilter) return false;
    }
    if (q) {
      const hay = [
        c.name, c.role, c.faction, c.campaign,
        npcGetInfoboxRow(c, 'Classe'),
        npcGetInfoboxRow(c, 'Origem'),
        npcGetInfoboxRow(c, 'Facção'),
        npcGetInfoboxRow(c, 'Filiação'),
        npcGetInfoboxRow(c, 'Status'),
        npcGetInfoboxRow(c, 'Raça'),
      ].filter(Boolean).join(' ').toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const relOptions = [
    { value: 'todos',   label: 'Todos',    count: relCounts.todos },
    { value: 'aliado',  label: 'Aliados',  count: relCounts.aliado,  tone: 'necro' },
    { value: 'inimigo', label: 'Inimigos', count: relCounts.inimigo, tone: 'wine'  },
    { value: 'neutro',  label: 'Neutros',  count: relCounts.neutro,  tone: 'mute'  },
  ];
  const campaignOptions = [
    { value: 'todas', label: 'Todas', count: cast.length },
    ...campaignList.map(c => c === '__none__'
      ? { value: '__none__', label: 'Sem campanha', count: campaignCounts['__none__'] || 0, tone: 'mute' }
      : { value: c, label: c, count: campaignCounts[c] || 0 }
    ),
  ];

  const filtersActive = relFilter !== 'todos' || campaignFilter !== 'todas';

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

        {cast.length > 0 && (
          <div className="cast-filters">
            <NpcFilterChips
              label="Relação"
              value={relFilter}
              options={relOptions}
              onChange={setRelFilter}
            />
            <NpcFilterChips
              label="Campanha"
              value={campaignFilter}
              options={campaignOptions}
              onChange={setCampaignFilter}
            />
            {filtersActive && (
              <button
                type="button"
                className="cast-filter-reset"
                onClick={() => { setRelFilter('todos'); setCampaignFilter('todas'); }}
              >LIMPAR FILTROS</button>
            )}
          </div>
        )}

        <div className="cast-controls">
          <div className="cast-search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="7"/>
              <line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Buscar por nome, papel, classe, filiação…"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            {query && (
              <button
                className="cast-search-clear"
                onClick={() => setQuery('')}
                title="Limpar busca"
              >LIMPAR</button>
            )}
            <span className="cast-search-count">
              {filtered.length}{(q || filtersActive) && cast.length !== filtered.length ? ` / ${cast.length}` : ''}
            </span>
          </div>
          <div className="cast-view-toggle">
            <button
              className={view === 'galeria' ? 'active' : ''}
              onClick={() => setView('galeria')}
            >Galeria</button>
            <button
              className={view === 'indice' ? 'active' : ''}
              onClick={() => setView('indice')}
            >Índice</button>
          </div>
        </div>
      </header>

      {cast.length === 0 ? (
        <div className="cast-empty">
          Nenhuma pessoa cadastrada ainda. Use o botão acima para adicionar.
        </div>
      ) : filtered.length === 0 ? (
        <div className="cast-empty">
          {q
            ? <>Nenhum resultado para “{query}”.</>
            : <>Nenhum resultado para os filtros atuais.</>}
        </div>
      ) : view === 'galeria' ? (
        <div className="ficha-grid">
          {filtered.map((c, i) => (
            <FichaCard
              key={c.id}
              char={c}
              nr={String(i + 1).padStart(3, '0')}
              onClick={() => onNav('npc:' + c.id)}
              onEdit={() => setModal(c)}
              isEditor={isEditor}
            />
          ))}
        </div>
      ) : (
        <div className="indice">
          <div className="indice-head">
            <div>Nº</div>
            <div />
            <div>Pessoa</div>
            <div>Classe · Filiação</div>
            <div>Status</div>
            <div>Tag</div>
          </div>
          {filtered.map((c, i) => (
            <IndiceRow
              key={c.id}
              char={c}
              nr={String(i + 1).padStart(3, '0')}
              onClick={() => onNav('npc:' + c.id)}
              onEdit={() => setModal(c)}
              isEditor={isEditor}
            />
          ))}
        </div>
      )}

      {modal && (
        <NpcModal
          character={modal === 'new' ? null : modal}
          existingCampaigns={campaignList.filter(c => c !== '__none__')}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

window.Npcs = Npcs;
