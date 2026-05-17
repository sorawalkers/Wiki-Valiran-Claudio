// Main app — page routing + tweaks

const { useState: useStateApp, useEffect: useEffectApp, useCallback: useCallbackApp } = React;

// Custom palette picker: shows 3 named heraldic palettes as a row of swatches
const PALETTES = [
  { id: 'wine',   name: 'Vinho',  colors: ['#b89968', '#6b1a26', '#e8dcc4'] },
  { id: 'planar', name: 'Planar', colors: ['#9c86c4', '#3d2a5a', '#d8d0e4'] },
  { id: 'necro',  name: 'Necro',  colors: ['#8a9c6a', '#2a3a1a', '#d8dcc4'] },
];

function PalettePicker({ value, onChange }) {
  return (
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:8, padding:'4px 0 8px'}}>
      {PALETTES.map(p => {
        const active = value === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() => onChange(p.id)}
            style={{
              padding:0,
              border: '1px solid ' + (active ? '#b89968' : '#3a3a44'),
              background: '#0e0d10',
              cursor:'pointer',
              borderRadius:3,
              overflow:'hidden',
              boxShadow: active ? '0 0 0 1px #b89968 inset, 0 0 12px rgba(184,153,104,0.3)' : 'none',
            }}
          >
            <div style={{display:'flex', height:38}}>
              <div style={{flex:2, background: p.colors[1]}} />
              <div style={{flex:1, display:'flex', flexDirection:'column'}}>
                <div style={{flex:1, background: p.colors[0]}} />
                <div style={{flex:1, background: p.colors[2]}} />
              </div>
            </div>
            <div style={{
              padding:'6px 4px 5px',
              fontFamily:'Cinzel, serif',
              fontSize:9,
              letterSpacing:'0.18em',
              textTransform:'uppercase',
              color: active ? '#d4b87f' : '#a89880',
              borderTop:'1px solid #3a3a44',
            }}>{p.name}</div>
          </button>
        );
      })}
    </div>
  );
}

function App() {
  const [active, setActive] = useStateApp('home');
  const [dbVersion, setDbVersion] = useStateApp(0);

  useEffectApp(() => {
    const refresh = () => setDbVersion(v => v + 1);
    window.addEventListener('db-refresh', refresh);
    if (window.DB) window.DB.loadAll();
    if (window.ImageUpload) window.ImageUpload.loadSlots();
    return () => window.removeEventListener('db-refresh', refresh);
  }, []);

  // Tweaks
  const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
    "palette": "wine",
    "density": "normal",
    "ornaments": "on"
  }/*EDITMODE-END*/;

  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffectApp(() => {
    const root = document.documentElement;
    root.setAttribute('data-palette', tweaks.palette);
    root.setAttribute('data-density', tweaks.density);
    root.setAttribute('data-ornaments', tweaks.ornaments);
  }, [tweaks]);

  // Scroll main to top on nav
  useEffectApp(() => {
    const main = document.querySelector('.main');
    if (main) main.scrollTo({top: 0, behavior: 'auto'});
  }, [active]);

  const renderPage = () => {
    // Composite IDs like 'character:kathryn' or 'session:23' or 'deity:bahamut'
    const [page, entity] = active.split(':');
    switch (page) {
      case 'home': return <Portal key={dbVersion} onNav={setActive} />;
      case 'pantheon': return <Pantheon onNav={setActive} />;
      case 'article': return <Article onNav={setActive} />;
      case 'timeline': return <Timeline key={dbVersion} onNav={setActive} />;
      case 'map': return <MapPage onNav={setActive} />;
      case 'recent': return <Recent onNav={setActive} />;
      case 'kingdoms': return <Kingdoms onNav={setActive} />;
      case 'factions': return <Factions onNav={setActive} />;
      case 'events': return <Events key={dbVersion} onNav={setActive} />;
      case 'characters': return <Characters key={dbVersion} onNav={setActive} />;
      case 'character': return <CharacterDetail id={entity} onNav={setActive} />;
      case 'deity': return <DeityDetail id={entity} onNav={setActive} />;
      case 'sessions': return <Sessions key={dbVersion} onNav={setActive} />;
      case 'session': return <SessionDetail id={entity} onNav={setActive} />;
      case 'house-rules': return <HouseRules onNav={setActive} />;
      default:
        return <ComingSoon page={active} onNav={setActive} />;
    }
  };

  return (
    <AuthProvider>
    <React.Fragment>
      <div className="app">
        <Topbar onNav={setActive} />
        <Sidebar active={active} onNav={setActive} />
        <main className="main">{renderPage()}</main>
      </div>

      <TweaksPanel title="Tweaks · Arquivo">
        <TweakSection label="Paleta">
          <PalettePicker
            value={tweaks.palette}
            onChange={v => setTweak('palette', v)}
          />
        </TweakSection>

        <TweakSection label="Layout">
          <TweakRadio
            label="Densidade"
            value={tweaks.density}
            onChange={v => setTweak('density', v)}
            options={[
              { value: 'compact', label: 'Compacta' },
              { value: 'normal', label: 'Normal' },
              { value: 'loose', label: 'Ampla' },
            ]}
          />
          <TweakRadio
            label="Ornamentos"
            value={tweaks.ornaments}
            onChange={v => setTweak('ornaments', v)}
            options={[
              { value: 'on', label: 'Com' },
              { value: 'off', label: 'Sóbrio' },
            ]}
          />
        </TweakSection>

        <TweakSection label="Ir para">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:6}}>
            {[
              {id:'home', label:'Portal'},
              {id:'recent', label:'Recentes'},
              {id:'pantheon', label:'Panteão'},
              {id:'article', label:'Artigo'},
              {id:'kingdoms', label:'Reinos'},
              {id:'factions', label:'Facções'},
              {id:'timeline', label:'Timeline'},
              {id:'events', label:'Eventos'},
              {id:'map', label:'Mapa'},
              {id:'characters', label:'Personae'},
              {id:'sessions', label:'Sessões'},
              {id:'house-rules', label:'Regras'},
            ].map(p => (
              <button key={p.id} onClick={() => setActive(p.id)} style={{
                padding:'7px 8px',
                background: active === p.id ? 'rgba(184,153,104,0.18)' : 'transparent',
                color: active === p.id ? '#d4b87f' : '#e8dcc4',
                border: '1px solid ' + (active === p.id ? '#b89968' : '#3a3a44'),
                fontFamily: 'Cinzel, serif',
                fontSize: 9,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                borderRadius: 2,
                cursor: 'pointer',
              }}>{p.label}</button>
            ))}
          </div>
        </TweakSection>
      </TweaksPanel>
    </React.Fragment>
    </AuthProvider>
  );
}

function ComingSoon({ page, onNav }) {
  return (
    <div style={{
      padding: '120px 80px',
      maxWidth: 700,
      margin: '0 auto',
    }}>
      <div className="page-eyebrow">Em compilação</div>
      <h1 className="page-title" style={{fontSize: 36}}>Esta entrada ainda está sendo transcrita</h1>
      <p className="page-lede">
        O arquivista Cael e seus aprendizes estão trabalhando neste fólio.
        Volte em breve — ou consulte uma das entradas já abertas.
      </p>
      <div style={{display:'flex', gap:10, marginTop:32, flexWrap:'wrap'}}>
        {[
          {id:'home', label:'Portal'},
          {id:'pantheon', label:'Panteão'},
          {id:'article', label:'Ayael'},
          {id:'timeline', label:'Linha do Tempo'},
          {id:'map', label:'Mapa'},
        ].map(p => (
          <button key={p.id} onClick={() => onNav(p.id)} style={{
            padding:'10px 18px',
            background: 'transparent',
            color: 'var(--gold-bright)',
            border: '1px solid var(--gold-dim)',
            fontFamily: 'Cinzel, serif',
            fontSize: 11,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 2,
          }}>{p.label}</button>
        ))}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
