// Image Upload — Supabase Storage integration for image-slot elements
// Provides cloud persistence for images dropped into image-slot elements.
// Works together with image-slot.js — depends on window._imageSlotSet
// which image-slot.js exposes for external slot injection.
(() => {
  async function loadSlots() {
    if (!window.sb || !window._imageSlotSet) return;
    const { data } = await window.sb.from('image_slots').select('id, url');
    if (!data || !data.length) return;
    data.forEach(({ id, url }) => {
      window._imageSlotSet(id, { u: url, s: 1, x: 0, y: 0 });
    });
  }

  async function uploadImage(file, slotId) {
    if (!window.sb) throw new Error('Supabase não inicializado');
    const ext = (file.name.split('.').pop() || 'webp').toLowerCase().replace('jpeg', 'jpg');
    const path = `slots/${slotId}.${ext}`;

    const { error: upErr } = await window.sb.storage
      .from('media')
      .upload(path, file, { upsert: true, contentType: file.type || 'image/webp' });
    if (upErr) throw upErr;

    const { data: { publicUrl } } = window.sb.storage.from('media').getPublicUrl(path);

    const { error: dbErr } = await window.sb.from('image_slots').upsert({
      id: slotId,
      url: publicUrl,
      updated_at: new Date().toISOString(),
    });
    if (dbErr) throw dbErr;

    return publicUrl;
  }

  window.ImageUpload = { loadSlots, uploadImage };
})();
