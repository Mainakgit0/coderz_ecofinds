import { z } from 'zod'
import { Category } from '@prisma/client'

export const signupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const updateProfileSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters').optional(),
  avatarUrl: z.string().url('Invalid avatar URL').optional(),
})

export const productSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(1000, 'Description must be less than 1000 characters'),
  category: z.nativeEnum(Category),
  price: z.number().positive('Price must be positive'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  brand: z.string().max(50, 'Brand must be less than 50 characters').optional(),
  condition: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).default('Good'),
  size: z.string().max(20, 'Size must be less than 20 characters').optional(),
  color: z.string().max(30, 'Color must be less than 30 characters').optional(),
  material: z.string().max(50, 'Material must be less than 50 characters').optional(),
  yearPurchased: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  location: z.string().max(50, 'Location must be less than 50 characters').optional(),
  weight: z.string().max(20, 'Weight must be less than 20 characters').optional(),
  dimensions: z.string().max(50, 'Dimensions must be less than 50 characters').optional(),
})

export const updateProductSchema = productSchema.partial()

export const cartItemSchema = z.object({
  productId: z.string().cuid('Invalid product ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').default(1),
})

export const searchSchema = z.object({
  q: z.string().optional(),
  category: z.enum(['CLOTHING', 'ELECTRONICS', 'FURNITURE', 'BOOKS', 'ACCESSORIES', 'OTHER']).optional(),
  sort: z.enum(['newest', 'oldest', 'price_low', 'price_high']).default('newest'),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(50).default(12),
})

export type SignupInput = z.infer<typeof signupSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ProductInput = z.infer<typeof productSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CartItemInput = z.infer<typeof cartItemSchema>
export type SearchInput = z.infer<typeof searchSchema>
