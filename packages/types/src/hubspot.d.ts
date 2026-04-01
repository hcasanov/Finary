import { z } from 'zod';
export declare const HubSpotContactPropertiesSchema: z.ZodObject<{
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    company: z.ZodOptional<z.ZodString>;
    jobtitle: z.ZodOptional<z.ZodString>;
    lifecyclestage: z.ZodOptional<z.ZodString>;
    hs_lead_status: z.ZodOptional<z.ZodString>;
    hs_object_id: z.ZodOptional<z.ZodString>;
    hubspot_owner_id: z.ZodOptional<z.ZodString>;
    finary_pipeline_started: z.ZodOptional<z.ZodString>;
    finary_age: z.ZodOptional<z.ZodString>;
    finary_financial_situation: z.ZodOptional<z.ZodString>;
    finary_investment_goals: z.ZodOptional<z.ZodString>;
    finary_risk_tolerance: z.ZodOptional<z.ZodString>;
    finary_patrimony_estimate: z.ZodOptional<z.ZodString>;
    finary_monthly_income: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    firstname?: string | undefined;
    lastname?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    company?: string | undefined;
    jobtitle?: string | undefined;
    lifecyclestage?: string | undefined;
    hs_lead_status?: string | undefined;
    hs_object_id?: string | undefined;
    hubspot_owner_id?: string | undefined;
    finary_pipeline_started?: string | undefined;
    finary_age?: string | undefined;
    finary_financial_situation?: string | undefined;
    finary_investment_goals?: string | undefined;
    finary_risk_tolerance?: string | undefined;
    finary_patrimony_estimate?: string | undefined;
    finary_monthly_income?: string | undefined;
}, {
    firstname?: string | undefined;
    lastname?: string | undefined;
    email?: string | undefined;
    phone?: string | undefined;
    company?: string | undefined;
    jobtitle?: string | undefined;
    lifecyclestage?: string | undefined;
    hs_lead_status?: string | undefined;
    hs_object_id?: string | undefined;
    hubspot_owner_id?: string | undefined;
    finary_pipeline_started?: string | undefined;
    finary_age?: string | undefined;
    finary_financial_situation?: string | undefined;
    finary_investment_goals?: string | undefined;
    finary_risk_tolerance?: string | undefined;
    finary_patrimony_estimate?: string | undefined;
    finary_monthly_income?: string | undefined;
}>;
export type HubSpotContactProperties = z.infer<typeof HubSpotContactPropertiesSchema>;
export declare const HubSpotContactSchema: z.ZodObject<{
    id: z.ZodString;
    properties: z.ZodObject<{
        firstname: z.ZodOptional<z.ZodString>;
        lastname: z.ZodOptional<z.ZodString>;
        email: z.ZodOptional<z.ZodString>;
        phone: z.ZodOptional<z.ZodString>;
        company: z.ZodOptional<z.ZodString>;
        jobtitle: z.ZodOptional<z.ZodString>;
        lifecyclestage: z.ZodOptional<z.ZodString>;
        hs_lead_status: z.ZodOptional<z.ZodString>;
        hs_object_id: z.ZodOptional<z.ZodString>;
        hubspot_owner_id: z.ZodOptional<z.ZodString>;
        finary_pipeline_started: z.ZodOptional<z.ZodString>;
        finary_age: z.ZodOptional<z.ZodString>;
        finary_financial_situation: z.ZodOptional<z.ZodString>;
        finary_investment_goals: z.ZodOptional<z.ZodString>;
        finary_risk_tolerance: z.ZodOptional<z.ZodString>;
        finary_patrimony_estimate: z.ZodOptional<z.ZodString>;
        finary_monthly_income: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        firstname?: string | undefined;
        lastname?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        jobtitle?: string | undefined;
        lifecyclestage?: string | undefined;
        hs_lead_status?: string | undefined;
        hs_object_id?: string | undefined;
        hubspot_owner_id?: string | undefined;
        finary_pipeline_started?: string | undefined;
        finary_age?: string | undefined;
        finary_financial_situation?: string | undefined;
        finary_investment_goals?: string | undefined;
        finary_risk_tolerance?: string | undefined;
        finary_patrimony_estimate?: string | undefined;
        finary_monthly_income?: string | undefined;
    }, {
        firstname?: string | undefined;
        lastname?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        jobtitle?: string | undefined;
        lifecyclestage?: string | undefined;
        hs_lead_status?: string | undefined;
        hs_object_id?: string | undefined;
        hubspot_owner_id?: string | undefined;
        finary_pipeline_started?: string | undefined;
        finary_age?: string | undefined;
        finary_financial_situation?: string | undefined;
        finary_investment_goals?: string | undefined;
        finary_risk_tolerance?: string | undefined;
        finary_patrimony_estimate?: string | undefined;
        finary_monthly_income?: string | undefined;
    }>;
    createdAt: z.ZodOptional<z.ZodString>;
    updatedAt: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: string;
    properties: {
        firstname?: string | undefined;
        lastname?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        jobtitle?: string | undefined;
        lifecyclestage?: string | undefined;
        hs_lead_status?: string | undefined;
        hs_object_id?: string | undefined;
        hubspot_owner_id?: string | undefined;
        finary_pipeline_started?: string | undefined;
        finary_age?: string | undefined;
        finary_financial_situation?: string | undefined;
        finary_investment_goals?: string | undefined;
        finary_risk_tolerance?: string | undefined;
        finary_patrimony_estimate?: string | undefined;
        finary_monthly_income?: string | undefined;
    };
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}, {
    id: string;
    properties: {
        firstname?: string | undefined;
        lastname?: string | undefined;
        email?: string | undefined;
        phone?: string | undefined;
        company?: string | undefined;
        jobtitle?: string | undefined;
        lifecyclestage?: string | undefined;
        hs_lead_status?: string | undefined;
        hs_object_id?: string | undefined;
        hubspot_owner_id?: string | undefined;
        finary_pipeline_started?: string | undefined;
        finary_age?: string | undefined;
        finary_financial_situation?: string | undefined;
        finary_investment_goals?: string | undefined;
        finary_risk_tolerance?: string | undefined;
        finary_patrimony_estimate?: string | undefined;
        finary_monthly_income?: string | undefined;
    };
    createdAt?: string | undefined;
    updatedAt?: string | undefined;
}>;
export type HubSpotContact = z.infer<typeof HubSpotContactSchema>;
/**
 * Payload sent by a HubSpot Workflow "Send webhook" action.
 * The workflow is configured to include relevant contact properties as flat fields.
 */
export declare const HubSpotWebhookBodySchema: z.ZodObject<{
    contactId: z.ZodString;
    portalId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    hubspot_owner_id: z.ZodOptional<z.ZodString>;
    finary_pipeline_started: z.ZodOptional<z.ZodString>;
}, "passthrough", z.ZodTypeAny, z.objectOutputType<{
    contactId: z.ZodString;
    portalId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    hubspot_owner_id: z.ZodOptional<z.ZodString>;
    finary_pipeline_started: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">, z.objectInputType<{
    contactId: z.ZodString;
    portalId: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
    firstname: z.ZodOptional<z.ZodString>;
    lastname: z.ZodOptional<z.ZodString>;
    hubspot_owner_id: z.ZodOptional<z.ZodString>;
    finary_pipeline_started: z.ZodOptional<z.ZodString>;
}, z.ZodTypeAny, "passthrough">>;
export type HubSpotWebhookBody = z.infer<typeof HubSpotWebhookBodySchema>;
export declare const WebhookQuerySchema: z.ZodObject<{
    isNextClient: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    isNextClient?: string | undefined;
}, {
    isNextClient?: string | undefined;
}>;
export type WebhookQuery = z.infer<typeof WebhookQuerySchema>;
export declare const HubSpotNotePropertiesSchema: z.ZodObject<{
    hs_note_body: z.ZodString;
    hs_createdate: z.ZodOptional<z.ZodString>;
    hubspot_owner_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    hs_note_body: string;
    hubspot_owner_id?: string | undefined;
    hs_createdate?: string | undefined;
}, {
    hs_note_body: string;
    hubspot_owner_id?: string | undefined;
    hs_createdate?: string | undefined;
}>;
export type HubSpotNoteProperties = z.infer<typeof HubSpotNotePropertiesSchema>;
export declare const HubSpotNoteSchema: z.ZodObject<{
    id: z.ZodString;
    properties: z.ZodObject<{
        hs_note_body: z.ZodString;
        hs_createdate: z.ZodOptional<z.ZodString>;
        hubspot_owner_id: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        hs_note_body: string;
        hubspot_owner_id?: string | undefined;
        hs_createdate?: string | undefined;
    }, {
        hs_note_body: string;
        hubspot_owner_id?: string | undefined;
        hs_createdate?: string | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    id: string;
    properties: {
        hs_note_body: string;
        hubspot_owner_id?: string | undefined;
        hs_createdate?: string | undefined;
    };
}, {
    id: string;
    properties: {
        hs_note_body: string;
        hubspot_owner_id?: string | undefined;
        hs_createdate?: string | undefined;
    };
}>;
export type HubSpotNote = z.infer<typeof HubSpotNoteSchema>;
export declare const HubSpotNotesListSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        properties: z.ZodObject<{
            hs_note_body: z.ZodString;
            hs_createdate: z.ZodOptional<z.ZodString>;
            hubspot_owner_id: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        }, {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        id: string;
        properties: {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        };
    }, {
        id: string;
        properties: {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        };
    }>, "many">;
    paging: z.ZodOptional<z.ZodObject<{
        next: z.ZodOptional<z.ZodObject<{
            after: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            after: string;
        }, {
            after: string;
        }>>;
    }, "strip", z.ZodTypeAny, {
        next?: {
            after: string;
        } | undefined;
    }, {
        next?: {
            after: string;
        } | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    results: {
        id: string;
        properties: {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        };
    }[];
    paging?: {
        next?: {
            after: string;
        } | undefined;
    } | undefined;
}, {
    results: {
        id: string;
        properties: {
            hs_note_body: string;
            hubspot_owner_id?: string | undefined;
            hs_createdate?: string | undefined;
        };
    }[];
    paging?: {
        next?: {
            after: string;
        } | undefined;
    } | undefined;
}>;
export declare const HubSpotAssociationResultSchema: z.ZodObject<{
    results: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: string;
        id: string;
    }, {
        type: string;
        id: string;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    results: {
        type: string;
        id: string;
    }[];
}, {
    results: {
        type: string;
        id: string;
    }[];
}>;
export declare const TaskPrioritySchema: z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>;
export type TaskPriority = z.infer<typeof TaskPrioritySchema>;
export declare const CreateHubSpotTaskSchema: z.ZodObject<{
    subject: z.ZodString;
    body: z.ZodOptional<z.ZodString>;
    priority: z.ZodDefault<z.ZodEnum<["LOW", "MEDIUM", "HIGH"]>>;
    dueDate: z.ZodString;
    contactId: z.ZodString;
    ownerId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    contactId: string;
    subject: string;
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: string;
    body?: string | undefined;
    ownerId?: string | undefined;
}, {
    contactId: string;
    subject: string;
    dueDate: string;
    body?: string | undefined;
    priority?: "LOW" | "MEDIUM" | "HIGH" | undefined;
    ownerId?: string | undefined;
}>;
export type CreateHubSpotTask = z.infer<typeof CreateHubSpotTaskSchema>;
//# sourceMappingURL=hubspot.d.ts.map