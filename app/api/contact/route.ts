import { NextResponse } from 'next/server';
import saveToGoogleSheets from '@/functions/saveToGoogleSheets';
import emailRegex from '@/functions/emailRegex';

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
    
    await saveToGoogleSheets({
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    });

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