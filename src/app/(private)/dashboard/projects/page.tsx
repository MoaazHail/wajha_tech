import Header from "../_components/header";
import { listClients, listPlans, listProjects } from "../_lib/apis/dashboard.api";
import { ProjectsManager } from "./_components/projects-manager";

export default async function Page() {
  const [projects, clients, plans] = await Promise.all([listProjects(), listClients(), listPlans()]);

  return (
    <div className="grid grid-cols-1 gap-6">
      <Header title="المشاريع" />
      <ProjectsManager projects={projects} clients={clients} plans={plans} />
    </div>
  );
}
