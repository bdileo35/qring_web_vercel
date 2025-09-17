"use client";
import { useState } from "react";
import CardContainer from "@/app/components/CardContainer";
import Header from '@/app/components/Header';
import NavBar from '@/app/components/NavBar';

const slides = [
  {
    img: "/step1.png",
    desc: "Paso 1: Escanea el QR en la entrada para comenzar el proceso de acceso."
  },
  {
    img: "https://via.placeholder.com/320x240?text=Pr%C3%B3ximamente",
    desc: "Paso 2: Configura tu timbre y datos de contacto. (Imagen en desarrollo)"
  },
  {
    img: "/step3.png",
    desc: "Paso 3: Invita a otros usuarios a tu timbre desde el panel de comunidad."
  },
  {
    img: "/step4.png",
    desc: "Paso 4: ¡Listo! Los visitantes podrán tocar tu timbre y contactarte fácilmente."
  }
];

export default function AyudaPage() {
  const [current, setCurrent] = useState(0);
  const goTo = (idx: number) => setCurrent(idx);
  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <>
      <Header />
      <div style={{ width: '100%', height: 'calc(100vh - 124px)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f6fa', overflow: 'hidden', paddingTop: 40 }}>
        <CardContainer>
          <div style={{ fontSize: 28, fontWeight: 700, marginBottom: 16, color: '#111' }}>
            ¿Cómo funciona <span style={{ color: '#1a4fa3' }}>QR</span>ing?
          </div>
          <div style={{ position: 'relative', width: 320, height: 240, margin: '0 auto' }}>
            <img src={slides[current].img} alt={slides[current].desc} style={{ width: 320, height: 240, objectFit: 'contain', borderRadius: 12, boxShadow: '0 1px 8px #0001' }} />
            <button onClick={prev} style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', background: '#eaf4ff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 20, cursor: 'pointer', boxShadow: '0 1px 4px #0001', color: '#1a4fa3', fontWeight: 700 }}>&lt;</button>
            <button onClick={next} style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)', background: '#eaf4ff', border: 'none', borderRadius: '50%', width: 32, height: 32, fontSize: 20, cursor: 'pointer', boxShadow: '0 1px 4px #0001', color: '#1a4fa3', fontWeight: 700 }}>&gt;</button>
          </div>
          <div style={{ margin: '18px 0 8px', fontSize: 17, color: '#222', minHeight: 48 }}>
            {slides[current].desc.replace(/^Paso \d+: /, '')}
          </div>
          <div style={{ width: 320, margin: '0 auto 12px auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: '100%', height: 6, background: '#eaf4ff', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ width: `${((current + 1) / slides.length) * 100}%`, height: '100%', background: '#1a4fa3', borderRadius: 4, transition: 'width 0.3s' }} />
            </div>
            <div style={{ fontWeight: 600, fontSize: 16, color: '#1a4fa3', marginBottom: 2 }}>
              Paso {current + 1} de {slides.length}
            </div>
          </div>
        </CardContainer>
      </div>
      <NavBar />
    </>
  );
} 