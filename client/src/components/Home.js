import React from "react";

function Home({ onBookClick, onManageClick }) {
  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        backgroundImage: "url('/barber-bg.jpg')", // metti l'immagine nella cartella public
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        textAlign: "center",
        padding: 20
      }}
    >
      <h1 style={{ fontSize: 32, marginBottom: 40, textShadow: "2px 2px 6px rgba(0,0,0,0.5)" }}>
        Fabio Villano Parrucchieri - Prenotazioni
      </h1>

      <button
        onClick={onBookClick}
        style={{
          padding: "15px 30px",
          fontSize: 18,
          margin: 10,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#f4c542",
          color: "#000",
          fontWeight: "bold",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        Prenota Appuntamento
      </button>

      <button
        onClick={onManageClick}
        style={{
          padding: "15px 30px",
          fontSize: 18,
          margin: 10,
          borderRadius: 8,
          border: "none",
          cursor: "pointer",
          backgroundColor: "#fff",
          color: "#000",
          fontWeight: "bold",
          boxShadow: "2px 2px 6px rgba(0,0,0,0.3)"
        }}
      >
        Gestisci Appuntamento
      </button>
    </div>
  );
}

export default Home;
