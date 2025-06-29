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

    // Fetch user data from Facebook using the access token
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    )

    if (!userResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch user data from Facebook' },
        { status: 400 }
      )
    }

    const userData = await userResponse.json()

    // Here you would typically:
    // 1. Check if user exists in your database
    // 2. Create user if they don't exist
    // 3. Generate JWT token or session
    // 4. Return user data and token

    // For now, return the Facebook user data
    return NextResponse.json({
      success: true,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        picture: userData.picture?.data?.url,
        provider: 'facebook'
      },
      // You would generate a proper JWT token here
      token: 'mock-jwt-token-' + Date.now()
    })

  } catch (error) {
    console.error('Facebook auth error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 