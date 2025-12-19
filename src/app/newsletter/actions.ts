
"use server";

import { z } from "zod";
import { getDb } from "@/lib/firebase-admin";

const emailSchema = z.string().email();

export async function subscribeToNewsletter(email: string) {
  const parsedEmail = emailSchema.safeParse(email);

  if (!parsedEmail.success) {
    return {
      success: false,
      message: "Invalid email address.",
    };
  }

  try {
    const firestore = await getDb();
    const snapshot = await firestore
      .collection("newsletter_signups")
      .where("email", "==", parsedEmail.data)
      .get();

    if (!snapshot.empty) {
      return {
        success: false,
        message: "This email is already subscribed.",
      };
    }

    await firestore.collection("newsletter_signups").add({
      email: parsedEmail.data,
      subscribedAt: new Date(),
    });
    return {
      success: true,
      message: "Thanks for subscribing!",
    };
  } catch (error) {
    console.error("Error subscribing to newsletter:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
