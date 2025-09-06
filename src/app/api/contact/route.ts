import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required').max(200, 'Subject must be less than 200 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000, 'Message must be less than 2000 characters'),
  category: z.enum(['general', 'account', 'payment', 'technical', 'seller', 'buyer', 'report'])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validatedData = contactSchema.parse(body)
    
    // In a real application, you would:
    // 1. Save the contact form submission to a database
    // 2. Send an email notification to support team
    // 3. Send a confirmation email to the user
    // 4. Create a support ticket in your system
    
    // For now, we'll just log the submission and return success
    console.log('Contact form submission:', {
      ...validatedData,
      timestamp: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    })
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return NextResponse.json(
      { 
        message: 'Thank you for your message! We will get back to you within 24 hours.',
        success: true 
      },
      { status: 200 }
    )
    
  } catch (error) {
    console.error('Contact form error:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          message: 'Invalid form data',
          errors: error.issues,
          success: false 
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        message: 'An error occurred while processing your request. Please try again.',
        success: false 
      },
      { status: 500 }
    )
  }
}
