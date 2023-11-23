"use server";

import { prisma } from "./libs/prisma";

export async function getUsers() {
  return prisma.user.findMany({});
}

export async function addUser({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  return prisma.user.create({ data: { name, email } });
}

export async function removeUser(id: number) {
  return prisma.user.delete({ where: { id } });
}
