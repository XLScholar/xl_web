import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// This will serve as a fallback/initial data source
// In production, this should be populated from CV PDF extraction or manual JSON
const INITIAL_PUBLICATIONS = [
  {
    title: "Concurrent Charge Distribution and Time-Optimal Control for Unordered Single-Inductor Dual-Output Converter",
    authors: "X. Wang, H. Wang, Y. Liu, Y. Wang, B. Zhang, H. Liu, Y. Wang, and X. Liu",
    venue: "IEEE Applied Power Electronics Conference and Exposition (APEC)",
    year: "2025",
    status: "Accepted",
    type: "conference" as const,
  },
  {
    title: "A 660W, 96% Efficiency 3D Heterogeneously Integrated Digital DC/DC Power Module for Vertical Power Delivery",
    authors: "H. Wang, X. Wang, Y. Wang, and X. Liu",
    venue: "IEEE Applied Power Electronics Conference and Exposition (APEC)",
    year: "2025",
    status: "Accepted",
    type: "conference" as const,
  },
  {
    title: "A Self-Clocked and Variation-Tolerant Unified Voltage-and-Frequency Regulator for In-Order Executed Digital Loads",
    authors: "X. Wang, W. H. Ki",
    venue: "IEEE Transactions on Circuits and Systems I: Regular Papers (TCAS-I)",
    year: "2023",
    type: "journal" as const,
  },
];

export async function GET() {
  try {
    // Try to read from a JSON file if it exists (for manual updates)
    const jsonPath = path.join(process.cwd(), 'data', 'publications.json');
    
    let publications = INITIAL_PUBLICATIONS;
    
    if (fs.existsSync(jsonPath)) {
      try {
        const fileData = fs.readFileSync(jsonPath, 'utf-8');
        publications = JSON.parse(fileData);
      } catch (error) {
        console.error('Error reading publications.json:', error);
        // Fall back to initial publications
      }
    }

    return NextResponse.json({ publications });
  } catch (error) {
    console.error('Error fetching publications:', error);
    return NextResponse.json(
      { publications: INITIAL_PUBLICATIONS },
      { status: 500 }
    );
  }
}
