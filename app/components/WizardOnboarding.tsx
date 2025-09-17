import { useState, useEffect, useRef } from "react";
import ConfigTimbres, { TimbreConfig } from "./ConfigTimbres";
import CInfo from "./CInfo";
import QRCodeDisplay from './QRCodeDisplay';
import TimbreHeader from './TimbreHeader';
import SolicitudTimbreModal from './SolicitudTimbreModal';
import React from 'react';

interface PisoConfig {
  nombre: string;
  dptos: string[];
}

// --- Sub-componente de Navegación ---
const NavegacionWizard = ({ paso, totalPasos, onAnterior, onSiguiente, puedeAvanzar = true, esPasoFinal = false }: { paso: number, totalPasos: number, onAnterior: () => void, onSiguiente: () => void, puedeAvanzar?: boolean, esPasoFinal?: boolean }) => {
    const progreso = (paso / totalPasos) * 100;

    return (
        <div style={{ width: '100%', margin: '24px auto 0' }}>
            {/* Barra de Progreso */}
            <div style={{ background: '#e0e0e0', borderRadius: 8, overflow: 'hidden', height: 12, marginBottom: 8 }}>
                <div style={{ width: `${progreso}%`, background: '#1976d2', height: '100%', transition: 'width 0.3s ease' }}></div>
            </div>

            {/* Controles de Navegación */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                    onClick={onAnterior} 
                    disabled={paso === 1}
                    style={{ 
                        background: 'none', 
                        border: 'none', 
                        fontSize: 32, 
                        fontWeight: 'bold', 
                        color: paso === 1 ? '#ccc' : '#1976d2', 
                        cursor: 'pointer',
                        visibility: paso === 1 ? 'hidden' : 'visible'
                    }}
                >
                    {'<'}
                </button>
                <span style={{ color: '#1a4fa3', fontWeight: 700 }}>
                    Paso {paso} de {totalPasos}
                </span>
                {esPasoFinal ? (
                    <button onClick={onSiguiente} disabled={!puedeAvanzar} style={{background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>
                        Finalizar
                    </button>
                ) : (
                    <button 
                        onClick={onSiguiente} 
                        disabled={!puedeAvanzar}
                        style={{ 
                            background: 'none', 
                            border: 'none', 
                            fontSize: 32, 
                            fontWeight: 'bold', 
                            color: !puedeAvanzar ? '#ccc' : '#1976d2', 
                            cursor: 'pointer' 
                        }}
                    >
                        {'>'}
                    </button>
                )}
            </div>
        </div>
    );
};

// --- Componente Principal del Wizard ---
export default function WizardOnboarding() {
  const [paso, setPaso] = useState(1);
  const totalPasos = 3;

  // ESTADO - Paso 1: Dirección y Estructura
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [tienePB, setTienePB] = useState(true);
  const [pbDptosCount, setPbDptosCount] = useState(1);
  const [cantPisos, setCantPisos] = useState(1);
  const [dptosPorPiso, setDptosPorPiso] = useState(1);
  const [estructura, setEstructura] = useState<PisoConfig[]>([]);
  const [idUnico, setIdUnico] = useState<string | null>(null);

  // ESTADO - Paso 2: Timbres
  const [timbres, setTimbres] = useState<TimbreConfig[]>([]);
  const isInitialMount = useRef(true);

  // Ref para el input de calle
  const calleRef = useRef<HTMLInputElement>(null);

  // 1. Agrega un estado para mostrar el modal de aviso en el Paso 2:
  const [showPaso2Info, setShowPaso2Info] = useState(true);
  
  // 2. Estado para modal de confirmación en el paso 3
  const [showPaso3Confirm, setShowPaso3Confirm] = useState(false);
  
  // 3. Estado para modal de solicitud de timbre
  const [showSolicitudModal, setShowSolicitudModal] = useState(false);

  useEffect(() => {
    if (paso === 1 && calleRef.current) {
      calleRef.current.focus();
    }
  }, [paso]);

  // --- EFECTOS DE CARGA, GUARDADO Y GENERACIÓN ---

  // 1. Cargar desde LocalStorage y Base de Datos (solo al montar el componente)
  useEffect(() => {
    const cargarDatos = async () => {
      // 🔧 CRÍTICO: Obtener IDU de múltiples fuentes
      const ventaIdUnico = localStorage.getItem('ventaIdUnico');
      const urlParams = new URLSearchParams(window.location.search);
      const idUnicoFromUrl = urlParams.get('idUnico');
      const idUnicoToUse = ventaIdUnico || idUnicoFromUrl;
      
      console.log('🔍 IDU encontrado:', { ventaIdUnico, idUnicoFromUrl, idUnicoToUse });
    
      // 🔧 CRÍTICO: Verificar si hay datos en localStorage primero (viene del botón Usuarios/Residentes)
      const datosGuardados = localStorage.getItem('wizardData');
      if (datosGuardados && idUnicoFromUrl) {
        try {
          const data = JSON.parse(datosGuardados);
          // Si el localStorage tiene el mismo IDU y está en paso 2, usar esos datos
          if (data.idUnico === idUnicoFromUrl && data.paso === 2) {
            console.log('🔄 Cargando datos desde localStorage (botón Usuarios/Residentes)...');
            setIdUnico(data.idUnico);
            setPaso(data.paso); // Ir directamente al Paso 2
            setCalle(data.calle || "");
            setNumero(data.numero || "");
            setEstructura(data.estructura || []);
            setTimbres(data.timbres || []);
            console.log('✅ Datos cargados desde localStorage exitosamente');
            return; // Salir temprano, no cargar desde BD
          }
        } catch (error) {
          console.error('❌ Error parseando localStorage:', error);
        }
      }
      
      // 🔧 CRÍTICO: Si no hay datos en localStorage o no coinciden, cargar desde BD
      if (idUnicoFromUrl) {
        console.log('🔄 IDU en URL detectado, cargando desde BD...');
        setIdUnico(idUnicoFromUrl);
        
        try {
          const response = await fetch(`/api/admin/estructura?idUnico=${idUnicoFromUrl}`);
          const result = await response.json();
          
          if (result.success && result.estructura) {
            console.log('✅ Estructura cargada desde BD:', result.estructura);
            
            // Cargar datos de la BD
            setCalle(result.direccion.calle || "");
            setNumero(result.direccion.numero || "");
            
            // Convertir estructura de BD al formato del componente
            const estructuraFormato = result.estructura.map((piso: any) => ({
              nombre: piso.nombre,
              dptos: JSON.parse(piso.dptos || '[]')
            }));
            
            setEstructura(estructuraFormato);
            
            // Calcular cantPisos y dptosPorPiso desde la estructura
            const pisosNormales = estructuraFormato.filter((p: any) => p.nombre !== 'PB');
            setCantPisos(pisosNormales.length);
            setDptosPorPiso(pisosNormales.length > 0 ? pisosNormales[0].dptos.length : 1);
            
            // Configurar PB
            const pisoPB = estructuraFormato.find((p: any) => p.nombre === 'PB');
            setTienePB(!!pisoPB);
            setPbDptosCount(pisoPB ? pisoPB.dptos.length : 1);
            
            // Cargar timbres
            const timbres = result.estructura.flatMap((piso: any) => 
              (piso.timbres || []).map((timbre: any) => ({
                ...timbre,
                piso: piso.nombre,
                estadoAsignacion: timbre.estadoAsignacion || 'libre'
              }))
            );
            setTimbres(timbres);
            
            console.log('✅ Datos cargados desde BD exitosamente');
            return; // Salir temprano, no cargar desde localStorage
          }
        } catch (error) {
          console.error('❌ Error cargando desde BD:', error);
        }
      }
      
      // Solo si no hay IDU en URL, cargar desde localStorage
      console.log('Datos guardados encontrados:', datosGuardados);
    
      if (datosGuardados) {
        const data = JSON.parse(datosGuardados);
        console.log('Cargando datos desde localStorage:', data);
        setPaso(data.paso || 1);
        setCalle(data.calle || "");
        setNumero(data.numero || "");
        setTienePB(data.tienePB === undefined ? true : data.tienePB);
        setPbDptosCount(data.pbDptosCount || 1);
        setCantPisos(data.cantPisos || 1);
        setDptosPorPiso(data.dptosPorPiso || 1);
        setEstructura(data.estructura || []);
        setIdUnico(data.idUnico || idUnicoToUse);
        setTimbres(data.timbres || []);
      } else {
        console.log('No hay datos guardados, usando valores por defecto');
        // 🔧 CRÍTICO: Establecer IDU si no hay datos guardados
        if (idUnicoToUse) {
          setIdUnico(idUnicoToUse);
          console.log('✅ IDU establecido desde URL/localStorage:', idUnicoToUse);
        }
      }
      
      // 🔧 CRÍTICO: Cargar números configurados desde la BD
      if (idUnicoToUse) {
        try {
          console.log('🔄 Cargando números configurados desde BD para:', idUnicoToUse);
          const response = await fetch(`/api/publico/${idUnicoToUse}`);
          const result = await response.json();
          
          if (result.success && result.data?.timbres) {
            console.log('✅ Números cargados desde BD:', result.data.timbres);
            console.log('🔍 Timbres actuales antes de actualizar:', timbres);
            console.log('🔍 Ejemplos de timbres en BD:', result.data.timbres.slice(0, 3).map((t: any) => ({ nombre: t.nombre, piso: t.piso, dpto: t.dpto, numero: t.numero })));
            
            // Actualizar timbres con números de la BD
            setTimbres(prevTimbres => {
              console.log('🔄 Actualizando timbres. PrevTimbres:', prevTimbres);
              
              const timbresActualizados = prevTimbres.map(timbre => {
                // 🔧 CRÍTICO: Buscar por múltiples criterios
                const timbreBD = result.data.timbres.find((t: any) => {
                  const match1 = t.nombre === timbre.id;
                  const match2 = `${t.piso}${t.dpto}` === timbre.id;
                  const match3 = `${timbre.piso}${timbre.dpto}` === t.nombre;
                  const match4 = t.nombre === `${timbre.piso}${timbre.dpto}`;
                  
                  return match1 || match2 || match3 || match4;
                });
                
                console.log(`🔍 Buscando timbre ${timbre.id} (${timbre.piso}${timbre.dpto}):`, timbreBD);
                
                if (timbreBD && timbreBD.numero) {
                  console.log(`✅ Actualizando timbre ${timbre.id} con número: ${timbreBD.numero}`);
                  return {
                    ...timbre,
                    numero: timbreBD.numero,
                    metodo: timbreBD.metodo || timbre.metodo,
                    estadoAsignacion: 'configurado'
                  };
                } else if (timbreBD) {
                  // Si existe en BD pero no tiene número, mantener estado
                  console.log(`✅ Timbre ${timbre.id} existe en BD pero sin número`);
                  return {
                    ...timbre,
                    numero: timbreBD.numero || '',
                    metodo: timbreBD.metodo || timbre.metodo,
                    estadoAsignacion: timbreBD.estadoAsignacion || 'libre'
                  };
                }
                return timbre;
              });
              
              console.log('✅ Timbres actualizados con números de BD:', timbresActualizados);
              console.log('🔍 Timbres configurados:', timbresActualizados.filter(t => t.estadoAsignacion === 'configurado'));
              return timbresActualizados;
            });
          } else {
            console.log('⚠️ No se encontraron números configurados en BD');
          }
        } catch (error) {
          console.error('❌ Error cargando números desde BD:', error);
        }
      }
      
    // Marcamos que la carga inicial ha terminado
    isInitialMount.current = false;
    };
    
    cargarDatos();
  }, []); // El array vacío asegura que se ejecute solo una vez

  // 2. Sincronizar 'timbres' con 'estructura' - SOLO SI NO HAY TIMBRES CARGADOS
  useEffect(() => {
    // 🔧 CRÍTICO: NO regenerar timbres si ya están cargados desde la BD
    if (timbres.length > 0) {
      console.log('✅ Timbres ya cargados, no regenerando desde estructura');
      return;
    }

    const timbresDesdeEstructura: TimbreConfig[] = estructura.flatMap(piso =>
      piso.dptos.map(dpto => {
        const id = `${piso.nombre}-${dpto}`;
        const existente = timbres.find(t => t.id === id);
        return {
          id: id,
          piso: piso.nombre,
          dpto: dpto,
          numero: existente?.numero || '',
          metodo: existente?.metodo || 'mensaje',
          estado: existente?.estado || 'activo',
          esPropio: existente?.esPropio || false,
          estadoAsignacion: existente?.estadoAsignacion || 'libre',
        };
      })
    );

    console.log('🔄 Generando timbres desde estructura:', timbresDesdeEstructura.length);
    setTimbres(timbresDesdeEstructura);
  }, [estructura]);

  // 3. Regenerar la estructura si cambian los controles (Pisos, Dptos, etc.)
  useEffect(() => {
    // En el primer render, dejamos que el efecto de carga actúe primero.
    if (isInitialMount.current) {
      isInitialMount.current = false; // Lo marcamos para futuros renders
      
      // Caso especial: si NO hay datos guardados, generamos la estructura inicial.
      if (!localStorage.getItem('wizardData')) {
        const pisos: PisoConfig[] = [];
        for (let i = cantPisos; i >= 1; i--) {
            const dptos = Array.from({ length: dptosPorPiso }, (_, j) => String.fromCharCode(65 + j));
            pisos.push({ nombre: String(i), dptos });
        }
        if (tienePB) {
            const pbDptos = Array.from({ length: pbDptosCount }, (_, j) => String.fromCharCode(65 + j));
            pisos.push({ nombre: "PB", dptos: pbDptos });
        }
        setEstructura(pisos);
      }
      return; // Salimos para no re-generar encima de los datos cargados.
    }

    // 🔧 CRÍTICO: Regenerar estructura cuando cambian los controles
    console.log('🔄 Regenerando estructura con:', { cantPisos, dptosPorPiso, tienePB, pbDptosCount });
    
    const pisos: PisoConfig[] = [];
    for (let i = cantPisos; i >= 1; i--) {
      const dptos = Array.from({ length: dptosPorPiso }, (_, j) => String.fromCharCode(65 + j));
      pisos.push({ nombre: String(i), dptos });
    }
    if (tienePB) {
      const pbDptos = Array.from({ length: pbDptosCount }, (_, j) => String.fromCharCode(65 + j));
      pisos.push({ nombre: "PB", dptos: pbDptos });
    }
    
    console.log('✅ Estructura regenerada:', pisos);
    setEstructura(pisos);
  }, [cantPisos, dptosPorPiso, tienePB, pbDptosCount]);

  // 4. Guardar en LocalStorage cada vez que cambie cualquier dato del estado
  useEffect(() => {
    // Solo guardar si no es el montaje inicial
    if (isInitialMount.current) {
      return;
    }

    const data = {
      paso,
      calle,
      numero,
      tienePB,
      pbDptosCount,
      cantPisos,
      dptosPorPiso,
      estructura,
      idUnico,
      timbres,
    };
    
    console.log('Guardando en localStorage:', data);
    localStorage.setItem('wizardData', JSON.stringify(data));
  }, [paso, calle, numero, tienePB, pbDptosCount, cantPisos, dptosPorPiso, estructura, idUnico, timbres]);

  const eliminarDpto = (pisoIdx: number, letraDpto: string) => {
    const nuevaEstructura = JSON.parse(JSON.stringify(estructura));
    const piso = nuevaEstructura[pisoIdx];
    if (piso && piso.dptos) {
        piso.dptos = piso.dptos.filter((d: string) => d !== letraDpto);
    }
    setEstructura(nuevaEstructura);
  };

  // --- Navegación ---
  const siguiente = () => setPaso(p => Math.min(p + 1, totalPasos));
  const anterior = () => setPaso(p => Math.max(p - 1, 1));
  
  // Función para manejar solicitudes de timbre
  const handleSolicitudTimbre = (data: { nombre: string; telefono: string; departamento: string }) => {
    const [piso, dpto] = data.departamento.split('-');
    const id = `${piso}-${dpto}`;
    
    // Crear solicitud
    const solicitud: TimbreConfig = {
      id,
      piso,
      dpto,
      numero: data.telefono,
      metodo: 'mensaje',
      estado: 'activo',
      esPropio: false,
      estadoAsignacion: 'solicitado'
    };
    
    // Actualizar timbres
    const otros = timbres.filter(t => t.id !== id);
    setTimbres([...otros, solicitud]);
    
    // Mostrar confirmación
    alert(`✅ Solicitud enviada: ${data.nombre} del ${data.departamento}\n\nEl administrador revisará tu solicitud y te contactará por WhatsApp.`);
  };

  // Guardar Paso 1
  const guardarEstructura = async () => {
    try {
      console.log("Guardando estructura en la base de datos...");
      
      // 🔧 CRÍTICO: Usar el idUnico existente, NO generar uno nuevo
      if (!idUnico) {
        alert("Error: No se encontró el ID único del edificio");
        return;
      }
      
      console.log("🔍 Usando idUnico existente:", idUnico);
      
    const direccion = { calle, numero };
    const estructuraFinal = estructura.map(piso => ({
      ...piso,
      dptos: piso.dptos.filter(d => d && d.trim() !== '' && d !== 'X')
    }));
    
      // 🔧 CRÍTICO: Enviar el idUnico existente al endpoint
      const response = await fetch('/api/admin/estructura', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUnico, // 🔧 CRÍTICO: Incluir el idUnico existente
          direccion,
          estructura: estructuraFinal
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("✅ Estructura guardada exitosamente:", result);
        // 🔧 CRÍTICO: NO cambiar el idUnico, mantener el original
        console.log("✅ Manteniendo idUnico original:", idUnico);
        
        // Actualizar el estado local con el ID real
        setEstructura(estructuraFinal);
        
        // Avanzar al siguiente paso
        siguiente();
      } else {
        console.error("Error al guardar estructura:", result.error);
        alert(`Error al guardar: ${result.error}`);
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      alert("Error de conexión. Intenta nuevamente.");
    }
  };

  // Guardar timbres al final del wizard
  const guardarTimbres = async () => {
    try {
      console.log("Guardando timbres en la base de datos...");
      
      if (!idUnico) {
        alert("Error: No se encontró el ID único del edificio");
        return false;
      }

      console.log('🔍 VALIDACIÓN FINALIZAR - Timbres totales:', timbres);
      console.log('🔍 VALIDACIÓN FINALIZAR - Estados de asignación:', timbres.map(t => ({ id: t.id, estado: t.estadoAsignacion, numero: t.numero })));
      
      // Filtrar solo timbres configurados (con número asignado)
      const timbresConfigurados = timbres.filter(t => 
        (t.estadoAsignacion === 'configurado' || 
         t.estadoAsignacion === 'asignado' ||
         (t.numero && t.numero.trim() !== ''))
      );

      console.log('🔍 VALIDACIÓN FINALIZAR - Timbres configurados:', timbresConfigurados);

      if (timbresConfigurados.length === 0) {
        console.log('❌ VALIDACIÓN FINALIZAR - No hay timbres configurados');
        alert("Debes configurar al menos un timbre antes de finalizar");
        return false;
      }

      // Hacer POST para actualizar los timbres
      const response = await fetch(`/api/admin/timbres/${idUnico}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timbres: timbresConfigurados
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log("Timbres guardados exitosamente:", result);
        return true;
      } else {
        console.error("Error al guardar timbres:", result.error);
        alert(`Error al guardar timbres: ${result.error}`);
        return false;
      }
    } catch (error) {
      console.error("Error en la petición de timbres:", error);
      alert("Error de conexión al guardar timbres. Intenta nuevamente.");
      return false;
    }
  };
  
  const handleSiguiente = async () => {
    if (paso === 1) {
      await guardarEstructura();
    } else if (paso === totalPasos) {
      // Guardar timbres antes de mostrar confirmación
      const timbresGuardados = await guardarTimbres();
      if (timbresGuardados) {
        // Mostrar modal de confirmación antes de finalizar
        setShowPaso3Confirm(true);
      }
    } else {
      siguiente();
      }
  }

  const renderDireccion = () => (
      <div style={{ position: 'relative', width: '100%', marginBottom: 24 }}>
        {/* Label encimado */}
        <div style={{ 
          position: 'absolute', 
          top: '-12px', 
          left: '12px', 
          background: '#f8faff', 
          padding: '0 8px', 
          fontSize: '14px', 
          color: '#1a4fa3', 
          fontWeight: 600,
          zIndex: 1
        }}>
          Dirección
          </div>
        
        {/* Contenedor de inputs */}
        <div style={{ 
          display: 'flex', 
          gap: 8, 
          border: '1.5px solid #bbb', 
          borderRadius: 12, 
          padding: '16px 12px', 
          background: '#f8faff' 
        }}>
          <input 
            ref={calleRef}
            tabIndex={1}
            placeholder="Calle" 
            value={calle} 
            onChange={e => setCalle(e.target.value)} 
            style={{ 
              width: '65%', 
              padding: '12px', 
              borderRadius: 8, 
              border: '1.5px solid #bfc5d2',
              outline: 'none',
              background: '#fff', 
              color: '#222',
              fontSize: 16,
              boxShadow: '0 1px 4px #0001',
              letterSpacing: '1.5px'
            }} 
          />
          <input 
            tabIndex={2}
            placeholder="Altura" 
            value={numero} 
            onChange={e => setNumero(e.target.value)} 
            style={{ 
              width: '30%', 
              padding: '12px', 
              borderRadius: 8, 
              border: '1.5px solid #bfc5d2',
              outline: 'none',
              background: '#fff', 
              color: '#222',
              fontSize: 16,
              textAlign: 'center',
              boxShadow: '0 1px 4px #0001',
              letterSpacing: '1.5px'
            }} 
          />
        </div>
      </div>
    );

  const renderEstructura = () => {
    // Grilla grande - NO EDITABLE, solo eliminar con X
    const grilla = (
      <div style={{ padding: '8px 0' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: `40px repeat(${dptosPorPiso}, 1fr)`, 
          gap: '8px 4px', 
          justifyItems: 'center',
          alignItems: 'center'
        }}>
          {/* Cabecera */}
          <div />
          {Array.from({ length: dptosPorPiso }, (_, i) => <div key={i} style={{ textAlign: 'center', fontWeight: 700, color: '#1a4fa3' }}>{String.fromCharCode(65 + i)}</div>)}
          {/* Filas */}
          {estructura.map((piso, pisoIdx) => (
            <React.Fragment key={piso.nombre}>
              <div style={{ fontWeight: 700, color: '#1a4fa3', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{piso.nombre}</div>
              {Array.from({ length: dptosPorPiso }, (_, colIndex) => {
                  const letraColumna = String.fromCharCode(65 + colIndex);
                  const dpto = piso.dptos.find(d => d === letraColumna);
                  return (
                      <div key={colIndex} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 44, gap: 1 }}>
                         {dpto ? (
                            <>
                                <div style={{ width: 38, height: 28, border: '2px solid #bbb', background: '#fff', fontWeight: 700, fontSize: 14, color: '#1976d2', textAlign: 'center', borderRadius: 8, boxShadow: '0 1px 4px #0001', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {dpto}
                                </div>
                                <button 
                                  onClick={() => eliminarDpto(pisoIdx, dpto)} 
                                  title="Eliminar departamento" 
                                  style={{ 
                                    background: 'none', 
                                    border: 'none', 
                                    color: '#c00', 
                                    fontWeight: 700, 
                                    cursor: 'pointer', 
                                    fontSize: 14, 
                                    lineHeight: 1, 
                                    padding: 0, 
                                    height: 14, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onMouseEnter={(e) => {
                                    e.currentTarget.style.color = '#f00';
                                    e.currentTarget.style.transform = 'scale(1.2)';
                                  }}
                                  onMouseLeave={(e) => {
                                    e.currentTarget.style.color = '#c00';
                                    e.currentTarget.style.transform = 'scale(1)';
                                  }}
                                >
                                    ×
                                </button>
                            </>
                         ) : <div style={{height: 44}} />}
                      </div>
                  );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    );

    // Solo la grilla sin controles ni marco
    return (
      <div style={{ width: '100%' }}>
        {grilla}
      </div>
    );
  };

  const renderPaso2_Timbres = () => {
    const totalTimbres = estructura.reduce((acc, piso) => acc + piso.dptos.length, 0);
    const timbresConfigurados = timbres.filter(t => t.estadoAsignacion === 'configurado').length;
    const timbresAsignados = timbres.filter(t => t.estadoAsignacion === 'asignado').length;
    const maxDptos = Math.max(0, ...estructura.map(p => p.dptos.length));

    return (
      <>
        {/* Dirección arriba */}
        {renderDireccion()}
        
        {/* Grilla de timbres debajo */}
        <div style={{ position: 'relative', width: '100%', border: '1.5px solid #bbb', borderRadius: 12, padding: '24px 16px 16px', background: '#f8faff', minHeight: 450, maxWidth: '1760px' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '12px', background: '#f8faff', padding: '0 8px', fontSize: '14px', color: '#1a4fa3', fontWeight: 600, zIndex: 1 }}>
            Timbres
          </div>
          <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 12, background: '#fcfdff' }}>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: `40px repeat(${maxDptos}, 1fr)`, 
              gap: '8px 4px', 
              justifyItems: 'center',
              alignItems: 'center'
            }}>
              {/* Cabecera de Letras */}
              <div />
              {Array.from({ length: maxDptos }, (_, i) => <div key={i} style={{ textAlign: 'center', fontWeight: 700, color: '#1a4fa3' }}>{String.fromCharCode(65 + i)}</div>)}
              {/* Filas de Timbres */}
              <ConfigTimbres 
                estructura={estructura}
                timbres={timbres}
                onChange={setTimbres}
                maxDptos={maxDptos}
              />
            </div>
          </div>
          {/* Header debajo de la grilla de timbres */}
          <div style={{ width: '100%', marginTop: 16 }}>
            <TimbreHeader 
              total={totalTimbres} 
              configurados={timbresConfigurados} 
              asignados={timbresAsignados} 
            />
          </div>
          
          {/* Botón para simular solicitud de residente - OCULTO */}
          {/* <div style={{ width: '100%', marginTop: 16, textAlign: 'center' }}>
            <button
              onClick={() => setShowSolicitudModal(true)}
              style={{
                background: '#4caf50',
                color: '#fff',
                border: 'none',
                borderRadius: 12,
                padding: '12px 24px',
                fontWeight: 700,
                fontSize: 16,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px #0002'
              }}
            >
              🏠 Simular Solicitud de Residente
            </button>
            <p style={{ color: '#666', fontSize: 12, marginTop: 8 }}>
              (Este botón simula que un residente solicita su timbre)
            </p>
          </div> */}
        </div>
        {showPaso2Info && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(30,40,60,0.25)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div style={{ 
              background: '#fff', 
              borderRadius: 16, 
              boxShadow: '0 8px 32px #0003', 
              padding: 32, 
              minWidth: 320, 
              maxWidth: 420, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#1a4fa3', fontWeight: 800, fontSize: 22, marginBottom: 16 }}>
                Configuración de Timbres
              </h3>
              <div style={{ 
                background: '#f0f4fa', 
                borderRadius: 12, 
                padding: 16, 
                marginBottom: 20,
                border: '1px solid #e0e8f0'
              }}>
                <p style={{ color: '#333', fontSize: 15, lineHeight: 1.5, margin: 0 }}>
                  <strong>Paso 1:</strong> Haz clic en un departamento para configurarlo<br/>
                  <strong>Paso 2:</strong> Marca "Asignar a mi cuenta" para tu timbre<br/>
                  <strong>Paso 3:</strong> Ingresa tu número de WhatsApp<br/>
                  <strong>Paso 4:</strong> Elige el método de contacto (mensaje, llamada, video)
                </p>
              </div>
              <p style={{ color: '#666', fontSize: 14, marginBottom: 20, lineHeight: 1.4 }}>
                <strong>Importante:</strong> Debes configurar al menos un timbre para poder continuar al siguiente paso.
              </p>
              <button 
                onClick={() => setShowPaso2Info(false)} 
                style={{ 
                  background: '#1a4fa3', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 28px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                ¡Entendido!
              </button>
            </div>
                  </div>
      )}

      {/* Modal de solicitud de timbre */}
      <SolicitudTimbreModal
        isOpen={showSolicitudModal}
        onClose={() => setShowSolicitudModal(false)}
        onSubmit={handleSolicitudTimbre}
        estructura={estructura}
        timbres={timbres}
      />
      </>
    );
  };

  // --- Render de cada paso ---
  const renderPaso1_Estructura = () => {
    // Calcular valores para el header (ya no se usa en este paso)
    return (
      <>
        {renderDireccion()}
        
        {/* Contenedor Estructura */}
        <div style={{ position: 'relative', width: '100%', border: '1.5px solid #bbb', borderRadius: 12, padding: '16px 12px', background: '#f8faff', minHeight: 450, maxWidth: '1760px' }}>
          <div style={{ position: 'absolute', top: '-12px', left: '12px', background: '#f8faff', padding: '0 8px', fontSize: '14px', color: '#1a4fa3', fontWeight: 600, zIndex: 1 }}>
            Estructura
          </div>
          
          {/* Controles Pisos, Dptos, PB (sin marco) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ color: '#333', fontWeight: 600 }}>Pisos</label>
              <input 
                tabIndex={3}
                type="number" 
                min={1} 
                value={cantPisos} 
                onChange={e => setCantPisos(Number(e.target.value))} 
                style={{ width: 60, padding: 12, borderRadius: 8, border: '1.5px solid #bfc5d2', background: '#fff', color: '#222', fontSize: 16, textAlign: 'center', boxShadow: '0 1px 4px #0001' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ color: '#333', fontWeight: 600 }}>Dptos</label>
              <input 
                tabIndex={4}
                type="number" 
                min={1} 
                max={20} 
                value={dptosPorPiso} 
                onChange={e => setDptosPorPiso(Number(e.target.value))} 
                style={{ width: 60, padding: 12, borderRadius: 8, border: '1.5px solid #bfc5d2', background: '#fff', color: '#222', fontSize: 16, textAlign: 'center', boxShadow: '0 1px 4px #0001' }} 
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <label style={{ color: '#333', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                <input 
                  tabIndex={5}
                  type="checkbox" 
                  checked={tienePB} 
                  onChange={e => setTienePB(e.target.checked)} 
                  style={{ width: 18, height: 18 }} 
                />
                PB
              </label>
              {tienePB && (
                <input 
                  tabIndex={6}
                  type="number" 
                  min={1} 
                  value={pbDptosCount} 
                  onChange={e => {
                    const num = parseInt(e.target.value, 10);
                    if (!isNaN(num) && num >= 1) {
                      setPbDptosCount(num);
                    }
                  }}
                  style={{ width: 60, padding: 12, borderRadius: 8, border: '1.5px solid #bfc5d2', background: '#fff', color: '#222', fontSize: 16, textAlign: 'center', boxShadow: '0 1px 4px #0001' }} 
                />
              )}
            </div>
          </div>

          {/* Grilla de Timbres */}
          {renderEstructura()}
        </div>
      </>
    );
  };
  
  const renderPaso3_Finalizar = () => (
    <>
      {/* Contenedor Central para Finalizar */}
      <div style={{ position: 'relative', width: '100%', border: '1.5px solid #bbb', borderRadius: 12, padding: '16px 16px 8px', background: '#f8faff', minHeight: 'auto', maxWidth: '1360px' }}>
        <div style={{ position: 'absolute', top: '-12px', left: '12px', background: '#f8faff', padding: '0 8px', fontSize: '14px', color: '#1a4fa3', fontWeight: 600, zIndex: 1 }}>
          Finalizar e Imprimir
        </div>

        {/* Contenedor "Grande" para Vista Previa */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1.5px solid #e0e0e0', width: '100%', marginBottom: 8, textAlign: 'center' }}>
          {/* Marco Doble para la etiqueta */}
          <div id="etiqueta-qr-preview" style={{
              padding: '4px',
              border: '1px solid #e0e0e0',
              borderRadius: '16px',
              display: 'inline-block',
              background: '#e8e8e8',
              boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }}>
              <div style={{padding: '20px', border: '1px solid #fff', borderRadius: '12px', background: '#fff'}}>
                  <h3 style={{color: '#1a4fa3', fontWeight: 800, fontSize: 22, margin: '0 0 10px 0'}}>
                    🔔 TIMBRE 🔔
                  </h3>
                  <p style={{fontWeight: 700, fontSize: 22, margin: '0 0 12px 0', color: '#888'}}>{calle} {numero}</p>
                  <QRCodeDisplay value={`https://qring.app/acceso/${idUnico || 'test-id'}`} />
                  <p style={{fontSize: 14, color: '#333', margin: '6px auto 0 auto', width: '180px'}}>Escaneá para tocar timbre</p>
                  <p style={{fontWeight: 600, fontSize: 14, color: '#1a4fa3', margin: '12px 0 0 0'}}>QRing 2.0</p>
              </div>
          </div>
        </div>

        {/* Contenedor "Chico" para Opciones */}
        <div style={{ background: '#fff', borderRadius: 12, padding: '16px', border: '1.5px solid #e0e0e0', width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={() => descargarEtiquetaQR()}
            style={{width: '100%', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>
            ⬇️ Descargar etiqueta digital
          </button>
          <a
            href="https://ciudaddellaser.com.ar/"
            target="_blank"
            rel="noopener noreferrer"
            style={{textDecoration: 'none', width: '100%'}}
          >
            <button style={{width: '100%', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 8, padding: '12px', fontWeight: 700, fontSize: 16, cursor: 'pointer'}}>
              ⚡ Cotizar grabado láser
            </button>
          </a>
        </div>
      </div>
    </>
  );

  // Función para descargar la etiqueta como imagen PNG
  function descargarEtiquetaQR() {
    const node = document.getElementById('etiqueta-qr-preview');
    if (!node) return;
    import('html-to-image').then(htmlToImage => {
      htmlToImage.toPng(node)
        .then(function (dataUrl) {
          const link = document.createElement('a');
          link.download = `Etiqueta-QRing-${calle}-${numero}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(function (error) {
          alert('Error al generar la imagen: ' + error);
        });
    });
  }

  const renderContenido = () => {
    switch (paso) {
      case 1:
        return renderPaso1_Estructura();
      case 2:
        return renderPaso2_Timbres();
      case 3:
        return renderPaso3_Finalizar();
      default:
        return <div>Paso desconocido</div>;
    }
  };

  const infoTextos: {[key: number]: string} = {
    1: "Define la dirección y la estructura de tu edificio. Puedes hacer clic en la 'x' roja para eliminar departamentos que no existen y ajustar la grilla a la perfección.",
    2: "¡Es hora de dar vida a los timbres! Haz clic en cada departamento para asignar un número de WhatsApp y configurar su estado. Recuerda asignarte al menos un timbre para poder finalizar.",
    3: "¡Todo listo! Aquí podrás generar e imprimir los códigos QR para las entradas de tu edificio."
  };

  return (
    <>
    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, paddingTop: 40}}>
        <div style={{width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16}}>
          {renderContenido()}
          <NavegacionWizard
            paso={paso}
            totalPasos={totalPasos}
            onAnterior={anterior}
            onSiguiente={handleSiguiente}
            esPasoFinal={paso === totalPasos}
          />
        </div>
      <div style={{width: 480, paddingTop: 0}}>
        <CInfo texto={infoTextos[paso] || ""} />
      </div>
    </div>

      {/* Modal de confirmación del paso 3 */}
      {showPaso3Confirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(30,40,60,0.25)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            boxShadow: '0 8px 32px #0003', 
            padding: 32, 
            minWidth: 320, 
            maxWidth: 420, 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            textAlign: 'center'
          }}>
            <h3 style={{ color: '#1a4fa3', fontWeight: 800, fontSize: 24, marginBottom: 16 }}>
              ¡Configuración Completada!
            </h3>
            <p style={{ color: '#333', fontSize: 16, marginBottom: 24, lineHeight: 1.5 }}>
              Tu edificio <strong>{calle} {numero}</strong> ha sido configurado exitosamente. 
              Serás redirigido al panel de administración donde podrás gestionar todos los timbres.
            </p>
            <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
              <button 
                onClick={() => setShowPaso3Confirm(false)} 
                style={{ 
                  background: '#f0f0f0', 
                  color: '#333', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer' 
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  setShowPaso3Confirm(false);
                  if (typeof window !== 'undefined') {
                    window.location.href = `/inicio`;
                  }
                }} 
                style={{ 
                  background: '#4caf50', 
                  color: '#fff', 
                  border: 'none', 
                  borderRadius: 10, 
                  padding: '12px 24px', 
                  fontWeight: 700, 
                  fontSize: 16, 
                  cursor: 'pointer' 
                }}
              >
                Ir al Panel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 