import { NextResponse } from "next/server";
import { Resend } from "resend";
import { createServiceClient } from "@/lib/supabase";

function getResend() {
  return new Resend(process.env.RESEND_API_KEY);
}

interface ContactPayload {
  fullName: string;
  email: string;
  phone?: string;
  projectType?: string;
  budget?: string;
  message?: string;
}

export async function POST(request: Request) {
  try {
    const body: ContactPayload = await request.json();

    // Validate required fields
    if (!body.fullName?.trim() || !body.email?.trim()) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Write to Supabase
    const supabase = createServiceClient();
    const { error: dbError } = await supabase.from("enquiry_submissions").insert({
      full_name: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone?.trim() || null,
      project_type: body.projectType || null,
      budget: body.budget || null,
      message: body.message?.trim() || null,
      source: "holding-page",
    });

    if (dbError) {
      console.error("Supabase insert error:", dbError);
      return NextResponse.json(
        { error: "Failed to save enquiry" },
        { status: 500 }
      );
    }

    // Send email notification
    const recipients = (process.env.NOTIFICATION_EMAILS || "")
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (recipients.length > 0) {
      const timestamp = new Date().toLocaleString("en-GB", {
        timeZone: "Europe/London",
      });

      await getResend().emails.send({
        from: "noreply@beach-events.co.uk",
        to: recipients,
        subject: `New enquiry from ${body.fullName.trim()}`,
        text: `New project enquiry from the Beach Events holding page.

Name: ${body.fullName.trim()}
Email: ${body.email.trim()}
Phone: ${body.phone?.trim() || "Not provided"}
Project type: ${body.projectType || "Not specified"}
Budget: ${body.budget || "Not specified"}
Message: ${body.message?.trim() || "No message"}

Submitted: ${timestamp}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
