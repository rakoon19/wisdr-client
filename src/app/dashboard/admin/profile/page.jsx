import Image from "next/image";
import { serverAction } from "@/lib/serverAction";
import EditProfileForm from "./EditProfileForm";

const AdminProfilePage = async () => {
  const admin = await serverAction(
    "/dashboard/admin/profile?email=admin@gmail.com"
  );

  return (
    <div className="max-w-3xl mx-auto p-6">

      <div className="rounded-xl border p-6">

        <div className="flex items-center gap-6">

          <Image
            src={admin.image}
            alt={admin.name}
            width={100}
            height={100}
            className="rounded-full"
          />

          <div>

            <h1 className="text-3xl font-bold">
              {admin.name}
            </h1>

            <p className="text-gray-500">
              {admin.email}
            </p>

            <span className="mt-2 inline-block rounded bg-red-600 px-3 py-1 text-sm text-white">
              {admin.role}
            </span>

          </div>

        </div>

      </div>

      <EditProfileForm admin={admin} />

    </div>
  );
};

export default AdminProfilePage;