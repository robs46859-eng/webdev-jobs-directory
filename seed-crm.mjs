import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";
import mysql from "mysql2/promise";

const CSV_PATH = "/home/ubuntu/upload/Captivate_Instantly_Batch1.csv";

async function main() {
  const csvContent = readFileSync(CSV_PATH, "utf-8");
  
  // Remove BOM if present
  const cleanContent = csvContent.replace(/^\uFEFF/, "");
  
  const records = parse(cleanContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`Parsed ${records.length} records from CSV`);

  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  // Insert in batches
  const BATCH_SIZE = 50;
  let inserted = 0;

  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const values = batch.map((r) => [
      r["Email"] || "",
      r["First Name"] || null,
      r["Last Name"] || null,
      r["Company Name"] || null,
      r["Job Title"] || null,
      r["Website"] || null,
      r["Location"] || null,
      r["LinkedIn"] || null,
      r["Subject1"] || null,
      r["Body1"] || null,
      r["Subject2"] || null,
      r["Body2"] || null,
      r["Subject3"] || null,
      r["Body3"] || null,
      "new",
    ]);

    const placeholders = values.map(() => "(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").join(", ");
    const flatValues = values.flat();

    await connection.execute(
      `INSERT INTO crm_leads (email, firstName, lastName, companyName, jobTitle, website, location, linkedin, subject1, body1, subject2, body2, subject3, body3, status) VALUES ${placeholders}`,
      flatValues
    );

    inserted += batch.length;
    console.log(`Inserted ${inserted}/${records.length}`);
  }

  console.log(`Done! ${inserted} leads imported.`);
  await connection.end();
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
