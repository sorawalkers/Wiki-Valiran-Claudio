// Deity sigil image — uploadable replacement for the SVG sigils.
// Renders an uploaded image when one exists for `deity-sigil-${id}`,
// otherwise falls back to the SVG Sigil for that deity (or its type key).
//
// When `interactive` is true and the viewer is an editor, clicking the
// sigil opens a file picker and uploads through ImageUpload — same path
// as the hero image. Image-slot state changes are bridged to React via a
// `image-slot-changed` window event (patched onto _imageSlotSet below).

(function patchImageSlotSet() {
  // Guard re-runs (Babel can re-execute script blocks during hot updates).
  if (window._imageSlotSet && !window._imageSlotSet._patchedForEvents) {
    const orig = window._imageSlotSet;
    const patched = function (id, val) {
      orig(id, val);
      try {
        window.dispatchEvent(new CustomEvent('image-slot-changed', { detail: { id, val } }));
      } catch (_) { /* noop */ }
    };
    patched._patchedForEvents = true;
    window._imageSlotSet = patched;
  }
})();

// React hook — current URL stored for `slotId`, refreshed on slot changes
// and after every DB load (in case the sidecar hadn't resolved on mount).
function useSlotImageUrl(slotId) {
  const read = React.useCallback(() => {
    if (!slotId || !window._imageSlotGet) return null;
    const v = window._imageSlotGet(slotId);
    return (v && v.u) || null;
  }, [slotId]);

  const [url, setUrl] = React.useState(read);

  React.useEffect(() => {
    const recheck = (e) => {
      // For image-slot-changed events, only re-read if it's our id.
      if (e && e.type === 'image-slot-changed' && e.detail && e.detail.id && e.detail.id !== slotId) return;
      setUrl(read());
    };
    recheck();
    window.addEventListener('image-slot-changed', recheck);
    window.addEventListener('db-refresh', recheck);
    return () => {
      window.removeEventListener('image-slot-changed', recheck);
      window.removeEventListener('db-refresh', recheck);
    };
  }, [slotId, read]);

  return url;
}

// ─── Component ──────────────────────────────────────────────────────────────
function DeitySigilImage({ deity, size, interactive }) {
  const slotId = `deity-sigil-${deity.id}`;
  const url = useSlotImageUrl(slotId);
  const auth = (typeof useAuth === 'function') ? useAuth() : { isEditor: false };
  const fileRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const editable = !!(interactive && auth.isEditor);

  async function handleFile(e) {
    const f = e.target.files && e.target.files[0];
    e.target.value = '';
    if (!f) return;
    if (!window.ImageUpload) {
      setErr('Upload indisponível');
      return;
    }
    setBusy(true);
    setErr('');
    try {
      const publicUrl = await window.ImageUpload.uploadImage(f, slotId);
      window._imageSlotSet(slotId, { u: publicUrl, s: 1, x: 0, y: 0 });
    } catch (ex) {
      setErr(ex.message || 'Falha no envio');
      setTimeout(() => setErr(''), 4000);
    } finally {
      setBusy(false);
    }
  }

  function handleRemove(e) {
    e.stopPropagation();
    if (!editable) return;
    if (!confirm('Remover este sigilo?')) return;
    // Clear sidecar entry AND wipe the storage row if available.
    window._imageSlotSet(slotId, null);
    if (window.sb) {
      window.sb.from('image_slots').delete().eq('id', slotId).then(() => {});
    }
  }

  const Icon = Sigil[deity.id] || (deity.sigil && Sigil[deity.sigil]);

  // Plain display in pantheon cards — no interactive overlay needed.
  if (!editable) {
    return (
      <div className={`deity-sigil-render size-${size || 'card'}`}>
        {url
          ? <img src={url} alt={'Sigilo de ' + deity.name} className="deity-sigil-photo" />
          : (Icon ? <Icon style={{ width:'100%', height:'100%' }} /> : null)}
      </div>
    );
  }

  // Editor + interactive: clickable wrapper with hover overlay.
  return (
    <div
      className={`deity-sigil-render size-${size || 'card'} editable${busy ? ' busy' : ''}`}
      onClick={() => fileRef.current && fileRef.current.click()}
      role="button"
      tabIndex={0}
      title={url ? 'Clique para trocar o sigilo' : 'Clique para enviar um sigilo'}
    >
      {url
        ? <img src={url} alt={'Sigilo de ' + deity.name} className="deity-sigil-photo" />
        : (Icon ? <Icon style={{ width:'100%', height:'100%' }} /> : null)}

      <div className="deity-sigil-overlay">
        <span className="deity-sigil-overlay-text">
          {busy ? 'Enviando…' : (url ? 'Trocar sigilo' : 'Enviar sigilo')}
        </span>
        {url && !busy && (
          <button
            type="button"
            className="deity-sigil-remove-btn"
            onClick={handleRemove}
            title="Remover sigilo"
          >
            Remover
          </button>
        )}
      </div>

      {err && <div className="deity-sigil-error">{err}</div>}

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif,image/svg+xml"
        hidden
        onChange={handleFile}
      />
    </div>
  );
}

window.DeitySigilImage = DeitySigilImage;
window.useSlotImageUrl = useSlotImageUrl;
