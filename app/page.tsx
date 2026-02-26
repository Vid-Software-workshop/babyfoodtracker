"use client";

import { useMemo, useState } from "react";

type Category = "Frutas" | "Verduras" | "Proteína" | "Cereales";

type Food = { id: string; name: string; category: Category };

type Trial = { date: string; note: string };

type TrialsMap = Record<string, Trial | undefined>;

const VERDURAS = [
  "Zanahoria", "Chayote", "Coliflor", "Calabacita", "Brócoli", "Papa", "Acelga", "Alfalfa", "Alcachofa", "Berenjena",
  "Col", "Repollo", "Espárrago", "Espinaca", "Jitomate", "Tomate", "Aguacate", "Pepino", "Champiñón", "Jícama",
  "Chícharo", "Frijol", "Garbanzo", "Alubias", "Lentejas", "Ejotes", "Coles de Bruselas", "Puerro", "Nopal", "Taro",
  "Lechuga", "Apio", "Pimiento", "Morrón", "Rábano", "Cebolla", "Ajo", "Pimienta"
].map(n => ({ id: slug(n), name: n, category: "Verduras" as Category }));

const FRUTAS = [
  "Manzana", "Plátano", "Melón", "Ciruela", "Papaya", "Sandía", "Pera", "Uva", "Mango", "Mamey", "Zapote",
  "Arándano", "Granada", "Durazno", "Kiwi", "Guayaba", "Mandarina", "Naranja", "Toronja", "Limón", "Pitaya",
  "Tejocote", "Piña", "Cereza", "Fresas", "Guanábana", "Coco", "Mora azul", "Zarzamora", "Frambuesa"
].map(n => ({ id: slug(n), name: n, category: "Frutas" as Category }));

const PROTEINAS = [
  "Res", "Pollo", "Pescado", "Puerco", "Huevo"
].map(n => ({ id: slug(n), name: n, category: "Proteína" as Category }));

const CEREALES = [
  "Avena", "Arroz", "Maíz", "Trigo", "Amaranto", "Cebada", "Quinoa", "Ajonjolí", "Chía"
].map(n => ({ id: slug(n), name: n, category: "Cereales" as Category }));

const FOODS: Food[] = [...VERDURAS, ...FRUTAS, ...PROTEINAS, ...CEREALES];

const STORAGE_KEY = "baby-food-trials-v1";

function slug(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type View = "lista" | "calendario";
type FilterStatus = "todos" | "probados" | "pendientes";

export default function Home() {
  const [trials, setTrials] = useState<TrialsMap>(() => {
    if (typeof window === "undefined") return {};
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "{}");
    } catch {
      return {};
    }
  });

  const [view, setView] = useState<View>("lista");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("todos");
  const [filterCategory, setFilterCategory] = useState<Category | "todas">("todas");
  const [search, setSearch] = useState("");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  const filteredFoods = useMemo(() => {
    return FOODS.filter((food) => {
      const tried = !!trials[food.id];
      if (filterStatus === "probados" && !tried) return false;
      if (filterStatus === "pendientes" && tried) return false;
      if (filterCategory !== "todas" && food.category !== filterCategory) return false;
      if (search && !food.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [trials, filterStatus, filterCategory, search]);

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

  const trialsByDate = useMemo(() => {
    const map: Record<string, Food[]> = {};
    FOODS.forEach((food) => {
      const trial = trials[food.id];
      if (trial?.date) {
        if (!map[trial.date]) map[trial.date] = [];
        map[trial.date].push(food);
      }
    });
    return map;
  }, [trials]);

  function saveTrial(foodId: string, date: string, note: string) {
    const next: TrialsMap = { ...trials, [foodId]: { date, note } };
    setTrials(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  return (
    <main>
      <div className="header">
        <div>
          <h1>Baby Food Tracker</h1>
          <p className="muted">Registra cuándo se probó cada alimento y agrega notas.</p>
        </div>
        <div className="tabs">
          <button className={view === "lista" ? "tab active" : "tab"} onClick={() => setView("lista")}>
            Lista
          </button>
          <button className={view === "calendario" ? "tab active" : "tab"} onClick={() => setView("calendario")}>
            Calendario
          </button>
        </div>
      </div>

      <section className="progress">
        <div className="row">
          <strong>Progreso general</strong>
          <span className="badge">
            {totalTried}/{totalFoods} ({percent}%)
          </span>
        </div>
        <div className="bar">
          <span style={{ width: `${percent}%` }} />
        </div>
      </section>

      {view === "lista" && (
        <>
          <section className="filters">
            <div className="filter-group">
              <label>Estado:</label>
              <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}>
                <option value="todos">Todos</option>
                <option value="probados">Probados</option>
                <option value="pendientes">Pendientes</option>
              </select>
            </div>
            <div className="filter-group">
              <label>Categoría:</label>
              <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value as Category | "todas")}>
                <option value="todas">Todas</option>
                <option value="Frutas">Frutas</option>
                <option value="Verduras">Verduras</option>
                <option value="Proteína">Proteína</option>
                <option value="Cereales">Cereales</option>
              </select>
            </div>
            <div className="filter-group search">
              <input
                type="text"
                placeholder="Buscar alimento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </section>

          <p className="muted" style={{ marginTop: 16 }}>
            Mostrando {filteredFoods.length} de {FOODS.length} alimentos
          </p>

          <section className="grid">
            {Object.entries(grouped).map(([category, items]) => {
              const categoryFiltered = items.filter(f => {
                const tried = !!trials[f.id];
                if (filterStatus === "probados" && !tried) return false;
                if (filterStatus === "pendientes" && tried) return false;
                if (filterCategory !== "todas" && category !== filterCategory) return false;
                if (search && !f.name.toLowerCase().includes(search.toLowerCase())) return false;
                return true;
              });
              if (categoryFiltered.length === 0) return null;
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
                    {categoryFiltered.map((food) => (
                      <FoodItem key={food.id} food={food} trial={trials[food.id]} onSave={saveTrial} />
                    ))}
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}

      {view === "calendario" && (
        <CalendarView
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          trialsByDate={trialsByDate}
          trials={trials}
        />
      )}
    </main>
  );
}

function CalendarView({
  month,
  onMonthChange,
  trialsByDate,
  trials,
}: {
  month: Date;
  onMonthChange: (d: Date) => void;
  trialsByDate: Record<string, Food[]>;
  trials: TrialsMap;
}) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstDay = new Date(year, monthIndex, 1);
  const lastDay = new Date(year, monthIndex + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startWeekday = firstDay.getDay();

  const monthName = month.toLocaleDateString("es-MX", { month: "long", year: "numeric" });

  function prevMonth() {
    onMonthChange(new Date(year, monthIndex - 1, 1));
  }

  function nextMonth() {
    onMonthChange(new Date(year, monthIndex + 1, 1));
  }

  const selectedFoods = selectedDate ? trialsByDate[selectedDate] || [] : [];
  const selectedTrial = selectedDate
    ? FOODS.filter((f) => trials[f.id]?.date === selectedDate).map((f) => ({
        food: f,
        trial: trials[f.id],
      }))
    : [];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button onClick={prevMonth}>&lt;</button>
        <span className="month-title">{monthName}</span>
        <button onClick={nextMonth}>&gt;</button>
      </div>

      <div className="calendar-weekdays">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((d) => (
          <div key={d} className="weekday">{d}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: startWeekday }).map((_, i) => (
          <div key={`empty-${i}`} className="calendar-day empty" />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const foods = trialsByDate[dateStr] || [];
          const isSelected = selectedDate === dateStr;
          return (
            <button
              key={day}
              className={`calendar-day ${foods.length > 0 ? "has-food" : ""} ${isSelected ? "selected" : ""}`}
              onClick={() => setSelectedDate(dateStr)}
            >
              <span className="day-number">{day}</span>
              {foods.length > 0 && <span className="food-count">{foods.length}</span>}
            </button>
          );
        })}
      </div>

      {selectedDate && (
        <div className="day-details">
          <h3>Alimentos probados el {selectedDate}</h3>
          {selectedTrial.length === 0 ? (
            <p className="muted">No se registraron alimentos este día.</p>
          ) : (
            <ul className="day-foods">
              {selectedTrial.map(({ food, trial }) => (
                <li key={food.id}>
                  <strong>{food.name}</strong>
                  {trial?.note && <p className="note">{trial.note}</p>}
                </li>
              ))}
            </ul>
          )}
          <button className="btn-close" onClick={() => setSelectedDate(null)}>
            Cerrar
          </button>
        </div>
      )}
    </div>
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
