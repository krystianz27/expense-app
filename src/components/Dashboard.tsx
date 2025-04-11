import { useEffect, useState } from "react";
import { getUserExpenses, Expense } from "@features/expense/expenseService";
import Button from "@components/ui/button";
import { auth } from "@src/firebase/config";
import { User as FirebaseUser } from "firebase/auth";
import { groupExpenses } from "@src/features/expense/expenseUtils"; // Zaimportowanie funkcji pomocniczych

const Dashboard = () => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [groupedExpenses, setGroupedExpenses] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    thisYear: 0,
  });

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExpenses = async () => {
      if (!user) {
        setGroupedExpenses({
          today: 0,
          thisWeek: 0,
          thisMonth: 0,
          thisYear: 0,
        });
        return;
      }

      try {
        const expensesData = await getUserExpenses();
        setExpenses(expensesData);
        setGroupedExpenses(groupExpenses(expensesData));
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, [user]);

  const lastExpenses = expenses.slice(0, 10);

  return (
    <div className="p-6 space-y-6 bg-zinc-200 rounded-2xl">
      <h2 className="text-2xl font-bold">Dashboard</h2>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">Dzisiejsze wydatki</h3>
          <p className="text-2xl font-bold text-green-600">
            {groupedExpenses.today} zł
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">W tym tygodniu</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {groupedExpenses.thisWeek} zł
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow p-4">
          <h3 className="text-lg font-semibold">W tym miesiącu</h3>
          <p className="text-2xl font-bold text-red-600">
            {groupedExpenses.thisMonth} zł
          </p>
        </div>
      </section>

      <section className="bg-white rounded-2xl shadow p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Ostatnie wydatki</h3>
          <Button>Dodaj wydatek</Button>
        </div>
        <ul className="space-y-2">
          {lastExpenses.map((expense) => (
            <li key={expense.id} className="flex items-center gap-4">
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-gray-500">
                  {expense.date} – {expense.amount} zł
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default Dashboard;
