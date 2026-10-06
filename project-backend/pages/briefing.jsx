// O que você precisa saber — resumo, panorama e mistérios em aberto para os jogadores
// Os itens vêm da tabela briefing_items (db/seeds/seed_briefing_schema.sql).
// As últimas sessões vêm direto do Diário de sessões.

const BRIEF_STATUS = {
  front: [
    { value: 'critico', label: 'Crítico' },
    { value: 'ativo',   label: 'Em curso' },
    { value: 'latente', label: 'Adormecido' },
  ],
  mystery: [
    { value: 'aberto',    label: 'Em aberto' },
    { value: 'pistas',    label: 'Com pistas' },
    { value: 'resolvido', label: 'Resolvido' },
  ],
};

const BRIEF_KIND_LABEL = { recap: 'Resumo', front: 'Frente do panorama', mystery: 'Mistério' };

function briefStatusLabel(kind, status) {
  const opt = (BRIEF_STATUS[kind] || []).find(o => o.value === status);
  return opt ? opt.label : null;
}

function briefParas(body) {
  return String(body || '').split(/\n\n+/).map(p => p.trim()).filter(Boolean);
}

function briefSlugify(s) {
  return (s || '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    .slice(0, 60) || ('item-' + Date.now());
}

// Links no formulário: uma linha por link, "Rótulo | alvo" (ex.: "Ayael | deity:ayael")
function briefLinksToText(links) {
  return (links || []).map(l => (l.label ? l.label + ' | ' : '') + (l.target || '')).join('\n');
}
function briefTextToLinks(text) {
  return String(text || '').split('\n').map(line => line.trim()).filter(Boolean).map(line => {
    const [a, b] = line.split('|').map(x => x.trim());
    return b ? { label: a, target: b } : { label: a, target: a };
  });
}

// ============================================================
// Modal (criar / editar item)
// ============================================================
function BriefingModal({ item, onClose }) {
  const isEdit = !!item?._id;
  const [form, setForm] = React.useState({
    kind:        item?.kind ?? 'front',
    title:       item?.title ?? '',
    body:        item?.body ?? '',
    status:      item?.status ?? (BRIEF_STATUS[item?.kind ?? 'front']?.[0]?.value || ''),
    links:       briefLinksToText(item?.links),
    session_num: item?.session_num ?? '',
    hidden:      item?.hidden ?? false,
    sort_order:  item?.sort_order ?? '',
  });
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function set(k, v) { setForm(f => ({ ...f, [k]: v })); }

  function setKind(kind) {
    setForm(f => ({ ...f, kind, status: BRIEF_STATUS[kind]?.[0]?.value || '' }));
  }

  // Sem ordem informada, o item novo entra no fim da sua seção
  function nextOrder(kind) {
    const same = (Data.briefing || []).filter(b => b.kind === kind);
    return same.length ? Math.max(...same.map(b => b.sort_order || 0)) + 10 : 10;
  }

  async function handleSave(e) {
    e.preventDefault();
    setErr('');
    setBusy(true);
    try {
      await window.DB.saveBriefingItem({
        ...form,
        id: item?.id || (briefSlugify(form.title || form.kind) + '-' + Date.now().toString(36)),
        status: BRIEF_STATUS[form.kind] ? form.status : null,
        links: briefTextToLinks(form.links),
        sort_order: form.sort_order === '' ? nextOrder(form.kind) : form.sort_order,
      });
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao salvar');
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setBusy(true);
    try {
      await window.DB.deleteBriefingItem(item._id);
      onClose();
    } catch (ex) {
      setErr(ex.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  const titleLabel = form.kind === 'mystery' ? 'Pergunta' : form.kind === 'recap' ? 'Título (opcional)' : 'Título';
  const bodyLabel  = form.kind === 'mystery' ? 'O que já se sabe' : 'Texto';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">Crônicas · O que você precisa saber</div>
          <h2 className="modal-title">{isEdit ? 'Editar ' : 'Novo · '}{BRIEF_KIND_LABEL[form.kind]}</h2>
        </div>
        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Tipo</label>
                <select className="modal-select" value={form.kind} onChange={e => setKind(e.target.value)}>
                  <option value="recap">Em resumo</option>
                  <option value="front">Panorama (frente)</option>
                  <option value="mystery">Mistério / pergunta</option>
                </select>
              </div>
              {BRIEF_STATUS[form.kind] && (
                <div className="modal-field">
                  <label className="modal-label">Situação</label>
                  <select className="modal-select" value={form.status || ''} onChange={e => set('status', e.target.value)}>
                    {BRIEF_STATUS[form.kind].map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="modal-field">
              <label className="modal-label">{titleLabel}</label>
              <input className="modal-input" value={form.title} onChange={e => set('title', e.target.value)}
                required={form.kind !== 'recap'}
                placeholder={form.kind === 'mystery' ? 'Quem está por trás de…?' : form.kind === 'front' ? 'A fenda de Ayael' : ''} />
            </div>
            <div className="modal-field">
              <label className="modal-label">{bodyLabel}</label>
              <textarea className="modal-textarea" rows={6} value={form.body} onChange={e => set('body', e.target.value)} />
              <span className="modal-hint">Separe parágrafos com uma linha em branco.</span>
            </div>
            <div className="modal-field">
              <label className="modal-label">Links</label>
              <textarea className="modal-textarea" rows={2} value={form.links} onChange={e => set('links', e.target.value)} placeholder={"Ayael | deity:ayael\nFacções | factions"} />
              <span className="modal-hint">Um por linha: Rótulo | destino (deity:id, npc:id, character:id, session:12, factions…).</span>
            </div>
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">{form.kind === 'mystery' ? 'Surgiu na sessão' : 'Sessão relacionada'}</label>
                <input className="modal-input" type="number" value={form.session_num} onChange={e => set('session_num', e.target.value)} placeholder="Nº (opcional)" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Ordem</label>
                <input className="modal-input" type="number" value={form.sort_order} onChange={e => set('sort_order', e.target.value)} placeholder="Menor aparece antes" />
              </div>
            </div>
            <label className="modal-label vq-check">
              <input type="checkbox" checked={form.hidden} onChange={e => set('hidden', e.target.checked)} />
              Rascunho — só editores veem
            </label>
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
// Peças da página
// ============================================================
function BriefLinks({ item, onNav }) {
  const s = item.session_num != null ? Entities.sessions[String(item.session_num)] : null;
  if (!(item.links || []).length && !s) return null;
  return (
    <div className="vq-links">
      {s && (
        <a onClick={() => onNav('session:' + s.num)}>
          {item.kind === 'mystery' ? 'Surgiu na sessão ' : 'Sessão '}{vsPad(s.num)}
        </a>
      )}
      {(item.links || []).filter(l => l.target).map((l, i) => (
        <a key={i} onClick={() => onNav(l.target)}>{l.label || l.target}</a>
      ))}
    </div>
  );
}

function BriefEdit({ item, isEditor, onEdit }) {
  if (!isEditor) return null;
  return <button className="vt-btn vq-edit" onClick={() => onEdit(item)}>Editar</button>;
}

function BriefDraft({ item }) {
  return item.hidden ? <span className="vq-draft">Rascunho</span> : null;
}

function BriefSectionHead({ num, title, sub, children }) {
  return (
    <React.Fragment>
      <header className="vh-head">
        <span className="vh-head-num">{num}</span>
        <h2 className="vh-head-title">{title}</h2>
        {children}
      </header>
      {sub && <p className="vh-sub vq-sub">{sub}</p>}
    </React.Fragment>
  );
}

function BriefAdd({ isEditor, kind, label, onEdit }) {
  if (!isEditor) return null;
  return <button className="vh-head-link" onClick={() => onEdit({ kind })}>+ {label}</button>;
}

// ============================================================
// Página
// ============================================================
function Briefing({ onNav }) {
  const { isEditor } = useAuth();
  const [modal, setModal] = React.useState(null);

  const items = (Data.briefing || []).filter(b => isEditor || !b.hidden);
  const byKind = kind => items.filter(b => b.kind === kind).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
  const recap = byKind('recap');
  const fronts = byKind('front');
  const mysteries = byKind('mystery');
  const openMysteries = mysteries.filter(m => m.status !== 'resolvido');
  const solved = mysteries.filter(m => m.status === 'resolvido');

  const sessions = (Data.sessionIds || []).map(id => Entities.sessions[id]).filter(Boolean)
    .sort((a, b) => (b.num || 0) - (a.num || 0)).slice(0, 3);

  const edit = item => setModal(item);

  return (
    <div className="vt vq" data-screen-label="O que você precisa saber">
      <section className="vt-pantheon-head vq-head">
        <img className="vt-hero-rose" src={vtAsset('rosacea.svg')} alt="" aria-hidden="true" draggable="false" />
        <div className="vt-pantheon-head-text">
          <div className="vt-label">Crônicas · Para os jogadores</div>
          <h1 className="vt-h1">O que você precisa saber</h1>
          <div className="vt-epithet">Antes de sentar à mesa</div>
          <p className="vt-pantheon-lede">
            Onde a história parou, o que está em jogo no mundo e as perguntas que ainda não têm resposta.
            Para os detalhes, abra o fólio de cada sessão.
          </p>
        </div>
        {isEditor && (
          <div className="vt-pantheon-add">
            <button className="vt-btn vt-btn--gold" onClick={() => edit({ kind: 'front' })}>+ Novo item</button>
          </div>
        )}
      </section>

      {isEditor && Data.briefingMissing && (
        <section className="vh-section">
          <p className="vq-warn">
            A tabela <code>briefing_items</code> ainda não existe no Supabase. Rode
            {' '}<code>db/seeds/seed_briefing_schema.sql</code> no SQL Editor para ativar esta página.
          </p>
        </section>
      )}

      {/* I · Em resumo */}
      {(recap.length > 0 || isEditor) && (
        <section className="vh-section">
          <BriefSectionHead num="I" title="Em resumo">
            <BriefAdd isEditor={isEditor} kind="recap" label="Bloco" onEdit={edit} />
          </BriefSectionHead>
          {recap.length === 0 && <p className="vq-empty">Nenhum resumo escrito ainda.</p>}
          <div className="vq-recap">
            {recap.map(r => (
              <article key={r.id} className="vq-recap-block">
                {(r.title || r.hidden) && <h3 className="vq-recap-title">{r.title} <BriefDraft item={r} /></h3>}
                {briefParas(r.body).map((p, i) => <p key={i} className={i === 0 && !r.title ? 'va-first' : ''}>{p}</p>)}
                <BriefLinks item={r} onNav={onNav} />
                <BriefEdit item={r} isEditor={isEditor} onEdit={edit} />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* II · Últimas sessões (automático, do diário) */}
      {sessions.length > 0 && (
        <section className="vh-section">
          <BriefSectionHead num="II" title="Últimas sessões" sub="Direto do diário: o essencial de cada uma.">
            <button className="vh-head-link" onClick={() => onNav('sessions')}>Diário completo →</button>
          </BriefSectionHead>
          <ol className="vq-sessions">
            {sessions.map(s => {
              const points = (s.keypoints || []).filter(k => k && k.text);
              return (
                <li key={s.num} className="vq-session" onClick={() => onNav('session:' + s.num)}>
                  <span className="vs-folio-num">{vsPad(s.num)}</span>
                  <div className="vq-session-body">
                    <div className="vh-last-meta">{[s.dateShort, s.location].filter(Boolean).join(' · ')}</div>
                    <h3 className="vs-folio-title">{s.title}</h3>
                    {s.summary && <p className="vq-session-summary">{s.summary}</p>}
                    {points.length > 0 && (
                      <ul className="vq-points">
                        {points.map((k, i) => <li key={i} className={k.danger ? 'is-danger' : ''}>{k.text}</li>)}
                      </ul>
                    )}
                    {s.next && <p className="vq-session-next"><span className="vh-mini-label">Próxima sessão</span> {s.next}</p>}
                  </div>
                </li>
              );
            })}
          </ol>
        </section>
      )}

      {/* III · Panorama */}
      {(fronts.length > 0 || isEditor) && (
        <section className="vh-section">
          <BriefSectionHead num="III" title="Panorama" sub="As forças em movimento e o que cada uma significa para o grupo.">
            <BriefAdd isEditor={isEditor} kind="front" label="Frente" onEdit={edit} />
          </BriefSectionHead>
          {fronts.length === 0 && <p className="vq-empty">Nenhuma frente registrada ainda.</p>}
          <div className="vq-fronts">
            {fronts.map(f => (
              <article key={f.id} className={'vq-front vq-front--' + (f.status || 'ativo')}>
                <div className="vq-front-top">
                  {briefStatusLabel('front', f.status) && <span className="vq-status">{briefStatusLabel('front', f.status)}</span>}
                  <BriefDraft item={f} />
                </div>
                <h3 className="vq-front-title">{f.title}</h3>
                {briefParas(f.body).map((p, i) => <p key={i}>{p}</p>)}
                <BriefLinks item={f} onNav={onNav} />
                <BriefEdit item={f} isEditor={isEditor} onEdit={edit} />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* IV · Mistérios */}
      {(mysteries.length > 0 || isEditor) && (
        <section className="vh-section vq-last">
          <BriefSectionHead num="IV" title="Mistérios e perguntas em aberto" sub="O que o grupo ainda não sabe — e o pouco que já descobriu.">
            <BriefAdd isEditor={isEditor} kind="mystery" label="Pergunta" onEdit={edit} />
          </BriefSectionHead>
          {openMysteries.length === 0 && <p className="vq-empty">Nenhuma pergunta em aberto.</p>}
          <ol className="vq-mysteries">
            {openMysteries.map(m => (
              <li key={m.id} className={'vq-mystery vq-mystery--' + (m.status || 'aberto')}>
                <span className="vq-mystery-mark" aria-hidden="true">?</span>
                <div className="vq-mystery-body">
                  <div className="vq-front-top">
                    {briefStatusLabel('mystery', m.status) && <span className="vq-status">{briefStatusLabel('mystery', m.status)}</span>}
                    <BriefDraft item={m} />
                  </div>
                  <h3 className="vq-mystery-q">{m.title}</h3>
                  {briefParas(m.body).map((p, i) => <p key={i}>{p}</p>)}
                  <BriefLinks item={m} onNav={onNav} />
                </div>
                <BriefEdit item={m} isEditor={isEditor} onEdit={edit} />
              </li>
            ))}
          </ol>
          {solved.length > 0 && (
            <details className="vq-solved">
              <summary>Já respondidas ({solved.length})</summary>
              <ol className="vq-mysteries">
                {solved.map(m => (
                  <li key={m.id} className="vq-mystery vq-mystery--resolvido">
                    <span className="vq-mystery-mark" aria-hidden="true">✓</span>
                    <div className="vq-mystery-body">
                      <h3 className="vq-mystery-q">{m.title} <BriefDraft item={m} /></h3>
                      {briefParas(m.body).map((p, i) => <p key={i}>{p}</p>)}
                      <BriefLinks item={m} onNav={onNav} />
                    </div>
                    <BriefEdit item={m} isEditor={isEditor} onEdit={edit} />
                  </li>
                ))}
              </ol>
            </details>
          )}
        </section>
      )}

      {modal && <BriefingModal item={modal} onClose={() => setModal(null)} />}
    </div>
  );
}

window.Briefing = Briefing;
