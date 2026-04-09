"use server";

export async function subscribe(formData: FormData) {
  const email = formData.get("EMAIL") as string;
  const firstName = formData.get("FNAME") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const webhookUrl = process.env.GHL_COMMUNITY_WEBHOOK_URL;
  if (!webhookUrl) {
    return { error: "Server configuration error." };
  }

  const res = await fetch(webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      first_name: firstName || "",
    }),
  });

  if (!res.ok) {
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
