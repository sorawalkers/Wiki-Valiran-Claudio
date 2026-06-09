// DB — Supabase CRUD layer (window.DB)
(() => {
  function dispatch() {
    window.dispatchEvent(new CustomEvent('db-refresh'));
  }

  function buildFeed() {
    const items = [];

    function fmtDate(ts) {
      if (!ts) return '—';
      const d = new Date(ts);
      const months = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
      return `${d.getDate()} de ${months[d.getMonth()]}`;
    }
    function fmtTime(ts) {
      if (!ts) return '';
      const d = new Date(ts);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }
    function actionOf(created, updated) {
      if (!created || !updated) return 'edit';
      return Math.abs(new Date(updated) - new Date(created)) < 60000 ? 'new' : 'edit';
    }
    function push(entity_type, type_label, title, subtitle, target, created, updated) {
      if (!updated) return;
      const a = actionOf(created, updated);
      items.push({ entity_type, type_label, entry_type: a, action: a === 'new' ? 'NOVO' : 'EDIÇÃO',
        title, subtitle: subtitle || null, target: target || null,
        updated_at: updated, date_label: fmtDate(updated), time_label: fmtTime(updated) });
    }

    Object.values(Entities.deities || {}).forEach(d => {
      if (d && d.name) push('deity', 'Divindade', d.name, d.epithet, 'deity:' + d.id, d.created_at, d.updated_at);
    });
    (Data.charIds || []).forEach(id => {
      const c = Entities.characters[id];
      if (c) push('character', 'Personagem', c.name, c.role, 'character:' + c.id, c.created_at, c.updated_at);
    });
    (Data.sessionIds || []).forEach(num => {
      const s = Entities.sessions[num];
      if (s) push('session', 'Sessão', `S${s.num} · ${s.title}`, null, 'session:' + s.num, s.created_at, s.updated_at);
    });
    Object.values(Entities.factions || {}).forEach(f => {
      if (f) push('faction', 'Facção', f.name, f.alias, 'factions', f.created_at, f.updated_at);
    });
    (Data.kingdoms || []).forEach(k => {
      push('kingdom', 'Reino', k.name, k.eyebrow, 'kingdoms', k.created_at, k.updated_at);
    });
    (Data.houserules || []).forEach(r => {
      push('houserule', 'Regra da Casa', r.title, null, 'house-rules', r.created_at, r.updated_at);
    });
    (Data.systemEntries || []).forEach(e => {
      push('system', 'Sistema', e.title, e.date_short || e.date_long || null, 'sistema', e.created_at, e.updated_at);
    });

    items.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    return items;
  }

  async function loadAll() {
    if (!window.sb) return;

    // Reset entities so deletions are reflected in UI
    Entities.sessions   = {};
    Entities.characters = {};
    Entities.deities    = { ayael: null };
    Entities.factions   = {};
    Data.charIds    = [];
    Data.sessionIds = [];
    Data.timeline   = [];
    Data.events     = [];
    Data.houserules = [];
    Data.feed       = [];
    Data.kingdoms   = [];
    Data.systemEntries = [];
    Data.realms = [];
    const [sessRes, charRes, deityRes, tlRes, evRes, facRes, hrRes, kingRes, sysRes, realmRes, hexRes, cityRes, riverRes] = await Promise.all([
      window.sb.from('sessions').select('*').order('num', { ascending: false }),
      window.sb.from('characters').select('*'),
      window.sb.from('deities').select('*'),
      window.sb.from('timeline_events').select('*').order('sort_order'),
      window.sb.from('events').select('*').order('sort_order'),
      window.sb.from('factions').select('*').order('sort_order'),
      window.sb.from('houserules').select('*').order('sort_order'),
      window.sb.from('kingdoms').select('*').order('sort_order'),
      window.sb.from('system_entries').select('*').order('sort_order', { ascending: false }),
      window.sb.from('realms').select('*').order('sort_order'),
      window.sb.from('realm_hexes').select('*'),
      window.sb.from('realm_cities').select('*'),
      window.sb.from('realm_rivers').select('*'),
    ]);

    if (sessRes.data && sessRes.data.length > 0) {
      sessRes.data.forEach(s => {
        Entities.sessions[String(s.num)] = {
          _id: s.id,
          num: s.num,
          date: s.date,
          dateShort: s['dateShort'],
          title: s.title,
          location: s.location,
          locationDetail: s['locationDetail'],
          duration: s.duration,
          session_xp: s.session_xp,
          summary: s.summary,
          cast: s.cast || [],
          places: s.places || [],
          narrative: s.narrative || [],
          keypoints: s.keypoints || [],
          loot: s.loot || [],
          gmnote: s.gmnote,
          next: s.next,
          created_at: s.created_at || null,
          updated_at: s.updated_at || null,
        };
      });
      Data.sessionIds = sessRes.data.map(s => String(s.num));
    }

    if (charRes.data && charRes.data.length > 0) {
      charRes.data.forEach(c => {
        Entities.characters[c.id] = {
          _id: c.id,
          id: c.id,
          name: c.name,
          role: c.role,
          tag: c.tag,
          tagClass: c['tagClass'],
          infobox: c.infobox || { rows: [] },
          hero: c.hero,
          sections: c.sections || [],
          related: c.related || [],
          placeholder: c.placeholder || false,
          campaign: c.campaign || null,
          created_at: c.created_at || null,
          updated_at: c.updated_at || null,
        };
      });
      Data.charIds = charRes.data.map(c => c.id);
    }

    if (deityRes.data && deityRes.data.length > 0) {
      deityRes.data.forEach(d => {
        Entities.deities[d.id] = {
          id: d.id,
          name: d.name,
          epithet: d.epithet || null,
          sigil: d.sigil || null,
          infobox: d.infobox || { rows: [] },
          hero: d.hero || null,
          sections: d.sections || [],
          related: d.related || [],
          placeholder: d.placeholder || false,
          created_at: d.created_at || null,
          updated_at: d.updated_at || null,
        };
      });
    }

    if (tlRes.data && tlRes.data.length > 0) {
      Data.timeline = tlRes.data.map(e => ({
        _id: e.id,
        era: e.era || undefined,
        year: e.year,
        label: e.label,
        title: e.title,
        desc: e.description,
        tag: e.tag,
        kind: e.kind,
        sort_order: e.sort_order,
      }));
    }

    if (evRes.data && evRes.data.length > 0) {
      Data.events = evRes.data.map(e => ({
        _id: e.id,
        year: e.year,
        cat: e.cat,
        catLabel: e['catLabel'],
        title: e.title,
        desc: e.desc,
        region: e.region,
        target: e.target,
        sort_order: e.sort_order,
      }));
    }

    if (facRes.data) {
      facRes.data.forEach(f => {
        Entities.factions[f.id] = {
          id: f.id,
          name: f.name,
          alias: f.alias || null,
          stamp: f.stamp || null,
          stampClass: f.stamp_class || null,
          rows: f.rows || [],
          summary: f.summary || null,
          sort_order: f.sort_order || 0,
          created_at: f.created_at || null,
          updated_at: f.updated_at || null,
        };
      });
    }

    if (hrRes.data) {
      Data.houserules = hrRes.data.map(r => ({
        _id: r.id,
        id: r.id,
        title: r.title,
        paragraphs: r.paragraphs || [],
        callout_label: r.callout_label || null,
        callout_text: r.callout_text || null,
        sort_order: r.sort_order || 0,
        created_at: r.created_at || null,
        updated_at: r.updated_at || null,
      }));
    }

    if (kingRes.data) {
      Data.kingdoms = kingRes.data.map(k => ({
        _id:        k.id,
        sigil:      k.sigil || null,
        eyebrow:    k.eyebrow || null,
        name:       k.name,
        motto:      k.motto || null,
        desc:       k.desc || null,
        stats:      k.stats || [],
        target:     k.target || null,
        sort_order: k.sort_order || 0,
        created_at: k.created_at || null,
        updated_at: k.updated_at || null,
      }));
    }

    if (sysRes && !sysRes.error && sysRes.data) {
      Data.systemEntries = sysRes.data.map(e => ({
        _id:        e.id,
        id:         e.id,
        title:      e.title,
        date_long:  e.date_long  || null,
        date_short: e.date_short || null,
        compact:    !!e.compact,
        line:       e.line || null,
        body:       e.body || null,
        sort_order: e.sort_order || 0,
        created_at: e.created_at || null,
        updated_at: e.updated_at || null,
      }));
    }

    if (realmRes.data && hexRes.data && cityRes.data) {
      const hexesByRealm = {};
      hexRes.data.forEach(h => {
        if (!hexesByRealm[h.realm_id]) hexesByRealm[h.realm_id] = [];
        hexesByRealm[h.realm_id].push({ id: h.id, q: h.q, r: h.r, biome: h.biome || 'plain' });
      });
      const citiesByRealm = {};
      cityRes.data.forEach(c => {
        if (!citiesByRealm[c.realm_id]) citiesByRealm[c.realm_id] = [];
        citiesByRealm[c.realm_id].push({ id: c.id, q: c.q, r: c.r, kind: c.kind, name: c.name, critical: c.critical || false });
      });
      Data.realms = realmRes.data.map(r => ({
        id:           r.id,
        slug:         r.slug,
        name:         r.name,
        short:        r.short,
        eyebrow:      r.eyebrow || null,
        sigil:        r.sigil || null,
        motto:        r.motto || null,
        desc:         r.desc || null,
        accent:       r.accent,
        accentDeep:   r.accent_deep,
        cursed:       r.cursed || false,
        capitalQ:     r.capital_q,
        capitalR:     r.capital_r,
        capitalName:  r.capital_name || null,
        stats6:       r.stats6 || {},
        resources:    r.resources || [],
        sort_order:   r.sort_order || 0,
        hexes:        hexesByRealm[r.id] || [],
        cities:       citiesByRealm[r.id] || [],
      }));
    }
    Data.rivers = (riverRes && riverRes.data) ? riverRes.data.map(r => ({
      id:     r.id,
      name:   r.name,
      width:  r.width || 3,
      points: r.points || [],
      delta:  r.delta || [],
    })) : [];

    Data.feed = buildFeed();
    dispatch();
  }

  async function loadRealms() {
    if (!window.sb) return;
    const [realmRes, hexRes, cityRes, riverRes] = await Promise.all([
      window.sb.from('realms').select('*').order('sort_order'),
      window.sb.from('realm_hexes').select('*'),
      window.sb.from('realm_cities').select('*'),
      window.sb.from('realm_rivers').select('*'),
    ]);
    if (realmRes.data && hexRes.data && cityRes.data) {
      const hexesByRealm = {};
      hexRes.data.forEach(h => {
        if (!hexesByRealm[h.realm_id]) hexesByRealm[h.realm_id] = [];
        hexesByRealm[h.realm_id].push({ id: h.id, q: h.q, r: h.r, biome: h.biome || 'plain' });
      });
      const citiesByRealm = {};
      cityRes.data.forEach(c => {
        if (!citiesByRealm[c.realm_id]) citiesByRealm[c.realm_id] = [];
        citiesByRealm[c.realm_id].push({ id: c.id, q: c.q, r: c.r, kind: c.kind, name: c.name, critical: c.critical || false });
      });
      Data.realms = realmRes.data.map(r => ({
        id:           r.id,
        slug:         r.slug,
        name:         r.name,
        short:        r.short,
        eyebrow:      r.eyebrow || null,
        sigil:        r.sigil || null,
        motto:        r.motto || null,
        desc:         r.desc || null,
        accent:       r.accent,
        accentDeep:   r.accent_deep,
        cursed:       r.cursed || false,
        capitalQ:     r.capital_q,
        capitalR:     r.capital_r,
        capitalName:  r.capital_name || null,
        stats6:       r.stats6 || {},
        resources:    r.resources || [],
        sort_order:   r.sort_order || 0,
        hexes:        hexesByRealm[r.id] || [],
        cities:       citiesByRealm[r.id] || [],
      }));
    }
    Data.rivers = (riverRes && riverRes.data) ? riverRes.data.map(r => ({
      id: r.id, name: r.name, width: r.width || 3, points: r.points || [], delta: r.delta || [],
    })) : [];
    dispatch();
  }

  async function saveRealm(data) {
    const payload = {
      slug:         data.slug,
      name:         data.name,
      short:        data.short,
      eyebrow:      data.eyebrow || null,
      sigil:        data.sigil || null,
      motto:        data.motto || null,
      desc:         data.desc || null,
      accent:       data.accent || '#888888',
      accent_deep:  data.accentDeep || '#222222',
      cursed:       data.cursed || false,
      capital_q:    data.capitalQ != null ? data.capitalQ : null,
      capital_r:    data.capitalR != null ? data.capitalR : null,
      capital_name: data.capitalName || null,
      stats6:       data.stats6 || {},
      resources:    data.resources || [],
      sort_order:   data.sort_order || 0,
      updated_at:   new Date().toISOString(),
    };
    let res;
    if (data.id) {
      res = await window.sb.from('realms').update(payload).eq('id', data.id);
    } else {
      res = await window.sb.from('realms').insert(payload);
    }
    if (res.error) throw res.error;
    await loadRealms();
  }

  async function deleteRealm(id) {
    const res = await window.sb.from('realms').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadRealms();
  }

  async function saveHex(realmId, q, r, biome) {
    const res = await window.sb.from('realm_hexes')
      .upsert({ realm_id: realmId, q, r, biome: biome || 'plain' }, { onConflict: 'q,r' });
    if (res.error) throw res.error;
  }

  async function removeHex(q, r) {
    const res = await window.sb.from('realm_hexes').delete().eq('q', q).eq('r', r);
    if (res.error) throw res.error;
  }

  async function saveCity(data) {
    const payload = {
      realm_id: data.realmId,
      q:        data.q,
      r:        data.r,
      kind:     data.kind,
      name:     data.name,
      critical: data.critical || false,
    };
    let res;
    if (data.id) {
      res = await window.sb.from('realm_cities').update(payload).eq('id', data.id);
    } else {
      res = await window.sb.from('realm_cities').insert(payload);
    }
    if (res.error) throw res.error;
  }

  async function removeCity(id) {
    const res = await window.sb.from('realm_cities').delete().eq('id', id);
    if (res.error) throw res.error;
  }

  async function saveCampaignArticle(data) {
    const payload = {
      id: data.id,
      name: data.title,
      role: data.subtitle || null,
      tag: 'ARTICLE',
      tagClass: null,
      infobox: data.infobox || { rows: [] },
      sections: data.sections || [],
      related: data.related || [],
      hero: null,
      placeholder: false,
      campaign: null,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('characters').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveSession(data) {
    const payload = {
      num: parseInt(data.num),
      date: data.date || null,
      dateShort: data.dateShort || null,
      title: data.title,
      location: data.location || null,
      locationDetail: data.locationDetail || null,
      duration: data.duration || null,
      session_xp: data.session_xp || null,
      summary: data.summary || null,
      cast: data.cast || [],
      places: data.places || [],
      narrative: data.narrative || [],
      keypoints: data.keypoints || [],
      loot: data.loot || [],
      gmnote: data.gmnote || null,
      next: data.next || null,
      updated_at: new Date().toISOString(),
    };

    let res;
    if (data._id) {
      res = await window.sb.from('sessions').update(payload).eq('id', data._id);
    } else {
      res = await window.sb.from('sessions').insert(payload);
    }
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteSession(dbId) {
    const res = await window.sb.from('sessions').delete().eq('id', dbId);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveCharacter(data) {
    const payload = {
      id: data.id,
      name: data.name,
      role: data.role || null,
      tag: data.tag || null,
      tagClass: data.tagClass || null,
      infobox: data.infobox || { rows: [] },
      hero: data.hero || null,
      sections: data.sections || [],
      related: data.related || [],
      placeholder: data.placeholder || false,
      campaign: data.campaign || null,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('characters').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteCharacter(id) {
    const res = await window.sb.from('characters').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveDeity(data) {
    const payload = {
      id: data.id,
      name: data.name,
      epithet: data.epithet || null,
      sigil: data.sigil || null,
      infobox: data.infobox || { rows: [] },
      hero: data.hero || null,
      sections: data.sections || [],
      related: data.related || [],
      placeholder: data.placeholder || false,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('deities').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteDeity(id) {
    const res = await window.sb.from('deities').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveTimelineEvent(data) {
    const payload = {
      era: data.era || null,
      year: data.year || null,
      label: data.label || null,
      title: data.title || null,
      description: data.desc || null,
      tag: data.tag || null,
      kind: data.kind || null,
      sort_order: parseInt(data.sort_order) || 0,
    };
    let res;
    if (data._id) {
      res = await window.sb.from('timeline_events').update(payload).eq('id', data._id);
    } else {
      res = await window.sb.from('timeline_events').insert(payload);
    }
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteTimelineEvent(dbId) {
    const res = await window.sb.from('timeline_events').delete().eq('id', dbId);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveEvent(data) {
    const catLabels = { div: 'Divino', pol: 'Político', cata: 'Catástrofe', arc: 'Arcano' };
    const payload = {
      year: data.year || null,
      cat: data.cat || null,
      catLabel: data.catLabel || catLabels[data.cat] || data.cat,
      title: data.title,
      desc: data.desc || null,
      region: data.region || null,
      target: data.target || null,
      sort_order: parseInt(data.sort_order) || 0,
    };
    let res;
    if (data._id) {
      res = await window.sb.from('events').update(payload).eq('id', data._id);
    } else {
      res = await window.sb.from('events').insert(payload);
    }
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteEvent(dbId) {
    const res = await window.sb.from('events').delete().eq('id', dbId);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveFaction(data) {
    const payload = {
      id: data.id,
      name: data.name,
      alias: data.alias || null,
      stamp: data.stamp || null,
      stamp_class: data.stampClass || null,
      rows: data.rows || [],
      summary: data.summary || null,
      sort_order: parseInt(data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('factions').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteFaction(id) {
    const res = await window.sb.from('factions').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveHouseRule(data) {
    const payload = {
      id: data.id,
      title: data.title,
      paragraphs: data.paragraphs || [],
      callout_label: data.callout_label || null,
      callout_text: data.callout_text || null,
      sort_order: parseInt(data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('houserules').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteHouseRule(id) {
    const res = await window.sb.from('houserules').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveKingdom(data) {
    const payload = {
      sigil:      data.sigil      || null,
      eyebrow:    data.eyebrow    || null,
      name:       data.name,
      motto:      data.motto      || null,
      desc:       data.desc       || null,
      stats:      data.stats      || [],
      target:     data.target     || null,
      sort_order: parseInt(data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    let res;
    if (data._id) {
      res = await window.sb.from('kingdoms').update(payload).eq('id', data._id);
    } else {
      res = await window.sb.from('kingdoms').insert(payload);
    }
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteKingdom(id) {
    const res = await window.sb.from('kingdoms').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  async function saveSystemEntry(data) {
    const payload = {
      id:         data.id,
      title:      data.title,
      date_long:  data.date_long  || null,
      date_short: data.date_short || null,
      compact:    !!data.compact,
      line:       data.line || null,
      body:       data.body || null,
      sort_order: parseInt(data.sort_order) || 0,
      updated_at: new Date().toISOString(),
    };
    const res = await window.sb.from('system_entries').upsert(payload, { onConflict: 'id' });
    if (res.error) throw res.error;
    await loadAll();
  }

  async function deleteSystemEntry(id) {
    const res = await window.sb.from('system_entries').delete().eq('id', id);
    if (res.error) throw res.error;
    await loadAll();
  }

  window.DB = {
    loadAll,
    saveSession, deleteSession,
    saveCharacter, deleteCharacter,
    saveDeity, deleteDeity,
    saveFaction, deleteFaction,
    saveTimelineEvent, deleteTimelineEvent,
    saveEvent, deleteEvent,
    saveHouseRule, deleteHouseRule,
    saveKingdom, deleteKingdom,
    saveSystemEntry, deleteSystemEntry,
    saveCampaignArticle,
    loadRealms, saveRealm, deleteRealm,
    saveHex, removeHex,
    saveCity, removeCity,
  };
})();
