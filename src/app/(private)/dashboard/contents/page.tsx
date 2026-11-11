import Header from "../_components/header";

export default function Page() {
  return (
    <section className="grid gap-6">
      <Header title="المحتوى" />

      <p
        role="alert"
        className="rounded-lg border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-[15px] text-amber-200"
      >
        انتبه هذه الصفحه لم تكتمل
      </p>
    </section>
  );
}
