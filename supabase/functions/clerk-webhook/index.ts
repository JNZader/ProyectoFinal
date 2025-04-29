import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js";

interface WebhookEvent {
  data: {
    id: string;
    first_name?: string;
    last_name?: string;
    image_url?: string;
    email_addresses?: Array<{
      id: string;
      email_address: string;
      verification: { status: string };
    }>;
    primary_email_address_id?: string;
    created_at: number;
    updated_at: number;
  };
  object: "event";
  type: string;
}

Deno.serve(async (req) => {
  console.log("Received webhook request:", req.method, req.url);

  // Parse the body of the request
  let bodyText: string;
  try {
    bodyText = await req.text();
    console.log("Webhook Body:", bodyText);
  } catch (error) {
    console.error("Error reading request body:", error);
    return new Response("Invalid request body", { status: 400 });
  }

  let event: WebhookEvent;
  try {
    event = JSON.parse(bodyText) as WebhookEvent;
  } catch (error) {
    console.error("Error parsing webhook body:", error);
    return new Response("Invalid webhook body format", { status: 400 });
  }

  // Log the event type for debugging
  console.log("Processing event type:", event.type);

  // Initialize Supabase client
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error("Supabase credentials missing:", { supabaseUrl, supabaseServiceKey });
    return new Response("Supabase credentials not configured", { status: 500 });
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  // Handle the event based on its type
  switch (event.type) {
    case "user.created": {
      const primaryEmail = event.data.email_addresses?.find(
        (email) => email.id === event.data.primary_email_address_id
      )?.email_address;
      if (!primaryEmail) {
        console.error("No primary email found in webhook data:", event.data);
        return new Response("No primary email provided", { status: 400 });
      }

      const nombre =
        `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim() ||
        "Usuario Desconocido";

      console.log("Inserting user:", {
        clerk_user_id: event.data.id,
        nombre,
        email: primaryEmail,
        avatar_url: event.data.image_url,
      });

      const { data: user, error } = await supabase
        .from("usuarios")
        .insert([
          {
            clerk_user_id: event.data.id,
            nombre,
            email: primaryEmail,
            rol: "CLIENTE",
            provedor_auth: "clerk",
            avatar_url: event.data.image_url,
            fecha_registro: new Date(event.data.created_at).toISOString(),
            activo: true,
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Supabase insert error:", error);
        return new Response(JSON.stringify({ error: error.message, details: error }), {
          status: 500,
        });
      }

      console.log("User created successfully:", user);
      return new Response(JSON.stringify({ user }), { status: 200 });
    }

    case "user.updated": {
      const primaryEmail = event.data.email_addresses?.find(
        (email) => email.id === event.data.primary_email_address_id
      )?.email_address;
      if (!primaryEmail) {
        console.error("No primary email found in webhook data:", event.data);
        return new Response("No primary email provided", { status: 400 });
      }

      const nombre =
        `${event.data.first_name || ""} ${event.data.last_name || ""}`.trim() ||
        "Usuario Desconocido";

      console.log("Updating user:", {
        clerk_user_id: event.data.id,
        nombre,
        email: primaryEmail,
        avatar_url: event.data.image_url,
      });

      const { data: user, error } = await supabase
        .from("usuarios")
        .update({
          nombre,
          email: primaryEmail,
          avatar_url: event.data.image_url,
          ultima_actividad: new Date(event.data.updated_at).toISOString(),
        })
        .eq("clerk_user_id", event.data.id)
        .select()
        .single();

      if (error) {
        console.error("Supabase update error:", error);
        return new Response(JSON.stringify({ error: error.message, details: error }), {
          status: 500,
        });
      }

      console.log("User updated successfully:", user);
      return new Response(JSON.stringify({ user }), { status: 200 });
    }

    default: {
      console.log("Unhandled event type:", event.type, JSON.stringify(event, null, 2));
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    }
  }
});