'use client'
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  const searchParams = useSearchParams();
  const invitado = searchParams.get('n') || "Invitado/a";
  
  const [enviando, setEnviando] = useState(false);
  const [confirmado, setConfirmado] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);

    const formData = {
      invitado: invitado,
      dieta: e.target.dieta.value
    };

    try {
      // REEMPLAZA ESTA URL con la que te dio Google Apps Script
      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxe1weZJ4e76XwaiD-xMk6VXuxhwvdZW7yeqkQjBCZ2wReZfJ9j2SDRR22OQBVhoiwm3g/exec';

      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Importante para evitar problemas de CORS con Google
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      setConfirmado(true);
    } catch (error) {
      console.error("Error!", error);
      alert("Hubo un error al confirmar. Intentá de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-6 py-12 text-center font-serif">
      {/* ... (el resto de las secciones que ya teníamos) ... */}

      <section id="rsvp" className="border-t pt-20">
        {confirmado ? (
          <div className="bg-green-50 p-8 rounded-lg italic text-green-800">
            <h2 className="text-2xl mb-2">¡Gracias {invitado}!</h2>
            <p>Tu confirmación ha sido enviada con éxito.</p>
          </div>
        ) : (
          <>
            <h2 className="text-3xl mb-8 italic">Confirmar Asistencia</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-left max-w-md mx-auto">
              <div>
                <label className="block mb-1 font-sans text-sm uppercase">Restricciones Alimentarias</label>
                <textarea 
                  name="dieta" 
                  className="w-full border p-3 rounded focus:outline-none focus:ring-1 focus:ring-gray-400"
                  placeholder="Ej: Celíaco, Vegano, Alergias..."
                  required
                ></textarea>
              </div>

              <button 
                disabled={enviando}
                className={`bg-black text-white py-4 px-8 uppercase tracking-widest transition-colors ${enviando ? 'opacity-50' : 'hover:bg-gray-800'}`}
              >
                {enviando ? 'Enviando...' : 'Confirmar mi lugar'}
              </button>
            </form>
          </>
        )}
      </section>
    </main>
  );
}