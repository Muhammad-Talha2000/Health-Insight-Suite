import {
  admissionsData,
  appointmentsData,
  bedsData,
  emergencyData,
  invoicesData,
  labOrdersData,
  medicationsData,
  patientsData,
  prescriptionsData,
} from "./mock-data";

type MockDataMap = {
  [key: string]: unknown;
};

const mockDataMap: MockDataMap = {
  admissions: admissionsData,
  appointments: appointmentsData,
  beds: bedsData,
  emergency: emergencyData,
  invoices: invoicesData,
  labOrders: labOrdersData,
  medications: medicationsData,
  patients: patientsData,
  prescriptions: prescriptionsData,
};

export async function mockFetch(url: string, options?: RequestInit): Promise<Response> {
  // Extract the endpoint from the URL
  const urlObj = new URL(url, window.location.origin);
  const pathname = urlObj.pathname;
  const searchParams = urlObj.searchParams;

  // Convert snake_case to camelCase
  const toCamelCase = (obj: any) => {
    if (Array.isArray(obj)) {
      return obj.map(toCamelCase);
    }
    if (obj !== null && typeof obj === "object") {
      return Object.keys(obj).reduce((result, key) => {
        const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
        result[camelKey] = toCamelCase(obj[key]);
        return result;
      }, {} as any);
    }
    return obj;
  };

  // Map common API endpoints to mock data
  if (pathname.includes("/api/admissions")) {
    const status = searchParams.get("status");
    let admissions = toCamelCase(mockDataMap.admissions);
    if (status) {
      admissions = (admissions as any[]).filter((a: any) => a.status === status);
    }
    return new Response(JSON.stringify({ admissions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/appointments/queue/today")) {
    const appointments = toCamelCase(mockDataMap.appointments);
    return new Response(JSON.stringify({ appointments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/appointments")) {
    const appointments = toCamelCase(mockDataMap.appointments);
    return new Response(JSON.stringify({ appointments }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/beds")) {
    const wardId = searchParams.get("wardId");
    let beds = toCamelCase(mockDataMap.beds);
    if (wardId) {
      beds = (beds as any[]).filter((b: any) => b.wardId === wardId || b.ward_id === wardId);
    }
    return new Response(JSON.stringify({ beds }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/emergency-cases")) {
    const emergencyCases = toCamelCase(mockDataMap.emergency);
    return new Response(JSON.stringify({ emergencyCases }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/invoices")) {
    const status = searchParams.get("status");
    let invoices = toCamelCase(mockDataMap.invoices);
    if (status) {
      invoices = (invoices as any[]).filter((i: any) => i.status === status);
    }
    return new Response(JSON.stringify({ invoices }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/lab-orders")) {
    const status = searchParams.get("status");
    let labOrders = toCamelCase(mockDataMap.labOrders);
    if (status) {
      labOrders = (labOrders as any[]).filter((l: any) => l.status === status);
    }
    return new Response(JSON.stringify({ labOrders }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/medications")) {
    // Handle search parameter
    const search = searchParams.get("search")?.toLowerCase() || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    
    let filtered = mockDataMap.medications as any[];
    if (search) {
      filtered = filtered.filter((m: any) =>
        m.generic_name.toLowerCase().includes(search) ||
        m.brand_name.toLowerCase().includes(search) ||
        m.category.toLowerCase().includes(search)
      );
    }
    
    const medications = toCamelCase(filtered.slice(0, limit));
    return new Response(JSON.stringify({ medications }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/patients")) {
    const search = searchParams.get("search")?.toLowerCase() || "";
    const limit = parseInt(searchParams.get("limit") || "50");
    
    let filtered = mockDataMap.patients as any[];
    if (search) {
      filtered = filtered.filter((p: any) =>
        p.first_name.toLowerCase().includes(search) ||
        p.last_name.toLowerCase().includes(search) ||
        p.mr_number.toLowerCase().includes(search)
      );
    }
    
    const patients = toCamelCase(filtered.slice(0, limit));
    return new Response(JSON.stringify({ patients, total: filtered.length }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/prescriptions")) {
    const prescriptions = toCamelCase(mockDataMap.prescriptions);
    return new Response(JSON.stringify({ prescriptions }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (pathname.includes("/api/dashboard/stats")) {
    return new Response(
      JSON.stringify({
        totalPatients: 156,
        activeAdmissions: 12,
        totalBeds: 32,
        availableBeds: 18,
        emergencyCasesToday: 7,
        totalRevenue: 892500,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (pathname.includes("/api/dashboard/bed-summary")) {
    return new Response(
      JSON.stringify({
        summary: [
          {
            ward: "General Ward A",
            occupied: 3,
            available: 5,
            reserved: 1,
            cleaning: 1,
          },
          {
            ward: "ICU",
            occupied: 2,
            available: 3,
            reserved: 1,
            cleaning: 0,
          },
          {
            ward: "Cardiology",
            occupied: 2,
            available: 2,
            reserved: 1,
            cleaning: 0,
          },
          {
            ward: "Orthopedics",
            occupied: 1,
            available: 3,
            reserved: 0,
            cleaning: 1,
          },
          {
            ward: "Maternity",
            occupied: 2,
            available: 2,
            reserved: 1,
            cleaning: 0,
          },
        ],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (pathname.includes("/api/dashboard/revenue-chart")) {
    return new Response(
      JSON.stringify({
        data: [
          { date: "2026-04-07", revenue: 45000, invoiceCount: 12 },
          { date: "2026-04-14", revenue: 52000, invoiceCount: 15 },
          { date: "2026-04-21", revenue: 48000, invoiceCount: 14 },
          { date: "2026-04-28", revenue: 61000, invoiceCount: 18 },
          { date: "2026-05-05", revenue: 55000, invoiceCount: 16 },
          { date: "2026-05-07", revenue: 50000, invoiceCount: 14 },
        ],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  if (pathname.includes("/api/dashboard/recent-activity")) {
    return new Response(
      JSON.stringify({
        activities: [
          {
            id: 1,
            type: "admission",
            patient: "Ahmad Hassan",
            description: "Patient admitted to General Ward A",
            timestamp: new Date(Date.now() - 2 * 60000).toISOString(),
          },
          {
            id: 2,
            type: "emergency",
            patient: "Usman Farooq",
            description: "Emergency case - Suspected STEMI",
            timestamp: new Date(Date.now() - 15 * 60000).toISOString(),
          },
          {
            id: 3,
            type: "lab_result",
            patient: "Muhammad Ali",
            description: "Serum Creatinine result - Critical",
            timestamp: new Date(Date.now() - 30 * 60000).toISOString(),
          },
          {
            id: 4,
            type: "discharge",
            patient: "Nadia Iqbal",
            description: "Patient discharged from ICU",
            timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
          },
        ],
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Fallback: try to make actual fetch if not mocked
  return fetch(url, options);
}
