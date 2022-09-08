import winTotals from './winTotals.json';

export default function Teams() {
  return (
    <div className="wrap">
      {winTotals.map((t) => (
        <div key={t.team} className="root">
          <p className="name">{t.team}</p>
          <p>
            Over/Under: {t.winTotal} ({t.overPrice} / {t.underPrice})
          </p>
          <p>
            Prediction: <strong>{t.prediction}</strong>
          </p>
          <p>
            Confidence: <strong>{t.confidence}</strong>
          </p>
          {/* <p>{t.summary}</p> */}
        </div>
      ))}
      <style jsx>{`
        p {
          margin: 0 !important;
        }
        .wrap {
          margin-top: 20px;
        }
        .root {
          padding: 20px 10px;
          box-shadow: 0px 0px 10px darkgrey;
          margin-bottom: 20px;
          border-radius: 5px;
        }
        .name {
          font-size: 24px;
        }
      `}</style>
    </div>
  );
}
