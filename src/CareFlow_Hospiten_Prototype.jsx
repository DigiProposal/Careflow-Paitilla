
// CareFlow × Hospiten Paitilla — Enterprise Prototype v1.0
// Complete navigable demo with all modules

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────
// SEED DATA ENGINE
// ─────────────────────────────────────────────────────────

const ASEGURADORAS = {
  INT: { name: "Internacional de Seguros", short: "INTS", color: "#3B82F6" },
  WW: { name: "Worldwide Medical", short: "WWM", color: "#8B5CF6" },
  ASSA: { name: "ASSA Compañía de Seguros", short: "ASSA", color: "#10B981" },
  MAPFRE: { name: "MAPFRE Panamá", short: "MPF", color: "#F59E0B" },
};

const ESTADOS = {
  IDENTIFICADO: { label: "Identificado", color: "#94A3B8", bg: "#1E293B" },
  ELEGIBILIDAD_PROCESO: { label: "Verificando Elegibilidad", color: "#F59E0B", bg: "#2D1F00" },
  ELEGIBLE: { label: "Elegible", color: "#10B981", bg: "#052E16" },
  NO_ELEGIBLE: { label: "No Elegible", color: "#EF4444", bg: "#2D0707" },
  PREAUT_PENDIENTE: { label: "Preaut. Pendiente", color: "#F59E0B", bg: "#2D1F00" },
  PREAUT_APROBADA: { label: "Preaut. Aprobada", color: "#10B981", bg: "#052E16" },
  PREAUT_RECHAZADA: { label: "Preaut. Rechazada", color: "#EF4444", bg: "#2D0707" },
  APELACION: { label: "Apelación en Curso", color: "#F97316", bg: "#2D1100" },
  PREADMITIDO: { label: "Preadmitido", color: "#0EA5E9", bg: "#0C2340" },
  ADMITIDO: { label: "Admitido", color: "#06B6D4", bg: "#0A2030" },
  EN_ATENCION: { label: "En Atención", color: "#22C55E", bg: "#052E16" },
  ALTA_MEDICA: { label: "Alta Médica Emitida", color: "#F59E0B", bg: "#2D1F00" },
  CONSOLIDANDO: { label: "Consolidando Cuenta", color: "#A855F7", bg: "#1A0A2E" },
  LISTO_EGRESO: { label: "Listo para Egreso", color: "#10B981", bg: "#052E16" },
  RECLAMO_ENVIADO: { label: "Reclamo Enviado", color: "#3B82F6", bg: "#0A1628" },
  RECLAMO_REVISION: { label: "Reclamo en Revisión", color: "#F59E0B", bg: "#2D1F00" },
  RECLAMO_APROBADO: { label: "Reclamo Aprobado", color: "#10B981", bg: "#052E16" },
  GLOSA: { label: "Glosa / Observación", color: "#EF4444", bg: "#2D0707" },
  CERRADO: { label: "Caso Cerrado", color: "#64748B", bg: "#1E293B" },
};

const PACIENTES = [
  {
    id: "CF-2026-0341",
    nombre: "Carlos Mendoza Ruiz",
    cedula: "8-342-1872",
    edad: 47,
    sexo: "M",
    aseguradora: "INT",
    poliza: "POL-MINSEG-2024-4421",
    piloto: "MINSEG",
    diagnostico: "I20.9 — Angina de pecho, no especificada",
    icd10: "I20.9",
    area: "Urgencias",
    estado: "EN_ATENCION",
    cama: "URG-04",
    ingreso: "08:14",
    altaMedica: null,
    altaAdmin: null,
    copago: 0,
    cobertura: 100,
    monto: 2840,
    alertas: ["ECG pendiente de resultado"],
    tiempos: { elegibilidad: 18, preautorizacion: 42, admision: 6 },
  },
  {
    id: "CF-2026-0342",
    nombre: "Miriam Delgado Torres",
    cedula: "9-712-3340",
    edad: 35,
    sexo: "F",
    aseguradora: "WW",
    poliza: "WWM-SOMOS-8821-C",
    piloto: "Somos/Worldwide",
    diagnostico: "M54.5 — Lumbalgia",
    icd10: "M54.5",
    area: "Urgencias",
    estado: "ALTA_MEDICA",
    cama: "URG-07",
    ingreso: "06:45",
    altaMedica: "10:32",
    altaAdmin: null,
    copago: 0,
    cobertura: 100,
    monto: 920,
    alertas: ["Alta médica hace 2h 18m — sin consolidación"],
    tiempos: { elegibilidad: 22, preautorizacion: 55, admision: 8 },
  },
  {
    id: "CF-2026-0343",
    nombre: "Roberto Salcedo Pinzón",
    cedula: "6-219-4401",
    edad: 62,
    sexo: "M",
    aseguradora: "ASSA",
    poliza: "ASSA-2023-GEN-9901",
    piloto: null,
    diagnostico: "J18.9 — Neumonía, no especificada",
    icd10: "J18.9",
    area: "Hospitalización",
    estado: "CONSOLIDANDO",
    cama: "HAB-312",
    ingreso: "Ayer 22:10",
    altaMedica: "09:15",
    altaAdmin: null,
    copago: 150,
    cobertura: 90,
    monto: 5620,
    alertas: [],
    tiempos: { elegibilidad: 30, preautorizacion: 68, admision: 11 },
  },
  {
    id: "CF-2026-0344",
    nombre: "Ana Lucia Vargas",
    cedula: "8-901-2233",
    edad: 28,
    sexo: "F",
    aseguradora: "INT",
    poliza: "POL-MINSEG-2024-3312",
    piloto: "MINSEG",
    diagnostico: "R10.3 — Dolor abdominal agudo",
    icd10: "R10.3",
    area: "Urgencias",
    estado: "PREAUT_APROBADA",
    cama: "URG-02",
    ingreso: "11:02",
    altaMedica: null,
    altaAdmin: null,
    copago: 0,
    cobertura: 100,
    monto: 1240,
    alertas: [],
    tiempos: { elegibilidad: 14, preautorizacion: 38, admision: 5 },
  },
  {
    id: "CF-2026-0345",
    nombre: "Héctor Fuentes Mora",
    cedula: "7-445-9812",
    edad: 55,
    sexo: "M",
    aseguradora: "MAPFRE",
    poliza: "MPF-2024-EMP-7821",
    piloto: null,
    diagnostico: "I10 — Hipertensión esencial",
    icd10: "I10",
    area: "Urgencias",
    estado: "PREAUT_RECHAZADA",
    cama: null,
    ingreso: "10:44",
    altaMedica: null,
    altaAdmin: null,
    copago: 200,
    cobertura: 80,
    monto: 680,
    alertas: ["Preautorización rechazada — requiere apelación manual"],
    tiempos: { elegibilidad: 25, preautorizacion: null, admision: null },
  },
  {
    id: "CF-2026-0346",
    nombre: "Sandra Castillo López",
    cedula: "9-234-7761",
    edad: 41,
    sexo: "F",
    aseguradora: "WW",
    poliza: "WWM-SOMOS-4412-A",
    piloto: "Somos/Worldwide",
    diagnostico: "S82.0 — Fractura de rótula",
    icd10: "S82.0",
    area: "Cirugía",
    estado: "PREADMITIDO",
    cama: "QUIROF-2",
    ingreso: "Programado 14:00",
    altaMedica: null,
    altaAdmin: null,
    copago: 0,
    cobertura: 100,
    monto: 8400,
    alertas: [],
    tiempos: { elegibilidad: 20, preautorizacion: 44, admision: null },
  },
];

const RECLAMOS = [
  { id: "RCL-2026-0891", paciente: "Luis Herrera Blanco", aseguradora: "INT", monto: 3240, estado: "RECLAMO_APROBADO", dias: 3, fecha: "2026-03-06" },
  { id: "RCL-2026-0892", paciente: "Patricia Núñez", aseguradora: "WW", monto: 1890, estado: "RECLAMO_REVISION", dias: 7, fecha: "2026-03-02" },
  { id: "RCL-2026-0893", paciente: "Jorge Martínez", aseguradora: "ASSA", monto: 5610, estado: "GLOSA", dias: 12, fecha: "2026-02-25" },
  { id: "RCL-2026-0894", paciente: "Isabel Rojas", aseguradora: "INT", monto: 920, estado: "RECLAMO_APROBADO", dias: 2, fecha: "2026-03-07" },
  { id: "RCL-2026-0895", paciente: "Fernanda Lima", aseguradora: "MAPFRE", monto: 2100, estado: "RECLAMO_ENVIADO", dias: 1, fecha: "2026-03-08" },
];

const ALERTAS_DATA = [
  { id: 1, tipo: "CRITICA", titulo: "Alta médica sin consolidación", desc: "Miriam Delgado — Alta emitida hace 2h 18m. Cuenta sin consolidar.", paciente: "CF-2026-0342", tiempo: "hace 2h 18m", icono: "clock" },
  { id: 2, tipo: "ALTA", titulo: "Preautorización rechazada", desc: "Héctor Fuentes — MAPFRE rechazó preautorización. Requiere apelación.", paciente: "CF-2026-0345", tiempo: "hace 32m", icono: "x" },
  { id: 3, tipo: "MEDIA", titulo: "Glosa en reclamo", desc: "RCL-2026-0893 — ASSA observa documentación. Monto: $5,610", paciente: null, tiempo: "hace 4h", icono: "alert" },
  { id: 4, tipo: "INFO", titulo: "Paciente VIP admitido", desc: "Carlos Mendoza — Piloto MINSEG. Ingresó sin copago vía QR.", paciente: "CF-2026-0341", tiempo: "hace 2h 46m", icono: "star" },
  { id: 5, tipo: "INFO", titulo: "Preautorización aprobada", desc: "Ana Lucia Vargas — INT aprobó en 38 segundos. Admisión completada.", paciente: "CF-2026-0344", tiempo: "hace 58m", icono: "check" },
];

const KPI_DATA = {
  admision: { actual: 6.2, meta: 4, unidad: "min", tendencia: "down", label: "Tiempo Admisión" },
  cobertura: { actual: 22, meta: 30, unidad: "seg", tendencia: "down", label: "Validación Cobertura" },
  preautorizacion: { actual: 49, meta: 60, unidad: "seg", tendencia: "down", label: "Preautorización" },
  brecha: { actual: 2.3, meta: 0.5, unidad: "hr", tendencia: "down", label: "Brecha Alta-Egreso" },
  reclamos_enviados: { actual: 28, meta: null, unidad: "", tendencia: "up", label: "Reclamos Enviados (mes)" },
  reclamos_aprobados: { actual: 19, meta: null, unidad: "", tendencia: "up", label: "Reclamos Aprobados" },
  glosas: { actual: 3, meta: null, unidad: "", tendencia: "down", label: "Glosas Activas" },
  dias_liquidacion: { actual: 5.8, meta: 7, unidad: "días", tendencia: "down", label: "Días Liquidación" },
};

const INTEGRACIONES = [
  { id: "SAP", nombre: "SAP Hospitalario", tipo: "API Gateway / BAPI", estado: "MOCK", latencia: "~2s", version: "ECC 6.0 (pendiente confirmación)", inputs: ["IDPaciente", "NumeroAdmision"], outputs: ["Camas disponibles", "Estado cuenta", "Admisión confirmada"], nota: "Sin confirmación técnica. Integración via API intermediaria obligatoria por migración 2030." },
  { id: "EMED", nombre: "EMED Clínico", tipo: "REST API (pendiente)", estado: "MOCK", latencia: "~1s", version: "Pendiente inventario TI", inputs: ["IDPaciente"], outputs: ["Diagnóstico ICD-10", "Orden de alta médica", "Evoluciones clínicas"], nota: "Funcionalidades exactas por confirmar en Sesión 4 técnica." },
  { id: "INTS", nombre: "Internacional de Seguros", tipo: "REST API / Portal", estado: "SIMULADO", latencia: "~18s", version: "Portal web + llamada (actual manual)", inputs: ["Cédula", "NumeroPoliza", "ICD10"], outputs: ["Elegibilidad", "Copago", "Autorización"], nota: "Actualmente 100% manual. API a negociar." },
  { id: "WWM", nombre: "Worldwide Medical", tipo: "REST API", estado: "SIMULADO", latencia: "~24s", version: "Pendiente contacto técnico", inputs: ["Cédula", "NumeroPoliza", "ICD10"], outputs: ["Elegibilidad", "Copago", "Autorización"], nota: "Somos Seguros como corredor intermediario." },
  { id: "WA", nombre: "WhatsApp Business API", tipo: "Meta Cloud API", estado: "CONFIGURADO", latencia: "<1s", version: "Meta WABA v18", inputs: ["NumeroTel", "Mensaje"], outputs: ["Respuesta IA", "QR", "Notificaciones"], nota: "Integración estándar Meta. Confirmada." },
];

const WHATSAPP_FLOW = [
  { from: "paciente", text: "Hola, tengo un dolor fuerte en el pecho y el brazo izquierdo desde hace 20 minutos 😰", time: "11:02" },
  { from: "careflow", text: "🚨 *Alerta de urgencia detectada.* Estoy evaluando tu situación ahora mismo.\n\nPor favor confirma: ¿Eres paciente de seguros con Hospiten?", time: "11:02", delay: 800 },
  { from: "paciente", text: "Sí, soy policía. Tengo seguro de Internacional de Seguros con MINSEG", time: "11:03" },
  { from: "careflow", text: "✅ Verificando tu cobertura con Internacional de Seguros...\n\n*Cédula registrada:* 8-342-1872\n*Póliza activa:* POL-MINSEG-2024-4421\n*Cobertura:* 100% — Copago: $0", time: "11:03", delay: 1200 },
  { from: "careflow", text: "🏥 *Tu ingreso está siendo coordinado en Hospiten Paitilla.*\n\nUrgencias tiene disponibilidad ahora. Tu código QR de ingreso rápido:", time: "11:03", isQR: true, delay: 600 },
  { from: "careflow", text: "🚑 *Ambulancia despachada.* ETA: 8 minutos.\n\nTu acompañante será notificado automáticamente. El equipo médico está informado.\n\n📋 *No. de caso:* CF-2026-0341\n\n¿Quieres que notifique a alguien más?", time: "11:04", delay: 1000 },
  { from: "paciente", text: "Gracias, sí avisa a mi esposa al 6xxx-xxxx", time: "11:04" },
  { from: "careflow", text: "✅ *Notificación enviada a tu contacto de emergencia.*\n\nEstamos contigo, Carlos. El equipo de urgencias de Hospiten ya tiene tu información completa. No necesitas registrarte al llegar — solo muestra tu QR.\n\n*Tu seguridad es nuestra prioridad.* 💙", time: "11:04", delay: 500 },
];

// ─────────────────────────────────────────────────────────
// DESIGN SYSTEM
// ─────────────────────────────────────────────────────────

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap');
  
  * { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --bg: #070C18;
    --bg2: #0D1426;
    --surface: #111C33;
    --surface2: #1A2844;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --teal: #0BBBD4;
    --teal2: #06899E;
    --amber: #F59E0B;
    --amber2: #D97706;
    --red: #EF4444;
    --green: #10B981;
    --purple: #8B5CF6;
    --blue: #3B82F6;
    --text: #F1F5F9;
    --text2: #94A3B8;
    --text3: #475569;
    --font: 'Space Grotesk', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }

  body { font-family: var(--font); background: var(--bg); color: var(--text); overflow: hidden; }
  
  .app { display: flex; height: 100vh; width: 100vw; overflow: hidden; }
  
  /* SIDEBAR */
  .sidebar {
    width: 220px; min-width: 220px; background: var(--bg2); 
    border-right: 1px solid var(--border); display: flex; flex-direction: column;
    z-index: 10;
  }
  .sidebar-logo {
    padding: 20px 18px 16px; border-bottom: 1px solid var(--border);
  }
  .logo-mark { 
    display: flex; align-items: center; gap: 10px;
  }
  .logo-icon {
    width: 32px; height: 32px; border-radius: 8px;
    background: linear-gradient(135deg, var(--teal), var(--teal2));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: white; letter-spacing: -0.5px;
  }
  .logo-text { font-size: 15px; font-weight: 700; color: var(--text); letter-spacing: -0.3px; }
  .logo-sub { font-size: 10px; color: var(--text3); font-family: var(--mono); margin-top: 2px; }
  
  .sidebar-section { padding: 8px; flex: 1; overflow-y: auto; }
  .sidebar-label {
    font-size: 9.5px; font-weight: 600; color: var(--text3); letter-spacing: 1.2px;
    text-transform: uppercase; padding: 10px 8px 6px;
  }
  .nav-item {
    display: flex; align-items: center; gap: 9px; padding: 8px 10px;
    border-radius: 7px; cursor: pointer; font-size: 13px; font-weight: 500;
    color: var(--text2); transition: all 0.15s; margin-bottom: 1px;
    position: relative;
  }
  .nav-item:hover { background: var(--surface); color: var(--text); }
  .nav-item.active { background: rgba(11, 187, 212, 0.12); color: var(--teal); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 16px; background: var(--teal); border-radius: 0 2px 2px 0;
  }
  .nav-badge {
    margin-left: auto; background: var(--red); color: white;
    font-size: 9px; font-weight: 700; padding: 2px 5px; border-radius: 10px;
    font-family: var(--mono);
  }
  .nav-badge.amber { background: var(--amber); color: #000; }
  .nav-badge.teal { background: var(--teal); color: #000; }
  
  .sidebar-bottom {
    padding: 12px 8px; border-top: 1px solid var(--border);
  }
  .user-card {
    display: flex; align-items: center; gap: 9px; padding: 8px 10px;
    border-radius: 7px; cursor: pointer;
  }
  .user-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: linear-gradient(135deg, var(--teal), var(--purple));
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: white; flex-shrink: 0;
  }
  .user-info { flex: 1; min-width: 0; }
  .user-name { font-size: 12px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .user-role { font-size: 10px; color: var(--text3); }
  
  /* MAIN CONTENT */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  
  .topbar {
    height: 52px; background: var(--bg2); border-bottom: 1px solid var(--border);
    display: flex; align-items: center; padding: 0 20px; gap: 12px; flex-shrink: 0;
  }
  .topbar-title { font-size: 14px; font-weight: 600; color: var(--text); flex: 1; }
  .topbar-sub { font-size: 11px; color: var(--text3); font-family: var(--mono); }
  
  .content { flex: 1; overflow-y: auto; padding: 20px; }
  
  /* CARDS */
  .card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px; overflow: hidden;
  }
  .card-header {
    padding: 14px 16px 12px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .card-title { font-size: 12px; font-weight: 600; color: var(--text); letter-spacing: 0.2px; }
  .card-sub { font-size: 10px; color: var(--text3); margin-top: 2px; }
  .card-body { padding: 16px; }
  
  /* KPI CARDS */
  .kpi-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 16px; }
  .kpi-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
    padding: 14px 16px; position: relative; overflow: hidden;
  }
  .kpi-card::before {
    content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }
  .kpi-card.teal::before { background: var(--teal); }
  .kpi-card.amber::before { background: var(--amber); }
  .kpi-card.green::before { background: var(--green); }
  .kpi-card.red::before { background: var(--red); }
  .kpi-card.purple::before { background: var(--purple); }
  .kpi-label { font-size: 10px; color: var(--text3); font-weight: 500; letter-spacing: 0.3px; text-transform: uppercase; }
  .kpi-value { font-size: 26px; font-weight: 700; color: var(--text); margin-top: 6px; font-family: var(--mono); letter-spacing: -1px; }
  .kpi-unit { font-size: 12px; color: var(--text2); margin-left: 3px; font-family: var(--font); }
  .kpi-meta { font-size: 10px; color: var(--text3); margin-top: 4px; display: flex; align-items: center; gap: 4px; }
  .kpi-trend-good { color: var(--green); }
  .kpi-trend-bad { color: var(--red); }
  .kpi-trend-warn { color: var(--amber); }
  
  /* TABLES */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: collapse; }
  th { 
    font-size: 10px; font-weight: 600; color: var(--text3); text-transform: uppercase;
    letter-spacing: 0.8px; padding: 10px 14px; text-align: left;
    border-bottom: 1px solid var(--border); white-space: nowrap;
  }
  td { 
    font-size: 12px; color: var(--text2); padding: 11px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04); vertical-align: middle;
  }
  tr:hover td { background: rgba(255,255,255,0.02); }
  tr:last-child td { border-bottom: none; }
  
  /* STATUS BADGES */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 8px; border-radius: 20px; font-size: 10px; font-weight: 600;
    white-space: nowrap; font-family: var(--mono);
  }
  .badge-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
  
  /* BUTTONS */
  .btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 7px 14px; border-radius: 6px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: none; transition: all 0.15s; font-family: var(--font);
    white-space: nowrap;
  }
  .btn-teal { background: var(--teal); color: #000; }
  .btn-teal:hover { background: #0DD0EC; }
  .btn-amber { background: var(--amber); color: #000; }
  .btn-amber:hover { background: #FBB92A; }
  .btn-ghost { background: transparent; color: var(--text2); border: 1px solid var(--border2); }
  .btn-ghost:hover { background: var(--surface2); color: var(--text); }
  .btn-red { background: rgba(239,68,68,0.15); color: var(--red); border: 1px solid rgba(239,68,68,0.3); }
  .btn-red:hover { background: rgba(239,68,68,0.25); }
  .btn-sm { padding: 4px 10px; font-size: 11px; border-radius: 5px; }
  
  /* GRID */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
  
  /* PATIENT CARD */
  .patient-row-critical { background: rgba(239,68,68,0.04) !important; }
  .patient-row-warning { background: rgba(245,158,11,0.04) !important; }
  
  /* TIMELINE */
  .timeline { display: flex; flex-direction: column; gap: 0; }
  .tl-item { display: flex; gap: 12px; padding-bottom: 16px; position: relative; }
  .tl-item:last-child { padding-bottom: 0; }
  .tl-left { display: flex; flex-direction: column; align-items: center; }
  .tl-dot { 
    width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 10px; flex-shrink: 0; z-index: 1;
  }
  .tl-line { width: 1px; flex: 1; background: var(--border); margin-top: 2px; margin-bottom: 2px; }
  .tl-content { flex: 1; padding-top: 4px; }
  .tl-title { font-size: 12px; font-weight: 600; color: var(--text); }
  .tl-meta { font-size: 10px; color: var(--text3); margin-top: 2px; font-family: var(--mono); }
  .tl-detail { font-size: 11px; color: var(--text2); margin-top: 4px; line-height: 1.5; }
  
  /* WHATSAPP */
  .wa-container { background: #0A1628; border-radius: 10px; overflow: hidden; }
  .wa-header { 
    background: #0D6B5E; padding: 12px 16px; display: flex; align-items: center; gap: 10px;
  }
  .wa-avatar { 
    width: 36px; height: 36px; border-radius: 50%; background: var(--teal);
    display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700;
  }
  .wa-name { font-size: 13px; font-weight: 600; color: white; }
  .wa-status { font-size: 10px; color: rgba(255,255,255,0.7); }
  .wa-body { padding: 16px; min-height: 320px; max-height: 400px; overflow-y: auto; display: flex; flex-direction: column; gap: 8px; }
  .wa-bubble {
    max-width: 80%; padding: 8px 12px; border-radius: 8px; font-size: 12px; line-height: 1.5;
    white-space: pre-wrap;
  }
  .wa-bubble.from-paciente { background: #1F2B3E; color: var(--text); align-self: flex-start; border-radius: 2px 8px 8px 8px; }
  .wa-bubble.from-careflow { background: #0D4B42; color: #E2F5F2; align-self: flex-end; border-radius: 8px 2px 8px 8px; }
  .wa-time { font-size: 9px; color: rgba(255,255,255,0.4); margin-top: 3px; font-family: var(--mono); }
  .wa-qr { 
    background: white; padding: 8px; border-radius: 6px; width: 80px; height: 80px;
    display: flex; align-items: center; justify-content: center;
    font-size: 8px; color: #000; text-align: center; margin-top: 4px; font-family: var(--mono);
  }
  .wa-input { 
    background: #0D1426; border-top: 1px solid var(--border); padding: 10px 14px;
    display: flex; gap: 8px; align-items: center;
  }
  .wa-field {
    flex: 1; background: var(--surface); border: 1px solid var(--border2); border-radius: 20px;
    padding: 7px 14px; font-size: 12px; color: var(--text); outline: none; font-family: var(--font);
  }
  
  /* INTEGRATION CARDS */
  .int-card {
    background: var(--surface); border: 1px solid var(--border); border-radius: 9px; padding: 14px;
    margin-bottom: 10px;
  }
  .int-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .int-icon { 
    width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center;
    justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0;
  }
  .int-name { font-size: 13px; font-weight: 600; color: var(--text); }
  .int-type { font-size: 10px; color: var(--text3); font-family: var(--mono); }
  .int-estado { 
    margin-left: auto; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: 700;
    font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.5px;
  }
  .int-MOCK { background: rgba(245,158,11,0.15); color: var(--amber); border: 1px solid rgba(245,158,11,0.3); }
  .int-SIMULADO { background: rgba(139,92,246,0.15); color: var(--purple); border: 1px solid rgba(139,92,246,0.3); }
  .int-CONFIGURADO { background: rgba(16,185,129,0.15); color: var(--green); border: 1px solid rgba(16,185,129,0.3); }
  .int-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; font-size: 11px; }
  .int-row { display: flex; gap: 4px; }
  .int-lbl { color: var(--text3); min-width: 60px; }
  .int-val { color: var(--text2); }
  .int-nota { font-size: 10px; color: var(--amber); margin-top: 8px; padding: 6px 8px; background: rgba(245,158,11,0.08); border-radius: 5px; line-height: 1.4; }
  
  /* ALERT CARDS */
  .alert-card {
    display: flex; gap: 12px; padding: 12px 14px; border-radius: 8px; margin-bottom: 8px;
    cursor: pointer; transition: all 0.15s; border: 1px solid transparent;
  }
  .alert-card:hover { border-color: var(--border2); }
  .alert-CRITICA { background: rgba(239,68,68,0.08); border-color: rgba(239,68,68,0.2) !important; }
  .alert-ALTA { background: rgba(245,158,11,0.08); border-color: rgba(245,158,11,0.15) !important; }
  .alert-MEDIA { background: rgba(59,130,246,0.06); }
  .alert-INFO { background: rgba(16,185,129,0.05); }
  .alert-icon { width: 32px; height: 32px; border-radius: 7px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .alert-body { flex: 1; }
  .alert-title { font-size: 12px; font-weight: 600; color: var(--text); }
  .alert-desc { font-size: 11px; color: var(--text2); margin-top: 2px; line-height: 1.4; }
  .alert-time { font-size: 9px; color: var(--text3); margin-top: 4px; font-family: var(--mono); }
  
  /* FLOW STEPPER */
  .stepper { display: flex; align-items: center; gap: 0; margin-bottom: 20px; }
  .step { 
    display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600;
    padding: 6px 12px; border-radius: 4px; white-space: nowrap;
  }
  .step.done { color: var(--green); }
  .step.active { color: var(--teal); background: rgba(11,187,212,0.1); }
  .step.pending { color: var(--text3); }
  .step-num { 
    width: 18px; height: 18px; border-radius: 50%; display: flex; align-items: center;
    justify-content: center; font-size: 9px; font-weight: 700; flex-shrink: 0;
  }
  .step.done .step-num { background: var(--green); color: #000; }
  .step.active .step-num { background: var(--teal); color: #000; }
  .step.pending .step-num { background: var(--surface2); color: var(--text3); }
  .step-arrow { color: var(--text3); font-size: 10px; padding: 0 2px; }
  
  /* LOGIN */
  .login-screen {
    width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    background-image: radial-gradient(ellipse at 20% 50%, rgba(11,187,212,0.06) 0%, transparent 50%),
                      radial-gradient(ellipse at 80% 20%, rgba(245,158,11,0.04) 0%, transparent 50%);
  }
  .login-card {
    background: var(--surface); border: 1px solid var(--border2); border-radius: 14px;
    padding: 40px 36px; width: 380px;
  }
  .login-logo { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
  .login-logo-icon { 
    width: 42px; height: 42px; border-radius: 10px;
    background: linear-gradient(135deg, var(--teal), var(--teal2));
    display: flex; align-items: center; justify-content: center;
    font-size: 17px; font-weight: 800; color: white;
  }
  .input-group { margin-bottom: 14px; }
  .input-label { font-size: 11px; font-weight: 600; color: var(--text2); margin-bottom: 6px; display: block; letter-spacing: 0.3px; }
  .input-field {
    width: 100%; background: var(--bg2); border: 1px solid var(--border2); border-radius: 7px;
    padding: 9px 12px; font-size: 13px; color: var(--text); outline: none;
    transition: border-color 0.15s; font-family: var(--font);
  }
  .input-field:focus { border-color: var(--teal); }
  .select-field {
    width: 100%; background: var(--bg2); border: 1px solid var(--border2); border-radius: 7px;
    padding: 9px 12px; font-size: 13px; color: var(--text); outline: none; font-family: var(--font);
    cursor: pointer;
  }
  
  /* DETAIL PANEL */
  .detail-panel {
    position: fixed; right: 0; top: 0; bottom: 0; width: 440px;
    background: var(--bg2); border-left: 1px solid var(--border2); z-index: 100;
    display: flex; flex-direction: column; overflow: hidden;
  }
  .detail-header { 
    padding: 16px 18px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .detail-body { flex: 1; overflow-y: auto; padding: 16px 18px; }
  .detail-section { margin-bottom: 18px; }
  .detail-section-title { font-size: 10px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .detail-field { }
  .detail-field-label { font-size: 10px; color: var(--text3); margin-bottom: 3px; }
  .detail-field-value { font-size: 12px; color: var(--text); font-weight: 500; font-family: var(--mono); }
  
  /* SCROLLBAR */
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 2px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
  
  /* TABS */
  .tabs { display: flex; gap: 2px; border-bottom: 1px solid var(--border); margin-bottom: 16px; }
  .tab { 
    padding: 8px 14px; font-size: 12px; font-weight: 500; color: var(--text3);
    cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -1px;
    transition: all 0.15s;
  }
  .tab:hover { color: var(--text2); }
  .tab.active { color: var(--teal); border-bottom-color: var(--teal); }
  
  /* METER BAR */
  .meter { background: var(--bg2); border-radius: 99px; height: 4px; overflow: hidden; margin-top: 6px; }
  .meter-fill { height: 100%; border-radius: 99px; transition: width 0.3s; }
  
  /* PILOT TAG */
  .pilot-tag { 
    font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 3px;
    font-family: var(--mono); text-transform: uppercase; letter-spacing: 0.5px;
  }
  .pilot-MINSEG { background: rgba(59,130,246,0.2); color: #60A5FA; }
  .pilot-Somos { background: rgba(139,92,246,0.2); color: #A78BFA; }
  
  /* TOOLTIP */
  .tooltip-wrap { position: relative; }
  .tooltip-text { 
    position: absolute; bottom: 100%; left: 50%; transform: translateX(-50%);
    background: #1E293B; color: var(--text); font-size: 10px; padding: 4px 8px;
    border-radius: 4px; white-space: nowrap; opacity: 0; pointer-events: none;
    transition: opacity 0.15s; margin-bottom: 4px; z-index: 1000;
    border: 1px solid var(--border2);
  }
  .tooltip-wrap:hover .tooltip-text { opacity: 1; }
  
  /* URGENCIAS FLOW */
  .urg-flow { display: grid; grid-template-columns: repeat(6, 1fr); gap: 8px; margin-bottom: 16px; }
  .urg-stage {
    background: var(--surface); border: 1px solid var(--border); border-radius: 8px; padding: 12px 10px;
  }
  .urg-stage-title { font-size: 9.5px; font-weight: 700; color: var(--text3); text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 8px; }
  .urg-patient-chip {
    background: var(--bg2); border: 1px solid var(--border); border-radius: 6px; padding: 6px 8px;
    margin-bottom: 5px; cursor: pointer; transition: all 0.15s;
  }
  .urg-patient-chip:hover { border-color: var(--teal); }
  .urg-patient-name { font-size: 11px; font-weight: 600; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .urg-patient-meta { font-size: 9px; color: var(--text3); margin-top: 2px; font-family: var(--mono); }
  
  /* NUMBERS / MONO */
  .mono { font-family: var(--mono); }
  
  /* DIVIDER */
  .divider { height: 1px; background: var(--border); margin: 14px 0; }
  
  /* CHIP */
  .chip { 
    display: inline-flex; align-items: center; gap: 4px;
    background: var(--surface2); border: 1px solid var(--border);
    border-radius: 5px; padding: 3px 8px; font-size: 10px; color: var(--text2);
    font-family: var(--mono);
  }
  
  /* PROGRESS RING */
  .progress-ring { position: relative; display: inline-flex; align-items: center; justify-content: center; }
  
  .shimmer {
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(4px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .fade-in { animation: fadeIn 0.2s ease; }
  
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }
  .slide-in { animation: slideIn 0.25s ease; }
  
  .pulse-dot {
    display: inline-block; width: 6px; height: 6px; border-radius: 50%;
    background: var(--green); animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.3); opacity: 0.7; }
  }

  .wa-bubble-wrap { display: flex; flex-direction: column; }
  .wa-bubble-wrap.right { align-items: flex-end; }
  .wa-bubble-wrap.left { align-items: flex-start; }
`;

// ─────────────────────────────────────────────────────────
// HELPER COMPONENTS
// ─────────────────────────────────────────────────────────

const StatusBadge = ({ estado }) => {
  const s = ESTADOS[estado] || { label: estado, color: "#94A3B8", bg: "#1E293B" };
  return (
    <span className="badge" style={{ color: s.color, background: s.bg }}>
      <span className="badge-dot" style={{ background: s.color }} />
      {s.label}
    </span>
  );
};

const AseguradoraBadge = ({ id }) => {
  const a = ASEGURADORAS[id] || { name: id, color: "#94A3B8" };
  return (
    <span style={{ fontSize: 11, color: a.color, fontWeight: 600, fontFamily: "var(--mono)" }}>
      {a.short || id}
    </span>
  );
};

const MiniKPI = ({ label, value, unit, color = "var(--teal)", trend }) => (
  <div className="kpi-card" style={{ "--kpi-color": color }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color }} />
    <div className="kpi-label">{label}</div>
    <div className="kpi-value" style={{ fontSize: 22 }}>
      {value}<span className="kpi-unit">{unit}</span>
    </div>
    {trend && (
      <div className={`kpi-meta ${trend === "good" ? "kpi-trend-good" : trend === "bad" ? "kpi-trend-bad" : "kpi-trend-warn"}`}>
        {trend === "good" ? "↓" : "↑"} dentro del objetivo
      </div>
    )}
  </div>
);

const Icon = ({ name, size = 14, color }) => {
  const icons = {
    activity: "M22 12h-4l-3 9L9 3l-3 9H2",
    alert: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01",
    check: "M20 6L9 17l-5-5",
    x: "M18 6 6 18 M6 6l12 12",
    clock: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20z M12 6v6l4 2",
    star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
    user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z",
    bell: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0",
    settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z",
    home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10",
    layers: "M12 2L2 7l10 5 10-5-10-5z M2 17l10 5 10-5 M2 12l10 5 10-5",
    zap: "M13 2L3 14h9l-1 8 10-12h-9l1-8z",
    bar: "M12 20V10 M18 20V4 M6 20v-4",
    msg: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
    link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
    db: "M12 2a8 3 0 1 0 0 6 8 3 0 0 0 0-6z M4 5v6a8 3 0 0 0 16 0V5 M4 11v6a8 3 0 0 0 16 0v-6",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8",
    logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4 M16 17l5-5-5-5 M21 12H9",
    refresh: "M23 4v6h-6 M1 20v-6h6 M3.51 9a9 9 0 0 1 14.85-3.36L23 10 M1 14l4.64 4.36A9 9 0 0 0 20.49 15",
    plus: "M12 5v14 M5 12h14",
    eye: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z",
    download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3",
  };
  const d = icons[name] || icons.alert;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color || "currentColor"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => <path key={i} d={i === 0 ? seg : "M" + seg} />)}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────
// VIEWS
// ─────────────────────────────────────────────────────────

const Dashboard = ({ onSelectPaciente }) => {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 5000);
    return () => clearInterval(t);
  }, []);

  const brechaP = PACIENTES.find(p => p.estado === "ALTA_MEDICA");

  return (
    <div className="fade-in">
      {/* KPI Row */}
      <div className="kpi-grid">
        {[
          { label: "Admisión Promedio", val: "6.2", unit: "min", color: "var(--teal)", target: "Meta: <4 min", ok: false },
          { label: "Validación Cobertura", val: "22", unit: "seg", color: "var(--green)", target: "Meta: <30 seg", ok: true },
          { label: "Preautorización", val: "49", unit: "seg", color: "var(--green)", target: "Meta: <60 seg", ok: true },
          { label: "Brecha Alta-Egreso", val: "2.3", unit: "hr", color: "var(--red)", target: "Meta: <0.5 hr", ok: false },
          { label: "Reclamos Enviados", val: "28", unit: "", color: "var(--blue)", target: "Este mes", ok: null },
          { label: "Tasa Aprobación", val: "82", unit: "%", color: "var(--green)", target: "Último mes", ok: true },
          { label: "Glosas Activas", val: "3", unit: "", color: "var(--amber)", target: "Requieren acción", ok: false },
          { label: "Días Liquidación", val: "5.8", unit: "d", color: "var(--purple)", target: "Meta: <7 días", ok: true },
        ].map((k, i) => (
          <div key={i} className="kpi-card" style={{ position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: k.color }} />
            <div className="kpi-label">{k.label}</div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 6 }}>
              <span style={{ fontSize: 24, fontWeight: 700, color: "var(--text)", fontFamily: "var(--mono)", letterSpacing: -1 }}>{k.val}</span>
              {k.unit && <span style={{ fontSize: 12, color: "var(--text2)" }}>{k.unit}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 4, fontSize: 10, color: k.ok === null ? "var(--text3)" : k.ok ? "var(--green)" : "var(--red)" }}>
              {k.ok !== null && <span>{k.ok ? "✓" : "↑"}</span>}
              <span>{k.target}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        {/* Active Patients */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Pacientes Activos — Torre de Control</div>
              <div className="card-sub">Actualizado en tiempo real · {PACIENTES.length} casos activos</div>
            </div>
            <span className="pulse-dot" />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Paciente</th>
                  <th>Estado</th>
                  <th>Aseg.</th>
                  <th>Área</th>
                  <th>Alerta</th>
                </tr>
              </thead>
              <tbody>
                {PACIENTES.map(p => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectPaciente(p)}
                    className={p.alertas.length > 0 ? (p.estado === "ALTA_MEDICA" ? "patient-row-critical" : "patient-row-warning") : ""}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 12 }}>{p.nombre}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{p.id}</div>
                    </td>
                    <td><StatusBadge estado={p.estado} /></td>
                    <td><AseguradoraBadge id={p.aseguradora} /></td>
                    <td style={{ fontSize: 11 }}>{p.area}</td>
                    <td>
                      {p.alertas.length > 0 ? (
                        <span style={{ color: "var(--amber)", fontSize: 10 }}>⚠ {p.alertas[0].substring(0, 28)}…</span>
                      ) : <span style={{ color: "var(--text3)", fontSize: 10 }}>—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Centro de Alertas</div>
              <div className="card-sub">{ALERTAS_DATA.filter(a => a.tipo === "CRITICA" || a.tipo === "ALTA").length} requieren acción inmediata</div>
            </div>
            <span className="nav-badge">5</span>
          </div>
          <div className="card-body">
            {ALERTAS_DATA.map(a => (
              <div key={a.id} className={`alert-card alert-${a.tipo}`}>
                <div className={`alert-icon`} style={{
                  background: a.tipo === "CRITICA" ? "rgba(239,68,68,0.15)" : a.tipo === "ALTA" ? "rgba(245,158,11,0.15)" : a.tipo === "MEDIA" ? "rgba(59,130,246,0.12)" : "rgba(16,185,129,0.1)",
                  color: a.tipo === "CRITICA" ? "var(--red)" : a.tipo === "ALTA" ? "var(--amber)" : a.tipo === "MEDIA" ? "var(--blue)" : "var(--green)"
                }}>
                  <Icon name={a.icono === "clock" ? "clock" : a.icono === "x" ? "x" : a.icono === "star" ? "star" : a.icono === "check" ? "check" : "alert"} size={14} />
                </div>
                <div className="alert-body">
                  <div className="alert-title">{a.titulo}</div>
                  <div className="alert-desc">{a.desc}</div>
                  <div className="alert-time">{a.tiempo}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reclamos + Integraciones mini */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Reclamos Recientes</div>
            <button className="btn btn-ghost btn-sm"><Icon name="eye" size={12} /> Ver todos</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>ID</th><th>Paciente</th><th>Aseg.</th><th>Monto</th><th>Estado</th><th>Días</th></tr></thead>
              <tbody>
                {RECLAMOS.map(r => (
                  <tr key={r.id}>
                    <td className="mono" style={{ fontSize: 10 }}>{r.id}</td>
                    <td style={{ fontSize: 11 }}>{r.paciente}</td>
                    <td><AseguradoraBadge id={r.aseguradora} /></td>
                    <td className="mono">${r.monto.toLocaleString()}</td>
                    <td><StatusBadge estado={r.estado} /></td>
                    <td className="mono">{r.dias}d</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Estado de Integraciones</div>
            <div className="card-sub">Adaptadores CareFlow</div>
          </div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {INTEGRACIONES.map(i => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--bg2)", borderRadius: 7, border: "1px solid var(--border)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: i.estado === "CONFIGURADO" ? "var(--green)" : i.estado === "SIMULADO" ? "var(--purple)" : "var(--amber)", flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text)" }}>{i.nombre}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>{i.tipo}</div>
                </div>
                <span className={`int-estado int-${i.estado}`}>{i.estado}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Urgencias = ({ onSelectPaciente }) => {
  const [activeFlow, setActiveFlow] = useState(null);
  const [simStep, setSimStep] = useState(0);
  const stages = [
    { key: "IDENTIFICADO", label: "Triage / ID" },
    { key: "ELEGIBILIDAD_PROCESO", label: "Verificando" },
    { key: "PREAUT_APROBADA", label: "Autorizado" },
    { key: "ADMITIDO", label: "Admitido" },
    { key: "EN_ATENCION", label: "En Atención" },
    { key: "ALTA_MEDICA", label: "Alta Médica" },
  ];

  const getPatientsByStage = (key) => PACIENTES.filter(p => {
    if (key === "ALTA_MEDICA") return p.estado === "ALTA_MEDICA";
    if (key === "EN_ATENCION") return p.estado === "EN_ATENCION";
    if (key === "ADMITIDO") return p.estado === "ADMITIDO";
    if (key === "PREAUT_APROBADA") return p.estado === "PREAUT_APROBADA";
    if (key === "ELEGIBILIDAD_PROCESO") return p.estado === "ELEGIBILIDAD_PROCESO" || p.estado === "PREAUT_PENDIENTE";
    if (key === "IDENTIFICADO") return p.estado === "IDENTIFICADO" || p.estado === "PREAUT_RECHAZADA";
    return false;
  });

  const simSteps = [
    { t: "Paciente identifica síntomas por WhatsApp", detail: "IA clasifica urgencia nivel 2. Dispara validación de identidad.", color: "var(--teal)", icon: "msg" },
    { t: "Validación de identidad", detail: "Cédula + biometría básica verificada. Póliza POL-MINSEG-2024-4421 localizada.", color: "var(--teal)", icon: "shield" },
    { t: "Elegibilidad confirmada en 18 seg", detail: "Internacional de Seguros: Cobertura 100%. Copago $0. Estatus activo.", color: "var(--green)", icon: "check" },
    { t: "Preautorización ICD-10 disparada", detail: "I20.9 enviado a aseguradora. Sistema estima diagnóstico por síntomas reportados.", color: "var(--teal)", icon: "zap" },
    { t: "Preautorización aprobada en 42 seg", detail: "INT aprueba automáticamente. Número de autorización: AUTH-2026-8812.", color: "var(--green)", icon: "check" },
    { t: "QR de ingreso generado y enviado", detail: "Paciente recibe QR vía WhatsApp. Ambulancia despachada. Acompañante notificado.", color: "var(--teal)", icon: "zap" },
    { t: "Admisión en urgencias — 6 min", detail: "Cama URG-04 asignada. Sin cola. Sin papeleo manual. Médico notificado.", color: "var(--green)", icon: "check" },
  ];

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Flujo de Urgencias</h2>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Vista Kanban — Pacientes activos por etapa del proceso</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-ghost btn-sm"><Icon name="plus" size={12} /> Nuevo Ingreso</button>
          <button className="btn btn-teal btn-sm"><Icon name="zap" size={12} /> Demo Flujo Completo</button>
        </div>
      </div>

      {/* Kanban */}
      <div className="urg-flow" style={{ marginBottom: 16 }}>
        {stages.map(st => {
          const patients = getPatientsByStage(st.key);
          const isAlertStage = st.key === "ALTA_MEDICA";
          return (
            <div key={st.key} className="urg-stage" style={isAlertStage ? { borderColor: "rgba(245,158,11,0.3)", background: "rgba(245,158,11,0.05)" } : {}}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div className="urg-stage-title">{st.label}</div>
                {patients.length > 0 && (
                  <span style={{ fontSize: 10, background: isAlertStage ? "var(--amber)" : "var(--teal)", color: "#000", borderRadius: 10, padding: "1px 5px", fontFamily: "var(--mono)", fontWeight: 700 }}>{patients.length}</span>
                )}
              </div>
              {patients.length === 0 && (
                <div style={{ fontSize: 10, color: "var(--text3)", textAlign: "center", padding: "12px 0", fontStyle: "italic" }}>Vacío</div>
              )}
              {patients.map(p => (
                <div key={p.id} className="urg-patient-chip" onClick={() => onSelectPaciente(p)}>
                  <div className="urg-patient-name">{p.nombre.split(" ").slice(0, 2).join(" ")}</div>
                  <div className="urg-patient-meta">{p.ingreso} · {p.aseguradora}</div>
                  {p.alertas.length > 0 && <div style={{ fontSize: 9, color: "var(--red)", marginTop: 2 }}>⚠ {p.alertas[0].substring(0, 22)}…</div>}
                </div>
              ))}
            </div>
          );
        })}
      </div>

      {/* Simulation panel */}
      <div className="grid-2">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Simulador — Flujo Completo Urgencias</div>
            <div className="card-sub">Caso Carlos Mendoza · Piloto MINSEG</div>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <button className="btn btn-teal btn-sm" onClick={() => setSimStep(s => Math.min(s + 1, simSteps.length - 1))}>
                <Icon name="zap" size={12} /> Siguiente paso
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setSimStep(0)}>
                <Icon name="refresh" size={12} /> Reset
              </button>
            </div>
            <div className="timeline">
              {simSteps.map((s, i) => (
                <div key={i} className="tl-item" style={{ opacity: i <= simStep ? 1 : 0.25, transition: "opacity 0.3s" }}>
                  <div className="tl-left">
                    <div className="tl-dot" style={{ background: i <= simStep ? s.color : "var(--surface2)", color: i <= simStep ? "#000" : "var(--text3)", fontSize: 11 }}>
                      {i <= simStep ? "✓" : i + 1}
                    </div>
                    {i < simSteps.length - 1 && <div className="tl-line" />}
                  </div>
                  <div className="tl-content">
                    <div className="tl-title">{s.t}</div>
                    {i <= simStep && <div className="tl-detail">{s.detail}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Métricas de Urgencias — Hoy</div>
          </div>
          <div className="card-body">
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "Ingresos hoy", v: "24", u: "pacientes", c: "var(--teal)" },
                { l: "Tiempo admisión prom.", v: "6.2", u: "min", c: "var(--amber)" },
                { l: "Preaut. automáticas", v: "89%", u: "aprobadas", c: "var(--green)" },
                { l: "Camas disponibles", v: "7 / 18", u: "URG", c: "var(--blue)" },
                { l: "Copagos cobrados", v: "$340", u: "hoy", c: "var(--purple)" },
                { l: "Rechazos aseguradoras", v: "2", u: "casos", c: "var(--red)" },
              ].map((m, i) => (
                <div key={i} style={{ padding: "10px 12px", background: "var(--bg2)", borderRadius: 7, border: "1px solid var(--border)" }}>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>{m.l}</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: m.c, fontFamily: "var(--mono)" }}>{m.v}</div>
                  <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{m.u}</div>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ fontSize: 11, color: "var(--text2)", marginBottom: 8, fontWeight: 600 }}>Distribución por aseguradora</div>
            {Object.entries(ASEGURADORAS).map(([k, a]) => {
              const count = PACIENTES.filter(p => p.aseguradora === k).length;
              const pct = Math.round(count / PACIENTES.length * 100);
              return (
                <div key={k} style={{ marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 4 }}>
                    <span style={{ color: a.color, fontWeight: 600 }}>{a.short}</span>
                    <span style={{ color: "var(--text3)", fontFamily: "var(--mono)" }}>{count} pac.</span>
                  </div>
                  <div className="meter">
                    <div className="meter-fill" style={{ width: `${pct || 8}%`, background: a.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

const AltaEgreso = ({ onSelectPaciente }) => {
  const [brecha, setBrecha] = useState(138); // minutes
  useEffect(() => {
    const t = setInterval(() => setBrecha(b => b + 1), 60000);
    return () => clearInterval(t);
  }, []);

  const altaPacientes = PACIENTES.filter(p => ["ALTA_MEDICA", "CONSOLIDANDO", "LISTO_EGRESO"].includes(p.estado));
  const hrs = Math.floor(brecha / 60);
  const mins = brecha % 60;

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Alta Médica & Egreso Administrativo</h2>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Monitoreo de brecha alta médica → salida física del paciente</p>
        </div>
      </div>

      {/* Brecha critica */}
      <div style={{ 
        background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.3)",
        borderRadius: 10, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", gap: 20
      }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon name="clock" size={22} color="var(--amber)" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--amber)" }}>⚠ Brecha Crítica Detectada — Miriam Delgado Torres</div>
          <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 3 }}>Alta médica emitida a las 10:32. Cuenta sin consolidar. Sin egreso administrativo.</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: "var(--red)", fontFamily: "var(--mono)" }}>{hrs}h {mins}m</div>
          <div style={{ fontSize: 10, color: "var(--text3)" }}>Brecha actual · Meta: &lt;30 min</div>
        </div>
        <button className="btn btn-amber btn-sm">Iniciar Consolidación</button>
      </div>

      <div className="grid-2" style={{ marginBottom: 14 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Pacientes Pendientes de Egreso</div>
            <div className="card-sub">{altaPacientes.length} casos activos</div>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Paciente</th><th>Alta Médica</th><th>Estado</th><th>Monto Est.</th><th>Aseg.</th><th></th></tr></thead>
              <tbody>
                {altaPacientes.map(p => (
                  <tr key={p.id} onClick={() => onSelectPaciente(p)} style={{ cursor: "pointer" }}
                    className={p.estado === "ALTA_MEDICA" ? "patient-row-critical" : ""}>
                    <td>
                      <div style={{ fontWeight: 600, color: "var(--text)", fontSize: 12 }}>{p.nombre}</div>
                      <div style={{ fontSize: 10, color: "var(--text3)" }}>{p.cama}</div>
                    </td>
                    <td className="mono" style={{ fontSize: 11, color: p.altaMedica ? "var(--amber)" : "var(--text3)" }}>
                      {p.altaMedica || "—"}
                    </td>
                    <td><StatusBadge estado={p.estado} /></td>
                    <td className="mono">${p.monto.toLocaleString()}</td>
                    <td><AseguradoraBadge id={p.aseguradora} /></td>
                    <td><button className="btn btn-ghost btn-sm">Ver</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Flujo de Egreso — Proceso</div>
            <div className="card-sub">Miriam Delgado Torres · CF-2026-0342</div>
          </div>
          <div className="card-body">
            {[
              { step: 1, t: "Alta médica emitida", sub: "Dr. Ramos · EMED · 10:32", done: true, color: "var(--green)" },
              { step: 2, t: "Notificación a Facturación", sub: "CareFlow notificó en 18 seg", done: true, color: "var(--green)" },
              { step: 3, t: "Consolidación de cuenta", sub: "Farmacia ✓ · Lab ✓ · Honorarios ⏳", done: false, active: true, color: "var(--amber)" },
              { step: 4, t: "Revisión por Admisión", sub: "Pendiente · Marinela asignada", done: false, color: "var(--text3)" },
              { step: 5, t: "Presentación al paciente", sub: "Total: $920 · Copago $0 (WWM)", done: false, color: "var(--text3)" },
              { step: 6, t: "Firma de egreso", sub: "Pendiente", done: false, color: "var(--text3)" },
              { step: 7, t: "Envío de reclamo a Worldwide Medical", sub: "Automático al firma de egreso", done: false, color: "var(--text3)" },
            ].map((s, i, arr) => (
              <div key={i} className="tl-item">
                <div className="tl-left">
                  <div className="tl-dot" style={{ background: s.done ? "var(--green)" : s.active ? "var(--amber)" : "var(--surface2)", color: s.done ? "#000" : s.active ? "#000" : "var(--text3)" }}>
                    {s.done ? "✓" : s.step}
                  </div>
                  {i < arr.length - 1 && <div className="tl-line" />}
                </div>
                <div className="tl-content">
                  <div style={{ fontSize: 12, fontWeight: 600, color: s.done ? "var(--green)" : s.active ? "var(--amber)" : "var(--text2)" }}>{s.t}</div>
                  <div className="tl-meta">{s.sub}</div>
                </div>
              </div>
            ))}

            <div className="divider" />
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn btn-teal btn-sm" style={{ flex: 1 }}><Icon name="zap" size={12} /> Consolidar Cuenta</button>
              <button className="btn btn-ghost btn-sm"><Icon name="file" size={12} /> Ver Cuenta</button>
            </div>
          </div>
        </div>
      </div>

      {/* Brecha histórica */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Tendencia Brecha Alta-Egreso — Últimos 14 días</div>
          <div className="card-sub">Meta: &lt;30 minutos · Antes de CareFlow: ~5.2 horas promedio</div>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 80, padding: "0 4px" }}>
            {[312, 290, 345, 180, 260, 155, 210, 145, 188, 130, 175, 95, 140, 138].map((v, i) => {
              const pct = v / 345;
              const color = v > 200 ? "var(--red)" : v > 120 ? "var(--amber)" : "var(--green)";
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
                  <div style={{ width: "100%", background: color, borderRadius: "2px 2px 0 0", height: `${pct * 100}%`, opacity: 0.8, minHeight: 4 }} />
                  <div style={{ fontSize: 8, color: "var(--text3)", fontFamily: "var(--mono)" }}>{Math.floor(v / 60)}h{v % 60}m</div>
                </div>
              );
            })}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: "var(--text3)", marginTop: 8, fontFamily: "var(--mono)" }}>
            <span>Mar 24</span><span>Mar 28</span><span>Mar 3</span><span>Mar 7</span><span>Hoy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Reclamos = () => {
  const [tab, setTab] = useState("activos");
  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Facturación & Reclamos</h2>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Gestión de reclamos a aseguradoras · CareFlow automatiza envío y seguimiento</p>
        </div>
        <button className="btn btn-teal btn-sm"><Icon name="plus" size={12} /> Nuevo Reclamo</button>
      </div>

      <div className="kpi-grid" style={{ gridTemplateColumns: "repeat(5, 1fr)", marginBottom: 14 }}>
        {[
          { l: "Total Enviados", v: 28, u: "reclamos", c: "var(--blue)" },
          { l: "Aprobados", v: 19, u: "$48,210", c: "var(--green)" },
          { l: "En Revisión", v: 6, u: "reclamos", c: "var(--amber)" },
          { l: "Glosas", v: 3, u: "$14,310 en disputa", c: "var(--red)" },
          { l: "Días prom. liquidación", v: "5.8", u: "días", c: "var(--purple)" },
        ].map((k, i) => (
          <div key={i} className="kpi-card">
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: k.c }} />
            <div className="kpi-label">{k.l}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: k.c, fontFamily: "var(--mono)", marginTop: 6 }}>{k.v}</div>
            <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 4 }}>{k.u}</div>
          </div>
        ))}
      </div>

      <div className="tabs">
        {["activos", "aprobados", "glosas", "historico"].map(t => (
          <div key={t} className={`tab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "activos" ? "En Curso" : t === "aprobados" ? "Aprobados" : t === "glosas" ? "Glosas / Observaciones" : "Histórico"}
          </div>
        ))}
      </div>

      <div className="card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Reclamo</th>
                <th>Paciente</th>
                <th>Aseguradora</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Días</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {RECLAMOS.filter(r => {
                if (tab === "activos") return ["RECLAMO_ENVIADO", "RECLAMO_REVISION"].includes(r.estado);
                if (tab === "aprobados") return r.estado === "RECLAMO_APROBADO";
                if (tab === "glosas") return r.estado === "GLOSA";
                return true;
              }).map(r => (
                <tr key={r.id}>
                  <td className="mono" style={{ fontSize: 11 }}>{r.id}</td>
                  <td style={{ fontWeight: 500, color: "var(--text)" }}>{r.paciente}</td>
                  <td>
                    <span style={{ fontSize: 11, color: ASEGURADORAS[r.aseguradora]?.color, fontWeight: 600 }}>
                      {ASEGURADORAS[r.aseguradora]?.name}
                    </span>
                  </td>
                  <td className="mono">${r.monto.toLocaleString()}</td>
                  <td><StatusBadge estado={r.estado} /></td>
                  <td className="mono">{r.dias}d</td>
                  <td className="mono" style={{ fontSize: 10 }}>{r.fecha}</td>
                  <td>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button className="btn btn-ghost btn-sm"><Icon name="eye" size={11} /></button>
                      <button className="btn btn-ghost btn-sm"><Icon name="download" size={11} /></button>
                      {r.estado === "GLOSA" && <button className="btn btn-amber btn-sm">Apelar</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {tab === "glosas" && (
        <div className="card" style={{ marginTop: 14 }}>
          <div className="card-header">
            <div className="card-title">Glosa Activa — RCL-2026-0893</div>
            <div className="card-sub">ASSA · Jorge Martínez · $5,610</div>
          </div>
          <div className="card-body">
            <div className="grid-2">
              <div>
                <div className="detail-section-title" style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Motivo de la Observación</div>
                <div style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 7, padding: "10px 12px", fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
                  <strong style={{ color: "var(--red)" }}>ASSA observa:</strong> Documentación de evolución clínica incompleta para días 2 y 3 de hospitalización. Solicitan notas de enfermería y resultados de laboratorio adicionales (PCR, BHC).
                </div>
                <div style={{ marginTop: 10, fontSize: 11, color: "var(--text3)" }}>Plazo para responder: <strong style={{ color: "var(--amber)" }}>12 de marzo 2026</strong> · Riesgo: $5,610</div>
              </div>
              <div>
                <div className="detail-section-title" style={{ fontSize: 10, fontWeight: 700, color: "var(--text3)", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Documentos Requeridos</div>
                {["Notas de evolución días 2-3 (EMED)", "Resultados PCR — Lab Interno", "Resultados BHC — Lab Interno", "Epicrisis firmada por médico tratante"].map((d, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, fontSize: 11 }}>
                    <span style={{ color: i < 1 ? "var(--green)" : "var(--amber)" }}>{i < 1 ? "✓" : "○"}</span>
                    <span style={{ color: i < 1 ? "var(--text2)" : "var(--text3)" }}>{d}</span>
                    {i >= 1 && <button className="btn btn-ghost btn-sm" style={{ marginLeft: "auto", fontSize: 10 }}><Icon name="download" size={10} /></button>}
                  </div>
                ))}
                <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                  <button className="btn btn-amber btn-sm"><Icon name="file" size={11} /> Enviar Apelación</button>
                  <button className="btn btn-ghost btn-sm">Ver historial</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const WhatsAppConcierge = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [step, setStep] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const bodyRef = useRef();

  useEffect(() => {
    if (step < WHATSAPP_FLOW.length) {
      const m = WHATSAPP_FLOW[step];
      const delay = m.delay || 600;
      setIsTyping(m.from === "careflow");
      const t = setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, m]);
        setStep(s => s + 1);
      }, delay);
      return () => clearTimeout(t);
    }
  }, [step]);

  useEffect(() => {
    if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { from: "paciente", text: input, time: "ahora" }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, {
        from: "careflow",
        text: "Entendido. Estoy procesando tu solicitud. Si necesitas asistencia urgente, llama al 800-CAREFLOW o dirígete directamente a urgencias de Hospiten Paitilla. 💙",
        time: "ahora"
      }]);
    }, 1500);
  };

  return (
    <div className="fade-in">
      <div style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Concierge IA — WhatsApp</h2>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Canal de atención al paciente · Integración Meta WhatsApp Business API · Piloto MINSEG</p>
      </div>

      <div className="grid-2">
        <div>
          {/* WhatsApp UI */}
          <div className="wa-container">
            <div className="wa-header">
              <div className="wa-avatar">CF</div>
              <div>
                <div className="wa-name">CareFlow Concierge</div>
                <div className="wa-status">🟢 En línea · IA activa · Hospiten Paitilla</div>
              </div>
            </div>
            <div className="wa-body" ref={bodyRef}>
              {messages.map((m, i) => (
                <div key={i} className={`wa-bubble-wrap ${m.from === "careflow" ? "right" : "left"}`}>
                  <div className={`wa-bubble from-${m.from}`}>
                    {m.text}
                    {m.isQR && (
                      <div className="wa-qr">
                        <div style={{ fontSize: 7, lineHeight: 1.2, textAlign: "center" }}>
                          QR INGRESO<br />CF-2026-0341<br />URGENCIAS<br />MINSEG ✓
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="wa-time">{m.time}</div>
                </div>
              ))}
              {isTyping && (
                <div className="wa-bubble-wrap right">
                  <div className="wa-bubble from-careflow" style={{ padding: "10px 14px" }}>
                    <span className="shimmer" style={{ color: "rgba(255,255,255,0.5)", fontSize: 16 }}>●●●</span>
                  </div>
                </div>
              )}
            </div>
            <div className="wa-input">
              <input
                className="wa-field"
                placeholder="Escribe un mensaje..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSend()}
              />
              <button className="btn btn-teal btn-sm" onClick={handleSend}><Icon name="msg" size={13} /></button>
            </div>
          </div>

          <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, fontSize: 10, color: "var(--amber)", lineHeight: 1.6 }}>
            <strong>Integración:</strong> Meta WhatsApp Business API (WABA) · Estado: CONFIGURADO ✓<br />
            IA: Claude claude-sonnet-4-20250514 · Flujo: Triaje → Elegibilidad → Preaut → QR → Notificaciones
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card">
            <div className="card-header"><div className="card-title">Capacidades del Concierge</div></div>
            <div className="card-body">
              {[
                ["Triaje inicial por síntomas", "IA clasifica urgencia 1-5", "var(--green)"],
                ["Validación de identidad", "Cédula + número de póliza", "var(--green)"],
                ["Verificación de elegibilidad", "Real-time o simulado (mock)", "var(--amber)"],
                ["Cálculo de copago", "Basado en póliza activa", "var(--amber)"],
                ["Generación de QR de ingreso", "Admisión sin registro manual", "var(--green)"],
                ["Despacho de ambulancia", "Integración futura con SUME/911", "var(--text3)"],
                ["Notificación a acompañante", "WhatsApp automático", "var(--green)"],
                ["Seguimiento post-egreso", "Aftercare · Citas de control", "var(--amber)"],
              ].map(([cap, detail, color], i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 0", borderBottom: i < 7 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 7, height: 7, borderRadius: "50%", background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: "var(--text)", fontWeight: 500 }}>{cap}</div>
                    <div style={{ fontSize: 10, color: "var(--text3)" }}>{detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <div className="card-header"><div className="card-title">Métricas WhatsApp — Este mes</div></div>
            <div className="card-body">
              {[
                { l: "Contactos iniciados", v: "142", c: "var(--teal)" },
                { l: "Triajes completados", v: "128 (90%)", c: "var(--green)" },
                { l: "Admisiones facilitadas", v: "84 (66%)", c: "var(--green)" },
                { l: "QR generados", v: "79", c: "var(--blue)" },
                { l: "NPS concierge", v: "89 / 100", c: "var(--purple)" },
              ].map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "7px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                  <span style={{ fontSize: 11, color: "var(--text2)" }}>{m.l}</span>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: m.c }}>{m.v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Integraciones = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Catálogo de Integraciones & Adaptadores</h2>
      <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>CareFlow opera como orquestador externo. Todas las integraciones via API intermediaria.</p>
    </div>

    <div style={{ display: "flex", gap: 12, marginBottom: 16, padding: "10px 14px", background: "rgba(59,130,246,0.06)", border: "1px solid rgba(59,130,246,0.15)", borderRadius: 8 }}>
      <Icon name="layers" size={18} color="var(--blue)" />
      <div style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.6 }}>
        <strong style={{ color: "var(--blue)" }}>Restricción de Arquitectura (No Negociable):</strong> Toda integración con SAP debe realizarse vía API intermediaria, API Gateway, OData, BAPI o RFC. Nunca directa a tablas SAP. Esto es imperativo por la migración programada a 2030 y aplica a todos los entornos (desarrollo, staging, producción).
      </div>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {INTEGRACIONES.map(i => (
        <div key={i.id} className="int-card">
          <div className="int-header">
            <div className="int-icon" style={{ background: i.id === "SAP" ? "rgba(245,158,11,0.15)" : i.id === "EMED" ? "rgba(11,187,212,0.15)" : i.id === "WA" ? "rgba(16,185,129,0.15)" : "rgba(139,92,246,0.15)", color: i.id === "SAP" ? "var(--amber)" : i.id === "EMED" ? "var(--teal)" : i.id === "WA" ? "var(--green)" : "var(--purple)" }}>
              <Icon name={i.id === "SAP" ? "db" : i.id === "EMED" ? "activity" : i.id === "WA" ? "msg" : "link"} size={15} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="int-name">{i.nombre}</div>
              <div className="int-type">{i.tipo}</div>
            </div>
            <span className={`int-estado int-${i.estado}`}>{i.estado}</span>
          </div>
          <div className="int-grid">
            <div className="int-row"><span className="int-lbl">Versión:</span><span className="int-val mono" style={{ fontSize: 10 }}>{i.version.substring(0, 28)}</span></div>
            <div className="int-row"><span className="int-lbl">Latencia:</span><span className="int-val mono">{i.latencia}</span></div>
            <div>
              <div className="int-lbl" style={{ marginBottom: 3 }}>Inputs:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {i.inputs.map(inp => <span key={inp} className="chip" style={{ fontSize: 9 }}>{inp}</span>)}
              </div>
            </div>
            <div>
              <div className="int-lbl" style={{ marginBottom: 3 }}>Outputs:</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
                {i.outputs.map(out => <span key={out} className="chip" style={{ fontSize: 9, color: "var(--teal)" }}>{out}</span>)}
              </div>
            </div>
          </div>
          <div className="int-nota">{i.nota}</div>
          <div style={{ marginTop: 10, display: "flex", gap: 6 }}>
            <button className="btn btn-ghost btn-sm"><Icon name="zap" size={11} /> Test Conexión</button>
            <button className="btn btn-ghost btn-sm"><Icon name="settings" size={11} /> Configurar</button>
            <button className="btn btn-ghost btn-sm"><Icon name="eye" size={11} /> Logs</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const Alertas = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Centro de Alertas & Excepciones</h2>
        <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Casos que requieren intervención manual · Reglas automáticas CareFlow</p>
      </div>
      <button className="btn btn-ghost btn-sm"><Icon name="settings" size={12} /> Gestionar Reglas</button>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
      {[
        { tipo: "CRITICA", count: 1, desc: "Acción inmediata", color: "var(--red)" },
        { tipo: "ALTA", count: 2, desc: "< 30 minutos", color: "var(--amber)" },
        { tipo: "MEDIA", count: 1, desc: "Seguimiento", color: "var(--blue)" },
        { tipo: "INFO", count: 2, desc: "Informativo", color: "var(--green)" },
      ].map((t, i) => (
        <div key={i} style={{ padding: "12px 14px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, borderTop: `2px solid ${t.color}` }}>
          <div style={{ fontSize: 10, color: "var(--text3)", marginBottom: 4 }}>{t.tipo}</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: t.color, fontFamily: "var(--mono)" }}>{t.count}</div>
          <div style={{ fontSize: 10, color: "var(--text3)", marginTop: 2 }}>{t.desc}</div>
        </div>
      ))}
    </div>

    {ALERTAS_DATA.map(a => (
      <div key={a.id} className={`alert-card alert-${a.tipo}`} style={{ marginBottom: 8 }}>
        <div className="alert-icon" style={{
          background: a.tipo === "CRITICA" ? "rgba(239,68,68,0.15)" : a.tipo === "ALTA" ? "rgba(245,158,11,0.15)" : "rgba(59,130,246,0.1)",
          color: a.tipo === "CRITICA" ? "var(--red)" : a.tipo === "ALTA" ? "var(--amber)" : "var(--blue)",
          width: 36, height: 36, borderRadius: 8, flexShrink: 0,
        }}>
          <Icon name={a.tipo === "CRITICA" || a.tipo === "ALTA" ? "alert" : "check"} size={16} />
        </div>
        <div className="alert-body">
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="alert-title">{a.titulo}</div>
            {a.paciente && <span className="chip">{a.paciente}</span>}
          </div>
          <div className="alert-desc">{a.desc}</div>
          <div className="alert-time">{a.tiempo}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, alignItems: "flex-end" }}>
          {(a.tipo === "CRITICA" || a.tipo === "ALTA") && <button className="btn btn-amber btn-sm">Resolver</button>}
          <button className="btn btn-ghost btn-sm"><Icon name="eye" size={11} /></button>
        </div>
      </div>
    ))}

    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-header"><div className="card-title">Reglas de Alerta Activas</div></div>
      <div className="table-wrap">
        <table>
          <thead><tr><th>Regla</th><th>Condición</th><th>Prioridad</th><th>Canal</th><th>Estado</th></tr></thead>
          <tbody>
            {[
              ["Alta médica sin consolidación", "Tiempo > 60 min post-alta", "CRITICA", "WhatsApp + Dashboard", true],
              ["Preautorización rechazada", "Respuesta aseg. = RECHAZADO", "ALTA", "Dashboard + Email", true],
              ["Elegibilidad demorada", "Tiempo validación > 5 min", "MEDIA", "Dashboard", true],
              ["Glosa en reclamo", "Estado reclamo = GLOSA", "ALTA", "Email + Dashboard", true],
              ["Reclamo sin enviar post-egreso", "Tiempo > 24h post-egreso", "MEDIA", "Email", true],
              ["Copago no cobrado al egreso", "Copago > $0 y no registrado", "ALTA", "Dashboard", false],
            ].map(([regla, cond, prio, canal, activa], i) => (
              <tr key={i}>
                <td style={{ fontWeight: 500, color: "var(--text)", fontSize: 12 }}>{regla}</td>
                <td style={{ fontSize: 11, color: "var(--text2)", fontFamily: "var(--mono)" }}>{cond}</td>
                <td><span className="badge" style={{ color: prio === "CRITICA" ? "var(--red)" : prio === "ALTA" ? "var(--amber)" : "var(--blue)", background: prio === "CRITICA" ? "rgba(239,68,68,0.1)" : prio === "ALTA" ? "rgba(245,158,11,0.1)" : "rgba(59,130,246,0.1)" }}>{prio}</span></td>
                <td style={{ fontSize: 11 }}>{canal}</td>
                <td><span style={{ color: activa ? "var(--green)" : "var(--text3)", fontSize: 11 }}>{activa ? "● Activa" : "○ Inactiva"}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const PilotoMINSEG = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Piloto MVP — Policía Nacional (MINSEG)</h2>
        <span className="badge" style={{ color: "#60A5FA", background: "rgba(59,130,246,0.15)" }}>● ACTIVO</span>
      </div>
      <p style={{ fontSize: 11, color: "var(--text3)" }}>Aseguradora: Internacional de Seguros · Corredor: Directo MINSEG · Alcance: Población cautiva uniforme</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14, marginBottom: 14 }}>
      <div className="card">
        <div className="card-header"><div className="card-title">Configuración del Piloto</div></div>
        <div className="card-body">
          {[
            { l: "Nombre del piloto", v: "MVP Policía Nacional / MINSEG" },
            { l: "Aseguradora", v: "Internacional de Seguros (INT)" },
            { l: "Tipo de población", v: "Cautiva · Póliza única · Cobertura 100%" },
            { l: "Copago estándar", v: "$0 (cubierto 100% por póliza MINSEG)" },
            { l: "Hospital", v: "Hospiten Paitilla" },
            { l: "Canal de ingreso", v: "WhatsApp Concierge + QR directo" },
            { l: "Estado licitación MINSEG", v: "En proceso de levantamiento" },
            { l: "Fecha objetivo launch", v: "Antes de julio 2026" },
            { l: "Baseline penetración", v: "~0% (demanda 100% incremental)" },
            { l: "Integraciones requeridas", v: "INT API (elegibilidad) + SAP (admisión/QR)" },
          ].map(({ l, v }, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: i < 9 ? "1px solid var(--border)" : "none" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{l}</span>
              <span style={{ fontSize: 12, color: "var(--text)", fontWeight: 500, textAlign: "right", maxWidth: "60%" }}>{v}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">KPIs del Piloto</div></div>
          <div className="card-body">
            {[
              { l: "Pacientes MINSEG activos", v: "2", c: "var(--teal)" },
              { l: "Admisiones facilitadas", v: "2 / 2", c: "var(--green)" },
              { l: "Preaut. automáticas (INT)", v: "100%", c: "var(--green)" },
              { l: "Reclamos enviados", v: "1 aprobado", c: "var(--green)" },
              { l: "Copagos cobrados", v: "$0 (esperado)", c: "var(--blue)" },
            ].map((m, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{m.l}</span>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, color: m.c }}>{m.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Piloto 2 — Worldwide Medical</div></div>
          <div className="card-body">
            <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
              <span className="badge" style={{ color: "var(--purple)", background: "rgba(139,92,246,0.15)" }}>● EN PREPARACIÓN</span>
            </div>
            {[
              { l: "Corredor", v: "Somos Seguros" },
              { l: "Aseguradora", v: "Worldwide Medical" },
              { l: "Facturación actual", v: "~$1.5M/año" },
              { l: "Potencial crecimiento", v: "Significativo" },
              { l: "Cobertura en Hospiten", v: "100% · Copago $0" },
            ].map(({ l, v }, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
                <span style={{ fontSize: 11, color: "var(--text3)" }}>{l}</span>
                <span style={{ fontSize: 11, color: "var(--text)", fontWeight: 500 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="card">
      <div className="card-header"><div className="card-title">Camino a Producción — Piloto MINSEG</div></div>
      <div className="card-body">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          {[
            { titulo: "MVP Demostrable YA", items: ["Dashboard torre de control", "WhatsApp Concierge (simulado)", "Flujo urgencias + QR mock", "Reclamos manual → digital", "Alertas y excepciones"], color: "var(--green)" },
            { titulo: "Depende de TI Hospiten", items: ["API SAP (modo lectura/escritura)", "Integración EMED alta médica", "Acceso red interna / VPN", "Sesión técnica pendiente (Sesión 4)", "Decisión sistema sucesor SAP 2030"], color: "var(--amber)" },
            { titulo: "Depende de Aseguradoras", items: ["API INT elegibilidad (MINSEG)", "Preautorización automática INT", "API Worldwide Medical / Somos", "DPA firmado por ambas partes", "NDA + acuerdo de datos activo"], color: "var(--red)" },
          ].map((col, i) => (
            <div key={i} style={{ padding: "12px 14px", background: "var(--bg2)", borderRadius: 8, border: `1px solid ${col.color}22` }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: col.color, marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, display: "inline-block" }} />
                {col.titulo}
              </div>
              {col.items.map((item, j) => (
                <div key={j} style={{ fontSize: 11, color: "var(--text2)", padding: "4px 0", borderBottom: j < col.items.length - 1 ? "1px solid var(--border)" : "none", display: "flex", alignItems: "center", gap: 6 }}>
                  <span style={{ color: col.color, flexShrink: 0 }}>→</span> {item}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const Auditoria = () => (
  <div className="fade-in">
    <div style={{ marginBottom: 16 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: "var(--text)" }}>Auditoría & Trazabilidad</h2>
      <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>Log de eventos del sistema · Trazabilidad end-to-end por caso</p>
    </div>
    <div className="card">
      <div className="table-wrap">
        <table>
          <thead><tr><th>Timestamp</th><th>Evento</th><th>Caso</th><th>Actor</th><th>Sistema</th><th>Estado</th></tr></thead>
          <tbody>
            {[
              ["11:04:22", "QR_INGRESO_GENERADO", "CF-2026-0341", "CareFlow IA", "WhatsApp / Core", "OK"],
              ["11:03:55", "PREAUT_APROBADA", "CF-2026-0341", "API INT", "INT Seguros", "OK"],
              ["11:03:12", "ELEGIBILIDAD_CONFIRMADA", "CF-2026-0341", "API INT", "INT Seguros", "OK"],
              ["11:02:44", "IDENTIDAD_VERIFICADA", "CF-2026-0341", "CareFlow Core", "CareFlow", "OK"],
              ["11:02:01", "MENSAJE_RECIBIDO", "CF-2026-0341", "Carlos Mendoza", "WhatsApp", "OK"],
              ["10:47:18", "PREAUT_RECHAZADA", "CF-2026-0345", "API MAPFRE", "MAPFRE", "ERROR"],
              ["10:32:00", "ALTA_MEDICA_RECIBIDA", "CF-2026-0342", "EMED (mock)", "EMED", "OK"],
              ["10:32:01", "NOTIF_FACTURACION", "CF-2026-0342", "CareFlow Core", "Interno", "OK"],
              ["08:14:33", "ADMISION_CONFIRMADA", "CF-2026-0341", "SAP (mock)", "SAP", "MOCK"],
            ].map(([ts, ev, caso, actor, sys, est], i) => (
              <tr key={i}>
                <td className="mono" style={{ fontSize: 10, color: "var(--text3)" }}>{ts}</td>
                <td className="mono" style={{ fontSize: 10, color: "var(--teal)" }}>{ev}</td>
                <td className="mono" style={{ fontSize: 10 }}>{caso}</td>
                <td style={{ fontSize: 11 }}>{actor}</td>
                <td style={{ fontSize: 11, color: "var(--text3)" }}>{sys}</td>
                <td>
                  <span style={{
                    fontSize: 10, fontWeight: 700, fontFamily: "var(--mono)",
                    color: est === "OK" ? "var(--green)" : est === "ERROR" ? "var(--red)" : "var(--amber)",
                  }}>{est}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────
// PATIENT DETAIL PANEL
// ─────────────────────────────────────────────────────────

const PatientDetail = ({ paciente, onClose }) => {
  if (!paciente) return null;
  const a = ASEGURADORAS[paciente.aseguradora] || {};
  return (
    <div className="detail-panel slide-in">
      <div className="detail-header">
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text)" }}>{paciente.nombre}</div>
          <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)", marginTop: 2 }}>{paciente.id}</div>
        </div>
        <button className="btn btn-ghost btn-sm" onClick={onClose}><Icon name="x" size={13} /></button>
      </div>
      <div className="detail-body">
        <div style={{ marginBottom: 14, padding: "10px 12px", background: ESTADOS[paciente.estado]?.bg, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <StatusBadge estado={paciente.estado} />
          {paciente.piloto && <span className={`pilot-tag pilot-${paciente.piloto.split("/")[0].trim()}`}>{paciente.piloto}</span>}
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Datos del Paciente</div>
          <div className="detail-grid">
            {[
              ["Cédula", paciente.cedula],
              ["Edad / Sexo", `${paciente.edad} años / ${paciente.sexo}`],
              ["Área", paciente.area],
              ["Cama", paciente.cama || "—"],
              ["Ingreso", paciente.ingreso],
              ["Alta médica", paciente.altaMedica || "—"],
            ].map(([l, v]) => (
              <div key={l} className="detail-field">
                <div className="detail-field-label">{l}</div>
                <div className="detail-field-value">{v}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="divider" />

        <div className="detail-section">
          <div className="detail-section-title">Cobertura & Seguro</div>
          <div style={{ padding: "10px 12px", background: "var(--bg2)", borderRadius: 7, marginBottom: 10 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: a.color, marginBottom: 4 }}>{a.name}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
              {[
                ["Póliza", paciente.poliza],
                ["Cobertura", `${paciente.cobertura}%`],
                ["Copago", `$${paciente.copago}`],
                ["Monto est.", `$${paciente.monto.toLocaleString()}`],
              ].map(([l, v]) => (
                <div key={l}>
                  <div style={{ fontSize: 9, color: "var(--text3)" }}>{l}</div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text)", fontFamily: "var(--mono)" }}>{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="divider" />

        <div className="detail-section">
          <div className="detail-section-title">Diagnóstico</div>
          <div style={{ padding: "8px 10px", background: "var(--bg2)", borderRadius: 6, fontSize: 12, color: "var(--text)", fontFamily: "var(--mono)" }}>
            {paciente.diagnostico}
          </div>
        </div>

        <div className="divider" />

        <div className="detail-section">
          <div className="detail-section-title">Tiempos del Proceso</div>
          {[
            { l: "Validación elegibilidad", v: paciente.tiempos.elegibilidad ? `${paciente.tiempos.elegibilidad} seg` : "—", ok: paciente.tiempos.elegibilidad <= 30 },
            { l: "Preautorización", v: paciente.tiempos.preautorizacion ? `${paciente.tiempos.preautorizacion} seg` : "—", ok: paciente.tiempos.preautorizacion <= 60 },
            { l: "Admisión", v: paciente.tiempos.admision ? `${paciente.tiempos.admision} min` : "—", ok: paciente.tiempos.admision <= 10 },
          ].map(({ l, v, ok }) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ fontSize: 11, color: "var(--text3)" }}>{l}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: v === "—" ? "var(--text3)" : ok ? "var(--green)" : "var(--red)", fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {paciente.alertas.length > 0 && (
          <>
            <div className="divider" />
            <div className="detail-section">
              <div className="detail-section-title">Alertas Activas</div>
              {paciente.alertas.map((a, i) => (
                <div key={i} style={{ padding: "8px 10px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", borderRadius: 6, fontSize: 11, color: "var(--amber)", marginBottom: 4 }}>
                  ⚠ {a}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="divider" />
        <div style={{ display: "flex", gap: 8 }}>
          <button className="btn btn-teal" style={{ flex: 1, fontSize: 11, padding: "7px 10px" }}><Icon name="file" size={12} /> Ver Cuenta Completa</button>
          <button className="btn btn-ghost" style={{ fontSize: 11, padding: "7px 10px" }}><Icon name="msg" size={12} /></button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────

const Login = ({ onLogin }) => {
  const [user, setUser] = useState("diego.acevedo@atomicahealth.com");
  const [pass, setPass] = useState("••••••••");
  const [role, setRole] = useState("supervisor");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(role); }, 1200);
  };

  return (
    <div className="login-screen">
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
        {[...Array(12)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            width: Math.random() * 200 + 50, height: Math.random() * 200 + 50,
            borderRadius: "50%", border: "1px solid rgba(11,187,212,0.06)",
            left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`,
            transform: "translate(-50%,-50%)"
          }} />
        ))}
      </div>
      <div className="login-card fade-in">
        <div className="login-logo">
          <div className="login-logo-icon">CF</div>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", letterSpacing: -0.5 }}>CareFlow</div>
            <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>Hospiten Paitilla · v1.0 Enterprise</div>
          </div>
        </div>

        <div style={{ fontSize: 11, color: "var(--text3)", marginBottom: 20, padding: "8px 12px", background: "rgba(11,187,212,0.06)", borderRadius: 6, border: "1px solid rgba(11,187,212,0.15)", lineHeight: 1.5 }}>
          🔒 Acceso restringido · Proyecto bajo NDA · Atomica Health × Hospiten Paitilla
        </div>

        <div className="input-group">
          <label className="input-label">Correo corporativo</label>
          <input className="input-field" value={user} onChange={e => setUser(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Contraseña</label>
          <input className="input-field" type="password" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        <div className="input-group">
          <label className="input-label">Rol de acceso</label>
          <select className="select-field" value={role} onChange={e => setRole(e.target.value)}>
            <option value="supervisor">Supervisor Operativo — Hospital</option>
            <option value="admision">Admisión — Hospiten Paitilla</option>
            <option value="facturacion">Facturación / Cuentas por Cobrar</option>
            <option value="ejecutivo">Ejecutivo / Dirección</option>
            <option value="admin">Administrador CareFlow</option>
          </select>
        </div>

        <button className="btn btn-teal" style={{ width: "100%", justifyContent: "center", marginTop: 4, padding: "10px 0", fontSize: 13 }} onClick={handleLogin} disabled={loading}>
          {loading ? <span className="shimmer">Autenticando…</span> : <><Icon name="zap" size={14} /> Ingresar al Sistema</>}
        </button>

        <div style={{ marginTop: 16, fontSize: 10, color: "var(--text3)", textAlign: "center", lineHeight: 1.6 }}>
          MFA simulado · Auditoría de acceso activa · HIPAA-ready architecture<br />
          <span style={{ color: "var(--amber)" }}>Prototipo — Marzo 2026 · Datos de demo</span>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────

export default function CareFlowApp() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("supervisor");
  const [activeView, setActiveView] = useState("dashboard");
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const navItems = [
    { id: "dashboard", label: "Torre de Control", icon: "home", badge: null },
    { id: "urgencias", label: "Urgencias", icon: "activity", badge: "6" },
    { id: "alta-egreso", label: "Alta & Egreso", icon: "zap", badge: "2", badgeColor: "amber" },
    { id: "reclamos", label: "Reclamos", icon: "file", badge: null },
    { id: "whatsapp", label: "Concierge WhatsApp", icon: "msg", badge: null },
    { id: "integraciones", label: "Integraciones", icon: "link", badge: null },
    { id: "alertas", label: "Centro de Alertas", icon: "bell", badge: "3" },
    { id: "piloto-minseg", label: "Piloto MINSEG", icon: "shield", badge: null, badgeColor: "teal" },
    { id: "auditoria", label: "Auditoría", icon: "eye", badge: null },
  ];

  const roleLabels = {
    supervisor: "Supervisor Operativo",
    admision: "Admisión",
    facturacion: "Facturación",
    ejecutivo: "Dirección",
    admin: "Admin CareFlow"
  };

  const viewTitles = {
    dashboard: "Torre de Control",
    urgencias: "Flujo de Urgencias",
    "alta-egreso": "Alta & Egreso",
    reclamos: "Reclamos",
    whatsapp: "Concierge WhatsApp",
    integraciones: "Integraciones",
    alertas: "Centro de Alertas",
    "piloto-minseg": "Piloto MINSEG",
    auditoria: "Auditoría",
  };

  if (!loggedIn) return (
    <>
      <style>{css}</style>
      <Login onLogin={(role) => { setUserRole(role); setLoggedIn(true); }} />
    </>
  );

  const renderView = () => {
    const props = { onSelectPaciente: setSelectedPaciente };
    switch (activeView) {
      case "dashboard": return <Dashboard {...props} />;
      case "urgencias": return <Urgencias {...props} />;
      case "alta-egreso": return <AltaEgreso {...props} />;
      case "reclamos": return <Reclamos />;
      case "whatsapp": return <WhatsAppConcierge />;
      case "integraciones": return <Integraciones />;
      case "alertas": return <Alertas />;
      case "piloto-minseg": return <PilotoMINSEG />;
      case "auditoria": return <Auditoria />;
      default: return <Dashboard {...props} />;
    }
  };

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* SIDEBAR */}
        <div className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-mark">
              <div className="logo-icon">CF</div>
              <div>
                <div className="logo-text">CareFlow</div>
                <div className="logo-sub">Hospiten Paitilla</div>
              </div>
            </div>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-label">Operaciones</div>
            {navItems.slice(0, 4).map(item => (
              <div key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => { setActiveView(item.id); setSelectedPaciente(null); }}>
                <Icon name={item.icon} size={14} />
                {item.label}
                {item.badge && <span className={`nav-badge ${item.badgeColor || ""}`}>{item.badge}</span>}
              </div>
            ))}

            <div className="sidebar-label" style={{ marginTop: 8 }}>Canales & Datos</div>
            {navItems.slice(4, 7).map(item => (
              <div key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => { setActiveView(item.id); setSelectedPaciente(null); }}>
                <Icon name={item.icon} size={14} />
                {item.label}
                {item.badge && <span className={`nav-badge ${item.badgeColor || ""}`}>{item.badge}</span>}
              </div>
            ))}

            <div className="sidebar-label" style={{ marginTop: 8 }}>Pilotos</div>
            {navItems.slice(7).map(item => (
              <div key={item.id} className={`nav-item ${activeView === item.id ? "active" : ""}`} onClick={() => { setActiveView(item.id); setSelectedPaciente(null); }}>
                <Icon name={item.icon} size={14} />
                {item.label}
              </div>
            ))}
          </div>

          <div className="sidebar-bottom">
            <div style={{ padding: "6px 8px", marginBottom: 6, display: "flex", gap: 6, alignItems: "center", fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
              <span className="pulse-dot" />
              <span>Sistema operativo · {time.getHours()}:{String(time.getMinutes()).padStart(2, "0")}</span>
            </div>
            <div className="user-card">
              <div className="user-avatar">DA</div>
              <div className="user-info">
                <div className="user-name">Diego Acevedo</div>
                <div className="user-role">{roleLabels[userRole]}</div>
              </div>
            </div>
            <div className="nav-item" onClick={() => setLoggedIn(false)} style={{ marginTop: 4 }}>
              <Icon name="logout" size={14} /> Cerrar sesión
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="main" style={{ marginRight: selectedPaciente ? 440 : 0, transition: "margin-right 0.25s" }}>
          <div className="topbar">
            <div className="topbar-title">{viewTitles[activeView]}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 10, color: "var(--text3)", fontFamily: "var(--mono)" }}>
                Lun 9 Mar 2026
              </div>
              <div style={{ padding: "4px 10px", background: "rgba(11,187,212,0.1)", border: "1px solid rgba(11,187,212,0.2)", borderRadius: 20, fontSize: 10, color: "var(--teal)", display: "flex", alignItems: "center", gap: 5 }}>
                <span className="pulse-dot" />
                Demo Activa
              </div>
              <div style={{ padding: "4px 10px", background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 20, fontSize: 10, color: "var(--amber)" }}>
                Pre-NDA Phase
              </div>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => setActiveView("alertas")}>
                <Icon name="bell" size={16} color="var(--text2)" />
                <span style={{ position: "absolute", top: -4, right: -4, width: 12, height: 12, background: "var(--red)", borderRadius: "50%", fontSize: 8, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: "white" }}>3</span>
              </div>
            </div>
          </div>
          <div className="content">
            {renderView()}
          </div>
        </div>

        {/* PATIENT DETAIL */}
        {selectedPaciente && (
          <PatientDetail paciente={selectedPaciente} onClose={() => setSelectedPaciente(null)} />
        )}
      </div>
    </>
  );
}
