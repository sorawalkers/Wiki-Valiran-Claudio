// PDF export — builds a real, selectable-text PDF client-side with jsPDF
// instead of going through the browser's print dialog. Each content type
// (character/NPC, deity, session, house rules, ...) has its own layout
// template below, driven by the same data already loaded into
// window.Entities / window.Data. Pages without a dedicated template fall
// back to a generic text dump of whatever is on screen.

(function () {
  const COLORS = {
    ink: [26, 18, 8],        // dark ink — body text
    inkSoft: [90, 78, 54],   // muted ink — meta / captions
    wine: [107, 26, 38],     // accent — eyebrows, section titles
    gold: [122, 92, 46],     // darkened gold — rules, dividers
    ok: [63, 107, 42],
    danger: [140, 37, 53],
    footer: [150, 140, 120],
  };

  const PAGE = { w: 210, h: 297, margin: 20 };
  const CONTENT_W = PAGE.w - PAGE.margin * 2;
  const LABEL_W = 42;

  function slugify(s) {
    return (s || 'documento')
      .toString().toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'documento';
  }

  // The app hides redacted content by embedding a literal "[REDIGIDO]"
  // token in the text itself (see npRenderRedacted in pages/npc-detail.jsx).
  // Mirror that redaction in the PDF instead of ever printing it plain.
  // jsPDF's standard (non-embedded) fonts only support the WinAnsi
  // charset, which has no solid block glyph — an em dash run reads as
  // a redaction bar and is guaranteed to render correctly everywhere.
  const REDACT_BAR = '——————————';
  function redact(text) {
    if (!text) return text;
    return String(text).split('[REDIGIDO]').join(REDACT_BAR);
  }

  function newCtx() {
    const doc = new window.jspdf.jsPDF({ unit: 'mm', format: 'a4' });
    doc.setProperties({ title: 'O Arquivo de Valiran' });
    return { doc, y: PAGE.margin };
  }

  function ensureSpace(ctx, needed) {
    if (ctx.y + needed > PAGE.h - PAGE.margin) {
      ctx.doc.addPage();
      ctx.y = PAGE.margin;
    }
  }

  function eyebrow(ctx, text) {
    if (!text) return;
    ensureSpace(ctx, 8);
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(9);
    ctx.doc.setTextColor(...COLORS.wine);
    ctx.doc.text(String(text).toUpperCase(), PAGE.margin, ctx.y);
    ctx.y += 6;
  }

  function title(ctx, text) {
    ctx.doc.setFont('times', 'bold');
    ctx.doc.setFontSize(22);
    ctx.doc.setTextColor(...COLORS.ink);
    const lines = ctx.doc.splitTextToSize(text || 'Sem título', CONTENT_W);
    lines.forEach(line => {
      ensureSpace(ctx, 9);
      ctx.doc.text(line, PAGE.margin, ctx.y);
      ctx.y += 9;
    });
    ctx.y += 1;
  }

  function subtitle(ctx, text) {
    if (!text) return;
    ensureSpace(ctx, 8);
    ctx.doc.setFont('times', 'italic');
    ctx.doc.setFontSize(12);
    ctx.doc.setTextColor(...COLORS.inkSoft);
    ctx.doc.text(text, PAGE.margin, ctx.y);
    ctx.y += 8;
  }

  function divider(ctx) {
    ensureSpace(ctx, 6);
    ctx.doc.setDrawColor(...COLORS.gold);
    ctx.doc.setLineWidth(0.4);
    ctx.doc.line(PAGE.margin, ctx.y, PAGE.margin + CONTENT_W, ctx.y);
    ctx.y += 7;
  }

  function sectionTitle(ctx, text) {
    if (!text) return;
    ensureSpace(ctx, 11);
    ctx.doc.setFont('times', 'bold');
    ctx.doc.setFontSize(14);
    ctx.doc.setTextColor(...COLORS.wine);
    ctx.doc.text(text, PAGE.margin, ctx.y);
    ctx.y += 7;
  }

  function meta(ctx, parts) {
    const text = (parts || []).filter(Boolean).join('   ·   ');
    if (!text) return;
    ensureSpace(ctx, 7);
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(9);
    ctx.doc.setTextColor(...COLORS.inkSoft);
    ctx.doc.text(text, PAGE.margin, ctx.y);
    ctx.y += 7;
  }

  function tagList(ctx, list) {
    if (!list || !list.length) return;
    ensureSpace(ctx, 6);
    ctx.doc.setFont('helvetica', 'bold');
    ctx.doc.setFontSize(8);
    ctx.doc.setTextColor(...COLORS.wine);
    ctx.doc.text(list.join('   '), PAGE.margin, ctx.y);
    ctx.y += 7;
  }

  function paragraph(ctx, text, opts) {
    opts = opts || {};
    if (!text) return;
    ctx.doc.setFont('times', opts.italic ? 'italic' : 'normal');
    ctx.doc.setFontSize(opts.size || 11);
    ctx.doc.setTextColor(...(opts.color || COLORS.ink));
    const lines = ctx.doc.splitTextToSize(redact(text), CONTENT_W);
    lines.forEach(line => {
      ensureSpace(ctx, 6);
      ctx.doc.text(line, PAGE.margin, ctx.y);
      ctx.y += 5.6;
    });
    ctx.y += 2.5;
  }

  function bullet(ctx, text, opts) {
    opts = opts || {};
    if (!text) return;
    ctx.doc.setFont('times', 'normal');
    ctx.doc.setFontSize(10.5);
    ctx.doc.setTextColor(...(opts.danger ? COLORS.danger : COLORS.ink));
    const lines = ctx.doc.splitTextToSize('•  ' + text, CONTENT_W - 4);
    lines.forEach((line, i) => {
      ensureSpace(ctx, 6);
      ctx.doc.text(line, PAGE.margin + (i === 0 ? 0 : 5), ctx.y);
      ctx.y += 5.4;
    });
  }

  function chipRow(ctx, list) {
    if (!list || !list.length) return;
    ctx.doc.setFont('helvetica', 'normal');
    ctx.doc.setFontSize(9);
    ctx.doc.setTextColor(...COLORS.inkSoft);
    const lines = ctx.doc.splitTextToSize(list.join('   ·   '), CONTENT_W);
    lines.forEach(line => {
      ensureSpace(ctx, 6);
      ctx.doc.text(line, PAGE.margin, ctx.y);
      ctx.y += 5.4;
    });
    ctx.y += 2;
  }

  function infobox(ctx, box) {
    if (!box) return;
    const rows = box.rows || [];
    if (rows.length === 0 && !box.statusNote) return;
    ctx.y += 1;
    sectionTitle(ctx, 'Ficha');
    rows.forEach(r => {
      const value = r.redacted ? REDACT_BAR : redact(r.v);
      ctx.doc.setFont('times', 'normal');
      ctx.doc.setFontSize(10.5);
      const lines = ctx.doc.splitTextToSize(String(value == null ? '' : value), CONTENT_W - LABEL_W);
      const rowH = Math.max(5.4, lines.length * 5);
      ensureSpace(ctx, rowH + 1);

      ctx.doc.setFont('helvetica', 'bold');
      ctx.doc.setFontSize(8.5);
      ctx.doc.setTextColor(...COLORS.inkSoft);
      ctx.doc.text(String(r.k || '').toUpperCase(), PAGE.margin, ctx.y);

      ctx.doc.setFont('times', 'normal');
      ctx.doc.setFontSize(10.5);
      ctx.doc.setTextColor(...(r.danger ? COLORS.danger : r.ok ? COLORS.ok : COLORS.ink));
      lines.forEach((line, i) => {
        ctx.doc.text(line, PAGE.margin + LABEL_W, ctx.y + i * 5);
      });
      ctx.y += rowH + 2;
    });
    if (box.statusNote) {
      ensureSpace(ctx, 10);
      ctx.doc.setFont('helvetica', 'bold');
      ctx.doc.setFontSize(8);
      ctx.doc.setTextColor(...COLORS.wine);
      ctx.doc.text('NOTA', PAGE.margin, ctx.y);
      ctx.y += 5;
      paragraph(ctx, box.statusNote, { size: 10, italic: true, color: COLORS.inkSoft });
    }
    ctx.y += 2;
  }

  function addFooter(doc) {
    const total = doc.internal.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(...COLORS.footer);
      doc.text('O Arquivo de Valiran', PAGE.margin, PAGE.h - 10);
      doc.text(i + ' / ' + total, PAGE.w - PAGE.margin, PAGE.h - 10, { align: 'right' });
    }
  }

  function save(ctx, filename) {
    addFooter(ctx.doc);
    ctx.doc.save(filename);
  }

  // ---- Per-content-type templates ------------------------------------
  // "Dossiê" shape: name + optional role/alias, hero blurb, an infobox
  // (key/value rows), and a list of expandable report sections. Shared
  // by characters, NPCs and factions.
  function dossierTemplate({ kind, entity }) {
    const ctx = newCtx();
    eyebrow(ctx, kind + (entity.id ? ' · ' + entity.id : ''));
    title(ctx, entity.name);
    subtitle(ctx, entity.role || entity.alias);
    divider(ctx);
    if (entity.hero) paragraph(ctx, entity.hero, { italic: true, size: 11.5, color: COLORS.inkSoft });

    infobox(ctx, entity.infobox);

    (entity.sections || []).forEach(sec => {
      ctx.y += 2;
      sectionTitle(ctx, sec.title);
      meta(ctx, [sec.eyebrow, sec.location, sec.session, sec.date]);
      tagList(ctx, sec.tags);
      (sec.paras || []).forEach(p => paragraph(ctx, p));
    });

    save(ctx, slugify(entity.name) + '.pdf');
  }

  // "Prose" shape: name + epithet, hero blurb, infobox, and a linear list
  // of title+paragraphs sections (no per-section metadata). Used by deities.
  function proseTemplate({ kind, entity }) {
    const ctx = newCtx();
    eyebrow(ctx, kind);
    title(ctx, entity.name);
    subtitle(ctx, entity.epithet);
    divider(ctx);
    if (entity.hero) paragraph(ctx, entity.hero, { italic: true, size: 11.5, color: COLORS.inkSoft });

    infobox(ctx, entity.infobox);

    (entity.sections || []).forEach(sec => {
      ctx.y += 2;
      sectionTitle(ctx, sec.title);
      (sec.paras || []).forEach(p => paragraph(ctx, p));
    });

    save(ctx, slugify(entity.name) + '.pdf');
  }

  function sessionTemplate(s) {
    const ctx = newCtx();
    eyebrow(ctx, 'Sessão ' + String(s.num).padStart(2, '0'));
    title(ctx, s.title);
    meta(ctx, [s.date, s.location]);
    if (s.locationDetail) subtitle(ctx, s.locationDetail);
    divider(ctx);

    if (s.summary) {
      sectionTitle(ctx, 'Resumo');
      paragraph(ctx, s.summary, { italic: true });
    }
    if (s.cast && s.cast.length) {
      sectionTitle(ctx, 'Elenco da Sessão');
      chipRow(ctx, s.cast);
    }
    if (s.places && s.places.length) {
      sectionTitle(ctx, 'Lugares Visitados');
      chipRow(ctx, s.places);
    }
    if (s.narrative && s.narrative.length) {
      sectionTitle(ctx, 'Narrativa');
      s.narrative.forEach(p => paragraph(ctx, p));
    }
    if (s.keypoints && s.keypoints.length) {
      sectionTitle(ctx, 'Pontos-Chave');
      s.keypoints.forEach(k => bullet(ctx, k.text, { danger: k.danger }));
    }

    save(ctx, 'sessao-' + String(s.num).padStart(2, '0') + '.pdf');
  }

  function houseRulesTemplate() {
    const ctx = newCtx();
    eyebrow(ctx, 'Compêndio');
    title(ctx, 'Regras da Casa');
    divider(ctx);
    (window.Data && window.Data.houserules || []).forEach(r => {
      sectionTitle(ctx, r.title);
      (r.paragraphs || []).forEach(p => paragraph(ctx, p));
      if (r.callout_text) {
        ensureSpace(ctx, 10);
        if (r.callout_label) {
          ctx.doc.setFont('helvetica', 'bold');
          ctx.doc.setFontSize(8);
          ctx.doc.setTextColor(...COLORS.wine);
          ctx.doc.text(r.callout_label.toUpperCase(), PAGE.margin, ctx.y);
          ctx.y += 5;
        }
        paragraph(ctx, r.callout_text, { italic: true, color: COLORS.inkSoft });
      }
      ctx.y += 3;
    });
    save(ctx, 'regras-da-casa.pdf');
  }

  // Fallback for pages with no dedicated template above (portal, timeline,
  // map, list pages, ...): there's no single structured record behind
  // those, so this reads the headings/paragraphs currently rendered on
  // screen instead. Extend the switch in exportCurrentPage() with a real
  // template for any page that deserves a purpose-built layout.
  function genericTemplate(routeKey) {
    const root = document.querySelector('[data-screen-label]') || document.querySelector('.main');
    if (!root) return alertNoContent();

    const label = root.getAttribute('data-screen-label') || document.title || 'O Arquivo de Valiran';
    const ctx = newCtx();
    title(ctx, label);
    divider(ctx);

    const seen = new Set();
    root.querySelectorAll('h1, h2, h3, p, li').forEach(el => {
      if (el.closest('.np-toolbar, .np-tag-filter, .back-btn, .editor-add-btn, .breadcrumb, .infobox-rail, button')) return;
      const text = el.textContent.replace(/\s+/g, ' ').trim();
      if (!text || seen.has(text) || text === label) return;
      seen.add(text);
      if (el.tagName === 'H1') return;
      if (el.tagName === 'H2' || el.tagName === 'H3') sectionTitle(ctx, text);
      else if (el.tagName === 'LI') bullet(ctx, text);
      else paragraph(ctx, text);
    });

    if (seen.size === 0) {
      paragraph(ctx, 'Esta página não possui um modelo de exportação dedicado ainda, e nenhum texto pôde ser lido da tela.', { italic: true, color: COLORS.inkSoft });
    }

    save(ctx, slugify(label) + '.pdf');
  }

  function alertNoContent() {
    window.alert('Não foi possível localizar o conteúdo desta página para exportar.');
  }

  // ---- Entry point -----------------------------------------------------

  function exportCurrentPage(routeKey) {
    if (!window.jspdf || !window.jspdf.jsPDF) {
      window.alert('A biblioteca de exportação de PDF ainda não carregou. Tente novamente em instantes.');
      return;
    }
    const [page, entityId] = String(routeKey || '').split(':');
    try {
      switch (page) {
        case 'character':
        case 'npc': {
          const c = (window.Entities.characters || {})[entityId];
          if (!c) return alertNoContent();
          return dossierTemplate({ kind: c.tag === 'PC' ? 'Personagem' : 'NPC', entity: c });
        }
        case 'faction': {
          const f = (window.Entities.factions || {})[entityId];
          if (!f) return alertNoContent();
          return dossierTemplate({ kind: 'Facção', entity: Object.assign({}, f, { infobox: { rows: f.rows } }) });
        }
        case 'deity': {
          const d = (window.Entities.deities || {})[entityId];
          if (!d) return alertNoContent();
          return proseTemplate({ kind: 'Divindade', entity: d });
        }
        case 'session': {
          const s = (window.Entities.sessions || {})[entityId];
          if (!s) return alertNoContent();
          return sessionTemplate(s);
        }
        case 'house-rules':
          return houseRulesTemplate();
        default:
          return genericTemplate(routeKey);
      }
    } catch (e) {
      console.error('[PdfExport] failed to build PDF:', e);
      window.alert('Não foi possível gerar o PDF desta página.');
    }
  }

  window.PdfExport = { export: exportCurrentPage };
})();
