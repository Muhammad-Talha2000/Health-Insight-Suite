import { db, patientsTable, appointmentsTable, consultationsTable, bedsTable, admissionsTable, labOrdersTable, prescriptionsTable, medicationsTable, invoicesTable, emergencyCasesTable } from "@workspace/db";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("Seeding database...");

  // Patients
  const patients = await db.insert(patientsTable).values([
    { mrNumber: "MR-2026-100001", firstName: "David", lastName: "Johnson", dateOfBirth: "1985-03-15", gender: "male", bloodGroup: "O+", phone: "+92-300-1234567", email: "david.johnson@email.com", address: "House 12, Block B, Gulshan, Karachi", allergies: "Penicillin", chronicConditions: "Hypertension, Type 2 Diabetes", emergencyContactName: "Mary Johnson", emergencyContactPhone: "+92-300-7654321" },
    { mrNumber: "MR-2026-100002", firstName: "Sarah", lastName: "Anderson", dateOfBirth: "1992-07-22", gender: "female", bloodGroup: "A+", phone: "+92-333-9876543", email: "sarah.anderson@email.com", address: "Flat 5, DHA Phase 4, Lahore", allergies: null, chronicConditions: "Asthma", emergencyContactName: "James Anderson", emergencyContactPhone: "+92-333-1234500" },
    { mrNumber: "MR-2026-100003", firstName: "Michael", lastName: "Brown", dateOfBirth: "1978-11-08", gender: "male", bloodGroup: "B+", phone: "+92-321-5554444", email: null, address: "G-9/2, Islamabad", allergies: "Sulfa drugs", chronicConditions: "Chronic Kidney Disease Stage 3", emergencyContactName: "Lisa Brown", emergencyContactPhone: "+92-321-6663333" },
    { mrNumber: "MR-2026-100004", firstName: "Emma", lastName: "Wilson", dateOfBirth: "1995-01-30", gender: "female", bloodGroup: "AB+", phone: "+92-345-7778888", email: "emma.w@gmail.com", address: "Cantt Area, Rawalpindi", allergies: null, chronicConditions: null, emergencyContactName: "John Wilson", emergencyContactPhone: "+92-345-0001111" },
    { mrNumber: "MR-2026-100005", firstName: "Christopher", lastName: "Davis", dateOfBirth: "1960-09-12", gender: "male", bloodGroup: "O-", phone: "+92-300-3332222", email: null, address: "Model Town, Lahore", allergies: "NSAIDs", chronicConditions: "COPD, Hypertension, Ischemic Heart Disease", emergencyContactName: "Patricia Davis", emergencyContactPhone: "+92-300-1110000" },
  ]).returning();

  console.log(`Seeded ${patients.length} patients`);

  // Beds
  const bedData = [];
  const wards = [
    { name: "General Ward A", id: 1 },
    { name: "ICU", id: 2 },
    { name: "Cardiology", id: 3 },
    { name: "Orthopedics", id: 4 },
    { name: "Maternity", id: 5 },
  ];
  for (const ward of wards) {
    const count = ward.id === 2 ? 6 : 10;
    const bedType = ward.id === 2 ? "ICU" : "general";
    for (let b = 1; b <= count; b++) {
      bedData.push({
        bedNumber: `${ward.name.slice(0, 3).toUpperCase()}-${String(b).padStart(2, "0")}`,
        ward: ward.name,
        wardId: ward.id,
        floor: ward.id <= 2 ? "Ground" : ward.id <= 4 ? "First" : "Second",
        status: b <= 3 ? "occupied" : b === 4 ? "reserved" : "available",
        bedType,
        patientId: b <= 3 ? patients[b - 1]?.id ?? null : null,
        patientName: b <= 3 ? `${patients[b-1]?.firstName} ${patients[b-1]?.lastName}` : null,
      });
    }
  }
  const beds = await db.insert(bedsTable).values(bedData).returning();
  console.log(`Seeded ${beds.length} beds`);

  // Admissions
  const today = new Date().toISOString().split("T")[0];
  const threeDaysAgo = new Date(Date.now() - 3 * 86400000).toISOString().split("T")[0];
  const admissions = await db.insert(admissionsTable).values([
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", bedId: beds[0].id, bedNumber: beds[0].bedNumber, ward: "General Ward A", admissionDate: threeDaysAgo, admittingDiagnosis: "Uncontrolled Type 2 Diabetes with Hyperglycemia", status: "active", notes: "IV insulin drip started, monitoring glucose 4-hourly" },
    { patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, doctorId: 2, doctorName: "Dr. Amna Siddiqui", bedId: beds[1].id, bedNumber: beds[1].bedNumber, ward: "General Ward A", admissionDate: today, admittingDiagnosis: "Acute Exacerbation of CKD", status: "active", notes: "Nephrology consult requested" },
    { patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, doctorId: 3, doctorName: "Dr. Tariq Hussain", bedId: beds[10].id, bedNumber: beds[10].bedNumber, ward: "Cardiology", admissionDate: new Date(Date.now() - 7 * 86400000).toISOString().split("T")[0], admittingDiagnosis: "Unstable Angina", status: "active" },
  ]).returning();
  console.log(`Seeded ${admissions.length} admissions`);

  // Appointments
  const todayISO = new Date().toISOString();
  const appointments = await db.insert(appointmentsTable).values([
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", department: "Internal Medicine", scheduledAt: new Date().toISOString(), tokenNumber: 1, visitType: "OPD", status: "in-progress", chiefComplaint: "Diabetes follow-up" },
    { patientId: patients[1].id, patientName: `${patients[1].firstName} ${patients[1].lastName}`, doctorId: 4, doctorName: "Dr. Nadia Omer", department: "Pulmonology", scheduledAt: new Date(Date.now() + 30 * 60000).toISOString(), tokenNumber: 2, visitType: "OPD", status: "waiting", chiefComplaint: "Asthma exacerbation, wheezing for 3 days" },
    { patientId: patients[3].id, patientName: `${patients[3].firstName} ${patients[3].lastName}`, doctorId: 5, doctorName: "Dr. Bilal Ahmed", department: "General Surgery", scheduledAt: new Date(Date.now() + 60 * 60000).toISOString(), tokenNumber: 3, visitType: "OPD", status: "scheduled", chiefComplaint: "Appendix pain follow-up" },
    { patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, doctorId: 2, doctorName: "Dr. Amna Siddiqui", department: "Nephrology", scheduledAt: new Date(Date.now() + 90 * 60000).toISOString(), tokenNumber: 4, visitType: "OPD", status: "scheduled", chiefComplaint: "CKD monitoring" },
  ]).returning();
  console.log(`Seeded ${appointments.length} appointments`);

  // Consultations
  const consultations = await db.insert(consultationsTable).values([
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", appointmentId: appointments[0].id, chiefComplaint: "Uncontrolled blood sugar, polyuria, polydipsia", subjective: "Patient reports increased thirst and urination for 2 weeks. Missed medications for 5 days.", objective: "BP 148/92 mmHg, HR 88 bpm, Temp 37.1°C, SpO2 98%, Wt 82kg, Ht 175cm", assessment: "Uncontrolled Type 2 Diabetes Mellitus with hypertension", plan: "Adjust insulin regimen, lifestyle counseling, nephrology referral", diagnosis: "Uncontrolled Type 2 Diabetes Mellitus", icdCode: "E11.9", bpSystolic: 148, bpDiastolic: 92, pulse: 88, temperature: 37.1, spo2: 98, weight: 82, height: 175, status: "completed" },
  ]).returning();
  console.log(`Seeded ${consultations.length} consultations`);

  // Lab Orders
  const labOrders = await db.insert(labOrdersTable).values([
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", consultationId: consultations[0].id, testName: "HbA1c", testCode: "HBA1C", category: "Biochemistry", priority: "routine", status: "completed", result: "9.8", normalRange: "4.0-5.6", unit: "%", resultNotes: "Significantly elevated. Patient non-compliant with medications." },
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", testName: "Fasting Blood Glucose", testCode: "FBS", category: "Biochemistry", priority: "urgent", status: "completed", result: "248", normalRange: "70-100", unit: "mg/dL" },
    { patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, doctorId: 2, doctorName: "Dr. Amna Siddiqui", testName: "Serum Creatinine", testCode: "CREA", category: "Biochemistry", priority: "urgent", status: "critical", result: "4.2", normalRange: "0.6-1.2", unit: "mg/dL", resultNotes: "Critical level - nephrologist notified" },
    { patientId: patients[1].id, patientName: `${patients[1].firstName} ${patients[1].lastName}`, doctorId: 4, doctorName: "Dr. Nadia Omer", testName: "Spirometry", testCode: "SPIRO", category: "Pulmonary", priority: "routine", status: "pending" },
    { patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, doctorId: 3, doctorName: "Dr. Tariq Hussain", testName: "Troponin I", testCode: "TROP", category: "Cardiac", priority: "stat", status: "completed", result: "0.08", normalRange: "<0.04", unit: "ng/mL", resultNotes: "Elevated troponin - cardiology alerted" },
  ]).returning();
  console.log(`Seeded ${labOrders.length} lab orders`);

  // Prescriptions
  await db.insert(prescriptionsTable).values([
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", consultationId: consultations[0].id, drugName: "Metformin", dosage: "1000mg", frequency: "Twice daily", duration: "30 days", route: "Oral", instructions: "Take with meals", status: "active" },
    { patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, doctorId: 1, doctorName: "Dr. Faisal Qureshi", consultationId: consultations[0].id, drugName: "Glimepiride", dosage: "4mg", frequency: "Once daily", duration: "30 days", route: "Oral", instructions: "Take before breakfast", status: "active" },
    { patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, doctorId: 3, doctorName: "Dr. Tariq Hussain", drugName: "Aspirin", dosage: "75mg", frequency: "Once daily", duration: "90 days", route: "Oral", instructions: "Take after meals", status: "active" },
    { patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, doctorId: 3, doctorName: "Dr. Tariq Hussain", drugName: "Atorvastatin", dosage: "40mg", frequency: "Once at night", duration: "90 days", route: "Oral", status: "active" },
  ]);
  console.log("Seeded prescriptions");

  // Medications
  await db.insert(medicationsTable).values([
    { genericName: "Metformin", brandName: "Glucophage", category: "Antidiabetic", dosageForms: "Tablet", strength: "500mg, 850mg, 1000mg", stockQuantity: 500, unit: "tablet", price: 12.50 },
    { genericName: "Amoxicillin", brandName: "Amoxil", category: "Antibiotic", dosageForms: "Capsule, Suspension", strength: "250mg, 500mg", stockQuantity: 350, unit: "capsule", price: 8.00 },
    { genericName: "Omeprazole", brandName: "Losec", category: "Proton Pump Inhibitor", dosageForms: "Capsule", strength: "20mg, 40mg", stockQuantity: 280, unit: "capsule", price: 15.00 },
    { genericName: "Atorvastatin", brandName: "Lipitor", category: "Statin", dosageForms: "Tablet", strength: "10mg, 20mg, 40mg, 80mg", stockQuantity: 400, unit: "tablet", price: 22.00 },
    { genericName: "Amlodipine", brandName: "Norvasc", category: "Calcium Channel Blocker", dosageForms: "Tablet", strength: "5mg, 10mg", stockQuantity: 320, unit: "tablet", price: 18.00 },
    { genericName: "Aspirin", brandName: "Disprin", category: "Antiplatelet / NSAID", dosageForms: "Tablet", strength: "75mg, 300mg", stockQuantity: 600, unit: "tablet", price: 5.00 },
    { genericName: "Insulin Glargine", brandName: "Lantus", category: "Insulin", dosageForms: "Injection", strength: "100 IU/mL", stockQuantity: 80, unit: "vial", price: 850.00 },
    { genericName: "Salbutamol", brandName: "Ventolin", category: "Bronchodilator", dosageForms: "Inhaler, Nebulizer Solution", strength: "100mcg, 2.5mg/2.5mL", stockQuantity: 120, unit: "inhaler", price: 180.00 },
  ]);
  console.log("Seeded medications");

  // Emergency Cases
  await db.insert(emergencyCasesTable).values([
    { patientName: "Joseph Moore", age: 55, gender: "male", chiefComplaint: "Severe chest pain radiating to left arm, sweating", triage: "immediate", bpSystolic: 90, bpDiastolic: 60, pulse: 110, temperature: 37.0, spo2: 92, status: "active", assignedDoctorId: 3, assignedDoctorName: "Dr. Tariq Hussain" },
    { patientName: "Rachel Green", age: 28, gender: "female", chiefComplaint: "Sudden onset severe headache, vomiting", triage: "very-urgent", bpSystolic: 180, bpDiastolic: 110, pulse: 95, temperature: 37.2, spo2: 98, status: "active" },
    { patientName: "James White", age: 42, gender: "male", chiefComplaint: "Road traffic accident, laceration left leg", triage: "urgent", pulse: 100, temperature: 37.5, spo2: 97, status: "active" },
    { patientId: patients[1].id, patientName: `${patients[1].firstName} ${patients[1].lastName}`, age: 32, gender: "female", chiefComplaint: "Severe asthma attack, difficulty breathing", triage: "very-urgent", bpSystolic: 130, bpDiastolic: 85, pulse: 120, temperature: 37.0, spo2: 88, status: "admitted", disposition: "admitted" },
  ]);
  console.log("Seeded emergency cases");

  // Invoices
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000);
  for (let d = 29; d >= 0; d--) {
    const date = new Date(Date.now() - d * 86400000);
    const count = Math.floor(Math.random() * 8) + 3;
    for (let i = 0; i < count; i++) {
      const amount = Math.floor(Math.random() * 15000) + 2000;
      const inv = {
        invoiceNumber: `INV-${date.toISOString().slice(0,10).replace(/-/g, "")}-${String(i+1).padStart(4,"0")}`,
        patientId: patients[Math.floor(Math.random() * patients.length)].id,
        patientName: `${patients[Math.floor(Math.random() * patients.length)].firstName} ${patients[0].lastName}`,
        subtotal: amount,
        discount: 0,
        tax: Math.round(amount * 0.05),
        total: amount + Math.round(amount * 0.05),
        status: "paid",
        paymentMethod: ["cash", "card", "bank transfer"][Math.floor(Math.random() * 3)],
        items: JSON.stringify([{ name: "Consultation", price: amount }]),
        paidAt: date.toISOString(),
      };
      // We need to set createdAt manually - insert with overriding
    }
  }

  // Insert a few clean invoices
  await db.insert(invoicesTable).values([
    { invoiceNumber: "INV-20260101-0001", patientId: patients[0].id, patientName: `${patients[0].firstName} ${patients[0].lastName}`, admissionId: admissions[0].id, subtotal: 45000, discount: 2000, tax: 2150, total: 45150, status: "paid", paymentMethod: "card", items: JSON.stringify([{ name: "Room charges (3 days)", price: 30000 }, { name: "Lab tests", price: 8000 }, { name: "Medications", price: 7000 }]), paidAt: new Date().toISOString() },
    { invoiceNumber: "INV-20260101-0002", patientId: patients[1].id, patientName: `${patients[1].firstName} ${patients[1].lastName}`, subtotal: 3500, discount: 0, tax: 175, total: 3675, status: "pending", items: JSON.stringify([{ name: "OPD Consultation", price: 2000 }, { name: "Spirometry", price: 1500 }]) },
    { invoiceNumber: "INV-20260101-0003", patientId: patients[4].id, patientName: `${patients[4].firstName} ${patients[4].lastName}`, admissionId: admissions[2].id, subtotal: 125000, discount: 5000, tax: 6000, total: 126000, status: "paid", paymentMethod: "bank transfer", items: JSON.stringify([{ name: "ICU charges (7 days)", price: 98000 }, { name: "Cardiac investigations", price: 22000 }, { name: "Medications", price: 5000 }]), paidAt: new Date().toISOString() },
    { invoiceNumber: "INV-20260101-0004", patientId: patients[2].id, patientName: `${patients[2].firstName} ${patients[2].lastName}`, admissionId: admissions[1].id, subtotal: 28000, discount: 0, tax: 1400, total: 29400, status: "pending", items: JSON.stringify([{ name: "Room charges (1 day)", price: 10000 }, { name: "Dialysis", price: 15000 }, { name: "Labs", price: 3000 }]) },
  ]);
  console.log("Seeded invoices");

  console.log("Seeding complete!");
}

seed().catch(console.error).finally(() => process.exit(0));
