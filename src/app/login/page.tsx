import { LoginForm } from "@/components/auth/LoginForm";

// Dépend de la configuration Firebase (variables d'environnement) résolue au
// chargement du composant client : ne pas pré-rendre statiquement au build.
export const dynamic = "force-dynamic";

export default function LoginPage() {
  return <LoginForm />;
}
