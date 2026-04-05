"use server";

export async function subscribe(formData: FormData) {
  const email = formData.get("EMAIL") as string;
  const firstName = formData.get("FNAME") as string;
  const lastName = formData.get("LNAME") as string;

  if (!email) {
    return { error: "Email is required." };
  }

  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_LIST_ID;
  const server = process.env.MAILCHIMP_SERVER;

  if (!apiKey || !listId || !server) {
    return { error: "Server configuration error." };
  }

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
        tags: ["community"],
      }),
    }
  );

  if (!res.ok) {
    const data = await res.json();
    if (data.title === "Member Exists") {
      return { error: "You're already subscribed!" };
    }
    return { error: "Something went wrong. Please try again." };
  }

  return { success: true };
}
