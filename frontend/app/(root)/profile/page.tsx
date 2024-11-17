import { DeleteUserDialog } from "@/components/delete-user-dialog";
import ProfileForm from "@/components/update-profile-form";

export default function ProfilePage() {
  return (
    <div className=" flex flex-col items-center justify-start rounded-lg shadow-lg p-8 space-y-8 min-h-screen mx-auto bg-background">
      {/* Profile Header Section */}
      <div className="flex flex-col items-center space-y-3 text-center max-w-3xl ">
        <h3 className="text-3xl font-semibold">Profile</h3>
        <p className="text-sm max-w-xl">
          This is how others will see you on the site. You can update your
          profile details below.
        </p>
      </div>

      {/* Profile Form Section */}
      <div className="w-full rounded-lg shadow-md p-6 max-w-3xl dark:bg-neutral-900 bg-neutral-100">
        <div className="lg:max-w-xl mx-auto space-y-6">
          <ProfileForm />
        </div>
      </div>

      {/* Activity Section */}
      <div className="w-full rounded-lg shadow-md p-6 space-y-6 max-w-3xl dark:bg-neutral-900 bg-neutral-100">
        <h4 className="text-xl font-medium">Recent Activity</h4>
        <p className="text-sm">
          Here’s a quick look at your recent activity on the site. Stay updated
          with your interactions.
        </p>
        <div className="space-y-4 max-w-3xl">
          <div className="flex justify-between items-center">
            <div className="text-sm">Added "Book Title" to Wishlist</div>
            <span className="text-xs ">2 hours ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">Commented on "Another Book"</div>
            <span className="text-xs ">1 day ago</span>
          </div>
          <div className="flex justify-between items-center">
            <div className="text-sm">Rated "Book Title" 5 stars</div>
            <span className="text-xs ">3 days ago</span>
          </div>
        </div>
      </div>

      {/* Account Management Section */}
      <div className="w-full rounded-lg shadow-md p-6 space-y-4 dark:bg-neutral-900 bg-neutral-100 max-w-3xl">
        <div className="flex items-center justify-between">
          <h4 className="text-xl font-medium">Account Settings</h4>
          <DeleteUserDialog />
        </div>
        <p className="text-sm">
          If you wish to permanently delete your account, use the button below.
        </p>
      </div>
    </div>
  );
}
