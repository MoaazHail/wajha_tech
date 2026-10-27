import Header from "../_components/header";
import { ProjectsManager } from "./_components/projects-manager";

export default function Page() {
  return (
    <div className="grid gap-6">
      <Header title="المشاريع" />
      <ProjectsManager />
    </div>
  );
}
