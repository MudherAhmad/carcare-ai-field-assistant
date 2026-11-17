import { useMemo, useState } from "react";
import { FirebaseHybridReportEngine, type HybridPreparation } from "./ai/hybridEngine";
import { redactSensitiveText } from "./ai/redaction";
import { toUserFacingAiError } from "./ai/errorMessage";
import { getMessages } from "./i18n/messages";
import { ReportView } from "./components/ReportView";
import { findNearbyWorkshops } from "./services/geoapify";
import type { Locale, NearbyWorkshop, ReportResult, VehicleInput } from "./types";

const samples: Record<Locale, Omit<VehicleInput, "language">> = {
  en: {
    vehicle: "2018 compact petrol car",
    mileageKm: 84000,
    notes: "The steering wheel shakes while braking from motorway speed. No warning lights. It started this week.",
  },
  sv: {
    vehicle: "2016 dieselkombi",
    mileageKm: 142000,
    notes: "Batterilampan tändes under körning och strålkastarna blev svagare. Motorn går fortfarande.",
  },
  ar: {
    vehicle: "سيارة بنزين موديل 2020",
    mileageKm: 67000,
    notes: "ارتفعت حرارة المحرك وظهر بخار خفيف من مقدمة السيارة. أوقفت السيارة ولم أفتح غطاء سائل التبريد.",
  },
};

const engine = new FirebaseHybridReportEngine();

export default function App() {
  const [locale, setLocale] = useState<Locale>("en");
  const [vehicle, setVehicle] = useState("");
  const [mileage, setMileage] = useState("");
  const [notes, setNotes] = useState("");
  const [preparation, setPreparation] = useState<HybridPreparation>({ state: "idle", progress: 0 });
  const [result, setResult] = useState<ReportResult>();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [workshops, setWorkshops] = useState<NearbyWorkshop[]>([]);
  const [locationBusy, setLocationBusy] = useState(false);
  const [locationError, setLocationError] = useState("");
  const t = getMessages(locale);
  const redaction = useMemo(() => redactSensitiveText(notes), [notes]);
  const direction = locale === "ar" ? "rtl" : "ltr";

  function changeLocale(next: Locale) {
    setLocale(next);
    setResult(undefined);
    document.documentElement.lang = next;
    document.documentElement.dir = next === "ar" ? "rtl" : "ltr";
  }

  function loadSample() {
    const sample = samples[locale];
    setVehicle(sample.vehicle);
    setMileage(String(sample.mileageKm));
    setNotes(sample.notes);
    setResult(undefined);
  }

  async function prepare() {
    setError("");
    try {
      await engine.prepare(setPreparation);
    } catch (cause) {
      setPreparation({ state: "idle", progress: 0 });
      setError(toUserFacingAiError(cause, t));
    }
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!notes.trim()) return;
    setBusy(true);
    setError("");
    setResult(undefined);
    try {
      if (preparation.state === "idle") await engine.prepare(setPreparation);
      const parsedMileage = mileage.trim() ? Number(mileage) : undefined;
      const input: VehicleInput = {
        language: locale,
        vehicle: vehicle.trim(),
        mileageKm: Number.isFinite(parsedMileage) && parsedMileage! >= 0 ? parsedMileage : undefined,
        notes,
      };
      setResult(await engine.generate(input, redaction.text));
    } catch (cause) {
      setError(toUserFacingAiError(cause, t));
    } finally {
      setBusy(false);
    }
  }

  async function locateWorkshops() {
    setLocationBusy(true);
    setLocationError("");
    setWorkshops([]);
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: false,
          timeout: 10_000,
          maximumAge: 60_000,
        });
      });
      setWorkshops(await findNearbyWorkshops(position.coords.latitude, position.coords.longitude, locale));
    } catch (cause) {
      setLocationError(cause instanceof Error ? cause.message : "Location is unavailable.");
    } finally {
      setLocationBusy(false);
    }
  }

  return (
    <div className="app-shell" dir={direction}>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="CarCare AI Field Assistant">
          <img src="/mark.svg" alt="" />
          <span>CarCare <em>AI</em></span>
        </a>
        <div className="locale-switcher" aria-label="Language">
          {(["en", "sv", "ar"] as Locale[]).map((item) => (
            <button
              className={locale === item ? "active" : ""}
              type="button"
              key={item}
              onClick={() => changeLocale(item)}
              aria-pressed={locale === item}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div>
            <p className="eyebrow">{t.eyebrow}</p>
            <h1>{t.title}</h1>
            <p className="hero-copy">{t.subtitle}</p>
          </div>
          <div className="status-panel">
            <StatusDot ok={engine.isConfigured()} label={engine.isSyntheticDemo() ? t.demo : engine.isConfigured() ? t.configured : t.notConfigured} />
            {preparation.state !== "idle" && (
              <div className="model-status">
                <span>{preparation.state === "downloading" ? t.download : preparation.state === "ready" ? t.ready : t.cloudOnly}</span>
                {preparation.state === "downloading" && (
                  <div className="progress"><span style={{ width: `${Math.round(preparation.progress * 100)}%` }} /></div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="workspace">
          <form className="input-panel" onSubmit={submit}>
            <div className="panel-heading">
              <div><span>01</span><h2>{t.formTitle}</h2></div>
              <button className="text-button" type="button" onClick={loadSample}>{t.loadSample}</button>
            </div>
            <p className="form-hint">{t.formHint}</p>

            <label>
              <span>{t.vehicle}</span>
              <input value={vehicle} onChange={(event) => setVehicle(event.target.value)} placeholder={t.vehiclePlaceholder} maxLength={160} />
            </label>
            <label>
              <span>{t.mileage}</span>
              <input value={mileage} onChange={(event) => setMileage(event.target.value)} inputMode="numeric" type="number" min="0" max="2000000" />
            </label>
            <label className="notes-field">
              <span>{t.notes}</span>
              <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder={t.notesPlaceholder} minLength={12} maxLength={3000} required />
              <small>{notes.length} / 3000</small>
            </label>

            <div className="privacy-preview">
              <div className="privacy-title"><span className="shield">✓</span><strong>{t.redactionTitle}</strong></div>
              <p>{redaction.total ? `${redaction.total} ${t.redactionFound}` : t.redactionNone}</p>
              {notes && <pre>{redaction.text}</pre>}
            </div>

            <div className="action-row">
              <button className="secondary-button" type="button" onClick={prepare} disabled={preparation.state === "downloading"}>
                {preparation.state === "downloading" ? t.preparing : t.prepare}
              </button>
              <button className="primary-button" type="submit" disabled={busy || notes.trim().length < 12}>
                {busy ? t.generating : t.generate}<span aria-hidden="true">→</span>
              </button>
            </div>
            {error && <div className="error-banner" role="alert"><strong>{t.error}</strong><span>{error}</span></div>}
          </form>

          <aside className="process-rail" aria-label="Hybrid inference flow">
            <div><span>1</span><strong>Local redaction</strong><small>On this device</small></div>
            <i />
            <div><span>2</span><strong>Firebase AI Logic</strong><small>App Check protected</small></div>
            <i />
            <div><span>3</span><strong>Gemini Nano ↔ Cloud</strong><small>Visible routing evidence</small></div>
          </aside>
        </section>

        {result && <ReportView result={result} messages={t} />}

        {result && (
          <section className="nearby-panel">
            <div>
              <p className="section-kicker">Geoapify · optional</p>
              <h2>{t.nearbyTitle}</h2>
              <p>{t.geoConsent}</p>
            </div>
            <button className="secondary-button" type="button" onClick={locateWorkshops} disabled={locationBusy}>
              {locationBusy ? t.locating : t.nearby}
            </button>
            {locationError && <p className="location-error" role="alert">{locationError}</p>}
            {workshops.length > 0 && (
              <div className="workshop-grid">
                {workshops.map((workshop) => (
                  <a key={workshop.id} href={`https://www.openstreetmap.org/?mlat=${workshop.latitude}&mlon=${workshop.longitude}#map=16/${workshop.latitude}/${workshop.longitude}`} target="_blank" rel="noreferrer">
                    <strong>{workshop.name}</strong><span>{workshop.address}</span>
                    {workshop.distanceMeters != null && <small>{(workshop.distanceMeters / 1000).toFixed(1)} km {t.distance}</small>}
                  </a>
                ))}
              </div>
            )}
            <small className="attribution">Powered by Geoapify · © OpenStreetMap contributors</small>
          </section>
        )}
      </main>

      <footer><span>CarCare AI Field Assistant · 2026</span><span>{t.disclaimer}</span></footer>
    </div>
  );
}

function StatusDot({ ok, label }: { ok: boolean; label: string }) {
  return <div className={`status-dot ${ok ? "ok" : "warn"}`}><i /><span>{label}</span></div>;
}
