'use server';

import { deleteProductById, products, InsertProductWithoutId } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { z } from 'zod';

export async function deleteProduct(formData: FormData) {
  let id = Number(formData.get('id'));
  await deleteProductById(id);
  revalidatePath('/products');
}

export async function addProduct(formData: FormData) {
  try {
    // Parse and validate the form data
    const productData: InsertProductWithoutId = {
      imageUrl: formData.get('imageUrl') as string,
      name: formData.get('name') as string,
      status: formData.get('status') as 'active' | 'inactive' | 'archived',
      // Convert price to string to ensure it's in the correct format
      price: String(formData.get('price')),
      stock: Number(formData.get('stock')),
      availableAt: new Date()
    };

    console.log('Product data before insertion:', productData);

    // Insert into database without specifying ID
    // This will let PostgreSQL auto-assign the next ID in the sequence
    await db.insert(products).values(productData);

    // Revalidate the products page to show the new product
    revalidatePath('/products');

    return { success: true };
  } catch (error) {
    console.error('Error adding product:', error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: 'Validation error: ' + error.errors.map(e => `${e.path}: ${e.message}`).join(', ')
      };
    }

    // Check for duplicate key error
    if (error instanceof Error && error.message.includes('duplicate key value')) {
      return {
        success: false,
        error: 'duplicate key value violates unique constraint "products_pkey"'
      };
    }

    return {
      success: false,
      error: `Failed to add product: ${error instanceof Error ? error.message : String(error)}`
    };
  }
}
