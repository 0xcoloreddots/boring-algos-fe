import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const email = session.customer_details?.email;
    const name = session.customer_details?.name;

    if (email) {
      await addToMailchimp(email, name || "");
    }
  }

  return NextResponse.json({ received: true });
}

async function addToMailchimp(email: string, name: string) {
  const apiKey = process.env.MAILCHIMP_API_KEY!;
  const listId = process.env.MAILCHIMP_LIST_ID!;
  const server = process.env.MAILCHIMP_SERVER!;

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  const res = await fetch(
    `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName || "",
          LNAME: lastName || "",
        },
        tags: ["propfolio-subscriber"],
      }),
    }
  );

  // If member already exists, update their tags
  if (!res.ok) {
    const data = await res.json();
    if (data.title === "Member Exists") {
      const subscriberHash = await md5(email.toLowerCase());
      await fetch(
        `https://${server}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}/tags`,
        {
          method: "POST",
          headers: {
            Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString("base64")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tags: [{ name: "propfolio-subscriber", status: "active" }],
          }),
        }
      );
    }
  }
}

async function md5(text: string): Promise<string> {
  const { createHash } = await import("crypto");
  return createHash("md5").update(text).digest("hex");
}
