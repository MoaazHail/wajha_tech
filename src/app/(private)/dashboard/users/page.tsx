import Header from "../_components/header";
import { listClients, listPlans } from "../_lib/apis/dashboard.api";
import { UsersManager } from "./_components/users-manager";

export default async function Page() {
  const [clients, plans] = await Promise.all([listClients(), listPlans()]);

  return (
    <section className="grid grid-cols-1 gap-6">
      <Header title="العملاء" />
      <UsersManager clients={clients} plans={plans} />
    </section>
  );
}
