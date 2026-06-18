import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: { singular: "Usuário", plural: "Usuários" },
  auth: true,
  admin: {
    group: "Sistema",
    useAsTitle: "email",
  },
  access: {
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
    read: ({ req }) => Boolean(req.user),
  },
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nome",
    },
    {
      name: "role",
      type: "select",
      label: "Função",
      options: ["admin"],
      defaultValue: "admin",
      access: {
        update: ({ req }) => req.user?.role === "admin",
      },
    },
  ],
};
