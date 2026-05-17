// Rich entity content — populated by DB.loadAll() at runtime

const Entities = {
  sessions:   {},
  characters: {},
  deities:    { ayael: null },
  factions:   {},
};

window.Entities = Entities;
