import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ success: false, message: 'Valid email is required.' }, { status: 400 })
    }

    // TODO: Implement actual password reset email logic here
    // For now, just simulate success
    console.log(`Password reset requested for: ${email}`)

    return NextResponse.json({ success: true, message: 'If this email exists, a reset link has been sent.' })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error.' }, { status: 500 })
  }
} 