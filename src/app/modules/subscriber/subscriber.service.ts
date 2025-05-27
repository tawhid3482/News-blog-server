// Subscriber.service.ts
import { Request } from "express";
import prisma from "../../../shared/prisma";

const createSubscriberIntoDB = async (req: Request) => {
  const { email } = req.body;
  const Subscriber = await prisma.subscriber.create({
    data: {
      email,
    },
  });

  return Subscriber;
};
const getAllSubscriberFromDB = async () => {
  const Subscriber = await prisma.subscriber.findMany({});
  return Subscriber;
};
const getSubscriberByEmailFromDB = async (email: string) => {
  const Subscriber = await prisma.subscriber.findMany({
    where: { email: email },
  });
  return Subscriber;
};

export const SubscriberService = {
  createSubscriberIntoDB,
  getAllSubscriberFromDB,
  getSubscriberByEmailFromDB,
};
