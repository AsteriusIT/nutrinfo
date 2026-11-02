import { ButtonLink } from "~/components/ui";

export const meta = () => [{ title: "Page introuvable | Asterius Nutrition" }];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-24 md:px-6">
      <h1 className="display max-w-[16ch] text-[2.5rem] md:text-6xl">Cette page n'existe pas encore</h1>
      <p className="mt-6 max-w-[56ch] text-lg">
        L'adresse est peut-être mal saisie, ou la rubrique est en préparation. Repartez de
        l'assiette : tout le site part de là.
      </p>
      <div className="mt-8">
        <ButtonLink to="/">Revenir à l'accueil</ButtonLink>
      </div>
    </div>
  );
}
