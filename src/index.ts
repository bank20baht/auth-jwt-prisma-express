import express, { NextFunction, Request, Response } from "express";
import { PrismaClient } from "@prisma/client"; // here

const app = express();
const prisma = new PrismaClient(); // here

// modify here
app.get("/user", async (req: Request, res: Response, next: NextFunction) => {
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
  res.json({ user: allUsers });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
