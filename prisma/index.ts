/*
Generate one instance of the Prisma client for the entire application to use
import prisma from "@/prisma"
*/

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;
