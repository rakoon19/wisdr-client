"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";

export default function FeatureButton({ lesson }) {
  const router = useRouter();

  const toggleFeatured = async () => {
    await fetch(
      `http://localhost:5000/dashboard/admin/manage-lessons/${lesson._id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: !lesson.featured,
        }),
      }
    );

    router.refresh();
  };

  return (
    <Button
      size="sm"
      color={lesson.featured ? "success" : "primary"}
      onPress={toggleFeatured}
    >
      {lesson.featured ? "Featured" : "Feature"}
    </Button>
  );
}