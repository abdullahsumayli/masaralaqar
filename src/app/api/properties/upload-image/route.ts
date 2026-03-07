/**
 * Property Image Upload API
 * POST /api/properties/upload-image
 */

import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const tenant_id = (formData.get("tenant_id") as string) || "default";
    const property_id = formData.get("property_id") as string;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF" },
        { status: 400 },
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB" },
        { status: 400 },
      );
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    const filename = `${timestamp}-${random}.${ext}`;

    // Create path: tenant_id/property_id/filename or tenant_id/filename
    const path = property_id
      ? `${tenant_id}/${property_id}/${filename}`
      : `${tenant_id}/${filename}`;

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("property-images")
      .upload(path, buffer, {
        contentType: file.type,
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json(
        { error: "Failed to upload image", details: uploadError.message },
        { status: 500 },
      );
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("property-images").getPublicUrl(path);

    // If property_id provided, update property images array
    if (property_id) {
      const { data: property, error: fetchError } = await supabase
        .from("properties")
        .select("images")
        .eq("id", property_id)
        .single();

      if (!fetchError && property) {
        const currentImages = Array.isArray(property.images)
          ? property.images
          : [];
        const { error: updateError } = await supabase
          .from("properties")
          .update({ images: [...currentImages, publicUrl] })
          .eq("id", property_id);

        if (updateError) {
          console.error("Failed to update property images:", updateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      url: publicUrl,
      path: uploadData.path,
    });
  } catch (error: any) {
    console.error("Image upload API error:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message },
      { status: 500 },
    );
  }
}
