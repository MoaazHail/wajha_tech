import Header from "../_components/header";
import { getSettings } from "../_lib/apis/dashboard.api";
import { SettingsForm } from "./_components/settings-form";

export default async function Page() {
  const settings = await getSettings();

  return (
    <section className="grid grid-cols-1 gap-6">
      <Header title="الإعدادات" />
      <div className="flex justify-center items-center">
        <SettingsForm settings={settings} />
      </div>
    </section>
  );
}
