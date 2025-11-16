"use client";

type Recipe = {
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  video?: string;
};

export default function DishClient({ recipe }: { recipe: Recipe }) {
  return (
    <main className="min-h-screen px-4 py-6 max-w-2xl mx-auto space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">{recipe.title}</h1>
        <p className="text-sm text-muted-foreground">
          {recipe.description}
        </p>
      </header>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Bahan (Ingredients)</h2>
        <ul className="list-disc list-inside space-y-1 text-sm">
          {recipe.ingredients.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Cara Memasak (Steps)</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm">
          {recipe.steps.map((step, idx) => (
            <li key={idx}>{step}</li>
          ))}
        </ol>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Video</h2>
        {recipe.video ? (
          <div className="aspect-video w-full">
            <iframe
              className="w-full h-full rounded-xl border border-gray-800"
              src={recipe.video}
              title={`Video resep ${recipe.title}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <p className="text-xs text-muted-foreground italic">
            Video belum tersedia untuk resep ini.
          </p>
        )}
      </section>
    </main>
  );
}
