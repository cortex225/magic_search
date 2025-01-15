import { db } from "@/app/db";
import { productsTable } from "@/app/db/schema";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import BackButton from "@/components/BackButton";
import Image from "next/image";
import { Check, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

// Génération des paramètres statiques (optionnel, pour SSG)
export async function generateStaticParams() {
  const products = await db.select().from(productsTable);

  return products.map((product) => ({
    productId: product.id,
  }));
}

// Composant de page
export default async function Page({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const paramsData = await params;
  const { productId } = paramsData;

  // Vérification de la présence de `productId`
  if (!productId) {
    return notFound();
  }

  // Récupération du produit depuis la base de données
  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, productId));

  // Si le produit n'existe pas, retourner une page 404
  if (!product) {
    return notFound();
  }

  // Affichage de la page du produit
  return (
    <div className="py-8 pb-8 px-12 divide-y divide-zinc-100 bg-white shadow-md rounded-b-md">
      {/* Section supérieure */}
      <div>
        <BackButton />

        {/* Nom du produit */}
        <div className="mt-4">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {product.name}
          </h1>
        </div>

        {/* Image du produit */}
        <div className="aspect-square my-6 border border-border w-52 h-52">
          <div className="relative bg-zinc-100 w-full h-full overflow-hidden rounded-xl">
            <Image
              fill
              loading="eager"
              className="h-full w-full object-cover object-center"
              src={`/${product.imageId}`}
              alt={`Image of ${product.name}`}
              priority // Priorise le chargement de l'image
            />
          </div>
        </div>

        {/* Prix et description */}
        <div className="mt-4">
          <div className="flex items-center">
            <p className="font-medium text-gray-900">
              ${product.price.toFixed(2)}
            </p>
          </div>

          <div className="mt-4 space-y-6">
            <p className="text-base max-w-prose text-muted-foreground">
              {product.description}
            </p>
          </div>

          {/* Livraison express */}
          <div className="mt-6 flex items-center">
            <Check className="h-5 w-5 flex-shrink-0 text-green-500" />
            <p className="ml-2 text-sm text-muted-foreground">
              Eligible for express delivery
            </p>
          </div>
        </div>
      </div>

      {/* Section inférieure */}
      <div className="mt-6">
        {/* Bouton "Ajouter au panier" */}
        <Button className="w-full mt-10">Add to cart</Button>

        {/* Garantie de retour */}
        <div className="mt-6 text-center">
          <div className="inline-flex text-sm text-medium">
            <Shield className="mr-2 h-5 w-5 flex-shrink-0 text-gray-400" />
            <span className="text-muted-foreground hover:text-gray-700">
              30 Day Return Guarantee
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}