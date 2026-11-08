export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joined: string;
  status: 'active' | 'on-leave' | 'remote';
  leaveBalance: number;
};

export const EMPLOYEES: Employee[] = [
  { id: 'e1', name: 'Aarav Mehta', role: 'Engineering Manager', department: 'Engineering', email: 'aarav.mehta@acme.co', phone: '+91 98200 11001', location: 'Mumbai', joined: 'Mar 2019', status: 'active', leaveBalance: 14 },
  { id: 'e2', name: 'Diya Nair', role: 'Product Designer', department: 'Design', email: 'diya.nair@acme.co', phone: '+91 98200 11002', location: 'Bengaluru', joined: 'Jul 2021', status: 'remote', leaveBalance: 9 },
  { id: 'e3', name: 'Kabir Singh', role: 'Backend Engineer', department: 'Engineering', email: 'kabir.singh@acme.co', phone: '+91 98200 11003', location: 'Delhi', joined: 'Jan 2022', status: 'on-leave', leaveBalance: 3 },
  { id: 'e4', name: 'Meera Iyer', role: 'HR Business Partner', department: 'People', email: 'meera.iyer@acme.co', phone: '+91 98200 11004', location: 'Chennai', joined: 'Sep 2018', status: 'active', leaveBalance: 18 },
  { id: 'e5', name: 'Rohan Das', role: 'Sales Lead', department: 'Sales', email: 'rohan.das@acme.co', phone: '+91 98200 11005', location: 'Kolkata', joined: 'May 2020', status: 'active', leaveBalance: 11 },
  { id: 'e6', name: 'Ishita Rao', role: 'QA Engineer', department: 'Engineering', email: 'ishita.rao@acme.co', phone: '+91 98200 11006', location: 'Hyderabad', joined: 'Nov 2022', status: 'remote', leaveBalance: 12 },
  { id: 'e7', name: 'Vikram Joshi', role: 'Finance Analyst', department: 'Finance', email: 'vikram.joshi@acme.co', phone: '+91 98200 11007', location: 'Pune', joined: 'Feb 2023', status: 'active', leaveBalance: 15 },
  { id: 'e8', name: 'Ananya Pillai', role: 'Marketing Manager', department: 'Marketing', email: 'ananya.pillai@acme.co', phone: '+91 98200 11008', location: 'Kochi', joined: 'Aug 2020', status: 'on-leave', leaveBalance: 6 },
  { id: 'e9', name: 'Arjun Menon', role: 'Frontend Engineer', department: 'Engineering', email: 'arjun.menon@acme.co', phone: '+91 98200 11009', location: 'Bengaluru', joined: 'Apr 2022', status: 'active', leaveBalance: 10 },
  { id: 'e10', name: 'Sneha Kulkarni', role: 'UX Researcher', department: 'Design', email: 'sneha.kulkarni@acme.co', phone: '+91 98200 11010', location: 'Pune', joined: 'Jun 2021', status: 'remote', leaveBalance: 13 },
  { id: 'e11', name: 'Aditya Verma', role: 'DevOps Engineer', department: 'Engineering', email: 'aditya.verma@acme.co', phone: '+91 98200 11011', location: 'Noida', joined: 'Oct 2019', status: 'active', leaveBalance: 16 },
  { id: 'e12', name: 'Priya Reddy', role: 'Customer Success Manager', department: 'Sales', email: 'priya.reddy@acme.co', phone: '+91 98200 11012', location: 'Hyderabad', joined: 'Dec 2020', status: 'active', leaveBalance: 8 },
  { id: 'e13', name: 'Nikhil Bhatia', role: 'Data Analyst', department: 'Finance', email: 'nikhil.bhatia@acme.co', phone: '+91 98200 11013', location: 'Gurugram', joined: 'Mar 2023', status: 'remote', leaveBalance: 14 },
  { id: 'e14', name: 'Tara Krishnan', role: 'Content Strategist', department: 'Marketing', email: 'tara.krishnan@acme.co', phone: '+91 98200 11014', location: 'Chennai', joined: 'Jul 2019', status: 'on-leave', leaveBalance: 5 },
  { id: 'e15', name: 'Siddharth Gupta', role: 'Recruiter', department: 'People', email: 'siddharth.gupta@acme.co', phone: '+91 98200 11015', location: 'Mumbai', joined: 'Jan 2024', status: 'active', leaveBalance: 12 },
];

export const getEmployee = (id?: string) => EMPLOYEES.find((e) => e.id === id);

export const initials = (name: string) =>
  name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

export const STATUS_LABEL: Record<Employee['status'], string> = {
  active: 'Active',
  'on-leave': 'On leave',
  remote: 'Remote',
};

export const STATUS_VARIANT = {
  active: 'success',
  'on-leave': 'warning',
  remote: 'info',
} as const;

export const LEAVE_TYPES = [
  { value: 'annual', label: 'Annual leave' },
  { value: 'sick', label: 'Sick leave' },
  { value: 'casual', label: 'Casual leave' },
  { value: 'unpaid', label: 'Unpaid leave' },
];
