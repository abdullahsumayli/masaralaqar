"use client";

import {
    checkMasarHealth,
    getMasarLeads,
    getMasarProperties,
    getMasarStats,
    type MasarLead,
    type MasarProperty,
    type MasarStats,
} from "@/lib/masar-ai";
import {
    Building2,
    CheckCircle,
    CreditCard,
    DollarSign,
    ExternalLink,
    MapPin,
    MessageCircle,
    Phone,
    RefreshCw,
    Users,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WhatsAppBotPage() {
  const [leads, setLeads] = useState<MasarLead[]>([]);
  const [properties, setProperties] = useState<MasarProperty[]>([]);
  const [stats, setStats] = useState<MasarStats>({
    leads: 0,
    properties: 0,
    sessions: 0,
  });
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [healthCheck, leadsData, propertiesData, statsData] =
        await Promise.all([
          checkMasarHealth(),
          getMasarLeads(),
          getMasarProperties(),
          getMasarStats(),
        ]);

      setIsHealthy(healthCheck);
      setLeads(leadsData);
      setProperties(propertiesData);
      setStats(statsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Error loading data:", error);
      setIsHealthy(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Auto-refresh every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatPhone = (phone: string) => {
    return phone?.replace(/[^0-9]/g, "") || "";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("ar-SA", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const getPurposeBadge = (purpose: string | null) => {
    if (purpose === "buy") {
      return (
        <span className="px-2 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          شراء
        </span>
      );
    }
    if (purpose === "rent") {
      return (
        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs">
          إيجار
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-500/20 text-gray-400 rounded-full text-xs">
        {purpose || "-"}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white font-cairo flex items-center gap-3">
            <MessageCircle className="w-7 h-7 text-green-500" />
            بوت واتساب الذكي
          </h1>
          <p className="text-gray-400 mt-1">
            إدارة العملاء والعقارات من Masar AI
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Server Status */}
          <div
            className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
              isHealthy === null
                ? "bg-gray-500/20"
                : isHealthy
                  ? "bg-green-500/20"
                  : "bg-red-500/20"
            }`}
          >
            {isHealthy === null ? (
              <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
            ) : isHealthy ? (
              <CheckCircle className="w-4 h-4 text-green-400" />
            ) : (
              <XCircle className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm ${
                isHealthy === null
                  ? "text-gray-400"
                  : isHealthy
                    ? "text-green-400"
                    : "text-red-400"
              }`}
            >
              {isHealthy === null
                ? "جاري الفحص..."
                : isHealthy
                  ? "السيرفر متصل"
                  : "السيرفر غير متصل"}
            </span>
          </div>

          <button
            onClick={loadData}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
            تحديث
          </button>
        </div>
      </div>

      {lastRefresh && (
        <p className="text-gray-500 text-sm">
          آخر تحديث: {formatDate(lastRefresh.toISOString())}
        </p>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm">العملاء المحتملين</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.leads}</p>
          <p className="text-gray-500 text-xs mt-2">من واتساب</p>
        </div>

        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm">العقارات المتاحة</h3>
          <p className="text-3xl font-bold text-white mt-1">
            {stats.properties}
          </p>
          <p className="text-gray-500 text-xs mt-2">في قاعدة البيانات</p>
        </div>

        <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-gray-400 text-sm">جلسات المحادثة</h3>
          <p className="text-3xl font-bold text-white mt-1">{stats.sessions}</p>
          <p className="text-gray-500 text-xs mt-2">محادثة نشطة</p>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#21262d]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-green-500" />
            العملاء المحتملين من واتساب
          </h2>
          <span className="text-gray-500 text-sm">{leads.length} عميل</span>
        </div>

        <div className="overflow-x-auto">
          {leads.length === 0 ? (
            <div className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">لا يوجد عملاء بعد</p>
              <p className="text-gray-500 text-sm mt-1">
                العملاء الذين يتواصلون عبر واتساب سيظهرون هنا
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#161b22]">
                <tr>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    الهاتف
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    المدينة
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    نوع العقار
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    الغرض
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    الميزانية
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    التاريخ
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    إجراء
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-[#161b22] transition-colors"
                  >
                    <td className="px-5 py-4 text-white">{lead.phone}</td>
                    <td className="px-5 py-4 text-gray-300">
                      {lead.city || "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {lead.property_type || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {getPurposeBadge(lead.purpose)}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {lead.budget || "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-sm">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-5 py-4">
                      <a
                        href={`https://wa.me/${formatPhone(lead.phone)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        واتساب
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-[#0D1117] border border-[#21262d] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-[#21262d]">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-500" />
            العقارات المتاحة
          </h2>
          <span className="text-gray-500 text-sm">
            {properties.length} عقار
          </span>
        </div>

        <div className="overflow-x-auto">
          {properties.length === 0 ? (
            <div className="text-center py-12">
              <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">لا توجد عقارات</p>
              <p className="text-gray-500 text-sm mt-1">
                أضف عقارات عبر قاعدة بيانات السيرفر
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-[#161b22]">
                <tr>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    الصورة
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    العنوان
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    المدينة
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    النوع
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    السعر
                  </th>
                  <th className="px-5 py-3 text-right text-xs font-medium text-gray-400 uppercase">
                    الرابط
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#21262d]">
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover:bg-[#161b22] transition-colors"
                  >
                    <td className="px-5 py-4">
                      {property.image ? (
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-14 h-14 rounded-lg object-cover bg-gray-800"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23666"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/></svg>';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-gray-800 flex items-center justify-center">
                          <Building2 className="w-6 h-6 text-gray-600" />
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-4 text-white font-medium">
                      {property.title}
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {property.city}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-300">
                      {property.property_type}
                    </td>
                    <td className="px-5 py-4 text-primary font-medium">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {property.price}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {property.link ? (
                        <a
                          href={property.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          عرض
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      ) : (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-green-500" />
          إعدادات الـ Webhook
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-gray-400">رابط الـ Webhook:</span>
            <code className="px-3 py-1 bg-[#0D1117] rounded-lg text-green-400 text-sm">
              POST /api/webhook/whatsapp
            </code>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-gray-400">الـ APIs المتاحة:</span>
            <code className="px-3 py-1 bg-[#0D1117] rounded-lg text-blue-400 text-sm">
              GET /api/leads | GET /api/properties | GET /api/stats
            </code>
          </div>
          <p className="text-gray-500 text-sm mt-4">
            اضبط webhook في لوحة تحكم Evolution API ليشير إلى عنوان السيرفر الخاص بك.
          </p>
        </div>
      </div>

      {/* Upgrade CTA */}
      <div className="bg-gradient-to-br from-primary/10 to-orange-600/5 border border-primary/20 rounded-2xl p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-orange-600 flex items-center justify-center">
              <CreditCard className="w-7 h-7 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ترقية نظام صقر</h3>
              <p className="text-gray-400 text-sm">
                احصل على مزايا إضافية ومحادثات غير محدودة
              </p>
            </div>
          </div>
          <Link
            href="/products/saqr#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/80 text-white rounded-xl font-bold transition-colors"
          >
            <CreditCard className="w-5 h-5" />
            عرض الباقات
          </Link>
        </div>
      </div>
    </div>
  );
}
