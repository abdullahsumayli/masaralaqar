"use client";

import { useAuth } from "@/hooks/useAuth";
import { Property, PropertyType } from "@/types/property";
import {
    Building2,
    Image as ImageIcon,
    Loader,
    Plus,
    Search,
    Trash2,
    Upload,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PropertyFormData {
  title: string;
  description: string;
  price: string;
  city: string;
  location: string;
  type: PropertyType;
  bedrooms: string;
  bathrooms: string;
  area: string;
}

const initialFormData: PropertyFormData = {
  title: "",
  description: "",
  price: "",
  city: "الرياض",
  location: "",
  type: "apartment",
  bedrooms: "",
  bathrooms: "",
  area: "",
};

const cities = ["الرياض", "جدة", "الدمام", "الخبر", "مكة", "المدينة"];
const propertyTypes: { value: PropertyType; label: string }[] = [
  { value: "apartment", label: "شقة" },
  { value: "villa", label: "فيلا" },
  { value: "land", label: "أرض" },
  { value: "commercial", label: "تجاري" },
];

export default function PropertiesPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>(initialFormData);
  const [submitting, setSubmitting] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/properties/list");
      const data = await response.json();
      if (data.success) {
        setProperties(data.properties);
      }
    } catch (error) {
      console.error("Failed to fetch properties:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("tenant_id", "default");

      try {
        const response = await fetch("/api/properties/upload-image", {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (data.success && data.url) {
          uploadedUrls.push(data.url);
        }
      } catch (error) {
        console.error("Failed to upload image:", error);
      }
    }

    setSelectedImages([...selectedImages, ...uploadedUrls]);
    setUploadingImage(false);
  };

  const removeImage = (index: number) => {
    setSelectedImages(selectedImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price, 10),
        city: formData.city,
        location: formData.location || formData.city,
        type: formData.type,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms, 10) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms, 10) : null,
        area: formData.area ? parseFloat(formData.area) : null,
        images: selectedImages,
        tenant_id: "default",
      };

      const response = await fetch("/api/properties/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setFormData(initialFormData);
        setSelectedImages([]);
        setShowForm(false);
        fetchProperties();
      } else {
        alert("فشل في إضافة العقار: " + (data.error || "خطأ غير معروف"));
      }
    } catch (error) {
      console.error("Failed to create property:", error);
      alert("حدث خطأ أثناء إضافة العقار");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا العقار؟")) return;

    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchProperties();
      }
    } catch (error) {
      console.error("Failed to delete property:", error);
    }
  };

  const filteredProperties = properties.filter(
    (p) =>
      p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getTypeLabel = (type: string) => {
    return propertyTypes.find((t) => t.value === type)?.label || type;
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">إدارة العقارات</h1>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus className="w-5 h-5" />
            إضافة عقار
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6 relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="ابحث عن عقار..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Properties Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : filteredProperties.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Building2 className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">لا توجد عقارات</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 text-blue-600 hover:underline"
            >
              أضف أول عقار
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className="bg-white rounded-lg shadow-sm border overflow-hidden hover:shadow-md transition"
              >
                {/* Image */}
                <div className="h-48 bg-gray-100 relative">
                  {property.images && property.images.length > 0 ? (
                    <img
                      src={property.images[0]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : property.image_url ? (
                    <img
                      src={property.image_url}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-gray-300" />
                    </div>
                  )}
                  <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {getTypeLabel(property.type)}
                  </span>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-lg text-gray-900 mb-2">
                    {property.title}
                  </h3>
                  <p className="text-gray-500 text-sm mb-2">
                    📍 {property.city || property.location}
                  </p>
                  <p className="text-blue-600 font-bold text-lg mb-3">
                    💰 {property.price?.toLocaleString()} ريال
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                    {property.bedrooms && (
                      <span>🛏️ {property.bedrooms} غرف</span>
                    )}
                    {property.bathrooms && (
                      <span>🚿 {property.bathrooms} حمام</span>
                    )}
                    {property.area && <span>📐 {property.area} م²</span>}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="flex-1 flex items-center justify-center gap-1 text-red-600 border border-red-200 py-2 rounded hover:bg-red-50 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Add Property Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold">إضافة عقار جديد</h2>
              <button
                onClick={() => {
                  setShowForm(false);
                  setFormData(initialFormData);
                  setSelectedImages([]);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  عنوان العقار *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: شقة فاخرة للبيع"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الوصف
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="وصف تفصيلي للعقار..."
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  السعر (ريال) *
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="800000"
                />
              </div>

              {/* City and Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المدينة *
                  </label>
                  <select
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    نوع العقار *
                  </label>
                  <select
                    required
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        type: e.target.value as PropertyType,
                      })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {propertyTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  الموقع / الحي
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="مثال: حي النرجس"
                />
              </div>

              {/* Bedrooms, Bathrooms, Area */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    غرف النوم
                  </label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bedrooms: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الحمامات
                  </label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) =>
                      setFormData({ ...formData, bathrooms: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    المساحة (م²)
                  </label>
                  <input
                    type="number"
                    value={formData.area}
                    onChange={(e) =>
                      setFormData({ ...formData, area: e.target.value })
                    }
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="200"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  صور العقار
                </label>
                <div className="border-2 border-dashed rounded-lg p-4">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploadingImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {uploadingImage ? (
                      <Loader className="w-8 h-8 animate-spin text-blue-600 mb-2" />
                    ) : (
                      <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    )}
                    <span className="text-gray-500">
                      {uploadingImage ? "جاري الرفع..." : "اضغط لرفع الصور"}
                    </span>
                  </label>
                </div>

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4 grid grid-cols-4 gap-2">
                    {selectedImages.map((url, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={url}
                          alt={`Image ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      جاري الإضافة...
                    </>
                  ) : (
                    <>
                      <Plus className="w-5 h-5" />
                      إضافة العقار
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
