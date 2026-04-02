import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT =
  "You are an expert UK estate agent copywriter writing listings for Rightmove and Zoopla. Use British English spelling and terminology throughout. Say 'sitting room' not 'living room', 'en suite' not 'en-suite bathroom', 'garden' not 'yard', 'first floor' not 'second floor', 'wardrobe' not 'closet', 'detached' and 'semi-detached' where relevant. Write in the style of a premium UK estate agency — confident, precise, and evocative. Standard tone: warm and informative, 60–80 words. Luxury tone: aspirational and elevated, 80–100 words. Concise tone: punchy and factual, 40–50 words. Do not mention the photo. Write only the description, nothing else."

const client = new Anthropic()

export async function POST(req: NextRequest) {
  try {
    const { images, tone } = await req.json()

    if (!images?.length || !tone) {
      return NextResponse.json({ error: 'Missing images or tone' }, { status: 400 })
    }

    const imageContent = images.map((img: { image: string; mediaType: string }) => ({
      type: 'image' as const,
      source: {
        type: 'base64' as const,
        media_type: img.mediaType as 'image/jpeg' | 'image/png' | 'image/webp' | 'image/gif',
        data: img.image,
      },
    }))

    const message = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: 'user',
          content: [
            ...imageContent,
            {
              type: 'text',
              text: `Write a ${tone} tone description based on all the photos provided.`,
            },
          ],
        },
      ],
    })

    const description =
      message.content[0].type === 'text' ? message.content[0].text.trim() : ''

    return NextResponse.json({ description })
  } catch (err: unknown) {
    const e = err as { status?: number; message?: string; error?: unknown }
    console.error('Claude API error:', JSON.stringify({ status: e.status, message: e.message, error: e.error }, null, 2))
    return NextResponse.json(
      { error: 'Failed to generate description. Please try again.' },
      { status: 500 }
    )
  }
}
