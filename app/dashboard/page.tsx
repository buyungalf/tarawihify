import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto w-full max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Tarawih Setlist Dashboard</h1>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Create New Setlist</h2>
            <p className="mb-4 text-gray-600">
              Generate a new Tarawih prayer setlist by selecting surahs and arranging them in order.
            </p>
            <Link 
              href="/"
              className="inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create Setlist
            </Link>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">Recent Setlists</h2>
            <p className="mb-4 text-gray-600">
              Access your recently created setlists or load from saved templates.
            </p>
            <div className="space-y-2">
              <div className="text-sm text-gray-500">No recent setlists found</div>
            </div>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">About Tarawih Prayers</h2>
            <p className="text-gray-600">
              Tarawih prayers are voluntary night prayers performed during Ramadan. 
              This tool helps imams and organizers prepare structured setlists for these prayers.
            </p>
          </div>
          
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold">How to Use</h2>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Select 8 or 20 rakaat depending on your mosque's tradition</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Pick surahs from the list and arrange them in order</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Customize with your mosque name and theme</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Download or share your setlist</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}