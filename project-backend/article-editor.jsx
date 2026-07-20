// Article editor — modal for editing hero, sections, infobox, related

function ArticleEditor({ type, entity, onClose, onDelete }) {
  const slotId = type === 'character'
    ? `char-portrait-${entity.id}`
    : type === 'faction'
      ? `faction-portrait-${entity.id}`
      : `deity-hero-${entity.id}`;
  const currentSlot = window._imageSlotGet ? window._imageSlotGet(slotId) : null;

  const [hero, setHero] = React.useState(entity.hero || '');
  const [epithet, setEpithet] = React.useState(entity.epithet || '');
  const [sigil, setSigil] = React.useState(entity.sigil || '');
  const [sections, setSections] = React.useState(
    (entity.sections || []).map(s => ({
      title:    s.title    || '',
      paras:    (s.paras || []).join('\n\n'),
      eyebrow:  s.eyebrow  || '',
      location: s.location || '',
      session:  s.session  || '',
      date:     s.date     || '',
      tags:     (s.tags || []).join(', '),
      redacted: s.redacted || false,
    }))
  );
  const [rows, setRows] = React.useState(
    (entity.infobox?.rows || []).map(r => ({ ...r }))
  );
  const [statusNote, setStatusNote] = React.useState(entity.infobox?.statusNote || '');
  const [related, setRelated] = React.useState(
    (entity.related || []).map(r => ({ ...r }))
  );
  const [placeholder, setPlaceholder] = React.useState(entity.placeholder || false);
  const [imgFile, setImgFile] = React.useState(null);
  const [imgPreview, setImgPreview] = React.useState(currentSlot?.u || null);
  const imgInputRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');
  const [confirmDel, setConfirmDel] = React.useState(false);

  function handleImgChange(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setImgFile(f);
    setImgPreview(URL.createObjectURL(f));
    e.target.value = '';
  }

  // ── Sections ────────────────────────────────────────────────
  function addSection() {
    setSections(s => [...s, {
      title: '', paras: '', eyebrow: '', location: '', session: '', date: '', tags: '', redacted: false,
    }]);
  }
  function removeSection(i) { setSections(s => s.filter((_, j) => j !== i)); }
  function updateSection(i, key, val) {
    setSections(s => s.map((sec, j) => j === i ? { ...sec, [key]: val } : sec));
  }
  function moveSection(i, dir) {
    setSections(s => {
      const a = [...s];
      const j = i + dir;
      if (j < 0 || j >= a.length) return a;
      [a[i], a[j]] = [a[j], a[i]];
      return a;
    });
  }

  // ── Infobox rows ─────────────────────────────────────────────
  function addRow() { setRows(r => [...r, { k: '', v: '' }]); }
  function removeRow(i) { setRows(r => r.filter((_, j) => j !== i)); }
  function updateRowField(i, key, val) {
    setRows(r => r.map((row, j) => j === i ? { ...row, [key]: val } : row));
  }
  function updateRowStyle(i, style) {
    setRows(r => r.map((row, j) => j !== i ? row : {
      ...row,
      danger: style === 'danger',
      ok: style === 'ok',
    }));
  }

  // ── Related ──────────────────────────────────────────────────
  function addRelated() { setRelated(r => [...r, { tag: '', title: '', target: '' }]); }
  function removeRelated(i) { setRelated(r => r.filter((_, j) => j !== i)); }
  function updateRelated(i, key, val) {
    setRelated(r => r.map((rel, j) => j === i ? { ...rel, [key]: val } : rel));
  }

  // ── Save ─────────────────────────────────────────────────────
  async function handleDelete() {
    if (!confirmDel) { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); return; }
    setBusy(true);
    try {
      if (type === 'character') await window.DB.deleteCharacter(entity.id);
      else if (type === 'deity') await window.DB.deleteDeity(entity.id);
      else if (type === 'faction') await window.DB.deleteFaction(entity.id);
      (onDelete || onClose)();
    } catch(e) {
      setErr(e.message || 'Erro ao apagar');
      setBusy(false);
    }
  }

  async function handleSave() {
    setErr('');
    setBusy(true);
    try {
      const updated = {
        ...entity,
        hero,
        epithet: type === 'deity' ? epithet : entity.epithet,
        sigil: type === 'deity' ? sigil : entity.sigil,
        sections: sections.map(s => ({
          title:    s.title,
          paras:    s.paras.split('\n\n').map(p => p.trim()).filter(Boolean),
          eyebrow:  s.eyebrow  || undefined,
          location: s.location || undefined,
          session:  s.session  || undefined,
          date:     s.date     || undefined,
          tags:     s.tags ? s.tags.split(',').map(t => t.trim()).filter(Boolean) : undefined,
          redacted: s.redacted || undefined,
        })),
        infobox: {
          ...(entity.infobox || {}),
          rows: rows.filter(r => r.k || r.v),
          statusNote: statusNote || undefined,
        },
        related: related.filter(r => r.title),
        placeholder,
      };

      if (imgFile && window.ImageUpload) {
        const cloudUrl = await window.ImageUpload.uploadImage(imgFile, slotId);
        window._imageSlotSet(slotId, { u: cloudUrl, s: 1, x: 0, y: 0 });
      }

      if (type === 'character') await window.DB.saveCharacter(updated);
      else if (type === 'deity') await window.DB.saveDeity(updated);
      else if (type === 'faction') await window.DB.saveFaction(updated);
      onClose();
    } catch (e) {
      setErr(e.message || 'Erro ao salvar artigo');
    } finally {
      setBusy(false);
    }
  }

  const btnRemove = {
    background: 'transparent',
    border: '1px solid var(--wine)',
    color: 'var(--wine-bright)',
    borderRadius: 2,
    padding: '5px 9px',
    cursor: 'pointer',
    fontSize: 11,
    fontFamily: 'JetBrains Mono, monospace',
    letterSpacing: '0.1em',
    flexShrink: 0,
  };
  const btnMove = {
    background: 'transparent',
    border: '1px solid var(--ink-line)',
    color: 'var(--foam-dim)',
    borderRadius: 2,
    padding: '5px 8px',
    cursor: 'pointer',
    fontSize: 11,
    lineHeight: 1,
    flexShrink: 0,
  };
  const sectionBox = {
    background: 'var(--ink-deep)',
    border: '1px solid var(--ink-line)',
    borderRadius: 2,
    padding: '14px 16px',
    marginBottom: 10,
  };
  const subHead = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" style={{ maxWidth: 780 }} onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div className="modal-eyebrow">
            {type === 'character' ? 'Dramatis Personae' : type === 'faction' ? 'Facções' : 'Panteão'} · Editor de Artigo
          </div>
          <h2 className="modal-title">{entity.name}</h2>
        </div>

        <div className="modal-body">
          {/* Status */}
          <div className="modal-field">
            <label className="modal-label" style={{ display:'flex', alignItems:'center', gap:10 }}>
              <input
                type="checkbox"
                checked={placeholder}
                onChange={e => setPlaceholder(e.target.checked)}
                style={{ width:14, height:14 }}
              />
              Em compilação — exibir banner de "entrada incompleta"
            </label>
          </div>

          {/* Deity-only: epithet + sigil */}
          {type === 'deity' && (
            <div className="modal-field-row">
              <div className="modal-field">
                <label className="modal-label">Epíteto</label>
                <input className="modal-input" value={epithet} onChange={e => setEpithet(e.target.value)} placeholder="O que Sangra Luz" />
              </div>
              <div className="modal-field">
                <label className="modal-label">Sigilo (ID do ícone)</label>
                <input className="modal-input" value={sigil} onChange={e => setSigil(e.target.value)} placeholder="Chain, Dragon, Sun, Dawn..." />
              </div>
            </div>
          )}

          {/* Image */}
          <div className="modal-field">
            <label className="modal-label">
              {type === 'character' ? 'Retrato' : 'Imagem de destaque'}
            </label>
            <div style={{ display:'flex', alignItems:'center', gap:16, marginTop:8 }}>
              {imgPreview && (
                <img
                  src={imgPreview}
                  alt=""
                  style={{ width:72, height:72, objectFit:'cover', borderRadius:4, border:'1px solid var(--ink-line)', flexShrink:0 }}
                />
              )}
              <div>
                <button
                  type="button"
                  className="editor-add-btn"
                  style={{ padding:'7px 14px', fontSize:10 }}
                  onClick={() => imgInputRef.current && imgInputRef.current.click()}
                >
                  {imgPreview ? 'Trocar imagem' : 'Adicionar imagem'}
                </button>
                {imgPreview && (
                  <button
                    type="button"
                    style={{ marginLeft:8, padding:'7px 12px', fontSize:10, background:'transparent', border:'1px solid var(--wine)', color:'var(--wine-bright)', borderRadius:2, cursor:'pointer', fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.1em' }}
                    onClick={() => { setImgFile(null); setImgPreview(null); window._imageSlotSet(slotId, null); }}
                  >
                    Remover
                  </button>
                )}
                <input ref={imgInputRef} type="file" accept="image/png,image/jpeg,image/webp,image/avif" hidden onChange={handleImgChange} />
                <div className="modal-hint" style={{ marginTop:6 }}>
                  {imgFile ? 'Nova imagem selecionada — será enviada ao salvar.' : 'PNG, JPEG, WebP ou AVIF.'}
                </div>
              </div>
            </div>
          </div>

          {/* Hero quote */}
          <div className="modal-field">
            <label className="modal-label">Citação de abertura</label>
            <textarea className="modal-textarea" rows={3} value={hero} onChange={e => setHero(e.target.value)} placeholder="Frase que abre o artigo, exibida em destaque..." />
          </div>

          {/* Sections */}
          <div style={{ borderTop:'1px solid var(--ink-line)', paddingTop:18, marginTop:6 }}>
            <div style={subHead}>
              <span className="modal-label">Seções do Artigo</span>
              <button type="button" className="editor-add-btn" style={{ padding:'5px 14px', fontSize:10 }} onClick={addSection}>
                + Seção
              </button>
            </div>
            {sections.length === 0 && (
              <div style={{ textAlign:'center', padding:'20px 0', color:'var(--foam-dim)', fontFamily:'EB Garamond, serif', fontStyle:'italic', fontSize:14 }}>
                Nenhuma seção — clique em "+ Seção" para adicionar.
              </div>
            )}
            {sections.map((sec, i) => (
              <div key={i} style={sectionBox}>
                <div style={{ display:'flex', gap:8, marginBottom:10, alignItems:'center' }}>
                  <input
                    className="modal-input"
                    style={{ flex:1 }}
                    value={sec.title}
                    onChange={e => updateSection(i, 'title', e.target.value)}
                    placeholder="Título da seção (ex: Biografia)"
                  />
                  <button style={btnMove} onClick={() => moveSection(i, -1)} title="Mover para cima">↑</button>
                  <button style={btnMove} onClick={() => moveSection(i, 1)} title="Mover para baixo">↓</button>
                  <button style={btnRemove} onClick={() => removeSection(i)}>Remover</button>
                </div>
                {(type === 'character' || type === 'faction') && (
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginBottom:10 }}>
                    <div>
                      <label className="modal-label" style={{ marginBottom:4 }}>Olho (eyebrow)</label>
                      <input
                        className="modal-input"
                        value={sec.eyebrow}
                        onChange={e => updateSection(i, 'eyebrow', e.target.value)}
                        placeholder={type === 'faction' ? 'Ex: Intel Nível 1' : 'Ex: Primeiro Contato'}
                      />
                    </div>
                    {type === 'character' && (
                      <div>
                        <label className="modal-label" style={{ marginBottom:4 }}>Localização</label>
                        <input
                          className="modal-input"
                          value={sec.location}
                          onChange={e => updateSection(i, 'location', e.target.value)}
                          placeholder="Ex: Halensgard"
                        />
                      </div>
                    )}
                    {type === 'character' && (
                      <div>
                        <label className="modal-label" style={{ marginBottom:4 }}>Sessão</label>
                        <input
                          className="modal-input"
                          value={sec.session}
                          onChange={e => updateSection(i, 'session', e.target.value)}
                          placeholder="Ex: Sessão 12"
                        />
                      </div>
                    )}
                    {type === 'character' && (
                      <div>
                        <label className="modal-label" style={{ marginBottom:4 }}>Data (ficção)</label>
                        <input
                          className="modal-input"
                          value={sec.date}
                          onChange={e => updateSection(i, 'date', e.target.value)}
                          placeholder="Ex: 14 · Out · 1277"
                        />
                      </div>
                    )}
                    <div style={{ gridColumn:'1 / -1' }}>
                      <label className="modal-label" style={{ marginBottom:4 }}>Tags (separadas por vírgula)</label>
                      <input
                        className="modal-input"
                        value={sec.tags}
                        onChange={e => updateSection(i, 'tags', e.target.value)}
                        placeholder={type === 'faction' ? 'Ex: infiltração, política, magia' : 'Ex: encontro, intriga, traição'}
                      />
                      <div className="modal-hint" style={{ marginTop:4 }}>
                        {type === 'faction'
                          ? 'Sugestões: infiltração · sabotagem · política · aliança · ritual · segredo · operação'
                          : 'Sugestões: encontro · confronto · aliança · traição · missão · revelação · ritual · profecia'}
                      </div>
                    </div>
                    <div style={{ gridColumn:'1 / -1', display:'flex', alignItems:'center', gap:8 }}>
                      <input
                        type="checkbox"
                        id={'sec-redacted-' + i}
                        checked={sec.redacted}
                        onChange={e => updateSection(i, 'redacted', e.target.checked)}
                        style={{ width:13, height:13, flexShrink:0 }}
                      />
                      <label htmlFor={'sec-redacted-' + i} className="modal-label" style={{ marginBottom:0, cursor:'pointer' }}>
                        Seção redigida — marca [REDIGIDO] nos parágrafos
                      </label>
                    </div>
                  </div>
                )}
                <textarea
                  className="modal-textarea"
                  rows={4}
                  value={sec.paras}
                  onChange={e => updateSection(i, 'paras', e.target.value)}
                  placeholder="Texto da seção..."
                />
                <span className="modal-hint">Separe parágrafos com uma linha em branco.</span>
              </div>
            ))}
          </div>

          {/* Infobox rows + status note — não exibido para facções (gerenciado pelo FactionModal) */}
          {type !== 'faction' && (
            <React.Fragment>
              <div style={{ borderTop:'1px solid var(--ink-line)', paddingTop:18, marginTop:6 }}>
                <div style={subHead}>
                  <span className="modal-label">Infobox — Linhas de dados</span>
                  <button type="button" className="editor-add-btn" style={{ padding:'5px 14px', fontSize:10 }} onClick={addRow}>
                    + Linha
                  </button>
                </div>
                {rows.map((row, i) => (
                  <div key={i} style={{ display:'grid', gridTemplateColumns:'1fr 2fr 90px auto', gap:8, marginBottom:8, alignItems:'center' }}>
                    <input className="modal-input" value={row.k} onChange={e => updateRowField(i, 'k', e.target.value)} placeholder="Chave" />
                    <input className="modal-input" value={row.v} onChange={e => updateRowField(i, 'v', e.target.value)} placeholder="Valor" />
                    <select
                      className="modal-select"
                      value={row.danger ? 'danger' : row.ok ? 'ok' : 'normal'}
                      onChange={e => updateRowStyle(i, e.target.value)}
                    >
                      <option value="normal">Normal</option>
                      <option value="ok">✓ ok</option>
                      <option value="danger">⚠ perigo</option>
                    </select>
                    <button style={btnRemove} onClick={() => removeRow(i)}>✕</button>
                  </div>
                ))}
              </div>
              <div className="modal-field">
                <label className="modal-label">Nota de status (rodapé do infobox)</label>
                <textarea
                  className="modal-textarea"
                  rows={2}
                  value={statusNote}
                  onChange={e => setStatusNote(e.target.value)}
                  placeholder="Nota exibida no rodapé do infobox..."
                />
              </div>
            </React.Fragment>
          )}

          {/* Related */}
          <div style={{ borderTop:'1px solid var(--ink-line)', paddingTop:18, marginTop:6 }}>
            <div style={subHead}>
              <span className="modal-label">Cf. Relacionados</span>
              <button type="button" className="editor-add-btn" style={{ padding:'5px 14px', fontSize:10 }} onClick={addRelated}>
                + Link
              </button>
            </div>
            {related.map((rel, i) => (
              <div key={i} style={{ display:'grid', gridTemplateColumns:'90px 1fr 130px auto', gap:8, marginBottom:8, alignItems:'center' }}>
                <input className="modal-input" value={rel.tag} onChange={e => updateRelated(i, 'tag', e.target.value)} placeholder="Tag" />
                <input className="modal-input" value={rel.title} onChange={e => updateRelated(i, 'title', e.target.value)} placeholder="Título do link" />
                <input className="modal-input" value={rel.target} onChange={e => updateRelated(i, 'target', e.target.value)} placeholder="rota (ex: sessions)" />
                <button style={btnRemove} onClick={() => removeRelated(i)}>✕</button>
              </div>
            ))}
          </div>

          {err && <div className="modal-error">{err}</div>}
        </div>

        <div className="modal-foot">
          <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
          <button type="button" className="btn-save" disabled={busy} onClick={handleSave}>
            {busy ? 'Salvando…' : 'Salvar Artigo'}
          </button>
          <button type="button" className={`btn-delete${confirmDel ? ' confirm' : ''}`} disabled={busy} onClick={handleDelete}>
            {confirmDel ? 'Confirmar exclusão' : 'Apagar'}
          </button>
        </div>
      </div>
    </div>
  );
}

window.ArticleEditor = ArticleEditor;
