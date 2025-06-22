import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // aici ar trebui să trimiți datele către backend-ul Express sau să salvezi direct în DB
    return res.status(200).json({ message: "Comentariu adăugat (mock)!" });
  }
  res.status(405).end();
}
