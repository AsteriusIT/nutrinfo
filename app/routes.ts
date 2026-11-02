import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // Type 1 : pages plein contenu (MDX dans content/pages)
  route("bases/assiette", "routes/bases-assiette.tsx"),
  route("nutriments/proteines/animales-vs-vegetales", "routes/proteines-animales-vegetales.tsx"),
  route("nutriments/glucides", "routes/nutriments-glucides.tsx"),
  route("nutriments/eau", "routes/nutriments-eau.tsx"),
  route("ages/enfants", "routes/ages-enfants.tsx"),
  route("ages/grossesse", "routes/ages-grossesse.tsx"),
  route("ages/seniors", "routes/ages-seniors.tsx"),
  // Pages d'index et grilles de cartes (type 2)
  route("ages", "routes/ages.tsx"),
  route("nutriments/vitamines-et-mineraux", "routes/vitamines-et-mineraux.tsx"),
  route("sources", "routes/sources.tsx"),
  route("confidentialite", "routes/confidentialite.tsx"),
  route("*", "routes/not-found.tsx"),
] satisfies RouteConfig;
