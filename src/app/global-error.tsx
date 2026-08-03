"use client";
import Link from "next/link";
import { useEffect } from "react";

interface GlobalErrorProps {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
}

const styles = {
  body: {
    margin: 0,
    background: "#ffffff",
    color: "#171717",
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  main: {
    minHeight: "100vh",
    display: "grid",
    placeItems: "center",
    padding: "24px",
    boxSizing: "border-box" as const,
  },
  panel: {
    width: "100%",
    maxWidth: "720px",
    border: "1px solid rgba(23, 23, 23, 0.12)",
    borderRadius: "16px",
    padding: "40px",
    boxSizing: "border-box" as const,
  },
  eyebrow: {
    margin: 0,
    fontSize: "12px",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase" as const,
    opacity: 0.6,
  },
  heading: {
    margin: "16px 0 0",
    fontSize: "clamp(32px, 6vw, 52px)",
    lineHeight: 1.05,
  },
  text: {
    margin: "24px 0 0",
    fontSize: "18px",
    lineHeight: 1.7,
    opacity: 0.72,
  },
  actions: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
    marginTop: "32px",
  },
  primaryButton: {
    minHeight: "44px",
    border: 0,
    borderRadius: "6px",
    padding: "12px 20px",
    background: "#171717",
    color: "#ffffff",
    fontWeight: 700,
    cursor: "pointer",
  },
  secondaryLink: {
    minHeight: "44px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(23, 23, 23, 0.2)",
    borderRadius: "6px",
    padding: "0 20px",
    color: "#171717",
    fontWeight: 700,
    textDecoration: "none",
  },
  reference: {
    margin: "28px 0 0",
    fontSize: "12px",
    opacity: 0.5,
  },
} as const;

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[global-error-boundary]", {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  return (
    <html lang="de">
      <body style={styles.body}>
        <main style={styles.main}>
          <section style={styles.panel}>
            <p style={styles.eyebrow}>Technischer Fehler</p>

            <h1 style={styles.heading}>Die Anwendung konnte nicht geladen werden</h1>

            <p style={styles.text}>
              Es ist ein unerwarteter technischer Fehler aufgetreten. Versuchen Sie den Aufruf
              erneut oder wechseln Sie zurück zur Startseite.
            </p>

            <div style={styles.actions}>
              <button type="button" onClick={reset} style={styles.primaryButton}>
                Erneut versuchen
              </button>

              <Link href="/" style={styles.secondaryLink}>
                Zur Startseite
              </Link>
            </div>

            {error.digest ? <p style={styles.reference}>Fehlerreferenz: {error.digest}</p> : null}
          </section>
        </main>
      </body>
    </html>
  );
}
