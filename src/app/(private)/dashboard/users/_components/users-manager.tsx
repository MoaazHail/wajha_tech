"use client";

import { useState, useTransition } from "react";

import { DataTable } from "@/shared/components/data-table";
import type { Client, Plan } from "@/shared/lib/types/api";

import { createClientAction, deleteClientAction, updateClientAction } from "../../_lib/actions/clients.action";
import type { ClientInput } from "../../_lib/schemes/client.scheme";
import type { ActionResult } from "../../_lib/types/action";
import { UserForm } from "./user-form";
import { USER_COLUMNS } from "./users-columns";

interface UsersManagerProps {
  clients: ReadonlyArray<Client>;
  plans: ReadonlyArray<Plan>;
}

/** The clients table with add, edit and delete. */
export function UsersManager({ clients, plans }: UsersManagerProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  const submit = async (data: ClientInput): Promise<ActionResult> =>
    editing ? updateClientAction(editing.id, data) : createClientAction(data);

  const remove = (row: Client) => {
    setError(null);
    startTransition(async () => {
      const result = await deleteClientAction(row.id);
      if (!result.ok) setError(result.error);
    });
  };

  return (
    <>
      {error && (
        <p role="alert" className="text-sm text-red-300">
          {error}
        </p>
      )}

      

      <DataTable
        columns={USER_COLUMNS}
        rows={clients}
        getRowId={(row) => row.id}
        addLabel="إضافة عميل"
        onAdd={() => {
          setEditing(null);
          setFormOpen(true);
        }}
        onEdit={(row) => {
          setEditing(row);
          setFormOpen(true);
        }}
        onDelete={remove}
        deleteMessage={(row) => `هل أنت متأكد من حذف «${row.name}»؟ لا يمكن التراجع عن هذا الإجراء.`}
        emptyText="لا يوجد عملاء بعد"
        theme="dark"
      />

      <UserForm
        open={formOpen}
        client={editing}
        plans={plans}
        onClose={() => setFormOpen(false)}
        onSubmit={submit}
      />
    </>
  );
}
