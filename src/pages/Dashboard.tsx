import Button from "@components/ui/button";

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">Dzisiejsze wydatki</h3>
          <p className="text-2xl font-bold text-green-600">45 zł</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">W tym tygodniu</h3>
          <p className="text-2xl font-bold text-yellow-600">320 zł</p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">W tym miesiącu</h3>
          <p className="text-2xl font-bold text-red-600">1250 zł</p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ostatnie wydatki</h3>
          <Button>Dodaj wydatek</Button>
        </div>
        <ul className="space-y-2">
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt1.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Biedronka</p>
              <p className="text-sm text-gray-500">12.04.2025 – 85 zł</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt2.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Orlen</p>
              <p className="text-sm text-gray-500">11.04.2025 – 150 zł</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt3.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Lidl</p>
              <p className="text-sm text-gray-500">10.04.2025 – 60 zł</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt4.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Allegro</p>
              <p className="text-sm text-gray-500">09.04.2025 – 245 zł</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt5.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Żabka</p>
              <p className="text-sm text-gray-500">09.04.2025 – 23 zł</p>
            </div>
          </li>
          <li className="flex items-center gap-4">
            <img
              src="/path/to/receipt6.jpg"
              alt="Paragon"
              className="w-12 h-12 object-cover rounded"
            />
            <div>
              <p className="font-medium">Media Expert</p>
              <p className="text-sm text-gray-500">08.04.2025 – 1199 zł</p>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
