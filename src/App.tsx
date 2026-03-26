import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAppStore } from './store/appStore';

const features = [
  'TypeScript 项目结构',
  'React Router 路由管理',
  'Zustand 全局状态管理',
];

export default function App() {
  const location = useLocation();
  const count = useAppStore((state) => state.count);

  return (
    <main className="app-shell">
      <section className="hero">
        <p className="eyebrow">React + TypeScript SPA</p>
        <h1>P2P Display</h1>
        <p className="description">
          现在这个项目已经具备 TypeScript、路由和全局状态管理的基础设施，可以直接开始接业务页面。
        </p>
        <div className="actions">
          <Link className="primary" to="/">
            首页
          </Link>
          <Link className="secondary" to="/dashboard">
            Dashboard
          </Link>
        </div>
      </section>

      <section className="card">
        <div className="card-header">
          <h2>应用状态</h2>
          <span className="badge">当前路由: {location.pathname}</span>
        </div>
        <p className="status-text">全局计数器当前值: {count}</p>
        <ul>
          {features.map((feature) => (
            <li key={feature}>{feature}</li>
          ))}
        </ul>
      </section>

      <Outlet />
    </main>
  );
}
