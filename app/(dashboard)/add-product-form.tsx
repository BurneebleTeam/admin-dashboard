'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { addProduct } from './actions';
import { DialogFooter } from '@/components/ui/dialog';

export function AddProductForm({ onSuccess }: { onSuccess?: () => void }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [needsSequenceReset, setNeedsSequenceReset] = useState(false);

  async function resetSequence() {
    try {
      const response = await fetch('/api/reset-sequence');
      const data = await response.json();

      if (data.success) {
        setError(null);
        setNeedsSequenceReset(false);
        return true;
      } else {
        setError(`Failed to reset sequence: ${data.error}`);
        return false;
      }
    } catch (err) {
      setError(`Error resetting sequence: ${err instanceof Error ? err.message : String(err)}`);
      return false;
    }
  }

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      // Log form data for debugging
      console.log('Form data being submitted:');
      for (const [key, value] of formData.entries()) {
        console.log(`${key}: ${value}`);
      }

      const result = await addProduct(formData);
      console.log('Result from addProduct:', result);

      if (result.success) {
        if (onSuccess) {
          onSuccess();
        }
        router.refresh();
      } else {
        // Check if this is a duplicate key error
        if (result.error && result.error.includes('duplicate key value')) {
          setNeedsSequenceReset(true);
        }

        setError(
          result.error ?
            (typeof result.error === 'string' ?
              result.error :
              'Validation error. Please check your inputs.') :
            'Failed to add product'
        );
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(`An unexpected error occurred: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Product name"
            required
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="status">Status</Label>
          <Select name="status" defaultValue="active">
            <SelectTrigger id="status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            name="price"
            type="text"
            pattern="^\d+(\.\d{1,2})?$"
            placeholder="0.00"
            required
            title="Enter a valid price (e.g., 99.99)"
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            placeholder="0"
            required
          />
        </div>
      </div>

      {error && (
        <div className="text-sm font-medium text-destructive">{error}</div>
      )}

      {needsSequenceReset && (
        <div className="flex items-center justify-between bg-amber-50 p-3 rounded-md border border-amber-200">
          <p className="text-sm text-amber-800">
            Database sequence needs to be reset before adding new products.
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={async () => {
              if (await resetSequence()) {
                // Try submitting the form again after reset
                const formElement = document.querySelector('form') as HTMLFormElement;
                if (formElement) formElement.requestSubmit();
              }
            }}
          >
            Reset Sequence
          </Button>
        </div>
      )}

      <DialogFooter>
        <Button type="submit" disabled={isSubmitting || needsSequenceReset}>
          {isSubmitting ? 'Adding...' : 'Add Product'}
        </Button>
      </DialogFooter>
    </form>
  );
}
