"use client";

import { useMemo, useState } from "react";

type Category = "Frutas" | "Verduras" | "Proteína" | "Cereales";

type Food = { id: string; name: string; category: Category };

type Trial = { date: string; note: string };

type TrialsMap = Record<string, Trial | undefined>;

const FOODS: Food[] = [
  ...["Manzana", "Plátano", "Melón", "Ciruela", "Papaya", "Sandía", "Pera", "Uva", "Mango", "Fresa"].map((name) => ({ id: slug(name), name, category: "Frutas" as const })),
  ...["Zanahoria", "Chayote", "Coliflor", "Calabacita", "Brócoli", "Papa", "Espinaca", "Jitomate", "Aguacate", "Pepino"].map((name) => ({ id: slug(name), name, category: "Verduras" as const })),
  ...["Res", "Pollo", "Pescado", "Puerco", "Huevo"].map((name) => ({ id: slug(name), name, category: "Proteína" as const })),
  ...["Avena", "Arroz", "Maíz", "Trigo", "Amaranto", "Cebada", "Quinoa", "Chía"].map((name) => ({ id: slug(name), name, category: "Cereales" as const })),
];

const STORAGE_KEY = "baby-food-trials-v1";

function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Home() {
  const [trials, setTrials] = useState<TrialsMap>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });

  const grouped = useMemo(() => {
    return {
      Frutas: FOODS.filter((f) => f.category === "Frutas"),
      Verduras: FOODS.filter((f) => f.category === "Verduras"),
      "Proteína": FOODS.filter((f) => f.category === "Proteína"),
      Cereales: FOODS.filter((f) => f.category === "Cereales"),
    } as const;
  }, []);

  const totalTried = Object.values(trials).filter(Boolean).length;
  const totalFoods = FOODS.length;
  const percent = Math.round((totalTried / totalFoods) * 100);

  function saveTrial(foodId: string, date: string, note: string) {
    const next: TrialsMap = { ...trials, [foodId]: { date, note } };
    setTrials(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <main>
      <h1>Baby Food Tracker</h1>
      <p className="muted">Registra cuándo se probó cada alimento y agrega notas.</p>

      <section className="progress">
        <div className="row">
          <strong>Progreso general</strong>
          <span className="badge">
            {totalTried}/{totalFoods} ({percent}%)
          </span>
        </div>
        <div className="bar" style={{ marginTop: 10 }}>
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      <section className="grid">
        {Object.entries(grouped).map(([category, items]) => {
          const triedInCategory = items.filter((f) => trials[f.id]).length;
          return (
            <article className="card" key={category}>
              <div className="row">
                <h3 style={{ margin: 0 }}>{category}</h3>
                <span className="badge">
                  {triedInCategory}/{items.length}
                </span>
              </div>

              <div style={{ marginTop: 10 }}>
                {items.map((food) => (
                  <FoodItem key={food.id} food={food} trial={trials[food.id]} onSave={saveTrial} />
                ))}
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function FoodItem({
  food,
  trial,
  onSave,
}: {
  food: Food;
  trial?: Trial;
  onSave: (foodId: string, date: string, note: string) => void;
}) {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(trial?.date ?? today);
  const [note, setNote] = useState(trial?.note ?? "");

  return (
    <div className="food-item">
      <div className="row">
        <strong>{food.name}</strong>
        {trial ? <span className="small">Probado: {trial.date}</span> : <span className="small">Pendiente</span>}
      </div>

      <label className="small">Fecha</label>
      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

      <label className="small">Nota</label>
      <textarea value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ej. Le gustó mucho, sin reacción..." />

      <div style={{ marginTop: 8 }}>
        <button className={trial ? "btn-primary" : "btn-ok"} onClick={() => onSave(food.id, date, note)}>
          {trial ? "Actualizar" : "Marcar como probado"}
        </button>
      </div>
    </div>
  );
}
