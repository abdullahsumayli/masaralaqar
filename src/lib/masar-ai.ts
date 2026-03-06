// Masar AI API Service
// Connect to the WhatsApp AI backend server

const API_BASE_URL =
  process.env.NEXT_PUBLIC_MASAR_AI_API_URL || "http://localhost:3001";

export interface MasarLead {
  id: number;
  phone: string;
  city: string | null;
  property_type: string | null;
  purpose: string | null;
  budget: string | null;
  message: string | null;
  created_at: string;
}

export interface MasarProperty {
  id: number;
  title: string;
  city: string;
  property_type: string;
  price: string;
  image: string | null;
  link: string | null;
}

export interface MasarStats {
  leads: number;
  properties: number;
  sessions: number;
}

// Fetch all leads from Masar AI
export async function getMasarLeads(): Promise<MasarLead[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/leads`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching Masar leads:", error);
    return [];
  }
}

// Fetch all properties from Masar AI
export async function getMasarProperties(): Promise<MasarProperty[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/properties`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Error fetching Masar properties:", error);
    return [];
  }
}

// Fetch stats from Masar AI
export async function getMasarStats(): Promise<MasarStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data || { leads: 0, properties: 0, sessions: 0 };
  } catch (error) {
    console.error("Error fetching Masar stats:", error);
    return { leads: 0, properties: 0, sessions: 0 };
  }
}

// Check if Masar AI server is healthy
export async function checkMasarHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
    });

    if (!response.ok) {
      return false;
    }

    const result = await response.json();
    return result.ok === true;
  } catch (error) {
    console.error("Masar AI server health check failed:", error);
    return false;
  }
}
