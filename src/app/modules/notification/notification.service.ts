// Notification.service.ts
import prisma from "../../../shared/prisma";

const getAllNotificationFromDB = async () => {
  const notifications = await prisma.notification.findMany({
    orderBy: {
      createdAt: 'desc',  // latest first
    },
    take: 3, // last 3 notifications
  });
  return notifications;
};


export const NotificationService = {
  getAllNotificationFromDB,
};
