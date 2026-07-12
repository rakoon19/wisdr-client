"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function ReviewButton({ lesson }) {
  const router = useRouter();

  const toggleReviewed = async () => {
    await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/dashboard/admin/manage-lessons/${lesson._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reviewed: !lesson.reviewed,
        }),
      }
    );

    router.refresh();
  };

  return (
    <Button
      size="sm"
      color={lesson.reviewed ? "success" : "warning"}
      onPress={toggleReviewed}
    >
      {lesson.reviewed ? "Reviewed" : "Review"}
    </Button>
  );
}