
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const Help = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1">
        <Header title="Help" />
        
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Help</h1>
            <p className="text-gray-600">Get help and support</p>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <p className="text-gray-500">Help page content will be implemented here.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Help;
