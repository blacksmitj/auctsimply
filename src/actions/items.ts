"use server";

import prisma from "@/lib/prisma";
import { s3Client, SUPABASE_BUCKET } from "@/lib/supabase";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";
import { itemSchema } from "@/lib/validations";
import { z } from "zod";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export async function getItems() {
  try {
    const items = await prisma.item.findMany({
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
        _count: {
          select: { bids: true },
        },
        bids: {
          orderBy: { amount: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return JSON.parse(JSON.stringify(items));
  } catch (error) {
    console.error("Error fetching items:", error);
    return [];
  }
}

export async function getItemById(id: string) {
  try {
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { createdAt: "asc" },
        },
        bids: {
          orderBy: { amount: "desc" },
        },
      },
    });

    return JSON.parse(JSON.stringify(item));
  } catch (error) {
    console.error("Error fetching item:", error);
    return null;
  }
}

// Admin Actions
export async function createItem(data: any) {
  try {
    const validated = itemSchema.parse(data);
    const item = await prisma.item.create({
      data: {
        title: validated.title,
        description: validated.description,
        basePrice: validated.basePrice,
        images: {
          create: validated.images,
        },
      },
    });
    revalidatePath("/");
    revalidatePath("/admin/items");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Error in createItem:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

export async function updateItem(id: string, data: any) {
  try {
    const validated = itemSchema.parse(data);
    
    // 1. Get existing images to find which ones were removed
    const existingItem = await prisma.item.findUnique({
      where: { id },
      include: { images: true }
    });

    if (!existingItem) throw new Error("Item not found");

    const incomingPaths = new Set(validated.images.map(img => img.path));
    const removedImages = existingItem.images.filter(img => !incomingPaths.has(img.path));

    // 2. Delete removed images from S3
    for (const img of removedImages) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: SUPABASE_BUCKET,
          Key: img.path,
        })
      );
    }

    // 3. Update Item and replace images
    // Note: We use a transaction to ensure atomicity
    const item = await prisma.$transaction(async (tx) => {
      // Delete all current image relations
      await tx.itemImage.deleteMany({
        where: { itemId: id }
      });

      // Update item and create new image relations
      return await tx.item.update({
        where: { id },
        data: {
          title: validated.title,
          description: validated.description,
          basePrice: validated.basePrice,
          images: {
            create: validated.images,
          },
        },
      });
    });

    revalidatePath("/");
    revalidatePath(`/items/${id}`);
    revalidatePath("/admin/items");
    return { success: true, data: JSON.parse(JSON.stringify(item)) };
  } catch (error: any) {
    console.error("Error in updateItem:", error);
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message };
    }
    return { success: false, error: error.message };
  }
}

export async function deleteItem(id: string) {
  try {
    const item = await prisma.item.findUnique({ 
      where: { id },
      include: { images: true }
    });
    
    if (!item) throw new Error("Item not found");

    // Delete all images from S3
    for (const img of item.images) {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: SUPABASE_BUCKET,
          Key: img.path,
        })
      );
    }

    // Cascade delete handles ItemImage records in DB
    await prisma.item.delete({ where: { id } });
    
    revalidatePath("/");
    revalidatePath("/admin/items");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteItem:", error);
    return { success: false, error: error.message };
  }
}

export async function generateSignedUrl(fileName: string, contentType: string) {
  try {
    const filePath = `items/${Date.now()}-${fileName.replace(/\s/g, "-")}`;
    
    const command = new PutObjectCommand({
      Bucket: SUPABASE_BUCKET,
      Key: filePath,
      ContentType: contentType,
    });

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
    
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".storage.supabase.co/storage/v1/s3", ".supabase.co");
    const publicUrl = `${projectUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${filePath}`;

    return { success: true, signedUrl, publicUrl, path: filePath };
  } catch (error: any) {
    console.error("Signed URL error:", error);
    return { success: false, error: error.message };
  }
}

export async function uploadImage(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) throw new Error("No file provided");

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const fileName = `${Date.now()}-${file.name.replace(/\s/g, "-")}`;
    const filePath = `items/${fileName}`;

    await s3Client.send(
      new PutObjectCommand({
        Bucket: SUPABASE_BUCKET,
        Key: filePath,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Standard Supabase public URL is more reliable for public buckets
    const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(".storage.supabase.co/storage/v1/s3", ".supabase.co");
    const publicUrl = `${projectUrl}/storage/v1/object/public/${SUPABASE_BUCKET}/${filePath}`;

    return { success: true, url: publicUrl, path: filePath };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, error: error.message };
  }
}
