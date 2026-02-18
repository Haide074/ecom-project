import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { format } from 'date-fns';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6'];

export const RevenueChart = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item._id || item.date), 'MMM dd'),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                    formatter={(value) => `Rs ${value.toFixed(2)}`}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ fill: '#6366f1', r: 4 }}
                    activeDot={{ r: 6 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export const OrdersChart = ({ data }) => {
    const formattedData = data.map(item => ({
        ...item,
        date: format(new Date(item._id || item.date), 'MMM dd'),
    }));

    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    dataKey="date"
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
                <Legend />
                <Bar dataKey="orders" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export const CategoryDistributionChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
            </PieChart>
        </ResponsiveContainer>
    );
};

export const ProductPerformanceChart = ({ data }) => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                    type="number"
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                />
                <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    style={{ fontSize: '12px' }}
                    width={120}
                />
                <Tooltip
                    contentStyle={{
                        background: 'rgba(0,0,0,0.8)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: '8px',
                        color: '#fff',
                    }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#10b981" radius={[0, 8, 8, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};
