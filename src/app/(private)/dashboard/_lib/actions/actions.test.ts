import { describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  createClient: vi.fn(),
  updateClient: vi.fn(),
  deleteClient: vi.fn(),
  createPlan: vi.fn(),
  updatePlan: vi.fn(),
  deletePlan: vi.fn(),
  createProject: vi.fn(),
  updateProject: vi.fn(),
  deleteProject: vi.fn(),
  updateSettings: vi.fn(),
  uploadImage: vi.fn(),
}));

vi.mock("../apis/dashboard.api", () => api);
// The real mutation service is covered in its own test: here it just runs the write.
vi.mock("../services/mutation.service", () => ({
  runMutation: async (write: () => Promise<unknown>) => {
    await write();
    return { ok: true };
  },
}));

import { createClientAction, deleteClientAction, updateClientAction } from "./clients.action";
import { createPlanAction, deletePlanAction, updatePlanAction } from "./plans.action";
import { createProjectAction, deleteProjectAction, updateProjectAction } from "./projects.action";
import { updateSettingsAction } from "./settings.action";
import { uploadImageAction } from "./uploads.action";

const client = { name: "عيادة", phone: "+966500000001", email: "", plan: "" };
const plan = { title: "باقة", price: 100, benefits: ["a"] };
const project = {
  title: "موقع",
  description: "",
  bio_image: "",
  live: "",
  status: "done" as const,
  date: "2026-01-02",
  featured: false,
  user: "",
  plan: "",
};
const settings = {
  name: "واجهة",
  wordmark: "",
  tagline: "",
  description: "",
  phone: "",
  email: "",
  whatsapp: "",
  address: "",
  foundedYear: null,
};

describe("client actions", () => {
  it("create/update validate first and call the API with the parsed data", async () => {
    await expect(createClientAction({ ...client, name: " x " })).resolves.toEqual({ ok: true });
    expect(api.createClient).toHaveBeenCalledWith({ ...client, name: "x" });

    await expect(updateClientAction("id1", client)).resolves.toEqual({ ok: true });
    expect(api.updateClient).toHaveBeenCalledWith("id1", client);
  });

  it("returns the first validation message and never calls the API", async () => {
    await expect(createClientAction({ ...client, name: "" })).resolves.toEqual({ ok: false, error: "اسم العميل مطلوب" });
    await expect(updateClientAction("id1", { ...client, phone: "1" })).resolves.toMatchObject({ ok: false });
    expect(api.createClient).not.toHaveBeenCalled();
    expect(api.updateClient).not.toHaveBeenCalled();
  });

  it("deletes by id", async () => {
    await deleteClientAction("id9");
    expect(api.deleteClient).toHaveBeenCalledWith("id9");
  });
});

describe("plan actions", () => {
  it("create, update, delete", async () => {
    await createPlanAction(plan);
    await updatePlanAction("p1", plan);
    await deletePlanAction("p1");
    expect(api.createPlan).toHaveBeenCalledWith(plan);
    expect(api.updatePlan).toHaveBeenCalledWith("p1", plan);
    expect(api.deletePlan).toHaveBeenCalledWith("p1");
  });

  it("rejects an invalid price", async () => {
    await expect(createPlanAction({ ...plan, price: -5 })).resolves.toMatchObject({ ok: false });
    expect(api.createPlan).not.toHaveBeenCalled();
  });
});

describe("project actions", () => {
  it("create, update, delete", async () => {
    await createProjectAction(project);
    await updateProjectAction("j1", project);
    await deleteProjectAction("j1");
    expect(api.createProject).toHaveBeenCalledWith(project);
    expect(api.updateProject).toHaveBeenCalledWith("j1", project);
    expect(api.deleteProject).toHaveBeenCalledWith("j1");
  });

  it("rejects a bad date", async () => {
    await expect(createProjectAction({ ...project, date: "nope" })).resolves.toEqual({ ok: false, error: "التاريخ غير صالح" });
  });
});

describe("updateSettingsAction", () => {
  it("omits foundedYear when it is empty and sends it when set", async () => {
    await updateSettingsAction(settings);
    expect(api.updateSettings).toHaveBeenLastCalledWith(expect.not.objectContaining({ foundedYear: expect.anything() }));

    await updateSettingsAction({ ...settings, foundedYear: 2025 });
    expect(api.updateSettings).toHaveBeenLastCalledWith(expect.objectContaining({ foundedYear: 2025 }));
  });

  it("rejects invalid settings", async () => {
    await expect(updateSettingsAction({ ...settings, email: "bad" })).resolves.toMatchObject({ ok: false });
  });
});

describe("uploadImageAction", () => {
  const form = (file?: File) => {
    const data = new FormData();
    if (file) data.append("image", file);
    return data;
  };

  it("requires a file", async () => {
    await expect(uploadImageAction(form())).resolves.toEqual({ ok: false, error: "اختر صورة أولاً" });
  });

  it("rejects non-images", async () => {
    const result = await uploadImageAction(form(new File(["x"], "a.pdf", { type: "application/pdf" })));
    expect(result).toEqual({ ok: false, error: "الملف يجب أن يكون صورة" });
  });

  it("rejects files over 5 MB", async () => {
    const big = new File([new Uint8Array(5 * 1024 * 1024 + 1)], "a.png", { type: "image/png" });
    const result = await uploadImageAction(form(big));
    expect(result.ok).toBe(false);
    expect(api.uploadImage).not.toHaveBeenCalled();
  });

  it("returns the stored path for a valid image", async () => {
    api.uploadImage.mockResolvedValue({ path: "/images/1.png" });
    const result = await uploadImageAction(form(new File(["x"], "a.png", { type: "image/png" })));
    expect(result).toEqual({ ok: true, path: "/images/1.png" });
  });
});
