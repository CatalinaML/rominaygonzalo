'use client'
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import React from 'react';
import { CSSProperties } from 'react';
// --- CONFIGURACIÓN DE SUPABASE ---
// Reemplaza con tus datos reales de Project Settings > API
const SUPABASE_URL = 'https://smtzdfsofzzbtzermdgy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtdHpkZnNvZnp6YnR6ZXJtZGd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNjk4NzEsImV4cCI6MjA4Njk0NTg3MX0.1V0HYGoyDmCbO_Nxkj92mhgH09atu7N6_jklBA_lpyQ';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function InvitacionContent() {
  const searchParams = useSearchParams();
  const nombreSugerido = searchParams.get('n') || "";
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  // Estilos manuales para asegurar el diseño de "Card"
  const cardStyle: CSSProperties = {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    padding: '40px',
    textAlign: 'center', // Aquí TS ya reconocerá que es un valor válido
    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    display: 'flex',
    flexDirection: 'column', // Ahora TS sabe que "column" es un valor legal de flex-direction
    alignItems: 'center',
    justifyContent: 'center'
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEnviando(true);

    // Para acceder a los valores del formulario de forma segura en TS:
    const formData = new FormData(e.currentTarget);
    const nombre = formData.get('nombre') as string;
    const dieta = formData.get('dieta') as string;

    try {
      const { error } = await supabase
        .from('confirmaciones')
        .insert([{ invitado: nombre, dieta: dieta, confirmacion: "confirmado" }]);

      if (error) throw error;
      setConfirmado(true);
    } catch (error) {
      console.error(error);
      alert("Error al enviar.");
    } finally {
      setEnviando(false);
    }
  };

  // --- LÓGICA DEL CONTADOR ---
  const [timeLeft, setTimeLeft] = React.useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  React.useEffect(() => {
    // ESTABLECE AQUÍ LA FECHA DE LA BODA
    const targetDate = new Date("2026-04-12T13:00:00").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      backgroundColor: '#FDFCFB',
      minHeight: '100vh',
      color: '#1c1917',
      fontFamily: 'serif',
      // --- ESTILOS DE FONDO ---
      backgroundImage: 'url("/flores.png")',
      backgroundPosition: 'center',  // Centradas
      backgroundRepeat: 'no-repeat', // Que no se repitan como mosaico
      backgroundAttachment: 'fixed', // Efecto elegante: el fondo se queda quieto al hacer scroll
      position: 'relative',
      overflowX: 'hidden'
    }}>


      {/* HEADER */}
      <section style={{ height: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
        <span style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.5em', color: '#a8a29e', marginBottom: '20px' }}>Save the Date</span>
        <h1 style={{ fontSize: 'clamp(3rem, 8vw, 5rem)', fontStyle: 'italic', fontWeight: '200', margin: '0' }}>Romina & Gonzalo</h1>
        <div style={{ width: '1px', height: '80px', backgroundColor: '#e7e5e4', margin: '30px 0' }}></div>
      </section>

      {/* SECCIÓN COUNTDOWN */}
      <section style={{ padding: '80px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <h2 style={{
          fontFamily: 'serif',
          fontStyle: 'italic',
          fontSize: '1.8rem',
          fontWeight: '300',
          marginBottom: '40px',
          color: '#78716c'
        }}>
          Cada segundo cuenta para el gran día...
        </h2>

        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {[
            { label: 'DÍAS', value: timeLeft.days },
            { label: 'HS', value: timeLeft.hours },
            { label: 'MIN', value: timeLeft.minutes },
            { label: 'SEG', value: timeLeft.seconds },
          ].map((item, index) => (
            <div key={index} style={{ flex: 1 }}>
              <div style={{
                fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                fontWeight: '200',
                color: '#1c1917',
                borderBottom: '1px solid #e7e5e4',
                paddingBottom: '10px',
                marginBottom: '10px'
              }}>
                {String(item.value).padStart(2, '0')}
              </div>
              <div style={{
                fontSize: '10px',
                letterSpacing: '0.2em',
                color: '#a8a29e'
              }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTOS - CARDS CON MAPAS Y PINES EXACTOS */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px 100px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px'
        }}>
          {[
            {
              t: "Ceremonia Civil",
              d: "9 Abril 2026",
              h: "14:30 hs",
              l: "Av. Independencia 2846, Mar del Plata",
              // URL con dirección explícita
              embedUrl: "https://maps.google.com/maps?q=Av.%20Independencia%202846,%20Mar%20del%20Plata&t=&z=15&ie=UTF8&iwloc=&output=embed"
            },
            {
              t: "Ceremonia Religiosa",
              d: "12 Abril 2026",
              h: "13:00 hs",
              l: "Pqa. San Carlos Borromeo, Juan B. Justo 2098",
              // URL con dirección explícita
              embedUrl: "https://maps.google.com/maps?q=Parroquia%20San%20Carlos%20Borromeo,%20Juan%20B.%20Justo%202098,%20Mar%20del%20Plata&t=&z=15&ie=UTF8&iwloc=&output=embed"
            },
            {
              t: "La Fiesta",
              d: "12 Abril 2026",
              h: "13:30 hs",
              l: "Centro Naval Salón Michelis, Navegante Vito Dumas S/N",
              // URL con dirección explícita
              embedUrl: "https://maps.google.com/maps?q=Centro%20Naval,%20Navegante%20Vito%20Dumas,%20Puerto%20Mar%20del%20Plata&t=&z=15&ie=UTF8&iwloc=&output=embed"
            }
          ].map((item, i) => (
            <div key={i} style={{ ...cardStyle, padding: '0', overflow: 'hidden' }}>
              <div style={{ padding: '40px 30px 20px' }}>
                <h3 style={{ fontStyle: 'italic', fontSize: '1.5rem', marginBottom: '15px', fontWeight: '400' }}>{item.t}</h3>
                <div style={{ width: '30px', height: '1px', backgroundColor: '#d6d3d1', margin: '0 auto 20px' }}></div>
                <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#a8a29e', margin: '5px 0' }}>{item.d}</p>
                <p style={{ fontSize: '1.2rem', margin: '10px 0' }}>{item.h}</p>
                <p style={{ fontSize: '11px', color: '#78716c', textTransform: 'uppercase', lineHeight: '1.6', marginBottom: '10px', minHeight: '40px' }}>{item.l}</p>
              </div>

              <div style={{ width: '100%', height: '300px', borderTop: '1px solid #f5f5f4' }}>
                <iframe
                  src={item.embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN MESA DE REGALOS */}
      <section style={{
        maxWidth: '700px',
        margin: '100px auto',
        padding: '60px 20px',
        textAlign: 'center',
        border: '1px solid #e7e5e4', // Marco fino
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ marginBottom: '30px' }}>
          {/* Icono sutil de sobre o regalo */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#a8a29e" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '20px' }}>
            <path d="M20 12V8H4v4M2 8l10 7 10-7M4 12v8h16v-8" />
          </svg>

          <h2 style={{ fontStyle: 'italic', fontSize: '1.8rem', fontWeight: '300', marginBottom: '20px' }}>Regalos</h2>

          <p style={{
            fontSize: '15px',
            lineHeight: '1.8',
            color: '#78716c',
            maxWidth: '500px',
            margin: '0 auto 40px',
            fontFamily: 'serif'
          }}>
            Tu presencia es nuestro mejor regalo, pero si deseas ayudarnos con nuestra casita, pueden hacerlo aquí:
          </p>
        </div>

        <div style={{
          backgroundColor: '#f5f5f4',
          padding: '30px',
          borderRadius: '2px',
          display: 'inline-block',
          minWidth: '280px'
        }}>
          <p style={{ fontSize: '11px', letterSpacing: '0.2em', color: '#a8a29e', margin: '0 0 10px' }}>BANCO NARANJA X</p>
          <p style={{ fontSize: '14px', color: '#78716c', margin: '5px 0' }}>Alias: romina.y.gonzalo</p>

          <button
            onClick={() => {
              navigator.clipboard.writeText("0000000000000000000000");
              alert("CBU copiado al portapapeles");
            }}
            style={{
              marginTop: '20px',
              backgroundColor: 'transparent',
              border: '1px solid #d6d3d1',
              padding: '10px 20px',
              fontSize: '11px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fff'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            Copiar alias
          </button>
        </div>
      </section>

      {/* RSVP - FORMULARIO CENTRADO */}
      <section style={{ padding: '100px 20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: '100%',
          maxWidth: '450px',
          backgroundColor: 'white',
          padding: '50px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.05)',
          border: '1px solid #f5f5f4'
        }}>
          {confirmado ? (
            <div style={{ textAlign: 'center' }}>
              <h2 style={{ fontStyle: 'italic', fontSize: '2rem' }}>¡Gracias!</h2>
              <p style={{ color: '#a8a29e', fontSize: '10px', textTransform: 'uppercase' }}>Te esperamos</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <h2 style={{ fontStyle: 'italic', fontSize: '2.5rem', margin: '0 0 10px' }}>Confirmar asistencia</h2>
              </div>
              <div style={{ borderBottom: '1px solid #e7e5e4', paddingBottom: '10px' }}>
                <label style={{ fontSize: '9px', textTransform: 'uppercase', color: '#a8a29e', display: 'block' }}>Nombre</label>
                <input name="nombre" required defaultValue={nombreSugerido} style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.1rem', paddingTop: '10px', fontFamily: 'serif' }} />
              </div>
              <div style={{ borderBottom: '1px solid #e7e5e4', paddingBottom: '10px' }}>
                <label style={{ fontSize: '9px', textTransform: 'uppercase', color: '#a8a29e', display: 'block' }}>Dieta</label>
                <input name="dieta" required placeholder="Ninguna" style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.1rem', paddingTop: '10px', fontFamily: 'serif' }} />
              </div>
              <button type="submit" disabled={enviando} style={{ backgroundColor: '#1c1917', color: 'white', border: 'none', padding: '20px', textTransform: 'uppercase', letterSpacing: '0.3em', fontSize: '10px', cursor: 'pointer' }}>
                {enviando ? 'Enviando...' : 'Confirmar'}
              </button>
            </form>
          )}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '50px', color: '#d6d3d1', fontSize: '10px', letterSpacing: '0.5em' }}>
        R & G — 2025
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <InvitacionContent />
    </Suspense>
  );
}