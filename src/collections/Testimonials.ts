import type { CollectionConfig } from "payload";
import { revalidatePath } from "next/cache";

/**
 * Patient testimonials. Drafts are enabled so a quote can be staged before it
 * goes live; the site reads only published docs. `consentGiven` is a guard rail
 * — the brief requires explicit consent + initials-only attribution.
 */
export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Depoimento", plural: "Depoimentos" },
  admin: {
    useAsTitle: "attribution",
    defaultColumns: ["attribution", "consentGiven", "_status"],
    description: "Depoimentos de pacientes. Publique apenas com consentimento e use iniciais.",
  },
  versions: { drafts: true },
  access: {
    // Public sees published only; logged-in admins see drafts too.
    read: ({ req }) => {
      if (req.user) return true;
      return { _status: { equals: "published" } };
    },
    create: ({ req }) => req.user?.role === "admin",
    update: ({ req }) => req.user?.role === "admin",
    delete: ({ req }) => req.user?.role === "admin",
  },
  hooks: {
    afterChange: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidatePath("/", "layout");
      },
    ],
    afterDelete: [
      ({ context }) => {
        if (context?.skipRevalidate) return;
        revalidatePath("/", "layout");
      },
    ],
  },
  fields: [
    {
      name: "body",
      type: "textarea",
      label: "Depoimento",
      required: true,
    },
    {
      name: "attribution",
      type: "text",
      label: "Atribuição",
      required: true,
      admin: { description: "Apenas iniciais ou primeiro nome — nunca o nome completo." },
    },
    {
      name: "consentGiven",
      type: "checkbox",
      label: "Consentimento confirmado",
      defaultValue: false,
      admin: { description: "Só publique com consentimento explícito do paciente." },
    },
    {
      name: "order",
      type: "number",
      label: "Ordem",
      defaultValue: 0,
      admin: {
        position: "sidebar",
        description: "Ordem de exibição (menor primeiro).",
      },
    },
  ],
};
