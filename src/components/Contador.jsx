// src/components/Contador.jsx

export default function Contador({ totalConcluidos = 0 }) {
  return (
    <div className="contador-container">
      <span className="contador-texto">
        Resolvidos: <strong>{totalConcluidos}</strong>
      </span>
    </div>
  );
}
