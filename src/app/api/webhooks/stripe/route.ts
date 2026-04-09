import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

const ALLOWED_PRODUCTS = new Set([
  "prod_UEi6LMy4D4L3ZY",
  "prod_UEmOVYHnBWkHHP",
  "prod_UHJqe4T7qcQgrq",
]);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "");

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "invoice.payment_succeeded") {
    const invoiceEvent = event.data.object as Stripe.Invoice;

    // Fetch full invoice with expanded line items and product details
    const invoice = await stripe.invoices.retrieve(invoiceEvent.id, {
      expand: ["lines.data.pricing.price_details.price", "lines.data.pricing.price_details.product"],
    });

    // Check if any line item matches an allowed product
    const hasAllowedProduct = invoice.lines?.data.some((line) => {
      const productId = line.pricing?.price_details?.product;
      return productId ? ALLOWED_PRODUCTS.has(productId) : false;
    });

    if (!hasAllowedProduct) {
      return NextResponse.json({ received: true });
    }

    const customer = await stripe.customers.retrieve(invoice.customer as string);
    if (customer.deleted) {
      return NextResponse.json({ received: true });
    }

    if (customer.email) {
      await sendToGhl(customer.email, customer.name || "");
    }
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    if ((session.amount_total ?? 0) > 0) {
      return NextResponse.json({ received: true });
    }

    // Fetch line items to check product
    const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
    const hasAllowedProduct = lineItems.data.some((line) => {
      const product = line.price?.product;
      const productId =
        typeof product === "string" ? product : product ? product.id : null;
      return productId ? ALLOWED_PRODUCTS.has(productId) : false;
    });

    if (!hasAllowedProduct) {
      return NextResponse.json({ received: true });
    }

    const email = session.customer_details?.email;
    const name = session.customer_details?.name;

    if (email) {
      await sendToGhl(email, name || "");
    }
  }

  return NextResponse.json({ received: true });
}

async function sendToGhl(email: string, name: string) {
  const webhookUrl = process.env.GHL_PROPFOLIO_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("GHL_PROPFOLIO_WEBHOOK_URL is not set");
    return;
  }

  const [firstName, ...rest] = name.split(" ");
  const lastName = rest.join(" ");

  await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name: firstName || "",
      last_name: lastName || "",
    }),
  });
}
