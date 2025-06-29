import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json()

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Access token is required' },
        { status: 400 }
      )
    }

    // Fetch user data from Google using the access token
    const userResponse = await fetch(
      `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${accessToken}`
    )

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data from Google' },
        { status: 400 }
      )
    }

    const userData = await userResponse.json()

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate JWT token or session
    // 4. Return user data and token

    // For now, return the Google user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture,
        provider: 'google'
      },
      // You would generate a proper JWT token here
      token: 'mock-jwt-token-' + Date.now()
    })

  } catch (error) {
    console.error('Google auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 