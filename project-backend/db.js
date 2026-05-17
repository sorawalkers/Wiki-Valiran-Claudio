// DB — Supabase CRUD layer (window.DB)
(() => {
  function dispatch() {
    window.dispatchEvent(new CustomEvent('db-refresh'));
  }

  async function loadAll() {
    if (!window.sb) return;

    const [sessRes, charRes, deityRes, tlRes, evRes] = await Promise.all([
      window.sb.from('sessions').select('*').order('num', { ascending: false }),
      window.sb.from('characters').select('*'),
      window.sb.from('deities').select('*'),
      window.sb.from('timeline_events').select('*').order('sort_order'),
      window.sb.from('events').select('*').order('sort_order'),
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
        desc: e.desc,
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

    dispatch();
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
      desc: data.desc || null,
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

  window.DB = {
    loadAll,
    saveSession, deleteSession,
    saveCharacter, deleteCharacter,
    saveDeity, deleteDeity,
    saveTimelineEvent, deleteTimelineEvent,
    saveEvent, deleteEvent,
  };
})();
