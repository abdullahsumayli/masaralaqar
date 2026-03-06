// Masar AI Dashboard JavaScript

const API_BASE = "";

// Load Stats
async function loadStats() {
  try {
    const response = await fetch(`${API_BASE}/api/stats`);
    const result = await response.json();
    const data = result.data || {};

    document.getElementById("total-leads").textContent = data.leads || 0;
    document.getElementById("total-properties").textContent =
      data.properties || 0;
    document.getElementById("total-sessions").textContent = data.sessions || 0;
  } catch (error) {
    console.error("Error loading stats:", error);
    document.getElementById("total-leads").textContent = "!";
    document.getElementById("total-properties").textContent = "!";
    document.getElementById("total-sessions").textContent = "!";
  }
}

// Load Leads
async function loadLeads() {
  const tbody = document.getElementById("leads-table");
  tbody.innerHTML =
    '<tr><td colspan="7" class="loading">جاري التحميل...</td></tr>';

  try {
    const response = await fetch(`${API_BASE}/api/leads`);
    const result = await response.json();
    const leads = result.data || [];

    if (leads.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="empty-state">
            <div class="icon">📭</div>
            <div>لا يوجد عملاء محتملين حتى الآن</div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = leads
      .map((lead) => {
        const phone = lead.phone || "-";
        const cleanPhone = phone.replace(/[^0-9]/g, "");
        const purposeBadge =
          lead.purpose === "buy"
            ? '<span class="badge badge-buy">شراء</span>'
            : lead.purpose === "rent"
              ? '<span class="badge badge-rent">إيجار</span>'
              : lead.purpose || "-";

        const date = lead.created_at
          ? new Date(lead.created_at).toLocaleDateString("ar-SA")
          : "-";

        return `
        <tr>
          <td>${phone}</td>
          <td>${lead.city || "-"}</td>
          <td>${lead.property_type || "-"}</td>
          <td>${purposeBadge}</td>
          <td>${lead.budget || "-"}</td>
          <td>${date}</td>
          <td>
            <a href="https://wa.me/${cleanPhone}" target="_blank" class="whatsapp-btn">
              💬 واتساب
            </a>
          </td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading leads:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="empty-state">
          <div class="icon">⚠️</div>
          <div>خطأ في تحميل البيانات</div>
        </td>
      </tr>
    `;
  }
}

// Load Properties
async function loadProperties() {
  const tbody = document.getElementById("properties-table");
  tbody.innerHTML =
    '<tr><td colspan="6" class="loading">جاري التحميل...</td></tr>';

  try {
    const response = await fetch(`${API_BASE}/api/properties`);
    const result = await response.json();
    const properties = result.data || [];

    if (properties.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="empty-state">
            <div class="icon">🏠</div>
            <div>لا توجد عقارات مسجلة</div>
            <div style="margin-top: 10px; font-size: 13px;">
              شغّل <code>node seed.js</code> لإضافة عقارات تجريبية
            </div>
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = properties
      .map((property) => {
        const imageHtml = property.image
          ? `<img src="${property.image}" alt="${property.title}" class="property-image" onerror="this.src='https://via.placeholder.com/60x60?text=🏠'">`
          : '<div class="property-image" style="display:flex;align-items:center;justify-content:center;">🏠</div>';

        const linkHtml = property.link
          ? `<a href="${property.link}" target="_blank" class="property-link">عرض</a>`
          : "-";

        return `
        <tr>
          <td>${imageHtml}</td>
          <td>${property.title || "-"}</td>
          <td>${property.city || "-"}</td>
          <td>${property.property_type || "-"}</td>
          <td>${property.price || "-"}</td>
          <td>${linkHtml}</td>
        </tr>
      `;
      })
      .join("");
  } catch (error) {
    console.error("Error loading properties:", error);
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state">
          <div class="icon">⚠️</div>
          <div>خطأ في تحميل البيانات</div>
        </td>
      </tr>
    `;
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  loadStats();
  loadLeads();
  loadProperties();

  // Auto-refresh every 30 seconds
  setInterval(() => {
    loadStats();
    loadLeads();
    loadProperties();
  }, 30000);
});
