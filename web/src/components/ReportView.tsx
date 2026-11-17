import type { ReportResult } from "../types";
import type { Messages } from "../i18n/messages";

interface ReportViewProps {
  result: ReportResult;
  messages: Messages;
}

export function ReportView({ result, messages: t }: ReportViewProps) {
  const { report } = result;
  return (
    <article className={`report urgency-${report.urgency}`} aria-live="polite">
      <div className="report-header">
        <div>
          <p className="section-kicker">{t.reportTitle}</p>
          <h2>{report.summary}</h2>
        </div>
        <div className="urgency-badge">
          <span>{t.urgency}</span>
          <strong>{t[report.urgency]}</strong>
        </div>
      </div>

      <div className="evidence-row">
        <div className={`source-chip source-${result.source.toLowerCase()}`}>
          <span>{t.source}</span>
          <strong>{result.source.replaceAll("_", " ")}</strong>
        </div>
        <div className="source-chip">
          <span>{t.model}</span>
          <strong>{result.modelName}</strong>
        </div>
        <div className="source-chip">
          <span>{t.confidence}</span>
          <strong>{Math.round(report.confidence * 100)}%</strong>
        </div>
      </div>

      <ReportSection title={t.observations} index="01">
        <div className="card-grid">
          {report.observations.map((item, index) => (
            <div className="report-card" key={`${item.system}-${index}`}>
              <span className={`severity-dot severity-${item.severity}`} />
              <h3>{item.system}</h3>
              <p>{item.symptom}</p>
            </div>
          ))}
        </div>
      </ReportSection>

      <ReportSection title={t.inspection} index="02">
        <ol className="step-list">
          {report.inspectionSteps.map((item, index) => (
            <li key={`${item.title}-${index}`}>
              <div className="step-number">{String(index + 1).padStart(2, "0")}</div>
              <div>
                <div className="step-title-row">
                  <h3>{item.title}</h3>
                  <span className={`safety-pill safety-${item.safetyLevel}`}>
                    {item.safetyLevel === "professional_only" ? t.professional : t.ownerSafe}
                  </span>
                </div>
                <p>{item.reason}</p>
              </div>
            </li>
          ))}
        </ol>
      </ReportSection>

      <ReportSection title={t.services} index="03">
        <div className="service-list">
          {report.suggestedServices.map((item, index) => (
            <div className="service-row" key={`${item.name}-${index}`}>
              <span className={`priority priority-${item.priority}`}>{item.priority}</span>
              <div><h3>{item.name}</h3><p>{item.reason}</p></div>
            </div>
          ))}
        </div>
      </ReportSection>

      {(report.safetyNotices.length > 0 || report.followUpQuestions.length > 0) && (
        <div className="split-sections">
          <ReportSection title={t.notices} index="04">
            <ul className="plain-list warning-list">
              {report.safetyNotices.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ReportSection>
          <ReportSection title={t.questions} index="05">
            <ul className="plain-list">
              {report.followUpQuestions.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </ReportSection>
        </div>
      )}
      <p className="report-disclaimer">{t.disclaimer}</p>
    </article>
  );
}

function ReportSection({ title, index, children }: { title: string; index: string; children: React.ReactNode }) {
  return (
    <section className="report-section">
      <header><span>{index}</span><h2>{title}</h2></header>
      {children}
    </section>
  );
}
