import { NextResponse } from 'next/server';
import saveToGoogleSheets from '@/functions/saveToGoogleSheets';
import emailRegex from '@/functions/emailRegex';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    if (
      typeof name !== 'string' || !name.trim() ||
      typeof email !== 'string' || !emailRegex().test(email) ||
      typeof message !== 'string' || !message.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request. Please try again later.',
        },
        { status: 400 }
      );
    }
    
    // Save to Google Sheets (Original functionality)
    try {
      await saveToGoogleSheets({
        name: name.trim(),
        email: email.trim(),
        message: message.trim(),
      });
    } catch (e) {
      console.warn("Google Sheets Error:", e);
    }

    // Send email using Nodemailer
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${name}" <${email}>`, // Note: Some SMTPs rewrite 'from' to the auth user
        to: "infoezydrag@gmail.com",
        replyTo: email,
        subject: `New Lead: ${name} (Ezydrag AI Contact Form)`,
        text: `Name: ${name}\nEmail: ${email}\nMessage:\n${message}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1e293b;">
            <h2 style="color: #2563eb;">New Lead Received!</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Requirements/Message:</strong></p>
            <blockquote style="background: #f1f5f9; padding: 16px; border-radius: 8px; white-space: pre-wrap;">${message}</blockquote>
          </div>
        `,
      });
    } catch (e) {
      console.error("Nodemailer Error:", e);
      // We log but still return success to the user so their UX isn't broken if SMTP is misconfigured initially
    }

    return NextResponse.json({
      success: true,
      message: `Thank you, ${name}! Your message has been received. Our team will contact you at ${email} shortly.`,
    });

  } catch (error) {
    console.error('API Error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}