interface Employee {
  id: number;
  name: string;
  role: string;
  department: string;
}

const mockEmployees: Employee[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `员工 ${i + 1}`,
  role: `职位 ${Math.floor(i / 5) + 1}`,
  department: `部门 ${String.fromCharCode(65 + (i % 5))}`,
}));

export function EmployeePage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="overflow-x-auto rounded-lg bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                ID
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                姓名
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                职位
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
              >
                部门
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {mockEmployees.map((employee) => (
              <tr key={employee.id}>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  {employee.id}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {employee.name}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {employee.role}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                  {employee.department}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}